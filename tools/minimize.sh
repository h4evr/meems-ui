#!/bin/sh

if [ ! -f mustache.min.js ];
then    
    aria2c "http://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.7.2/mustache.min.js"
fi


r.js -o build.js

