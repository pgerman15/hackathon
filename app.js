var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
var azure = require('azure-storage');
const MsRest = require('ms-rest-azure');
var LocalDate = require('js-joda').LocalDate;

var fileService = null;

function doPost(lat, long, temp, img, url){
    console.log('doing post');
    var postData = {
        'recordedTimestamp': new Date().toString(),
        'latitude': lat,
        'longitude': long,
        'odb2Data': "{'temp': temp}",
        'imageLocation': img
    }
    postData = JSON.stringify(postData);
    console.log('post data set');
    var post_options = {
        host: url,
        port: '80',
        path: '/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    console.log('post options set');
    var request = http.request(post_options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });
    console.log("write data...");
    request.write(postData);
    request.end();
}

function getRandom(min, max){
    return Math.random() * (max - min) + min;
}

function storeImage(name, url){
    fileService.createFileFromLocalFile('iot-image-share', 'hackathon', name, url, function (error) {
        if(error){
            //do error callback
        }else{
            console.log('success');
        }
    });
}

MsRest.interactiveLogin((err, credentials) => {
    if (err){ 
        console.log("there was an error");
        throw err;
    }else{
        console.log('auth success');
        fileService = azure.createFileService('DefaultEndpointsProtocol=https;AccountName=appdiag266;AccountKey=nGvA8hUJAywIMhGtEoPG6UJqfifF1+tOyVtwcWEv4/jQ8EMmD5wqHuRXrVaWNZg0OX31nqtWT6B+hQ0VCECK7A==;EndpointSuffix=core.windows.net');
        
        var rndLat;
        var rndLong;
        var rndTemp;
        var rndImgName = null;

        for(var i = 0; i < 100; i++){
            rndLat = getRandom(41, 43);
            rndLong = getRandom(92,96);
            rndTemp = getRandom(-10, 80);
            rndImgName = 'weather' + Math.floor(getRandom(0, 10)) + '.png';

            doPost(rndLat, rndLong, rndTemp, rndImgName, '13.82.228.133');
    
            storeImage(rndImgName, 'images/' + rndImgName);
    
            console.log(rndLat + ', ' + rndLong);
            console.log(rndTemp);
            console.log(rndImgName);
        }

        
    }
  
    // ..use the client instance to manage service resources.
  });



// storeImage('asdf');
