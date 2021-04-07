import { Smallify, PluginOptions, Methods } from 'smallify'

export interface NuxtUrl {
  path: string
  methods: Array<Methods>
}

export class NuxtOptions extends PluginOptions {
  properties: Array<string>
  nuxtDir: string
  exports: Array<string | NuxtUrl>
  override (nuxtConfig: unknown): void
}

export type SmallifyNuxt = {
  (smallify: Smallify, opts: NuxtOptions): Promise<void>
}
