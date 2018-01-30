const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const download = require('image-downloader')



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
//app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
//app.use('/api', api);

// Catch all other routes and return the index file
//var strm=__dirname + '/dist/Honda.jpg';
var strm="https://img2.carmax.com/stock/mm-honda-accord/500";
app.get ('/image', (req, res) => {
    let readStream = fs.createReadStream(__dirname + '/dist/p.jpg')

    // When the stream is done being read, end the response
    readStream.on('close', () => {
        res.end()
    })

    // Stream chunks to response
    readStream.pipe(res)
});

app.get ('/picimage', (req, res) => {
  var token;
  var token_type;
  var imgName="/dist/car.jpg";
  // '/path/to/dest/photo.jpg'
  const options1 = {
    url: 'https://www.cstatic-images.com/stock/900x600/1402518103458.jpg',
    dest:  __dirname + imgName,
    rejectUnauthorized: false       // Save to /path/to/dest/photo.jpg
  }

  download.image(options1)
    .then(({ filename, image }) => {
      console.log('File saved to', filename)
    }).catch((err) => {
      throw err
    })
});

app.get('/s', (req,res)=>
{
  var imgName="/dist/car.jpg";
  var options = { method: 'POST',
    url: 'https://bapi-vs.blippar.com/v1/imageLookup',
    rejectUnauthorized: false,
    headers:
     { 'postman-token': '7a60f864-ce31-09f4-0d80-74e19a9d0892',
       'cache-control': 'no-cache',

       uniqueid: 'Capgemini999',
       //authorization:token_type+' '+token,
       authorization: 'Bearer _FMCfsEdSI-oq3o65GDepQ',
       'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
    formData:
     { input_image:
        { //value: fs.createReadStream(__dirname + imgName),
          value: fs.createReadStream(__dirname + imgName),
          options: { filename: 'car.jpg', contentType: null } } } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    //rpns=response;
    console.log("Hi There!");
    console.log(body);


    var jsonObj = JSON.parse(body);
    console.log("Hi There2!");
    console.log(jsonObj.Id);
})
});


app.get('/p', (req, res) => {

  console.log("Hello There From Api");

var rpns;

var token;
var token_type;
var imgName="/dist/car.jpg";
// '/path/to/dest/photo.jpg'
const options1 = {
  url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/2014_Honda_Accord_2.4_i-VTEC_sedan_%282016-01-07%29_01.jpg/1200px-2014_Honda_Accord_2.4_i-VTEC_sedan_%282016-01-07%29_01.jpg',
  dest:  __dirname + imgName,
  rejectUnauthorized: false       // Save to /path/to/dest/photo.jpg
}

download.image(options1)
  .then(({ filename, image }) => {
    console.log('File saved to', filename)
  }).catch((err) => {
    throw err
  })



var options = { method: 'GET',
  url: 'https://bauth.blippar.com/token',
  rejectUnauthorized: false,
  qs:
   { grant_type: 'client_credentials',
     client_id: 'd0e925cea1264c10b6e0cc50107c9d3f',
     client_secret: '4f34a589116a4d42a1d7df2bc40d053c' },
  headers:
   {
     'cache-control': 'no-cache' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  var jsonObj = JSON.parse(body);
  console.log(jsonObj.token_type);
  token_type=jsonObj.token_type;
  token=jsonObj.access_token;
  //console.log(token);

  var options = { method: 'POST',
    url: 'https://bapi-vs.blippar.com/v1/imageLookup',
    rejectUnauthorized: false,
    headers:
     { 'postman-token': '7a60f864-ce31-09f4-0d80-74e19a9d0892',
       'cache-control': 'no-cache',

       uniqueid: 'Capgemini999',
       authorization:token_type+' '+token,
       //authorization: 'Bearer 9b-NCyWYQ1eL7WWtNiaPtA',
       'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' },
    formData:
     { input_image:
        { //value: fs.createReadStream(__dirname + imgName),
          value: fs.createReadStream(__dirname + imgName),
          options: { filename: 'car.jpg', contentType: null } } } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    //rpns=response;
    console.log("Hi There!");
    console.log(body);


    var jsonObj = JSON.parse(body);
    console.log("Hi There2!");
    console.log(jsonObj.Id);
    //token_type=jsonObj.token_type;



    // fs.writeFile( "/", response, function(err) {
    // if(err) {
    //     return console.log(err);
    // }

// });

  });




});


res.send({'Done':'Done'});









});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3008';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
