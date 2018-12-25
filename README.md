# Let's Read a story!

This project is a study on Aesop Fables and the possibility of exploring the connections between them in a new and and fun way using machine learning.

# Collecting the data.

I chose to focus on Aesop Fables because of their concise yet rich story lines, the use of animals as metaphors, and the strong morals embedded in each story.
[The text](http://www.gutenberg.org/files/49010/49010-0.txt)

![Aesop Fables for kids](./images/fables.jpg)

Each original story contains:

1. A short title, usually very descriptive of the story's content.
2. The story itself, usually no more than 30 sentences.
3. The moral of the story, usually contains a metaphor built on the inherent nature or trait of the animals in the story.     

# Cleaning the dataset

For the analysis of the content I compiled a [JSON file](https://github.com/itayniv/aesop-fables-stories/blob/master/public/aesopFables.json) file holding all stories broken down to individual sentences, their titles, characters, and animals.

This file is key for generation of new stories, as it holds a all sentences and acts as the 'database' for the application.

# Analyzing the sentences

Using Google's [Universal Sentence Encoder](https://colab.research.google.com/github/tensorflow/hub/blob/master/examples/colab/semantic_similarity_with_tf_hub_universal_encoder.ipynb), I analyzed all the sentences derived from the fables(~1500 sentences).

This yields a JSON file containing sentence embeddings for each sentence in a 512 dimensional space.

For example:

{"message": "There was once a little Kid whose growing horns made him think he was a grown-up Billy Goat and able to take care of himself.", "message_embedding": [0.06475523114204407, -0.026618603616952896, -0.05429006740450859, 0.003563014790415764 ...........,0.06475523194004407]}


For processing and retrieval of information for similarities, averages and distances between sentences I used the [ML5](https://github.com/ml5js/ml5-library/blob/master/src/Word2vec/index.js) library and changed it a bit to work with the universal sentence encoder scheme.

# Adding Illustrations & Musical phrases to the story

To enrich the stories, I'm using the Google Magenta's sketch RNN to generate illustrations to  






[Quickdraw dataset](https://quickdraw.withgoogle.com/data/jacket)

# Questions

1. How much is too much?
2. How much is too little?
3. Platform?
4. structure?
