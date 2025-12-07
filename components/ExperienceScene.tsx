import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, PerspectiveCamera, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { TreeParticles } from './TreeParticles';
import { TreeState } from '../types';

interface ExperienceSceneProps {
  treeState: TreeState;
}

const Snow = () => {
    const count = 1000;
    const mesh = useRef<THREE.Points>(null);
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            pos[i*3] = (Math.random() - 0.5) * 50; // x
            pos[i*3+1] = (Math.random() - 0.5) * 50; // y
            pos[i*3+2] = (Math.random() - 0.5) * 50; // z
        }
        return pos;
    }, []);

    useFrame(() => {
        if (!mesh.current) return;
        // Simple falling animation
        const positions = mesh.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
            positions[i] -= 0.05; // Fall speed
            if (positions[i] < -25) {
                positions[i] = 25; // Reset to top
            }
        }
        mesh.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute 
                    attach="attributes-position" 
                    count={count} 
                    itemSize={3} 
                    array={positions} 
                />
            </bufferGeometry>
            <pointsMaterial 
                size={0.15} 
                color="#ffffff" 
                transparent 
                opacity={0.8} 
                sizeAttenuation={true} 
            />
        </points>
    )
}

export const ExperienceScene: React.FC<ExperienceSceneProps> = ({ treeState }) => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas 
        dpr={[1, 2]} 
        gl={{ antialias: false, toneMappingExposure: 1.2 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 22]} fov={45} />
        
        {/* Deep Space Black */}
        <color attach="background" args={['#000508']} />
        
        <Suspense fallback={null}>
            {/* Environmental Lighting - Adjusted for contrast against black */}
            <ambientLight intensity={0.1} color="#042e18" />
            
            {/* Key Light (Warm Gold) - Highlights gifts/star */}
            <spotLight 
                position={[10, 20, 10]} 
                angle={0.3} 
                penumbra={1} 
                intensity={150} 
                color="#fceeb5" 
                castShadow 
            />

            {/* Fill Light (Cool Emerald) - Bodies */}
            <pointLight position={[-10, 5, -10]} intensity={30} color="#00ff88" />

            {/* Rim Light (Sharp White/Gold) - Edge definition */}
            <spotLight position={[0, -5, 10]} angle={0.5} intensity={50} color="#d4af37" />

            {/* Deep Space Stars */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
            
            {/* Falling Snow */}
            <Snow />

            {/* The Main Actor */}
            <Float 
                speed={treeState === TreeState.TREE_SHAPE ? 0.5 : 0.2} 
                rotationIntensity={treeState === TreeState.TREE_SHAPE ? 0.1 : 0.5} 
                floatIntensity={treeState === TreeState.TREE_SHAPE ? 0.2 : 0.5}
            >
                <TreeParticles treeState={treeState} />
            </Float>

            {/* Reflections */}
            <Environment preset="night" environmentIntensity={0.5} />
        </Suspense>

        <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.6} 
            minPolarAngle={Math.PI / 3}
            maxDistance={30}
            minDistance={10}
            autoRotate={true}
            autoRotateSpeed={0.8}
        />

        {/* Cinematic Post Processing */}
        <EffectComposer disableNormalPass>
            {/* Increased Bloom for the lights and star */}
            <Bloom 
                luminanceThreshold={0.9} 
                mipmapBlur 
                intensity={2.0} 
                radius={0.3}
            />
            <Noise opacity={0.03} />
            <Vignette eskil={false} offset={0.1} darkness={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
