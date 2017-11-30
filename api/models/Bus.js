/**
 * Bus.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const Bus = {
	attributes: {
		companyName: {
			type: string,
		},

		busNumber: {
			type: "string",
		},

		busType: {
			type: "string",
		},

		destination: {
			type: "string",
		},

		location: {
			type: "json",
			defaultsTo: {},
		},

		capacity: {
			type: "number",
			defaultsTo: 0,
		},

		route: {
			type: "json",
			defaultsTo: {},
		},
	},
};

export default Bus;
