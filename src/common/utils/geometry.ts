import { degToRad } from "maath/misc";
import { Vector3 } from "three";

const DEFAULT_ORIGIN: Vector3 = new Vector3(0, 0, 0);

export const cardinalToCirclePoint = (
  origin = DEFAULT_ORIGIN,
  axis: "x" | "y" | "z",
  degrees: number,
): Vector3 => {
  let normalizedAxisVector: Vector3;
  switch (axis) {
    case "x":
      normalizedAxisVector = new Vector3(1, 0, 0);
      break;
    case "y":
      normalizedAxisVector = new Vector3(0, 1, 0);
      break;
    case "z":
      normalizedAxisVector = new Vector3(0, 0, 1);
      break;
  }

  return origin.applyAxisAngle(normalizedAxisVector, degToRad(degrees));
};
