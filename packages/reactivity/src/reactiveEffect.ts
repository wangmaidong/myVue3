import { activeEffect, trackEffect, triggerEffects } from "./effect"
const targetMap = new WeakMap()
export const createDep = (cleanup, key) => {
    const dep = new Map() as any
    dep.cleanup = cleanup
    dep.name = key
    return dep
}
export function track(target,key) {
    if(!activeEffect) return
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        depsMap = new Map()
        targetMap.set(target,depsMap)
    }
    let deps = depsMap.get(key)
    if(!deps) {
        deps = createDep(() => {
            depsMap.delete(key)
        }, key)
        depsMap.set(key,deps)
    }
    trackEffect(activeEffect, deps)
    // console.log(targetMap)
}

export function trigger(target, key, newValue, oldValue) {
    let depsMap = targetMap.get(target)
    if(!depsMap) return
    let deps = depsMap.get(key)
    if(deps) {
        triggerEffects(deps)
    }
}
// targetMap
/**
 * {  // 总体是一个weakMap
 *   obj: { // 总体是一个map
 *     key: { // 总体是一个map
 *       cleanup: () => {},
 *       name: key
 *     }
 *       }
 * }
 */