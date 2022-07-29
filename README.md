# Multithreaded Game Server
Kiwi Flight, a flight tracking project built using the MERN stack.
<br>Based on the open source Virtual Radar Server (VRS) project, Kiwi Flight aims to create a modern, mobile first front end to compliment a rock solid backend.

# Notes To The Markers
### 1 - Data Sourcing
As this is a live tracking service, at some times there may not be any planes displayed.
This is not because of a bug or issue with the project, rather that there are no planes in the air that can be tracked.
<br>You may also notice that the project only displays planes at high altitudes between Wellsford and Taupo.
This is due to physical limitations of the hardware we have deployed for the project.
As we are poor uni students, we have only been able to afford to depoly recievers in 3 locations across the country, these are:
* Swanson, West Auckland
* Whitianga, Coromandel
* Taupo, Southern Waikato

In future we are able to extend our reciever network for more coverage.

### 2 - Live ATC Audio
Due to CORS policies, the live ATC audio function will not work when the project is run locally.
<br>If you wish to see this function in action, please head over to production depolyment: https://kiwiflight.freeth.kiwi/



# Features
* Interactive map of currently tracked flights
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