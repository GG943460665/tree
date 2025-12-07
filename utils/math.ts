import * as THREE from 'three';
import { ParticleData } from '../types';

// Helper to generate a random point inside a sphere
const randomPointInSphere = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

const getRandomColor = (palette: THREE.Color[]) => {
  return palette[Math.floor(Math.random() * palette.length)].clone();
};

// 1. Tree Body (Dark Green with snowy accents)
const BODY_COLORS = [
  new THREE.Color('#0f3d24'), // Deep Pine Green
  new THREE.Color('#1a5235'), // Lighter Pine
  new THREE.Color('#0a2615'), // Darkest
  new THREE.Color('#ffffff'), // Snow tip
];

export const generateBodyData = (count: number): ParticleData[] => {
  const data: ParticleData[] = [];
  const treeHeight = 16;
  const treeBaseRadius = 7;

  for (let i = 0; i < count; i++) {
    const scatterPos = randomPointInSphere(20);
    
    const y = Math.random() * treeHeight; 
    const relativeH = y / treeHeight; 
    // Slightly curved cone for fuller look
    const currentRadius = treeBaseRadius * Math.pow((1 - relativeH), 0.9); 
    
    const angle = Math.random() * Math.PI * 2;
    // Distribute throughout the volume but denser at surface
    const r = currentRadius * Math.pow(Math.random(), 0.3); 

    const treePos = new THREE.Vector3(
      r * Math.cos(angle),
      y - treeHeight / 2, 
      r * Math.sin(angle)
    );

    const scatterRot = new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    const treeRot = new THREE.Euler(Math.random() * 0.5, Math.random() * Math.PI * 2, 0);

    data.push({
      id: i,
      scatterPosition: scatterPos,
      treePosition: treePos,
      scatterRotation: scatterRot,
      treeRotation: treeRot,
      scale: 0.4 + Math.random() * 0.5,
      color: getRandomColor(BODY_COLORS)
    });
  }
  return data;
};

// 2. Ornaments (Spheres: Red, Blue, Gold, Silver)
const ORNAMENT_COLORS = [
  new THREE.Color('#dc2626'), // Red
  new THREE.Color('#2563eb'), // Blue
  new THREE.Color('#fbbf24'), // Gold
  new THREE.Color('#e5e7eb'), // Silver
];

export const generateOrnamentData = (count: number): ParticleData[] => {
  const data: ParticleData[] = [];
  const treeHeight = 15;
  const treeBaseRadius = 7;

  for (let i = 0; i < count; i++) {
    const scatterPos = randomPointInSphere(22);

    const y = Math.random() * treeHeight;
    const relativeH = y / treeHeight;
    const currentRadius = treeBaseRadius * Math.pow((1 - relativeH), 0.9);
    
    const angle = Math.random() * Math.PI * 2;
    const r = currentRadius * 0.95; // On surface

    const treePos = new THREE.Vector3(
      r * Math.cos(angle),
      y - treeHeight / 2,
      r * Math.sin(angle)
    );

    const scatterRot = new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    const treeRot = new THREE.Euler(0, angle, 0);

    data.push({
      id: i + 10000,
      scatterPosition: scatterPos,
      treePosition: treePos,
      scatterRotation: scatterRot,
      treeRotation: treeRot,
      scale: 0.5 + Math.random() * 0.4,
      color: getRandomColor(ORNAMENT_COLORS)
    });
  }
  return data;
};

// 3. Frames (White Cards)
export const generateFrameData = (count: number): ParticleData[] => {
  const data: ParticleData[] = [];
  const treeHeight = 15;
  const treeBaseRadius = 7;

  for (let i = 0; i < count; i++) {
    const scatterPos = randomPointInSphere(22);

    const y = Math.random() * treeHeight;
    const relativeH = y / treeHeight;
    const currentRadius = treeBaseRadius * Math.pow((1 - relativeH), 0.9);
    
    const angle = Math.random() * Math.PI * 2;
    const r = currentRadius * 1.0; // Slightly sticking out

    const treePos = new THREE.Vector3(
      r * Math.cos(angle),
      y - treeHeight / 2,
      r * Math.sin(angle)
    );

    const scatterRot = new THREE.Euler(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    // Face outward
    const treeRot = new THREE.Euler(0, -angle, 0);

    data.push({
      id: i + 30000,
      scatterPosition: scatterPos,
      treePosition: treePos,
      scatterRotation: scatterRot,
      treeRotation: treeRot,
      scale: 0.8,
      color: new THREE.Color('#ffffff')
    });
  }
  return data;
};

// 4. Spiral Lights (Small White/Yellow dots)
export const generateSpiralData = (count: number): ParticleData[] => {
  const data: ParticleData[] = [];
  const treeHeight = 16;
  const treeBaseRadius = 7.5; // Wider than tree
  const loops = 8;

  for (let i = 0; i < count; i++) {
    const scatterPos = randomPointInSphere(25);

    const progress = i / count;
    const y = progress * treeHeight;
    const relativeH = y / treeHeight;
    const currentRadius = treeBaseRadius * Math.pow((1 - relativeH), 0.9);
    
    const angle = progress * Math.PI * 2 * loops;

    const treePos = new THREE.Vector3(
      currentRadius * Math.cos(angle),
      y - treeHeight / 2,
      currentRadius * Math.sin(angle)
    );

    data.push({
      id: i + 20000,
      scatterPosition: scatterPos,
      treePosition: treePos,
      scatterRotation: new THREE.Euler(),
      treeRotation: new THREE.Euler(),
      scale: 0.2, // Small lights
      color: new THREE.Color('#fffee0')
    });
  }
  return data;
};
