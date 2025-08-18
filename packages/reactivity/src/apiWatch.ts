import { isReactive } from "./reactive"
import { ReactiveEffect } from "./effect"
import { isObject ,isFunction} from "@myvue/shared"
export  function watch(source,cb,options) {
    return doWatch(source,cb,options)
}
function doWatch(source,cb,{deep}) {
    let getter
    const reactiveGetter = (source) => {
        traverse(source, deep === false ? 1 : undefined)
    }
    // 如果是响应式对象
    if(isReactive(source)) {
        getter = () => reactiveGetter(source)
    } else if(isFunction(source)) {
        getter = source
    } else {
        console.warn(`watch source must be a object or function, but got ${source}`)
        return
    }
    let oldValue
    const job = () => {
        if(cb) {
            const newValue = effect.run()
            cb(newValue, oldValue)
            oldValue = newValue
        }
    }
    const effect = new ReactiveEffect(getter,job)
    oldValue = effect.run()
}

function traverse(value, depth, currentDepth = 0 , seen = new Set()) {
    if(!isObject(value)) {
        return value
    }
    if(depth) {
        // 如果有指定深度遍历的层数
        if(currentDepth >= depth) {
            return value
        }
        currentDepth++
    }
    // 如果已经遍历过，则直接返回,避免嵌套
    if(seen.has(value)) {
        return value
    }
    seen.add(value)
    for(const key in value) {
        traverse(value[key], depth, currentDepth, seen)
    }
    return value
 }