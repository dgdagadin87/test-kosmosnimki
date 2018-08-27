import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';

import ymaps from 'ymaps';

import Request from './utils/request';

import {
    prepareCoordinates,
    createGmxIdUrl,
    serviceCallback
} from './utils/functions';


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
            console.log(data);
        })
        .catch((error) => {
            console.error(error);
        });
    });
})
.catch(error => console.error('Failed to load Yandex Maps', error));