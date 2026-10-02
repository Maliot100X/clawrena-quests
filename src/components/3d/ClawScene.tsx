"use client";
import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

function Orb() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = clock.elapsedTime * 0.3;
      mesh.current.rotation.x = clock.elapsedTime * 0.15;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <Sphere ref={mesh} args={[1.3, 64, 64]}>
        <MeshDistortMaterial color="#22c7b8" distort={0.35} speed={2} roughness={0.05} metalness={0.9} emissive="#0a3d38" emissiveIntensity={0.6} transparent opacity={0.9} />
      </Sphere>
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color="#22c7b8" transparent opacity={0.06} />
      </Sphere>
    </Float>
  );
}

function Ring({ radius, rotation }: { radius: number; rotation: [number, number, number] }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (mesh.current) mesh.current.rotation.z = clock.elapsedTime * 0.2; });
  return (
    <mesh ref={mesh} rotation={rotation}>
      <torusGeometry args={[radius, 0.015, 16, 120]} />
      <meshBasicMaterial color="#22c7b8" transparent opacity={0.25} />
    </mesh>
  );
}

function Particles() {
  const count = 100;
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1), r = 2.5 + Math.random() * 2;
    pos[i*3] = r*Math.sin(p)*Math.cos(t); pos[i*3+1] = r*Math.sin(p)*Math.sin(t); pos[i*3+2] = r*Math.cos(p);
  }
  const geo = useRef<THREE.BufferGeometry>(null);
  useFrame(() => { if (geo.current) geo.current.rotateY(0.002); });
  return (
    <points>
      <bufferGeometry ref={geo}><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.035} color="#22c7b8" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export function ClawScene() {
  return (
    <div className="w-full h-[320px] sm:h-[380px]">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.15} />
        <pointLight position={[8, 8, 8]} intensity={1.2} color="#22c7b8" />
        <pointLight position={[-8, -8, -5]} intensity={0.4} color="#6040ff" />
        <Suspense fallback={null}>
          <Orb />
          <Ring radius={1.8} rotation={[Math.PI / 3, 0, 0]} />
          <Ring radius={2.2} rotation={[-Math.PI / 5, Math.PI / 4, 0]} />
          <Particles />
          <Stars radius={25} depth={8} count={400} factor={3} fade speed={0.4} />
        </Suspense>
      </Canvas>
    </div>
  );
}
