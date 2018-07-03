const freq = require('freq');
const sw = require('stopword');
const fs = require('fs');

const readFile = function() {
	var content = fs.readFileSync("comments.txt", "utf-8");
	console.log(content.length);
	let newString = sw.removeStopwords(content.split(' '), sw.br);
	let newStringLower = '';
	for(var i=0; i<newString.length;i++){
		newStringLower += newString[i].toLowerCase() + ',';
	}
	//console.log(newStringLower);
	var comments = fs.writeFileSync("commentsNoStopWords2.txt", newStringLower, 'utf-8');
}

readFile();