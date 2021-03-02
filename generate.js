#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const unzip = require('extract-zip')

const pFile = path.join(process.cwd(), 'package.json')
const zFile = path.join(__dirname, 'nuxtjs-template.zip')
const jFile = path.join(process.cwd(), 'jsconfig.json')

const mod = require(pFile)

mod.scripts = mod.scripts || {
  lint: 'npm run lint:standard && npm run lint:typescript',
  'lint:fix': 'standard --fix',
  'lint:standard': 'standard --verbose | snazzy',
  'lint:typescript': 'eslint -c types/.eslintrc types/**/*.d.ts'
}

const { scripts } = mod

const nScripts = {
  'lint:nuxt': 'eslint --ext ".js,.vue" ./nuxtjs',
  'build:nuxt': 'nuxt build -c ./nuxtjs/nuxt.config.js'
}

const lScript = ' && npm run lint:nuxt'

for (const s in nScripts) {
  if (!(s in scripts)) {
    scripts[s] = nScripts[s]
  }
}

if (scripts.lint && scripts.lint.indexOf && scripts.lint.indexOf(lScript) < 0) {
  scripts.lint += lScript
}

fs.writeFileSync(pFile, JSON.stringify(mod, null, '  '))

if (!fs.existsSync(path.join(process.cwd(), 'nuxtjs'))) {
  unzip(zFile, { dir: process.cwd() })
}

if (!fs.existsSync(jFile)) {
  fs.writeFileSync(
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
}
