/**
 * ROCKMOUNTAI — Globe Component (UK Theme)
 * Interactive draggable globe centred on the UK with UK city markers.
 * Performance: caps DPR to 2, gates by viewport width, pauses offscreen.
 * Respects prefers-reduced-motion (static single frame only).
 */

const DEFAULT_MARKERS = [
  { lat: 51.51, lng: -0.13, label: "London" },
  { lat: 53.48, lng: -2.24, label: "Manchester" },
  { lat: 52.49, lng: -1.89, label: "Birmingham" },
  { lat: 55.95, lng: -3.19, label: "Edinburgh" },
  { lat: 55.86, lng: -4.25, label: "Glasgow" },
  { lat: 53.80, lng: -1.55, label: "Leeds" },
  { lat: 51.45, lng: -2.59, label: "Bristol" },
  { lat: 51.48, lng: -3.18, label: "Cardiff" },
  { lat: 54.60, lng: -5.93, label: "Belfast" },
  { lat: 53.41, lng: -2.98, label: "Liverpool" },
];

const DEFAULT_CONNECTIONS = [
  // Hub-and-spoke from London
  { from: [51.51, -0.13], to: [53.48, -2.24] },   // London → Manchester
  { from: [51.51, -0.13], to: [52.49, -1.89] },   // London → Birmingham
  { from: [51.51, -0.13], to: [55.95, -3.19] },   // London → Edinburgh
  { from: [51.51, -0.13], to: [53.80, -1.55] },   // London → Leeds
  { from: [51.51, -0.13], to: [51.45, -2.59] },   // London → Bristol
  { from: [51.51, -0.13], to: [51.48, -3.18] },   // London → Cardiff
  { from: [51.51, -0.13], to: [54.60, -5.93] },   // London → Belfast
  { from: [51.51, -0.13], to: [53.41, -2.98] },   // London → Liverpool
  // Cross-connections
  { from: [53.48, -2.24], to: [55.95, -3.19] },   // Manchester → Edinburgh
  { from: [52.49, -1.89], to: [51.45, -2.59] },   // Birmingham → Bristol
  { from: [53.48, -2.24], to: [53.80, -1.55] },   // Manchester → Leeds
  { from: [55.95, -3.19], to: [55.86, -4.25] },   // Edinburgh → Glasgow
  { from: [53.48, -2.24], to: [53.41, -2.98] },   // Manchester → Liverpool
  { from: [51.45, -2.59], to: [51.48, -3.18] },   // Bristol → Cardiff
];

function latLngToXYZ(lat, lng, radius) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ];
}

function rotateY(x, y, z, angle) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return [x * cos + z * sin, y, -x * sin + z * cos];
}

function rotateX(x, y, z, angle) {
  const cos = Math.cos(angle), sin = Math.sin(angle);
  return [x, y * cos - z * sin, y * sin + z * cos];
}

function project(x, y, z, cx, cy, fov) {
  const scale = fov / (fov + z);
  return [x * scale + cx, y * scale + cy, z];
}

function initGlobe(canvasId, opts = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Gate by viewport width — skip on small screens
  if (window.innerWidth < 768) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const {
    dotColor = 'rgba(200, 205, 214, ALPHA)',
    arcColor = 'rgba(154, 175, 191, 0.45)',
    markerColor = 'rgba(200, 205, 214, 1)',
    autoRotateSpeed = 0.001,
    connections = DEFAULT_CONNECTIONS,
    markers = DEFAULT_MARKERS,
  } = opts;

  // Start rotation facing the UK (approx longitude 0°)
  let rotY_val = 5.7, rotX_val = 0.22;
  let drag = { active: false, startX: 0, startY: 0, startRotY: 0, startRotX: 0 };
  let animId = 0, time = 0;
  let isVisible = true;

  // Generate Fibonacci sphere dots
  const dots = [];
  const numDots = 1200;
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < numDots; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / numDots);
    dots.push([
      Math.cos(theta) * Math.sin(phi),
      Math.cos(phi),
      Math.sin(theta) * Math.sin(phi),
    ]);
  }

  function draw() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) * 0.42;
    const fov = 600;

    if (!drag.active && !prefersReducedMotion) {
      rotY_val += autoRotateSpeed;
    }
    time += 0.014;

    ctx.clearRect(0, 0, w, h);

    // Outer glow — subtle monochrome
    const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.6);
    glowGrad.addColorStop(0, 'rgba(154, 175, 191, 0.04)');
    glowGrad.addColorStop(1, 'rgba(154, 175, 191, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // Globe outline
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200, 205, 214, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Globe inner fill
    const globeGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, 0, cx, cy, radius);
    globeGrad.addColorStop(0, 'rgba(123, 143, 163, 0.06)');
    globeGrad.addColorStop(1, 'rgba(20, 30, 50, 0.03)');
    ctx.fillStyle = globeGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw dots
    for (let i = 0; i < dots.length; i++) {
      let [x, y, z] = dots[i];
      x *= radius; y *= radius; z *= radius;
      [x, y, z] = rotateX(x, y, z, rotX_val);
      [x, y, z] = rotateY(x, y, z, rotY_val);

      if (z > 0) continue;

      const [sx, sy] = project(x, y, z, cx, cy, fov);
      const depthAlpha = Math.max(0.08, 1 - (z + radius) / (2 * radius));
      const dotSize = 0.9 + depthAlpha * 0.8;

      ctx.beginPath();
      ctx.arc(sx, sy, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = dotColor.replace('ALPHA', depthAlpha.toFixed(2));
      ctx.fill();
    }

    // Draw connection arcs
    for (const conn of connections) {
      const [lat1, lng1] = conn.from;
      const [lat2, lng2] = conn.to;

      let [x1, y1, z1] = latLngToXYZ(lat1, lng1, radius);
      let [x2, y2, z2] = latLngToXYZ(lat2, lng2, radius);

      [x1, y1, z1] = rotateX(x1, y1, z1, rotX_val);
      [x1, y1, z1] = rotateY(x1, y1, z1, rotY_val);
      [x2, y2, z2] = rotateX(x2, y2, z2, rotX_val);
      [x2, y2, z2] = rotateY(x2, y2, z2, rotY_val);

      if (z1 > radius * 0.3 && z2 > radius * 0.3) continue;

      const [sx1, sy1] = project(x1, y1, z1, cx, cy, fov);
      const [sx2, sy2] = project(x2, y2, z2, cx, cy, fov);

      // Elevated midpoint
      const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2, midZ = (z1 + z2) / 2;
      const midLen = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
      const arcH = radius * 1.18;
      const [scx, scy] = project((midX / midLen) * arcH, (midY / midLen) * arcH, (midZ / midLen) * arcH, cx, cy, fov);

      ctx.beginPath();
      ctx.moveTo(sx1, sy1);
      ctx.quadraticCurveTo(scx, scy, sx2, sy2);
      ctx.strokeStyle = arcColor;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Traveling dot
      if (!prefersReducedMotion) {
        const t = (Math.sin(time * 1.1 + lat1 * 0.12) + 1) / 2;
        const tx = (1 - t) * (1 - t) * sx1 + 2 * (1 - t) * t * scx + t * t * sx2;
        const ty = (1 - t) * (1 - t) * sy1 + 2 * (1 - t) * t * scy + t * t * sy2;
        ctx.beginPath();
        ctx.arc(tx, ty, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = markerColor;
        ctx.fill();
      }
    }

    // Draw markers
    for (const marker of markers) {
      let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius);
      [x, y, z] = rotateX(x, y, z, rotX_val);
      [x, y, z] = rotateY(x, y, z, rotY_val);

      if (z > radius * 0.12) continue;

      const [sx, sy] = project(x, y, z, cx, cy, fov);

      // Pulse ring
      if (!prefersReducedMotion) {
        const pulse = Math.sin(time * 2 + marker.lat) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(sx, sy, 4 + pulse * 5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 205, 214, ${(0.12 + pulse * 0.10).toFixed(2)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Marker dot — London gets a larger dot
      const isLondon = marker.label === 'London';
      ctx.beginPath();
      ctx.arc(sx, sy, isLondon ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = markerColor;
      ctx.fill();

      // London extra ring
      if (isLondon) {
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(200, 205, 214, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      if (marker.label) {
        ctx.font = '10px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(200, 205, 214, 0.55)';
        ctx.fillText(marker.label, sx + 9, sy + 3.5);
      }
    }

    // If reduced motion, draw only once
    if (prefersReducedMotion) return;

    if (isVisible) {
      animId = requestAnimationFrame(draw);
    }
  }

  // IntersectionObserver: pause when offscreen
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!isVisible) {
        isVisible = true;
        if (!prefersReducedMotion) {
          animId = requestAnimationFrame(draw);
        }
      }
    } else {
      isVisible = false;
      cancelAnimationFrame(animId);
    }
  }, { threshold: 0.05 });
  observer.observe(canvas);

  // Pause on tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isVisible = false;
      cancelAnimationFrame(animId);
    } else {
      isVisible = true;
      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    }
  });

  // Pointer events for drag
  canvas.addEventListener('pointerdown', (e) => {
    drag = { active: true, startX: e.clientX, startY: e.clientY, startRotY: rotY_val, startRotX: rotX_val };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag.active) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    rotY_val = drag.startRotY + dx * 0.005;
    rotX_val = Math.max(-1, Math.min(1, drag.startRotX + dy * 0.005));
  });
  canvas.addEventListener('pointerup', () => { drag.active = false; });

  // Handle resize
  const ro = new ResizeObserver(() => { /* draw handles resize via clientWidth/Height */ });
  ro.observe(canvas);

  draw();

  return () => { cancelAnimationFrame(animId); ro.disconnect(); observer.disconnect(); };
}

window.initGlobe = initGlobe;
