import defaultAvatar from "images/icon.png";
import resizeImage from "resize-image";

export function mergeImages(sources = [], options = {}) {
    const defaultOptions = {
        format: "image/png",
        quality: 0.92,
        width: undefined,
        height: undefined,
        Canvas: undefined,
    };
    return new Promise(async (resolve) => {
        options = Object.assign({}, defaultOptions, options);

        sources = sources.filter((source) => source != null);

        sources = sources.slice(0, sources.length >= 9 ? 9 : sources.length);

        // limit
        if (sources.length < 3) {
            for (let i = 0; i <= 3 - sources.length; i++) {
                sources.push(defaultAvatar);
            }
        }

        const successSource = [];
        const failSource = [];
        // 资源检测
        const checkSource = (url) =>
            new Promise((resolve) => {
                const img = document.createElement("img");

                img.onload = () => {
                    successSource.push(url);
                    return resolve(url);
                };
                img.onerror = () => {
                    failSource.push(url);
                    return resolve(defaultAvatar);
                };
                img.src = url;
            });

        // 资源失效处理
        for (let i = 0; i < sources.length; i += 1) {
            sources[i] = await checkSource(sources[i]);
        }

        if (failSource >= 2) {
            // 两张失败
            // 有可用头像
            if (successSource.length) sources = [successSource[0]];
            else sources = [defaultAvatar]; // 无可用头像
        }

        // Setup browser/Node.js specific variables
        const canvas = options.Canvas
            ? new options.Canvas()
            : window.document.createElement("canvas");
        const Image = options.Canvas ? options.Canvas.Image : window.Image;
        if (options.Canvas) {
            options.quality *= 100;
        }

        let targetSize = 240;
        // let targetSize = 64;
        let divider = 1;
        var size = 0;

        switch (sources.length) {
            case 1:
                size = targetSize;
                break;
            case 2:
                size = (targetSize - 3 * divider) / 2;
                break;
            case 3:
                size = (targetSize - 3 * divider) / 2;
                break;
            case 4:
                size = (targetSize - 3 * divider) / 2;
                break;
            case 5:
                size = (targetSize - 4 * divider) / 3;
                break;
            case 6:
                size = (targetSize - 4 * divider) / 3;
                break;
            case 7:
                size = (targetSize - 4 * divider) / 3;
                break;
            case 8:
                size = (targetSize - 4 * divider) / 3;
                break;
            case 9:
                size = (targetSize - 4 * divider) / 3;
                break;
        }

        // Load sources
        const images = sources.map(
            async (source, i) =>
                await new Promise((resolve, reject) => {
                    // Convert sources to objects
                    if (source.constructor.name !== "Object") {
                        source = { src: source };
                    }

                    // Resolve source and img when loaded
                    const img = new Image();
                    img.setAttribute("crossOrigin", "anonymous");
                    //img.onerror = () => reject(new Error('Couldn\'t load image'));
                    img.onerror = () => resolve(null);
                    img.onload = () => {
                        // 3张图片时，特殊处理
                        let sizeX = size;
                        let sizeY = size;
                        if (sources.length === 3 && i === 0) {
                            sizeX = size * 2;
                            sizeY = size * 2;
                        }
                        return resolve(
                            Object.assign({}, source, {
                                data: resizeImage.resize(img, sizeX, sizeY, resizeImage.PNG),
                            })
                        );
                    };
                    img.src = source.src;
                })
        );

        const loadResizedImages = (resizedImagesBase64) =>
            resizedImagesBase64.map(
                (image) =>
                    new Promise((resolve, reject) => {
                        // Resolve source and img when loaded
                        const img = new Image();
                        img.setAttribute("crossOrigin", "anonymous");
                        //img.onerror = () => reject(new Error('Couldn\'t load image2'));
                        img.onerror = () => resolve(null);
                        img.onload = () => resolve(Object.assign({}, { img }));
                        img.src = image.data;
                    })
            );

        // Get canvas context
        const ctx = canvas.getContext("2d");

        // When sources have loaded
        resolve(
            Promise.all(images)
                .then((images) => {
                    images = images.filter((i) => i !== null);
                    return Promise.all(loadResizedImages(images));
                })
                .then((images) => {
                    images = images.filter((i) => i !== null);
                    // Set canvas dimensions
                    // const getSize = dim => options[dim] || Math.max(...images.map(image => image.img[dim]));
                    // canvas.width = getSize('width');
                    // canvas.height = getSize('height');
                    canvas.width = targetSize;
                    canvas.height = targetSize;
                    switch (images.length) {
                        case 1:
                            images[0].x = 0;
                            images[0].y = 0;
                        case 2:
                            images[0].x = divider;
                            images[0].y = targetSize / 4;
                            images[1].x = images[0].x + size + divider;
                            images[1].y = images[0].y;
                            break;
                        case 3:
                            images[0].x = -size + divider;
                            images[0].y = divider;

                            images[1].x = images[0].x + size * 2 + divider * 2;
                            images[1].y = divider;
                            images[2].x = images[0].x + size * 2 + divider * 2;
                            images[2].y = images[1].y + size + divider;
                            break;
                        case 4:
                            images[0].x = divider;
                            images[0].y = divider;
                            images[1].x = images[0].x + size + divider;
                            images[1].y = divider;

                            images[2].x = divider;
                            images[2].y = images[0].y + size + divider;
                            images[3].x = images[2].x + size + divider;
                            images[3].y = images[2].y;
                            break;
                        case 5:
                            images[0].x = (targetSize - 2 * size - divider) / 2;
                            images[0].y = (targetSize - 2 * size - divider) / 2;
                            images[1].x = images[0].x + size + divider;
                            images[1].y = images[0].y;

                            images[2].x = divider;
                            images[2].y = images[1].y + size + divider;
                            images[3].x = images[2].x + size + divider;
                            images[3].y = images[2].y;
                            images[4].x = images[3].x + size + divider;
                            images[4].y = images[2].y;
                            break;
                        case 6:
                            images[0].x = divider;
                            images[0].y = (targetSize - 2 * size - divider) / 2;
                            images[1].x = images[0].x + size + divider;
                            images[1].y = images[0].y;
                            images[2].x = images[1].x + size + divider;
                            images[2].y = images[0].y;

                            images[3].x = divider;
                            images[3].y = images[0].y + size + divider;
                            images[4].x = images[3].x + size + divider;
                            images[4].y = images[3].y;
                            images[5].x = images[4].x + size + divider;
                            images[5].y = images[3].y;
                            break;
                        case 7:
                            images[0].x = divider + size + divider;
                            images[0].y = divider;

                            images[1].x = divider;
                            images[1].y = images[0].y + size + divider;
                            images[2].x = images[1].x + size + divider;
                            images[2].y = images[1].y;
                            images[3].x = images[2].x + size + divider;
                            images[3].y = images[1].y;

                            images[4].x = divider;
                            images[4].y = images[1].y + size + divider;
                            images[5].x = images[4].x + size + divider;
                            images[5].y = images[4].y;
                            images[6].x = images[5].x + size + divider;
                            images[6].y = images[4].y;
                            break;
                        case 8:
                            images[0].x = (targetSize - 2 * size - divider) / 2;
                            images[0].y = divider;
                            images[1].x = images[0].x + size + divider;
                            images[1].y = images[0].y;

                            images[2].x = divider;
                            images[2].y = images[0].y + size + divider;
                            images[3].x = images[2].x + size + divider;
                            images[3].y = images[2].y;
                            images[4].x = images[3].x + size + divider;
                            images[4].y = images[2].y;

                            images[5].x = divider;
                            images[5].y = images[2].y + size + divider;
                            images[6].x = images[5].x + size + divider;
                            images[6].y = images[5].y;
                            images[7].x = images[6].x + size + divider;
                            images[7].y = images[5].y;
                            break;
                        case 9:
                            images[0].x = divider;
                            images[0].y = divider;
                            images[1].x = images[0].x + size + divider;
                            images[1].y = images[0].y;
                            images[2].x = images[1].x + size + divider;
                            images[2].y = images[0].y;

                            images[3].x = divider;
                            images[3].y = images[0].y + size + divider;
                            images[4].x = images[3].x + size + divider;
                            images[4].y = images[3].y;
                            images[5].x = images[4].x + size + divider;
                            images[5].y = images[3].y;

                            images[6].x = divider;
                            images[6].y = images[3].y + size + divider;
                            images[7].x = images[6].x + size + divider;
                            images[7].y = images[6].y;
                            images[8].x = images[7].x + size + divider;
                            images[8].y = images[6].y;
                            break;
                    }

                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    // Draw images to canvas
                    images.forEach((image) => {
                        ctx.globalAlpha = image.opacity ? image.opacity : 1;
                        return ctx.drawImage(image.img, image.x || 0, image.y || 0);
                    });

                    if (options.Canvas && options.format === "image/jpeg") {
                        // Resolve data URI for node-canvas jpeg async
                        return new Promise((resolve) => {
                            canvas.toDataURL(
                                options.format,
                                {
                                    quality: options.quality,
                                    progressive: false,
                                },
                                (err, jpeg) => {
                                    if (err) {
                                        throw err;
                                    }
                                    resolve(jpeg);
                                }
                            );
                        });
                    }

                    // Resolve all other data URIs sync
                    return canvas.toDataURL(options.format, options.quality);
                })
        );
    });
}

export function base64toBlob(dataurl) {
    let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}
