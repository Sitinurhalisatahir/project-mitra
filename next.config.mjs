/** @type {import('next').NextConfig} */
const nextConfig = {
   outputFileTracingIncludes: { '/api-docs': ['./src/app/api/**/*'] },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;