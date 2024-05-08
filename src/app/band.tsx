// "use client";

// import React, { Fragment } from "react";

// import * as THREE from "three";
// import { MeshLineGeometry, MeshLineMaterial } from "meshline";

// import { useEffect, useRef, useState } from "react";
// import {
//   useThree,
//   useFrame,
//   extend,
//   type ThreeElements,
//   type ThreeEvent,
// } from "@react-three/fiber";
// import {
//   BallCollider,
//   CuboidCollider,
//   RapierRigidBody,
//   RigidBody,
//   type RigidBodyProps,
//   useRopeJoint,
//   useSphericalJoint,
// } from "@react-three/rapier";

// import { useGLTF, useTexture } from "@react-three/drei";

// extend({ MeshLineGeometry, MeshLineMaterial });

// useGLTF.preload(
//   "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb"
// );
// useTexture.preload(
//   // "/vercel.svg"
//   "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg"
// );

// export default function Band({ maxSpeed = 50, minSpeed = 10 }) {
//   const band = useRef<ThreeElements["mesh"]>(null!),
//     fixed = useRef<RapierRigidBody>(null),
//     j1 = useRef<RapierRigidBody>(null),
//     j2 = useRef<RapierRigidBody>(null),
//     j3 = useRef<RapierRigidBody>(null),
//     card = useRef<RapierRigidBody>(null);

//   const vec = new THREE.Vector3();
//   const ang = new THREE.Vector3();
//   const rot = new THREE.Vector3();
//   const dir = new THREE.Vector3();

//   const segmentProps = {
//     type: "dynamic",
//     canSleep: true,
//     colliders: false,
//     angularDamping: 2,
//     linearDamping: 2,
//   } as RigidBodyProps;

//   const { nodes, materials } = useGLTF(
//     "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/5huRVDzcoDwnbgrKUo1Lzs/53b6dd7d6b4ffcdbd338fa60265949e1/tag.glb"
//   );

//   const texture = useTexture(
//     // "/vercel.svg"
//     "https://assets.vercel.com/image/upload/contentful/image/e5382hct74si/SOT1hmCesOHxEYxL7vkoZ/c57b29c85912047c414311723320c16b/band.jpg"
//   );

//   const { width, height } = useThree((state) => state.size);

//   const [curve] = useState(
//     () =>
//       new THREE.CatmullRomCurve3([
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//       ])
//   );

//   const [dragged, drag] = useState<THREE.Vector3 | false>(false);
//   const [hovered, hover] = useState<boolean>(false);

//   useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
//   useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
//   useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
//   useSphericalJoint(j3, card, [
//     [0, 0, 0],
//     [0, 1.45, 0],
//   ]);

//   useEffect(() => {
//     if (hovered) {
//       document.body.style.cursor = dragged ? "grabbing" : "grab";
//       return () => void (document.body.style.cursor = "auto");
//     }
//   }, [hovered, dragged]);

//   useFrame((state, delta) => {
//     if (dragged) {
//       vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
//       dir.copy(vec).sub(state.camera.position).normalize();
//       vec.add(dir.multiplyScalar(state.camera.position.length()));
//       [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
//       card.current?.setNextKinematicTranslation({
//         x: vec.x - dragged.x,
//         y: vec.y - dragged.y,
//         z: vec.z - dragged.z,
//       });
//     }
//     if (fixed.current) {
//       // Fix most of the jitter when over pulling the card
//       [j1, j2].forEach((ref) => {
//         if (!ref.current?.lerped)
//           ref.current.lerped = new THREE.Vector3().copy(
//             ref.current.translation()
//           );
//         const clampedDistance = Math.max(
//           0.1,
//           Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
//         );
//         ref.current?.lerped.lerp(
//           ref.current?.translation() as THREE.Vector3Like,
//           delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
//         );
//       });
//       // Calculate catmul curve
//       curve.points[0].copy(j3.current.translation());
//       curve.points[1].copy(j2.current.lerped);
//       curve.points[2].copy(j1.current.lerped);
//       curve.points[3].copy(fixed.current.translation());
//       band.current.geometry.setPoints(curve.getPoints(32));
//       // Tilt it back towards the screen
//       ang.copy(card.current.angvel());
//       rot.copy(card.current.rotation());
//       card.current.setAngvel(
//         { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
//         false
//       );
//     }
//   });

//   curve.curveType = "chordal";
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

//   return (
//     <Fragment>
//       <group position={[0, 4, 0]}>
//         <RigidBody ref={fixed} {...segmentProps} type="fixed" />
//         <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody
//           position={[2, 0, 0]}
//           ref={card}
//           {...segmentProps}
//           type={dragged ? "kinematicPosition" : "dynamic"}
//         >
//           <CuboidCollider args={[0.8, 1.125, 0.01]} />
//           <group
//             scale={2.25}
//             position={[0, -1.2, -0.05]}
//             onPointerOver={() => hover(true)}
//             onPointerOut={() => hover(false)}
//             onPointerUp={(e: ThreeEvent<PointerEvent>) => {
//               e.target.releasePointerCapture(e.pointerId);
//               drag(false);
//             }}
//             onPointerDown={(e) => {
//               console.dir(e);
//               e.target?.setPointerCapture(e.pointerId);
//               drag(
//                 new THREE.Vector3()
//                   .copy(e.point)
//                   .sub(
//                     vec.copy(card.current?.translation() as THREE.Vector3Like)
//                   )
//               );
//             }}
//           >
//             <mesh geometry={nodes.card.geometry}>
//               <meshPhysicalMaterial
//                 map={materials.base.map}
//                 map-anisotropy={16}
//                 clearcoat={1}
//                 clearcoatRoughness={0.15}
//                 roughness={0.3}
//                 metalness={0.5}
//               />
//             </mesh>
//             <mesh
//               geometry={nodes.clip.geometry}
//               material={materials.metal}
//               material-roughness={0.3}
//             />
//             <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
//           </group>
//         </RigidBody>
//       </group>
//       <mesh ref={band}>
//         <meshLineGeometry />
//         <meshLineMaterial
//           color="white"
//           depthTest={false}
//           resolution={[width, height]}
//           useMap
//           map={texture}
//           repeat={[-3, 1]}
//           lineWidth={1}
//         />
//       </mesh>
//     </Fragment>
//   );
// }

import React from "react";

export default function band() {
  return <div>band</div>;
}
