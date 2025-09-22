export function isObject(value) {
    return typeof value === 'object' && value !== null  
}

export function isFunction(value) {
    return typeof value === 'function'
}

export function isArray(value) {    
    return Array.isArray(value)
}
export function isString(value) {
    return typeof value === "string"
}
export function isVnode(value) {
    return value?.__v_isVnode 
}
export * from './shapeFlags'