/**
 * ROCKMOUNT AI — Animated Mountain Background Canvas
 * Layered mountain range drawn from polylines with subtle animation.
 * Mountains sit in the lower ~45% of the viewport.
 * Respects prefers-reduced-motion. DPR capped at 2. Pauses on hidden tab.
 */
(function () {
    'use strict';

    var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var W, H, dpr;
    var paused = false;
    var time = 0;
    var layers = [];

    // ── Mountain layer configuration ─────────────────────────────
    var LAYER_CONFIG = [
        // Furthest back (subtle, slow)
        { yBase: 0.58, amplitude: 0.10, segments: 7, speed: 0.08, strokeAlpha: 0.06, fillAlpha: 0.015, dotAlpha: 0.08, lineWidth: 0.6 },
        // Mid-back
        { yBase: 0.64, amplitude: 0.12, segments: 9, speed: 0.12, strokeAlpha: 0.10, fillAlpha: 0.020, dotAlpha: 0.12, lineWidth: 0.8 },
        // Mid-front
        { yBase: 0.72, amplitude: 0.14, segments: 11, speed: 0.18, strokeAlpha: 0.14, fillAlpha: 0.025, dotAlpha: 0.18, lineWidth: 1.0 },
        // Foreground (most visible)
        { yBase: 0.82, amplitude: 0.10, segments: 14, speed: 0.25, strokeAlpha: 0.20, fillAlpha: 0.030, dotAlpha: 0.25, lineWidth: 1.2 },
    ];

    // ── Simple noise function (smooth random) ────────────────────
    // Attempt seeded smooth noise via cosine interpolation
    function makeNoise(seed) {
        // Generate 64 random values seeded
        var rand = [];
        var s = seed;
        for (var i = 0; i < 64; i++) {
            s = (s * 16807 + 7) % 2147483647;
            rand.push((s % 10000) / 10000);
        }

        return function (x) {
            var xi = Math.floor(x) & 63;
            var xf = x - Math.floor(x);
            var a = rand[xi];
            var b = rand[(xi + 1) & 63];
            // Cosine interpolation for smoothness
            var t = (1 - Math.cos(xf * Math.PI)) * 0.5;
            return a + (b - a) * t;
        };
    }

    // ── Generate mountain points for a layer ─────────────────────
    function generateLayerPoints(cfg, layerIndex) {
        var noise = makeNoise(layerIndex * 137 + 42);
        var points = [];
        var segW = W / cfg.segments;

        for (var i = 0; i <= cfg.segments; i++) {
            var x = i * segW;
            // Base height + noise-driven variation
            var noiseVal = noise(i * 0.8 + layerIndex * 3.7);
            var y = H * cfg.yBase - noiseVal * H * cfg.amplitude;
            points.push({ x: x, baseY: y, noisePhase: i * 0.8 + layerIndex * 3.7 });
        }

        return {
            points: points,
            cfg: cfg,
            noise: noise,
            index: layerIndex
        };
    }

    // ── Resize ────────────────────────────────────────────────────
    function resize() {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.scale(dpr, dpr);

        // Re-generate layer geometry
        layers = [];
        for (var i = 0; i < LAYER_CONFIG.length; i++) {
            layers.push(generateLayerPoints(LAYER_CONFIG[i], i));
        }
    }

    // ── Draw a single mountain layer ─────────────────────────────
    function drawLayer(layer) {
        var cfg = layer.cfg;
        var pts = layer.points;
        var noise = layer.noise;

        // Compute animated Y positions
        var animatedPts = [];
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            // Animate: slow vertical oscillation based on noise phase
            var drift = Math.sin(time * cfg.speed + p.noisePhase * 2.3) * H * 0.008;
            var y = p.baseY + drift;
            animatedPts.push({ x: p.x, y: y });
        }

        // Draw filled mountain shape (gradient fill to bottom)
        ctx.beginPath();
        ctx.moveTo(animatedPts[0].x, animatedPts[0].y);

        // Smooth curve through points using quadratic bezier
        for (var i = 1; i < animatedPts.length; i++) {
            var prev = animatedPts[i - 1];
            var curr = animatedPts[i];
            var cpx = (prev.x + curr.x) / 2;
            var cpy = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
        }
        // Last point
        var last = animatedPts[animatedPts.length - 1];
        ctx.lineTo(last.x, last.y);

        // Close to bottom
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();

        // Gradient fill
        var grad = ctx.createLinearGradient(0, H * 0.5, 0, H);
        grad.addColorStop(0, 'rgba(200, 205, 214, ' + cfg.fillAlpha + ')');
        grad.addColorStop(1, 'rgba(200, 205, 214, ' + (cfg.fillAlpha * 0.3).toFixed(4) + ')');
        ctx.fillStyle = grad;
        ctx.fill();

        // Draw ridge line
        ctx.beginPath();
        ctx.moveTo(animatedPts[0].x, animatedPts[0].y);
        for (var i = 1; i < animatedPts.length; i++) {
            var prev = animatedPts[i - 1];
            var curr = animatedPts[i];
            var cpx = (prev.x + curr.x) / 2;
            var cpy = (prev.y + curr.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
        }
        ctx.lineTo(last.x, last.y);
        ctx.strokeStyle = 'rgba(200, 205, 214, ' + cfg.strokeAlpha + ')';
        ctx.lineWidth = cfg.lineWidth;
        ctx.stroke();

        // Draw vertex dots at each peak
        for (var i = 0; i < animatedPts.length; i++) {
            var pt = animatedPts[i];
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5 + cfg.lineWidth * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(200, 205, 214, ' + cfg.dotAlpha + ')';
            ctx.fill();
        }

        // Draw connection lines between this layer and the next (cross-layer web)
        return animatedPts;
    }

    // ── Draw inter-layer connections ──────────────────────────────
    function drawCrossLines(allLayerPts) {
        for (var l = 0; l < allLayerPts.length - 1; l++) {
            var layer1 = allLayerPts[l];
            var layer2 = allLayerPts[l + 1];
            var alpha = 0.03 + l * 0.01;

            // Connect every 2nd vertex of layer L to the nearest vertex in layer L+1
            for (var i = 0; i < layer1.length; i += 2) {
                var p1 = layer1[i];
                // Find nearest vertex in next layer
                var minDist = Infinity;
                var nearest = null;
                for (var j = 0; j < layer2.length; j++) {
                    var dx = p1.x - layer2[j].x;
                    var dy = p1.y - layer2[j].y;
                    var d = dx * dx + dy * dy;
                    if (d < minDist) {
                        minDist = d;
                        nearest = layer2[j];
                    }
                }
                if (nearest && minDist < (W * 0.2) * (W * 0.2)) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(nearest.x, nearest.y);
                    ctx.strokeStyle = 'rgba(200, 205, 214, ' + alpha.toFixed(3) + ')';
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        }
    }

    // ── Animation loop ───────────────────────────────────────────
    var raf;
    function loop() {
        if (paused) return;

        time += 0.016;
        ctx.clearRect(0, 0, W, H);

        var allLayerPts = [];
        for (var i = 0; i < layers.length; i++) {
            var pts = drawLayer(layers[i]);
            allLayerPts.push(pts);
        }

        // Draw subtle cross-layer connections
        drawCrossLines(allLayerPts);

        raf = requestAnimationFrame(loop);
    }

    // ── Pause when tab is hidden ─────────────────────────────────
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            paused = true;
            cancelAnimationFrame(raf);
        } else {
            paused = false;
            loop();
        }
    });

    // ── Resize debounce ──────────────────────────────────────────
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            cancelAnimationFrame(raf);
            resize();
            if (!paused) loop();
        }, 150);
    });

    // ── Start ────────────────────────────────────────────────────
    resize();

    if (REDUCED) {
        // Draw single static frame
        var allPts = [];
        for (var i = 0; i < layers.length; i++) {
            allPts.push(drawLayer(layers[i]));
        }
        drawCrossLines(allPts);
    } else {
        loop();
    }
})();
