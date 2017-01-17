## ng2Client - Environment Settings

`environment-settings.ts` file that is located in this folder is the initial configuration file.

During the first build of the application, it will be copied to the parent folder and renamed as `local-setings.ts` to let you enter your own settings.

`settings.ts file` import these settings by using `environment-settings` map, which is defined in `systemjs.config.js` file and changes based on the environment.  

By default, for local environment, `default.aspx` uses `systemjs.config.js` file without any modification and maps to `local-settings` file.  

"build" tasks in `gulpfile.js` file, this path changes based on the environment:

* `build-local` -> `local-settings.js`
* `build-test` -> `test-settings.js`
* `build-production` -> `production-settings.js`

In order to avoid mistakes, `test` and `production` settings files need to be copied manually.  
You can use `copy-test|production-settings` tasks in gulp file to quickly create these files.

Please note that these copies under the parent folder will be not be stored in the source control.
