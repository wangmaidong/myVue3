// 主要是针对节点元素的属性操作 class  style  event
import patchClass from "./modules/patchClass"
import patchStyle from "./modules/patchStyle"
import  patchEvent  from "./modules/patchEvent"
import patchAttr from "./modules/patchAttr"
const isEventRegExp = (value) => /^on[^a-z]/.test(value)
export default function patchProp(el,key,prevValue, nextValue) {
    if(key == 'class') {
        return patchClass(el, nextValue)
    } else if (key == 'style') {
        return patchStyle(el, prevValue, nextValue)
    } else if (isEventRegExp(key)) {
        return patchEvent(el, key ,nextValue)
    } else {
        return patchAttr(el, key, nextValue)
    }
}