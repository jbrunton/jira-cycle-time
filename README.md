# grunt-jasmine-example
[![Build Status](https://travis-ci.org/jbrunton/grunt-jasmine-example.png)](https://travis-ci.org/jbrunton/grunt-jasmine-example)
[![Code Climate](https://codeclimate.com/github/jbrunton/grunt-jasmine-example.png)](https://codeclimate.com/github/jbrunton/grunt-jasmine-example)

A small example of how to use Grunt, Jasmine and Browserify to create an environment suitable for test-driving JavaScript modules.

## Getting Started

1. [Download the project](https://github.com/jbrunton/grunt-jasmine-example/archive/master.zip) and extract the contents.
2. Run ```npm install``` to install any dependencies.
3. If you don't have it set up, run ```npm install -g grunt-cli``` to install Grunt.
4. You're good to go.  Run ```grunt test``` to run the specs, and ```grunt build``` to generate a concatenated release build at ```build/main.js```.

## Developing and debugging

There are a few neat features that Jasmine and Browserify give us.

### Watching files

Run ```grunt watch```, and any changes made to the source files (in the ```scripts``` or ```test``` directories) will automatically cause Grunt to rebuild the test.js and main.js files, and to run the specs in the terminal.

### Debugging in the browser

To debug the tests in a browser, run ```grunt test:debug```.  This will build the tests, and then open the Jasmine SpecRunner.html file in your default browser.  If you run ```grunt watch``` and use the [LivePage](https://chrome.google.com/webstore/detail/livepage/pilnojpmdoofaelbinaeodfpjheijkbh?hl=en) extension then changes to the source files will immediately be reflected in the browser.

The Gruntfile configures Browserify to generate source maps for test builds, so you can debug the actual source files rather than the concatenated versions.

### Continuous integration

The project includes a ```.travis.yml``` file, which tells Travis how to install the necessary dependencies.  Travis recognises the package.json file and runs the ```test``` script in that (which just runs ```grunt test```).  You can see the Travis project [here](https://travis-ci.org/jbrunton/grunt-jasmine-example).
