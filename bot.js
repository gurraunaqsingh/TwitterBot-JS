console.log('The Bot is starting');

var Twit = require('twit');
var firebase = require('firebase');
var fs = require('fs');
var http = require("http");
var https = require("https");

var config = require('./config');
// console.log(config);

//Firebase Config

var firebase_config = {
    apiKey: "AIzaSyA8M7RXx3RnkLaJQhy4sZE0RSJNKmYwCS4",
    authDomain: "ggwp-bot.firebaseapp.com",
    databaseURL: "https://ggwp-bot.firebaseio.com",
    projectId: "ggwp-bot",
    storageBucket: "ggwp-bot.appspot.com",
    messagingSenderId: "370545509231"
  };

firebase.initializeApp(firebase_config);

//Firebase Config

var T = new Twit(config);



//_________FIREBASE STUFF________________


var jokes = null;
var tweetNum = 1;

var rootRef = firebase.database().ref('/getData/jokes');
rootRef.once("value").then(function(snapshot) {
    jokes = snapshot.val();
    // num1 = _data[0];
    // console.log(typeof(_data));
    // console.log((_data[12]));
    // console.log("size : " + (_data.length));
  });


console.log("Data Received, starting coroutine...\n")

var minutes = 5;

// setInterval(newTweet_image, 1000*60*minutes);

function getQuoteData(err){
	
	https.get("https://wisdomapi.herokuapp.com/v1/random", function(res) {
	  	var body = ''; 
		res.on('data', function(data){
			body += data;
		});	

	  	// After the response is completed, parse it and log it to the console
	  	res.on('end', function() {
		    var parsed = JSON.parse(body);

		    var text_data = parsed['content'];
		    var img_url = parsed['picture_url']

		    console.log("Content : " + text_data);
		    console.log("img_url : " + img_url);

		  	justlog();
		  	tweet_image(text_data, img_url)
		});
	})
		// If any error has occured, log error to console
		.on('error', function(e) {
		 	console.log("Got error: " + e.message);
		});
}


function newTweet_image(){
	var data = getQuoteData();
}

function justlog(){
	console.log("Finally reached here...")
}

newTweet_image();



function tweet_image(text_data, img_url){

	//Need to first download this image locally, and pass it's path below
	var b64content = fs.readFileSync(img_url, { encoding: 'base64' })

	T.post('media/upload', { media_data: b64content }, function (err, data, response) {
	  var mediaIdStr = data.media_id_string
	  var altText = text_data
	  var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

	  T.post('media/metadata/create', meta_params, function (err, data, response) {
	    if (!err) {
	      // now we can reference the media and post a tweet (media will attach to the tweet)
	      var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }

	      T.post('statuses/update', params, function (err, data, response) {
	        console.log(data)
	      })
	    }
	  })
	})
}



