/**
 * PassengerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const PassengerController = {
	create: async (req, res) => {
		try {
			const { body } = req;

			sails.log.debug("PassengerController::create::start");
			sails.log.debug(body);

			if (!body.username) {
				throw new Error("Username is required.");
			}	else if (body.hasOwnProperty("username")) {
				if (!body.username.trim().length) {
					throw new Error("Username must not be empty.");
				}
			}

			if (!body.password) {
				throw new Error("Password is required.");
			}	else if (body.hasOwnProperty("password")) {
				if (!body.password.trim().length) {
					throw new Error("Password must not be empty.");
				}
			}

			let passenger = await Passenger.create(body).meta({ fetch: true });

			passenger = Passenger.sanitize(passenger);

			sails.log.debug("PassengerController::create::done");
			sails.log.debug(passenger);

			res.ok(passenger);
		} catch (err) {
			sails.log.error("PassengerController::create::error");
			sails.log.error(err);

			return res.badRequest(err);
		}
	},
};

export default PassengerController;
