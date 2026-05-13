import { buildOctahedron } from "@/features/canvas/fracture/buildOctahedron";
import { fibonacciSphere } from "@/features/canvas/fracture/restPositions";
import { generateVoronoiSeeds } from "@/features/canvas/fracture/voronoiSeeds";
import { DestructibleMesh, FractureOptions } from "@dgreenheck/three-pinata";
import { useMemo } from "react";
import * as THREE from "three";

export interface FragmentData {
  geometry: THREE.BufferGeometry;
  homePosition: THREE.Vector3;
  restPosition: THREE.Vector3;
}

export interface FragmentSet {
  fragments: FragmentData[];
}

export interface UsePinataFragmentsOptions {
  seed: number;
  fragmentCount?: number;
  radius?: number;
  detail?: number;
  restRadius?: number;
}

export const usePinataFragments = ({
  seed,
  fragmentCount = 16,
  radius = 2,
  detail = 2,
  restRadius = 7,
}: UsePinataFragmentsOptions): FragmentSet => {
  return useMemo(() => {
    const geometry = buildOctahedron(radius, detail);

    const placeholderOuter = new THREE.MeshStandardMaterial({});
    const placeholderInner = new THREE.MeshStandardMaterial({});

    const seedPoints = generateVoronoiSeeds(fragmentCount, seed, radius);

    const sourceMesh = new DestructibleMesh(
      geometry,
      placeholderOuter,
      placeholderInner,
    );

    const options = new FractureOptions({
      fractureMethod: "voronoi",
      fragmentCount,
      voronoiOptions: {
        mode: "3D",
        seedPoints,
      },
      seed,
    });

    const fragmentMeshes = sourceMesh.fracture(options);
    const restPositions = fibonacciSphere(fragmentCount, restRadius);

    const fragments: FragmentData[] = fragmentMeshes.map((fragment, index) => {
      const geo = fragment.geometry;

      // Ensure normals are present and consistent; flatShading uses screen-space
      // derivatives so we don't need to expand to non-indexed geometry.
      geo.computeVertexNormals();
      geo.computeBoundingBox();
      geo.computeBoundingSphere();

      return {
        geometry: geo,
        homePosition: new THREE.Vector3(0, 0, 0),
        restPosition: restPositions[index] ?? new THREE.Vector3(),
      };
    });

    sourceMesh.geometry.dispose();
    placeholderOuter.dispose();
    placeholderInner.dispose();

    return { fragments };
  }, [seed, fragmentCount, radius, detail, restRadius]);
};
