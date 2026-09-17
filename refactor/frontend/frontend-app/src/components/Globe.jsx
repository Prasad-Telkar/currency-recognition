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
    // LIGHTS — indigo + violet
    // -----------------------------
    const ambientLight = new THREE.AmbientLight(0x818cf8, 1.4);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x6366f1, 5, 20);
    blueLight.position.set(4, 3, 5);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x8b5cf6, 4, 15);
    cyanLight.position.set(-4, -2, 3);
    scene.add(cyanLight);

    // -----------------------------
    // GLOBE GROUP
    // -----------------------------
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const globeRadius = 2.15;

    // -----------------------------
    // HIGH-RES DOT EARTH (From Texture)
    // -----------------------------
    let earthMesh; // Will hold the high-res point cloud

    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}earth-water.png`;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      // In three-globe maps, water is usually one distinct brightness
      const cornerBrightness = (imageData[0] + imageData[1] + imageData[2]) / 3;
      const isWaterBlack = cornerBrightness < 128; 

      const dotGeometry = new THREE.BufferGeometry();
      const dotPositions = [];
      const dotColors = [];

      const latSegments = 160;
      const lonSegments = 320;

      const colorLeft = new THREE.Color(0xec4899);  // Pink/Magenta
      const colorMid = new THREE.Color(0x8b5cf6);   // Violet
      const colorRight = new THREE.Color(0x38bdf8); // Cyan
      const colorOcean = new THREE.Color(0x1e1b4b); // Very dark indigo for ocean volume

      // We skip the extreme poles (lat < 15 and lat > 135) to avoid the dense "squashed disc"
      // artifact at the North and South poles (especially Antarctica).
      for (let lat = 15; lat <= 135; lat++) {
        const phi = (lat / latSegments) * Math.PI; 
        for (let lon = 0; lon <= lonSegments; lon++) {
          const theta = (lon / lonSegments) * Math.PI * 2; 

          const x = Math.floor((lon / lonSegments) * (canvas.width - 1));
          const y = Math.floor((lat / latSegments) * (canvas.height - 1));

          const i = (y * canvas.width + x) * 4;
          const brightness = (imageData[i] + imageData[i+1] + imageData[i+2]) / 3;
          const isLand = isWaterBlack ? brightness > 128 : brightness < 128;

          const px = globeRadius * Math.sin(phi) * Math.cos(theta);
          const py = globeRadius * Math.cos(phi);
          const pz = globeRadius * Math.sin(phi) * Math.sin(theta);

          if (isLand) {
            dotPositions.push(px, py, pz);

            // Create a stunning 3D gradient matching the user's reference perfectly!
            const t = (px / globeRadius + 1) / 2; // Map X from 0 to 1
            const mixedColor = new THREE.Color();
            if (t < 0.5) {
               mixedColor.lerpColors(colorLeft, colorMid, t * 2);
            } else {
               mixedColor.lerpColors(colorMid, colorRight, (t - 0.5) * 2);
            }
            // Add a punch of bright white to the landmass to make it pop
            mixedColor.lerp(new THREE.Color(0xffffff), 0.15);
            dotColors.push(mixedColor.r, mixedColor.g, mixedColor.b);
          } else {
            // Sparse ocean dots to give the sphere 3D volume
            if (Math.random() > 0.94) {
                dotPositions.push(px, py, pz);
                dotColors.push(colorOcean.r, colorOcean.g, colorOcean.b);
            }
          }
        }
      }

      dotGeometry.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
      dotGeometry.setAttribute("color", new THREE.Float32BufferAttribute(dotColors, 3));

      const dotMaterial = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
      });

      earthMesh = new THREE.Points(dotGeometry, dotMaterial);
      globeGroup.add(earthMesh);
    };

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
      color: 0xa855f7,
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
    const startTime = performance.now();

    function animate() {
      animationId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      if (earthMesh) {
          earthMesh.rotation.y = elapsed * 0.08;
      }

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
