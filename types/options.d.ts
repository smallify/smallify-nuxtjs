import { Smallify, PluginOptions } from 'smallify'
import { NuxtConfig } from '@nuxt/types'

export class NuxtOptions extends PluginOptions {
  nuxt: NuxtConfig
  properties: Array<string>
}

export type SmallifyNuxt = {
  (smallify: Smallify, opts: NuxtOptions): Promise<void>
}
