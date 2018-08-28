import jsonp from 'jsonp';
import Axios from 'axios';

export default class Request {

    static send(config) {

        const {mode = 'standart', url, data = {}} = config;

        if (mode !== 'standart') {
            return new Promise((resolve, reject) => {

                jsonp(url, data, (error, data) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(data);
                });
            });
        }
        else {
            return Axios.get(url, data);
        }
    }

}