// Copyright (c) 2012 Ross Angle
//
// This software is derived from Rainbow, software which is
// copyright (c) 2011 Conan Dalton, distributed under the
// Perl Foundation's Artistic License 2.0. In the sense described in
// section (4)(c)(i) of that document, using its own terminology,
// permission to use this "Modified Version" is granted under the
// "Original License."
//
// This software may also be derived from Arc, software which is
// copyright (c) Paul Graham and Robert Morris, distributed under the
// Perl Foundation's Artistic License 2.0. In the sense described in
// section (4)(b) of that document, using its own terminology, this
// "Modified Version" bears a name that is different from any name
// used for Arc.

var fs = require( "fs" );
fs.writeFileSync( "./bin/rainbow-node.js",
    "exports.makeRainbow = function (\n" +
    "    System_in, System_out, System_err, System_fs ) {\n" +
    "\n" +
    fs.readFileSync( "../rainbow.js", "utf8" ) +
    "\n" +
    "return Console;\n" +
    "\n" +
    "};\n" +
    "\n" +
    fs.readFileSync( "./rainbow-node-src.js", "utf8" ) );
