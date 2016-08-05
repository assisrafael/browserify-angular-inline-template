'use strict';

import test from 'ava';
import browserify from 'browserify';
import fs from 'fs';

var b = browserify();
b.add('../test/ng-component.js');
b.transform(require('./inline-template'));

test.cb(t => {
	b.bundle((err, buf) => {
		t.ifError(err, 'não deveria');
		let src = buf.toString();

		fs.readFile('../test/expected-output.js', (err, tBuf) => {
			let tSrc = tBuf.toString();
			t.is(src, tSrc);
			t.end();
		});
	});
});
