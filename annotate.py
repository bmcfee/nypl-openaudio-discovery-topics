import json
from pprint import pprint
import textblob
import sys

TextBlob = textblob.TextBlob

file_names = sys.argv[1:];

for file_name in file_names:
    with open(file_name) as data_file:
        data = json.load(data_file)

    lines = data['lines']

    # add noun phrases to each line
    for line in lines:
        # alternate noun phrase extractor
        # text = TextBlob(line['best_text'], np_extractor=textblob.en.np_extractors.ConllExtractor())
        text = TextBlob(line['best_text'])

        line['noun_phrase'] = text.noun_phrases or [item[0] for item in text.tags if item[1] == 'NNP'] or [item for item in text.tags if item[1] == 'NN']

        # soon...
        # line['group'] = P.transform([ line['best_text'] ]).argmax()

    # save file as _np.json
    with open(file_name + '_annotated.json', 'w') as fp:
        json.dump(data, fp)