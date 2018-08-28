import '../css/chartist.css';
import '../css/style.css';

import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/es6/promise';

import ymaps from 'ymaps';

import {
    YEAR,
    CALLBACK_NAME,
    DIAGRAM_CONTAINER,
    DIAGRAM_HEIGHT,
    DIAGRAM_WIDTH,
    DIAGRAM_LABELS,
    DIAGRAM_SERIES,
    DIAGRAM_STROKE_WIDTH,
    MAP_CONTAINER,
    MAP_EAST,
    MAP_NORTH,
    MAP_ZOOM, YEAR_NUMBER
} from './config/config';

import Diagram from './core/diagram';

import Request from './core/request';

import {
    prepareCoordinates,
    prepareMeteoData,
    createGmxIdUrl,
    createMeteoDataUrl
} from './utils/functions';


class Application {

    constructor() {

        this._currentYear = YEAR;

        this._currentCoords = {
            north: null,
            east: null
        };

        this._diagram = new Diagram({
            container: DIAGRAM_CONTAINER,
            series: DIAGRAM_SERIES,
            labels: DIAGRAM_LABELS,
            width: DIAGRAM_WIDTH,
            height: DIAGRAM_HEIGHT,
            strokeWidth: DIAGRAM_STROKE_WIDTH
        });

        this._map = ymaps;

        this._select = document.getElementById('yearSelect');

        this._init();
    }

    _init() {

        this._select.addEventListener('change', this._selectChangeHandler.bind(this));
        this._createYearSelectOptions();
    }

    run() {

        this._map.load().then(maps => {
            const map = new maps.Map(MAP_CONTAINER, {
                center: [MAP_NORTH, MAP_EAST],
                zoom: MAP_ZOOM
            });

            map.events.add('click', this._mapClickHandler.bind(this));
        })
        .catch(error => console.error('Failed to load Yandex Maps', error));
    }

    _buildDiagram() {

        const {north, east} = this._currentCoords;

        Request.send({
            mode: 'jsonp',
            url: createGmxIdUrl(north, east),
            data: {name: CALLBACK_NAME}
        })
        .then((data) => {
            const {features = []} = data;
            const featureFirst = features[0] || {};
            const {properties: { gmx_id = 0 }} = featureFirst;

            return Request.send({
                mode: 'standart',
                url: createMeteoDataUrl(gmx_id, this._currentYear)
            });
        })
        .then((data) => {

            const preparedData = prepareMeteoData(data, this._currentYear);
            const {currentYearData = [], allYearsData = []} = preparedData;

            this._diagram.update([currentYearData, allYearsData]);
        })
        .catch((error) => console.error('Error, ', error));
    }

    _mapClickHandler(e) {

        const coordinates = e.get('coords');

        const preparedCoordinates = prepareCoordinates(coordinates);
        const {north, east} = preparedCoordinates;

        this._currentCoords = {
            north, east
        };

        this._buildDiagram();
    }

    _selectChangeHandler(e) {

        const {value = YEAR} = this._select;

        this._currentYear = value;

        const {north, east} = this._currentCoords;

        if (!north || !east) {
            alert('Кликните по карте');
            return;
        }

        this._buildDiagram();
    }

    _createYearSelectOptions() {

        const lastYear = YEAR - YEAR_NUMBER;

        for (let i = YEAR; i >= lastYear; i--) {

            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            this._select.appendChild(option);
        }
    }
}

const mainApplication = new Application();
mainApplication.run();