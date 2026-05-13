import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

const EPS = 1e-4;
const OUTER_TOLERANCE = 0.06;

const dedupePoints = (positionAttr: THREE.BufferAttribute): THREE.Vector3[] => {
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < positionAttr.count; i++) {
    const p = new THREE.Vector3(
      positionAttr.getX(i),
      positionAttr.getY(i),
      positionAttr.getZ(i),
    );

    const exists = points.some((q) => q.distanceToSquared(p) < EPS * EPS);

    if (!exists) points.push(p);
  }

  return points;
};

/**
 * Builds a guaranteed-closed convex polyhedron from a fragment's vertex cloud
 * and assigns each face to either the "outer" (group 0) or "inner cut"
 * (group 1) material depending on whether the face centroid lies on the
 * original octahedron's surface.
 *
 * Three-pinata occasionally emits non-manifold or open Voronoi cells, which
 * read as visible holes. Voronoi cells are convex by definition, so taking
 * the convex hull of the cell's vertices produces the same shape but
 * manifold-correct.
 */
export const rebuildAsConvex = (
  geo: THREE.BufferGeometry,
  octahedronRadius: number,
): THREE.BufferGeometry | null => {
  const position = geo.attributes.position;

  if (!position || position.count < 4) return null;

  const unique = dedupePoints(position as THREE.BufferAttribute);

  if (unique.length < 4) return null;

  let convex: THREE.BufferGeometry;

  try {
    convex = new ConvexGeometry(unique);
  } catch {
    return null;
  }

  const pos = convex.attributes.position as THREE.BufferAttribute;
  const triCount = pos.count / 3;

  const groupTags: number[] = new Array(triCount);
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const centroid = new THREE.Vector3();

  for (let t = 0; t < triCount; t++) {
    a.fromBufferAttribute(pos, t * 3);
    b.fromBufferAttribute(pos, t * 3 + 1);
    c.fromBufferAttribute(pos, t * 3 + 2);

    centroid.addVectors(a, b).add(c).divideScalar(3);

    const l1 =
      Math.abs(centroid.x) + Math.abs(centroid.y) + Math.abs(centroid.z);
    const onOuterSurface = Math.abs(l1 - octahedronRadius) < OUTER_TOLERANCE;

    groupTags[t] = onOuterSurface ? 0 : 1;
  }

  // ConvexGeometry returns non-indexed triangles. Build contiguous groups
  // by material index for material-0 (outer) and material-1 (inner).
  convex.clearGroups();

  let runStart = 0;
  let runMaterial = groupTags[0] ?? 0;

  for (let t = 1; t <= triCount; t++) {
    const m = t < triCount ? groupTags[t] : -1;

    if (m !== runMaterial) {
      convex.addGroup(runStart * 3, (t - runStart) * 3, runMaterial);
      runStart = t;
      runMaterial = m;
    }
  }

  convex.computeVertexNormals();
  convex.computeBoundingBox();
  convex.computeBoundingSphere();

  return convex;
};
