/* eslint-disable unicorn/filename-case */

/**
 * @file This file serves as the entrypoint for the module. It exports the main
 *       Updown class as the default export, along with all other publicly
 *       available types.
 *
 *       Every export is repeated twice here, as an ES6 module export for
 *       Typescript applications and most bundlers, and as a CommonJS export
 *       for traditional Node.js applications.
 */

import Updown, { MetricsGrouping } from './Updown';
import Check from './Check';
import Downtime from './Downtime';

// The default export is the main class, which should be the only necessary
// entity for most applications
export default Updown;
module.exports = Updown;

// Re-export other entities as ES6 modules and as CommonJS modules
export {
	Check,
	Downtime,

	MetricsGrouping,
};

module.exports.Check = Check;
module.exports.Downtime = Downtime;

module.exports.MetricsGrouping = MetricsGrouping;