function prepareCoordinates(coordinates) {

    const north = coordinates[0].toFixed(2);
    const east = coordinates[1].toFixed(2);

    return {
        north,
        east
    };
}

function prepareMeteoData(result, currentYear) {

    const {data: {features = []}} = result;

    let correctResult = {};

    for (let i = 0; i < features.length; i++) {

        const {properties: currentProperties = {}} = features[i];
        const {Date: currentDate, AvgTemp: currentAvgTemp} = currentProperties;

        const dateArray = currentDate.split('-');
        const year = dateArray[0];
        const month = dateArray[1];
        const day = dateArray[2];

        if (!correctResult[year]) {
            correctResult[year] = {};
        }

        if (!correctResult[year][month]) {
            correctResult[year][month] = {};
        }

        correctResult[year][month][day] = currentAvgTemp;
    }

    const returnResult = [];

    for (let month in correctResult[currentYear]) {

        const currentMonthData = correctResult[currentYear][month];
        let counter = 0;
        let avgTemperature = 0;

        for (let day in currentMonthData) {
            counter++;
            avgTemperature += currentMonthData[day];
        }

        returnResult.push(avgTemperature/counter);
    }

    return returnResult;
}

function createGmxIdUrl(north, east) {

    return `http://maps.kosmosnimki.ru/rest/ver1/layers/35FB2C338FED4B64B7A326FBFE54BE73/search?query=%22lat%22=55.75and%22lon%22=37.25&apikey=6Q81IXBUQ7&WrapStyle=func&callbackname=serviceCallback`;
}

function createMeteoDataUrl(gmxId, year) {

    const formYear = year;
    const toYear = parseInt(year) - 4;

    return `http://maps.kosmosnimki.ru/rest/ver1/layers/11A381497B4A4AE4A4ED6580E1674B72/search?query=year(%22date%22)<=${formYear}%20and%20year(%22date%22)>${toYear}%20and%20%22gridpoint_id%22=${gmxId}&apikey=6Q81IXBUQ7`;
}

export {prepareCoordinates, prepareMeteoData, createGmxIdUrl, createMeteoDataUrl};