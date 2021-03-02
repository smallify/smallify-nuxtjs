import { Smallify, PluginOptions } from 'smallify'

export class NuxtOptions extends PluginOptions {
  properties: Array<string>
}

export type SmallifyNuxt = {
  (smallify: Smallify, opts: NuxtOptions): Promise<void>
}
