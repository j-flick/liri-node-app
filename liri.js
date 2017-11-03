// Variable to store all node arguments in an array.
var nodeArgs = process.argv;
// Variable containing user input argument for which function they would like to run.
var command = process.argv[2];
// Variable for an optional user input argument.
var customCommand = process.argv[3];

// Access exports from required files.
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

// Add color to the bash console!
var color = require('bash-color');

// Switch statement to determine which function is run.
switch(command) {
	case "my-tweets": callTwitter();
		break;
	case "spotify-this-song":
		// If an argument is entered by the user, search for the song they specified.
		if (customCommand) {
			// Create a new CallSpotify object, which takes the user defined input.
			var userQuery = new CallSpotify(customCommand);
			// Run the method that calls the Spotify API.
			userQuery.isAlive();
		}
		// Otherwise, default to "The Sign" by Ace of Base.
		else {
			// Create a new CallSpotify object, which takes a default value.
			var defaultQuery = new CallSpotify("Ace of Base The Sign");
			// Run the method that calls the Spotify API.
			defaultQuery.isAlive();
		}
		break;
	case "movie-this":
		// If an argument is entered by the user, search for the movie they specified.
		if (customCommand) {
			// Create a new CallOMDB object, which takes the user defined input.
			var userQuery = new CallOMDB(customCommand);
			// Run the method that calls the OMDB API.
			userQuery.isAlive();
		}
		// Otherwise, default to the movie "Mr. Nobody."
		else {
			// Create a new CallOMDB object, which takes a default value.
			var defaultQuery = new CallOMDB("Mr.+Nobody");
			// Run the method that calls the OMDB API.
			defaultQuery.isAlive();
		}
		break;
	case "do-what-it-says":
		doWhatItSays();
		break;
}

// Function to run when 'my-tweets' is the specified argument.
function callTwitter() {

	// Twitter keys stored in a variable.
	var twitterClient = new Twitter(keys.twitterKeys);

	var params = {screen_name: 'bcsalias17'};
	twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
	    // If there are at least 20 tweets, loop thru and display the last 20 tweets and their timestamp.
	    if(tweets.length >= 20) {
			for(var i = 0; i < 20; i++) {
				console.log(tweets[i].text);
			}
	    }
	    // Otherwise, if there are not 20 or more tweets, just display as many as there are.
	    else {
	    	for(var i = 0; i < tweets.length; i++) {
	    		// Alternate purple and yellow dividers.
	    		if(i % 2 === 0) {
	    			console.log(color.purple("********************************************"));
	    		}
	    		else {
	    			console.log(color.yellow("********************************************", true));
	    		}
	    		console.log(color.cyan(`${tweets[i].user.name} tweeted: `, true) + `${tweets[i].text}\n`);
	    		console.log(color.cyan(`Created on `, true) + `${tweets[i].created_at}\n`);
	    		// Add final divider for display purposes below last tweet and get correct alternate color.
	    		if (i === tweets.length - 1 && (i + 1) % 2 === 0) {
	    			console.log(color.purple("********************************************"));
	    		}
	    		else if (i === tweets.length - 1 && (i + 1) % 2 !== 0) {
	    			console.log(color.yellow("********************************************", true));
	    		}
	    	}
	    }
	  }
	});
}

// Spotify constructor to allow for a default query and user defined query.
function CallSpotify(query) {
	// Create property for the query passed into the function.
	this.newQuery = query;

	// Create method to call the Spotify API.
	this.isAlive = function() {
		 
		// Spotify keys stored in a variable.
		var spotify = new Spotify(keys.spotifyKeys);
		 
		spotify.search({ type: 'track', query: this.newQuery }, function(err, data) {
			if (err) {
			  return console.log('Error occurred: ' + err);
			}
		 	// Display Artist, Song Title, Preview Link, and Album.
		 	console.log(color.purple("********************************************"));
			console.log(color.cyan("Artist: ", true) + data.tracks.items[0].artists[0].name + "\n");
			console.log(color.yellow("********************************************", true));
			console.log(color.cyan("Song Title: ", true) + data.tracks.items[0].name + "\n");
			console.log(color.purple("********************************************", true));
			if (data.tracks.items[0].preview_url !== null) {
				console.log(color.cyan("Preview Link: ", true) + data.tracks.items[0].preview_url + "\n");
			}
			else {
				console.log(color.cyan("Preview Link: ", true) + "Preview link for this song not available." + "\n");
			}

			console.log(color.yellow("********************************************", true));
			console.log(color.cyan("Album: ", true) + data.tracks.items[0].album.name + "\n");
			console.log(color.purple("********************************************"));
		});
	}
}

// OMDB constructor to allow for a default query and user defined query.
function CallOMDB(query) {
	// Create a property for the query passed into the function.
	this.query = query;

	// Construct a custom, user defined, URL.
	var customURL = keys.omdbKey.queryURL + "t=" + this.query;

	// Create a method that calls the OMDB API.
	this.isAlive = function() {

		// Request and display movie information.
		request(customURL, function (error, response, body) {
			if (!error && response.statusCode === 200) {
		  		console.log(color.cyan("Title: ", true), JSON.parse(body).Title);
		  		console.log(color.cyan("Released: ", true), JSON.parse(body).Released);
		  		console.log(color.cyan("IMDb Rating: ", true), color.yellow(JSON.parse(body).imdbRating, true));
		  		if (JSON.parse(body).Ratings[1]) {
		  			console.log(color.cyan("Rotten Tomatoes Rating: ", true), color.yellow(JSON.parse(body).Ratings[1].Value, true));
		  		}
		  		else {
		  			console.log(color.cyan("Rotten Tomatoes Rating: ", true), color.yellow("Rotten Tomatoes rating unavailable", true));
		  		}
		  		console.log(color.cyan("Country: ", true), JSON.parse(body).Country);
		  		console.log(color.cyan("Language: ", true), JSON.parse(body).Language);
		  		console.log(color.cyan("Plot: ", true), JSON.parse(body).Plot);
		  		console.log(color.cyan("Actors: ", true), JSON.parse(body).Actors);
			}
		});

	}
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }
	  // Split the .txt file into an array with the comma as a delimiter.
	  var dataArray = data.split(",");

	  // Switch statement dependent on which command is declared in the .txt file.
	  switch(dataArray[0]) {
	  	case "my-tweets":
	  		callTwitter();
	  		break;
	  	case "spotify-this-song":
	  		var query = new CallSpotify(dataArray[1]);
	  		query.isAlive();
	  		break;
	  	case "movie-this":
	  		var query = new CallOMDB(dataArray[1]);
	  		query.isAlive();
	  		break;
	  }

	});
}

// Self-invoking function runs when node liri.js is executed.
(function startProgram() {
	// If there are no additional arguments beyond node liri.js, display some available commands to the user.
	if (!command) {
		console.log(color.cyan("Available commands for LIRI:", true));
		console.log(color.yellow("  1: ", true) + "my-tweets");
		console.log(color.yellow("  2: ", true) + "spotify-this-song");
		console.log(color.purple("     - Optional: ") + "add 'artist', 'album', or 'track' in quotes");
		console.log(color.yellow("  3: ", true) + "movie-this");
		console.log(color.purple("     - Optional: ") + "add 'movie name' in quotes");
		console.log(color.yellow("  4: ", true) + "do-what-it-says");
	}
})();