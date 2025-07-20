// @ts-check
// 如果没有在tsconfig.json中配置, @vue/shared 引入的是node_modules中的包
// 如果配置了, 引入的是packages/shared/src/index.ts 中的包
// import { isObject } from '@vue/shared'

// console.log(isObject(1))

export * from './effect'
export * from './reactive'
export * from './ref'