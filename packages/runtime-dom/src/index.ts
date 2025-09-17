export * from '@myvue/reactivity'
export * from '@myvue/shared'
import { nodeOps } from './nodeOps'
import patchProp from './patchProp'

const renderOptions = Object.assign({patchProp}, nodeOps)
export { renderOptions } 