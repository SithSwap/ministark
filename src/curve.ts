import { sha256 } from '@noble/hashes/sha256';
import { hmac } from '@noble/hashes/hmac';

import { weierstrass } from '@noble/curves/abstract/weierstrass';
import { Field } from '@noble/curves/abstract/modular';

import { concatBytes, randomBytes } from '@noble/hashes/utils';
import * as Config from './config';

export const FieldPrime = Config.FieldPrime;

export const Curve = weierstrass({
	a: Config.Alpha,
	b: Config.Beta,
	Fp: Field(FieldPrime),
	n: Config.ECOrder,
	Gx: Config.Points[1][0],
	Gy: Config.Points[1][1],
	h: 1n,
	lowS: false,
	nBitLength: 252,
	hash: sha256,
	hmac: (key: Uint8Array, ...msgs: Uint8Array[]) => hmac(sha256, key, concatBytes(...msgs)),
	randomBytes
});

type ProjectivePoint = InstanceType<typeof Curve.ProjectivePoint>;

export const Points = Config.Points.map(([x, y]) => new Curve.ProjectivePoint(x, y, 1n));

function precompute(x: ProjectivePoint, y: ProjectivePoint) {
	const points = [];
	for (let i = 0, p = x; i < 248; i++, p = p.double()) points.push(p);
	for (let i = 0, p = y; i < 4; i++, p = p.double()) points.push(p);
	return points;
}

export const Precomputed = [precompute(Points[1], Points[2]), precompute(Points[3], Points[4])];
