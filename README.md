tofu
====

Script for the game KingsOfChaos, improving gameplay, tracking player statistics and connecting users with each other.

## Short Intro

Anyone can download this source, but if you want to share it back with us, you will need to install GIT
http://git-scm.com/downloads

### Understanding the Directory Structure
The entry point is the file "tofu.js", which includes the toolkits, utils and helpers we create elsewhere. Due to the way Greasemonkey updates dependencies, the only way to force the toolkits to update is by changing their name or location. For this reason with each incremental version we will copy/move the dependencies to a folder named the version number.
ie. folder "v20121110" represents the version released in 2012, the 11th month and 10th day.


## Check with JSHint

Install Node http://nodejs.org/download/
In command line type
npm install jshint -g

Then in the directory of ToFu simply type 
jshint tofu.user.js

That's it!