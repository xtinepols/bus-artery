/**
 * OwnerController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const OwnerController = {
	create: async (req, res) => {
		try {
			const { body } = req;

			sails.log.debug("OwnerController::create::start");
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

			let owner = await Owner.findOne({ username: body.username });

			if (owner) {
				throw new Error("This owner is already registered.");
			}

			owner = await Owner.create(body).meta({ fetch: true });
			owner = Owner.sanitize(owner);

			sails.log.debug("OwnerController::create::done");
			sails.log.debug(owner);

			res.ok(owner);
		} catch (err) {
			sails.log.error("OwnerController::create::error");
			sails.log.error(err);

			return res.badRequest(err);
		}
	},
};

export default OwnerController;
