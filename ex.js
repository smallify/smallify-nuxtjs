const Smallify = require('smallify')
const smallifyNuxt = require('./index')

const smallify = Smallify({
  pino: {
    level: 'info',
    prettyPrint: true
  }
})

smallify.register(smallifyNuxt, {
  exports: [{ path: '/', methods: ['GET'] }, '/inspire'],
  override (nuxtConfig) {
    console.log(nuxtConfig)
  }
})

smallify.ready(err => {
  err && smallify.$log.error(err)
  smallify.print()
})
