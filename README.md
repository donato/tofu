tofu
====

Script for the game KingsOfChaos, improving gameplay, tracking player statistics and connecting users with each other.

## How to Contribute

Anyone can download this source, but if you want to share it back with us, you will need to install GIT.


Code Structure
Although the User Script environment does not give us the luxury of AMD and other cool tools, we still want to program as modularly as possible.

Before submitting to the depo, ensure that every included file passes jshint with our .jshintrc configuration.

### Understanding the Directory Structure
The main file is "tofu.user.js" which is generated from the ruby file "build.rb".
The file is a combination of some Greasemonkey configuration files, all of the included modules and then some driver code to init the code.


## Check with JSHint

Install Ruby
Install Node http://nodejs.org/download/
In command line type
npm install jshint -g

Then in the directory of ToFu simply type
ruby build.rb

That's it!