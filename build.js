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
var util = require( "util" );
var $path = require( "path" );

var missingLibs = [];
// Turns out wrench wasn't useful here after all, since I'd rather
// have a recursive copy that works on individual files and leaves
// unrelated target directory contents alone. This is cpOver, below.
//
//try { var wrench = require( "wrench" ); } catch ( e ) {
//    missingLibs.push( { name: "wrench.js", npm: "wrench",
//        uri: "https://github.com/ryanmcgrath/wrench-js" } );
//}
if ( missingLibs.length !== 0 ) {
    process.stderr.write(
        "You need the following Node.js libraries to build " +
            "Rainbow.js:\n" +
        "\n" +
        missingLibs.map( function ( lib ) {
            return lib.name + "  (\"npm install " + lib.npm + "\" " +
                "or see <" + lib.uri + ">)";
        } ).join( "\n" ) );
    process.exit( 1 );
}

function stat( path, then ) {
    $path.exists( path, function ( exists ) {
        if ( !exists ) return void then( null, null );
        fs.stat( path, then );
    } );
}

function ensureDir( path, then ) {
    stat( path, function ( e, stat ) {
        if ( e ) return void then( e );
        if ( stat === null ) return void fs.mkdir( path, then );
        if ( stat.isDirectory() ) return void then();
        then( new Error(
            "Can't ensureDir a non-dir file: " + path ) );
    } );
}

function eachAsync( xs, body, then ) {
    var n = xs.length;
    loop( 0 );
    function loop( i ) {
        if ( i === n )
            return void then();
        var x = xs[ i ];
        body( x, function ( e ) {
            if ( e ) return void then( e );
            loop( i + 1 );
        } );
    }
}

function rm( path, then ) {
    stat( path, function ( e, stat ) {
        if ( e ) return void then( e );
        if ( stat === null ) return then();
        fs.unlink( path, then );
    } );
}

function cpOver( from, to, then ) {
    stat( from, function ( e, stat ) {
        if ( e ) return void then( e );
        if ( stat === null ) return void then();
        if ( stat.isDirectory() )
            fs.readdir( from, function ( e, files ) {
                if ( e ) return void then( e );
                ensureDir( to, function ( e ) {
                    if ( e ) return void then( e );
                    eachAsync( files, function ( file, then ) {
                        cpOver( from + "/" + file, to + "/" + file,
                            then );
                    }, then );
                } );
            } );
        else
            rm( to, function ( e ) {
                var fromStream = fs.createReadStream( from );
                var toStream = fs.createWriteStream( to );
                fromStream.once( "open", function ( e ) {
                    util.pump( fromStream, toStream, then );
                } );
            } );
    } );
}


ensureDir( "bin", function ( e ) {
    if ( e ) throw e;
cpOver( "src/arc", "bin/node", function ( e ) {
    if ( e ) throw e;
cpOver( "src/arc", "test", function ( e ) {
    if ( e ) throw e;
cpOver( "src/web/index.html", "test/index.html", function ( e ) {
    if ( e ) throw e;
fs.writeFileSync( "bin/node/rainbow-node.js",
    "exports.makeRainbow = function (\n" +
    "    System_in, System_out, System_err, System_fs ) {\n" +
    "\n" +
    fs.readFileSync( "src/rainbow.js", "utf8" ) +
    "\n" +
    "return Console_st;\n" +
    "\n" +
    "};\n" +
    "\n" +
    fs.readFileSync( "src/node/rainbow-node-src.js", "utf8" ) );
} );
} );
} );
} );
