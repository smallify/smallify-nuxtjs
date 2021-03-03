const path = require('path')
const fs = require('fs').promises
const unzip = require('extract-zip')

async function fixPackage (nuxtDir) {
  const pFile = path.join(process.cwd(), 'package.json')

  const pkg = require(pFile)
  pkg.scripts = pkg.scripts || {}
  // lint: 'npm run lint:standard && npm run lint:typescript',
  // 'lint:fix': 'standard --fix',
  // 'lint:standard': 'standard --verbose | snazzy',
  // 'lint:typescript': 'eslint -c types/.eslintrc types/**/*.d.ts'

  const { scripts } = pkg

  const nScripts = {
    'nuxt:lint': `eslint --ext ".js,.vue" ./${nuxtDir}`,
    'nuxt:build': `nuxt build -c ./${nuxtDir}/nuxt.config.js`
  }

  for (const s in nScripts) {
    scripts[s] = nScripts[s]
  }

  await fs.writeFile(pFile, JSON.stringify(pkg, null, '  '))
}

async function extractSrc (nuxtDir) {
  const zFile = path.join(__dirname, 'nuxtjs-template.zip')
  const jFile = path.join(process.cwd(), 'jsconfig.json')

  const nuxtPath = path.join(process.cwd(), nuxtDir)

  await unzip(zFile, { dir: nuxtPath })

  await fs.writeFile(
    jFile,
    JSON.stringify(
      {
        compilerOptions: {
          baseUrl: '.',
          paths: {
            '~/*': ['./*'],
            '@/*': ['./*'],
            '~~/*': ['./*'],
            '@@/*': ['./*']
          }
        },
        exclude: ['node_modules', '.nuxt', 'dist']
      },
      null,
      '  '
    )
  )

  const nFile = path.join(nuxtPath, 'nuxt.config.js')
  let nConfig = (await fs.readFile(nFile)).toString('utf-8')
  nConfig = nConfig.replace('srcDir: null', `srcDir: './${nuxtDir}'`)

  await fs.writeFile(nFile, nConfig)
}

module.exports = {
  fixPackage,
  extractSrc
}
