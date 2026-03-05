"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import * as THREE from "three";

function createShardGeometry(
  baseRadius: number,
  height: number,
  segments: number,
  jaggedness: number,
) {
  const vertices: number[] = [];
  const indices: number[] = [];

  vertices.push(
    (Math.random() - 0.5) * 0.3,
    height + (Math.random() - 0.5) * 0.15,
    (Math.random() - 0.5) * 0.3,
  );

  const layers = 8;
  for (let layer = 1; layer <= layers; layer++) {
    const t = layer / layers;
    const r = baseRadius * t;
    const y = height * (1 - t);
    const ringSegments = segments + layer * 2;

    for (let s = 0; s < ringSegments; s++) {
      const angle = (s / ringSegments) * Math.PI * 2;
      const jag = 1 + (Math.random() - 0.5) * jaggedness * t;
      const xr = Math.cos(angle) * r * jag;
      const zr = Math.sin(angle) * r * jag;
      const yr = y + (Math.random() - 0.5) * 0.2 * t;
      vertices.push(xr, yr, zr);
    }
  }

  const verts = new Float32Array(vertices);
  const geo = new THREE.BufferGeometry();

  const firstRingStart = 1;
  const firstRingCount = segments + 1 * 2;
  for (let s = 0; s < firstRingCount; s++) {
    const a = 0;
    const b = firstRingStart + s;
    const c = firstRingStart + ((s + 1) % firstRingCount);
    indices.push(a, b, c);
  }

  let prevStart = firstRingStart;
  let prevCount = firstRingCount;
  for (let layer = 2; layer <= layers; layer++) {
    const currCount = segments + layer * 2;
    const currStart = prevStart + prevCount;

    for (let s = 0; s < Math.max(prevCount, currCount); s++) {
      const pi = prevStart + (s % prevCount);
      const pi2 = prevStart + ((s + 1) % prevCount);
      const ci = currStart + (s % currCount);
      const ci2 = currStart + ((s + 1) % currCount);

      indices.push(pi, ci, ci2);
      indices.push(pi, ci2, pi2);
    }

    prevStart = currStart;
    prevCount = currCount;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function Shard({
  position,
  scale,
  rotation,
  baseRadius,
  height,
  segments,
  calcify,
}: {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  baseRadius: number;
  height: number;
  segments: number;
  calcify: MotionValue<number>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(
    () => createShardGeometry(baseRadius, height, segments, 0.5),
    [baseRadius, height, segments],
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const c = calcify.get();
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.metalness = 0.9 + c * 0.1;
    mat.roughness = 0.2 - c * 0.05;
    mat.color.lerpColors(
      new THREE.Color("#A1A1AA"),
      new THREE.Color("#C0FFFF"),
      c,
    );
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={position}
      scale={scale}
      rotation={rotation}
    >
      <meshStandardMaterial
        color="#C0FFFF"
        metalness={1}
        roughness={0.15}
        flatShading
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();
  const angle = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [0, Math.PI * 0.15]),
    { stiffness: 60, damping: 25 },
  );

  useFrame(() => {
    const a = angle.get();
    camera.position.x = Math.sin(a) * 7;
    camera.position.z = Math.cos(a) * 7;
    camera.lookAt(0, 0.5, 0);
  });

  return null;
}

function MountainRange({
  calcify,
  lightPulse,
}: {
  calcify: MotionValue<number>;
  lightPulse?: MotionValue<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  const lightRef = useRef<THREE.PointLight>(null);
  const accentLightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y +=
      (pointer.x * 0.2 - groupRef.current.rotation.y) * 0.015;
    groupRef.current.rotation.x +=
      (pointer.y * 0.06 + 0.05 - groupRef.current.rotation.x) * 0.015;

    if (lightRef.current) {
      lightRef.current.position.x += (pointer.x * 6 - lightRef.current.position.x) * 0.03;
      lightRef.current.position.y += (pointer.y * 3 + 4 - lightRef.current.position.y) * 0.03;
    }

    if (accentLightRef.current && lightPulse) {
      accentLightRef.current.intensity = 0.8 + lightPulse.get() * 2.5;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight
        ref={lightRef}
        position={[0, 4, 3]}
        intensity={1.8}
        color="#C0FFFF"
        distance={18}
        decay={2}
      />

      <pointLight
        ref={accentLightRef}
        position={[-4, 2, -3]}
        intensity={0.8}
        color="#806EFF"
        distance={14}
        decay={2}
      />

      <Shard position={[0, -1.8, 0]} scale={1} rotation={[0, 0, 0]}
        baseRadius={2.2} height={4.2} segments={12} calcify={calcify} />
      <Shard position={[-2.4, -1.8, 0.4]} scale={0.7} rotation={[0, 0.8, 0.06]}
        baseRadius={1.8} height={2.8} segments={10} calcify={calcify} />
      <Shard position={[2.2, -1.8, -0.3]} scale={0.65} rotation={[0, -0.5, -0.04]}
        baseRadius={1.6} height={3.0} segments={10} calcify={calcify} />
      <Shard position={[-4.0, -1.8, 0.8]} scale={0.45} rotation={[0, 1.2, 0.08]}
        baseRadius={1.4} height={2.0} segments={8} calcify={calcify} />
      <Shard position={[3.8, -1.8, 0.5]} scale={0.5} rotation={[0, -1.0, -0.06]}
        baseRadius={1.5} height={2.2} segments={8} calcify={calcify} />
      <Shard position={[0.8, -1.8, 1.8]} scale={0.35} rotation={[0, 0.3, 0.1]}
        baseRadius={1.0} height={1.6} segments={7} calcify={calcify} />
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight position={[6, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-4, 6, -5]} intensity={0.35} color="#C0FFFF" />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#806EFF" distance={20} />
    </>
  );
}

export default function MountainPeak({
  lightPulse,
}: {
  lightPulse?: MotionValue<number>;
} = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const calcify = useSpring(
    useTransform(scrollYProgress, [0.05, 0.6], [0, 1]),
    { stiffness: 100, damping: 30 },
  );

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.5, 7], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <SceneLighting />
        <CameraRig />
        <MountainRange calcify={calcify} lightPulse={lightPulse} />
      </Canvas>
    </div>
  );
}
