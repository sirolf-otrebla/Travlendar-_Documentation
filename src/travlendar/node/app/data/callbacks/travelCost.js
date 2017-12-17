exports.fetch = function (msg, callback) {
        const MY_TRAFFIC_ASSUMPTION = "best_guess";
        let extServicesCallback = require('../external.js');
        //TODO change this
        var self = msg;
        extServicesCallback.fetchRoute(
            msg.origin,
            msg.destination,
            msg.travelMean,
            msg.departure,
            MY_TRAFFIC_ASSUMPTION,
            (result) => {
                self.distance =  {
                    value : result.rows[0].elements[0].distance.value,
                    text : result.rows[0].elements[0].distance.text
                };

                self.time = {

                    value :  result.rows[0].elements[0].duration.value,
                    text : result.rows[0].elements[0].duration.text
                };

                if (this.travelMean === "TRANSIT"){
                    self.fare = {
                        value : result.rows[0].elements[0].fare.value,
                        text : result.rows[0].elements[0].fare.currency,
                    }
                }
                callback(self);
            }
        );

    }

