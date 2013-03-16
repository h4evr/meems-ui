#!/bin/sh

# Remove previous documentation
rm -rf ../docs

# Use YUIDoc (must be in path) to generate the documentation
yuidoc -o ../docs ../src ../lib