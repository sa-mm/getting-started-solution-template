# IoT Connector web application

This project provides the public facing web application for OEM customer to claim and manage purchased devices.

This project is based on [Vue.js](https://vuejs.org/) framework.

## Branding

To easily customize your page branding, edit & change the files in the [./vendor](./vendor) folder. 

## Local UI development

1. go to `app/` directory
2. run `npm install` to install dependencies
3. modify `.env.local` to point to your PDaaS instance domain
4. run `npm run serve` to start UI locally at http://localhost:8080
5. to create new, minified, porduction build run `npm run build`

## Build Setup

Execute following step to build a new version of the web UI:

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080 to test locally
npm run serve

# build for production with minification: result
npm run build

# run all unit tests
npm test

# run linting check
npm run lint
```
