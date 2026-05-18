"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, useGLTF, Loader } from "@react-three/drei";
import * as THREE from "three";

useGLTF.preload("/models/supercar.glb");

type Vec3 = [number, number, number];
type Pointer = { x: number; y: number };

export interface SceneProps {
  scrollRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<Pointer>;
  color: string;
  reduced: boolean;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

interface Keyframe {
  p: number;
  pos: Vec3;
  target: Vec3;
}

// Camera journey — scroll progress 0..1 mapped to position + look-at target.
const KEYFRAMES: Keyframe[] = [
  { p: 0.0, pos: [3.6, 1.5, 5.0], target: [0, 0.55, 0] }, // hero
  { p: 0.16, pos: [3.6, 1.5, 5.0], target: [0, 0.55, 0] }, // tilt-to-hold zone
  { p: 0.35, pos: [1.85, 0.62, 2.45], target: [1.05, 0.4, 0.65] }, // wheels close-up
  { p: 0.55, pos: [-3.25, 0.95, 3.15], target: [0, 0.55, 0] }, // bodywork side
  { p: 0.74, pos: [-2.5, 1.7, -3.4], target: [0, 0.7, -0.55] }, // cabin / rear
  { p: 1.0, pos: [3.9, 1.6, 5.3], target: [0, 0.55, 0] }, // configurator hero
];

const INTRO_POS: Vec3 = [1.25, 0.46, 2.0];
const INTRO_MS = 2600;

function sampleFrame(p: number): { pos: Vec3; target: Vec3 } {
  const k = KEYFRAMES;
  if (p <= k[0].p) return { pos: k[0].pos, target: k[0].target };
  const last = k[k.length - 1];
  if (p >= last.p) return { pos: last.pos, target: last.target };
  let i = 0;
  while (i < k.length - 1 && p > k[i + 1].p) i++;
  const a = k[i];
  const b = k[i + 1];
  const t = smooth((p - a.p) / (b.p - a.p));
  const mix = (x: Vec3, y: Vec3): Vec3 => [
    x[0] + (y[0] - x[0]) * t,
    x[1] + (y[1] - x[1]) * t,
    x[2] + (y[2] - x[2]) * t,
  ];
  return { pos: mix(a.pos, b.pos), target: mix(a.target, b.target) };
}

function CameraRig({
  scrollRef,
  reduced,
}: {
  scrollRef: MutableRefObject<number>;
  reduced: boolean;
}) {
  const { camera } = useThree();
  const startRef = useRef<number | null>(null);
  const look = useRef(new THREE.Vector3(0, 0.55, 0));
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  useFrame(() => {
    if (startRef.current === null) startRef.current = performance.now();
    const introT = reduced
      ? 1
      : clamp((performance.now() - startRef.current) / INTRO_MS, 0, 1);

    let pos: Vec3;
    let target: Vec3;
    if (introT < 1) {
      const e = smooth(introT);
      const hero = KEYFRAMES[0];
      pos = [
        INTRO_POS[0] + (hero.pos[0] - INTRO_POS[0]) * e,
        INTRO_POS[1] + (hero.pos[1] - INTRO_POS[1]) * e,
        INTRO_POS[2] + (hero.pos[2] - INTRO_POS[2]) * e,
      ];
      target = hero.target;
    } else {
      const f = sampleFrame(scrollRef.current);
      pos = f.pos;
      target = f.target;
    }

    tmpPos.current.set(pos[0], pos[1], pos[2]);
    tmpLook.current.set(target[0], target[1], target[2]);
    camera.position.lerp(tmpPos.current, reduced ? 1 : 0.085);
    look.current.lerp(tmpLook.current, reduced ? 1 : 0.1);
    camera.lookAt(look.current);
  });

  return null;
}

function KeyLight({
  scrollRef,
  pointerRef,
}: {
  scrollRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<Pointer>;
}) {
  const ref = useRef<THREE.DirectionalLight>(null);
  useFrame(() => {
    const l = ref.current;
    if (!l) return;
    // Light follows the pointer only while in the "tilt to hold" zone.
    const interactive = 1 - clamp((scrollRef.current - 0.12) / 0.08, 0, 1);
    const tx = 4 + pointerRef.current.x * 5 * interactive;
    const ty = 6 - pointerRef.current.y * 3.5 * interactive;
    l.position.x += (tx - l.position.x) * 0.08;
    l.position.y += (ty - l.position.y) * 0.08;
  });
  return <directionalLight ref={ref} intensity={1.6} position={[4, 6, 4]} />;
}

function Car({ color }: { color: string }) {
  const gltf = useGLTF("/models/supercar.glb");
  const model = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const bodyMat = useRef<THREE.MeshPhysicalMaterial | null>(null);

  useEffect(() => {
    const found: {
      body: THREE.Mesh | null;
      biggest: THREE.Mesh | null;
      count: number;
    } = { body: null, biggest: null, count: -1 };
    model.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const count = mesh.geometry?.attributes?.position?.count ?? 0;
      if (count > found.count) {
        found.count = count;
        found.biggest = mesh;
      }
      const name = o.name.toLowerCase();
      if (
        !found.body &&
        (name === "body" || name.includes("body") || name.includes("paint"))
      ) {
        found.body = mesh;
      }
    });
    const targetMesh = found.body ?? found.biggest;
    if (targetMesh) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#B81D24"),
        metalness: 0.5,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      });
      targetMesh.material = mat;
      bodyMat.current = mat;
    }
  }, [model]);

  useEffect(() => {
    if (bodyMat.current) bodyMat.current.color.set(color);
  }, [color]);

  return <primitive object={model} />;
}

function CarRig({
  scrollRef,
  pointerRef,
  reduced,
  color,
}: {
  scrollRef: MutableRefObject<number>;
  pointerRef: MutableRefObject<Pointer>;
  reduced: boolean;
  color: string;
}) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const scroll = scrollRef.current;
    // Idle auto-rotation only in the hero / tilt zone.
    if (!reduced && scroll < 0.14) spin.current += delta * 0.14;
    // Pointer (cursor or gyroscope) controls rotation only while holding.
    const interactive = 1 - clamp((scroll - 0.12) / 0.09, 0, 1);
    const targetY = spin.current + pointerRef.current.x * 0.55 * interactive;
    const targetX = -pointerRef.current.y * 0.14 * interactive;
    g.rotation.y += (targetY - g.rotation.y) * 0.07;
    g.rotation.x += (targetX - g.rotation.x) * 0.07;
  });

  return (
    <group ref={group}>
      <Car color={color} />
    </group>
  );
}

export default function Scene({ scrollRef, pointerRef, color, reduced }: SceneProps) {
  return (
    <>
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: INTRO_POS, fov: 42 }}
        style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
      >
        <Suspense fallback={null}>
          <CameraRig scrollRef={scrollRef} reduced={reduced} />
          <ambientLight intensity={0.55} />
          <KeyLight scrollRef={scrollRef} pointerRef={pointerRef} />
          <CarRig
            scrollRef={scrollRef}
            pointerRef={pointerRef}
            reduced={reduced}
            color={color}
          />
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.5}
            scale={18}
            blur={2.8}
            far={6}
          />
          <Environment preset="studio" environmentIntensity={0.85} />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
