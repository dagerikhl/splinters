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
  await sleep(3000);

  const data = await import("./data.json");

  return NextResponse.json(data);
}
