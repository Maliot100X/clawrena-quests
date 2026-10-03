"use client";
import { useEffect, useRef } from "react";

export const CLAWRENA_GLB = "https://pub-2534e921bf9c4314addcd4d8a6e98b7b.r2.dev/forge/e4238875c2f2/aa39815c-4363-4c97-ab3d-d33c94c85a16.glb";
export const COIN_GLB = "https://storage.googleapis.com/three-ws-avatar-reconstructions/raw-meshes/trellis/ad7cd57e-703b-4b5c-96a8-dd96364c5af2.glb";

interface Props {
  src: string;
  alt?: string;
  height?: string;
  autoRotate?: boolean;
}

export function ModelViewer({ src, alt = "3D Model", height = "380px", autoRotate = true }: Props) {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    // Load model-viewer from CDN — no npm package needed, no webpack conflicts
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    document.head.appendChild(script);
  }, []);

  return (
    <div style={{ width: "100%", height }} className="relative bg-[#07080b]">
      {/* @ts-expect-error model-viewer custom element loaded from CDN */}
      <model-viewer
        src={src}
        alt={alt}
        auto-rotate={autoRotate ? "" : undefined}
        camera-controls=""
        shadow-intensity="1"
        exposure="1.2"
        tone-mapping="commerce"
        style={{ width: "100%", height: "100%", background: "transparent" }}
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 60px -20px rgba(34,199,184,0.15)" }} />
    </div>
  );
}
