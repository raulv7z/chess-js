/*
| --------------------------------------------------------------
|
|   Nodes Library
|
|   Library used for DOM node tasks management.
|
| --------------------------------------------------------------
*/

/**
 * Each parameter will be passed to the function following
 * the "key=value" syntax.
 *
 * If you want to create a node that includes text, the syntax is not followed.
 * Simply place the text without "=" in the parameter list
 * and internally in the function it is already evaluated that key-value is not used.
 * Styles can also be used with the syntax that would be used in conventional HTML.
 *
 * @param {*} element -> Element to create (div, p, td...)
 * @param {*} parameters -> attributes to add for the element.
 * @returns A DOM Node element.
 */

export function createNode(element, ...parameters) {
    let node = document.createElement(element);
    let keyValue;

    for (let param of parameters) {
        keyValue = param.split("=");

        if (keyValue.length != 2)
            node.appendChild(document.createTextNode(keyValue[0]));
        else
            keyValue[0] == "style"
                ? (node.style = keyValue[1])
                : node.setAttribute(keyValue[0], keyValue[1]);
    }
    return node;
}
