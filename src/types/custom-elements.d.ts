import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "three-ws-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        background?: string;
        alt?: string;
      };
    }
  }
}

export {};
