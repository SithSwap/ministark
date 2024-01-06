import fs from 'fs';

function remove(path: string) {
	return new Promise<void>((resolve, reject) => {
		if (!fs.existsSync(path)) return resolve();
		console.log(`Deleting directory "${path}"...`);
		fs.rm(path, { recursive: true }, error => {
			if (error) return reject(error);
			console.log(`${path} is deleted!`);
			resolve();
		});
	});
}

console.log('Cleaning working tree...');

function getTargets(args: string[]) {
	if (args.includes('--build')) return ['dist'];
	const targets = ['dist', 'coverage', 'node_modules'];
	if (args.includes('--lock')) targets.push('package-lock.json');
	return targets;
}

const targets = getTargets(process.argv.slice(2));

Promise.all(targets.map(remove)).then(() => console.log('Successfully cleaned working tree!'));
