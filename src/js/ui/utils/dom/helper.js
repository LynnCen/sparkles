export const getSelectDom = () => {
    const range = window.getSelection().getRangeAt(0);
    const container = document.createElement("div");
    container.appendChild(range.cloneContents());
    return container.innerHTML;
};
