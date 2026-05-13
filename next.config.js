/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === "true";
const repo = "splinters";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isGhPages ? `/${repo}` : "",
  assetPrefix: isGhPages ? `/${repo}/` : "",
  trailingSlash: true,
};

module.exports = nextConfig;
