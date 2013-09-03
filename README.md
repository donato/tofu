tofu
====

Script for the game KingsOfChaos, improving gameplay, tracking player statistics and connecting users with each other.

## How to Contribute
### Setting up your environment for first time

1. Install 
	* NodeJS : http://nodejs.org/download/
	* GitHub Client : https://help.github.com/articles/set-up-git
2. Make a github.com account.
2. Fork the project into your account, by clicking "Fork" on this page https://github.com/DonatoB/tofu
4. After logging into GitHub, click "tools" from the top and select options. Then change the settings for "default storage directory" for wherever you want the local copy to be.
5. Click update, then go back and select your username from the left Menu under "github" header.
6. You will see a list of your forked projects, click tofu, and then click "clone"
7. Now you can go to the local copy, make changes and use the application to submit them back to your github branch.

When you are ready to submit the changes back to the Master branch, go to github.com and visit your branch. Then select "Pull Request"

### How to build
	Open a command line window in the local /src/ folder.
	The first time you do this you will need to install node packages by typing "npm install"
	After that you can build by typing "grunt"
	
	The build script will test your code for some common mistakes, and then build a new tofu-min.user.js file for you to test!
	

### Understanding Code Structure
There are two folders, the 
    /server/...
    /src/...
The server folder contains the CSS files and images which the script will download once upon installation.
The src folder is only used to build the minified file.

