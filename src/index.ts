import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { core } from '@balena/jellyfish-types';
import * as _ from 'lodash';

import { Input, OutData, Result } from './types';

console.log('Template Transformer starting');

const getEnvOrFail = (envVar: string) => {
	const env = process.env[envVar];
	if (!env) {
		console.log(`required env var ${envVar} was not set`);
		process.exit(1);
	}
	return env;
};

// worker exposes this
const outputPath = getEnvOrFail('OUTPUT');
const inputPath = getEnvOrFail('INPUT');

const inDir = path.dirname(inputPath);
const outDir = path.dirname(outputPath);

const outArtifactPath = path.join(outDir, 'result-artifacts');
fs.mkdirSync(outArtifactPath, { recursive: true });

const run = async () => {
	const input = (await readInput(inputPath)).input;

	console.log('input:', input);

	let outContract: core.ContractDefinition<OutData>;

	// TODO Do some stuff... Put your code here and set the outContract variable to a contract
	outContract = {
		type: 'type-my-out-type@1.2.3',
		data: {
			someResultProperty: 1
		}
	};

	const result: Result = {
		results: [
			{
				contract: outContract,
				imagePath: path.relative(outDir, outArtifactPath),
			},
		],
	};
	console.log('result:', result);
	await fs.promises.writeFile(outputPath, JSON.stringify(result));
};

const readInput = async (filePath: string) => {
	return YAML.parse((await fs.promises.readFile(filePath)).toString()) as Input;
};


run().catch(err => {
	console.log("ERROR IN TRANSFORMER", err);
	process.exit(1);
});
