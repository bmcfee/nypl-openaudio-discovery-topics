#!/usr/bin/env python
'''Annotate open text annotator ouputs'''

import json
import pickle
from pprint import pprint
import textblob
import sys
import os

# How much do we care about global vs local topic distribution?
GLOBAL_RATIO = 0.25

TextBlob = textblob.TextBlob

file_names = sys.argv[1:]

with open('base-model.pkl', 'rb') as fdesc:
    model = pickle.load(fdesc)['pipeline']

with open('base-model-topics.pkl', 'rb') as fdesc:
    topics = pickle.load(fdesc)


for file_name in file_names:
    with open(file_name) as data_file:
        data = json.load(data_file)

    lines = data['lines']

    # Get the global document
    all_doc = ' '.join([line['best_text'] for line in lines])
    doc_topics = model.transform([all_doc])

    # add noun phrases to each line
    for line in lines:
        # alternate noun phrase extractor
        # text = TextBlob(line['best_text'], np_extractor=textblob.en.np_extractors.ConllExtractor())
        text = TextBlob(line['best_text'])

        line['noun_phrase'] = text.noun_phrases or [item[0] for item in text.tags if item[1] == 'NNP'] or [item for item in text.tags if item[1] == 'NN']

        # soon...
        
        line_topics = model.transform([line['best_text']])

        mix_topic = (GLOBAL_RATIO * doc_topics + (1 - GLOBAL_RATIO) * line_topics).squeeze()
        
        for k in topics:
            if not topics[k]:
                mix_topic[k] = 0
        
        line['topic'] = topics[mix_topic.argmax()]

    # save file as _np.json
    outname = os.path.splitext(file_name)[0] + '_annotated.json'

    with open(outname, 'w') as fp:
        json.dump(data, fp)
