module.exports = {
  apps: [
    {
      name: 'din-backend',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',
      env: {
        PORT: 4000,
        JWT_SECRET: process.env.JWT_SECRET || 'change_me',
        DATA_DIR: process.env.DATA_DIR || '/data'
      }
    }
  ]
};
