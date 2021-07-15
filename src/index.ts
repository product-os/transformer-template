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

const outArtifactPath = path.join(outDir, 'artifact.tar');

// our out SUB-dir might not exist
fs.mkdirSync(outDir, { recursive: true });

const run = async () => {
	const input = (await readInput(inputPath)).input;

	console.log('input:', input);

	let outContract: core.ContractDefinition<OutData>;

	// Do some stuff... Put your code here and set the outContract variable
	if (Object.keys(input.contract.data.platforms || {}).length > 1) {
		outContract = {
			slug: 'thisisaslug', // typically this gets overwritten by the worker based on the input
			type: 'mytype@1.0.0',
			data: {
				data: 'hey'
			},
		};
	} else {
		outContract = input.contract.data.fragment;
	}

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


run();
