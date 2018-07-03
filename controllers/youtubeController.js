var YouTube = require('youtube-node');
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
var youTube = new YouTube();
youTube.setKey('AIzaSyCG2fMogkhkojiu_JjF73oGgNrnCreCd9k');
var freq = require('freq');
var sw = require('stopword');
var videoIds = [];
var videoSubtitlePromises = [];
const maxVideos = 15;

var getVideoIds = function(keyWords, numVideos) {
	if(typeof keyWords !== 'string' || numVideos > maxVideos) {
		return 'invalid search'; 
	}
	return new Promise(function(resolve, reject) {
		youTube.search(keyWords, numVideos, function(error, result) {
	  	if (error) {
	    	console.log(error);
	    	reject(error);
	  	}
	  	else {
	  		var videos = result["items"]
	  		for(var i = 0; i < videos.length ;i++) {
	  			videoIds.push(videos[i].id.videoId);
	  		}
	  		resolve(videoIds);
	  	}
		});	
	});
}
var getSubtitlesForVideoIds = function(videoIds) {
	videoIds.forEach(function(_videoId) {
	var v = getSubtitles({
			videoID: _videoId, // youtube video id
			lang: 'pt' // default: `en`
		}).then(function(captions) {
			return captions;
		}).catch(function(err) {
			return err;
		});
		videoSubtitlePromises.push(v);
	});
	return Promise.all(videoSubtitlePromises);
}
var joinSubtitles = function(captions) {
	var completeText = "";
	//console.log("foram capturadas " + captions.length + " legendas\n");
	captions.forEach(function(caption) {
		caption.forEach(function(data) {
			completeText += " " + data.text;
		});
	});
	return completeText;
}
var analyzeTextFreq = function(completeText) {
	var newString = sw.removeStopwords(completeText.split(' '), sw.br);
	return freq(newString);
}
var _getFrequencyForKeyWords = function(keyWords,numVideos) {
	return getVideoIds(keyWords,numVideos)
	.then()
}
exports.getFrequencyForKeyWords = function(req,res) {
	if(!req.body.keyWords || !req.body.numVideos) {
		res.send("keyWords and the number of Videos are expected");
	}
	if(req.body.numVideos > maxVideos) {
		res.send("max. of 15 youTube videos");
	}
	var keyWords = req.body.keyWords;
	var numVideos = req.body.numVideos;
	return _getFrequencyForKeyWords(keyWords,numVideos);
}