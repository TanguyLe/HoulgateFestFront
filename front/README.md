# HoulgateFest - Front
## Installation
1. Install node and npm.
`curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash - sudo apt-get install -y nodejs`
`sudo apt-get install -y build-essential`
2. Clone the project in an appropriate directory
`git clone git@github.com:TanguyLe/HoulgateFest.git`
3. Cd to the clone directory and install the modules
`cd HoulgateFest | npm install`
You're ready to go!
## Usage
### Dev
To run a hot-reloading web server for development, use:
`npm run dev`
Then you can go to http://localhost:8080/ and have fun!
#### Prod
For a production-ready build, use:
`npm run build`
It will create a minified and uglified min.js file in the /web directory. Then you can directly open the index.html file to see the website.
