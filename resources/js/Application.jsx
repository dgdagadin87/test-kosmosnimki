import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';

import ymaps from 'ymaps';
import Axios from 'axios';

import {prepareCoordinates, createGmxIdUrl} from './utils/functions';

ymaps.load().then(maps => {
    const map = new maps.Map('map-container', {
        center: [55.76, 37.64],
        zoom: 7
    });

    map.events.add('click', (e) => {

        const coordinates = e.get('coords');

        const preparedCoordinates = prepareCoordinates(coordinates);
        const {north, south} = preparedCoordinates;

        Axios.get(createGmxIdUrl(north, south))
        .then( (response) => {

            console.log(response);
        })
        .catch((error) => console.error(error));

        console.log(preparedCoordinates)
    });
})
.catch(error => console.error('Failed to load Yandex Maps', error));