var APIkeys = require("./keys.js");

var require = require("fs");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");

var liriCommand = process.argv[2];


switch(liriCommand) {
	case "my-tweets":
		myTweets();
		break;
	case "spotify-this-song":
		spotifyThisSong();
		break;
	case "movie-this":
		movieThis();
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
};

//Twitter request
function myTweets() {
	var client = new twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret: keys.twitterKeys.consumer_secret,
			access_token_key: keys.twitterKeys.access_token_key,
			access_token_secret: keys.twitterKeys.access_token_secret, 
		});

	//var twitterUsername = process.argv[3];

	var params = {screen_name: 'z_janicezchang', count: 20 };

	  client.get('statuses/user_timeline', params, function(error, tweets, response) {

	    if (!error) {
	      var TwitterResults = []; 
	      for (var i = 0; i < tweets.length; i++) {
	        data.push({
	        	'Tweets: ' : tweets[i].text,
	            'created at: ' : tweets[i].created_at
	        });
	      }
	      console.log(TwitterResults);
	      writeToLog(TwititerResults);
	    }
	    else {
	    	console.log("Error: " + error);
	    	return;
	    }

	  });
	};

//Spotify request
function spotifyThisSong(songName) {
	var songName = process.argv[3];
	if (!songName) {
		songName = "The Sign";
	};

	params = songName;

	spotify.search({ type: "track", query: params }, function(err, data) {
			if(!err){
				var songData = data.tracks.items;
				for (var i = 0; i < 5; i++) {
					if (songData[i] != undefined) {
						var SpotifyResults =
						"Artist(s): " + songData[i].artists[0].name + "\r\n" +
						"Song: " + songData[i].name + "\r\n" +
						"Preview URL: " + songData[i].preview_url + "\r\n" + 
						"Album the song is from: " + songData[i].album.name + "\r\n" +
						
						console.log(SpotifyResults);
						log(SpotifyResults);
					}
				}
			}	
			else {
				console.log("Error occured: "+ err);
				return;
			}
		});
	};

}

//OMDB request
function movieThis() {
	var movie = process.argv[3];
	if (!movie) {
		movie = "mr nobody";
	}

	request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var movieObject = JSON.parse(body);
			//console.log(movieObject);
			var movieSearch = 
				"Title: " + movieObject.Title + "\r\n" +
				"Year: " + movieObject.Year + "\r\n" +
				"IMDB Rating: " + movieObject.imdbRating + "\r\n" +
				"Rotten Tomatoes Rating: " + movieObject.tomatoRating + "\r\n" +
				"Country: " + movieObject.Country + "\r\n" +
				"Language: " + movieObject.Language + "\r\n" +
				"Plot: " + movieObject.Plot + "\r\n" +
				"Actors: " + movieObject.Actors + "\r\n";

				console.log(movieSearch);
				log(movieSearch);
			}

			else {
				console.log("Error: " + error);
				return;
			}
	});
};

//do-what-it-says function (using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands)
function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function (error, data) {
		if (!error) {
			doWhatItSaysResults = data.split(",");
			spotifyThisSong(doWhatItSaysResults[0], doWhatItSaysResults[1]);
		}
		else {
			console.log("Error: " + error);
		}
	});
};
