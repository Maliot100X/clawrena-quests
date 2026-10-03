"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ThreeViewerProps {
  src: string;
  className?: string;
  background?: string;
  autoRotate?: boolean;
  alt?: string;
}

type Mode = "loading" | "element" | "three";

const VIEWER_URL = "https://esm.sh/@three-ws/avatar@0.2.3/viewer";

export function ThreeViewer({
  src,
  className,
  background = "#07080b",
  autoRotate = true,
  alt = "3D model",
}: ThreeViewerProps) {
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("loading");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        if (!customElements.get("three-ws-viewer")) {
          await Promise.race([
            import(/* webpackIgnore: true */ VIEWER_URL),
            new Promise((_, reject) => setTimeout(() => reject(new Error("viewer timeout")), 8000)),
          ]);
        }
        if (!cancelled && customElements.get("three-ws-viewer")) {
          setMode("element");
          return;
        }
      } catch (error) {
        console.warn("three-ws viewer unavailable, using three.js", error);
      }
      if (!cancelled) setMode("three");
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mode !== "three" || !host.current) return;
    const parent = host.current;
    let disposed = false;
    let frame = 0;
    let observer: ResizeObserver | null = null;
    let renderer: { dispose: () => void; domElement: HTMLCanvasElement } | null = null;

    (async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      if (disposed) return;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(background);
      const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
      camera.position.set(0, 0.15, 2.4);
      const webgl = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      webgl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      webgl.outputColorSpace = THREE.SRGBColorSpace;
      parent.appendChild(webgl.domElement);
      renderer = webgl;

      scene.add(new THREE.AmbientLight(0xffffff, 0.65));
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(2.4, 3.2, 2);
      const rim = new THREE.DirectionalLight(0x22c7b8, 1.4);
      rim.position.set(-2.2, 0.4, -1.4);
      scene.add(key, rim);

      const controls = new OrbitControls(camera, webgl.domElement);
      controls.enableDamping = true;
      controls.autoRotate = autoRotate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      controls.autoRotateSpeed = 1.1;
      controls.enablePan = false;

      const fit = () => {
        const width = parent.clientWidth || 320;
        const height = parent.clientHeight || 360;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        webgl.setSize(width, height, false);
      };
      fit();
      observer = new ResizeObserver(fit);
      observer.observe(parent);

      try {
        const gltf = await new GLTFLoader().loadAsync(src);
        if (disposed) return;
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        root.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        root.scale.setScalar(1.7 / maxDim);
        scene.add(root);
        setFailed(false);
      } catch (error) {
        console.error("glb load failed", error);
        if (!disposed) setFailed(true);
      }

      const tick = () => {
        if (disposed) return;
        controls.update();
        webgl.render(scene, camera);
        frame = requestAnimationFrame(tick);
      };
      tick();
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      renderer?.domElement.remove();
      renderer?.dispose();
    };
  }, [mode, src, background, autoRotate]);

  return (
    <div ref={host} className={cn("relative w-full overflow-hidden bg-background", className)} style={{ background }}>
      {mode === "loading" && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="size-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
      {mode === "element" && (
        <three-ws-viewer
          ref={(node: HTMLElement | null) => {
            if (!node) return;
            node.setAttribute("src", src);
            node.setAttribute("background", background);
            node.setAttribute("alt", alt);
            if (autoRotate) node.setAttribute("auto-rotate", "");
            else node.removeAttribute("auto-rotate");
          }}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
      )}
      {failed && (
        <p className="absolute inset-x-0 bottom-3 text-center text-xs text-muted-foreground">Model could not be loaded.</p>
      )}
    </div>
  );
}
