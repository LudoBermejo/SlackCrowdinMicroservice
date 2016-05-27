// grab the packages we need
var crowdin = require('./crowdin/crowdin');
var slack = require('./slack/slack');
var nconf = require('nconf');
nconf
    .file({ file:
        'conf/conf.json'
    });


slack.connect(nconf.get('SLACK_TOKEN'))
    .then(function() {
        setInterval(function() {
            checkCrowdin();
        },1000*60*5);
        checkCrowdin();
    })
    .catch(function(err) {
        console.log(err);
    });

function checkCrowdin() {
    crowdin.checkTranslations().then(function(differences) {
        if(differences.length){
            var message = "Branches changed: " + differences.join(", ");
            slack.send(message);
        }

    })
    .catch(function(e) {
        console.log(e)
    });
}