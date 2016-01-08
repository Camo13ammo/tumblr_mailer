var fs = require('fs');
var ejs = require('ejs');


var csvFile = fs.readFileSync("friend_list.csv","utf8").split("\n");
var csvData = csvParse(csvFile);

// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'WghskyW2GVBdFhzpQ1C5PAg6eEAab0OQMIkmQDwQmvoMbfOOge',
  consumer_secret: 'DXe0SnrvKhzFWNPNwmaGThxAQoNNZBagSysGivGkFI0XCk8FTj',
  token: '4OxYpZxsu8SdNXTjRDqSrgnFgII54CnSH2dWOHGULuBVKzml09',
  token_secret: 'qDCM3E5rljB2usBqg87Y6aOHpAuVTRfK3bX98NvDItR23vmaZo'
});

//A Function that parses the CSV file of contacts into an array of objects.
function csvParse(csvFile){
	var contactArray = [];
	var obj = {};
	var keys = csvFile[0].split(",");
	for(var i=1; i<csvFile.length; i++){
		for(var j=0; j<keys.length;j++){
			obj[keys[j]] = csvFile[i].split(",")[j];
		}
		contactArray.push(obj);
		obj = {};
	}
	return contactArray;
}

//Uses the .replace method to ammend an HTML document with variables.
var emailHTMLTemplate = fs.readFileSync("email_template.html","utf8");

function emailer(emailList){
	var oneEmail = emailHTMLTemplate;
	for(var i=0; i<emailList.length; i++){
		oneEmail = oneEmail.replace("FIRST_NAME", emailList[i].firstName)
		oneEmail = oneEmail.replace("NUM_MONTHS_SINCE_CONTACT", emailList[i].numMonthsSinceContact);
		console.log(oneEmail);
		oneEmail = emailHTMLTemplate;
	}
}


var emailEJSTemplate = fs.readFileSync("email_template.ejs","utf8");
var output;

//Returns an array of all posts that are younger than a week old.
function oneWeekOld(blog){
	var postDate;
	var weekAgoNow = new Date().getTime() - (7*24*60*60*100);
	var okPostsArray = [];

	for(var i=0; i<blog.posts.length; i++){
		postDate = new Date(blog.posts[i].timestamp*1000);
		if(postDate >= weekAgoNow){
			okPostsArray.push(blog.posts[i]);
		}
	}
	return okPostsArray;
}

//access the tumblr API and replaces EJS elements
client.posts('vleo42.tumblr.com', function(err, blog){
	var latestPostsArray = oneWeekOld(blog);

  	for(var i=0; i<csvData.length; i++){
		output = ejs.render(emailEJSTemplate, {csvData: csvData[i], latestPosts: latestPostsArray});
		console.log(output);
	}
})

//**Missing the mandrill elements of emailing the posts**








