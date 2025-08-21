module.exports = {
  webpack: (config, { isServer }) => {
    // Modify the webpack config here
    if (!isServer) {
      // Add a rule for WebSocket handling, excluding specific files
      config.module.rules.push({
        test: /\.js$/,
        include: /\/_next\/webpack-hmr/,
        use: 'null-loader',
      });
    }

    // Return the modified config
    return config;
  },
};
