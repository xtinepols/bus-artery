/**
 * SessionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
import moment from "moment";

const ownerLogin = async (req) =>
	new Promise(async (resolve, reject) => {
		try {
			let { username, password } = req.body;

			username = username.trim();
			password = password.trim();

			const owner = await Owner.findOne({ username });

			if (!owner) {
				throw new Error("Owner account not found.");
			}

			const isMatch = await Session.verifyPassword(password, owner.password);

			if (!isMatch) {
				throw new Error("Invalid password.");
			}

			const sessionPayload = await generateSession(req, owner.id, "ownerId");

			resolve(sessionPayload);
		} catch (err) {
			sails.log.error("ownerLogin::error");
			sails.log.error(err);

			return reject(err);
		}
	});

const driverLogin = async (req) =>
	new Promise(async (resolve, reject) => {
		try {
			let { username, password } = req.body;

			username = username.trim();
			password = password.trim();

			const driver = await Driver.findOne({ username });

			if (!driver) {
				throw new Error("Driver account not found.");
			}

			const isMatch = await Session.verifyPassword(password, driver.password);
			
			if (!isMatch) {
				throw new Error("Invalid password.");
			}

			const sessionPayload = await generateSession(req, driver.id, "driverId");

			resolve(sessionPayload);
		} catch (err) {
			sails.log.error("driverLogin::error");
			sails.log.error(err);

			return reject(err);
		}
	});

const passengerLogin = async (req) =>
	new Promise(async (resolve, reject) => {
		try {
			let { username, password } = req.body;

			username = username.trim();
			password = password.trim();

			const passenger = await Passenger.findOne({ username });

			if (!passenger) {
				throw new Error("Passenger account not found.");
			}

			const isMatch = await Session.verifyPassword(password, passenger.password);
			
			if (!isMatch) {
				throw new Error("Invalid password.");
			}

			const sessionPayload = await generateSession(req, passenger.id, "passengerId");

			resolve(sessionPayload);
		} catch (err) {
			sails.log.error("passengerLogin::error");
			sails.log.error(err);

			return reject(err);
		}
	});

const generateSession = async (req, id, key) => {
	try {
		const metadata = req.headers;
		let session = await Session
			.find({
				[key]: id,
				expiresAt: { ">": +moment() },
			})
			.limit(1);

		session = session[0];

		if (!session) {
			session = await Session
				.create({
					[key]: id,
					metadata,
				})
				.meta({ fetch: true });
		}

		switch (req.body.type) {
		case "owner":
			session[key] = await Owner.findOne({ id });
			break;
		case "driver":
			session[key] = await Driver.findOne({ id });
			break;
		case "passenger":
			session[key] = await Passenger.findOne({ id });
			break;
		}

		return session;
	} catch (err) {
		sails.log.error("generateSession::error");
		sails.log.error(err);

		return err;
	}
};

const SessionController = {
	create: async (req, res) => {
		try {
			let session = {};

			switch (req.body.type) {
			case "owner":
				session = await ownerLogin(req);
				break;
			case "driver":
				session = await driverLogin(req);
				break;
			case "passenger":
				session = await passengerLogin(req);
				break;
			default:
				throw new Error("Unknown identifier. Owner and Driver only.");
			}

			sails.log.debug("SessionController::create::done");
			sails.log.debug(session);

			res.ok(session);
		} catch (err) {
			sails.log.error("SessionController::create::error");
			sails.log.error(err);

			return res.badRequest(err);
		}
	},
};

export default SessionController;
