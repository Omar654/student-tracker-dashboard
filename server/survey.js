const config = require('./config.js'),
request = require('request-promise'),
app = require('./server')

module.exports = {
    getWeekly: (req, res) => {
            var options = {
                uri: config.weeklySurveyAPI,
                json: true // Automatically parses the JSON string in the response
            }; 
        request(options).then(function (resp) {
            res.send(resp)
        })
    },

    getWeeklyByCohortId: (req, res) => {
        var options = {
            uri: 'https://surveys.devmountain.com/api/tableau/data?cohort=' + req.query.id,
            json: true 
        };
        request(options).then(function (resp) {
            res.send(resp)
        })
    }
}


///api/tableau/data?active=all&comment=all
