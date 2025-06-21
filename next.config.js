module.exports = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/i,
      type: "asset/resource",
    });
    return config;
  },
};
