import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';

import ymaps from 'ymaps';

ymaps.load().then(maps => {
    const map = new maps.Map('map-container', {
        center: [55.76, 37.64],
        zoom: 18
    });
})
.catch(error => console.log('Failed to load Yandex Maps', error));