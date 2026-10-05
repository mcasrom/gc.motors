module.exports = {
  apps: [{
    name: 'gcmotors',
    cwd: '/home/deploy/gcmotors-workshop',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3019',
    env: { NODE_ENV: 'production', PORT: '3019' },
    max_memory_restart: '450M',
  }],
};
