# HoulgateFest - Front

This repository hosts the code for the frontend of the HoulgateFest website. It is a full Javascript application
written in react, with authentication/logging and whose main feature is to be able to "shotgun" (reserve) a room
in a house.

It is meant to work alongside its backend : https://github.com/TanguyLe/HoulgateFestBack.

## Installation
### Prerequisites
1. Node and npm installed, recommended versions are node 12.18.3.
2. Repo cloned.

### Packages
Just use `npm install` within the project directory and you're good to go !

## Usage

The following commands are all defined using npm scripts from the package.json.

The target backend is defined as follows :
1. Dev setups : The default is `http://localhost:3000` but the value of `API_URL` overrides it.
2. Prod setup : The env variable `API_URL` has to be set.

If the frontend does not point to a working backend, most of the pages won't work properly.

All the frontend servers are served by default at http://localhost:8000/.

### Development

1. `npm run dev`: Hot-reloading web server for development.
2. `npm run devStartShotgun`: The same as 1, but modified so that the shotgun
page is always visible even if the shotgun date is not reached.
3. `npm run devBuild`: Performs a development build to generate the static asset of the website,
must be used with `npm start` (see below).

#### Production

1. `npm run build`: Performs a production build to generate the static asset of the website,
must be used with `npm start` (see below)
2. `npm run start`: Starting a server for an already built website (dev or prod version).
