


let posOne = new THREE.Vector3( 100, 0, 200 );
let currColor = 0;
let camera, scene, renderer;
let mesh;
let targetMesh;
let phase = 4;
let delta = 5;
let deltaoneNumber = 0;
let timecounter = 0;
let pos = { x : 0, y: 0, z:0 };
let newPos = {x: 0, y: 0, z:0 }
let targetPos = { x : 0, y: 0, z: 0 };
let phasesin = 0;
let blinkOpacity = 0;
let gameTime = 60;
let gameOn = false;
let startingValue = 120;
let similarSentences = [];


let lstm;
let textInput;
let tempSlider;
let lengthSlider;
let netTemperature;

let userStory = [];
let storyBuild = [];
let currIllustration = 'lion';

let fablesJson;

let sentanceContainer = [];




let drawingClasses = ["alarm_clock",	"ambulance",	"angel", "ant", "antyoga",
"backpack",	"barn",	"basket",	"bear",	"bee",
"beeflower",	"bicycle",	"bird",	"book",	"brain",
"bridge",	"bulldozer",	"bus",	"butterfly",	"cactus",
"calendar",	"castle",	"cat",	"catbus",	"catpig",
"chair",	"couch", "crab",	"crabchair",	"crabrabbitfacepig",
"cruise_ship",	"diving_board",	"dog",	"dogbunny",	"dolphin",
"duck",	"elephant",	"elephantpig", "eye",	"face",
"fan",	"fire_hydrant",	"firetruck",	"flamingo",	"flower",
"floweryoga",	"frog",	"frogsofa",	"garden",	"hand",
"hedgeberry",	"hedgehog",	"helicopter",	"kangaroo",	"key",
"lantern",	"lighthouse",	"lion",	"lionsheep",	"lobster",
"map",	"mermaid",	"monapassport",	"monkey",	"mosquito",
"octopus",	"owl",	"paintbrush",	"palm_tree",	"parrot",
"passport",	"peas",	"penguin",	"pig",	"pigsheep",
"pineapple",	"pool",	"postcard",	"power_outlet",	"rabbit",
"rabbitturtle",	"radio",	"radioface",	"rain",	"rhinoceros",
"rifle",	"roller_coaster",	"sandwich",	"scorpion",	"sea_turtle",
"sheep",	"skull",	"snail",	"snowflake",	"speedboat",
"spider",	"squirrel",	"steak",	"stove",	"strawberry",
"swan",	"swing_set",	"the_mona_lisa",	"tiger",	"toothbrush",
"toothpaste",	"tractor",	"trombone",	"truck	whale",
"windmill",	"yoga",	"yogabicycle",	"everything"];


function convertRange( value, r1, r2 ) {
  return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

const SpeechRecognition = webkitSpeechRecognition;
const getSpeech = () => {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();
  // recognition.continuous = false;
  recognition.interimResults = true;
  // console.log('started rec');

  recognition.onresult = event => {
    const speechResult = event.results[0][0].transcript;
    // console.log('result: ' + speechResult);
    // console.log('confidence: ' + event.results[0][0].confidence);

    generateNewInput(speechResult);

  };

  recognition.onend = () => {
    // console.log('it is over');
    // for "endless" mode, comment out the next line and uncomment getSpeech()
    // recognition.stop();
    getSpeech();
  };

  recognition.onerror = event => {
    // console.log('something went wrong: ' + event.error);
  };
};

function splitInput(inputText){
  var newtextArr = inputText.toLowerCase().split(" ");

  for (var i = 0; i < newtextArr.length; i++) {
    storyBuild.push(newtextArr[i]);
  }
  // console.log(newtextArr);
  // console.log('textarray input', newtextArr);
}


function generateNewInput(text){

  walk(text); // word2vec

  let thistextToString = text.toLowerCase().split(" ");
  splitInput(text);
  let storyBuildText = storyBuild.toString();
  // console.log(storyBuildText);
  let replace = storyBuildText.replace(/,/g, " "); // replace ','
  // console.log(replace);
  generate(replace);

  addSentence(text, "voice / input");

}


init();

function modelReady() {
  // document.getElementById('status').innerHTML = 'Model Loaded';
  console.log("model loaded");
}

function init() {

  // sliderChange1(.5);
  // sliderChange2(startingValue);
  // Create the LSTM Generator passing it the model directory
  // lstm = ml5.LSTMGenerator('/models/childrens/', modelReady);
  lstm = ml5.charRNN('/models/asop/', modelReady);
  word2vec = ml5.word2vec('/models/wordvecs10000.json', modelReady);

  getSpeech();
  // window.addEventListener( 'resize', onWindowResize, false );


  loadJsonfile();


}



function loadJsonfile(){

  console.log("loadjson");

  fetch('/aesopFables.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    // console.log(myJson);
    fablesJson = myJson;
    // runjsonCheck(fablesJson, "wolf")
  });


}


socket.on('sentencesResults', function(result){
  similarSentences = result;
  console.log(similarSentences[1]);

});


function runjsonCheck(json, checkword){

  // add a regex search for a specific given word
  let regex = new RegExp(checkword);

  //reset a sentance container that will hold all sentances related to the search
  sentanceContainer = [];

  //rin through all the sentences in the json file.
  for (var key in json.stories) {

    for (var i = 0; i < json.stories[key].story.length; i++) {

      //convert line to lower case
      let lineInStory = json.stories[key].story[i];
      lineInStory = lineInStory.toLowerCase();

      //does line contain search?
      if (lineInStory.match(regex)){
        //push all the right sentences to an array.
        sentanceContainer.push(json.stories[key].story[i]);
      }
    }
  }

  console.log(sentanceContainer.length)
  // pick a randon sentance from that array.
  let randomSentance = Math.floor(Math.random() * Math.floor(sentanceContainer.length));
  socket.emit('sendSeedSentance', {'animal': checkword, 'randomSentance': sentanceContainer[randomSentance]});

  // add the sentance to the page
  addSentence(sentanceContainer[randomSentance], 'notnet');

}



function generate(texttoGenerateFrom) {

  let original = texttoGenerateFrom;
  let txt = original.toLowerCase();
  // Check if there's something
  if (txt.length > 0) {
    // Here is the data for the LSTM generator
    let data = {
      seed: txt,
      temperature: netTemperature,
      length: generated_length
    };
    // Generate text with the lstm
    lstm.generate(data, gotData);
    // Update the DOM elements with typed and generated text
    function gotData(err, result) {

      let lstmRes = result.sample;
      addSentence(lstmRes , "net");
      splitResult(lstmRes);
      checkIllustration(lstmRes);

    }
  }
}

function splitResult(inputText){
  var newtextArr = inputText.toLowerCase().split(" ");
  // console.log("newtextArr", newtextArr);
  // console.log("storyBuild", storyBuild);

  for (var i = 0; i < newtextArr.length; i++) {
    storyBuild.push(newtextArr[i]);
  }
  console.log(storyBuild);
}


function checkIllustration(string){

  console.log("checking result");
  let textToCheck = string.toLowerCase().split(" ");

  for (var i = 0; i < textToCheck.length; i++) {
    for (var y = 0; y < drawingClasses.length; y++) {
      if (textToCheck.indexOf(drawingClasses[y]) > -1) {
        //In the array!
        console.log("found an illustration! ",drawingClasses[y]);
        currIllustration = drawingClasses[y];
        setup(currIllustration);
      } else {
        //Not in the array
        console.log("didnt find an illustration");
      }
    }
  }
}


function addSentence(result, source){
  console.log(result," " ,source);
  if (source == "net"){
    // console.log("Net");
    let para = document.createElement("p");
    para.classList.add("net");
    let node = document.createTextNode(result);
    para.appendChild(node);
    let element = document.getElementById("story");
    element.appendChild(para);
    element.classList.add("net");

  } else {
    // console.log("Voice")
    let para = document.createElement("p");
    para.classList.add("voice");
    let node = document.createTextNode(result);
    para.appendChild(node);
    let element = document.getElementById("story");
    element.appendChild(para);
  }
}




////////word2vec////////


function walk(word) {
  word2vec.nearest(word, 10).then(result => {
    // console.log('word2Vec', result);
    // let next = random(result);
    // current = next.word;
    // select('#walk').html(current);
  });
}



function generateChain(){
  // console.log('click');
  // let textboxinput = document.getElementById("textbox1").value;
  // generateNewInput(textboxinput);
  // setTimeout(() => document.getElementById('textbox1').value = "", 2000);
}



// function sliderChange1(val) {
//   document.getElementById('output1').innerHTML = val;
//   netTemperature = parseFloat(val);
//   // console.log("netTemperature", netTemperature);
// }

// document.getElementById('slider1').value = .5;
//
// function sliderChange2(val) {
//   document.getElementById('output2').innerHTML = val;
//   generated_length = parseInt(val);
//   // console.log("generated_length", generated_length);
// }

// document.getElementById('slider2').value = startingValue;




///////sketchrnn


// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
SketchRNN
=== */

let sketchmodel;
let previous_pen = 'down';
let x, y;
let sketch;

function setup() {
  // createCanvas(500, 600);

  let myCanvas = createCanvas(500, 500);
  myCanvas.parent("Illustration01");
  // background(255);
  sketchmodel = ml5.SketchRNN('lion', sketchmodelReady);
  let button = select('#draw'); // get button
  button.mousePressed(startDrawing);
}

function startDrawing() {
  x = width / 2;
  y = height / 2;
  background(255);
  sketchmodel.reset();
  sketchmodel.generate(gotSketch);
}

function draw() {
  console.log("here");
  if (sketch) {
    if (previous_pen == 'down') {
      stroke(10,50,255);
      strokeWeight(5.0);
      line(x, y, x + sketch.dx, y + sketch.dy);
    }
    x += sketch.dx;
    y += sketch.dy;
    previous_pen = sketch.pen;

    if (sketch.pen !== 'end') {
      sketch = null;
      sketchmodel.generate(gotSketch);
    }
  }
}

function gotSketch(err, s) {
  sketch = s;
}

function sketchmodelReady() {
  // select('#status').html('Model Loaded');
  // startDrawing();
}




function buttonPressed(clicked_id){
  let animalOne = document.getElementById(clicked_id).innerHTML;

  //convert to lowercase
  let animalOneLower = animalOne.toLowerCase();
  currIllustration = animalOneLower;

  //run the check function
  runjsonCheck(fablesJson, animalOneLower);


}
