const HOST = '0.0.0.0';
const PORT = 3561;
// 是否是部署的服务器端
const SVR = true;
const deploy = {
  repo: 'git@git.vm.snqu.com:im/tmm/f2e/tmmtmm.com.tr-new.git',
};
module.exports = {
  apps: [
    {
      name: 'tmmtmm.com.tr-new',
      instances: 2,
      script: 'server/index.js',
      // 正式服
      env_production: {
        NODE_ENV: 'production',
        HOST,
        PORT,
        SVR
      },
      // 测试服
      env_development: {
        NODE_ENV: 'production',
        HOST,
        PORT,
        SVR,
        TEST: true,
      },
    },
  ],

  deploy: {
    production: {
      ...deploy,
      path: '/app/www/node-server/tmmtmm.com.tr-new',
      ref: 'origin/master',
      user: 'staff',
      host: '18.184.245.37',
      'post-deploy':
        'yarn install && yarn build:pro && pm2 reload ecosystem.config.js --env production',
    },
    development: {
      ...deploy,
      path: '/app/www/node-server/tmmtmm.com.tr-new',
      ref: 'origin/develop',
      user: 'staff',
      host: '129.226.123.108',
      'post-deploy':
        'yarn install && yarn build && pm2 reload ecosystem.config.js --env development',
    },
  },
};
