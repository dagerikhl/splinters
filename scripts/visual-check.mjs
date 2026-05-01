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
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  page.on("pageerror", (err) =>
    console.error(`[page error] ${err.message}\n${err.stack ?? ""}`),
  );
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      console.error(`[page ${msg.type()}] ${msg.text()}`);
    }
  });

  log(`Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: "networkidle" });

  log("Waiting for canvas...");
  await page.waitForSelector("canvas", { timeout: 30000 });
  await wait(1500);

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

  log("Done.");
  await browser.close();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
