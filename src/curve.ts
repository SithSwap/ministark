import { sha256 } from '@noble/hashes/sha256';
import { hmac } from '@noble/hashes/hmac';

import { weierstrass } from '@noble/curves/abstract/weierstrass';
import { Field } from '@noble/curves/abstract/modular';

import { concatBytes, randomBytes } from '@noble/hashes/utils';
import Config from './curve.json';

export const FieldPrime = BigInt(Config.FieldPrime);

export const Curve = weierstrass({
	a: BigInt(Config.Alpha),
	b: BigInt(Config.Beta),
	Fp: Field(FieldPrime),
	n: BigInt(Config.ECOrder),
	Gx: BigInt(Config.Points[1][0]),
	Gy: BigInt(Config.Points[1][1]),
	h: BigInt(1),
	lowS: false,
	nBitLength: 252,
	hash: sha256,
	hmac: (key: Uint8Array, ...msgs: Uint8Array[]) => hmac(sha256, key, concatBytes(...msgs)),
	randomBytes
});

type ProjectivePoint = InstanceType<typeof Curve.ProjectivePoint>;

export const Points = Config.Points.map(
	([x, y]) => new Curve.ProjectivePoint(BigInt(x), BigInt(y), 1n)
);

function precompute(x: ProjectivePoint, y: ProjectivePoint) {
	const points = [];
	for (let i = 0, p = x; i < 248; i++, p = p.double()) points.push(p);
	for (let i = 0, p = y; i < 4; i++, p = p.double()) points.push(p);
	return points;
}

export const Precomputed = [precompute(Points[1], Points[2]), precompute(Points[3], Points[4])];
