import { isReactive } from "./reactive"
import { ReactiveEffect } from "./effect"
import { isObject, isFunction } from "@myvue/shared"
export function watch(source, cb, options) {
    return doWatch(source, cb, options)
}
function doWatch(source, cb, { deep, immediate } =  { deep: false, immediate: false }) {
    // 1.第一步创建一个getter,目的就是访问source的属性
    let getter
    const reactiveGetter = (source) => {
        traverse(source, deep === false ? 1 : undefined)
    }
    // 如果是响应式对象
    if (isReactive(source)) {
        getter = () => reactiveGetter(source)
    } else if (isFunction(source)) {
        getter = source
    } else {
        console.warn(`watch source must be a object or function, but got ${source}`)
        return
    }
    let oldValue
    // 2.创建一个job,就是调度函数
    const job = () => {
        if (cb) {
            const newValue = effect.run()
            cb(newValue, oldValue)
            oldValue = newValue
        }
    }
    // 3.创建一个effect,就是响应式effect
    const effect = new ReactiveEffect(getter, job)
    if (cb) {
        // 如果是立即执行，则把调度函数执行一下
        if (immediate) {
            job()
        } else {
            // 如果不是立即执行，就执行run方法，实际就是执行getter，让属性记住effect
            oldValue = effect.run()
        }
    }
}

function traverse(value, depth, currentDepth = 0, seen = new Set()) {
    if (!isObject(value)) {
        return value
    }
    if (depth) {
        // 如果有指定深度遍历的层数
        if (currentDepth >= depth) {
            return value
        }
        currentDepth++
    }
    // 如果已经遍历过，则直接返回,避免嵌套
    if (seen.has(value)) {
        return value
    }
    seen.add(value)
    for (const key in value) {
        traverse(value[key], depth, currentDepth, seen)
    }
    return value
}