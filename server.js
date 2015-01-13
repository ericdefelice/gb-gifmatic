// server.js (Express 4.0)
var express = require('express');
var favicon = require('serve-favicon');

var app = express();

var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

// SERVER CONFIGURATION
app.use(express.static(__dirname + '/')); // set the static files location
app.use(favicon(__dirname + '/images/favicon.ico'));

// Service any GET requests to the API
var BASE_URL = 'http://www.giantbomb.com/api/video/';

// GB API request structure
// http://www.giantbomb.com/api/video/:vid_id/?api_key=GB_API_KEY&format=json

// The server api to get videos from GiantBomb
app.get('/api/gb_videos/:vid_id', function (request, response) {
  
  var req_url = BASE_URL + request.params.vid_id + '/?';
  //console.log(req_url);

  // send request to GiantBomb API
  $.ajax({
      url: req_url,
      type: "get",
      data: {api_key : GB_API_KEY, field_list : "id,length_seconds,high_url,low_url,video_type,image", format : "jsonp", json_callback : "json_req_callback" },
      dataType: "jsonp",
      jsonpCallback: "json_req_callback",
      timeout: 2000,
      success : function(data) {
      	var json_string = JSON.stringify(data, null, '\t');
      	console.log("Success\n" + json_string);
        console.log(data.results.video_type);
        if (data.results.video_type === "Subscriber") {
          console.log("PREMIUM_VIDEO")
          response.send("PREMIUM_VIDEO")
      	} else {
          response.send(json_string);
        }
      },
      error: function(data) {
      	var json_string = JSON.stringify(data, null, '\t');
      	console.log("Error\n" + json_string);
        response.send("ERROR");
      } 
  });
});

//function json_req_callback(data) {
//  var json_string = JSON.stringify(data, null, '\t');
//  console.log("CALLBACK\n" + json_string);
//  response.send(data);
//};

// setup app port
app.listen(8001);

console.log('To preview giantbomb gifmatic, go to localhost:8001');