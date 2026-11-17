import { useMemo } from 'react'
import { ContactShadows, Environment, OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

type Props = { wall: string; roof: string; night: boolean; room: string; autoRotate?: boolean }

function HouseModel({ wall, roof, night, room }: Props) {
  const windows = useMemo(() => Array.from({ length: 8 }, (_, i) => i), [])
  const glass = night ? '#f2cb75' : '#a7c7c5'
  return <group position={[0, -.3, 0]}>
    <mesh position={[0, .2, 0]} castShadow receiveShadow><boxGeometry args={[4.6, 1.6, 3.4]} /><meshStandardMaterial color={wall} roughness={.72} /></mesh>
    <mesh position={[0, 1.28, 0]} castShadow><boxGeometry args={[2.35, .62, 2.55]} /><meshStandardMaterial color={wall} roughness={.72} /></mesh>
    <mesh position={[0, 1.68, 0]} rotation={[0, Math.PI/4, 0]} scale={[1, .55, 1]} castShadow><coneGeometry args={[2.05, 1.05, 4]} /><meshStandardMaterial color={roof} roughness={.8} /></mesh>
    <mesh position={[0, 0, 1.73]}><boxGeometry args={[4.7, 1.7, .08]} /><meshStandardMaterial color={wall} /></mesh>
    {[-1.45, 1.45].map(x => <mesh key={x} position={[x, .35, 1.79]}><boxGeometry args={[.94, .95, .06]} /><meshStandardMaterial color={glass} emissive={night ? '#d9a747' : '#000000'} emissiveIntensity={night ? .75 : 0} metalness={.2} roughness={.18} /></mesh>)}
    <mesh position={[0, -.01, 1.8]}><boxGeometry args={[.76, 1.35, .07]} /><meshStandardMaterial color="#624b36" roughness={.5} /></mesh>
    <mesh position={[0, -.78, 0]} receiveShadow><boxGeometry args={[5, .12, 3.8]} /><meshStandardMaterial color="#c8c2b4" roughness={.85} /></mesh>
    <mesh position={[0, -.71, 2.32]}><boxGeometry args={[1.5, .05, 1.2]} /><meshStandardMaterial color="#b4a993" /></mesh>
    {windows.map(i => { const x = i < 4 ? -1.4 + (i % 2) * 2.8 : -1.0 + (i % 2) * 2.0; const z = i < 4 ? -.2 + Math.floor(i / 2) * .7 : -1.74; const y = i < 4 ? .15 : i > 5 ? 1.4 : .25; return <mesh key={i} position={[x,y,z]}><boxGeometry args={[.72,.68,.06]} /><meshStandardMaterial color={glass} emissive={night ? '#d9a747' : '#000'} emissiveIntensity={night ? .65 : 0} /></mesh> })}
    <mesh position={[-2.3,.45,0]}><boxGeometry args={[.12,1.25,3.35]} /><meshStandardMaterial color={roof} /></mesh>
    <mesh position={[0,.04,2.55]}><boxGeometry args={[1.7,.08,1.45]} /><meshStandardMaterial color={room === 'Kitchen' ? '#d7d2c6' : '#c8bead'} /></mesh>
    <Text position={[0,2.15,0]} fontSize={.16} color="#62645c" anchorX="center">DREAMSPACE / 01</Text>
  </group>
}

export default function House({ wall, roof, night, room, autoRotate = false }: Props) {
  return <CanvasScene wall={wall} roof={roof} night={night} room={room} autoRotate={autoRotate} />
}

function CanvasScene({ wall, roof, night, room, autoRotate }: Props) {
  const cameraPosition = new THREE.Vector3(7, 5, 9)
  return <div className="house-canvas"><CanvasInner wall={wall} roof={roof} night={night} room={room} autoRotate={autoRotate} cameraPosition={cameraPosition} /></div>
}

import { Canvas } from '@react-three/fiber'
function CanvasInner({ wall, roof, night, room, autoRotate, cameraPosition }: Props & { cameraPosition: THREE.Vector3 }) {
  return <Canvas shadows dpr={[1, 1.7]} camera={{ position: cameraPosition.toArray(), fov: 36 }} gl={{ antialias: true, alpha: true }}>
    <color attach="background" args={[night ? '#171914' : '#e8e9e1']} />
    <ambientLight intensity={night ? .45 : 1.25} />
    <directionalLight position={[-5,8,5]} intensity={night ? 1.1 : 2.5} castShadow shadow-mapSize={[1024,1024]} />
    <pointLight position={[2,2,3]} color={night ? '#ffce75' : '#ffffff'} intensity={night ? 18 : 3} />
    <Environment preset="city" />
    <HouseModel wall={wall} roof={roof} night={night} room={room} />
    <ContactShadows position={[0,-1.04,0]} opacity={.35} scale={11} blur={2.5} far={4} />
    <OrbitControls makeDefault enablePan={false} minDistance={6} maxDistance={15} maxPolarAngle={Math.PI/2.05} autoRotate={autoRotate} autoRotateSpeed={.55} />
  </Canvas>
}
