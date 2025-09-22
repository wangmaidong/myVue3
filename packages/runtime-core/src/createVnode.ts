import { isArray, isString, ShapeFlags } from "@myvue/shared"
export function isSameVnode(n1, n2) {
    return n1.type == n2.type && n1.key == n2.key
}
export function createVnode(type, props, children) {
    const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
    const vnode = {
        __v_isVnode: true,
        type,
        props,
        children,
        key: props?.key, // 用于diff算法
        el: null, // 虚拟节点对应的真实节点
        shapeFlag
    }
    if (children) {
        // 如果儿子是数组
        if (isArray(children)) {
            vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
        } else {
            // 否则认为是文本
            children = String(children)
            vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
        }
    }
    return vnode
}