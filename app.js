var express = require('express');
var http = require('http');
var path = require("path");
var io = require('socket.io');
var bodyParser = require('body-parser')
var express = require('express');
var Sentiment = require('sentiment');

//require the word2vec class
var Word2Vec = require('./sentence2vec.js')
console.log(Word2Vec);
var embedings = require('./public/word_embeadings.json')

// console.log(test);
var userID = 0;



// console.log(embedings[0].message);

// console.log("average", Word2Vec.average(embedings[20].message_embedding, embedings[30].message_embedding));
// console.log("distance", Word2Vec.distance(embedings[0].message_embedding, embedings[1].message_embedding));


// distance(v1, v2)

let sentance1 = embedings[0].message;
let embeding1 = embedings[0].message_embedding;





var app = express();
var server  = http.createServer(app);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var width = 16;
var height = 16;
var seqarraystate = [];


var port = process.env.PORT || 3000;


function init(){
}

init();


app.get('/GetGridSize', function(req,res){
  res.setHeader('Content-Type', 'application/json');
  var obj = {
    "array": seqarraystate,
    "width": width,
    "height": height,
    "userNumber": userID
  }
  res.send(obj)
});


server = app.listen(port, function () {
  console.log('Example app listening on port 3000!')
});



/// socket work/////

var sockets = io(server);
// configure socket handlers
sockets.on('connection', function(socket){

  // send current state to this client that connected only
  // console.log(`a user connected`,socket.id);
  //
  //
  //



  socket.on('sendSeedSentance', function(data){
    console.log(data.randomSentance)
    let seedSentance = data.randomSentance;
    findVector(seedSentance);
  });

});

////// end socket work/////


//TODO
function findAverageVector(){

  // Word2Vec.average(embedings[20].message_embedding, embedings[30].message_embedding));
}



function findVector(sentance, n = 10){
  let vec;
  let sentencesResults = [];

  for(let i = 0; i < Object.keys(embedings).length; i++){
    if(embedings[i].message === sentance){
      vec = embedings[i].message_embedding;
    }
  }

  let sentences = [];
  let keys = Object.keys(embedings);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let d = Word2Vec.distance(vec, embedings[key].message_embedding);
    sentences.push({wordKey: key, distance: d});
  }

  //sort results
  sentences.sort((a, b) => {
    return b.distance - a.distance;
  });

  //narrowdown to n results
  let closeset = sentences.slice(0, n);

  //fetch sentences from json
  let closestKeys = Object.keys(closeset);
  for (let i = 0; i < closestKeys.length; i++) {
    // console.log(closestKeys);
    // console.log(embedings[closeset[i].wordKey].message);
    sentencesResults.push(embedings[closeset[i].wordKey].message);
  }
  // console.log(sentencesResults);
  sockets.emit('sentencesResults', sentencesResults);


  let sentimentResults = [];

  for (var i = 0; i < sentencesResults.length; i++) {
    let sentiment = new Sentiment();
    let result = sentiment.analyze(sentencesResults[i]);
    // console.log(result);    // Score: -2, Comparative: -0.666


    sentimentResults.push(result.score);

  }
  console.log(sentimentResults);
  sockets.emit('sentencesSentiment', sentimentResults);



}

//run a similarity check
// findVector(embedings[900].message);
