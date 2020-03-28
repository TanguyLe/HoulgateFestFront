# HoulgateFest - Back
## Installation
Note: For Windows, a bit more work to setup mongo at https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/.

1. Do step 1 and 2 in the front readme if not done before, and install the modules:
```shell
cd HoulgateFest/back
npm install
```
2. Install mongodb by the following steps:

a. Import the public key:
```shell
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
```
b. Create a list file (for 16.04, otherwise see at https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/):
```shell
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
```
c. Update packages:
```shell
sudo apt-get update
```
d. Install the latest stable version:
```shell
sudo apt-get install -y mongodb-org
```
## Usage
### Development
Make sure the service for the db runs by using `sudo service mongod start`.
You can fill the database with mock values using the command `npm run populateDB`.
To run a hot-reloading web server for development use  `npm run dev`. To access directly the mongo console if needed just use `mongo`.

Your db server will be on localhost, the node server on the port displayed by your console!
#### Prod
`npm run start` will start a regular server, `npm run startShotgun` will start one which enables the shotgun
whatever the shotgun date set in the db is.
