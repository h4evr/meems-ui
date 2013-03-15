#!/bin/sh

rm -rf ../docs
jsdoc --verbose -d ../docs ../lib/meems-events ../observable.js ../ui ../meems-ui.js