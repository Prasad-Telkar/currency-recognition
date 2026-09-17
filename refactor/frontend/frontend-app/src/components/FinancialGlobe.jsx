import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

const FinancialGlobe = () => {
  const globeEl = useRef();
  
  // Simulated data for financial hubs and arcs
  const arcsData = [
    { startLat: 40.7128, startLng: -74.0060, endLat: 51.5074, endLng: -0.1278, color: ['#22d3ee', '#3b82f6'] },
    { startLat: 51.5074, startLng: -0.1278, endLat: 35.6762, endLng: 139.6503, color: ['#3b82f6', '#10b981'] },
    { startLat: 35.6762, startLng: 139.6503, endLat: 1.3521, endLng: 103.8198, color: ['#10b981', '#f59e0b'] },
    { startLat: 1.3521, startLng: 103.8198, endLat: 19.0760, endLng: 72.8777, color: ['#f59e0b', '#22d3ee'] },
  ];

  // Currency data as labels on the surface
  const currenciesData = [
    { lat: 39.8283, lng: -98.5795, text: 'USD', color: '#22d3ee', size: 1.5 },
    { lat: 55.3781, lng: -3.4360, text: 'GBP', color: '#3b82f6', size: 1.5 },
    { lat: 36.2048, lng: 138.2529, text: 'JPY', color: '#10b981', size: 1.5 },
    { lat: -25.2744, lng: 133.7751, text: 'AUD', color: '#f43f5e', size: 1.5 },
    { lat: 46.2276, lng: 2.2137, text: 'EUR', color: '#8b5cf6', size: 1.5 },
    { lat: -14.2350, lng: -51.9253, text: 'BRL', color: '#10b981', size: 1.5 },
    { lat: 20.5937, lng: 78.9629, text: 'INR', color: '#ec4899', size: 1.5 },
    { lat: 23.8859, lng: 45.0792, text: 'SAR', color: '#f59e0b', size: 1.5 }
  ];

  useEffect(() => {
    // Auto-rotate the globe to create the "roaming" effect
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 2.0;
      globeEl.current.controls().enableZoom = false;
      
      // Point camera slightly downwards to view Northern hemisphere better
      globeEl.current.pointOfView({ altitude: 2.5, lat: 20 }, 0);
    }
  }, []);

  return (
    <div style={{ cursor: 'grab', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Globe
        ref={globeEl}
        height={400}
        width={400}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.25}
        
        // Arcs configuration
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1500}
        arcStroke={1}
        
        // Labels configuration
        labelsData={currenciesData}
        labelLat={(d) => d.lat}
        labelLng={(d) => d.lng}
        labelText={(d) => d.text}
        labelSize={(d) => d.size}
        labelDotRadius={0.5}
        labelColor={(d) => d.color}
        labelResolution={2}
      />
    </div>
  );
};

export default FinancialGlobe;
