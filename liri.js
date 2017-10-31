// Variable for command line arguments.
var commands = process.argv;

// Access exports from keys.js file.
var keys = require("./keys.js");

var Twitter = require('twitter');

// Twitter keys stored in a variable.
var twitterClient = new Twitter(keys.twitterKeys);

var params = {screen_name: 'bcsalias17'};
twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    // console.log(tweets[0].text);
    // If there are at least 20 tweets, loop thru and display the last 20 tweets.
    if(tweets.length >= 20) {
		for(var i = 0; i < 20; i++) {
			console.log(tweets[i].text);
		}
    }
    // Otherwise, if there are not 20 or more tweets, just display as many as there are.
    else {
    	for(var i = 0; i < tweets.length; i++) {
    		console.log(`${tweets[i].text}\n`);
    	}
    }
  }
})