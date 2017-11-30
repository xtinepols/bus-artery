/**
 * Driver.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

import bcrypt from "bcryptjs";

const Driver = {
	attributes: {
		busNumber: {
			model: "bus",
		},

		mobileNumber: {
			type: "string",
		},

		fullName: {
			type: "string",
		},

		username: {
			type: "string",
			required: true,
			unique: true,
		},

		password: {
			type: "string",
			required: true,
		},

		age: {
			type: "number",
		},

		employeeId: {
			type: "string",
		},

		isActive: {
			type: "boolean",
			defaultsTo: false,
		},

		longitude: {
			type: "string",
		},

		latitude: {
			type: "string",
		},

		origin: {
			type: "string",
		},

		estimatedTime: {
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

export default Driver;
