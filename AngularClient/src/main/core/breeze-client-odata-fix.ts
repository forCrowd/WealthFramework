import { core } from "breeze-client";
core.requireLib = requireLib;

function requireLib(libNames, errMessage): any {
  var arrNames = libNames.split(";");
  for (var i = 0, j = arrNames.length; i < j; i++) {
    var lib = __requireLibCore(arrNames[i]);
    if (lib) return lib;
  }
  if (errMessage) {
    throw new Error("Unable to initialize " + libNames + ".  " + errMessage);
  }
}

// Returns the 'libName' module if loaded or else returns undefined
function __requireLibCore(libName) {
  //var window = global.window; // breeze fix
  if (!window) return; // Must run in a browser. Todo: add commonjs support

  // get library from browser globals if we can
  var lib = window[libName];
  if (lib) return lib;

  // if require exists, maybe require can get it.
  // This method is synchronous so it can't load modules with AMD.
  // It can only obtain modules from require that have already been loaded.
  // Developer should bootstrap such that the breeze module
  // loads after all other libraries that breeze should find with this method
  // See documentation
  var r = (window as any).require; // UPDATED LINE
  if (r) { // if require exists
    if (r.defined) { // require.defined is not standard and may not exist
      // require.defined returns true if module has been loaded
      return r.defined(libName) ? r(libName) : undefined;
    } else {
      // require.defined does not exist so we have to call require('libName') directly.
      // The require('libName') overload is synchronous and does not load modules.
      // It throws an exception if the module isn't already loaded.
      try {
        return r(libName);
      } catch (e) {
        // require('libName') threw because module not loaded
        return;
      }
    }
  }
}
