# Wealth Economy

[![Twitter Follow](https://img.shields.io/twitter/follow/forCrowd.svg?style=social)](https://twitter.com/forCrowd)
[![Join the chat at https://gitter.im/forCrowd/WealthEconomy](https://badges.gitter.im/forCrowd/WealthEconomy.svg)](https://gitter.im/forCrowd/WealthEconomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Experimental ideas on increasing sustainability and productivity

## Current Stack

### Client

* Angular
* Angular CLI
* TypeScript
* BreezeJS
* Karma & Jasmine

### Server

* .NET Framework 4.6
* ASP.NET Web API 2 & OData v3
* Entity Framework 6
* SQL Server 2014

## Setup

### Getting Started
[Getting Started](https://github.com/forcrowd/WealthEconomy/wiki/Getting-Started)

### First Mission: Contributors Page
This is an experimental attempt to help you to get familiar with our project and make your first pull request.

Follow this tutorial to get started:
[First Mission](https://github.com/forCrowd/WealthEconomy/wiki/First-Mission)

### WebApi Deployment

You can deploy WebApi appliation through Visual Studio publish.  

Only remark is, configuration files are excluded from deploy (Build Action: 'None').  
When deploying the project, update following configuration files with your own settings and manually copy them:
* WebApi\googleanalytics.js
* WebApi\Web.config
* WebApi\Configs\\*.config

If you would like to make the application offline during the deployment, you can use **app_offline.htm_**.

### AngularClient Deployment

AngularClient is a Angular CLI project and all of its commands are available.

Thera are three environments defined in `.angular-cli.json` file: `dev`, `test` & `prod`.  
For `test` & `prod`, please create your own files by copying `dev` configuration file:

    AngularClient\src\app-settings\environments\environment-settings.ts

To prepare a production bundle, run the following on your command console:

    ng build -prod

For more options, please visit [Angular CLI](https://github.com/angular/angular-cli)

## Changelog

See [Changelog.md](/CHANGELOG.md) for a detailed list.

## License

Wealth Economy is licensed under [MIT license](/LICENSE).
