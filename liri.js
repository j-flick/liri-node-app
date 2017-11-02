// Variable containing user input argument for which function they would like to run.
var command = process.argv[2];
var spotifyCommand = process.argv[3];

// Access exports from keys.js file.
var keys = require("./keys.js");

// Add color to the bash console!
var color = require('bash-color');

// Switch statement to determine which function is run.
switch(command) {
	case "my-tweets": callTwitter();
		break;
	case "spotify-this-song":
		// If an argument is entered by the user, search for the song they specified.
		if (spotifyCommand) {
			// Create a new CallSpotify object, which takes the user defined input.
			var userQuery = new CallSpotify(spotifyCommand);
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
}

// Function to run when 'my-tweets' is the specified argument.
function callTwitter() {
	var Twitter = require('twitter');

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
		var Spotify = require('node-spotify-api');
		 
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

// Self-invoking function runs when node liri.js is executed.
(function startProgram() {
	// If there are no additional arguments beyond node liri.js, display some available commands to the user.
	if (!command) {
		console.log(color.cyan("Available commands for LIRI:", true));
		console.log(color.yellow("  1: ", true) + "my-tweets");
		console.log(color.yellow("  2: ", true) + "spotify-this-song");
		console.log(color.purple("     - Optional: ") + "add 'artist', 'album', or 'track' in quotes");
	}
})();