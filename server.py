#!/home/angus/bin/python3.4

import sys, os, json, datetime
from flask import Flask, url_for, render_template, Markup, request

fr = {}
colormap = {}

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def at():

    fo = {
        'width': '800',
        'fr': fr,
        'colormap': colormap
    }
    return render_template('at.html', f=fo)


if __name__ == "__main__":

    ar = sys.argv

    dateformat = "%B %d, %Y"

    if (len(ar) < 2):
        exit('Usage: at inputfile')

    infile = ar[1]
    with open(infile) as jfile:
        fr = json.load(jfile)

    with open('data/colormap.json') as jfile:
        colormap = json.load(jfile)

    app.run(debug=True, port=19722, host='0.0.0.0')
#    app.run( port=19722, host='0.0.0.0')
