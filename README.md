tofu
====

tofu is a pluggable extension to the game KingsOfChaos, improving gameplay, tracking player statistics and connecting users with each other.

## How to Contribute

Bear in mind that this is the work of several hobbyist coders working together over IRC since 2008.

### How to build
```bash
# Go to your development directory
cd ~/git/
# Clone this repo
git clone git@github.com:donato/tofu.git
cd tofu

# Install dependencies
npm install -g grunt-cli
npm install

# Run build
grunt

```  

The build script will test your code for some common mistakes, and then build a new tofu-min.user.js in the /bin/ folder for you to test!
  

## How to run as Chrome Extension
1. Go to chrome://extensions url
2. Select "developer mode" checkbox
3. Click "Load unpacked extension"
4. In the dialog select the folder which the manifest.json file is in

## Dev tips
  * To look at network requests: https://github.com/Tampermonkey/tampermonkey/issues/561
  * For instant debugging run ```grunt``` then install ```bin/tofu-dev.user.js``` as your script. Modify file path as needed