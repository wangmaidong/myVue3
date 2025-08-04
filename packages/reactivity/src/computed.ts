import { isFunction } from "@vue/shared"
import { ReactiveEffect } from "./effect"
import { trackRefValue, triggerRefValue } from "./ref"
class ComputedRefImpl {
    public _value
    public effect
    public dep
    constructor(public getter, public setter) {
        this.effect = new ReactiveEffect(() => getter(this._value),() => {
            triggerRefValue(this)
        } )
        this.effect.isComputed = true
    }
    get value() {
        if(this.effect.dirty) {
            this._value = this.effect.run()
            trackRefValue(this)
        } 
        return this._value
    }
    set value(v) {
        this.setter(v)
    }
}
export function computed(getterOrOptions) {
    let onlyGetter = isFunction(getterOrOptions)
    let getter = onlyGetter ? getterOrOptions : getterOrOptions.get
    let setter = onlyGetter ? () => { } : getterOrOptions.set
    return new ComputedRefImpl(getter, setter)
}