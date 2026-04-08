"use client";

import { Toaster } from "react-hot-toast";

/**
 * Mounts one global toast outlet so action feedback is visible across all pages.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2500,
        style: {
          border: "1px solid #d5deec",
          borderRadius: "8px",
          background: "#ffffff",
          color: "#1f2937",
        },
      }}
    />
  );
}
