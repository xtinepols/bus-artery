/**
 * Session.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

import moment from "moment";
import sha256 from "crypto-js/sha256";
import bcrypt from "bcryptjs";

const generateToken = () => {
	return `${sha256(`${Math.floor(Math.random() * 1000)  }${  new Date().getTime()}`)  }`;
	// return `${sha256(Math.floor(Math.random() * 1000) + new Date().getTime())}`;
};

const Session = {
	attributes: {
		ownerId: {
			model: "owner",
			description: "login either via owner, driver, or passenger",
		},

		driverId: {
			model: "driver",
			description: "login either via owner, driver, or passenger",
		},

		passengerId: {
			model: "passenger",
			description: "login either via owner, driver, or passenger",
		},

		refreshToken: {
			type: "string",
		},

		accessToken: {
			type: "string",
		},

		expiresAt: {
			type: "number",
		},

		metadata: {
			type: "json",
		},
	},

	beforeCreate: (values, cb) => {
		values.refreshToken = generateToken();
		values.accessToken = generateToken();
		values.expiresAt = +moment().add(5, "months");

		sails.log.debug("Session::beforeCreate");
		sails.log.debug(values);

		cb();
	},

	verifyPassword: async (candidatePassword, hash) => {
		const bool = await new Promise(async (resolve, reject) => {
			try {
				const isMatch = await bcrypt.compare(candidatePassword, hash);

				return resolve(isMatch);
			} catch (e) {
				sails.log.debug("LoginSession::verifyPassword::error");
				sails.log.error(e);

				return reject(e);
			}
		});

		return bool;
	},
};

export default Session;
