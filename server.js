const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
//const api = require('./server/routes/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

var fs = require("fs");
var request = require("request");

// Set our api routes
//app.use('/api', api);

// Catch all other routes and return the index file
app.get('*', (req, res) => {

  console.log("Hello There From Api");

var token;
var token_type;

var options = { method: 'GET',
  url: 'https://bauth.blippar.com/token',
  rejectUnauthorized: false,
  qs:
   { grant_type: 'client_credentials',
     client_id: 'd0e925cea1264c10b6e0cc50107c9d3f',
     client_secret: '4f34a589116a4d42a1d7df2bc40d053c' },
  headers:
   { 'postman-token': '4d9be3cc-1290-81b8-7f89-fdecdb5050b0',
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var jsonObj = JSON.parse(body);
  console.log(jsonObj.token_type);
  token_type=jsonObj.token_type;
  token=jsonObj.access_token;
  console.log(token);


});




// var options = { method: 'POST',
//   url: 'https://bapi-vs.blippar.com/v1/imageLookup',
//   rejectUnauthorized: false,
//   headers:
//    { 'postman-token': '7a60f864-ce31-09f4-0d80-74e19a9d0892',
//      'cache-control': 'no-cache',
//
//      uniqueid: 'Capgemini999',
//      //authorization:this.token_type+' '+this.token,
//      // authorization: 'Bearer MDWDpjK8QQOJYa4ONllewQ',
//      'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
//   formData:
//    { input_image:
//       { value: 'fs.createReadStream("16 vol s60.jpg")',
//         options: { filename: '16 vol s60.jpg', contentType: null } } } };
//
// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//
//   console.log(body);
// });







});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3007';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
