'use strict';

var through = require('through2');
var fs = require('fs');
var path = require('path');
var minify = require('html-minifier').minify;
var async = require('async');

var collectTplRegex = /templateUrl: ['"](.*)['"][\n},]/g;
var matchTplUrlRefex = /templateUrl: ['"](.*)['"][\n},]/;

function collectTemplates(src) {
	return src.match(collectTplRegex);
}

function readTemplate(cwd, tplFilename, next) {
	let filename = path.join(cwd, tplFilename);

	fs.readFile(filename, (err, tplBuf) => {
		if (err) {
			return next(err);
		}

		let tplSrc = tplBuf.toString('utf8');
		next(null, tplSrc);
	});
}

function extractTemplateUrl(template) {
	return template.match(matchTplUrlRefex)[1];
}

module.exports = function(file) {
	return through(function(buf, enc, next) {
		let src = buf.toString('utf8');
		let cwd = path.dirname(file);

		let templates = collectTemplates(src);
		async.eachSeries(templates, (template, cb) => {
			let templateUrl = extractTemplateUrl(template);

			readTemplate(cwd, templateUrl, (err, tplSrc) => {
				if (err) {
					return cb(err);
				}

				let minifiedTplSrc = minify(tplSrc, {
					collapseWhitespace: true,
					conservativeCollapse: true,
					quoteCharacter: '"'
				}).replace(/[\\$'"]/g, '\\$&');

				let tranformedTpl = template.replace(templateUrl, minifiedTplSrc);
				tranformedTpl = tranformedTpl.replace('templateUrl', 'template');

				src = src.replace(template, tranformedTpl);
				cb();
			});
		}, (err) => {
			if (err) {
				return next(err);
			}

			this.push(src);
			next();
		});
	});
};
