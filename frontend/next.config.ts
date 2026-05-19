import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  // Security-oriented headers can be added at the proxy (nginx). Keep Next config minimal.
};

export default nextConfig;
