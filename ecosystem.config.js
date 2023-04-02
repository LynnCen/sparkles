const HOST = '0.0.0.0';
const PORT = 3100;
const name = 'boss';
const deploy = {
  repo: `git@git.vm.snqu.com:im/tmm/f2e/${name}.git`,
  path: `/app/www/node-server/${name}`,
};
module.exports = {
  apps: [
    {
      name,
      instances: 2,
      script: 'server/index.js',
      // 正式服
      env_production: {
        NODE_ENV: 'production',
        HOST,
        PORT,
      },
      // 测试服
      env_development: {
        NODE_ENV: 'production',
        HOST,
        PORT,
        TEST: true,
      },
    },
  ],

  deploy: {
    production: {
      ...deploy,
      ref: 'origin/master',
      user: 'staff',
      // host: '',
      'post-setup': 'mkdir -p dist',
      'post-deploy':
        'rm -rf backup && mv dist backup && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
    },
    development: {
      ...deploy,
      ref: 'origin/develop',
      user: 'staff',
      host: '129.226.123.108',
      'post-setup': 'mkdir -p dist',
      'post-deploy':
        'mv dist backup && npm install && npm run build && pm2 reload ecosystem.config.js --env development',
    },
  },
};
