const fetchCommentPage = require('youtube-comment-api');
const videoId = 'h_tkIpwbsxY';
const fs = require('fs');
const videoComments = fs.readFileSync("correct-csv.csv", "utf8");
const parse = require('csv-parse/lib/sync');
parse(videoComments);
// fetchCommentPage(videoId)
//   .then(commentPage => {
//     console.log(commentPage.comments)
//     return fetchCommentPage(videoId, commentPage.nextPageToken)
//   })
//   .then(commentPage => {
//     console.log(commentPage.comments)
//   })