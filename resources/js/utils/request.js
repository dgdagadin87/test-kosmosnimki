import jsonp from 'jsonp';

export default class Request {

    static send(config) {

        return new Promise((resolve, reject) => {

            const {url, data} = config;

            jsonp(url, data, (error, data) => {

                if (error) {
                    reject(error);
                    return;
                }

                resolve(data);
            });
        });
    }

}