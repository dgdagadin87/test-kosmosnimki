import '../css/chartist.css';
import '../css/style.css';

import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';

import ymaps from 'ymaps';
import Axios from 'axios';

import Diagram from './utils/diagram';

import Request from './utils/request';

import {
    prepareCoordinates,
    prepareMeteoData,
    createGmxIdUrl,
    createMeteoDataUrl
} from './utils/functions';

let labels = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'];
let meteoData = [];
let currentYear = 2017;

const diagram = new Diagram({
    container: '.ct-chart',
    series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    labels,
    width: 800,
    height: 200,
    strokeWidth: 40
});

ymaps.load().then(maps => {
    const map = new maps.Map('map-container', {
        center: [55.76, 37.64],
        zoom: 7
    });

    map.events.add('click', (e) => {

        const coordinates = e.get('coords');

        const preparedCoordinates = prepareCoordinates(coordinates);
        const {north, south} = preparedCoordinates;

        Request.send({
            url: createGmxIdUrl(north, south),
            data: {name: 'serviceCallback'}
        })
        .then((data) => {
            const {features = []} = data;
            const featureFirst = features[0] || {};
            const {properties: { gmx_id = 0 }} = featureFirst;

            return Axios.get(createMeteoDataUrl(gmx_id, currentYear), {});
        })
        .then((data) => {
            meteoData = prepareMeteoData(data, currentYear);

            diagram.update(meteoData);
        })
        .catch((error) => console.error('Error, ', error));
    });
})
.catch(error => console.error('Failed to load Yandex Maps', error));