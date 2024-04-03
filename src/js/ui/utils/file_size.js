export const formatSize = (size) => {
    const KB = 1024;
    const MB = 1024 * 1024;

    if (size > MB) return `${(size / MB).toFixed(1)} MB`;
    else if (size > KB) return `${(size / KB).toFixed(1)} KB`;
    else return `${size} B`;
};

export default formatSize;
