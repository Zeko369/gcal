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
      user: "zeko",
      host: process.env.SERVER_URL,
      ref: "origin/master",
      repo: "git@github.com:Zeko369/gcal.git",
      path: "/home/zeko/deploy-gcal",
      "post-deploy": "./scripts/postDeploy.sh",
    },
  },
}
