const YEAR = 2018;
const YEAR_DIFF = 4;
const YEAR_NUMBER = 10;

const CALLBACK_NAME = 'serviceCallback';

const DIAGRAM_CONTAINER = '.ct-chart';
const DIAGRAM_WIDTH = 800;
const DIAGRAM_HEIGHT = 200;
const DIAGRAM_STROKE_WIDTH = 40;
const DIAGRAM_LABELS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'];
const DIAGRAM_SERIES = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

const MAP_CONTAINER = 'map-container';
const MAP_ZOOM = 7;
const MAP_NORTH = 55.76;
const MAP_EAST = 37.64;

const MONTH_ASSOC = {
    '01': 0,
    '02': 1,
    '03': 2,
    '04': 3,
    '05': 4,
    '06': 5,
    '07': 6,
    '08': 7,
    '09': 8,
    '10': 9,
    '11': 10,
    '12': 11
};

export {YEAR, YEAR_DIFF, YEAR_NUMBER, CALLBACK_NAME, DIAGRAM_CONTAINER, DIAGRAM_HEIGHT, DIAGRAM_WIDTH, DIAGRAM_LABELS, DIAGRAM_SERIES, DIAGRAM_STROKE_WIDTH, MAP_CONTAINER, MAP_EAST, MAP_NORTH, MAP_ZOOM, MONTH_ASSOC};