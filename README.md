# Multithreaded Game Server

![alt text](https://github.com/dwag351/Multithreaded-Game-Server/Images/Image01.jpg?raw=true)

This is a project created for A1 COMPSCI 711. The requirements were to create a multithreaded TCP socket server which is compatible with any number of games that use certain commands.

# Description
### 1 - Multithreaded Game Server
As this is a live tracking service, at some times there may not be any planes displayed.
This is not because of a bug or issue with the project, rather that there are no planes in the air that can be tracked.
![alt text](https://github.com/dwag351/Multithreaded-Game-Server/Images/Image02.jpg?raw=true)
<br>There were a number of commands which were required for this assignment, these included:
* /register
* /pairme?player={username}
* /mymove?player={username}&id={gameID}
* /theirmove?player={username}&id={gameID}

For further work for this server it would make sense to fix some of the bugs associated with disconnects of clients.

### 2 - Checkers Game
This is a basic HTML, CSS and JS game which allows two players to connect to the game server and
![alt text](https://github.com/dwag351/Multithreaded-Game-Server/Images/Image03.jpg?raw=true) 
<br>If you wish to see this function in action, please head over to production depolyment: https://kiwiflight.freeth.kiwi/

# Features
* Multithreaded design of the server which allows for 
* Responsive design
* Displays police & miltary flights, unlike other major websites (FlightRadar24)
* Live ATC audio feeds
* Front end only, can connect to any existing VRS server
* Key airport markers
* Detailed Flight Stats
* Open Source Leaflet map, does not require paid for license keys
* Easy to search flight list
* Airline Logos, for easy brand recognition

# Running The Project

To run the project:
1) make sure that NPM is installed (should be installed if you have Node.js on your machine).
2) navigate to the kiwi-flight directory.
3) open the terminal and execute the following command to install dependencies: `npm install` (Give this a few minutes to install the dependancies)
4) execute the following command to run the project: `npm start`
5) open a browser, and navigate to http://127.0.0.1:3000