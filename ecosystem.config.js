module.exports = [
  {
    script: "server/app.js",
    name: "tmm",
    exec_mode: "cluster",
    instances: 3,
    env: {
      NODE_ENV: "production",
    },
  },
];
