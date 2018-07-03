const YouTube = require('youtube-node');
const getSubtitles = require('youtube-captions-scraper').getSubtitles;
const youTube = new YouTube();
const freq = require('freq');
const sw = require('stopword');
const videoIds = [];
const videoSubtitlePromises = [];
const searchTerm = 'Urna Eletrônica';
const numVideos = 50;
const fs = require('fs');
//sets Youtube API key
youTube.setKey('AIzaSyCG2fMogkhkojiu_JjF73oGgNrnCreCd9k');
/**
* Given a search term, the number of videos desired and the Youtube API key, creates a 
* Promise object with the result of calling the '/search' endpoint of the Youtube API. 
* It then retrieves the ID for each video in the list and pushes to a videoIds array.
* @param {string} searchTerm - string that represents the expression to be searched for in Youtube
* @param {number} numVideos - Number of videos that we want to retrieve
* @returns {Array} videoIds - Array of strings, each representing the ID of a video returned by the 
* search API.
*/
let youtubePromise = new Promise(function(resolve, reject) {
	youTube.search(searchTerm, numVideos, function(error, result) {
		if (error) {
			console.log(error);
			reject(error);
		}
		else {
			let videos = result['items'];
			for(var i = 0; i < videos.length ;i++) {
				videoIds.push(videos[i].id.videoId);
			}
			resolve(videoIds);
		}
	});	
});
/**
* Given a list of ids of Youtube videos, returns a Promise object that when resolved contains the
* caption file in text format for each video. In the 'catch' statement, if 'return err' is uncommented, 
* execution stops with a TypeError in case a video doesn't have a caption file associated to it.
* @param {Array} videoIds - Array of strings, each representing the ID of a video returned by the 
* search API.
* @param {string} lang - Language setting for caption files. Default is english.
* @returns {Promise} Array of Promise objects, each containing the caption file for a video in the videoIds array.
*/
youtubePromise.then(function(videoIds) {
	videoIds.forEach(function(_videoId) {
		var videoJson = '{"videoId": '+ '"' +_videoId + '"}\n';
		fs.appendFileSync('videoIds.txt', videoJson);
		let v = getSubtitles({
			videoID: _videoId, // youtube video id
			lang: 'pt' // default: `en`
		})
			.then(function(captions) {
				return captions;
			})
			.catch(function(err) {
				console.log(err);
			});
		videoSubtitlePromises.push(v);
	});

	return Promise.all(videoSubtitlePromises);
})
/**
* Joins all captions in one text file. Useful for analyzing frequency of words in a set of videos instead of 
* separate ones.
* @param {Array} captions - Array of strings, each containing the caption for a Youtube video requested earlier in the execution.
* @returns {string} completeText - String object with all caption texts concatenated in sequence.
*/
	.then(function(captions) {
		let completeText = '';
		captions.forEach(function(caption) {
			if(typeof caption !== 'undefined') { 
				caption.forEach(function(data) {
					completeText += ' ' + data.text;
				});
			}
		});

		return completeText;
	})
/**
* Analyze a body of text and logs the frequency of each word in that body of text to the console
* @param {string} completeText - String object with all caption texts concatenated in sequence.
* @returns {string} completeText - String object with all caption texts concatenated in sequence.
*/
	.then(function(completeText) {
		let newString = sw.removeStopwords(completeText.split(' '), sw.br);
		let frequency = JSON.stringify(freq(newString));
       	fs.writeFileSync('wordFreq.txt', frequency);
		return freq(newString);
	});
