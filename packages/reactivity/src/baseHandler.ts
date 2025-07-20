import { track,trigger } from "./reactiveEffect"
import { isObject } from "@myvue/shared"
import { reactive } from "./reactive"
export enum ReactiveFlags {
    // 是否被代理
    IS_REACTIVE = '__v_isReactive'
}
export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        // 检查是否是代理对象
        if(key === ReactiveFlags.IS_REACTIVE) {
            return true
        }
        track(target,key)
        let res = Reflect.get(target, key, receiver)
        if(isObject(res)) {
            return reactive(res)
        }
        return res
    },
    set(target, key, value, receiver) {
        let oldValue = target[key]
        let result = Reflect.set(target, key, value, receiver)
        if(oldValue !== value) {
            trigger(target, key,value, oldValue)
        }
        return result
    }
}