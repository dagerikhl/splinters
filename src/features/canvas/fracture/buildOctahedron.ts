import * as THREE from "three";

export const buildOctahedron = (
  radius = 2,
  detail = 2,
): THREE.BufferGeometry => {
  const geometry = new THREE.OctahedronGeometry(radius, detail);
  geometry.computeVertexNormals();

  return geometry;
};
