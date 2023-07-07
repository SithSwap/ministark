declare namespace Network {
	const enum ChainID {
		// toShortString('SN_MAIN')
		Mainnet = '0x534e5f4d41494e',

		// toShortString('SN_GOERLI')
		Goerli = '0x534e5f474f45524c49',

		// toShortString('SN_GOERLI2')
		Goerli2 = '0x534e5f474f45524c4932'
	}
	
	const enum Name {
		Mainnet = 'SN_MAIN',
		Goerli = 'SN_GOERLI',
		Goerli2 = 'SN_GOERLI2'
	}
	
	type Info = {
		base: string;
		label: string;
		name: Enumerate<Name>;
		chain: Enumerate<ChainID>;
	};

 	const enum Status {
		Ok = 'ok',
		Degraded = 'degraded',
		Error = 'error',
		Unknown = 'unknown'
	}

	const enum Gateway {
		Default = 'gateway',
		Feeder = 'feeder_gateway'
	}
}


declare namespace Address {
	const enum Type {
		Block = 'block',
		Class = 'class',
		Event = 'event',
		Token = 'token',
		Contract = 'contract',
		Transaction = 'transaction'
	}
}

declare namespace Transaction {
	 const enum HashPrefix {
		// toShortString('declare')
		Declare = '0x6465636c617265',
	
		// toShortString('deploy')
		Deploy = '0x6465706c6f79',
	
		// toShortString('invoke')
		Invoke = '0x696e766f6b65',
	
		// toShortString('l1_handler')
		L1Handler = '0x6c315f68616e646c6572'
	}
	
	 const enum Status {
		NotReceived = 'NOT_RECEIVED',
		Received = 'RECEIVED',
		Pending = 'PENDING',
		AcceptedOnL2 = 'ACCEPTED_ON_L2',
		AcceptedOnL1 = 'ACCEPTED_ON_L1',
		Rejected = 'REJECTED'
	}
	
	 const enum Type {
		Declare = 'DECLARE',
		Deploy = 'DEPLOY',
		Invoke = 'INVOKE',
		L1Handler = 'L1_HANDLER',
		DeployAccount = 'DEPLOY_ACCOUNT',
		InvokeFunction = 'INVOKE_FUNCTION'
	}
}