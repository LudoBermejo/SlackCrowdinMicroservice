var WebClient = require('@slack/client').WebClient;

var Promise = require('promise');
var web = "";
module.exports = {

    connect: connect,
    send: send

}

function connect(SLACK_TOKEN) {

    return new Promise(function (resolve, reject) {
        var token = SLACK_TOKEN;
        web = new WebClient(token);

        web.team.info(function teamInfoCb(err, info) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    })

}

function send(message) {

    var data = {
        "username": "CrowdinBot",
        "icon_url": "https://crowdin.com/mstile-144x144.png"
    };

    web.chat.postMessage("frontend", message || "Demo message", data, function () {
    });

}