import { data } from "@/app/api/splinters/data";
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
  await sleep(300);

  return NextResponse.json(data);
}
