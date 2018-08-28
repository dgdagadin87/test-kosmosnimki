import ChartistJS from 'chartist';

export default class DiagramComponent {

    constructor(config = {}) {

        const {container, labels, series, width, height, strokeWidth} = config;

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
                stackBars: true
            }).on('draw', (data) => {
                if(data.type === 'bar') {
                    data.element.attr({style: `stroke-width: ${this._strokeWidth}px`});
                }
            }
        );
    }

    getDiagram() {

        return this._diagram;
    }

    update(newData) {

        this._series = newData;

        this._diagram.update({
            labels: this._labels,
            series: this._series
        });
    }
}