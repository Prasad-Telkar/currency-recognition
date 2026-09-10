import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CURRENCY_ORBIT } from "../data/currencies";

/* ============================================================
   GLOBE — signature hero visual.
   A rotating 3D Earth (three.js) with the five target currencies
   orbiting it as glowing discs.
   ============================================================ */
function Globe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // -----------------------------
    // SCENE
    // -----------------------------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // -----------------------------
    // LIGHTS — blue + cyan
    // -----------------------------
    const ambientLight = new THREE.AmbientLight(0x5b9dff, 1.4);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x2563eb, 5, 20);
    blueLight.position.set(4, 3, 5);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x22d3ee, 3, 15);
    cyanLight.position.set(-4, -2, 3);
    scene.add(cyanLight);

    // -----------------------------
    // GLOBE GROUP
    // -----------------------------
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeRadius = 2.15;

    // -----------------------------
    // WORLD TEXTURE — deep-navy ocean, blue landmasses
    // -----------------------------
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0a1330";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(90,150,255,0.18)";
    ctx.lineWidth = 2;
    for (let x = 0; x <= canvas.width; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const continents = [
      [[170, 250], [240, 190], [330, 180], [390, 230], [370, 300], [300, 330], [250, 390], [190, 360], [150, 300]],
      [[420, 410], [470, 450], [490, 530], [460, 620], [410, 700], [370, 650], [390, 560], [370, 490]],
      [[780, 220], [850, 170], [960, 180], [1030, 240], [1000, 310], [930, 340], [850, 320], [790, 280]],
      [[1080, 270], [1170, 230], [1280, 250], [1370, 320], [1330, 390], [1240, 400], [1180, 360], [1110, 380]],
      [[1040, 430], [1120, 410], [1200, 460], [1170, 560], [1100, 650], [1050, 620], [1010, 540]],
      [[1320, 500], [1410, 470], [1510, 510], [1580, 570], [1520, 640], [1430, 630], [1370, 580]],
      [[1500, 220], [1600, 210], [1700, 260], [1770, 330], [1720, 390], [1630, 350], [1550, 300]],
    ];

    ctx.fillStyle = "#4f8dff";
    ctx.shadowColor = "#8ec5ff";
    ctx.shadowBlur = 18;
    continents.forEach((continent) => {
      ctx.beginPath();
      continent.forEach(([x, y], index) => {
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    const worldTexture = new THREE.CanvasTexture(canvas);
    worldTexture.colorSpace = THREE.SRGBColorSpace;

    // -----------------------------
    // EARTH
    // -----------------------------
    const earthGeometry = new THREE.SphereGeometry(globeRadius, 96, 96);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: worldTexture,
      transparent: true,
      shininess: 90,
      specular: new THREE.Color(0x60a5fa),
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earth);

    // -----------------------------
    // ATMOSPHERE — soft blue glow
    // -----------------------------
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius * 1.08, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphere);

    // -----------------------------
    // LATITUDE / LONGITUDE LINES — kept sparse and faint so they
    // read as structure, not clutter.
    // -----------------------------
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x4a6fa5,
      transparent: true,
      opacity: 0.14,
    });

    for (let i = 0; i < 6; i++) {
      const longitude = (i / 6) * Math.PI;
      const points = [];
      for (let j = 0; j <= 100; j++) {
        const phi = (j / 100) * Math.PI;
        points.push(
          new THREE.Vector3(
            globeRadius * Math.sin(phi) * Math.cos(longitude),
            globeRadius * Math.cos(phi),
            globeRadius * Math.sin(phi) * Math.sin(longitude)
          )
        );
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      globeGroup.add(new THREE.Line(geometry, gridMaterial));
    }

    for (let i = -2; i <= 2; i++) {
      const latitude = (i / 5) * (Math.PI / 2);
      const points = [];
      for (let j = 0; j <= 100; j++) {
        const angle = (j / 100) * Math.PI * 2;
        const radius = globeRadius * Math.cos(latitude);
        points.push(
          new THREE.Vector3(
            radius * Math.cos(angle),
            globeRadius * Math.sin(latitude),
            radius * Math.sin(angle)
          )
        );
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      globeGroup.add(new THREE.Line(geometry, gridMaterial));
    }

    // -----------------------------
    // ORBITING CURRENCY DISCS
    // -----------------------------
    const orbitObjects = [];

    function createCurrencySprite(symbol, color) {
      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = 256;
      spriteCanvas.height = 256;
      const context = spriteCanvas.getContext("2d");
      context.clearRect(0, 0, 256, 256);

      const hex = `#${color.toString(16).padStart(6, "0")}`;
      context.shadowColor = hex;
      context.shadowBlur = 35;
      context.beginPath();
      context.arc(128, 128, 58, 0, Math.PI * 2);
      context.fillStyle = "#0a1020";
      context.fill();
      context.lineWidth = 7;
      context.strokeStyle = hex;
      context.stroke();
      context.shadowBlur = 0;

      context.font = "bold 82px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = hex;
      context.fillText(symbol, 128, 128);

      const texture = new THREE.CanvasTexture(spriteCanvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(0.65, 0.65, 0.65);
      return sprite;
    }

    CURRENCY_ORBIT.forEach((currency, index) => {
      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.x = currency.tilt;
      orbitGroup.rotation.z = index * 0.35;
      scene.add(orbitGroup);

      const orbitPoints = [];
      for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        orbitPoints.push(
          new THREE.Vector3(Math.cos(angle) * currency.radius, 0, Math.sin(angle) * currency.radius)
        );
      }
      const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: currency.color,
        transparent: true,
        opacity: 0.25,
      });
      orbitGroup.add(new THREE.LineLoop(orbitGeometry, orbitMaterial));

      const symbol = createCurrencySprite(currency.symbol, currency.color);
      orbitGroup.add(symbol);

      orbitObjects.push({
        group: orbitGroup,
        symbol,
        radius: currency.radius,
        speed: currency.speed,
        angle: index * 1.2,
      });
    });

    // -----------------------------
    // PARTICLES
    // -----------------------------
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 4.5 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x5b9dff,
      size: 0.025,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // -----------------------------
    // ANIMATION
    // -----------------------------
    let animationId;
    const clock = new THREE.Clock();

    function animate() {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      earth.rotation.y = elapsed * 0.08;
      atmosphere.rotation.y = elapsed * 0.05;

      orbitObjects.forEach((object) => {
        object.angle += object.speed * 0.02;
        object.symbol.position.set(
          Math.cos(object.angle) * object.radius,
          0,
          Math.sin(object.angle) * object.radius
        );
        object.symbol.position.y = Math.sin(elapsed * 1.5 + object.angle) * 0.12;
      });

      particles.rotation.y = elapsed * 0.01;
      renderer.render(scene, camera);
    }
    animate();

    // -----------------------------
    // RESPONSIVE
    // -----------------------------
    function handleResize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    // -----------------------------
    // CLEANUP
    // -----------------------------
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="globe-container" />;
}

export default Globe;
