import React from 'react';
import { Html } from '@react-three/drei';

export default function OrganHotspot({
  position,
  label,
  status = 'HEALTHY', // HEALTHY, WARNING, CRITICAL
  isSelected = false,
  isHovered = false,
  onClick,
  onPointerOver,
  onPointerOut
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'CRITICAL':
        return '#FF4B4B';
      case 'WARNING':
        return '#FF5A36';
      case 'HEALTHY':
      default:
        return '#35D07F';
    }
  };

  const color = getStatusColor();

  return (
    <group position={position}>
      {/* 3D Glowing Beacon Sphere */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          if (onPointerOver) onPointerOver();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'default';
          if (onPointerOut) onPointerOut();
        }}
      >
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected || isHovered ? 2.5 : 1.2}
          roughness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Outer Pulse Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.12, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={status === 'CRITICAL' ? 0.8 : 0.4}
          side={2}
        />
      </mesh>

      {/* HTML Floating Tag */}
      <Html
        distanceFactor={6}
        center
        position={[0, 0.16, 0]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <div
          style={{
            background: isSelected ? 'rgba(17, 17, 19, 0.95)' : 'rgba(5, 5, 5, 0.75)',
            border: `1px solid ${isSelected ? color : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '6px',
            padding: '3px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: isSelected ? `0 0 12px ${color}` : '0 2px 8px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
            transform: isHovered || isSelected ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}`
            }}
          />
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#FFFFFF',
              textTransform: 'uppercase'
            }}
          >
            {label}
          </span>
        </div>
      </Html>
    </group>
  );
}
