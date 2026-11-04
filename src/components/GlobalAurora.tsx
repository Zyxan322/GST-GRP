import { useEffect, useRef } from "react";

// WebGL Vertex Shader (fullscreen quad)
const VS_SOURCE = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// WebGL Fragment Shader - Soft Opera-style Aurora (reduced brightness edition)
const FS_SOURCE = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// 2D Simplex noise
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // ── Palette (unchanged) ──────────────────────────────────────────────────
  vec3 cDeepCharcoal = vec3(0.0314, 0.0392, 0.0588);  // #080A0F
  vec3 cMidnight     = vec3(0.0627, 0.0784, 0.1137);  // #10141D
  // Steel/ice used only at reduced mix weights — no raw silver-blue addition
  vec3 cSteelBlue    = vec3(0.2000, 0.2667, 0.3647);  // #33445D
  vec3 cSoftIce      = vec3(0.4588, 0.6039, 0.7686);  // #759AC4
  // SilverBlue kept for final peak tint but heavily scaled down
  vec3 cSilverBlue   = vec3(0.6549, 0.7412, 0.8392);  // #A7BDD6

  // ── Time (unchanged) ─────────────────────────────────────────────────────
  float t = u_time * 0.44;

  // ── Base background ──────────────────────────────────────────────────────
  float baseDist = uv.y * 0.82 + 0.18 * sin(uv.x * 2.0 + t * 0.25);
  vec3 color = mix(cDeepCharcoal, cMidnight, clamp(baseDist, 0.0, 1.0));

  // ── Mouse parallax (unchanged) ───────────────────────────────────────────
  vec2 mouseDrift = (u_mouse - 0.5) * 0.035;

  // ── Domain warp (unchanged — keeps exact same movement) ─────────────────
  vec2 warp = vec2(
    snoise(vec2(uv.x * 1.5 + t * 0.20, uv.y * 1.3 - t * 0.14)),
    snoise(vec2(uv.x * 1.3 - t * 0.16, uv.y * 1.5 + t * 0.18 + 4.2))
  ) * 0.065;
  vec2 wuv = uv + warp + mouseDrift;

  // ============================================================
  // LAYER 1: Broad Central Wave
  // Softened: wider exp falloff (3.3→2.2), intensity 0.88→0.46, ice 0.42→0.18
  // ============================================================
  float centerDrift = 0.50 + 0.13 * sin(t * 0.52) + 0.06 * cos(wuv.x * 2.4 + t * 0.68);
  float cDist = abs(wuv.y - centerDrift);
  float cBreath = 0.82 + 0.18 * sin(wuv.x * 2.1 + t * 0.62);
  // Wider falloff (2.2 vs 3.3) = softer edge; lower peak amplitude
  float cField = exp(-cDist * 2.2) * (0.38 + 0.18 * snoise(vec2(wuv.x * 1.2 + t * 0.16, t * 0.22))) * cBreath;
  color += cSteelBlue * (cField * 0.32);
  color += cSoftIce   * (cField * 0.11);

  // ============================================================
  // LAYER 2: Primary Aurora Curtain
  // Softened: sharper exp 12.0→7.0, intensity 0.72→0.38, silver removed
  // ============================================================
  float y1 = 0.54 + 0.20 * sin(wuv.x * 2.3 + t * 0.82)
                  + 0.11 * cos(wuv.x * 4.3 - t * 0.58)
                  + (wuv.x - 0.5) * 0.15;
  float d1 = abs(wuv.y - y1);
  float rays1 = 0.88 + 0.12 * sin(wuv.x * 42.0 + sin(wuv.y * 9.0 + t * 0.4) * 3.5 + t * 0.75);
  // Broader falloff (7.0 / 3.0 vs 12.0 / 4.2) = softer ribbon edges
  float r1 = (exp(-d1 * 7.0) * 0.75 + exp(-d1 * 3.0) * 0.35) * rays1;
  color += mix(cSteelBlue, cSoftIce, 0.50) * (r1 * 0.26);
  // Silver highlight removed — was the main source of bright white crests

  // ============================================================
  // LAYER 3: Secondary Diagonal Ribbon
  // Softened: falloff 14.0→8.0 / 4.6→3.2, intensity 0.62→0.32
  // ============================================================
  float y2 = 0.45 - (wuv.x - 0.5) * 0.28
                  + 0.17 * cos(wuv.x * 1.9 - t * 0.68 + 1.9)
                  + 0.09 * sin(wuv.x * 3.8 + t * 0.92);
  float d2 = abs(wuv.y - y2);
  float rays2 = 0.90 + 0.10 * cos(wuv.x * 38.0 - t * 0.85);
  float r2 = (exp(-d2 * 8.0) * 0.70 + exp(-d2 * 3.2) * 0.30) * rays2;
  color += mix(cSteelBlue, cSoftIce, 0.40) * (r2 * 0.22);

  // ============================================================
  // LAYER 4: Highlight Filament
  // Was the sharpest, brightest layer (exp -25). Replaced with a much softer
  // version (exp -10) and pushed to steel-only — no ice or silver addition.
  // ============================================================
  float y3 = 0.49 + 0.14 * sin(wuv.x * 3.0 + t * 1.05 + 2.8)
                  + 0.08 * cos(wuv.x * 5.5 - t * 0.78);
  float d3 = abs(wuv.y - y3);
  // exp(-25) → exp(-10): sharp → soft filament
  float r3 = exp(-d3 * 10.0) * 0.55 + exp(-d3 * 4.5) * 0.22;
  color += cSteelBlue  * (r3 * 0.17);
  color += cSoftIce    * (r3 * 0.07);

  // ============================================================
  // LAYER 5: Lower Undulation (unchanged movement, reduced intensity)
  // ============================================================
  float y4 = 0.26 + 0.16 * sin(wuv.x * 1.7 + t * 0.48 + 4.1)
                  + 0.07 * cos(wuv.x * 3.2 - t * 0.36);
  float d4 = abs(wuv.y - y4);
  float r4 = exp(-d4 * 8.0) * 0.55 + exp(-d4 * 3.0) * 0.26;  // broader falloff
  color += cSteelBlue * (r4 * 0.22);

  // ── Global brightness ceiling ────────────────────────────────────────────
  // Raise denominator → more compression → darker overall output
  color = color / (color + vec3(0.80));
  color *= 1.30;

  // ── Vignette (slightly stronger to frame the softened aurora) ───────────
  vec2 vigCoord = uv * (1.0 - uv.yx);
  float vig = vigCoord.x * vigCoord.y * 14.0;
  vig = clamp(pow(vig, 0.22), 0.0, 1.0);
  color = mix(cDeepCharcoal, color, vig);

  // ── Dither (unchanged) ───────────────────────────────────────────────────
  float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.006;
  color += dither;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

export function GlobalAurora() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mouse coordinates for gentle parallax easing
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth;
      targetMouseY = 1.0 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Try WebGL first
    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        (canvas.getContext("webgl", {
          alpha: false,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: "high-performance",
        }) as WebGLRenderingContext | null) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }

    let animId = 0;
    let isRunning = true;
    let lastFrameTime = performance.now();
    let virtualTime = 0;
    let cleanupFn = () => {};

    if (gl) {
      // ---------------------------------------------------------------------
      // WebGL Rendering Engine
      // ---------------------------------------------------------------------
      const createShader = (glCtx: WebGLRenderingContext, type: number, source: string) => {
        const shader = glCtx.createShader(type);
        if (!shader) return null;
        glCtx.shaderSource(shader, source);
        glCtx.compileShader(shader);
        if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
          console.error("Aurora shader compile error:", glCtx.getShaderInfoLog(shader));
          glCtx.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl, gl.VERTEX_SHADER, VS_SOURCE);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, FS_SOURCE);

      if (!vs || !fs) {
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        return;
      }

      const program = gl.createProgram();
      if (!program) return;

      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Aurora program link error:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        return;
      }

      gl.useProgram(program);

      // Fullscreen quad buffer
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const aPositionLocation = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(aPositionLocation);
      gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

      const uResolutionLocation = gl.getUniformLocation(program, "u_resolution");
      const uTimeLocation = gl.getUniformLocation(program, "u_time");
      const uMouseLocation = gl.getUniformLocation(program, "u_mouse");

      // Resolution scaling: downscaled resolution provides built-in hardware bilinear
      // filtering for soft, diffused atmospheric glow while keeping GPU load negligible
      const updateSize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Clamp scale factor for 60fps performance and soft atmospheric blending
        const scale = width < 768 ? 0.65 : Math.min(window.devicePixelRatio || 1, 1.25) * 0.75;
        const renderW = Math.max(320, Math.floor(width * scale));
        const renderH = Math.max(240, Math.floor(height * scale));

        if (canvas.width !== renderW || canvas.height !== renderH) {
          canvas.width = renderW;
          canvas.height = renderH;
          gl!.viewport(0, 0, renderW, renderH);
          if (uResolutionLocation) {
            gl!.uniform2f(uResolutionLocation, renderW, renderH);
          }
        }
      };

      updateSize();

      const render = (now: number) => {
        if (!isRunning) return;

        const delta = Math.min((now - lastFrameTime) * 0.001, 0.1);
        lastFrameTime = now;

        if (prefersReducedMotion) {
          virtualTime += delta * 0.05; // extremely slow serene drift
        } else {
          virtualTime += delta;
        }

        // Smooth mouse easing
        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;

        if (uTimeLocation) {
          gl!.uniform1f(uTimeLocation, virtualTime);
        }
        if (uMouseLocation) {
          gl!.uniform2f(uMouseLocation, currentMouseX, currentMouseY);
        }

        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

        if (!prefersReducedMotion) {
          animId = requestAnimationFrame(render);
        }
      };

      animId = requestAnimationFrame(render);

      const handleResize = () => {
        updateSize();
        if (prefersReducedMotion) {
          gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        }
      };

      window.addEventListener("resize", handleResize, { passive: true });

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", onMouseMove);
        if (positionBuffer) gl!.deleteBuffer(positionBuffer);
        if (program) gl!.deleteProgram(program);
        if (vs) gl!.deleteShader(vs);
        if (fs) gl!.deleteShader(fs);
      };
    } else {
      // ---------------------------------------------------------------------
      // Canvas 2D Fallback Engine (for devices where WebGL is unavailable)
      // ---------------------------------------------------------------------
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const updateSize2D = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = Math.max(320, Math.floor(width * 0.5));
        canvas.height = Math.max(240, Math.floor(height * 0.5));
      };

      updateSize2D();

      let t = 0;
      const render2D = (now: number) => {
        if (!isRunning) return;

        t += prefersReducedMotion ? 0.005 : 0.02;
        const w = canvas.width;
        const h = canvas.height;

        currentMouseX += (targetMouseX - currentMouseX) * 0.04;
        currentMouseY += (targetMouseY - currentMouseY) * 0.04;
        const mouseShiftX = (currentMouseX - 0.5) * w * 0.05;

        // Base gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, "#080a0f");
        bgGrad.addColorStop(1, "#10141d");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Broad central diffused wave
        const cWave = ctx.createRadialGradient(
          w * (0.5 + 0.1 * Math.sin(t * 0.5)) + mouseShiftX,
          h * (0.5 + 0.08 * Math.cos(t * 0.4)),
          20,
          w * 0.5,
          h * 0.5,
          w * 0.65
        );
        cWave.addColorStop(0, "rgba(117, 154, 196, 0.28)");
        cWave.addColorStop(0.5, "rgba(51, 68, 93, 0.22)");
        cWave.addColorStop(1, "rgba(8, 10, 15, 0)");
        ctx.fillStyle = cWave;
        ctx.fillRect(0, 0, w, h);

        // Dynamic Ribbon 1 (Center)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, h * 0.5);
        for (let x = 0; x <= w; x += 20) {
          const nx = x / w;
          const y =
            h * 0.52 +
            h * 0.16 * Math.sin(nx * 3 + t) +
            h * 0.08 * Math.cos(nx * 5 - t * 0.8);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const r1Grad = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.7);
        r1Grad.addColorStop(0, "rgba(167, 189, 214, 0.35)");
        r1Grad.addColorStop(0.3, "rgba(117, 154, 196, 0.25)");
        r1Grad.addColorStop(1, "rgba(51, 68, 93, 0)");
        ctx.fillStyle = r1Grad;
        ctx.fill();
        ctx.restore();

        // Dynamic Ribbon 2 (Diagonal)
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, h * 0.4);
        for (let x = 0; x <= w; x += 20) {
          const nx = x / w;
          const y =
            h * 0.44 -
            (nx - 0.5) * h * 0.2 +
            h * 0.14 * Math.cos(nx * 2.5 - t * 0.9) +
            h * 0.07 * Math.sin(nx * 4 + t * 1.1);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        const r2Grad = ctx.createLinearGradient(0, h * 0.25, 0, h * 0.65);
        r2Grad.addColorStop(0, "rgba(117, 154, 196, 0.30)");
        r2Grad.addColorStop(0.5, "rgba(51, 68, 93, 0.20)");
        r2Grad.addColorStop(1, "rgba(8, 10, 15, 0)");
        ctx.fillStyle = r2Grad;
        ctx.fill();
        ctx.restore();

        if (!prefersReducedMotion) {
          animId = requestAnimationFrame(render2D);
        }
      };

      animId = requestAnimationFrame(render2D);
      window.addEventListener("resize", updateSize2D, { passive: true });

      cleanupFn = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", updateSize2D);
        window.removeEventListener("mousemove", onMouseMove);
      };
    }

    // Visibility change handler: pauses computation when tab is in background, resumes immediately
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else {
        isRunning = true;
        lastFrameTime = performance.now();
        if (gl) {
          // Restart WebGL RAF loop
          const restartWebGL = (now: number) => {
            if (!isRunning) return;
            const delta = Math.min((now - lastFrameTime) * 0.001, 0.1);
            lastFrameTime = now;
            virtualTime += delta;
            currentMouseX += (targetMouseX - currentMouseX) * 0.04;
            currentMouseY += (targetMouseY - currentMouseY) * 0.04;

            const uTimeLocation = gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "u_time");
            const uMouseLocation = gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), "u_mouse");
            if (uTimeLocation) gl.uniform1f(uTimeLocation, virtualTime);
            if (uMouseLocation) gl.uniform2f(uMouseLocation, currentMouseX, currentMouseY);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animId = requestAnimationFrame(restartWebGL);
          };
          animId = requestAnimationFrame(restartWebGL);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cleanupFn();
    };
  }, []);

  return (
    <div className="global-aurora" aria-hidden="true">
      <canvas ref={canvasRef} className="global-aurora__canvas" />
    </div>
  );
}
