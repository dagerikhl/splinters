import * as THREE from "three";

/**
 * Flips triangle winding so each face's normal points away from the geometry's
 * bounding-sphere center. Three-pinata's Voronoi cells are convex polyhedra,
 * so the cell centroid is a stable reference for "outside". Without this step,
 * inconsistent winding causes back-faces to render through front-faces (with
 * DoubleSide) or holes (with FrontSide).
 */
export const orientOutward = (geo: THREE.BufferGeometry): void => {
  geo.computeBoundingSphere();

  const sphere = geo.boundingSphere;

  if (!sphere) return;

  const center = sphere.center;
  const position = geo.attributes.position as THREE.BufferAttribute;

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const centroid = new THREE.Vector3();
  const outward = new THREE.Vector3();

  const swapIndex = (arr: Uint16Array | Uint32Array, i: number, j: number) => {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  };

  if (geo.index) {
    const idx = geo.index.array as Uint16Array | Uint32Array;

    for (let i = 0; i < idx.length; i += 3) {
      a.fromBufferAttribute(position, idx[i]);
      b.fromBufferAttribute(position, idx[i + 1]);
      c.fromBufferAttribute(position, idx[i + 2]);

      ab.subVectors(b, a);
      ac.subVectors(c, a);
      normal.crossVectors(ab, ac);

      centroid.addVectors(a, b).add(c).divideScalar(3);
      outward.subVectors(centroid, center);

      if (normal.dot(outward) < 0) {
        swapIndex(idx, i + 1, i + 2);
      }
    }

    geo.index.needsUpdate = true;
  } else {
    const arr = position.array as Float32Array;
    const stride = 9;

    for (let i = 0; i < arr.length; i += stride) {
      a.set(arr[i], arr[i + 1], arr[i + 2]);
      b.set(arr[i + 3], arr[i + 4], arr[i + 5]);
      c.set(arr[i + 6], arr[i + 7], arr[i + 8]);

      ab.subVectors(b, a);
      ac.subVectors(c, a);
      normal.crossVectors(ab, ac);

      centroid.addVectors(a, b).add(c).divideScalar(3);
      outward.subVectors(centroid, center);

      if (normal.dot(outward) < 0) {
        arr[i + 3] = c.x;
        arr[i + 4] = c.y;
        arr[i + 5] = c.z;
        arr[i + 6] = b.x;
        arr[i + 7] = b.y;
        arr[i + 8] = b.z;
      }
    }

    position.needsUpdate = true;
  }

  geo.computeVertexNormals();
};
