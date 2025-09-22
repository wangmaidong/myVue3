import { isObject, ShapeFlags } from "@myvue/shared"
import { isArray, isVnode } from "@myvue/shared"
import { createVnode } from "./createVnode"
// h函数可以按以下方式传递参数
// h(类型，属性，儿子)
// h(类型，属性) 
// h(类型，[儿子, 儿子])  或者  h(类型，儿子)
// 但是不能出现 h(类型, 儿子, 儿子)
export function h(type, propsOrChildren?, children?) {
    let l = arguments.length
    if (l === 2) {
        // 儿子是对象但不是数组，那传递的就是属性或者虚拟节点
        if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
            if (isVnode(propsOrChildren)) {
                return createVnode(type, null, [propsOrChildren])
            } else {
                return createVnode(type, propsOrChildren,children)
            }
        }
        return createVnode(type, null, propsOrChildren)
    } else {
        if (l > 3) {
            children = Array.from(arguments).slice(2)
        } 
        if(l == 3 && isVnode(children)) {
            children = [children]
        }
        return createVnode(type, propsOrChildren, children)
    }
}
