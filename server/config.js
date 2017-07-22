'use strict';

var braintree = require('braintree');

module.exports = {
	app: {
		title: 'ACME.codes - Animated Codes Made Easy',
		description: 'Animate your scan codes, add your corporate identity, make your code beautiful.',
		keywords: 'animated, QR, code, scan, scannable, generator'
	},
	port: process.env.PORT || 3000,
	apiDomain: 'https://api.acme.codes',
//	apiDomain: 'http://pcmiller.api.acme.codes',
	braintree: {
		environment: braintree.Environment.Sandbox,
		merchantId: 'bzj2z7nnqwprrjdx',
		publicKey: 'xgvc6n8p7wdk2z97',
		privateKey: 'd3879a4a76d4698a77bdd62d4cc3b5c1'
	}
	/*	braintree: {
		environment: braintree.Environment.Production,
		merchantId: 'sj7nk48nfhqkgnhz',
		publicKey: 'yjp76bjbg28f48fn',
		privateKey: '8124e786dc093db42a20b78b556b4a4a'
	},
*/


};
