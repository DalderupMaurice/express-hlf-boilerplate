<p align="center">
  <img src="./logo.png" width="150px" /> 
</p>

<h1 align="center">Express boilerplate with the Hyperledger SDK</h1>

<p align="center">
  This creates a project <strong>boilerplate</strong> for <strong>Express boilerplate with the Hyperledger SDK</strong>
</p>

<p align="center">
  <a href='https://travis-ci.org/DalderupMaurice/express-hlf-example'>
    <img src='https://travis-ci.org/DalderupMaurice/express-hlf-example.svg?branch=master' alt='Build Status' />
  </a>
  
  <a href='https://coveralls.io/github/DalderupMaurice/express-hlf-example?branch=master'>
    <img src='https://coveralls.io/repos/github/DalderupMaurice/express-hlf-example/badge.svg?branch=master' alt='Coverage Status' />
  </a>
  
  <a href='https://gemnasium.com/github.com/DalderupMaurice/express-hlf-example'>
    <img src="https://gemnasium.com/badges/github.com/DalderupMaurice/express-hlf-example.svg" alt="Dependency Status" />
  </a>

  <a href="https://deepscan.io/dashboard#view=project&pid=2258&bid=12753">
    <img src="https://deepscan.io/api/projects/2258/branches/12753/badge/grade.svg" alt="DeepScan grade">
  </a>

  <img src='https://bettercodehub.com/edge/badge/DalderupMaurice/express-hlf-example?branch=master'>
  
  <a href='https://github.com/prettier/prettier'>
    <img src='https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat'>
  </a>
</p>




## Overview

This is a boilerplate application for building REST APIs in Node.js using ES6 and Express with Code Coverage and JWT Authentication. It also includes the HLF SDK. Helps you stay productive by following best practices. Follows [Airbnb's Javascript style guide](https://github.com/airbnb/javascript).

## Getting Started

Clone the repo:

```sh
git clone https://github.com/DalderupMaurice/express-hlf-example.git
cd express-hlf-example
```

Install yarn:

```js
npm install -g yarn
```

Install dependencies:

```sh
yarn
```

Set environment (vars):

```sh
cp .env.example .env
```

Start server:

```sh
# Start server
yarn start

# Selectively set DEBUG env var to get logs
DEBUG=express-hlf-example:* yarn start
```

Tests:

```sh
# Run tests written in ES6
yarn test

# Run test along with code coverage
yarn test:coverage

# Run tests on file change
yarn test:watch

# Run tests enforcing code coverage (configured via .istanbul.yml)
yarn test:check-coverage
```

Lint:

```sh
# Lint code with ESLint
yarn lint

# Run lint on any file change
yarn lint:watch
```

Other gulp tasks:

```sh
# Wipe out dist and coverage directory
gulp clean

# Default task: Wipes out dist and coverage directory. Compiles using babel.
gulp
```

##### Deployment

```sh
# compile to ES5
1. yarn build

# upload dist/ to your server
2. scp -rp dist/ user@dest:/path

# install production dependencies only
3. yarn --production

# Use any process manager to start your services
4. pm2 start dist/index.js
```

In production you need to make sure your server is always up so you should ideally use any of the process manager recommended [here](http://expressjs.com/en/advanced/pm.html).
We recommend [pm2](http://pm2.keymetrics.io/) as it has several useful features like it can be configured to auto-start your services if system is rebooted.

## Contributing

Contributions, questions and comments are all welcome and encouraged. For code contributions submit a pull request with unit test.

## License

This project is licensed under the [MIT License](https://github.com/DalderupMaurice/express-hlf-example/blob/master/LICENSE)

## Meta

Maurice Dalderup – [@mauricedalderup](https://twitter.com/mauricedalderup) – Maurice_Dalderup@hotmail.com
