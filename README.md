# Let's Read a story!

This project is a study on Aesop Fables and the possibility of exploring the connections between them in a new and and fun way using machine learning.

# Collecting the data.

I chose to focus on Aesop Fables because of their concise yet rich story lines, the use of animals as metaphors, and the strong morals embedded in each story.


![Aesop Fables for kids](./images/fables.jpg)
[The text](http://www.gutenberg.org/files/49010/49010-0.txt)

Each original story contains:

1. A short title, usually very descriptive of the story's content.
2. The story itself, usually no more than 30 sentences.
3. The moral of the story, usually contains a metaphor built on the inherent nature or trait of the animals in the story.     

# Cleaning the dataset

For the analysis of the content I compiled a [JSON file](https://github.com/itayniv/aesop-fables-stories/blob/master/public/aesopFables.json) file holding all stories broken down to individual sentences, their titles, characters, and animals.

This file is key for generation of new stories, as it holds a all sentences and acts as the 'database' for the application.

# Analyzing the sentences

Using Google's [Universal Sentence Encoder](https://colab.research.google.com/github/tensorflow/hub/blob/master/examples/colab/semantic_similarity_with_tf_hub_universal_encoder.ipynb), I analyzed all the sentences derived from the fables(~1500 sentences).

This yields a sentence embedding for each sentence in a 512 dimensional space.

For example:

---

{"message": "There was once a little Kid whose growing horns made him think he was a grown-up Billy Goat and able to take care of himself.", "message_embedding": [0.06475523114204407, -0.026618603616952896, -0.05429006740450859, 0.003563014790415764 ...........]}

---



1. Using text to from a narrative.
2. Using illustrations to form a narrative.
3. Using sound and music to form a narrative.
4. Using animation to form a narrative.

# How did you become interested in this idea?
Recent developments in machine input complexity and accuracy are leading to more meaningful parameters that can be measured in smaller and smaller amount of time.

Amazon alexa, Google home, Facebook portal smartphones and other computers are beginning to have more impact on children’s life. \
Developing new forms of interactions could be interesting and important.


# Tools:
SketchRNN \
Word2Vec \
LSTMGenerator \
Tone JS \
Tracery \
Rita.js

# Resources

[are.na](https://www.are.na/itay-niv/tell-me-a-story-mctz38_fpi0) \
[Quickdraw dataset](https://quickdraw.withgoogle.com/data/jacket)

# Questions

1. How much is too much?
2. How much is too little?
3. Platform?
4. structure?



1. npm install dependencies.
2. Run app.js
