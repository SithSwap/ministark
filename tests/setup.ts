import crypto from 'crypto';
globalThis.crypto = crypto as unknown as typeof globalThis.crypto;
