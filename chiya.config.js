module.exports = {
  apps: [{
    name: 'Chiya-bot',
    script: 'src/chiya.js',
    exec_mode: 'cluster',
    instances: 1,
    watch: false,
    autorestart: true,
    output: './logs/chiya/output.log',
    error: './logs/chiya/error.log'
  }]
}
