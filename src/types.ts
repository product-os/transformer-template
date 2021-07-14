import { core } from '@balena/jellyfish-types';

type InData = {
	fragment: core.ContractDefinition<any>;
	platforms?: string[];
};

export interface OutData {
	data: any;
}

interface TransformerData {
	targetPlatform?: string;
}

// a general form of this would make sense in a "Transformers SDK"
export type Input = {
	input: {
		contract: core.Contract<InData>;
		transformerContract: core.Contract<TransformerData>;
		artifactPath: string; // relative to the input file
		decryptedSecrets?: {
			buildSecrets?: {
				[key: string]: string;
			};
		};
		decryptedTransformerSecrets?: {
			buildSecrets?: {
				[key: string]: string;
			};
		};
	};
};

export type Result = {
	results: Array<{
		contract: core.ContractDefinition<OutData>;
		artifactPath?: string; // relative to the results file
		imagePath?: string; // relative to the results file
	}>;
};
