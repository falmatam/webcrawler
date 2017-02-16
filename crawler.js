//GOAL
//	1. Get a web page
//	2. Search for specific word(s) on page
//	3. If word not found, compile all links on site to perform some analysis
//

var request = require('request'); 		//make HTTP requests
var cheerio = require('cheerio'); 		//Parse and Select HTML elemets
var URL = require('url-parse');			//Parse URL's


var CRAWL_URL = "http://www.falmata.com"; //modify to any public root domain




console.log("\nVisiting page --> " + CRAWL_URL);
request(CRAWL_URL, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   // Check status code (200 is HTTP OK)
   console.log("\nStatus code: " + response.statusCode);
   if(response.statusCode === 200) {
     // Parse the document body
     var $ = cheerio.load(body);
     
     //Pull interesting info from DOM elements
     console.log("\nPage title:  " + $('title').text());
     console.log("Page body id:  " + $('body').attr('id'));
     console.log("Page body class:  " + $('body').attr('class'));
     
     //Collect and Display links on site (relative and absolute)
     collectInternalLinks($);
     var word = "engineer";
     console.log("\n\nSearching for occurrence of the word '"+word+
     	"' in DOM...")
     if(exploreForWord($,word)){
     	console.log("Word '"+word+"' found! :D");
     }
     else{
     	console.log("Word '"+word+"' not found.. :(");
     }
     
   }
});




function collectInternalLinks($){
	var relativeLinksCollection = []; 	//i.e., /filename, /anotherfile, etc
	var absoluteLinksCollection = [];		//i.e., https://website.com


	var relativeLinks = $("a[href^='/']");
	relativeLinks.each(function(){
		relativeLinksCollection.push($(this).attr('href'));

	});

	var absoluteLinks = $("a[href^='http']");
	absoluteLinks.each(function(){
		absoluteLinksCollection.push($(this).attr('href'));
	});

	console.log("\nFound " + relativeLinksCollection.length + " relative links.");
	for(var i=0; i<relativeLinksCollection.length; i++){
		console.log(relativeLinksCollection[i]);
	}
	console.log("\nFound " + absoluteLinksCollection.length + " absolute links.");
	for(var i=0; i<absoluteLinksCollection.length; i++){
		console.log(absoluteLinksCollection[i]);
	}
}


function exploreForWord($, word){
	var bodyElements = $('html > body').text();
	if(bodyElements.toLowerCase().indexOf(word.toLowerCase()) != -1){
		return true;
	}

	return false;
}