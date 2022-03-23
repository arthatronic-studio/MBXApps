export const getSizeByRatio = ({ width, height, ratio }) => {
    let result = {
        width: width || height,
        height: height || width,
    };

    if (width && ratio) {
        let calculate = (width * (ratio)).toFixed(2)
        result.height = parseFloat(calculate);
    }

    if (height && ratio) {
        let calculate = (height * (ratio)).toFixed(2);
        result.width = parseFloat(calculate);
    }

    return {
        width: result.width,
        height: result.height,
    };
};