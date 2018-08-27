import '../css/chartist.css';

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
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        series: [
            [800000, 1200000, 1400000, 1300000],
            [200000, 400000, 500000, 300000],
            [100000, 200000, 400000, 600000]
        ]
    },
    {
        stackBars: true,
        axisY: {
            labelInterpolationFnc: function(value) {
                return (value / 1000) + 'k';
            }
        }
    }).on('draw', function(data) {
        if(data.type === 'bar') {
            data.element.attr({
                style: 'stroke-width: 30px'
            });
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