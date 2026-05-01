import * as THREE from "three";

const mulberry32 = (seed: number) => {
  let s = seed >>> 0;

  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const isInsideOctahedron = (p: THREE.Vector3, radius: number): boolean =>
  Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.z) <= radius;

export const generateVoronoiSeeds = (
  count: number,
  seed: number,
  radius = 2,
  minDistance = 0.55,
  maxAttempts = 4000,
): THREE.Vector3[] => {
  const rand = mulberry32(seed + 1);
  const seeds: THREE.Vector3[] = [];

  let currentMinDistance = minDistance;
  let attempts = 0;

  while (seeds.length < count && attempts < maxAttempts) {
    attempts++;

    const candidate = new THREE.Vector3(
      (rand() * 2 - 1) * radius,
      (rand() * 2 - 1) * radius,
      (rand() * 2 - 1) * radius,
    );

    if (!isInsideOctahedron(candidate, radius * 0.95)) continue;

    const tooClose = seeds.some(
      (existing) => existing.distanceTo(candidate) < currentMinDistance,
    );

    if (tooClose) continue;

    seeds.push(candidate);

    if (attempts > maxAttempts / 2 && seeds.length < count) {
      currentMinDistance *= 0.9;
    }
  }

  return seeds;
};
