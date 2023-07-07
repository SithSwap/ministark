globalThis.Network = {
    ChainID: {
		Mainnet: '0x534e5f4d41494e',
		Goerli: '0x534e5f474f45524c49',
		Goerli2: '0x534e5f474f45524c4932'
	},

    Name: {
		Mainnet: 'SN_MAIN',
		Goerli: 'SN_GOERLI',
		Goerli2: 'SN_GOERLI2'
	}, 
    
    Status: {
		Ok: 'ok',
		Degraded: 'degraded',
		Error: 'error',
		Unknown: 'unknown'
	},
    
    Gateway: {
		Default: 'gateway',
		Feeder: 'feeder_gateway'
	}
}


globalThis.Address = {
    Type: {
		Block: 'block',
		Class: 'class',
		Event: 'event',
		Token: 'token',
		Contract: 'contract',
		Transaction: 'transaction'
	}
}

globalThis.Transaction = {
    HashPrefix: {
		Declare: '0x6465636c617265',
		Deploy: '0x6465706c6f79',
		Invoke: '0x696e766f6b65',
		L1Handler: '0x6c315f68616e646c6572'
	},
    
    Status: {
		NotReceived: 'NOT_RECEIVED',
		Received: 'RECEIVED',
		Pending: 'PENDING',
		AcceptedOnL2: 'ACCEPTED_ON_L2',
		AcceptedOnL1: 'ACCEPTED_ON_L1',
		Rejected: 'REJECTED'
	},
    
    Type: {
		Declare: 'DECLARE',
		Deploy: 'DEPLOY',
		Invoke: 'INVOKE',
		L1Handler: 'L1_HANDLER',
		DeployAccount: 'DEPLOY_ACCOUNT',
		InvokeFunction: 'INVOKE_FUNCTION'
	}
}