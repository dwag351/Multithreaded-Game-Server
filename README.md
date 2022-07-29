# Multithreaded Game Server

![alt text](https://raw.githubusercontent.com/dwag351/Multithreaded-Game-Server/main/Images/Image01.JPG)

This is a project created for A1 COMPSCI 711. The requirements were to create a multithreaded TCP socket server which is compatible with any number of games that use certain commands.

# Description
### 1 - Multithreaded Game Server
This multithreaded server is able to have multiple JS clients connect via special web APIs to different TCP sockets. It was a crucial requirement of the assignment this server was created for that it does not operate at a higher level then the TCP level which is employed.
![alt text](https://raw.githubusercontent.com/dwag351/Multithreaded-Game-Server/main/Images/Image02.JPG)
<br>There were a number of commands which were required for this assignment, these included:
* /register
* /pairme?player={username}
* /mymove?player={username}&id={gameID}
* /theirmove?player={username}&id={gameID}

For further work for this server it would make sense to fix some of the bugs associated with disconnects of clients.

### 2 - Checkers Game
![alt text](https://raw.githubusercontent.com/dwag351/Multithreaded-Game-Server/main/Images/Image03.JPG) 
This checkers game is created with three main files, a HTML, JS and CSS file. These files are accompanied with a number of image files used to make up the bulk of the graphic interface of the game. Like normal checkers, one player is red and the other is black, however, in this version the server decides who is who. Each local client can only move their pieces when it is their turn. Turns are handled by the server.

# Features
* Multithreaded design of the server which allows for multiple clients to connect to it.
* The server is able to match players together and handle disconnects.
* The game client is able to operate a full game of checkers.
* The server also has a useful console that displays all the actions being executed on each thread as they happen.

# Running The Project

To run the project:
1) Open the Visual Studio project files for the server.
2) Run the server in Visual Studio.
3) Open two copies of the local client HTML file.
4) The two HTML pages will automatically connect to the server and play can commence. 