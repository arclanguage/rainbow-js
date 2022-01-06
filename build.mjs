//   Copyright (c) 2012, 2021-2022 the Rainbow.js authors.
//   Licensed under the Perl Foundations's Artistic License 2.0.

import fs from "fs-extra";


await fs.ensureDir( "dist/gh-pages" );
await fs.copy( "src/arc", "dist/gh-pages/test" );
await fs.copy(
    "src/web/index.html", "dist/gh-pages/test/index.html" );


await fs.outputFile( "dist/node/rainbow-node.js",

`#!/usr/bin/env node
"use strict";

exports.makeRainbow = function (
    System_in, System_out, System_err, System_getenvAsync0,
    System_getenvAsync1, System_exitAsync, System_fs ) {

${await fs.readFile( "src/rainbow.js", "utf8" )}
return Console_st;

};

${await fs.readFile( "src/node/rainbow-node-src.js", "utf8" )}`

);
