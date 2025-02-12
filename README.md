# Neutralinojs / Vite / Vue / TailwindCSS Boilerplate

This is a simple boilerplate to get started with Neutralinojs, Vite and Vue.

Based on `npm create vue@latest` starter and manually added Neutralinojs and TailwindCSS.

Clone the repo, remove the .git folder and have fun...

## Configure

Make sure to update the `neutralino.config.json` file with your app settings.

## Install

```bash
npm install
```

Run the following command to get the binaries for Neutralinojs:

```bash
npm run neu:update
```

## Run

Dev mode run yor Vue app and start Neutralinojs with HMR:

```bash
npm run neu:run
```

## Build

Build the Vue app and Neutralinojs:

```bash
npm run build
```

## Build for release

Currently only MacOS added ( I'm not a Windows/Linux user ;-) ), based on the nice work of https://github.com/hschneider/neutralino-build-scripts

```bash
npm run neu:build:release:mac
```

# TODO

- Clean up the code
- Add Windows/Linux build scripts
- Add more Neutralinojs features
- Add basic Neutralinojs extension examples
- Write proper documentation
