import { Smallify } from 'smallify'
import { SmallifyNuxt, NuxtOptions } from './types/options'

declare const nuxtjs: SmallifyNuxt

export = nuxtjs

declare module 'smallify' {
  interface SmallifyPlugin {
    (plugin: SmallifyNuxt, opts: NuxtOptions): Smallify
  }
}
