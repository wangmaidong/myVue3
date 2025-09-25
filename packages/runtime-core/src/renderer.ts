import { ShapeFlags } from "@myvue/shared"
import { isSameVnode } from "./createVnode"

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
    const unmountChildren = (children) => {
        for (let i = 0; i < children.length; i++) {
            unmount(children[i])
        }
    }
    const mountElement = (vnode, container, ancher = null) => {
        // console.log(vnode)
        const { type, children, props, shapeFlag } = vnode
        // 第一次渲染的时候我们让当前的虚拟节点和真实的dom关联起来
        // 后续虚拟节点更新可以拿到真实dom来复用
        let el = (vnode.el = hostCreateElement(type))
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
        hostInsert(el, container, ancher)
    }
    const patchProps = (oldProps, newProps, el) => {
        for (let key in newProps) {
            hostPacthProp(el, key, oldProps[key], newProps[key])
        }
        for (let key in oldProps) {
            if (!newProps.hasOwnProperty(key)) {
                hostPacthProp(el, key, oldProps[key], null)
            }
        }
    }
    const patchKeyChildren = (c1, c2, el) => {
        let i = 0
        let e1 = c1.length - 1
        let e2 = c2.length - 1
        // 先从头部开始比较
        while (i <= e1 && i <= e2) {
            if (isSameVnode(c1[i], c2[i])) {
                patch(c1[i], c2[i], el)
            } else {
                break
            }
            i++
        }
        // 从尾部比较
        while (e1 >= i && e2 >= i) {
            if (isSameVnode(c1[e1], c2[e2])) {
                patch(c1[e1], c2[e2], el)
            } else {
                break
            }
            e1--;
            e2--
        }   
        if (i > e1) {
            if (i <= e2) {
                let nextPos = e2 + 1
                let ancher = c2[nextPos]?.el
                while (i <= e2) {
                    patch(null, c2[i], el, ancher)
                    i++
                }
            }
        } else if (i > e2) {
            if(i <= e1) {
                while(i <= e1) {
                    unmount(c1[i])
                    i++
                }
            }
        } else {
            let s1 = i
            let s2 = i
            // 根据新的虚拟节点数组中不同的区间创建一个  key : index  组成的map
            const keyToNewIndexMap = new Map()
            for(let i = s2; i <= e2; i++) {
                let key = c2[i].key
                keyToNewIndexMap.set(key, i)
            }
            // 循环老虚拟节点不同的区间
            for(let i = s1; i <= e1; i++) {
                let vnode = c1[i]
                // 按老虚拟节点的key去map里面查找，如果找到了就可以复用老虚拟节点的dom
                // key在映射表里不存在就要删除
                let index = keyToNewIndexMap.get(vnode.key)
                if(!index) {
                    unmount(vnode)
                } else {
                    patch(vnode, c2[index], el)
                }
            }
            // 计算出要倒叙插入的长度
            let toBePatched = e2 - s2 + 1
            // 从要倒叙插入的区间的最后一个开始
            for(let i = toBePatched - 1 ; i >= 0 ; i--) {
                // 求出要倒叙插叙的最后一个元素在c2中对应的实际索引
                let newIndex = s2 + i
                // 取出倒叙插入的节点的上一个节点
                let ancher = c2[newIndex+1]?.el
                let vnode = c2[newIndex]
                if(!vnode.el) {
                    patch(null, vnode, el, ancher)
                } else {
                    hostInsert(vnode.el, el, ancher)
                }
            }
        }

    }
    const patchChildren = (n1, n2, el) => {
        // 拿到新旧虚拟节点的子节点
        const c1 = n1.children
        const c2 = n2.children
        // 拿到新旧虚拟节点的shapeFlag
        const preShapeFlag = n1.shapeFlag
        const shapeFlage = n2.shapeFlag
        // 如果新虚拟节点的儿子是文本
        if (shapeFlage & ShapeFlags.TEXT_CHILDREN) {
            // 旧虚拟节点的儿子是数组
            if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                // 删除老儿子，设置文本内容
                unmountChildren(c1)
            }
            if (c1 !== c2) {
                hostSetElementText(el, c2)
            }
        } else {
            if (preShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                if (shapeFlage & ShapeFlags.ARRAY_CHILDREN) {
                    patchKeyChildren(c1, c2, el)
                    // 如果新旧虚拟节点的儿子都是数组，就要全量diff
                } else {
                    // 新虚拟节点是空，那就移除老的dom节点
                    unmountChildren(c1)
                }
            } else {
                if (preShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                    hostSetElementText(el, '')
                }
                if (shapeFlage & ShapeFlags.ARRAY_CHILDREN) {
                    mountChildren(c2, el)
                }
            }
        }

    }
    const processElement = (n1, n2, container, ancher) => {
        if (n1 === null) {
            mountElement(n2, container, ancher)
        } else {
            // 前后虚拟节点是同一类
            patchElement(n1, n2, container)
        }
    }

    const patchElement = (n1, n2, container) => {
        // 1.比较元素的差异，需要复用dom
        // 2.比较元素的属性和子节点
        let el = n2.el = n1.el
        let oldProps = n1.props || {}
        let newProps = n2.props || {}
        patchProps(oldProps, newProps, el)
        patchChildren(n1, n2, el)
    }
    const patch = (n1, n2, container, ancher = null) => {
        if (n1 == n2) {
            return
        }
        // 如果前后都有vnode,但是不相同的虚拟节点，（类型和key一样就是相同的）
        // 卸载老的虚拟节点生成的dom,重新渲染新的虚拟节点
        if (n1 && !isSameVnode(n1, n2)) {
            unmount(n1)
            n1 = null
        }
        processElement(n1, n2, container, ancher)
    }
    const unmount = (vnode) => {
        let el = vnode.el
        hostRemove(el)
    }
    // 多次调用render,会进行虚拟节点的比较，再进行更新
    const render = (vnode, container) => {
        // 如果用户传了一个空的虚拟节点而且容器上还存在过之前的vnode
        // 那么要卸载
        if (vnode == null) {
            if (container._vnode) {
                unmount(container._vnode)
            }
        }
        // 第一次渲染dom上没有虚拟dom,那就是创建
        patch(container._vnode || null, vnode, container)
        container._vnode = vnode
    }
    return {
        render
    }
}