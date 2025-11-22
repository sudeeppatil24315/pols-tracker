import L from 'leaflet';

// This file contains utility functions for creating vehicle marker icons
// The actual marker management is done in MapView component

/**
 * Create custom SVG truck icon based on vehicle status
 */
export function createTruckIcon(
  status: 'on-time' | 'warning' | 'critical',
  isSelected: boolean,
  heading: number = 0
): L.DivIcon {
  const colors = {
    'on-time': '#22C55E',
    warning: '#F9D71C',
    critical: '#EF4444',
  };

  const color = colors[status];
  const size = isSelected ? 48 : 36;

  // Custom truck SVG
  const truckSvg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="8" width="12" height="8" rx="1" fill="${color}" stroke="white" stroke-width="1.5"/>
      <rect x="14" y="10" width="6" height="6" rx="1" fill="${color}" stroke="white" stroke-width="1.5"/>
      <path d="M14 10L14 8C14 7.44772 14.4477 7 15 7H18L20 10H14Z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="7" cy="17" r="2" fill="#333" stroke="white" stroke-width="1"/>
      <circle cx="17" cy="17" r="2" fill="#333" stroke="white" stroke-width="1"/>
      <circle cx="7" cy="17" r="1" fill="#666"/>
      <circle cx="17" cy="17" r="1" fill="#666"/>
    </svg>
  `;

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(${heading}deg);
      transition: transform 0.3s ease;
      filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
      ${isSelected ? 'filter: drop-shadow(0 4px 12px rgba(0,0,0,0.6));' : ''}
    ">
      ${truckSvg}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'vehicle-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/**
 * Create chicken truck icon (Los Pollos themed)
 */
export function createChickenTruckIcon(
  status: 'on-time' | 'warning' | 'critical',
  isSelected: boolean,
  heading: number = 0
): L.DivIcon {
  const colors = {
    'on-time': '#22C55E',
    warning: '#F9D71C',
    critical: '#EF4444',
  };

  const color = colors[status];
  const size = isSelected ? 48 : 36;
  const haloSize = size * 2;

  // Add pulsing halo for critical status
  const halo = status === 'critical' ? `
    <div style="
      position: absolute;
      width: ${haloSize}px;
      height: ${haloSize}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, rgba(239, 68, 68, 0) 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: halo-pulse 2s infinite;
      pointer-events: none;
    "></div>
  ` : '';

  const html = `
    <div style="position: relative; width: ${size}px; height: ${size}px;">
      ${halo}
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 3px solid white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${size * 0.6}px;
        transform: rotate(${heading}deg);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ${isSelected ? 'transform: rotate(' + heading + 'deg) scale(1.1);' : ''}
        ${status === 'critical' ? 'animation: pulse-marker 2s infinite;' : ''}
        z-index: 10;
      ">
        🚚
      </div>
    </div>
    <style>
      @keyframes pulse-marker {
        0%, 100% { 
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.6);
          transform: rotate(${heading}deg) scale(1);
        }
        50% { 
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.9);
          transform: rotate(${heading}deg) scale(1.05);
        }
      }
      @keyframes halo-pulse {
        0%, 100% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.7;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.3);
          opacity: 0.3;
        }
      }
    </style>
  `;

  return L.divIcon({
    html,
    className: 'vehicle-marker',
    iconSize: [haloSize, haloSize],
    iconAnchor: [haloSize / 2, haloSize / 2],
  });
}
