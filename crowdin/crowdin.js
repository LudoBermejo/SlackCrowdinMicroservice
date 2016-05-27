var Promise = require('promise');
var request = require('request-promise');
var fsp = require('fs-promise');
var equal = require('deep-equal')

// Constants of project
var PROJECT_ID = "starzplay-arabia-portal";
var API_KEY = "9f172558d746ecfc6d528c71278bb9af";
var urlProjectInfo = "https://api.crowdin.com/api/project/{project-identifier}/info?key={project-key}&json=true";

var crowdinData = "";
var storedData = "";
module.exports = {

    checkTranslations: function() {

        return request(changeKeys(urlProjectInfo))
            .then(readStoredData)
            .then(saveNewData)
            .then(compareData)
            
    }

}

function readStoredData(data) {
    crowdinData = JSON.parse(data);
    return fsp.readFile('./storedData/crowdinData.json', 'utf8');
}

function saveNewData(sData) {
    storedData = sData;
    try {
        storedData = JSON.parse(storedData) || { files: []};
    } catch (err) {
        storedData = { files: [] };
    }
    return fsp.writeFile('./storedData/crowdinData.json', JSON.stringify(crowdinData));
}


function compareData() {
    return new Promise(function(resolve, reject) {
        if(!equal(storedData, crowdinData)) {
            resolve(findDifferencesInBranches());
        } else {
            resolve([]);
        }
    });

}

function findDifferencesInBranches() {
    var differentBranches = []
    crowdinData.files.forEach(function(file) {
        if(file.node_type == "branch") {
            var branch = storedData.files.filter(function(branch) {
                return branch.name == file.name;
            });
            if(!branch.length || (! equal(branch, file))) {
                differentBranches.push(file.name);
            }
        }
    })
    return differentBranches;
}

function changeKeys(url, branch) {
    return url.split('{project-identifier}').join(PROJECT_ID)
        .split('{project-key}').join(API_KEY)
        .split('{branch_name}').join(branch);
}

function sendIfDifferences(differences) {
    if(differences.length) {

    }
}

