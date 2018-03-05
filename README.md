# Wealth Economy

[![Twitter Follow](https://img.shields.io/twitter/follow/forCrowd.svg?style=social)](https://twitter.com/forCrowd)
[![Join the chat at https://gitter.im/forCrowd/WealthEconomy](https://badges.gitter.im/forCrowd/WealthEconomy.svg)](https://gitter.im/forCrowd/WealthEconomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Experimental ideas on increasing sustainability and productivity

## Current Stack

* Angular
* Angular CLI
* TypeScript
* BreezeJS
* Karma & Jasmine

## Setup (Will be updated - 05 March 2018)

...

### Deployment

AngularClient is a **Angular CLI** project and you can use its commands.

For deployment, there are three environments defined in `.angular-cli.json` file:
* dev
* test
* prod

You can use **dev** configuration as a base file to create your own **test** and **prod** configuration files:

    AngularClient\src\app-settings\environments\environment-settings.ts

To prepare a production bundle by generating sourcemap files, run the following on your command console:

    ng build -prod -sm

For more options, please visit [Angular CLI](https://github.com/angular/angular-cli)

## Contribute

We welcome all contributors and all kinds of contributions.  

For more about our community rules: [Code of Conduct](/CODE_OF_CONDUCT.md)

## Changelog

To see the changes in our project: [Changelog](/CHANGELOG.md)

## License

WealthEconomy is licensed under MIT license.

You are free to use, modify and distribute it, even in commercial activities: [MIT license](/LICENSE)
