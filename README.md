# SPARC 2.x Core (sparc2-core.js)

Low-level Javascript API for SPARC 2.x.  This API includes a variety of low-level functions used by the SPARC 2.x application, including functions to filter by VAM indicators, and calculate population at risk from multiple probabilitiy levels.  `sparc2-core.js` is a dependency of the `sparc2` Django application.

## GeoDash

GeoDash is a modern web framework and approach for quickly producing visualizations of geospatial data. The name comes from "geospatial dashboard".

The framework is built to be extremely extensible. You can use GeoDash server (an implementation), the front-end framework, backend code, or just the Gulp pipeline. Have fun!

# Building

Before you build, you'll need to install [browserify](http://browserify.org/), [uglify-js](https://www.npmjs.com/package/uglify-js), and [jshint](https://www.npmjs.com/package/jshint).

```
sudo npm install -g browserify
sudo npm install -g uglify-js
sudo npm install -g jshint
```

To run the build, which creates `dist/sparc2-core.js` and `dist/sparc2-core.min.js` just run the following command.

```
npm run build
```

# Tests

Only `jshint` support right now.  Run tests with the following command.

```
npm run tests
```

# Contributing

Happy to accept pull requests!

# License

See `LICENSE` file.
