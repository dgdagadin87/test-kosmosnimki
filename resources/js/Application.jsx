import '../css/chartist.css';
import '../css/style.css';

import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';

import ymaps from 'ymaps';
import Axios from 'axios';

import ChartistJS from 'chartist';

import Request from './utils/request';

import {
    prepareCoordinates,
    prepareMeteoData,
    createGmxIdUrl,
    createMeteoDataUrl
} from './utils/functions';

let meteoData = [];
let currentYear = 2018;

let diagram = new ChartistJS.Bar(
    '.ct-chart',
    {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Июн', 'Июл', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'],
        series: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    },
    {
        width: 800,
        height: 200,
        stackBars: true
    }).on('draw', function(data) {
        if(data.type === 'bar') {
            data.element.attr({style: 'stroke-width: 30px'});
        }
    }
);

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
            console.log(meteoData);
        })
        .catch((error) => console.error('Error, ', error));
    });
})
.catch(error => console.error('Failed to load Yandex Maps', error));