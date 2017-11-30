/**
 * Passenger.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

import bcrypt from "bcryptjs";

const Passenger = {
	attributes: {
		name: {
			type: "string",
		},

		username: {
			type: "string",
		},

		password: {
			type: "string",
		},

		gender: {
			type: "string",
			isIn: ["male", "female", "others"],
		},

		age: {
			type: "number",
		},

		balance: {
			type: "number",
			defaultsTo: 0,
		},

		busNumber: {
			model: "bus",
		},

		busType: {
			type: "string",
		},

		inTransit: {
			type: "number",
			defaultsTo: 0,
		},

		type: {
			type: "string",
		},

		tagId: {
			type: "string",
		},

		destination: {
			type: "string",
		},

		numberOfSeats: {
			type: "number",
		},

		longitude: {
			type: "string",
		},

		latitude: {
			type: "string",
		},
	},

	sanitize: (driver) => {
		delete driver.password;

		return driver;
	},

	beforeCreate: (values, cb) => {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				return cb(err);
			}
			bcrypt.hash(values.password, salt, (err, hash) => {
				if (err) {
					return cb(err);
				}
				values.password = hash;
				cb();
			});
		});
	},

	beforeUpdate: (values, cb) => {
		if (values.password) {
			bcrypt.genSalt(10, (err, salt) => {
				if (err) {
					return cb(err);
				}
				bcrypt.hash(values.password, salt, (err, hash) => {
					if (err) {
						return cb(err);
					}
					values.password = hash;

					return cb();
				});
			});
		} else {
			return cb();
		}
	},
};

export default Passenger;
