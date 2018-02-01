//Written By Souvik Das 25/01/18

const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const download = require('image-downloader')

var resultOp;
var token;
var token_type;

var set_attributes = {};

var responseObject = {};

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

var fs = require("fs");
var request = require("request");

var strm = "https://img2.carmax.com/stock/mm-honda-accord/500";

//Default Api
app.get('/', (req, res) => {
    res.send({
        "Status": "Welcome.. API up & running"
    });
});


app.get('/getPrediction', (req, res) => {

    var imgName = "/dist/car.jpg";
    // '/path/to/dest/photo.jpg'
    const options1 = {
        //url: 'https://www.cstatic-images.com/stock/900x600/1402518103458.jpg',
        url: req.query.imgurl,
        dest: __dirname + imgName,
        rejectUnauthorized: false // Save to /path/to/dest/photo.jpg
    }

    download.image(options1)
        .then(({
            filename, image
        }) => {
            console.log('File saved to', filename)
        }).catch((err) => {
            throw err
        })
});

//Main Api Wrapper
app.get('/getDetails', (req, res) => {
    var imgName = "/dist/car.jpg";
    const options1 = {
        //url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/2014_Honda_Accord_2.4_i-VTEC_sedan_%282016-01-07%29_01.jpg/1200px-2014_Honda_Accord_2.4_i-VTEC_sedan_%282016-01-07%29_01.jpg',
        url: req.query.imgurl,
        dest: __dirname + imgName,
        rejectUnauthorized: false


    }

    download.image(options1)
        .then(({
            filename, image
        }) => {
            console.log('File saved to', filename)

            var options = {
                method: 'POST',
                url: 'https://bapi-vs.blippar.com/v1/imageLookup',
                rejectUnauthorized: false,
                headers: {
                    'postman-token': '7a60f864-ce31-09f4-0d80-74e19a9d0892',
                    'cache-control': 'no-cache',
                    uniqueid: 'Capgemini999',
                    //authorization: 'Bearer 9b-NCyWYQ1eL7WWtNiaPtA',
                    authorization: token_type + ' ' + token,
                    'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                },
                formData: {
                    input_image: {
                        value: fs.createReadStream(__dirname + imgName),
                        options: {
                            filename: 'car.jpg',
                            contentType: null
                        }
                    }
                }
            };

            request(options, function(error, response, body) {
                if (error)
                    console.log(error);
                resultOp = JSON.parse(body);

                if (resultOp.status != undefined && resultOp.error.code == 605) {
                    var options = {
                        method: 'GET',
                        url: 'https://bauth.blippar.com/token',
                        rejectUnauthorized: false,
                        qs: {
                            grant_type: 'client_credentials',
                            client_id: 'd0e925cea1264c10b6e0cc50107c9d3f',
                            client_secret: '4f34a589116a4d42a1d7df2bc40d053c'
                        },
                        headers: {
                            'cache-control': 'no-cache'
                        }
                    };

                    request(options, function(error, response, body) {
                        if (error) throw new Error(error);
                        var jsonObj = JSON.parse(body);
                        console.log(jsonObj.token_type);
                        token_type = jsonObj.token_type;
                        token = jsonObj.access_token;
                        var options = {
                            method: 'POST',
                            url: 'https://bapi-vs.blippar.com/v1/imageLookup',
                            rejectUnauthorized: false,
                            headers: {
                                'postman-token': '7a60f864-ce31-09f4-0d80-74e19a9d0892',
                                'cache-control': 'no-cache',

                                uniqueid: 'Capgemini999',
                                authorization: token_type + ' ' + token,
                                //authorization: 'Bearer 9b-NCyWYQ1eL7WWtNiaPtA',
                                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                            },
                            formData: {
                                input_image: {
                                    value: fs.createReadStream(__dirname + imgName),
                                    options: {
                                        filename: 'car.jpg',
                                        contentType: null
                                    }
                                }
                            }
                        };
                        request(options, function(error, response, body) {
                            resultOp = JSON.parse(body);
                            console.log(resultOp);
                            if (error) throw new Error(error);

                            if (resultOp.status != undefined) {
                                res.send({
                                    "Status": "Failed"
                                });
                            } else {
                                set_attributes.vehyear = resultOp[0].Note.yeargroup;
                                set_attributes.vehmake = resultOp[0].Note.make;
                                set_attributes.vehmodel = resultOp[0].Note.model;
                                responseObject.set_attributes = set_attributes;
                                res.send(responseObject);
                            }
                        });
                    });
                } else {
                    set_attributes.vehyear = resultOp[0].Note.yeargroup;
                    set_attributes.vehmake = resultOp[0].Note.make;
                    set_attributes.vehmodel = resultOp[0].Note.model;
                    responseObject.set_attributes = set_attributes;
                    res.send(responseObject);
                }


          })


        }).catch((err) => {
            throw err
        })




});

function getToken() {
    console.log("Token Initialized");
    var options = {
        method: 'GET',
        url: 'https://bauth.blippar.com/token',
        rejectUnauthorized: false,
        qs: {
            grant_type: 'client_credentials',
            client_id: 'd0e925cea1264c10b6e0cc50107c9d3f',
            client_secret: '4f34a589116a4d42a1d7df2bc40d053c'
        },
        headers: {
            'cache-control': 'no-cache'
        }
    };

    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        var jsonObj = JSON.parse(body);
        console.log(jsonObj.token_type);
        token_type = jsonObj.token_type;
        token = jsonObj.access_token;
        //console.log(token);
    });

}

//Get port from environment and store in Express.
const port = process.env.PORT || '3009';
app.set('port', port);
//Initialize Token Type & Token No
getToken();

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
