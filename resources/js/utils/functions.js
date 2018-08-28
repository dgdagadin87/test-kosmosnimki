import {YEAR_DIFF} from '../config/config';

function prepareCoordinates(coordinates) {

    let north = coordinates[0].toFixed(2);
    let east = coordinates[1].toFixed(2);
    let correctNorth;
    let correctEast;

    let northDiff = Math.round((parseFloat(north) - parseInt(north))*100);
    let eastDiff = Math.round((parseFloat(east) - parseInt(east))*100);

    correctNorth = northDiff === 0 ? north : roundCoordinate(parseInt(north), northDiff);
    correctEast = eastDiff === 0 ? east : roundCoordinate(parseInt(east), eastDiff);

    return {
        north: correctNorth,
        east: correctEast
    };
}

function roundCoordinate(coordinate, diff) {

    let decimalPart = 0;
    let correctValue = coordinate;

    if (1 <= diff && diff <= 12) {
        decimalPart = '00';
    }
    else if (13 <= diff && diff <= 37 ) {
        decimalPart = '25';
    }
    else if (38 <= diff && diff <= 62) {
        decimalPart = '50';
    }
    else if (63 <= diff && diff <= 87) {
        decimalPart = '75';
    }
    else if (88 <= diff && diff <= 99) {
        decimalPart = '00';
        correctValue += 1;
    }

    return (String(correctValue) + '.' + String(decimalPart));
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

    /* среднее за текущий год */
    const currentYearData = countAvgTempetatureInYear(correctResult, currentYear);

    /* среднемесячная норма */
    let allYears = {};
    for (let yearIndex in correctResult) {
        allYears[yearIndex] = countAvgTempetatureInYear(correctResult, yearIndex)
    }
    let allYearsData = [];
    for (let i = 0; i < 12; i++) {
        let avgTemp = 0;
        for (let yearIndex in allYears) {
            avgTemp += allYears[yearIndex][i];
        }
        allYearsData.push(avgTemp/YEAR_DIFF);
    }

    return {
        currentYearData,
        allYearsData
    };
}

function countAvgTempetatureInYear(data, year) {

    const yearData = [];

    for (let month in data[year]) {

        const currentMonthData = data[year][month];
        let counter = 0;
        let avgTemperature = 0;

        for (let day in currentMonthData) {
            counter++;
            avgTemperature += currentMonthData[day];
        }

        yearData.push(avgTemperature/counter);
    }

    const resultLength = yearData.length;

    if (resultLength < 12) {
        const lengthDiff = 12 - resultLength;

        for (let i = 0; i < lengthDiff; i++) {
            yearData.push(0);
        }
    }

    return yearData;
}

function createGmxIdUrl(north, east) {

    return `http://maps.kosmosnimki.ru/rest/ver1/layers/35FB2C338FED4B64B7A326FBFE54BE73/search?query=%22lat%22=${north}and%22lon%22=${east}&apikey=6Q81IXBUQ7&WrapStyle=func&callbackname=serviceCallback`;
}

function createMeteoDataUrl(gmxId, year) {

    const formYear = year;
    const toYear = parseInt(year) - 4;

    return `http://maps.kosmosnimki.ru/rest/ver1/layers/11A381497B4A4AE4A4ED6580E1674B72/search?query=year(%22date%22)<=${formYear}%20and%20year(%22date%22)>${toYear}%20and%20%22gridpoint_id%22=${gmxId}&apikey=6Q81IXBUQ7`;
}

export {prepareCoordinates, prepareMeteoData, createGmxIdUrl, createMeteoDataUrl};