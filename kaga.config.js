module.exports = {
  apps: [{
    name: 'Kaga',
    script: 'src/kaga.js',
    exec_mode: 'cluster',
    instances: 1,
    watch: false,
    autorestart: false,
    output: './logs/kaga/output.log',
    error: './logs/kaga/error.log'
  }]
}
