module.exports = {
  apps: [
    {
      name: "sims_back_end_node",
      script: "./src/server.ts",
      interpreter: "ts-node",
      instances: "1",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
