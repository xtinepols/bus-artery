/**
 * Owner.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

import bcrypt from "bcryptjs";

const Owner = {
	attributes: {
		name: {
			type: "string",
			description: "Owner's name or the company's name",
		},

		email: {
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
	},

	sanitize: (owner) => {
		delete owner.password;

		return owner;
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

export default Owner;
