ATTENTION! Work in progress!

To prepare this app you need to:

1.Install MongoDB v3.4.6 (https://www.mongodb.com/download-center#enterprise)
2.Install NodeJS and npm (https://nodejs.org/en/download/) (NodeJS version at least v7.2.0, npm version at least v3.10.9)
3.Install nodemon by typing -npm install nodemon -g in the terminal (Optional).
4.Install Sass.
5.Download repository with app


Then you need to install all dependencies that app must have to be started:
    Open terminal in the app core folder and write -npm install


The next step is starting database:
    Open terminal and go to path like yourpath/MongoDB/bin/ and here write mongod.exe to start database


To start server in the core folder write
	-nodemon yourprojectfolder/server/bin/www
If you do not install nodemon, than you can start server with command -npm start


Gulp will be installed with all dependencies by -npm install
    To start gulp you must open terminal in yourprojectfolder/public/ and write different commands like
    -gulp
    -gulp watch
    -gulp build
    To see all available tasks, open yourprojectfolder/gulpfile.exe


In case, you want to change version of dependencies, you can edit them before -npm install in yourprojectfolder/pasckage.json
    To add or delete dependencies use -npm install {name of the module} --save, npm uninstall {name of the module}


So if do all steps above, and installed all correctly do this simple steps to run app:
    1.Run database (mongod.exe)
    2.Run Server(nodemon or npm start)
    3.Run Gulp(gulp watch)
    4.Open web browser and access app page by writing url: -http://localhost:4200 (in case you want to change port, you can edit him in Server/bin/www)




If you want to add user with admin priviligies(and i think you would want to do this), follow this instructions:

	-You must have any kind of program or service installed on your device in case you want to add privileged user. This can be any program that uses to work with REST services. 
	I offer, to use postman for this purpose. All instructions below will be based on Postman interface.
	-Other important thing, that you need to start your database(see instructions above) and have your project being launched.

	1.Launch your program for REST services interactions.
	2. Into URL line type this 'http://localhost:4200/api/v1/auth/signup'.
	3. Choose 'POST', as http method.
	4.Open body section, you need to create and fill 4 fields:
		-username,
		-password,
		-email,
		-role(!important);
	5.Username and password will be your further loging tools on your app, so remember what you typed in there.
	6.role must be filled precisely like this ---> 'Admin';
	7.Choose body type as 'x-www-form-urlencoded'
	8.Click Send.

That's it! After this you will have powers to log into as admin using your username and password.
		

Good luck!