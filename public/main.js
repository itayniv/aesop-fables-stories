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
let maxSentences = 8;
let startStory = false;
let penStrokesopening = 0;
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
let currIllustration = '';

let fablesJson;

let sentanceContainer = [];
let sentimentContainer = [];

////// sketchRnnDrawing stuff

let sketchmodel;
let sketchBookmodel;
let previous_pen = 'down';
let x, y;
let startX = 300;
let startY = 130;

let startBookX;
let startBookY;
let sketch;
let bookSketch;

let canvasWidth = 600;
let canvasHeight = 350;
let drawingRation = 1.3;



let drawingClasses = ["alarm_clock",	"ambulance",	"angel", "ant", "antyoga","backpack",	"barn",	"basket",	"bear",	"bee",
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
"toothpaste",	"tractor",	"trombone",	"truck",	"whale",
"windmill",	"yoga",	"yogabicycle",	"everything"];

let birdsArr = ["jackdaw", "eagle", "crow", "crows", "swallow", "raven", "kite", "lark", "birds", "chicken", "chickens"];
let swanArr = ["crane","cranes", "goose","ducks", "peacock", "peacocks" ];
let mosquitoArr = ["gnat", "grasshopper", "grasshoppers", "flies", "wasps", "hornet"];
let dogArr = ["goats", "wolf", "fox","dogs", "boar", "weasels", "weasel" ];
let sheepArr = ["lamb"];
let spiderArr = ["beetle"];
let basketArr = ["pail"];
let turtleArr = ["tortoise", "tortoises"];
let squirrelArr =["hare"];
let lionArr = ["lion's"];
let catArr = ["tiger", "tiger's", "tigers", "cats"];
let owlArr = ["owl's"];
let frogArr = ["frogs", "frog's"]

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

  if (viewportWidth < 450 ){
    canvasWidth = 300;
    canvasHeight = 200;

    startX = canvasWidth/2;
    startY = canvasHeight/2;

    drawingRation = 2;


  }

  // console.log(viewportWidth,viewportHeight);


  loadJsonfile();
  setTimeout(() => {
    loadBookSketch('book');
  }, 1000);
}

window.onload = function() {



  let fadeinElement2 = document.getElementById("start-container");
  fadeinElement2.style.visibility = "visible";

  //turn bg to 0.9 opaque

  setTimeout(() => {
    let startBackground = document.getElementById("start-background");
    startBackground.style.opacity = 0.9;
  }, 1000);

  //fade the sentence into the page.
  let fadeinElement = document.getElementById("start-button");
  fadeinButton(fadeinElement);

  let fadeinElement1 = document.getElementById("start-background");
  fadeinButton(fadeinElement1);



};


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


socket.on('sentencesSentiment', function(result){
  // console.log(result);
  sentimentContainer = result;
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
  }, 2000);
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

        let elm  = document.getElementById(`paragraph${sentanceNumber}`);
        elm.scrollIntoView({ behavior: 'smooth', block: 'center' });

        //fade the sentence into the page.
        let fadeinElement = document.getElementById(`paragraph${sentanceNumber}`);
        fadein(fadeinElement);
      }, 500);

      //run sentence enrichment


      //run check to see if there is an illustration that fits here
      let thisClass = ifInClass(result);
      if (sentanceNumber > 1){
        if (thisClass != undefined){
          // console.log(`add ${thisClass} illustration here`);
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
    div.style.paddingBottom = "150px";

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

    setTimeout(() => {
      addOneMoreButton();
    }, 4000);
  }
}


function addOneMoreButton(){
  //if sentanceNumber is larger than the maxSentences

  var div = document.createElement("div");
  div.id = "read-one-more";
  div.style.background = "white";
  div.style.color = "white";
  div.style.opacity = 0;
  div.style.filter = 'alpha(opacity=' + 0 * 0 + ")";
  div.style.margin = "auto";
  div.style.width = "24%";

  let btn = document.createElement("BUTTON");
  btn.classList.add("one-more");
  btn.onclick = function() { resetStory(); };
  let node = document.createTextNode("Read one more.");
  btn.appendChild(node);
  document.getElementById("story").appendChild(div).appendChild(btn);

  let fadeinElement1 = document.getElementById("read-one-more");
  fadein(fadeinElement1);

  setTimeout(() => {
    let elm  = document.getElementById('read-one-more');
    elm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 500);



  ////TODO blogPost
  // var temp_link = document.createElement("a");
  // temp_link.href = "https://medium.com/@itayniv/lets-read-a-story-a-study-on-storytelling-for-children-using-machine-learning-tools-1b631bbbffac";
  // temp_link.classList.add("blog-post");
  // temp_link.target = '_blank';
  // temp_link.innerHTML = "Read the blog post";
  //
  // var par = document.createElement("p");
  // par.id = 'blog-post-id';
  // par.style.display = "none";
  // par.style.opacity = "0.0";
  //
  // par.innerHTML = "";
  // par.appendChild(temp_link);
  //
  // document.getElementById("story").appendChild(par);
  //
  // setTimeout(() => {
  //   let fadeinElement2 = document.getElementById("blog-post-id");
  //   fadein(fadeinElement2);
  // }, 3500);
}


function resetStory(){

  let fadeOutElement = document.getElementById("a-story-about");
  fadeOutElement.style.display = "none";
  fadeOutElement.style.opacity = "0.0";


  setTimeout(() => {
    let fadeOutElement1 = document.getElementById("story");
    let fadeOutElement2 = document.getElementById("prompt");

    fadeout(fadeOutElement1);
    fadeout(fadeOutElement2);

    // let elm  = document.getElementById('story');
    // elm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 500);

  setTimeout(() => {
    drawingNumber = 0;
    sentanceNumber = 0;

    document.getElementById("story").remove();

    var div = document.createElement("div");
    div.id = "story";
    document.getElementById("story-container").appendChild(div);
  }, 1000);

  setTimeout(() => {
    let fadeoutComponent1 = document.getElementById("characterOne");
    let fadeinElement2 = document.getElementById("recordedText");
    let fadeinElement3 = document.getElementById("prompt");

    fadein(fadeinElement2);
    fadein(fadeoutComponent1);
    fadein(fadeinElement3);
    fadein(fadeinElement2);
  }, 1400);

}

function buttonPressed(clicked_id){

  let animalOne = clicked_id;

  //convert to lowercase
  let animalOneLower = animalOne.toLowerCase();

  currIllustration = animalOneLower;



  // fade out buttons and prompt
  setTimeout(() => {
    let fadeoutComponent1 = document.getElementById("characterOne");
    let fadeoutComponent2 = document.getElementById("recordedText");

    fadeout(fadeoutComponent1);
    fadeout(fadeoutComponent2);
  }, 100);

  // create the story name
  let para = document.createElement("p");
  let node = document.createTextNode(`A story about a ${animalOne}`);
  para.appendChild(node);
  para.style.display = "none";
  para.classList.add("title-text-name");
  para.id = "a-story-about";
  var element = document.getElementById("prompt");
  element.appendChild(para);

  // fade in the story name
  setTimeout(() => {
    fadeInelement = document.getElementById("a-story-about");
    fadein(fadeInelement);
  }, 1000);

  // run the storycheck
  setTimeout(() => {
    runjsonCheck(fablesJson, animalOneLower);
  }, 1500);
  //run the check function


}


function startbuttonPressed(clicked_id){

  sketch = null;
  startStory = true;

  setTimeout(() => {
    let fadeoutComponent1 = document.getElementById("book");
    fadeout(fadeoutComponent1);
  }, 300);

  setTimeout(() => {
    let fadeoutComponent = document.getElementById("start-button");
    let fadeoutComponent1 = document.getElementById("start-background");
    fadeout(fadeoutComponent1);
    fadeout(fadeoutComponent);



  }, 500);

  setTimeout(() => {
    let fadeinComponent2 = document.getElementById("characterOne");
    fadein(fadeinComponent2);
    let fadeinComponent1 = document.getElementById("prompt");
    fadein(fadeinComponent1);
  }, 1500);

  setTimeout(() => {
    let elm  = document.getElementById(`startbutton`);
    elm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 2400);
}

//


///////sketchrnn

//drawing class
var sketchRnnDrawing = function( drawingOne ) {
  // var x = 100;
  // var y = 100;

  drawingOne.setup = function() {
    drawingOne.createCanvas(canvasWidth, canvasHeight);
    drawingOne.background(255);
    previous_pen = 'down';
    sketchColor = getRandomColor();

    drawingOne.loop();
  };

  drawingOne.draw = function() {
    if (sketch) {

      penStrokes ++;
      let penOffset = penStrokes % 4;


      if (sentimentContainer[sentanceNumber] >= 0){
        //sentiment is positive

        //for these animals play this synth
        if( (currIllustration == 'lion') || (currIllustration == 'dog')|| (currIllustration == 'bear') ){
          // each 25th pen stroke
          if ((penStrokes % 25 == 0) && (penOffset != 1)){

            let noteLenngth = noteLength(sketch.dx);
            if(noteLenngth == undefined){
              noteLenngth = '6n';
            }
            let notetoplayMajor = convertDiamToNoteMajor(sketch.dy)/4;
            playNote2( noteLenngth, notetoplayMajor);
          }
        } else{
          //play this synth each 12th stroke
          if ((penStrokes % 12 == 0)&& (penOffset != 1)){

            let noteLenngth = noteLength(sketch.dx);
            if(noteLenngth == undefined){
              noteLenngth = '6n';
            }
            playNote1( noteLenngth, convertDiamToNoteMajor(sketch.dy)*2);
          }
        }
      } else {
        // Sentiment is negeative

        //for these animals play this synth
        if( (currIllustration == 'lion') || (currIllustration == 'dog')|| (currIllustration == 'bear') ){
          // each 25th pen stroke
          if ((penStrokes % 25 == 0) && (penOffset != 1)){

            let noteLenngth = noteLength(sketch.dx);
            if(noteLenngth == undefined){
              noteLenngth = '6n';
            }

            let notetoplayMinor = convertDiamToNoteMinor(sketch.dy)/4;
            playNote2( noteLenngth, notetoplayMinor);
          }
        } else{
          //play this synth each 12th stroke
          if ((penStrokes % 11 == 0) && (penOffset != 1)){

            let noteLenngth = noteLength(sketch.dx);
            if(noteLenngth == undefined){
              noteLenngth = '6n';
            }
            playNote1( noteLenngth, convertDiamToNoteMinor(sketch.dy)*2);
          }
        }
      }


      if (previous_pen == 'down') {
        drawingOne.stroke(sketchColor);
        drawingOne.strokeWeight(6);
        drawingOne.line(x, y, x + sketch.dx/drawingRation, y + sketch.dy/drawingRation);
      }
      x += sketch.dx/drawingRation;
      y += sketch.dy/drawingRation;
      previous_pen = sketch.pen;

      if (sketch.pen !== 'end') {
        sketch = null;
        sketchmodel.generate(gotSketch);
      } else {

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

    // let dimThis  = document.getElementById(`paragraph${sentanceNumber-1}`);
    // dimElement(dimThis);
  }
  //TODO align
  setTimeout(() => {
    let elm  = document.getElementById(`drawing${sentanceNumber}`);
    elm.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 2000);
}



//book animation
function loadBookSketch(drawing){

  sketchbookmodel = ml5.SketchRNN(drawing, function() {
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
  div.style.top = "0px";
  document.getElementById("book").appendChild(div);

  var drawingBookCanvas = new p5(sketchRnnBook, document.getElementById("bookillustration"));
}

//  Book animation in beginning
function startDrawingbook() {
  x = startBookX/2;
  y = startBookY/2;

  sketchbookmodel.reset();
  sketchbookmodel.generate(gotBookSketch);
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
    if (bookSketch) {
      if (previous_pen == 'down') {
        //make music here
        penStrokesopening ++;

        if (penStrokesopening % 20 == 0){
          let noteToPlay = convertDiamToNoteMajor(bookSketch.dy);
          if(noteToPlay == undefined){
            noteToPlay = 0;
          }

          let noteLenngth = noteLength(bookSketch.dx);
          if(noteLenngth == undefined){
            noteLenngth = '6n';
          }
          playNoteStart( noteLenngth, noteToPlay);
        }

        drawingBook.stroke(sketchColor);
        drawingBook.strokeWeight(3);
        drawingBook.line(x, y, x + bookSketch.dx/2, y + bookSketch.dy/2);
      }
      x += bookSketch.dx/2;
      y += bookSketch.dy/2;
      previous_pen = bookSketch.pen;

      if (bookSketch.pen !== 'end') {
        bookSketch = null;
        sketchbookmodel.generate(gotBookSketch);
      } else {
        // console.log("end");

        bookSketch = null;
        // sketchbookmodel = null;

        // pic random drawing class
        let randomDrawingNumber = Math.floor(Math.random() * drawingClasses.length);
        let randDrawing = drawingClasses[randomDrawingNumber];
        sketchColor = getRandomColor();

        sketchBookmodel = ml5.SketchRNN(randDrawing, function() {
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
          drawingBook.noLoop();
          bookSketch = null;

          sketchBookmodel = null;

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


function gotBookSketch(err, s) {
  bookSketch = s;
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
    }, 6000);
  }
}


// drawingClasses
function ifInClass(theSentance){

  //if you can still add sentences
  if (sentanceNumber <= maxSentences ){

    //get theSentance to lower case
    let sentance = theSentance.toLowerCase();

    //remove, ! . ?
    let newsentance = sentance.replace('.', '');
    newsentance = newsentance.replace(',', '');
    newsentance = newsentance.replace('?', '');
    newsentance = newsentance.replace('!', '');

    //split sentence to array
    let sentenceToArray = newsentance.split(" ");

    //create new array called similarityArray
    similaritiesArray = [];


    let addClasses = enrichSketchClass(newsentance);


    for (var i = 0; i < addClasses.length; i++) {
      console.log(`add ${addClasses[i]} to array`);
      sentenceToArray.push(addClasses[i]);
    }
    // console.log(sentenceToArray);
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
    }
  }
}


///------> Utils

function enrichSketchClass(theSentance){

  let enrichClass;
  //get theSentance to lower case
  let sentance = theSentance.toLowerCase();

  //split sentence to array
  let sentenceToArray = sentance.split(" ");

  //create new array called similarityArray
  let newSimilaritiesArray = [];

  //fo all the words in that new sentence
  for (var i = 0; i < sentenceToArray.length; i++) {

    //if a word in the class apears inside the sentence
    if (squirrelArr.indexOf(sentenceToArray[i].toLowerCase()) > -1) {
      newSimilaritiesArray.push('squirrel');
      // console.log("found a squirrel");
    } else if(turtleArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a turtle");
      newSimilaritiesArray.push('sea_turtle');
    }else if(basketArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a basket");
      newSimilaritiesArray.push('basket');

    }else if(spiderArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a spider");
      newSimilaritiesArray.push('spider');

    }else if(sheepArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a sheep");
      newSimilaritiesArray.push('sheep');

    }else if(dogArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a dog");
      newSimilaritiesArray.push('dog');

    }else if(mosquitoArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a mosquito");
      newSimilaritiesArray.push('mosquito');

    }else if(swanArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a swan");
      newSimilaritiesArray.push('swan');

    }else if(birdsArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a bird");
      newSimilaritiesArray.push('bird');
    }
    else if(lionArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a lion");
      newSimilaritiesArray.push('lion');
    }
    else if(owlArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a owl");
      newSimilaritiesArray.push('owl');
    }
    else if(catArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a cat");
      newSimilaritiesArray.push('cat');
    }
    else if(frogArr.indexOf(sentenceToArray[i].toLowerCase()) > -1){
      // console.log("found a frog");
      newSimilaritiesArray.push('frog');
    }
    else {
      // console.log("didnt find anything");
      // didnt find any words do nothing
    }
  }
  return newSimilaritiesArray;
}



///convert daim to note
function convertDiamToNoteMajor(locationY){

  let newlocationY = clamp(locationY, -60, 60)

  let sketchNotationArray = [];
  let note;
  switch (Math.floor(convertRange( newlocationY, [ -60, 60 ], [ -1, 15 ] ))) {
    case -1:
    note = 0;
    break;
    case 0:
    note = 0;
    break;
    case 1:
    note = 246.94;
    break;
    case 2:
    note = 277.183;
    break;
    case 3:
    note = 311.127;
    break;
    case 4:
    note = 329.63;
    break;
    case 5:
    note = 369.99;
    break;
    case 6:
    note = 415.305;
    break;
    case 7:
    note = 466.1638;
    break;
    case 8:
    note =  493.8833;
    break;
    case 9:
    note = 554.3653;
    break;
    case 10:
    note = 622.254;
    break;
    case 11:
    note = 659.2551;
    break;
    case 12:
    note = 739.9888;
    break;
    case 13:
    note = 830.6094;
    break;
    case 14:
    note = 932.3275;
    break;
    case 15:
    note = 987.7666;
  }
  return note;
}


function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

function convertDiamToNoteMinor(locationY){

  let newlocationY = clamp(locationY, -60, 60)

  let sketchNotationArray = [];
  let note;
  switch (Math.floor(convertRange( newlocationY, [ -60, 60 ], [ -1, 15 ] ))) {
    case -1:
    note = 0;
    break;
    case 0:
    note = 0;
    break;
    case 1:
    note = 246.94;
    break;
    case 2:
    note = 277.183;
    break;
    case 3:
    note = 293.665;
    break;
    case 4:
    note = 329.63;
    break;
    case 5:
    note = 369.99;
    break;
    case 6:
    note = 391.995;
    break;
    case 7:
    note = 440.0000;
    break;
    case 8:
    note =  493.8833;
    break;
    case 9:
    note = 554.3653;
    break;
    case 10:
    note = 587.3295;
    break;
    case 11:
    note = 659.2551;
    break;
    case 12:
    note = 739.9888;
    break;
    case 13:
    note = 783.9909;
    break;
    case 14:
    note = 880.0000;
    break;
    case 15:
    note = 987.7666;
  }
  return note;
}



function noteLength(locationX){

  let noteLength;
  let note;
  let newlocationX = clamp(locationX, -60, 60)

  switch (Math.floor(convertRange( newlocationX, [ -60, 60 ], [ -1, 22 ] ))) {
    case 0:
    noteLength = "4n";
    break;
    case 1:
    noteLength = "4n";
    break;
    case 2:
    noteLength = "5n";
    break;
    case 3:
    noteLength = "5n";
    break;
    case 4:
    noteLength = "6n";
    break;
    case 5:
    noteLength = "6n";
    break;
    case 6:
    noteLength = "8n";
    break;
    case 7:
    noteLength = "8n";
    break;
    case 8:
    noteLength = "8n";
    break;
    case 9:
    noteLength = "8n";
    break;
    case 10:
    noteLength = "10n";
    break;
    case 11:
    noteLength = "10n";
    break;
    case 12:
    noteLength = "10n";
    break;
    case 13:
    noteLength = "12n";
    break;
    case 14:
    noteLength = '12n';
    break;
    case 15:
    noteLength = "12n";
    break;
    case 16:
    noteLength = "12n";
    break;
    case 17:
    noteLength = "14n";
    break;
    case 18:
    noteLength = "14n";
    break;
    case 19:
    noteLength = "14n";
    break;
    case 20:
    noteLength = "16n";
    break;
    case 21:
    noteLength = "16n";
    break;
    case 22:
    noteLength = "18n";

  }
  // console.log("here",noteLength, locationX);
  return noteLength;
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

function fadeinButton(element) {
  var op = 0.01;  // initial opacity
  element.style.display = 'inline-block';
  var timer = setInterval(function () {
    if (op >= 1){
      clearInterval(timer);
    }
    element.style.opacity = op;
    element.style.filter = 'alpha(opacity=' + op * 100 + ")";
    op += op * 0.08;
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
    synthOne.triggerAttackRelease(note, time);
  }
}


function playNote2(time, note) {
  if (note != undefined) {
    synthTwo.triggerAttackRelease(note, time);
  }
}


function playNoteStart(time, note) {
  if (note != undefined) {
    synthStart.triggerAttackRelease(note, time);
  }
}



let synthOne = createSyntOnehWithEffects();
let synthTwo = createSyntTwohWithEffects();
let synthStart = createSyntStarthWithEffects();



function createSyntOnehWithEffects()  {
  let vol = new Tone.Volume(-20).toMaster();

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
      "attack": 0.03,
      "decay": 0.1,
      "sustain": 0.6,
      "release": 4.7,
    }
  });
  return polySynth.connect(vibrato);
}



function createSyntTwohWithEffects()  {
  let vol = new Tone.Volume(-20).toMaster();

  let reverb = new Tone.Freeverb(0.02).connect(vol);
  reverb.wet.value = 0.02;

  let delay = new Tone.FeedbackDelay(0.304, 0.05).connect(reverb);
  delay.wet.value = 0.02;

  let vibrato = new Tone.Vibrato(5, 0.01).connect(delay);

  let polySynth = new Tone.PolySynth(3, Tone.Synth, {
    "oscillator": {
      "type": "sawtooth6"
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



function createSyntStarthWithEffects()  {
  let vol = new Tone.Volume(-30).toMaster();

  let reverb = new Tone.Freeverb(0.2).connect(vol);
  reverb.wet.value = 0.02;

  let delay = new Tone.FeedbackDelay(0.304, 0.05).connect(reverb);
  delay.wet.value = 0.1;

  let vibrato = new Tone.Vibrato(5, 0.04).connect(delay);

  let polySynth = new Tone.PolySynth(3, Tone.Synth, {
    "oscillator": {
      "type": "sine"
    },
    "envelope": {
      "attack": 0.01,
      "decay": 0.2,
      "sustain": 0.8,
      "release": 4.7,
    }
  });
  return polySynth.connect(vibrato);
}
