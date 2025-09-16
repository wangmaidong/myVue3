export default function patchStyle(el: HTMLElement, prevValue: object, nextValue: object): void {
    let style = el.style
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
}