export default function patchStyle(el, prevValue, nextValue) {
    let style = el.style
    if (nextValue) {
        for (let key in nextValue) {
            style[key] = nextValue[key]
        }
        if (prevValue) {
            for (let key in prevValue) {

                if (!nextValue.hasOwnProperty(key)) {
                    style[key] = null
                }
            }
        }
    } else {
        el.style = null
    }

}