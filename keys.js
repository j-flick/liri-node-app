var twitterKeys = {
  consumer_key: 'sUxzzIunssYwz1rNyAJ2zqsFn',
  consumer_secret: 'YL20IBugT7HDYcHbimUQykqCc115Z8oUEwenQIwMTe6zB119zZ',
  access_token_key: '925113284264591361-zJE2ZOPNvEQW2dvDuIeGx8fQmo1yLQA',
  access_token_secret: 'FOreLxXBL4iypVWiXT1fk468BklU6i7CAlEI9gIHSIMFL'
}

var spotifyKeys = {
	id: 'ca144047444c49ae981a31ef93b10ec7',
	secret: '7c1f778d0c4841aebd190378329a9573'
}

var omdbKey = {
	queryURL: 'http://www.omdbapi.com/?apikey=40e9cece&'
}

// Object to access keys in other files using 'require' keyword.
module.exports = {
	twitterKeys: twitterKeys,
	spotifyKeys: spotifyKeys,
	omdbKey: omdbKey
}