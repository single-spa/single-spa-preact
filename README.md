# single-spa-preact

Generic lifecycle hooks for Preact applications that are registered as [child applications](https://github.com/CanopyTax/single-spa/blob/master/docs/child-applications.md) of [single-spa](https://github.com/CanopyTax/single-spa).

## Quickstart

First, in the child application, run `npm install --save single-spa-preact` (or `jspm install npm:single-spa-preact` if your child application is managed by jspm). Then, in your [child app's entry file](https://github.com/CanopyTax/single-spa/blob/docs-1/docs/configuring-child-applications.md#the-entry-file), do the following:

```js
import preact from 'preact';
import rootComponent from './path-to-root-component.js';
import singleSpaPreact from 'single-spa-preact';

const reactLifecycles = singleSpaPreact({
  preact,
  rootComponent,
  domElementGetter: () => document.getElementById('main-content'),
});

export const bootstrap = [
  preactLifecycles.bootstrap,
];

export const mount = [
  preactLifecycles.mount,
];

export const unmount = [
  preactLifecycles.unmount,
];
```

## Options

All options are passed to single-spa-preact via the `opts` parameter when calling `singleSpaPreact(opts)`. The following options are available:

- `preact`: (required) The main Preact object, which is generally either exposed onto the window or is available via `require('preact')` `import preact from 'preact'`.
- `rootComponent`: (required) The top level preact component which will be rendered
- `domElementGetter`: (required) A function that takes in no arguments and returns a DOMElement. This dom element is where the React application will be bootstrapped, mounted, and unmounted.
