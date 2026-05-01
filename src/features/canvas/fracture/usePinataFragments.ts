import { buildOctahedron } from "@/features/canvas/fracture/buildOctahedron";
import { generateVoronoiSeeds } from "@/features/canvas/fracture/voronoiSeeds";
import { DestructibleMesh, FractureOptions } from "@dgreenheck/three-pinata";
import { useMemo } from "react";
import * as THREE from "three";

export interface FragmentData {
  geometry: THREE.BufferGeometry;
  homePosition: THREE.Vector3;
  restDirection: THREE.Vector3;
}

export interface FragmentSet {
  fragments: FragmentData[];
  outerMaterial: THREE.MeshStandardMaterial;
  innerMaterial: THREE.MeshStandardMaterial;
}

export interface UsePinataFragmentsOptions {
  seed: number;
  fragmentCount?: number;
  radius?: number;
  detail?: number;
  outerColor?: THREE.ColorRepresentation;
  innerColor?: THREE.ColorRepresentation;
}

export const usePinataFragments = ({
  seed,
  fragmentCount = 16,
  radius = 2,
  detail = 2,
  outerColor = "#fff195",
  innerColor = "#ffc9c9",
}: UsePinataFragmentsOptions): FragmentSet => {
  return useMemo(() => {
    const geometry = buildOctahedron(radius, detail);

    const outerMaterial = new THREE.MeshStandardMaterial({
      color: outerColor,
      roughness: 0.4,
      flatShading: true,
    });

    const innerMaterial = new THREE.MeshStandardMaterial({
      color: innerColor,
      emissive: innerColor,
      emissiveIntensity: 0,
      roughness: 0.6,
      flatShading: true,
      toneMapped: false,
    });

    const seedPoints = generateVoronoiSeeds(fragmentCount, seed, radius);

    const sourceMesh = new DestructibleMesh(
      geometry,
      outerMaterial,
      innerMaterial,
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

    const fragments: FragmentData[] = fragmentMeshes.map((fragment, index) => {
      fragment.geometry.computeBoundingBox();
      fragment.geometry.computeBoundingSphere();

      const homePosition = new THREE.Vector3();
      const seedPoint = seedPoints[index] ?? new THREE.Vector3();

      const restDirection = seedPoint.clone().normalize();

      return {
        geometry: fragment.geometry,
        homePosition,
        restDirection,
      };
    });

    sourceMesh.geometry.dispose();

    return { fragments, outerMaterial, innerMaterial };
  }, [seed, fragmentCount, radius, detail, outerColor, innerColor]);
};
