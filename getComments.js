const fetchCommentPage = require('youtube-comment-api');
const videoId = '3xGN6_jso0o';
const fs = require('fs');
const videos = JSON.parse(fs.readFileSync("videoIds.txt", "utf8"));

var fetchComments = function(videoId) {
	return fetchCommentPage(videoId)
	 	.then(commentPage => {
			//console.log(commentPage.comments)
			return fetchCommentPage(videoId, commentPage.nextPageToken);
	  })
	  .then(commentPage => {
	    return commentPage.comments;
	  })
	  .catch(err => {
	  	console.log(err);
	  })
} 

var fetchCommentsForVideos = function(videoList) {
	for(var i=0; i<videoList.length;i++) {
		if(videoList[i] !== 'undefined'){
			console.log(fetchCommentPage(videoList[i]));
		}
	}
}

fetchComments(videos);