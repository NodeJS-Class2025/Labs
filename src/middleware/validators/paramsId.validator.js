import Joi from 'joi';

const idSchema = Joi.number().integer().positive().label('url id');

// Example: idValidator(['itemId'])
export const idValidator =
	(idNames = []) =>
	async (req, res, next) => {
		const errors = [];

		for (const idName of idNames) {
			if (req.params[idName]) {
				try {
					await idSchema.validateAsync(req.params[idName]);
				} catch (err) {
					errors.push(`${idName}: ${err.message}`);
				}
			}
		}

		if (errors.length) {
			let message = '';
			errors.forEach((err) => {
				message += err + '\n';
			});
			return res.status(400).render('error', { message });
			// return res.status(400).json({
			//   errors: errors,
			// });
		}

		next();
	};
