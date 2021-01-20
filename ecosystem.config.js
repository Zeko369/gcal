module.exports = {
  apps: [
    {
      name: "Gcal",
      script: "./scripts/start.sh",
      args: "",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "dev",
      host: process.env.SERVER_URL,
      ref: "origin/main",
      repo: "git@github.com:Zeko369/gcal.git",
      path: "/home/dev/deploy-gcal",
      "post-deploy": "./scripts/postDeploy.sh",
    },
  },
}
