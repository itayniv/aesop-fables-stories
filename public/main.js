let posOne = new THREE.Vector3( 100, 0, 200 );
let drawingNumber = 0;
let sentanceNumber = 0;
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
let similaritiesArray = [];
let sketchColor;
let maxSentences = 9;
let startStory = false;

let viewportWidth;
let viewportHeight;

let penStrokes = 0;

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

////// sketchRnnDrawing stuff

let sketchmodel;
let previous_pen = 'down';
let x, y;
let startX = 300;
let startY = 200;

let startBookX;
let startBookY;
let sketch;



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
//
// ///// speech part
//
// const SpeechRecognition = webkitSpeechRecognition;
// const getSpeech = () => {
//   const recognition = new SpeechRecognition();
//   recognition.lang = 'en-US';
//   recognition.start();
//   // recognition.continuous = false;
//   recognition.interimResults = true;
//   // console.log('started rec');
//
//   recognition.onresult = event => {
//     const speechResult = event.results[0][0].transcript;
//     // console.log('result: ' + speechResult);
//     // console.log('confidence: ' + event.results[0][0].confidence);
//
//     generateNewInput(speechResult);
//
//   };
//
//   recognition.onend = () => {
//     // console.log('it is over');
//     // for "endless" mode, comment out the next line and uncomment getSpeech()
//     // recognition.stop();
//     getSpeech();
//   };
//
//   recognition.onerror = event => {
//     // console.log('something went wrong: ' + event.error);
//   };
// };
//
// function splitInput(inputText){
//   var newtextArr = inputText.toLowerCase().split(" ");
//
//   for (var i = 0; i < newtextArr.length; i++) {
//     storyBuild.push(newtextArr[i]);
//   }
//   // console.log(newtextArr);
//   // console.log('textarray input', newtextArr);
// }
//
//
// function generateNewInput(text){
//
//   walk(text); // word2vec
//
//   let thistextToString = text.toLowerCase().split(" ");
//   splitInput(text);
//   let storyBuildText = storyBuild.toString();
//   // console.log(storyBuildText);
//   let replace = storyBuildText.replace(/,/g, " "); // replace ','
//   // console.log(replace);
//   generate(replace);
//
//   addSentence(text, "voice / input");
//
// }
//
//
// ///// speech part

init();

function modelReady() {
  // document.getElementById('status').innerHTML = 'Model Loaded';
  console.log("model loaded");
}

function init() {

  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;

  startBookX = viewportWidth/2;
  startBookY = viewportHeight/2;

  // console.log(viewportWidth,viewportHeight);


  loadJsonfile();
  setTimeout(() => {
    loadBookSketch('book');
  }, 1000);
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
  });
}


socket.on('sentencesResults', function(result){
  similarSentences = result;
});


function runjsonCheck(json, checkword){

  // add a regex search for a specific given word
  let regex = new RegExp(checkword);

  //reset a sentance container that will hold all sentances related to the search
  sentanceContainer = [];

  //run through all the sentences in the json file.
  for (var key in json.stories) {
    // json.stories[key].story.length
    //run over 4 sentences
    for (var i = 0; i < Math.ceil(json.stories[key].story.length/3); i++) {
      // console.log(json.stories[key].story.length);
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

  // pick a randon sentance from that array.
  let randomSentance = Math.floor(Math.random() * Math.floor(sentanceContainer.length));

  socket.emit('sendSeedSentance', {'animal': checkword, 'randomSentance': sentanceContainer[randomSentance]});

  // add the sentance to the page
  addSentence(sentanceContainer[randomSentance], 'notnet');

  // add the sketch to the page
  setTimeout(() => {
    loadASketch(checkword);
  }, 1000);
}




function addSentence(result, source, sketchIllustration){

  //if the current sentence is smaller than the entire length of the story
  if (sentanceNumber <= maxSentences ){
    //increase sentence number
    sentanceNumber ++;

    //create div to hold new sentence
    var div = document.createElement("div");
    div.id = `paragraph${sentanceNumber}`;
    div.style.background = "white";
    div.style.color = "white";
    div.style.opacity = 0;
    div.style.filter = 'alpha(opacity=' + 0 * 0 + ")";

    //check source of the sentence
    if (source == "net"){
      // console.log("Net");
      let para = document.createElement("p");
      para.classList.add("net");
      let node = document.createTextNode(result);
      para.appendChild(node);
      document.getElementById("story").appendChild(div).appendChild(para);
    } else {

      //if the source is not "net" than do the following
      let para = document.createElement("p");

      //add class to paragraph
      para.classList.add("voice");
      let node = document.createTextNode(result);
      para.appendChild(node);
      document.getElementById("story").appendChild(div).appendChild(para);
      // let dimThis  = document.getElementById(`paragraph${sentanceNumber-1}`);
      // dimElement(dimThis);
      setTimeout(() => {
        //scroll into the sentence
        console.log(`Adding sentence number${sentanceNumber}`);

        let elm  = document.getElementById(`paragraph${sentanceNumber}`);
        elm.scrollIntoView({ behavior: 'smooth', block: 'center' });

        //fade the sentence into the page.
        let fadeinElement = document.getElementById(`paragraph${sentanceNumber}`);
        fadein(fadeinElement);
      }, 500);

      //run check to see if there is an illustration that fits here
      let thisClass = ifInClass(result);
      if (sentanceNumber > 1){
        if (thisClass != undefined){
          console.log(`add ${thisClass} illustration here`);
          loadASketch(thisClass);
        } else {
          //TODO console.log('dont add illustration here');
        }
      }

    }
    //run loop again!
    setTimeout(() => {
      addSentence(similarSentences[sentanceNumber], 'sentence2Vec', sketchIllustration);
    }, 10000);

  } else {

    //if sentanceNumber is larger than the maxSentences

    var div = document.createElement("div");
    div.id = `paragraph${sentanceNumber+1}`;
    div.style.background = "white";
    div.style.color = "white";
    div.style.opacity = 0;
    div.style.filter = 'alpha(opacity=' + 0 * 0 + ")";

    let para = document.createElement("p");
    para.classList.add("voice");
    let node = document.createTextNode("The End.");
    para.appendChild(node);
    document.getElementById("story").appendChild(div).appendChild(para);

    let fadeinElement = document.getElementById(`paragraph${sentanceNumber+1}`);

    //fade the sentence into the page.
    setTimeout(() => {
      fadein(fadeinElement);
    }, 1200);
  }
  // console.log('sentanceNumber', sentanceNumber);
}



function buttonPressed(clicked_id){

  let animalOne = document.getElementById(clicked_id).innerHTML;
  //convert to lowercase
  let animalOneLower = animalOne.toLowerCase();
  currIllustration = animalOneLower;

  //run the check function
  runjsonCheck(fablesJson, animalOneLower);

  setTimeout(() => {
    let fadeoutComponent1 = document.getElementById("characterOne");
    let fadeoutComponent2 = document.getElementById("recordedText");

    fadeout(fadeoutComponent1);
    fadeout(fadeoutComponent2);
  }, 300);

  let para = document.createElement("p");
  let node = document.createTextNode(`A story about a ${animalOne}`);
  para.appendChild(node);
  para.style.display = "none";
  para.classList.add("title-text-name");
  para.id = "a-story-about";
  var element = document.getElementById("prompt");
  element.appendChild(para);


  setTimeout(() => {
    fadeInelement = document.getElementById("a-story-about");
    fadein(fadeInelement);
  }, 1000);


}


function startbuttonPressed(clicked_id){

  startStory = true;

  setTimeout(() => {


    let fadeoutComponent1 = document.getElementById("book");
    fadeout(fadeoutComponent1);
  }, 300);

  setTimeout(() => {
    let fadeoutComponent = document.getElementById("start-button");
    fadeout(fadeoutComponent);


  }, 700);

  setTimeout(() => {
    let fadeinComponent1 = document.getElementById("prompt");
    let fadeinComponent2 = document.getElementById("characterOne");
    fadein(fadeinComponent1);
    fadein(fadeinComponent2);
  }, 1200);
}




///////sketchrnn

//drawing class
var sketchRnnDrawing = function( drawingOne ) {
  // var x = 100;
  // var y = 100;

  drawingOne.setup = function() {
    drawingOne.createCanvas(600, 350);
    drawingOne.background(255);
    previous_pen = 'down';
    drawingOne.loop();
    sketchColor = getRandomColor();
  };

  drawingOne.draw = function() {
    if (sketch) {
      // playsound(sketch.dx, sketch.dy);

      penStrokes ++;
      if (penStrokes % 10 == 0){
        playNote1( "1n", convertDiamToNote(sketch.dy));
      }


      if (previous_pen == 'down') {
        drawingOne.stroke(sketchColor);
        drawingOne.strokeWeight(6);
        drawingOne.line(x, y, x + sketch.dx/1.3, y + sketch.dy/1.3);
      }
      x += sketch.dx/1.3;
      y += sketch.dy/1.3;
      previous_pen = sketch.pen;

      if (sketch.pen !== 'end') {
        sketch = null;
        sketchmodel.generate(gotSketch);
      } else {
        //when finished --> add another sentence
        // setTimeout(() => {
        //   // console.log("add new sentance");
        //   enhanceStory(sentanceNumber);
        // }, 7000);
        drawingOne.noLoop();
        penStrokes = 0;
        previous_pen = sketch.pen;
        sketch = null;
        sketchmodel = null;
      }
    }
  };
};





function loadASketch(drawing){
  sketchmodel = ml5.SketchRNN(drawing, function() {
    // console.log("sketchmodelReady");
    startDrawing();
  });

  //create a div container for drawing
  drawingNumber ++;

  var div = document.createElement("div");
  div.id = `drawing${sentanceNumber}`;
  div.style.background = "white";
  div.style.color = "white";
  div.style.paddingBottom = "0px";
  document.getElementById("story").appendChild(div);

  var drawingCanvas = new p5(sketchRnnDrawing, document.getElementById(`drawing${sentanceNumber}`));
  if( sentanceNumber != 1){
    // let elm  = document.getElementById(`drawing${sentanceNumber}`);
    // elm.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // let dimThis  = document.getElementById(`paragraph${sentanceNumber-1}`);
    // dimElement(dimThis);
  }
  //TODO align
  setTimeout(() => {
    let elm  = document.getElementById(`drawing${sentanceNumber}`);
    elm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 2000);


}


function playsound(x, y){
  console.log(x,y);
}

//book animation
function loadBookSketch(drawing){

  sketchbookmodel = ml5.SketchRNN(drawing, function() {
    // console.log("sketchmodelReady");
    startDrawingbook();
  });

  //create a div container for drawing
  // drawingNumber ++;

  var div = document.createElement("div");
  div.id = "bookillustration";
  div.style.background = "white";
  div.style.color = "white";
  div.style.paddingBottom = "0px";
  div.style.position = "absolute";
  div.style.zIndex = "1";
  document.getElementById("book").appendChild(div);

  var drawingBookCanvas = new p5(sketchRnnBook, document.getElementById("bookillustration"));
}

//  Book animation in beginning
function startDrawingbook() {
  x = startBookX/2;
  y = startBookY/2;

  sketchbookmodel.reset();
  sketchbookmodel.generate(gotSketch);
  previous_pen = 'down';
  // console.log('startDrawingbook');
}


// book class
var sketchRnnBook = function( drawingBook ) {
  // var x = 100;
  // var y = 100;

  drawingBook.setup = function() {
    drawingBook.createCanvas(viewportWidth, viewportHeight);
    drawingBook.background(255);
    previous_pen = 'down';
    drawingBook.loop();
    sketchColor = getRandomColor();
  };

  drawingBook.draw = function() {
    if (sketch) {
      if (previous_pen == 'down') {
        drawingBook.stroke(sketchColor);
        drawingBook.strokeWeight(3);
        drawingBook.line(x, y, x + sketch.dx/2, y + sketch.dy/2);
      }
      x += sketch.dx/2;
      y += sketch.dy/2;
      previous_pen = sketch.pen;

      if (sketch.pen !== 'end') {
        sketch = null;
        sketchbookmodel.generate(gotSketch);
      } else {
        // console.log("end");

        sketch = null;
        // sketchbookmodel = null;

        // pic random drawing class
        let randomDrawingNumber = Math.floor(Math.random() * drawingClasses.length);
        let randDrawing = drawingClasses[randomDrawingNumber];
        sketchColor = getRandomColor();

        sketchmodel = ml5.SketchRNN(randDrawing, function() {
          // console.log("sketchmodelReady", randDrawing);
          startBookX = Math.floor(Math.random() * (viewportWidth*2 -20) + 20);
          startBookY = Math.floor(Math.random() * (viewportHeight*2 -20)+ 20);
          // console.log(startBookX,startBookY);

          setTimeout(() => {
            startDrawingbook();
          }, 1700);

        });
        //stop looping in draw
        if(startStory){
          sketch = null;
          drawingBook.noLoop();
        }

        //convert essential for stoping the animation
        // previous_pen = sketch.pen;
        //draw another ones
      }
    }
  };
};



function startDrawing() {
  x = startX ;
  y = startY;

  sketchmodel.reset();
  sketchmodel.generate(gotSketch);
  previous_pen = 'down';
}



function gotSketch(err, s) {
  sketch = s;
}





function enhanceStory(){
  //check if lower than length
  if(sentanceNumber <= 10){
    //reset similarityArray
    similaritiesArray = [];
    //add centance
    addSentence(similarSentences[sentanceNumber], 'sentence2Vec');
    // console.log("add new sentance");
    setTimeout(() => {
      ifInClass(similarSentences[sentanceNumber]);
      console.log("here",sentanceNumber);
    }, 6000);
  }
}


// drawingClasses
function ifInClass(theSentance){

  //if you can still add sentences
  if (sentanceNumber <= maxSentences ){

    //get theSentance to lower case
    let sentance = theSentance.toLowerCase();

    //split sentence to array
    let sentenceToArray = sentance.split(" ");

    //create new array called similarityArray
    similaritiesArray = [];

    //fo all the words in that new sentence
    for (var i = 0; i < sentenceToArray.length; i++) {

      //if a word in the class apears inside the sentence
      if (drawingClasses.indexOf(sentenceToArray[i].toLowerCase()) > -1) {

        // great! found words, now push those word into similaritiesArray
        similaritiesArray.push(sentenceToArray[i]);
      } else {
        // didnt find any words do nothing

      }
    }

    //if found words that match
    if (similaritiesArray.length > 0){
      //TODO set a current sketch class
      currIllustration = similaritiesArray[0]
      return currIllustration;
      //add that sketch class to the document
      //TODO used to load a --->
      // loadASketch(similaritiesArray[0].toLowerCase());
    }


    //dont do all this for now
    // else{
    //
    //   // add a sentence
    //   addSentence(similarSentences[sentanceNumber], 'sentence2Vec');
    //
    //   //focus on sentence
    //   let elm  = document.getElementById(`paragraph${sentanceNumber}`);
    //   elm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //
    //   // let dimThis  = document.getElementById(`paragraph${sentanceNumber-1}`);
    //   // dimElement(dimThis);
    //
    //   //trigger the loop
    //   setTimeout(() => {
    //     // console.log("add new sentance");
    //     ifInClass(similarSentences[sentanceNumber]);
    //   }, 8000);
    // }
  }
}


///Utils



///convert daim to note
function convertDiamToNote(locationY){

  let sketchNotationArray = [];

  let note;
  switch (Math.floor(convertRange( locationY, [ -50, 50 ], [ -1, 22 ] ))) {
    case -1:
    note = 0;
    break;
    case 0:
    note = 0;
    break;
    case 1:
    note = 196.00;
    break;
    case 2:
    note = 220.00;
    break;
    case 3:
    note = 246.94;
    break;
    case 4:
    note = 261.63;
    break;
    case 5:
    note = 293.66;
    break;
    case 6:
    note = 329.63;
    break;
    case 7:
    note = 369.99;
    break;
    case 8:
    note = 392.00;
    break;
    case 9:
    note = 440.00;
    break;
    case 10:
    note = 493.88;
    break;
    case 11:
    note = 523.25;
    break;
    case 12:
    note = 587.33;
    break;
    case 13:
    note = 659.25;
    break;
    case 14:
    note = 739.99;
    break;
    case 15:
    note = 783.99;
    break;
    case 16:
    note = 880.00;
    break;
    case 17:
    note = 987.77;
    break;
    case 18:
    note = 1046.50;
    break;
    case 19:
    note = 1174.66;
    break;
    case 20:
    note = 1318.51;
    break;
    case 21:
    note = 1479.98;
    break;
    case 22:
    note = 1567.98;
  }
  return note;
}


function convertRange( value, r1, r2 ) {
  return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}



function fadeout(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.001){
      clearInterval(timer);
      element.style.display = 'none';
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= op * 0.4;
  }, 20);
}

function fadeoutandDelete(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.001){
      clearInterval(timer);
      element.style.display = 'none';
      element.remove();
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= op * 0.4;
  }, 20);
}


function dimElement(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.2){
      clearInterval(timer);
      // element.style.display = 'none';
    }
    // element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op -= op * 0.4;
  }, 20);
}




function fadein(element) {
  var op = 0.1;  // initial opacity
  element.style.display = 'block';
  var timer = setInterval(function () {
    if (op >= 1){
      clearInterval(timer);
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op += op * 0.1;
  }, 10);
}



function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function playNote1(time, note) {
  if (note != undefined) {
    synthOne.triggerAttackRelease(note, "4n");
  }
}



let synthOne = createSyntOnehWithEffects();

function createSyntOnehWithEffects()  {
  let vol = new Tone.Volume(-40).toMaster();

  let reverb = new Tone.Freeverb(0.02).connect(vol);
  reverb.wet.value = 0.02;

  let delay = new Tone.FeedbackDelay(0.304, 0.05).connect(reverb);
  delay.wet.value = 0.02;

  let vibrato = new Tone.Vibrato(5, 0.01).connect(delay);

  let polySynth = new Tone.PolySynth(3, Tone.Synth, {
    "oscillator": {
      "type": "sine"
    },
    "envelope": {
      "attack": 0.08,
      "decay": 0.9,
      "sustain": 0.6,
      "release": 9.7,
    }
  });
  return polySynth.connect(vibrato);
}
