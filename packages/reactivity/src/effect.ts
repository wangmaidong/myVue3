export function effect(fn, options?) {
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run()
    })
    _effect.run()
    if (options) {
        Object.assign(_effect, options)
    }
    const runner = _effect.run.bind(_effect)
    runner._effect = _effect
    return runner
}
export let activeEffect = null
// 执行effect之前，先清理依赖
function precleanDepEffect(effect) {
    effect._depsLength = 0
    effect._trackId++
}
// 模板渲染后清理无用的依赖
function postcleanDepEffect(effect) {
    if (effect._depsLength < effect.deps.length) {
        for (let i = effect._depsLength; i < effect.deps.length; i++) {
            cleanDepEffect(effect.deps[i], effect)
        }
        effect.deps.length = effect._depsLength
    }
}
function cleanDepEffect(dep, effect) {
    dep.delete(effect)
    if (dep.size === 0) {
        dep.cleanup()
    }
}
class ReactiveEffect {
    // 是否正在执行
    _isRunning = 0
    // 每次effect执行时，_trackId都会++
    _trackId = 0
    // 真正记录该effect被多少个属性依赖
    _depsLength = 0
    // 记录该effect被多少个属性依赖
    deps = []
    // 是否是激活状态
    public active = true
    constructor(public fn, public scheduler) { }
    run() {
        // 如果当前不是激活状态，则直接执行
        if (!this.active) {
            return this.fn()
        }
        // 这个lastEffect是局部的变量
        // 能够缓存上一次的activeEffect
        let lastEffect = activeEffect
        try {
            // 将当前的effect赋值给activeEffect
            activeEffect = this
            // effect 重新执行之前，要进行一个依赖的清理
            precleanDepEffect(this)
            this._isRunning++
            // 执行fn
            return this.fn()
        } finally {
            this._isRunning--
            // 执行完之后对多余的依赖删除掉，
            // 比如第一次模板渲染effect 收集到了 [flag, age, a,b,c]
            //第二次渲染模板effect收集到了[flag, name], 那么需要把 a b c 也给干掉
            postcleanDepEffect(this)
            // 执行完fn后，将activeEffect赋值为上一次的activeEffect
            activeEffect = lastEffect
        }
    }
}

export function trackEffect(effect, dep) {
    // 去除依赖的的重复手机
    // 比如模板内多次使用同一个变量，会多次收集依赖
    if (dep.get(effect) !== effect._trackId) {
        dep.set(effect, effect._trackId)
        let oldDep = effect.deps[effect._depsLength]
        if (oldDep !== dep) {
            if (oldDep) {
                // oldDep.cleanup()
                cleanDepEffect(oldDep, effect)
            }
            effect.deps[effect._depsLength++] = dep
        } else {
            effect._depsLength++
        }
    }
}
export function triggerEffects(deps) {
    for (const effect of deps.keys()) {
        if (!effect._isRunning) {
            if (effect.scheduler) {
                effect.scheduler()
            }
        }
    }
}