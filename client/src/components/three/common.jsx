import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

/** Studio lighting built from code — no network / HDR download needed. */
export function StudioLights({ warm = '#ff5a3c', cool = '#00d4c8' }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 3, 5]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-3, 2.5, 3]} intensity={38} color={warm} />
      <pointLight position={[4, -2, 3]} intensity={28} color={cool} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={4} color={warm} position={[-4, 2, 2]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={3} color={cool} position={[4, -1, 3]} scale={[5, 3, 1]} />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 4, -2]} scale={4} />
      </Environment>
    </>
  );
}

/** Floating dust / bokeh particles with slow drift. */
export function Dust({ count = 500, spread = [16, 9, 8], size = 0.028, color = '#ffffff', opacity = 0.55 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * spread[0];
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread[2];
    }
    return arr;
  }, [count, spread]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
    ref.current.rotation.x += delta * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={size} color={color} transparent opacity={opacity} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
