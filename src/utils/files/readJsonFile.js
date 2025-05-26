import fs from 'node:fs';

export function readJsonFileSync(filePath) {
	try {
		const json = fs.readFileSync(filePath, 'utf-8');
		const data = JSON.parse(json);
		return data;
	} catch (err) {
		throw err;
	}
}

export function readJsonFileCallback(filePath, callback) {
	fs.readFile(filePath, 'utf-8', (err, json) => {
		if (err) {
			return callback(err);
		}
		try {
			const data = JSON.parse(json);
			callback(null, data);
		} catch (parseErr) {
			callback(parseErr);
		}
	});
}

export function readJsonFilePromise(filePath) {
	return fs.promises
		.readFile(filePath, 'utf-8')
		.then((json) => JSON.parse(json));
}

export async function readJsonFileAsync(filePath) {
	try {
		const json = await fs.promises.readFile(filePath, 'utf-8');
		return JSON.parse(json);
	} catch (err) {
		throw err;
	}
}
