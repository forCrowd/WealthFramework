# Wealth Economy

[![Twitter Follow](https://img.shields.io/twitter/follow/forCrowd.svg?style=social)](https://twitter.com/forCrowd)
[![Join the chat at https://gitter.im/forCrowd/WealthEconomy](https://badges.gitter.im/forCrowd/WealthEconomy.svg)](https://gitter.im/forCrowd/WealthEconomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Experimental ideas on improving how the economy works

## Current Stack

### Client

* Angular 2
* TypeScript
* BreezeJS
* SystemJS
* Rollup
* Gulp

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

### ng2Client Deployment

ng2Client project has three different environment; local, test, production.  
Each environment has its own settings under "/app/settings/" folder (i.e. "production-settings")  
Update these files anyway you like.  
  
To deploy the application, execute the necessary task in gulpfile (i.e. "build-production").  
This task generates an output in "publish" folder in the root of ng2Client project.  
Simply copy the output to your server.

If you would like to make the application offline during the deployment, you can use **app_offline.htm_**.

## Changelog

See [Changelog.md](/CHANGELOG.md) for a detailed list.

## License

Wealth Economy is licensed under [MIT license](/LICENSE).
