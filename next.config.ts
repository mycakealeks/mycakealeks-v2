import { withPayload } from "@payloadcms/next/withPayload";
import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { hostname: 'tildacdn.com' },
      { hostname: 'thb.tildacdn.com' },
      { hostname: 'static.tildacdn.com' },
      { hostname: 'vz-92cbb18d-f79.b-cdn.net' },
      { hostname: '*.b-cdn.net' },
    ],
  },
};

export default withNextIntl(withPayload(nextConfig));
