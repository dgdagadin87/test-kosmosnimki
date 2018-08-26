function prepareCoordinates(coordinates) {

    const north = coordinates[0].toFixed(2);
    const east = coordinates[1].toFixed(2);

    return {
        north,
        east
    };
}

function createGmxIdUrl(north, east) {

    return `http://maps.kosmosnimki.ru/rest/ver1/layers/35FB2C338FED4B64B7A326FBFE54BE73/search?query=%22lat%22=${north}and%22lon%22=${east}&apikey=6Q81IXBUQ7&WrapStyle=func&callbackname=functionname`;
}

export {prepareCoordinates, createGmxIdUrl};