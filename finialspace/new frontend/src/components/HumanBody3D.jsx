import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import OrganHotspot from './OrganHotspot';

export default function HumanBody3D({
  selectedOrgan = 'leftKidney',
  hoveredOrgan,
  onSelectOrgan,
  onHoverOrgan,
  systems = {
    skeletal: true,
    muscular: true,
    nervous: true,
    cardiovascular: true,
    respiratory: true,
    digestive: true,
    lymphatic: true,
    integumentary: true
  },
  opacities = {
    integumentary: 0.15,
    muscular: 0.92,
    skeletal: 0.95
  },
  organStatuses = {},
  showAnnotations = true,
  autoRotate = false
}) {
  const bodyRoot = useRef();
  const heartRef = useRef();
  const leftLungRef = useRef();
  const rightLungRef = useRef();
  const cerebrumRef = useRef();
  const leftKidneyRef = useRef();

  // Helper for status-driven colors
  const getOrganColor = (id, defaultHex) => {
    const status = organStatuses[id] || 'HEALTHY';
    if (status === 'CRITICAL') return '#FF4B4B';
    if (status === 'WARNING') return '#FF5A36';
    return defaultHex;
  };

  const getEmissive = (id, base = 0.4) => {
    const isSelected = selectedOrgan === id;
    const isHovered = hoveredOrgan === id;
    const status = organStatuses[id] || 'HEALTHY';
    if (status === 'CRITICAL') return 2.2;
    if (status === 'WARNING') return 1.8;
    if (isSelected) return 2.0;
    if (isHovered) return 1.4;
    return base;
  };

  // Continuous physiological animation & 360 rotation
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Auto 360 rotation if enabled
    if (autoRotate && bodyRoot.current) {
      bodyRoot.current.rotation.y += 0.006;
    }

    // Heart beat animation (systole/diastole)
    if (heartRef.current) {
      const beat = 1 + Math.pow(Math.sin(t * 7.5), 10) * 0.14 + Math.pow(Math.sin(t * 7.5 + 0.4), 10) * 0.08;
      heartRef.current.scale.set(beat, beat, beat);
    }

    // Lungs breathing expansion
    const breath = 1 + Math.sin(t * 2.2) * 0.04;
    if (leftLungRef.current) leftLungRef.current.scale.set(breath, breath, breath);
    if (rightLungRef.current) rightLungRef.current.scale.set(breath, breath, breath);

    // Left Kidney glowing filtration pulse
    if (leftKidneyRef.current) {
      const kPulse = 1 + Math.sin(t * 3.0) * 0.04;
      leftKidneyRef.current.scale.set(kPulse, kPulse, kPulse);
    }
  });

  const handlePointerOver = (id) => (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
    if (onHoverOrgan) onHoverOrgan(id);
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    document.body.style.cursor = 'default';
    if (onHoverOrgan) onHoverOrgan(null);
  };

  const handleClick = (id) => (e) => {
    e.stopPropagation();
    if (onSelectOrgan) onSelectOrgan(id);
  };

  // Callouts matching the reference image layout:
  // Cerebrum (top left), Respiratory, Biceps Brachii, Liver (mid left),
  // Heart, Lungs (mid right), Left Kidney (highlighted!), Lymphatic, Femur
  const calloutLabels = useMemo(() => [
    {
      id: 'cerebrum',
      name: 'Cerebrum',
      pos: [-1.3, 2.35, 0.2],
      targetPos: [-0.08, 2.32, 0.05],
      align: 'left'
    },
    {
      id: 'lungs',
      name: 'Respiratory',
      pos: [-1.45, 1.45, 0.2],
      targetPos: [-0.22, 1.35, 0.08],
      align: 'left'
    },
    {
      id: 'bicepsBrachii',
      name: 'Biceps Brachii',
      pos: [-1.55, 1.05, 0.2],
      targetPos: [-0.62, 1.15, 0.06],
      align: 'left'
    },
    {
      id: 'liver',
      name: 'Liver',
      pos: [-1.45, 0.65, 0.2],
      targetPos: [-0.18, 0.72, 0.12],
      align: 'left'
    },
    {
      id: 'heart',
      name: 'Heart',
      pos: [1.35, 1.42, 0.2],
      targetPos: [-0.06, 1.32, 0.14],
      align: 'right'
    },
    {
      id: 'lungs',
      name: 'Lungs',
      pos: [1.4, 1.18, 0.2],
      targetPos: [0.22, 1.25, 0.08],
      align: 'right'
    },
    {
      id: 'leftKidney',
      name: 'Left Kidney',
      pos: [1.45, 0.62, 0.2],
      targetPos: [0.18, 0.58, 0.08],
      align: 'right'
    },
    {
      id: 'lymphatic',
      name: 'Lymphatic',
      pos: [1.5, 0.05, 0.2],
      targetPos: [0.45, 0.05, 0.05],
      align: 'right'
    },
    {
      id: 'femur',
      name: 'Femur',
      pos: [1.4, -0.75, 0.2],
      targetPos: [0.24, -0.65, 0.02],
      align: 'right'
    },
    {
      id: 'femoralNodule',
      name: 'Vascular / Popliteal Hotspot',
      pos: [1.5, -1.18, 0.2],
      targetPos: [0.21, -1.18, 0.08],
      align: 'right'
    }
  ], []);

  return (
    <group ref={bodyRoot} position={[0, -0.2, 0]}>

      {/* ================= 1. INTEGUMENTARY / TRANSLUCENT BODY CONTOUR ================= */}
      {systems.integumentary && (
        <group>
          {/* Cranium envelope */}
          <mesh position={[0, 2.3, 0]}>
            <sphereGeometry args={[0.34, 28, 28]} />
            <meshStandardMaterial
              color="#38BDF8"
              transparent
              opacity={opacities.integumentary * 0.7}
              roughness={0.1}
            />
          </mesh>
          {/* Full body translucent cyber silhouette */}
          <mesh position={[0, 1.35, 0]}>
            <cylinderGeometry args={[0.48, 0.38, 0.88, 24]} />
            <meshStandardMaterial color="#00E5FF" transparent opacity={opacities.integumentary * 0.5} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.36, 0.38, 0.82, 20]} />
            <meshStandardMaterial color="#00E5FF" transparent opacity={opacities.integumentary * 0.45} />
          </mesh>
          {/* Subtle Wireframe contour */}
          <mesh position={[0, 1.35, 0]}>
            <cylinderGeometry args={[0.485, 0.385, 0.88, 14]} />
            <meshBasicMaterial color="#00E5FF" wireframe transparent opacity={0.12} />
          </mesh>
        </group>
      )}

      {/* ================= 2. MUSCULAR SYSTEM (ANATOMICAL RIGHT / SCREEN LEFT) ================= */}
      {systems.muscular && (
        <group>
          {/* Facial Musculature (Temporalis, Masseter, Frontalis on Right Half) */}
          <mesh position={[-0.1, 2.28, 0.08]} scale={[0.85, 0.9, 0.8]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial
              color="#C2410C"
              emissive="#9A3412"
              emissiveIntensity={0.5}
              roughness={0.35}
              transparent
              opacity={opacities.muscular}
            />
          </mesh>

          {/* Neck Muscles (Sternocleidomastoid) */}
          <mesh position={[-0.08, 1.88, 0.04]} rotation={[0, 0, -0.15]}>
            <cylinderGeometry args={[0.04, 0.06, 0.22, 10]} />
            <meshStandardMaterial color="#B91C1C" emissive="#991B1B" emissiveIntensity={0.4} transparent opacity={opacities.muscular} />
          </mesh>

          {/* Right Pectoralis Major (Chest Muscle) */}
          <mesh position={[-0.18, 1.42, 0.12]} rotation={[0.1, 0.1, -0.15]} scale={[1.2, 0.9, 0.6]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial
              color="#DC2626"
              emissive="#B91C1C"
              emissiveIntensity={0.5}
              roughness={0.4}
              transparent
              opacity={opacities.muscular}
            />
          </mesh>

          {/* Right Rectus Abdominis (Six-Pack Striations) */}
          <group position={[-0.08, 0.72, 0.12]}>
            {[0.24, 0.14, 0.04, -0.06, -0.16].map((y, i) => (
              <mesh key={`abs-${i}`} position={[0, y, 0]} scale={[1.2, 0.6, 0.5]}>
                <sphereGeometry args={[0.065, 12, 12]} />
                <meshStandardMaterial color="#C2410C" emissive="#9A3412" emissiveIntensity={0.5} transparent opacity={opacities.muscular} />
              </mesh>
            ))}
          </group>

          {/* Right External Obliques (Lateral Abdominal Muscle) */}
          <mesh position={[-0.24, 0.65, 0.06]} rotation={[0, 0, -0.2]} scale={[0.7, 1.6, 0.6]}>
            <cylinderGeometry args={[0.08, 0.09, 0.45, 12]} />
            <meshStandardMaterial color="#B91C1C" emissive="#991B1B" emissiveIntensity={0.4} transparent opacity={opacities.muscular} />
          </mesh>

          {/* Right Shoulder Deltoid Cap */}
          <mesh position={[-0.56, 1.62, 0.02]} scale={[1.1, 1.2, 0.9]}>
            <sphereGeometry args={[0.16, 14, 14]} />
            <meshStandardMaterial color="#EA580C" emissive="#C2410C" emissiveIntensity={0.5} transparent opacity={opacities.muscular} />
          </mesh>

          {/* Right BICEPS BRACHII (Targeted Callout Structure!) */}
          <group
            position={[-0.62, 1.15, 0.06]}
            onClick={handleClick('bicepsBrachii')}
            onPointerOver={handlePointerOver('bicepsBrachii')}
            onPointerOut={handlePointerOut}
          >
            <mesh rotation={[0, 0, 0.12]} scale={[1.0, 1.6, 0.95]}>
              <capsuleGeometry args={[0.075, 0.45, 12, 12]} />
              <meshStandardMaterial
                color={getOrganColor('bicepsBrachii', '#EF4444')}
                emissive={getOrganColor('bicepsBrachii', '#DC2626')}
                emissiveIntensity={getEmissive('bicepsBrachii', 0.6)}
                roughness={0.3}
                transparent
                opacity={opacities.muscular}
              />
            </mesh>
            {/* White tendon insertion bands */}
            <mesh position={[0, 0.32, 0]}>
              <cylinderGeometry args={[0.035, 0.04, 0.08, 10]} />
              <meshStandardMaterial color="#F8FAFC" emissive="#E2E8F0" emissiveIntensity={0.6} />
            </mesh>
          </group>

          {/* Right Forearm Brachioradialis & Flexors */}
          <mesh position={[-0.78, 0.22, 0.04]} rotation={[0, 0, 0.1]}>
            <capsuleGeometry args={[0.068, 0.65, 12, 12]} />
            <meshStandardMaterial color="#C2410C" emissive="#9A3412" emissiveIntensity={0.45} transparent opacity={opacities.muscular} />
          </mesh>

          {/* Right Hand Musculature & Palm */}
          <group position={[-0.86, -0.22, 0.04]}>
            <mesh scale={[1.0, 1.3, 0.4]}>
              <sphereGeometry args={[0.065, 10, 10]} />
              <meshStandardMaterial color="#C2410C" emissive="#9A3412" emissiveIntensity={0.4} transparent opacity={opacities.muscular} />
            </mesh>
            {/* Thumb */}
            <mesh position={[0.035, 0.02, 0]} rotation={[0, 0, -0.4]}>
              <capsuleGeometry args={[0.016, 0.06, 6, 6]} />
              <meshStandardMaterial color="#C2410C" transparent opacity={opacities.muscular} />
            </mesh>
            {/* Fingers */}
            {[-0.03, -0.01, 0.01, 0.03].map((fx, fi) => (
              <mesh key={`rf-${fi}`} position={[fx, -0.08, 0]}>
                <capsuleGeometry args={[0.012, 0.08, 6, 6]} />
                <meshStandardMaterial color="#C2410C" transparent opacity={opacities.muscular} />
              </mesh>
            ))}
          </group>

          {/* Right Thigh: QUADRICEPS FEMORIS (Rectus Femoris, Vastus Lateralis/Medialis) */}
          <group position={[-0.24, -0.65, 0.04]}>
            {/* Rectus Femoris Central */}
            <mesh scale={[0.85, 1.6, 0.9]}>
              <capsuleGeometry args={[0.09, 0.55, 12, 12]} />
              <meshStandardMaterial color="#DC2626" emissive="#B91C1C" emissiveIntensity={0.5} transparent opacity={opacities.muscular} />
            </mesh>
            {/* Vastus Lateralis */}
            <mesh position={[-0.07, 0, 0]} scale={[0.7, 1.5, 0.8]}>
              <capsuleGeometry args={[0.075, 0.5, 10, 10]} />
              <meshStandardMaterial color="#C2410C" emissive="#9A3412" emissiveIntensity={0.45} transparent opacity={opacities.muscular} />
            </mesh>
          </group>

          {/* Right Calf: GASTROCNEMIUS & TIBIALIS ANTERIOR */}
          <mesh position={[-0.24, -1.82, 0.04]}>
            <capsuleGeometry args={[0.082, 0.75, 12, 12]} />
            <meshStandardMaterial color="#C2410C" emissive="#9A3412" emissiveIntensity={0.5} transparent opacity={opacities.muscular} />
          </mesh>

          {/* Right Foot & Ankle */}
          <group position={[-0.24, -2.36, 0.08]}>
            <mesh scale={[0.9, 0.5, 1.4]} position={[0, 0, 0.04]}>
              <boxGeometry args={[0.1, 0.09, 0.22]} />
              <meshStandardMaterial color="#C2410C" emissive="#9A3412" emissiveIntensity={0.4} transparent opacity={opacities.muscular} />
            </mesh>
          </group>
        </group>
      )}

      {/* ================= 3. SKELETAL SYSTEM (ANATOMICAL LEFT / SCREEN RIGHT) ================= */}
      {systems.skeletal && (
        <group>
          {/* Half Skull (Left Cranium & Orbit Socket) */}
          <group position={[0.09, 2.3, 0]}>
            <mesh scale={[0.85, 0.95, 0.9]}>
              <sphereGeometry args={[0.18, 18, 18]} />
              <meshStandardMaterial color="#F1F5F9" emissive="#CBD5E1" emissiveIntensity={0.4} roughness={0.25} transparent opacity={opacities.skeletal} />
            </mesh>
            {/* Eye Orbit Cavity */}
            <mesh position={[0.05, 0.04, 0.14]}>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshBasicMaterial color="#0F172A" />
            </mesh>
          </group>

          {/* Cervical & Thoracic Spine Column (Backbone) */}
          <group position={[0, 1.25, -0.06]}>
            {[-0.5, -0.38, -0.26, -0.14, -0.02, 0.1, 0.22, 0.34, 0.46, 0.58].map((sy, si) => (
              <mesh key={`spine-${si}`} position={[0, sy, 0]}>
                <boxGeometry args={[0.05, 0.04, 0.04]} />
                <meshStandardMaterial color="#F8FAFC" emissive="#E2E8F0" emissiveIntensity={0.4} transparent opacity={opacities.skeletal} />
              </mesh>
            ))}
          </group>

          {/* Left Clavicle & Shoulder Girdle */}
          <mesh position={[0.26, 1.72, 0.06]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.02, 0.022, 0.32, 10]} />
            <meshStandardMaterial color="#F1F5F9" emissive="#CBD5E1" emissiveIntensity={0.5} transparent opacity={opacities.skeletal} />
          </mesh>

          {/* Left Ribcage Arches (Bone ribs exposed on left) */}
          <group position={[0.15, 1.25, 0]}>
            {[-0.24, -0.16, -0.08, 0, 0.08, 0.16, 0.24].map((offsetY, idx) => (
              <mesh key={`rib-skel-${idx}`} position={[0, offsetY, 0]} rotation={[0.06, 0, 0]}>
                <torusGeometry args={[0.24 - Math.abs(offsetY) * 0.15, 0.018, 8, 20, Math.PI * 0.95]} />
                <meshStandardMaterial color="#F1F5F9" emissive="#CBD5E1" emissiveIntensity={0.4} transparent opacity={opacities.skeletal} />
              </mesh>
            ))}
          </group>

          {/* Left Arm Humerus, Radius & Ulna */}
          <mesh position={[0.62, 1.15, 0]}>
            <cylinderGeometry args={[0.032, 0.035, 0.65, 10]} />
            <meshStandardMaterial color="#F1F5F9" emissive="#CBD5E1" emissiveIntensity={0.45} transparent opacity={opacities.skeletal} />
          </mesh>
          <mesh position={[0.78, 0.22, 0]}>
            <cylinderGeometry args={[0.026, 0.028, 0.72, 10]} />
            <meshStandardMaterial color="#F1F5F9" emissive="#CBD5E1" emissiveIntensity={0.45} transparent opacity={opacities.skeletal} />
          </mesh>

          {/* Left Hand Skeleton & Metacarpals */}
          <group position={[0.86, -0.22, 0]}>
            {/* Carpal wrist joint */}
            <mesh>
              <sphereGeometry args={[0.032, 8, 8]} />
              <meshStandardMaterial color="#F8FAFC" emissive="#E2E8F0" emissiveIntensity={0.5} transparent opacity={opacities.skeletal} />
            </mesh>
            {/* Metacarpal phalanges finger bones */}
            {[-0.02, -0.005, 0.01, 0.025].map((bx, bi) => (
              <mesh key={`bf-${bi}`} position={[bx, -0.07, 0]}>
                <cylinderGeometry args={[0.006, 0.007, 0.07, 6]} />
                <meshStandardMaterial color="#F8FAFC" emissive="#CBD5E1" emissiveIntensity={0.45} transparent opacity={opacities.skeletal} />
              </mesh>
            ))}
          </group>

          {/* Left Pelvic Girdle & Iliac Crest */}
          <mesh position={[0.15, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.045, 10, 20]} />
            <meshStandardMaterial color="#F1F5F9" emissive="#CBD5E1" emissiveIntensity={0.45} transparent opacity={opacities.skeletal} />
          </mesh>

          {/* Left FEMUR BONE (Targeted Callout Structure!) */}
          <group
            position={[0.24, -0.65, 0]}
            onClick={handleClick('femur')}
            onPointerOver={handlePointerOver('femur')}
            onPointerOut={handlePointerOut}
          >
            <mesh>
              <cylinderGeometry args={[0.04, 0.045, 0.95, 12]} />
              <meshStandardMaterial
                color={getOrganColor('femur', '#F8FAFC')}
                emissive={getOrganColor('femur', '#CBD5E1')}
                emissiveIntensity={getEmissive('femur', 0.5)}
                roughness={0.2}
                transparent
                opacity={opacities.skeletal}
              />
            </mesh>
            {/* Patella Kneecap */}
            <mesh position={[0, -0.48, 0.04]}>
              <sphereGeometry args={[0.038, 10, 10]} />
              <meshStandardMaterial color="#F8FAFC" emissive="#CBD5E1" emissiveIntensity={0.6} />
            </mesh>
          </group>

          {/* Left Tibia & Fibula Shinbones */}
          <mesh position={[0.24, -1.82, 0]}>
            <cylinderGeometry args={[0.034, 0.036, 1.05, 10]} />
            <meshStandardMaterial color="#F1F5F9" emissive="#CBD5E1" emissiveIntensity={0.45} transparent opacity={opacities.skeletal} />
          </mesh>

          {/* Left Foot Skeleton & Tarsals */}
          <group position={[0.24, -2.36, 0.06]}>
            <mesh position={[0, 0, -0.02]}>
              <boxGeometry args={[0.07, 0.06, 0.18]} />
              <meshStandardMaterial color="#F8FAFC" emissive="#CBD5E1" emissiveIntensity={0.5} transparent opacity={opacities.skeletal} />
            </mesh>
          </group>
        </group>
      )}

      {/* ================= 4. CENTRAL INTERNAL ORGANS ================= */}
      {/* CEREBRUM (Exposed Brain with Callout) */}
      {systems.nervous && (
        <group
          ref={cerebrumRef}
          position={[-0.02, 2.34, 0.04]}
          onClick={handleClick('cerebrum')}
          onPointerOver={handlePointerOver('cerebrum')}
          onPointerOut={handlePointerOut}
        >
          <mesh scale={[1, 0.9, 1.25]}>
            <sphereGeometry args={[0.155, 18, 18]} />
            <meshStandardMaterial
              color={getOrganColor('cerebrum', '#38BDF8')}
              emissive={getOrganColor('cerebrum', '#0284C7')}
              emissiveIntensity={getEmissive('cerebrum', 0.8)}
              roughness={0.25}
            />
          </mesh>
          <mesh position={[-0.04, 0.04, 0.06]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#35D07F" emissive="#35D07F" emissiveIntensity={1.8} />
          </mesh>
        </group>
      )}

      {/* HEART & CARDIOVASCULAR (Beating Cardiac Muscle with Callout) */}
      {systems.cardiovascular && (
        <group
          ref={heartRef}
          position={[-0.06, 1.32, 0.12]}
          onClick={handleClick('heart')}
          onPointerOver={handlePointerOver('heart')}
          onPointerOut={handlePointerOut}
        >
          <mesh rotation={[0.1, 0.1, -0.3]}>
            <sphereGeometry args={[0.125, 20, 20]} />
            <meshStandardMaterial
              color={getOrganColor('heart', '#EF4444')}
              emissive={getOrganColor('heart', '#DC2626')}
              emissiveIntensity={getEmissive('heart', 1.0)}
              roughness={0.2}
            />
          </mesh>
          {/* Aortic Arch */}
          <mesh position={[0.03, 0.13, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.06, 0.024, 10, 18, Math.PI * 0.9]} />
            <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={1.2} />
          </mesh>

          {/* Branching Arterial Vessels & Golden Lymph Nodes (Matching Reference Image) */}
          <group>
            {/* Carotid arteries up neck */}
            <mesh position={[-0.04, 1.85, 0.08]} rotation={[0, 0, 0.06]}>
              <cylinderGeometry args={[0.008, 0.01, 0.32, 6]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[0.04, 1.85, 0.08]} rotation={[0, 0, -0.06]}>
              <cylinderGeometry args={[0.008, 0.01, 0.32, 6]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.8} />
            </mesh>
            {/* Thoracic & Abdominal Aorta descending */}
            <mesh position={[0, 0.72, 0.04]}>
              <cylinderGeometry args={[0.014, 0.016, 0.95, 8]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.8} />
            </mesh>
            {/* Left Brachial & Radial Artery down Left Arm */}
            <mesh position={[0.45, 1.15, 0.04]} rotation={[0, 0, -0.22]}>
              <cylinderGeometry args={[0.007, 0.008, 0.65, 6]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0.68, 0.35, 0.04]} rotation={[0, 0, -0.15]}>
              <cylinderGeometry args={[0.005, 0.006, 0.7, 6]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.7} />
            </mesh>
            {/* Golden Lymphatic Nodes along Left Arm */}
            {[
              [0.38, 1.25, 0.05],
              [0.48, 1.05, 0.05],
              [0.58, 0.75, 0.05],
              [0.64, 0.45, 0.05],
              [0.72, 0.15, 0.05]
            ].map(([gx, gy, gz], gi) => (
              <mesh key={`arm-node-${gi}`} position={[gx, gy, gz]}>
                <sphereGeometry args={[0.018, 8, 8]} />
                <meshStandardMaterial color="#F5B942" emissive="#EAB308" emissiveIntensity={1.4} />
              </mesh>
            ))}
            {/* Right Femoral & Tibial Artery down Right Leg */}
            <mesh position={[-0.18, -0.55, 0.06]} rotation={[0, 0, 0.08]}>
              <cylinderGeometry args={[0.009, 0.01, 0.85, 6]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[-0.22, -1.65, 0.06]}>
              <cylinderGeometry args={[0.006, 0.008, 1.05, 6]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.7} />
            </mesh>
            {/* Left Femoral & Popliteal Artery down Left Leg */}
            <mesh position={[0.18, -0.55, 0.06]} rotation={[0, 0, -0.08]}>
              <cylinderGeometry args={[0.009, 0.01, 0.85, 6]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.7} />
            </mesh>
            <mesh position={[0.22, -1.65, 0.06]}>
              <cylinderGeometry args={[0.006, 0.008, 1.05, 6]} />
              <meshStandardMaterial color="#EF4444" emissive="#DC2626" emissiveIntensity={0.7} />
            </mesh>
            {/* PROMINENT GOLDEN LYMPH/VASCULAR NODULE ON LEFT LEG (EXACT MATCH TO REFERENCE IMAGE!) */}
            <group
              position={[0.21, -1.18, 0.08]}
              onClick={handleClick('femoralNodule')}
              onPointerOver={handlePointerOver('femoralNodule')}
              onPointerOut={handlePointerOut}
            >
              <mesh>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshStandardMaterial
                  color="#F5B942"
                  emissive="#EAB308"
                  emissiveIntensity={getEmissive('femoralNodule', 1.8)}
                />
              </mesh>
              {/* Pulsing ring aura around nodule */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.06, 0.08, 16]} />
                <meshBasicMaterial color="#F5B942" transparent opacity={0.7} side={THREE.DoubleSide} />
              </mesh>
            </group>
          </group>
        </group>
      )}

      {/* RESPIRATORY / LUNGS (Dual Lobes with Callout) */}
      {systems.respiratory && (
        <group>
          {/* Right Lung (Screen Left / Reddish coral) */}
          <group
            ref={leftLungRef}
            position={[-0.22, 1.35, 0.06]}
            onClick={handleClick('lungs')}
            onPointerOver={handlePointerOver('lungs')}
            onPointerOut={handlePointerOut}
          >
            <mesh scale={[0.85, 1.45, 0.8]}>
              <sphereGeometry args={[0.15, 20, 20]} />
              <meshStandardMaterial
                color={getOrganColor('lungs', '#FB7185')}
                emissive={getOrganColor('lungs', '#E11D48')}
                emissiveIntensity={getEmissive('lungs', 0.65)}
                transparent
                opacity={0.88}
              />
            </mesh>
          </group>

          {/* Left Lung (Screen Right / Translucent Blue) */}
          <group
            ref={rightLungRef}
            position={[0.18, 1.35, 0.06]}
            onClick={handleClick('lungs')}
            onPointerOver={handlePointerOver('lungs')}
            onPointerOut={handlePointerOut}
          >
            <mesh scale={[0.82, 1.42, 0.78]}>
              <sphereGeometry args={[0.145, 20, 20]} />
              <meshStandardMaterial
                color={getOrganColor('lungs', '#38BDF8')}
                emissive={getOrganColor('lungs', '#0284C7')}
                emissiveIntensity={getEmissive('lungs', 0.7)}
                transparent
                opacity={0.82}
              />
            </mesh>
          </group>

          {/* Trachea windpipe */}
          <mesh position={[0, 1.76, 0.06]}>
            <cylinderGeometry args={[0.024, 0.028, 0.35, 12]} />
            <meshStandardMaterial color="#38BDF8" emissive="#0284C7" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {/* HEPATIC LIVER (Large Wedge with Callout) */}
      {systems.digestive && (
        <group
          position={[-0.15, 0.76, 0.1]}
          onClick={handleClick('liver')}
          onPointerOver={handlePointerOver('liver')}
          onPointerOut={handlePointerOut}
        >
          <mesh rotation={[0.1, 0.1, -0.2]} scale={[1.35, 0.88, 0.8]}>
            <sphereGeometry args={[0.14, 18, 18]} />
            <meshStandardMaterial
              color={getOrganColor('liver', '#B91C1C')}
              emissive={getOrganColor('liver', '#991B1B')}
              emissiveIntensity={getEmissive('liver', 0.6)}
              roughness={0.3}
            />
          </mesh>
        </group>
      )}

      {/* STOMACH */}
      {systems.digestive && (
        <group position={[0.12, 0.78, 0.08]}>
          <mesh rotation={[0, 0, 0.4]} scale={[1.15, 0.9, 0.75]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial color="#EA580C" emissive="#C2410C" emissiveIntensity={0.5} />
          </mesh>
        </group>
      )}

      {/* ================= LEFT KIDNEY (EXACT HIGHLIGHTED STRUCTURE IN REFERENCE IMAGE!) ================= */}
      <group
        ref={leftKidneyRef}
        position={[0.18, 0.58, 0.08]}
        onClick={handleClick('leftKidney')}
        onPointerOver={handlePointerOver('leftKidney')}
        onPointerOut={handlePointerOut}
      >
        {/* Left Kidney Bean Shape with Glowing Translucent Blue Hologram */}
        <mesh rotation={[0.1, 0.2, -0.3]} scale={[0.85, 1.35, 0.75]}>
          <sphereGeometry args={[0.09, 20, 20]} />
          <meshStandardMaterial
            color={selectedOrgan === 'leftKidney' ? '#00E5FF' : getOrganColor('leftKidney', '#38BDF8')}
            emissive={selectedOrgan === 'leftKidney' ? '#00E5FF' : getOrganColor('leftKidney', '#0284C7')}
            emissiveIntensity={selectedOrgan === 'leftKidney' ? 2.5 : getEmissive('leftKidney', 1.0)}
            transparent
            opacity={0.88}
            roughness={0.15}
          />
        </mesh>
        {/* Kidney Active Selection Aura Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.14, 0.17, 24]} />
          <meshBasicMaterial
            color="#00E5FF"
            transparent
            opacity={selectedOrgan === 'leftKidney' ? 0.9 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Right Kidney (Opposite side) */}
      <group position={[-0.18, 0.56, 0.06]}>
        <mesh rotation={[0.1, -0.2, 0.3]} scale={[0.85, 1.3, 0.7]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial color="#B45309" emissive="#92400E" emissiveIntensity={0.4} />
        </mesh>
      </group>

      {/* DIGESTIVE INTESTINES (Segmented Colon & Small Intestine) */}
      {systems.digestive && (
        <group position={[0, 0.26, 0.1]}>
          {/* Transverse Colon Segments */}
          <group position={[0, 0.16, 0.04]}>
            {[-0.16, -0.1, -0.04, 0.02, 0.08, 0.14].map((x, i) => (
              <mesh key={`trans-col-${i}`} position={[x, 0, 0]}>
                <sphereGeometry args={[0.044, 10, 10]} />
                <meshStandardMaterial color="#FB923C" emissive="#EA580C" emissiveIntensity={0.5} />
              </mesh>
            ))}
          </group>
          {/* Small Intestine Coils */}
          <mesh position={[0, -0.06, 0.02]} rotation={[Math.PI / 2.2, 0, 0]}>
            <torusGeometry args={[0.12, 0.038, 10, 20]} />
            <meshStandardMaterial color="#F97316" emissive="#C2410C" emissiveIntensity={0.45} />
          </mesh>
        </group>
      )}

      {/* LYMPHATIC VESSELS & NODES (With Callout) */}
      {systems.lymphatic && (
        <group
          position={[0.42, 0.08, 0.06]}
          onClick={handleClick('lymphatic')}
          onPointerOver={handlePointerOver('lymphatic')}
          onPointerOut={handlePointerOut}
        >
          <mesh>
            <sphereGeometry args={[0.038, 10, 10]} />
            <meshStandardMaterial color="#22C55E" emissive="#16A34A" emissiveIntensity={getEmissive('lymphatic', 1.2)} />
          </mesh>
          <mesh position={[-0.04, 0.18, 0]}>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshStandardMaterial color="#22C55E" emissive="#16A34A" emissiveIntensity={1.0} />
          </mesh>
        </group>
      )}

      {/* ================= 5. HOLOGRAPHIC CALLOUT LEADER LINES (EXACT IMAGE REPLICA) ================= */}
      {showAnnotations && calloutLabels.map(item => {
        const isSelected = selectedOrgan === item.id;
        const color = isSelected ? '#00E5FF' : '#94A3B8';

        return (
          <group key={item.name}>
            {/* Leader Line */}
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) => {
                  const pts = [
                    new THREE.Vector3(...item.pos),
                    new THREE.Vector3(...item.targetPos)
                  ];
                  self.setFromPoints(pts);
                }}
              />
              <lineBasicMaterial attach="material" color={color} transparent opacity={isSelected ? 0.95 : 0.45} />
            </line>

            {/* Target Dot */}
            <mesh position={item.targetPos}>
              <sphereGeometry args={[0.024, 8, 8]} />
              <meshBasicMaterial color={color} />
            </mesh>

            {/* HTML Floating Callout Tag */}
            <Html
              position={item.pos}
              distanceFactor={6.2}
              center
              style={{
                pointerEvents: 'auto',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectOrgan(item.id);
                }}
                style={{
                  background: isSelected ? 'rgba(0, 229, 255, 0.22)' : 'rgba(15, 23, 42, 0.75)',
                  border: `1px solid ${isSelected ? '#00E5FF' : 'rgba(255, 255, 255, 0.18)'}`,
                  borderRadius: '4px',
                  padding: '3px 8px',
                  boxShadow: isSelected ? '0 0 14px rgba(0, 229, 255, 0.7)' : '0 2px 6px rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(6px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                }}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: isSelected ? '#00E5FF' : '#94A3B8'
                }} />
                <span style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  letterSpacing: '0.04em'
                }}>
                  {item.name}
                </span>
              </div>
            </Html>
          </group>
        );
      })}

      {/* Holographic Circular Floor Pedestal */}
      <group position={[0, -2.45, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 1.4, 32]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.38, 1.4, 32]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

    </group>
  );
}
