# HoulgateFest - Front
## Installation
Note: For Windows, go to https://nodejs.org/en/ to get node (version >9) and `dir HoulgateFest\front` for step3, the rest is the same.

1. Install node and npm:
```shell
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```
2. Clone the project in an appropriate directory:
```shell
git clone git@github.com:TanguyLe/HoulgateFest.git
```
3. Go to the cloned directory and install the modules:
```shell
cd HoulgateFest/front
npm install
```
You're ready to go!
## Usage
### Devevelopment
To run a hot-reloading web server for development use  `npm run dev`.

Then you can go to http://localhost:8080/ and have fun!
#### Prod
For a production-ready build, use `npm run build`.

It will create a minified and uglified min.js file in the /web directory. Then you can directly open the index.html file to see the website.
