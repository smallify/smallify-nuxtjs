const { Nuxt, Builder } = require('nuxt')
const path = require('path')
const fs = require('fs')

const { fixPackage, extractSrc } = require('./generate')

module.exports = async function (smallify, opts) {
  const nuxtDir = opts.nuxtDir || 'nuxtjs'
  const properties = opts.properties || []
  const exports = opts.exports || []

  const nuxtPath = path.join(process.cwd(), nuxtDir)

  if (!fs.existsSync(nuxtPath)) {
    await fixPackage(nuxtDir)
    await extractSrc(nuxtDir)
  }

  const nuxtOptions = require(path.join(process.cwd(), nuxtDir, 'nuxt.config'))

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

  for (const exObj of exports) {
    if (typeof exObj === 'string') {
      smallify.nuxt(exObj)
    } else if (typeof exObj === 'object' && Array.isArray(exObj.methods)) {
      smallify.nuxt(exObj.path, exObj.methods)
    }
  }
}
