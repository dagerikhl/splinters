import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const BASE_URL = process.env.SPLINTERS_URL ?? "http://localhost:3000";
const OUT_DIR = resolve(process.cwd(), "tmp/screenshots");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const log = (msg) => console.log(`[visual-check] ${msg}`);

const setSliderValue = async (page, value) =>
  page.evaluate((v) => {
    const slider = document.querySelector(
      'input[type="range"]',
    );

    if (!slider) throw new Error("Slider not found");

    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    ).set;

    setter.call(slider, String(v));
    slider.dispatchEvent(new Event("input", { bubbles: true }));
    slider.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);

const clickButtonByText = async (page, text) =>
  page.evaluate((t) => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const btn = buttons.find((b) => (b.textContent ?? "").trim() === t);

    if (!btn) {
      throw new Error(
        `Button with text "${t}" not found. Available: ${buttons
          .map((b) => `"${(b.textContent ?? "").trim()}"`)
          .join(", ")}`,
      );
    }

    btn.click();
  }, text);

const clickCanvas = async (page) => {
  const canvas = await page.$("canvas");

  if (!canvas) throw new Error("Canvas not found");

  const box = await canvas.boundingBox();

  if (!box) throw new Error("Canvas has no bounding box");

  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
};

const main = async () => {
  await mkdir(OUT_DIR, { recursive: true });

  log(`Launching Chromium...`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--use-gl=swiftshader", "--enable-webgl"],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  page.on("pageerror", (err) =>
    console.error(`[page error] ${err.message}\n${err.stack ?? ""}`),
  );
  page.on("requestfailed", (req) =>
    console.error(`[request fail] ${req.url()} ${req.failure()?.errorText}`),
  );
  page.on("console", (msg) => {
    const type = msg.type();
    if (type === "error" || type === "log") {
      console.error(`[page ${type}] ${msg.text()}`);
    }
  });

  log(`Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });

  log("Waiting for canvas...");
  await page.waitForSelector("canvas", { timeout: 30000 });
  await wait(6000);

  const canvasInfo = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return { found: false };
    const rect = c.getBoundingClientRect();
    const tl = document.querySelector(
      '[class*="TimelineController-module-scss"]',
    );
    const tlRect = tl?.getBoundingClientRect();
    return {
      found: true,
      width: c.width,
      height: c.height,
      rectW: rect.width,
      rectH: rect.height,
      timeline: tlRect
        ? { x: tlRect.x, y: tlRect.y, w: tlRect.width, h: tlRect.height }
        : null,
    };
  });
  log(`canvas info: ${JSON.stringify(canvasInfo)}`);

  const tlStyle = await page.evaluate(() => {
    const tl = document.querySelector(
      '[class*="TimelineController-module-scss"]',
    );
    if (!tl) return null;
    const cs = getComputedStyle(tl);
    return {
      visibility: cs.visibility,
      display: cs.display,
      opacity: cs.opacity,
      zIndex: cs.zIndex,
      bg: cs.backgroundColor,
      bgImg: cs.backgroundImage.slice(0, 80),
    };
  });
  log(`timeline style: ${JSON.stringify(tlStyle)}`);

  const htmls = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("div"));
    return all
      .filter((el) => {
        const cs = getComputedStyle(el);
        if (cs.position !== "absolute") return false;
        const r = el.getBoundingClientRect();
        return r.width > 200 && r.height > 200;
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          cls: el.className.toString().slice(0, 60),
          x: r.x,
          y: r.y,
          w: r.width,
          h: r.height,
          zi: getComputedStyle(el).zIndex,
        };
      });
  });
  log(`large absolute overlays: ${JSON.stringify(htmls)}`);

  const labelStyle = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('[class*="EntityLabel"]'));
    if (!labels.length) return null;
    const el = labels[0];
    const cs = getComputedStyle(el);
    return {
      count: labels.length,
      bg: cs.backgroundColor,
      bgImg: cs.backgroundImage.slice(0, 60),
      border: cs.border,
      padding: cs.padding,
      cls: el.className.toString(),
      txt: el.textContent?.slice(0, 30),
    };
  });
  log(`label style: ${JSON.stringify(labelStyle)}`);

  // Capture all label outer wrappers (drei Html portals) and their computed style
  const labelWrappers = await page.evaluate(() => {
    const labels = Array.from(
      document.querySelectorAll('[class*="EntityLabel"]'),
    );
    return labels.slice(0, 3).map((el) => {
      const outer = el.parentElement?.parentElement;
      if (!outer) return null;
      const cs = getComputedStyle(outer);
      const r = outer.getBoundingClientRect();
      return {
        bg: cs.backgroundColor,
        bgImg: cs.backgroundImage.slice(0, 60),
        border: cs.border,
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
      };
    });
  });
  log(`label wrappers: ${JSON.stringify(labelWrappers)}`);

  const shoot = async (name) => {
    const path = resolve(OUT_DIR, `${name}.png`);

    await page.screenshot({ path, fullPage: false });
    log(`  saved ${name}.png`);
  };

  log("Capture: 01-initial (slider at 0)");
  await shoot("01-initial");

  log("Capture: 02a-T0-burst (mid-fracture, peak burst)");
  await setSliderValue(page, 0.0833);
  await wait(150);
  await shoot("02a-T0-burst");

  log("Capture: 02-T0-fully-fractured (slider just past T0)");
  await setSliderValue(page, 0.1);
  await wait(2500);
  await shoot("02-T0-fractured");

  log("Capture: 03a-T14-burst (Honor splintering, peak)");
  await setSliderValue(page, 8 / 12);
  await wait(150);
  await shoot("03a-T14-burst");

  log("Capture: 03-mid-timeline (slider at 0.5)");
  await setSliderValue(page, 0.5);
  await wait(2500);
  await shoot("03-mid-timeline");

  log("Capture: 03b-T16-harmony (Preservation+Ruin merging)");
  await setSliderValue(page, 9 / 12);
  await wait(2500);
  await shoot("03b-T16-harmony");

  log("Capture: 04-end (slider at 1.0, Retribution should be present)");
  await setSliderValue(page, 1.0);
  await wait(2500);
  await shoot("04-end");

  log("Capture: 05-back-to-start");
  await setSliderValue(page, 0);
  await wait(2500);
  await shoot("05-back-to-start");

  log("Capture: 06-clicked-canvas (panel should show selection)");
  await clickCanvas(page);
  await wait(1000);
  await shoot("06-clicked-canvas");

  log("Capture: 06b-clicked-dawnshard (top-right gold octahedron area)");
  const canvas = await page.$("canvas");

  if (canvas) {
    const box = await canvas.boundingBox();

    if (box) {
      await page.mouse.click(box.x + box.width * 0.62, box.y + box.height * 0.55);
      await wait(800);
      await shoot("06b-clicked-dawnshard");
    }
  }

  log("Capture: 07-manual-splinter (click Splinter button)");

  try {
    await clickButtonByText(page, "Splinter");
    await wait(2500);
    await shoot("07-manual-splinter");
  } catch (err) {
    log(`  could not click Splinter: ${err.message}`);
  }

  // Close-up shot at fully-splintered state to catch face-level artifacts
  // (e.g. gray wedge holes on fragments) that full-canvas screenshots miss.
  // Settle on a splintered timeline state, find the largest visible fragment
  // on screen, then crop tightly around it for inspection.
  log("Capture: 08-shard-closeups (crop the largest visible shards)");
  try {
    await setSliderValue(page, 0.5);
    await wait(4000);

    const canvasEl = await page.$("canvas");
    const canvasBox = await canvasEl?.boundingBox();

    if (canvasBox) {
      // Crop a tight region around the four most visually present shards.
      // The slider=0.5 state has Adonalsium fully fractured but no shards yet
      // self-splintering, so fragments sit at orbit rest with full color.
      const crops = [
        { name: "08a-upper-left", xFrac: 0.05, yFrac: 0.05, wFrac: 0.4, hFrac: 0.4 },
        { name: "08b-upper-right", xFrac: 0.55, yFrac: 0.05, wFrac: 0.4, hFrac: 0.4 },
        { name: "08c-lower-left", xFrac: 0.05, yFrac: 0.5, wFrac: 0.4, hFrac: 0.4 },
        { name: "08d-lower-right", xFrac: 0.55, yFrac: 0.5, wFrac: 0.4, hFrac: 0.4 },
      ];

      for (const c of crops) {
        const cropPath = resolve(OUT_DIR, `${c.name}.png`);
        await page.screenshot({
          path: cropPath,
          clip: {
            x: canvasBox.x + canvasBox.width * c.xFrac,
            y: canvasBox.y + canvasBox.height * c.yFrac,
            width: canvasBox.width * c.wFrac,
            height: canvasBox.height * c.hFrac,
          },
        });
        log(`  saved ${c.name}.png`);
      }
    }
  } catch (err) {
    log(`  closeup failed: ${err.message}`);
  }

  log("Done.");
  await browser.close();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
