import crypto from 'crypto';
if (!globalThis.crypto) globalThis.crypto = crypto as unknown as typeof globalThis.crypto;
