import { isObject } from '@myvue/shared'
import { mutableHandlers } from './baseHandler'
import { ReactiveFlags } from './constants'

// 缓存被代理过的对象，防止重复代理
const reactiveMap = new WeakMap()

function createReactiveObject(target) {
   if(!isObject(target)) {
    return target
   }
   // 检查传入的对象是否是已经被reactive过的一个proxy
   if(target[ReactiveFlags.IS_REACTIVE]) {
    return target
   }
   // 检查传入的对象是否被代理过
   const existingProxy = reactiveMap.get(target)
   if(existingProxy) {
    return existingProxy
   }
   
   const proxy = new Proxy(target,mutableHandlers)
   reactiveMap.set(target,proxy)
   return proxy;
}
export function reactive(target) {
    return createReactiveObject(target)
}

export function toReactive(value) {
    return isObject(value) ? reactive(value) : value
}