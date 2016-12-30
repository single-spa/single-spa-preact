const defaultOpts = {
	// required opts
	preact: null,
	rootComponent: null,
	domElementGetter: null,
}

export default function singleSpaPreact(userOpts) {
	if (typeof userOpts !== 'object') {
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

	if (!opts.domElementGetter) {
		throw new Error(`single-spa-preact must be passed opts.domElementGetter function`);
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

function mount(opts) {
	return new Promise((resolve, reject) => {
		opts.renderedNode = opts.preact.render(
			opts.preact.h(opts.rootComponent, null, null),
			getRootDomEl(opts),
		);

		resolve();
	});
}

function unmount(opts) {
	return new Promise((resolve, reject) => {
		opts.preact.render(
			'', // see https://github.com/developit/preact/issues/53
			getRootDomEl(opts),
			opts.renderedNode,
		);

		delete opts.renderedNode;

		resolve();
	});
}

function getRootDomEl(opts) {
	const el = opts.domElementGetter();

	if (!el) {
		throw new Error(`single-spa-preact: domElementGetter function did not return a valid dom element`);
	}

	return el;
}
