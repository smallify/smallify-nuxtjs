const Smallify = require('smallify')
const smallifyNuxt = require('./index')
const smallifySession = require('smallify-session')

const smallify = Smallify({
  pino: {
    level: 'info',
    prettyPrint: true
  }
})

smallify.register(smallifyNuxt, {
  exports: ['/', '/dashboard', '/guest', '/login'],
  override (nuxtConfig) {}
})

smallify.register(smallifySession, {
  secret: '123456798'
})

smallify.route({
  url: '/_auth/oauth/github/authorize',
  method: 'POST',
  async handler (req, rep) {
    const {
      $nuxt: {
        options: {
          auth: {
            strategies: {
              github: { clientId, clientSecret }
            }
          }
        }
      }
    } = smallify

    const { code } = req.body

    const { default: axios } = require('axios')
    const { data } = await axios({
      method: 'POST',
      url: 'https://github.com/login/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code
      },
      headers: {
        Accept: 'application/json'
      }
    })

    return data
  }
})

smallify.route({
  url: '/user',
  method: 'GET',
  async handler (req, rep) {
    const { default: axios } = require('axios')

    const { data } = await axios({
      method: 'GET',
      url: 'https://api.github.com/user',
      headers: {
        Authorization: req.headers.authorization
      }
    })

    req.session.user = data

    return data
  }
})

smallify.route({
  url: '/hello',
  method: 'GET',
  async handler (req, rep) {
    console.log(req.session)
    return 'world'
  }
})

smallify.ready(err => {
  err && smallify.$log.error(err)
  smallify.print()
})
