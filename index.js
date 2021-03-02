const { Nuxt, Builder } = require('nuxt')
const path = require('path')
const generate = require('./generate')

module.exports = async function (smallify, opts) {
  await generate()

  const nuxtOptions = require(path.join(process.cwd(), 'nuxtjs', 'nuxt.config'))
  const properties = opts.properties || []

  if (nuxtOptions.dev !== true) {
    nuxtOptions.dev = process.env.NODE_ENV !== 'production'
  }

  const nuxt = new Nuxt(nuxtOptions)

  let build = true
  let buildPromise = Promise.resolve()

  if (nuxtOptions.dev) {
    build = false
    buildPromise = new Builder(nuxt).build().then(() => {
      build = true
    })
  }

  smallify.decorate('nuxt', function (path, methods = ['GET']) {
    for (const method of methods) {
      smallify.route({
        url: path,
        method,
        async handler (req, rep) {
          if (!build) {
            await buildPromise
          }

          rep.sent = true

          const raw = req.raw
          for (const key of properties) {
            if (req[key]) raw[key] = req[key]
          }

          return nuxt.render(req.raw, rep.raw)
        }
      })
    }
  })

  smallify.nuxt('/_nuxt/*')
  smallify.nuxt('/__webpack_hmr/*')
}
