tofu
====

Script for the game KingsOfChaos, improving gameplay, tracking player statistics and connecting users with each other.

### How to Contribute
## Setting up your environment

1. Make a github.com account
2. Fork the project into your account, by clicking "Fork" on this page https://github.com/DonatoB/tofu
3. Install GitHub from top URL here https://help.github.com/articles/set-up-git
4. After logging into GitHub desktop application, click "tools" from the top and select options. Then change the settings for "default storage directory" for wherever you want the local copy to be.
5. Click update, then go back and select your username from the left Menu under "github" header.
6. You will see a list of your forked projects, click tofu, and then click "clone"
7. Now you can go to the local copy, make changes and use the application to submit them back to your github branch.

When you are ready to submit the changes back to the Master branch, go to github.com and visit your branch. Then select "Pull Request"

## Ensuring code quality - jshint

Install Ruby http://www.ruby-lang.org/en/downloads/
Install Nodejs http://nodejs.org/download/
In command line type
    npm install jshint -g

Then in the directory of ToFu simply type
    ruby build.rb

That's it!

## Understanding Code Structure
There are two folders, the 
    /server/...
    /src/...
The server folder contains the CSS files, javascript libraries and images which the script will download once upon installation.
The src folder contains the source which is built using "build.rb"

Although the User Script environment does not give us the luxury of AMD and other cool tools, we still want to program as modularly as possible. Thus we attempt to enforce a rule that each file will be a self contained object.

Before making a Pull Request please make sure to build the file and that there are no errors.