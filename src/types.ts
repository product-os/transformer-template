import { core } from '@balena/jellyfish-types';

interface ContractDefinition<T>
	extends Omit<core.ContractDefinition<T>, 'slug'> {}

export interface InputContract
	extends core.Contract<{
		// everything in here should be part of the input filter or the input type's schema
		someProperty: string;
	}> {}

export interface OutputContract
	extends ContractDefinition<{
		someResultProperty: number;
	}> {}

export interface TransformerContract
	extends core.Contract<{
		targetPlatform?: string;
	}> {}

// a general form of this would make sense in a "Transformers SDK"
export type Input = {
	input: {
		contract: InputContract;
		transformerContract: TransformerContract;
		artifactPath: string; // relative to the input file
		decryptedSecrets?: {
			[key: string]: string;
		};
		decryptedTransformerSecrets?: {
			[key: string]: string;
		};
	};
};

export type Result = {
	results: Array<{
		contract: OutputContract;
		artifactPath?: string; // relative to the results file
		imagePath?: string; // relative to the results file
	}>;
};
