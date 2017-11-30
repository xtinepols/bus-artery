/**
 * DriverController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const DriverController = {
	create: async (req, res) => {
		try {
			const { body } = req;

			sails.log.debug("DriverController::create::start");
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

			if (body.busNumber) {
				const bus = await Bus.findOne({ busNumber: body.busNumber });

				if (bus) {
					body.busNumber = bus.id;
				} else {
					delete body.busNumber;
				}
			}

			let driver = await Driver.findOne({ username: body.username });
			
			if (driver) {
				throw new Error("This driver is already registered.");
			}

			driver = await Driver.create(body).meta({ fetch: true });
			driver = Driver.sanitize(driver);

			sails.log.debug("DriverController::create::done");
			sails.log.debug(driver);

			res.ok(driver);
		} catch (err) {
			sails.log.error("DriverController::create::error");
			sails.log.error(err);

			return res.badRequest(err);
		}
	},
};

export default DriverController;
