import ChartistJS from 'chartist';

import {DIAGRAM_SERIES} from '../config/config';


export default class DiagramComponent {

    constructor(config = {}) {

        const {container, labels, series, width, height, strokeWidth} = config;

        this._rawData = DIAGRAM_SERIES;

        this._container = container;
        this._labels = labels;
        this._series = series;
        this._width = width;
        this._height = height;
        this._strokeWidth = strokeWidth;

        this._diagram = new ChartistJS.Bar(
            this._container,
            {
                labels: this._labels,
                series: [this._series]
            },
            {
                width: this._width,
                height: this._height,
                seriesBarDistance: 0
                //stackBars: true
            }).on('draw', (data) => {
                if(data.type === 'bar') {
                    //console.log(data);

                    // Получить "координаты" текущего значения
                    const {seriesIndex, index} = data;

                    // Посмотреть, какое значение было изначально по данным координатам
                    const rawValue = this._rawData[seriesIndex][index];
                    const {series} = data;
                    const afterValue = series[index];

                    if (afterValue === rawValue) {
                        data.element.attr({style: `stroke-width: ${this._strokeWidth}px;`});
                        return;
                    }

                    // К какому изначально столбцу принадлежало сырое значение
                    const strokeColor = seriesIndex === 0 ? '#f8bebd' : '#ee5c5c';

                    // Присвоить нужный цвет (текцщий(0) - яркий, норма(1) - блеклый)
                    data.element.attr({style: `stroke-width: ${this._strokeWidth}px; stroke:${strokeColor}`});
                }
            }
        );
    }

    getDiagram() {

        return this._diagram;
    }

    setRawData(data) {

        this._rawData = data;
    }

    update(newData) {

        this._series = newData;

        this._diagram.update({
            labels: this._labels,
            series: this._series
        });
    }
}