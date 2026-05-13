/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === "true";
const repo = "splinters";
const basePath = isGhPages ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
