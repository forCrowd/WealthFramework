# Wealth Framework

[![Twitter Follow](https://img.shields.io/twitter/follow/forCrowd.svg?style=social)](https://twitter.com/forCrowd)

Experimental ideas on increasing sustainability and productivity

## Current Stack

* Angular
* Angular CLI
* TypeScript
* BreezeJS
* Karma & Jasmine

## Setup

Follow this document to setup the application: [Getting Started](https://github.com/forcrowd/WealthFramework/wiki/Getting-Started)

### Deployment

AngularClient is a **Angular CLI** project and you can use its commands.

For deployment, there are three environments defined in `angular.json` file:

* test
* production

You can use **dev** configuration as a base file to create your own **test** and **prod** configuration files:

    AngularClient\src\app-settings\environments\environment-settings.ts

To prepare a production bundle by generating sourcemap files, run the following on your command console:

    ng build --prod

For more options, please visit [Angular CLI](https://github.com/angular/angular-cli)

## Contribute

Our project is, without any discrimination, open to anyone who is willing to make a contribution!  

To learn more about our community rules: [Code of Conduct](/CODE_OF_CONDUCT.md)

## Changelog

To see the changes in our project: [Changelog](/CHANGELOG.md)

## License

Our project is licensed under [MIT license](/LICENSE).

You are free to use, modify and distribute it, even in commercial activities.
