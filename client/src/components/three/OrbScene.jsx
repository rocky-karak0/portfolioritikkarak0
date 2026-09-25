import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Dust, StudioLights } from './common.jsx';

function Orb({ color, offsetX }) {
  const { viewport } = useThree();
  const x = offsetX ? viewport.width * 0.27 : 0;
  const group = useRef();
  const ring1 = useRef();
  const ring2 = useRef();
  useFrame((state, delta) => {
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, state.pointer.x * 0.6, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -state.pointer.y * 0.4, 3, delta);
    ring1.current.rotation.z += delta * 0.4;
    ring2.current.rotation.x += delta * 0.3;
  });
  return (
    <group position={[x, 0, 0]}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.1}>
        <group ref={group}>
          <mesh>
            <icosahedronGeometry args={[1.25, 24]} />
            <MeshDistortMaterial color={color} roughness={0.15} metalness={0.85} distort={0.42} speed={1.8} />
          </mesh>
          <mesh ref={ring1} rotation={[1.2, 0, 0]}>
            <torusGeometry args={[1.95, 0.012, 12, 160]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
          <mesh ref={ring2} rotation={[0, 1.1, 0.5]}>
            <torusGeometry args={[2.3, 0.01, 12, 160]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

/** Decorative interactive 3D orb used behind page headers. */
export default function OrbScene({ color = '#ff3d2e', offsetX = 2.4, lite = false, eventSource }) {
  return (
    <Canvas
      eventSource={eventSource}
      eventPrefix="client"
      dpr={[1, lite ? 1.25 : 1.6]}
      camera={{ position: [0, 0, 6.5], fov: 45 }}
      gl={{ antialias: !lite, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <StudioLights />
      <Dust count={lite ? 120 : 260} spread={[14, 8, 6]} />
      <Orb color={color} offsetX={lite ? 0 : offsetX} />
    </Canvas>
  );
}
