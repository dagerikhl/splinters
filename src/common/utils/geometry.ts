import { degToRad } from "maath/misc";
import * as THREE from "three";

const DEFAULT_ORIGIN: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

export const cardinalToCirclePoint = (
  origin = DEFAULT_ORIGIN,
  axis: "x" | "y" | "z",
  degrees: number,
): THREE.Vector3 => {
  let normalizedAxisVector: THREE.Vector3;
  switch (axis) {
    case "x":
      normalizedAxisVector = new THREE.Vector3(1, 0, 0);
      break;
    case "y":
      normalizedAxisVector = new THREE.Vector3(0, 1, 0);
      break;
    case "z":
      normalizedAxisVector = new THREE.Vector3(0, 0, 1);
      break;
  }

  return origin.applyAxisAngle(normalizedAxisVector, degToRad(degrees));
};
