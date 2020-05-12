# Parcel Bundler Template

This is the minimal boilerplate required to start a Parcel Bundler (https://parceljs.org/) Template with TypeScript and React integration.

The beautiful thing about Parcel is the zero-less configutation required to get up and running. Wepack is fine, but so is having a break from Webpack sometimes.

**Note the use of `parcel-bundler@1.12.4` as newer versions were not stable at the time of this project.**

## Project Layout/Features

The project is split into a library (`./library`), and a public site (`./public`). The library can focus on a specific solutions, and be imported into the public site for use if needed, or it can be just built on its own and consumed from the `./dist/index.js` file. If you wanted to publish the library, the `package.json` uses the built library as the `main` entry point (public export).

The public site can be used for examples, integration tests, or even a full web application if required. It can also contain its own specific source separate from the library.

All build outputs go to the `./dist` folder including sourcemaps and TypeScript definitions.

The entry point for the library is `./lib/index.ts`. This could also be `index.tsx` if needed.

The entry point for the public site is `./public/index.html`. Notice within that file it uses the `index.tsx` script, which is in turn the script entry point for the public site. The `index.html` file is in the project root so that all scripts used within it can reference `~lib` as defined in `tsconfig.json`.

Notice also in `./public/index.tsx` the way the library is imported, and the use of `~lib` dependency path. This can also be `~lib/foo/file` etc..

If you just wanted to build a library you could delete:

* `./index.html`
* `./public`

## Installing Dependencies

1. Fire up a terminal at the project root.
2. If you are using `nvm` make sure you `nvm i` (install) the correct Node version first
3. Install dependencies with `yarn` (or `npm install` if no yarn, but seriously please use yarn!)


## Scripts

* `clean`      : clean the `./dist` folder
* `start`      : alias for `web:dev`
* `web:dev`    : kick off the local dev server (port 3000) for the public site with watch mode
* `web:watch`  : just build the public site with watch mode, without the devserver
* `web:build`  : build the public site for production
* `lib:prod`   : clean, build the library and type definitions
* `lib:build`  : build the library
* `lib:types`  : build the type definitions for the library
