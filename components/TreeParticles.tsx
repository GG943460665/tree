import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { generateBodyData, generateOrnamentData, generateFrameData, generateSpiralData } from '../utils/math';
import { TreeState } from '../types';

interface TreeParticlesProps {
  treeState: TreeState;
}

const tempObject = new THREE.Object3D();
const tempPos = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();
const tempScatterQuat = new THREE.Quaternion();
const tempTreeQuat = new THREE.Quaternion();

export const TreeParticles: React.FC<TreeParticlesProps> = ({ treeState }) => {
  const bodyRef = useRef<THREE.InstancedMesh>(null);
  const ornamentRef = useRef<THREE.InstancedMesh>(null);
  const frameRef = useRef<THREE.InstancedMesh>(null);
  const spiralRef = useRef<THREE.InstancedMesh>(null);
  const starRef = useRef<THREE.Group>(null);

  // Configuration - Higher density for body
  const BODY_COUNT = 4500;
  const ORNAMENT_COUNT = 150;
  const FRAME_COUNT = 25;
  const SPIRAL_COUNT = 200;
  
  // Data Generation
  const bodyData = useMemo(() => generateBodyData(BODY_COUNT), []);
  const ornamentData = useMemo(() => generateOrnamentData(ORNAMENT_COUNT), []);
  const frameData = useMemo(() => generateFrameData(FRAME_COUNT), []);
  const spiralData = useMemo(() => generateSpiralData(SPIRAL_COUNT), []);

  const animState = useRef({
    currentProgress: 0,
    targetProgress: 0,
  });

  useLayoutEffect(() => {
    animState.current.targetProgress = treeState === TreeState.TREE_SHAPE ? 1 : 0;
  }, [treeState]);

  // Apply static colors
  useLayoutEffect(() => {
    const applyColors = (ref: React.RefObject<THREE.InstancedMesh>, data: any[]) => {
        if(ref.current) {
            data.forEach((d, i) => ref.current!.setColorAt(i, d.color));
            ref.current.instanceColor!.needsUpdate = true;
        }
    };
    applyColors(bodyRef, bodyData);
    applyColors(ornamentRef, ornamentData);
    applyColors(frameRef, frameData);
  }, []);

  useFrame((state, delta) => {
    // Transition Logic
    const smoothing = 2.0 * delta;
    animState.current.currentProgress = THREE.MathUtils.lerp(
      animState.current.currentProgress,
      animState.current.targetProgress,
      smoothing
    );

    const progress = animState.current.currentProgress;
    const time = state.clock.getElapsedTime();

    const updateMesh = (ref: React.RefObject<THREE.InstancedMesh>, data: any[], isSpiral = false) => {
        if (!ref.current) return;
        data.forEach((d, i) => {
            tempPos.lerpVectors(d.scatterPosition, d.treePosition, progress);
            
            // Add life/movement
            if (progress < 0.9) {
                 tempPos.y += Math.sin(time + d.id) * 0.05 * (1 - progress);
            }

            tempScatterQuat.setFromEuler(d.scatterRotation);
            tempTreeQuat.setFromEuler(d.treeRotation);
            tempQuat.slerpQuaternions(tempScatterQuat, tempTreeQuat, progress);

            // Spiral lights pulse
            let scale = d.scale;
            if (isSpiral) {
                scale *= (0.8 + Math.sin(time * 3 + i * 0.2) * 0.3);
            }

            tempObject.position.copy(tempPos);
            tempObject.quaternion.copy(tempQuat);
            tempObject.scale.setScalar(scale);
            tempObject.updateMatrix();
            ref.current!.setMatrixAt(i, tempObject.matrix);
        });
        ref.current.instanceMatrix.needsUpdate = true;
    };

    updateMesh(bodyRef, bodyData);
    updateMesh(ornamentRef, ornamentData);
    updateMesh(frameRef, frameData);
    updateMesh(spiralRef, spiralData, true);

    // Star Animation
    if (starRef.current) {
        const starTreePos = new THREE.Vector3(0, 8.5, 0); 
        const starScatterPos = new THREE.Vector3(0, 25, 0);
        starRef.current.position.lerpVectors(starScatterPos, starTreePos, progress);
        starRef.current.rotation.y = time * 0.5;
        starRef.current.scale.setScalar(THREE.MathUtils.lerp(0.1, 1.2, progress));
    }
  });

  return (
    <group>
      {/* 1. Body (Dense Greenery) */}
      <instancedMesh ref={bodyRef} args={[undefined, undefined, BODY_COUNT]}>
        <tetrahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial roughness={0.8} metalness={0.1} />
      </instancedMesh>

      {/* 2. Ornaments (Spheres) */}
      <instancedMesh ref={ornamentRef} args={[undefined, undefined, ORNAMENT_COUNT]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial roughness={0.2} metalness={0.8} envMapIntensity={1.5} />
      </instancedMesh>

      {/* 3. Frames (Cards/Photos) */}
      <instancedMesh ref={frameRef} args={[undefined, undefined, FRAME_COUNT]}>
        <boxGeometry args={[0.5, 0.6, 0.05]} />
        <meshStandardMaterial color="white" roughness={0.2} metalness={0.1} emissive="#333" />
      </instancedMesh>

      {/* 4. Spiral Lights */}
      <instancedMesh ref={spiralRef} args={[undefined, undefined, SPIRAL_COUNT]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial 
          color="#fffee0" 
          emissive="#fffee0"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </instancedMesh>

      {/* 5. Top Star */}
      <group ref={starRef}>
          <mesh>
             <extrudeGeometry args={[
                new THREE.Shape()
                  .moveTo(0, 1)
                  .lineTo(0.2, 0.2).lineTo(1, 0.2).lineTo(0.4, -0.2).lineTo(0.6, -1)
                  .lineTo(0, -0.5)
                  .lineTo(-0.6, -1).lineTo(-0.4, -0.2).lineTo(-1, 0.2).lineTo(-0.2, 0.2),
                { depth: 0.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1 }
             ]} />
             <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} toneMapped={false} />
          </mesh>
          <pointLight color="#fbbf24" intensity={20} distance={10} decay={2} />
      </group>
    </group>
  );
};
