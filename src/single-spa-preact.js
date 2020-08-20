const defaultOpts = {
  // required opts
  preact: null,
  rootComponent: null,

  // optional opts
  domElementGetter: null,
};

export default function singleSpaPreact(userOpts) {
  if (typeof userOpts !== "object") {
    throw new Error(`single-spa-preact requires a configuration object`);
  }

  const opts = {
    ...defaultOpts,
    ...userOpts,
  };

  if (!opts.preact) {
    throw new Error(`single-spa-preact must be passed opts.preact`);
  }

  if (!opts.rootComponent) {
    throw new Error(`single-spa-preact must be passed opts.rootComponent`);
  }

  return {
    bootstrap: bootstrap.bind(null, opts),
    mount: mount.bind(null, opts),
    unmount: unmount.bind(null, opts),
  };
}

function bootstrap(opts) {
  return Promise.resolve();
}

function mount(opts, props) {
  return new Promise((resolve, reject) => {
    const domElementGetter = chooseDomElementGetter(opts, props);

    if (typeof domElementGetter !== "function") {
      throw new Error(
        `single-spa-preact: the domElementGetter for preact application '${
          props.appName || props.name
        }' is not a function`
      );
    }

    opts.renderedNode = opts.preact.render(
      opts.preact.h(opts.rootComponent, props, null),
      getRootDomEl(domElementGetter, props)
    );

    resolve();
  });
}

function unmount(opts, props) {
  return new Promise((resolve, reject) => {
    const domElementGetter = chooseDomElementGetter(opts, props);

    opts.preact.render(
      "", // see https://github.com/developit/preact/issues/53
      getRootDomEl(domElementGetter, opts),
      opts.renderedNode
    );

    delete opts.renderedNode;

    resolve();
  });
}

function getRootDomEl(domElementGetter, props) {
  const el = domElementGetter(props);

  if (!el) {
    throw new Error(
      `single-spa-preact: domElementGetter function did not return a valid dom element`
    );
  }

  return el;
}

function chooseDomElementGetter(opts, props) {
  if (props.domElement) {
    return () => props.domElement;
  } else if (props.domElementGetter) {
    return props.domElementGetter;
  } else if (opts.domElementGetter) {
    return opts.domElementGetter;
  } else {
    return defaultDomElementGetter(props);
  }
}

function defaultDomElementGetter(props) {
  const appName = props.appName || props.name;
  if (!appName) {
    throw Error(
      `single-spa-preact was not given an application name as a prop, so it can't make a unique dom element container for the preact application`
    );
  }
  const htmlId = `single-spa-application:${appName}`;

  return function defaultDomEl() {
    let domElement = document.getElementById(htmlId);
    if (!domElement) {
      domElement = document.createElement("div");
      domElement.id = htmlId;
      document.body.appendChild(domElement);
    }

    return domElement;
  };
}
