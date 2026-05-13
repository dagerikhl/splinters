import * as THREE from "three";
import { ConvexHull } from "three/examples/jsm/math/ConvexHull.js";

const EPS = 1e-4;
const DEGENERATE_AREA_EPS = 1e-8;

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

interface FaceTri {
  ax: number;
  ay: number;
  az: number;
  bx: number;
  by: number;
  bz: number;
  cx: number;
  cy: number;
  cz: number;
  nx: number;
  ny: number;
  nz: number;
}

/**
 * Builds a guaranteed-closed convex polyhedron from a fragment's vertex cloud
 * and assigns each triangle to either the "outer" (group 0) or "inner cut"
 * (group 1) material depending on whether the face centroid lies on the
 * original octahedron's surface.
 *
 * Three-pinata occasionally emits non-manifold or open Voronoi cells, which
 * read as visible holes. Voronoi cells are convex by definition, so taking
 * the convex hull of the cell's vertices produces the same shape but
 * manifold-correct.
 *
 * We can't use three.js's ConvexGeometry directly because it pushes every
 * polygon vertex into a flat position buffer without triangulating, so
 * non-triangular faces get rendered as broken triangles (visible wedge holes).
 * Here we walk the ConvexHull faces ourselves and fan-triangulate each one.
 */
export const rebuildAsConvex = (
  geo: THREE.BufferGeometry,
): THREE.BufferGeometry | null => {
  const position = geo.attributes.position;

  if (!position || position.count < 4) return null;

  const unique = dedupePoints(position as THREE.BufferAttribute);

  if (unique.length < 4) return null;

  let hull: ConvexHull;

  try {
    hull = new ConvexHull().setFromPoints(unique);
  } catch {
    return null;
  }

  // Compute the cell's centroid so we can verify each triangle's winding
  // produces an outward-pointing normal. ConvexHull.face.normal is meant to
  // be outward but in practice can be inconsistent, especially on faces with
  // merged coplanar sub-faces.
  const cellCenter = new THREE.Vector3();

  for (const p of unique) cellCenter.add(p);

  cellCenter.divideScalar(unique.length);

  const triangles: FaceTri[] = [];

  for (const face of hull.faces) {
    const verts: THREE.Vector3[] = [];
    let edge = face.edge;

    do {
      verts.push(edge.head().point);
      edge = edge.next;
    } while (edge !== face.edge);

    if (verts.length < 3) continue;

    const ab = new THREE.Vector3();
    const ac = new THREE.Vector3();
    const cross = new THREE.Vector3();
    const triCentroid = new THREE.Vector3();
    const outwardDir = new THREE.Vector3();
    const triNormal = new THREE.Vector3();

    // Fan-triangulate the polygon face from its first vertex.
    for (let i = 1; i < verts.length - 1; i++) {
      const a = verts[0];
      let b = verts[i];
      let c = verts[i + 1];

      ab.subVectors(b, a);
      ac.subVectors(c, a);
      cross.crossVectors(ab, ac);

      const sq = cross.lengthSq();

      // Skip degenerate triangles (collinear vertices = zero area). These
      // produce undefined normals and render as gray patches.
      if (sq < DEGENERATE_AREA_EPS) continue;

      // Compute outward direction from the cell centroid to this triangle.
      // Force winding so the triangle's geometric normal aligns with it.
      triCentroid.addVectors(a, b).add(c).divideScalar(3);
      outwardDir.subVectors(triCentroid, cellCenter);

      if (cross.dot(outwardDir) < 0) {
        const tmp = b;
        b = c;
        c = tmp;
        cross.multiplyScalar(-1);
      }

      // Use the per-triangle normalized geometric normal so flat shading is
      // self-consistent (vs. relying on face.normal which can drift after
      // ConvexHull merges coplanar faces).
      triNormal.copy(cross).normalize();

      triangles.push({
        ax: a.x,
        ay: a.y,
        az: a.z,
        bx: b.x,
        by: b.y,
        bz: b.z,
        cx: c.x,
        cy: c.y,
        cz: c.z,
        nx: triNormal.x,
        ny: triNormal.y,
        nz: triNormal.z,
      });
    }
  }

  if (triangles.length === 0) return null;

  const positions = new Float32Array(triangles.length * 9);
  const normals = new Float32Array(triangles.length * 9);

  for (let i = 0; i < triangles.length; i++) {
    const t = triangles[i];
    const o = i * 9;

    positions[o + 0] = t.ax;
    positions[o + 1] = t.ay;
    positions[o + 2] = t.az;
    positions[o + 3] = t.bx;
    positions[o + 4] = t.by;
    positions[o + 5] = t.bz;
    positions[o + 6] = t.cx;
    positions[o + 7] = t.cy;
    positions[o + 8] = t.cz;

    for (let k = 0; k < 3; k++) {
      normals[o + k * 3 + 0] = t.nx;
      normals[o + k * 3 + 1] = t.ny;
      normals[o + k * 3 + 2] = t.nz;
    }
  }

  const result = new THREE.BufferGeometry();
  result.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  result.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

  // No material groups — every triangle uses material[0]. The inner-cut
  // distinction (material[1]) was producing visibly different shading on
  // some fragments even when both materials had identical settings.
  result.computeBoundingBox();
  result.computeBoundingSphere();

  return result;
};
