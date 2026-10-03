export interface NftPiece {
  id: string;
  name: string;
  image: string;
  detail: string;
}

export const NFTS: NftPiece[] = [
  { id: "01", name: "Genesis 01", image: "/nft/01.jpg", detail: "Allowlist preview" },
  { id: "02", name: "Genesis 02", image: "/nft/02.jpg", detail: "Allowlist preview" },
  { id: "03", name: "Genesis 03", image: "/nft/03.jpg", detail: "Allowlist preview" },
  { id: "04", name: "Genesis 04", image: "/nft/04.jpg", detail: "Allowlist preview" },
];

export const CA = "7pkqvfHe6WREhvZ1ergfXtz3F6MQfXCfcAZiumCt6Ene";
export const PUMP_URL = `https://pump.fun/coin/${CA}`;
export const SOLSCAN_URL = `https://solscan.io/token/${CA}`;
export const X_HANDLE = "CLAWRENAi";
export const X_URL = "https://x.com/CLAWRENAi";
export const TARGET_TWEET_ID = "2104738579637264735";
export const TARGET_TWEET_URL = `https://x.com/CLAWRENAi/status/${TARGET_TWEET_ID}`;
