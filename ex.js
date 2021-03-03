const Smallify = require('smallify')
const smallifyNuxt = require('./index')

const smallify = Smallify({
  pino: {
    level: 'info',
    prettyPrint: true
  }
})

smallify.register(smallifyNuxt, {
  nuxtDir: 'nuxt',
  exports: [{ path: '/', methods: ['GET'] }, '/inspire']
})

smallify.ready(err => {
  err && smallify.$log.error(err)
  smallify.print()
})
