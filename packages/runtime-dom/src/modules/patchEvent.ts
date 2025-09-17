function createInvoker(value) {
    // 不直接把事件绑定给元素，而是代理一下，是为了优化，不用更新的时候去移除旧的
    // 比如之前 是@click = "A" 现在是 @click ="B"， 就不需要再调用removeEventListener了
    const invoker = (e) => invoker.value(e)
    invoker.value = value
    return invoker
}
export default function patchEvent(el, name,nextValue) {
    // vue_event_invoker 缓存的一个元素的事件
    const invokers = el._vei || (el._vei = {})
    // onClick ==> Click ==> click
    const eventName = name.slice(2).toLowerCase()
    const exisitingInvokers = invokers[name]
    // 如果之前有，且传入了新的事件函数，那么就更新
    if(exisitingInvokers && nextValue) {
        return exisitingInvokers.value = nextValue
    }
    // 如果之前没有，这次传入了新的，那么就增加
    if(!exisitingInvokers && nextValue) {
        // 创建一个invoker
        const invoker  = createInvoker(nextValue)
        invokers[name] = invoker
        return el.addEventListener(eventName, invoker)
    }
    if(exisitingInvokers) {
        el.removeEventListener(eventName, exisitingInvokers)
        invokers[name] = undefined
    }
}