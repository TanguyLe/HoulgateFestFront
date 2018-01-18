# HoulgateFest - Front
```
## Installation
1. Install node and npm:
```shell
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
2. Clone the project in an appropriate directory:
```shell
git clone git@github.com:TanguyLe/HoulgateFest.git
```
3. Cd to the clone directory and install the modules:
```shell
cd HoulgateFest/front
npm install
```
You're ready to go!
## Usage
### Devevelopment, use  `npm run dev`.

To run a hot-reloading web server for d
Then you can go to http://localhost:8080/ and have fun!
#### Prod
For a production-ready build, use `npm run build`.

It will create a minified and uglified min.js file in the /web directory. Then you can directly open the index.html file to see the website.
