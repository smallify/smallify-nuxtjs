const Smallify = require('smallify')
const smallifyNuxt = require('./index')

const smallify = Smallify({
  pino: {
    level: 'info',
    prettyPrint: true
  }
})

smallify
  .register(smallifyNuxt, {
    nuxt: require('./nuxtjs/nuxt.config')
  })
  .after(() => {
    smallify.nuxt('/')
    smallify.nuxt('/inspire')
  })

smallify.ready(err => {
  err && smallify.$log.error(err)
  smallify.print()
})
