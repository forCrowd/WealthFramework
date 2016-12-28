## ng2Client - Settings

`settings.ts` file that is located in this folder is the initial configuration file.

During the first build of the application, it will be copied to the parent folder as three different files, to let you enter your own settings:
* `dev-setings.ts`
* `test-settings.ts`
* `prod-settings.ts`

Please note that these copies under the parent folder will be not be stored in the source control.

### Technical Remarks

Other .ts files import these settings by using `import { Settings } from "settings"`.  
`settings` map is defined in `systemjs.config.js` file and changes based on the environment.  

By default, for local development, `default.aspx` uses `systemjs.config.js` file without any modification and maps to `dev-settings` file.
"build" tasks in `gulpfile.js` file, modify this map for the selected environment:

* `build-test` -> `test-settings.ts`
* `build-prod` -> `prod-settings.ts`
