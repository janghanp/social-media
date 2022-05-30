/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
      "platform-lookaside.fbsbx.com",
      "bucket-for-social-media.s3.ap-southeast-2.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
