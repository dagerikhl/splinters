import { NextResponse } from "next/server";

// TODO Remove
const sleep = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });

export async function GET() {
  // TODO Remove
  await sleep(100);

  const data = (await import("./data.json")).default;

  return NextResponse.json(data);
}
