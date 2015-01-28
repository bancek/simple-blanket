#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var blanket = require('blanket');

var argv = require('minimist')(process.argv.slice(2));

var inputFile = argv._[0];
var outputFile = argv.o;

if (!inputFile) {
    console.log('Usage: simple-blanket OPTIONS <file>\n' +
        '\n' +
        'Options:\n' +
        '  -o        write output to <file>. output is written to stdout by default');

    process.exit(1);
}

var data = fs.readFileSync(inputFile);

var blkt = blanket({
    'data-cover-customVariable': '_$jscoverage',
    'data-cover-flags': {
        extensions: ['.js']
    },
    'data-cover-only': '*'
});

blkt.restoreBlanketLoader();

blkt.instrument({
    inputFile: data.toString('utf-8'),
    inputFileName: path.basename(inputFile)
}, function (instrumented) {
    if (outputFile) {
        fs.writeFileSync(outputFile, instrumented);
    } else {
        process.stdout.write(instrumented);
    }
});
