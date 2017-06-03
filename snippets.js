//Write to database
var database = firebase.database();

function writeUserData(userId, name, email) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email
  });
}


function newTweet(){
	if(jokes != null){
		//Get number
		var num = tweetNum;

		//Get tweet string
		var _ts = jokes[num];

		T.post('statuses/update', { status: _ts }, function(err, data, response) {
			if(err){
				console.log("Error :/")
			}else{
				console.log("Tweeted : " + _ts);
			}
		})

		if(tweetNum > 12){
			process.exit(0);
		}else{
			tweetNum += 1;
		}
	}
}