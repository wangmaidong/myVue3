import { activeEffect,trackEffect,triggerEffects } from "./effect"
import { toReactive } from "./reactive"
import { createDep } from "./reactiveEffect"
export function ref(value) {
    return createRef(value)
}

function createRef(value) {
    return new RefImpl(value)
}

class RefImpl {
    public __v_isRef = true
    public _value
    public dep;
    constructor(public rawValue) {
        this._value = toReactive(rawValue)
    }
    get value() {
        trackRefValue(this)
        return this._value
    }
    set value(newVal) {
        if(newVal !== this.rawValue) {
            this.rawValue = newVal
            this._value = newVal
            triggerRefValue(this)
        }
    }   
}

export function trackRefValue(ref) {
    if(activeEffect) {
        ref.dep = createDep( () => {
            ref.dep = undefined
        } , 'undefined')
        trackEffect(activeEffect, ref.dep)
    }
}

export function triggerRefValue(ref) {
    let dep = ref.dep
    if(dep) {
        triggerEffects(dep)
    }
}

export function toRef(object,key) {
    return new ObjectRefImpl(object,key)
}
class ObjectRefImpl {
    public __v_isRef = true
    constructor(public _object,public _key) {}
    get value() {
        return this._object[this._key]
    }
    set value(newVal) {
        this._object[this._key] = newVal
    }
}

export function toRefs(object) {
    const ret = {}
    for(const key in object) {
        ret[key] = toRef(object,key)
    }
    return ret
 }

 export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target,key,receiver) {
            let v = Reflect.get(target,key,receiver)
            return v.__v_isRef ? v.value : v
        },
        set(target, key ,value, receiver)  {
            const oldValue = target[key]
            if(oldValue.__v_isRef) {
                oldValue.value = value
                return true
            } else {
                return Reflect.set(target,key,value,receiver)
            }
        }
    })
    
 }
