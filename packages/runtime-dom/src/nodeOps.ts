// 主要是对节点元素的增删改查
export const nodeOps = {
    // 新增/插入节点
    // insertBefore这个api既可以把元素插入到某个元素的前面
    // 如果第二个参数为null，那就等同于appendChild
    insert: (el, parent, anchor) => parent.insertBefore(el, anchor || null),
    // 移除节点
    remove: (el) => {
        const parent = el.parentNode
        parent && parent.removeChild(el)
    },
    createElement: (type) => document.createElement(type),
    // 创建文本节点
    createText: (text) => document.createTextNode(text),
    // 给文本节点设置文本
    setText: (node, text) => node.nodeValue = text,
    // 给dom元素设置文本
    setElementText: (el, text) => el.textContent = text,
    //获取父亲元素
    parentNode: (node) => node.parentNode,
    // 获取相邻下一个元素
    nextSibling: (node) => node.nextSibling
    
}