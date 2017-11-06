# Welcome to the Breeze-Angular bridge #

A bridge that configures Breeze to work with Angular out of the box.

# Change Log #

### 4.0.0 April 19, 2017 ###

#### Features ####
- Update to to support Angular 4

### 2.4.2 March 5, 2017 ###

#### Features ####
- Update to breeze-client 1.6.3

### 2.4.1 March 1, 2017 ###

#### Breaking Changes ####
- Renamed package to `breeze-bridge-angular` and synchronzied major/minor version with Angular
- Renamed `BreezeBridgeAngular2Module` to `BreezeBridgeAngularModule`
- Renamed `AjaxAngular2Adapter` to `AjaxAngularAdapter`

### 0.3.5 December 1, 2016 ###

#### Features ####
- Export AjaxAngular2Adapter class, [making it easier to add auth headers](https://github.com/Breeze/breeze.js/issues/173#issuecomment-263797223).

### 0.3.4 October 20, 2016 ###

#### Fixed Bugs ####
- Fix error response payload not being passed up

### 0.3.3 September 28, 2016 ###

#### Fixed Bugs ####
- Removed post install scripts from package.json

### 0.3.2 September 23, 2016 ###

#### Features ####
- Update to Angular 2 final
- Add support for AoT compilation

### 0.3.1 August 25, 2016 ###

#### Fixed Bugs ####
- Fix errant rejected promise in failure case
 
### 0.3.0 August 24, 2016 ###

#### Breaking Changes ####
- The Breeze Angular bridge is no longer an injectable service. It has been changed to an NgModule

# Prerequisites #

- Breeze client npm package 1.5.12 or higher
- Angular 2.0.0 or higher

# Installation #

1. Install breeze-client

	`npm install breeze-client --save`

2. Install breeze-bridge-angular

	`npm install breeze-bridge-angular --save`

# Usage #

A comprehensive example app that makes use of the bridge can be found here: [https://github.com/Breeze/temphire.angular](https://github.com/Breeze/temphire.angular).

To use the bridge in your own application, the following steps are required.

Configure `breeze-client` and `breeze-bridge-angular` in `systemjs.config.js`.

```
  // map tells the System loader where to look for things
  var map = {
    ...
    'breeze-client':              'node_modules/breeze-client',
    'breeze-bridge-angular':     'node_modules/breeze-bridge-angular'
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    ...
    'breeze-client':              { main: 'breeze.debug.js', defaultExtension: 'js'},
    'breeze-bridge-angular':     { main: 'index.js', defaultExtension: 'js'}
  };
```

Import `BreezeBridgeAngularModule` and add it to the app module's imports.

```
import { BreezeBridgeAngularModule } from 'breeze-bridge-angular';
```

```
@NgModule({
    imports: [
        BreezeBridgeAngularModule
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
```

Now we can use Breeze normally from something like a data service for example.

```
import { Injectable } from '@angular/core';
import { EntityManager, EntityQuery } from 'breeze-client';
import { Customer } from './entities';

@Injectable()
export class DataService {

    private _em: EntityManager;

    constructor() {
        this._em = new EntityManager();
    }

    getAllCustomers(): Promise<Customer[]> {
        let query = EntityQuery.from('Customers').orderBy('companyName');

        return this._em.executeQuery(query)
            .then(res => res.results)
            .catch((error) => {
                console.log(error);
                return Promise.reject(error);
            });
    }
}
```

Notice that we are also importing `breeze-client` instead of loading it as a static script as you might have seen in other examples. Make sure you don't have an extra script tag in your `index.html` that attempts to statically load `breeze.debug.js` or similar.

Example `index.html`:
```
<html>
  <head>
    <title>Angular 2 QuickStart</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="styles.css">

    <!-- Polyfill(s) for older browsers -->
    <script src="node_modules/core-js/client/shim.min.js"></script>

    <script src="node_modules/zone.js/dist/zone.js"></script>
    <script src="node_modules/reflect-metadata/Reflect.js"></script>
    <script src="node_modules/systemjs/dist/system.src.js"></script>

    <script src="systemjs.config.js"></script>
    <script>
      System.import('app').catch(function(err){ console.error(err); });
    </script>
  </head>

  <body>
    <my-app>Loading...</my-app>
  </body>
</html>
```
