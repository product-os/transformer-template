import { core } from '@balena/jellyfish-types';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { Input, OutData, Result } from './types';

const getEnvOrFail = (envVar: string) => {
	const env = process.env[envVar];
	if (!env) {
		console.log(`required env var ${envVar} was not set`);
		process.exit(1);
	}
	return env;
};

// worker exposes this
const outputManifestPath = getEnvOrFail('OUTPUT');
const inputManifestPath = getEnvOrFail('INPUT');

const inputDir = path.dirname(inputManifestPath);
const outDir = path.dirname(outputManifestPath);

export const outputDir = path.join(outDir, 'result-artifacts');
fs.mkdirSync(outputDir, { recursive: true });

export const readInput = async () => {
	const inManifest: Input = YAML.parse(
		(await fs.promises.readFile(inputManifestPath)).toString(),
	);
	// make path absolute to make handling for users easier
	inManifest.input.artifactPath = path.join(
		inputDir,
		inManifest.input.artifactPath,
	);
	return inManifest.input;
};

export const writeOutput = async (
	outContract: Omit<core.ContractDefinition<OutData>, 'slug'>,
	artifactType: 'artifact' | 'image' | 'none',
) => {
	let artifact: any;
	switch (artifactType) {
		case 'artifact':
			artifact = { artifactPath: path.relative(outDir, outputDir) };
			break;
		case 'image':
			artifact = {
				imagePath: path.relative(outDir, path.join(outputDir, 'image.tar')),
			};
			break;
		default:
			console.log('no artifact produced');
			artifact = {};
			break;
	}
	const result: Result = {
		results: [
			{
				contract: outContract,
				...artifact,
			},
		],
	};
	console.log('result:', result);
	await fs.promises.writeFile(outputManifestPath, JSON.stringify(result));
};
