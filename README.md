tofu
====

Script for the game KingsOfChaos, improving gameplay, tracking player statistics and connecting users with each other.

## How to Contribute
### Setting up your environment for first time

1. Install 
	* Ruby : http://www.ruby-lang.org/en/downloads/
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
	The first time you do this you will need ot install jshint by typing "npm install jshint -g"
	After that you can build by typing "ruby build.rb"
	
	The build script will test your code for some common mistakes, and then build a new tofu.user.js file for you to test!
	
	For faster development, I recommend you edit the build.rb file to automatically copy the new user script into your Greasemonkey install directory so that you can just refresh FireFox after building.

### Understanding Code Structure
There are two folders, the 
    /server/...
    /src/...
The server folder contains the CSS files, javascript libraries and images which the script will download once upon installation.
The src folder contains the source which is built using "build.rb"

Although the User Script environment does not give us the luxury of AMD and other cool tools, we still want to program as modularly as possible. Thus we attempt to enforce a rule that each file will be a self contained object.
