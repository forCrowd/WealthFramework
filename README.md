# Wealth Economy

[![Twitter Follow](https://img.shields.io/twitter/follow/forCrowd.svg?style=social)](https://twitter.com/forCrowd)
[![Join the chat at https://gitter.im/forCrowd/WealthEconomy](https://badges.gitter.im/forCrowd/WealthEconomy.svg)](https://gitter.im/forCrowd/WealthEconomy?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Experimental ideas on improving how the economy works

## Current Stack

### Client

* angular 2
* typescript
* breezejs
* systemjs
* gulp

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

Configuration files are excluded from deploy (Build Action: 'None').  
When deploying the project, update following configuration files with your own settings and manually copy them:
* WebApi\googleanalytics.js
* WebApi\Web.config
* WebApi\Configs\\*.config

### ng2Client Deployment

ng2Client project has three different environment; development, test, production.  
Each environment has its own settings under "/app/settings/" folder (i.e. "prod.settings")  
Update these files anyway you like.  
  
To deploy the application, execute the necessary task in gulpfile (i.e. "publish.prod").  
This task generates an output in "publish" folder in the root of ng2Client project.  
Simply copy the output to your server.

### Jasmine tests

To be able add "Jasmine" tests under "ngClient.Tests" folder into "Test Explorer" window, install the following extension:
* [Chutzpah Test Adapter for the Test Explorer](https://visualstudiogallery.msdn.microsoft.com/f8741f04-bae4-4900-81c7-7c9bfb9ed1fe)

### T4 files

To be able run Entity Framework related T4 files (.tt files that include "EF6.Utility.ttinclude" file):
* After restoring nuget packages, find and copy "EntityFramework.dll" and "EntityFramework.SqlServer.dll" files under "[Solution Folder]\packages" folder
* Go to "C:\Program Files (x86)\Microsoft Visual Studio 14.0\Common7\IDE" folder
* Optional: Take a backup of the existing files
* Paste these two files into this folder

## Changelog

See [Changelog.md](/CHANGELOG.md) for a detailed list.

## License

Wealth Economy is licensed under [MIT license](/LICENSE).
