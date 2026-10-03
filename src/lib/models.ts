/** Real GLBs from the free three.ws text-to-3D API. R2 hosts are rewritten to the CORS CDN. */
export interface ModelSpec {
  id: string;
  label: string;
  src: string;
}

const CAT =
  "https://pub-2534e921bf9c4314addcd4d8a6e98b7b.r2.dev/forge/e4238875c2f2/aa39815c-4363-4c97-ab3d-d33c94c85a16.glb";
const COIN =
  "https://storage.googleapis.com/three-ws-avatar-reconstructions/raw-meshes/trellis/ad7cd57e-703b-4b5c-96a8-dd96364c5af2.glb";

export function browserGlb(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith(".r2.dev")) {
      return `https://three.ws/cdn${parsed.pathname}`;
    }
    return url;
  } catch {
    return url;
  }
}

export const MODELS: ModelSpec[] = [
  { id: "claw", label: "Claw", src: browserGlb(CAT) },
  { id: "coin", label: "Coin", src: browserGlb(COIN) },
];

export const HERO_MODEL = MODELS[0];
