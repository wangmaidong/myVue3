import { ShapeFlags } from '@myvue/shared'
export function createRenderer(renderOptions) {
    const {
        insert: hostInsert,
        remove: hostRemove,
        createElement: hostCreateElement,
        createText: hostCreateText,
        setText: hostSetText,
        setElementText: hostSetElementText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        patchProp: hostPacthProp
    } = renderOptions
    const mountChildren = (children, container) => {
        for (let i = 0; i < children.length; i++) {
            patch(null, children[i], container)
        }
    }
    const mountElement = (vnode, container) => {
        console.log(vnode)
        const { type, children, props, shapeFlag } = vnode
        let el = hostCreateElement(type)
        if (props) {
            for (let key in props) {
                hostPacthProp(el, key, null, props[key])
            }
        }
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children)
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el)
        }
        hostInsert(el, container)
    }
    const patch = (n1, n2, container) => {
        if (n1 == n2) {
            return
        }
        if (n1 === null) {
            mountElement(n2, container)
        }
    }
    // 多次调用render,会进行虚拟节点的比较，再进行更新
    const render = (vnode, container) => {
        // 第一次渲染dom上没有虚拟dom,那就是创建
        patch(container._vnode || null, vnode, container)
        container._vnode = vnode
    }
    return {
        render
    }
}