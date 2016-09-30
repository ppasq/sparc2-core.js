# SPARC 2.x Core (sparc2-core.js)

Low-level Javascript API for SPARC 2.x.  This API includes a variety of low-level functions used by the SPARC 2.x application, including functions to filter by VAM indicators, and calculate population at risk from multiple probabilitiy levels.  `sparc2-core.js` is a dependency of the `sparc2` Django application.

GeoDashJS is added at [/sparc2/static/sparc2/lib/sparc2-core/](https://github.com/wfp-ose/sparc2/tree/master/sparc2/static/sparc2/lib/sparc2-core) to the [sparc2](https://github.com/wfp-ose/sparc2) project.

## GeoDash

GeoDash is a modern web framework and approach for quickly producing visualizations of geospatial data. The name comes from "geospatial dashboard".

The framework is built to be extremely extensible. You can use GeoDash server (an implementation), the front-end framework, backend code, or just the Gulp pipeline. Have fun!

# Building

Before you build, you'll need to install [browserify](http://browserify.org/), [uglify-js](https://www.npmjs.com/package/uglify-js), and [jshint](https://www.npmjs.com/package/jshint).  You should install globally with:

```
sudo npm install -g browserify
sudo npm install -g uglify-js
sudo npm install -g jshint
```

To run the build, which creates `dist/sparc2-core.js`, `dist/sparc2-core.min.js`, and the docs just run:

```
npm run build
```

## code

To just build the distributable code (`dist/sparc2-core.js`, `dist/sparc2-core.min.js`), run:

```
npm run build:code
```

## docs

To build the custom docs template used in the website, you'll need to install a custom version of docstrap.git on top of the default version.  The below command will install the custom version.

```
npm install git+https://git@github.com/geodashio/docstrap.git\#geodash # Install custom docs template with font awesome
```

You can just build docs with:
```
npm run build:docs # or gulp docs since run the same thing
```

# Tests

Only [jshint](http://jshint.com/about/) is supported right now.  Run tests with the following command.

```
npm run tests
```

# Contributing

Happy to accept pull requests!

# License

See `LICENSE` file.
