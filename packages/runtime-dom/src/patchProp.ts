// 主要是针对节点元素的属性操作 class  style  event
import patchClass from "./modules/patchClass"
import patchStyle from "./modules/patchStyle"
export default function patchProp(el,key,prevValue, nextValue) {
    if(key == 'class') {
        return patchClass(el, nextValue)
    } else if (key == 'style') {
        return patchStyle(el, prevValue, nextValue)
    }
}