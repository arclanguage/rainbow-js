//   Copyright (c) 2012, 2021-2022 the Rainbow.js authors.
//   Licensed under the Perl Foundations's Artistic License 2.0.

var fs = require( "fs" );


// This file is concatenated to some other text in build.mjs, which
// provides this extra export:
//
//   exports.makeRainbow = function (
//       System_in, System_out, System_err, System_getenvAsync0,
//       System_getenvAsync1, System_exitAsync, System_fs ) {
//   
//   [contents of rainbow.js]
//   
//   return Console_st;
//   
//   };



function makeInputAndOutput( name ) {
//    console.log( "opened " + name );
    var buffer = [];
    var cursor = 0;
    var closed = false;
    var callbacks = [], callbackMethods = [];
    
    function useCallbacks() {
        if ( callbacks.length === 0 )
            return;
        var callback = callbacks.shift();
        var callbackMethod = callbackMethods.shift();
        setTimeout( function () {
            callbackMethod( callback );
        }, 0 );
        setTimeout( useCallbacks, 0 );
    }
    
    var output = {};
    output.writeString = function ( string ) {
//        console.log( "wrote  " + name + " " + JSON.stringify( string.substr( string.length - 20 ) ) );
        if ( closed ) return;
        if ( string === "" )
            return;
        buffer.push( { type: "string", val: string } );
        useCallbacks();
    };
    output.writeByte = function ( theByte ) {
        if ( closed ) return;
        buffer.push( { type: "byte", val: theByte } );
        useCallbacks();
    };
    output.close = function () {
//        console.log( "closed " + name );
        closed = true;
        useCallbacks();
    };
    output.flush = function () {};
    
    var input = {};
    var readByteAsync = input.readByteAsync = function (
        then, opt_sync ) {
        
        if ( buffer.length !== 0 && callbacks.length === 0 ) {
            var entry = buffer[ 0 ];
            if ( entry.type === "byte" ) {
                buffer.shift();
                then( null, entry.val );
                return true;
            } else {
                var string = entry.val;
                var code = string.charCodeAt( cursor >>> 1 );
                var b = (cursor & 1 ? code : code >>> 8) & 0xFF;
                cursor++;
                if ( string.length << 1 <= cursor ) {
                    buffer.shift();
                    cursor = 0;
                }
                then( null, b );
                return true;
            }
        } else if ( closed ) {
            then( null, null );
            return true;
        } else if ( opt_sync ) {
            return false;
        } else {
            callbacks.push( then );
            callbackMethods.push( readByteAsync );
            return false;
        }
    };
    function peekOrReadCharCodeAsync(
        then, reading, method, opt_sync ) {
        
        if ( buffer.length !== 0 && callbacks.length === 0 ) {
            
            var firstEntry = buffer[ 0 ];
            if ( buffer.length === 1 && (firstEntry.type === "byte"
                || firstEntry.val.length << 1 === cursor + 1) ) {
                if ( closed ) {
                    // TODO: Figure out what to really do in this
                    // case. There's just one byte left in the stream,
                    // but we're reading or peeking at a character
                    // code....
                    if ( reading )
                        buffer = [];
                    then( null, null );
                    return true;
                } else if ( opt_sync ) {
                    return false;
                } else {
                    callbacks.push( then );
                    callbackMethods.push( method );
                    return false;
                }
            }
            
            var hi;
            var lo;
            var bufferIndex = 0;
            var tempCursor = cursor;
            var entry = firstEntry;
            if ( entry.type === "byte" ) {
                bufferIndex++;
                hi = entry.val;
            } else {
                var string = entry.val;
                var code = string.charCodeAt( tempCursor >>> 1 );
                if ( tempCursor & 1 ) {
                    if ( reading ) {
                        cursor++;
                        if ( string.length << 1 <= cursor ) {
                            buffer.shift();
                            cursor = 0;
                        }
                    }
                    then( null, code );
                    return true;
                }
                hi = (code >>> 8) & 0xFF;
                tempCursor++;
                if ( string.length << 1 <= tempCursor ) {
                    bufferIndex++;
                    tempCursor = 0;
                }
            }
            entry = buffer[ bufferIndex ];
            if ( entry.type === "byte" ) {
                bufferIndex++;
                lo = entry.val;
            } else {
                var string = entry.val;
                var code = string.charCodeAt( tempCursor >>> 1 );
                lo = (tempCursor & 1 ? code : code >>> 8) & 0xFF;
                tempCursor++;
                if ( string.length << 1 <= tempCursor ) {
                    bufferIndex++;
                    tempCursor = 0;
                }
            }
            if ( reading ) {
                while ( bufferIndex-- )
                    buffer.shift();
                cursor = tempCursor;
            }
            then( null, hi << 8 | lo );
            return true;
        } else if ( closed ) {
            then( null, null );
            return true;
        } else if ( opt_sync ) {
            return false;
        } else {
            callbacks.push( then ), callbackMethods.push( method );
            return false;
        }
    }
    var readCharCodeAsync = input.readCharCodeAsync = function (
        then, opt_sync ) {
        
        return peekOrReadCharCodeAsync(
            then, !!"reading", readCharCodeAsync, opt_sync );
    };
    var peekCharCodeAsync = input.peekCharCodeAsync = function (
        then, opt_sync ) {
        
        return peekOrReadCharCodeAsync(
            then, !"reading", peekCharCodeAsync, opt_sync );
    };
    input.close = function () {};
    
    input.readStringAvailable = function () {
        var len = buffer.length;
        var bufferIndex = 0;
        var hasLeftover = false;
        var leftoverByte;
        var parts = [];
        var i = 0;
        if ( cursor & 1 ) {
            var string = buffer[ 0 ].val;
            hasLeftover = true;
            leftoverByte = string.charCodeAt( cursor >>> 1 ) & 0xFF;
            cursor++;
            for ( var j = cursor >>> 1, slen = string.length;
                j < slen; j++ ) {
                var code = string.charCodeAt( j );
                parts.push( String.fromCharCode(
                    leftoverByte << 8 | (code >>> 8 & 0xFF)
                ) );
                leftoverByte = code & 0xFF;
            }
            cursor = 0;
            i++;
        } else if ( cursor ) {
            parts.push( buffer[ 0 ].val.substring( cursor >>> 1 ) );
            cursor = 0;
            i++;
        }
        for ( len = buffer.length; i < len; i++ ) {
            var entry = buffer[ i ];
            if ( entry.type === "byte" ) {
                if ( hasLeftover ) {
                    parts.push( String.fromCharCode(
                        leftoverByte << 8 | entry.val ) );
                    hasLeftover = false;
                } else {
                    leftoverByte = entry.val;
                    hasLeftover = true;
                }
            } else {
                var string = entry.val;
                if ( hasLeftover ) {
                    for ( var j = 0, slen = string.length;
                        j < slen; j++ ) {
                        var code = string.charCodeAt( j );
                        parts.push( String.fromCharCode(
                            leftoverByte << 8 | (code >>> 8 & 0xFF)
                        ) );
                        leftoverByte = code & 0xFF;
                    }
                } else {
                    parts.push( string );
                }
            }
        }
        buffer = hasLeftover ?
            [ { type: "byte", val: leftoverByte } ] : [];
        return parts.join( "" );
    };
    
    return { i: input, o: output };
}


// TODO: Figure out why this sometimes stops reading a file partway
// through (almost always right at the end), hangs for a while, and
// then causes an out of memory eror. It breaks loading libraries.
function nodeInToRainbowIn( name, nodeIn, close ) {
//    console.log( "opened " + name );
    var io = makeInputAndOutput( "ReadableStream " + name );
    nodeIn.on( "end", function () {
//    console.log( "ended  " + name );
        io.o.close();
    } );
    nodeIn.on( "close", function () {
//    console.log( "CLOSED " + name );
    } );
    nodeIn.on( "data", function ( data ) {
        if ( data instanceof Buffer ) {
//    console.log( "binary " + name );
            for ( var i = 0, n = data.length; i < n; i++ )
                io.o.writeByte( data[ i ] );
        } else {
//    console.log( "string " + name + " " + JSON.stringify( data.substr( Math.max( 0, data.length - 20 ) ) ) );
            io.o.writeString( data );
        }
    } );
    nodeIn.resume();
    return {
        readByteAsync: function ( then, opt_sync ) {
            return io.i.readByteAsync( then, opt_sync );
        },
        readCharCodeAsync: function ( then, opt_sync ) {
            return io.i.readCharCodeAsync( then, opt_sync );
        },
        peekCharCodeAsync: function ( then, opt_sync ) {
            return io.i.peekCharCodeAsync( then, opt_sync );
        },
        close: close
    };
}

function nodeOutToRainbowOut( getNodeOut, closeable ) {
    return {
        writeString: function ( string ) {
            getNodeOut().write( string );
        },
        writeByte: function ( theByte ) {
            getNodeOut().write( new Buffer( [ theByte ] ) );
        },
        close: function () {
            if ( closeable )
                getNodeOut().end();
        },
        flush: function () {}
    }
}


exports.makeNodeRainbow = function ( stdin, getStdout, getStderr ) {
    
    // TODO: Figure out a more appropriate place to set the encoding.
    stdin.setEncoding( "utf8" );
    
    return exports.makeRainbow(
        nodeInToRainbowIn( "stdin", stdin, function () {} ),
        nodeOutToRainbowOut( function () {
            return getStdout();
        }, !"closeable" ),
        nodeOutToRainbowOut( function () {
            return getStderr();
        }, !"closeable" ),
        
        // System_getenvAsync0
        function ( then, opt_sync ) {
            // TODO: See if we need to copy the object like this.
            then( null, Object.assign( {}, process.env ) );
            return true;
        },
        
        // System_getenvAsync1
        function ( name, then, opt_sync ) {
            var nodeEnv = process.env;
            var result = null;
            if ( Object.prototype.hasOwnProperty.call(
                nodeEnv, name ) )
                result = nodeEnv[ name ];
            then( null, result );
            return true;
        },
        
        // System_exitAsync
        function ( exitCode, then, opt_sync ) {
            process.exit( exitCode );
            then( null );
            return true;
        },
        
        // filesystem
        {
            dirAsync: function ( path, then, opt_sync ) {
                function toArc( files ) {
                    return rainbow.list( files.map( function ( it ) {
                        return rainbow.string( it );
                    } ) );
                }
                if ( opt_sync ) {
                    then( null, toArc( fs.readdirSync( path ) ) );
                    return true;
                } else {
                    fs.readdir( path, function ( e, files ) {
                        if ( e ) return void then( e );
                        then( null, toArc( files ) );
                    } );
                    return false;
                }
            },
            dirExistsAsync: function ( path, then, opt_sync ) {
                if ( opt_sync ) {
                    then( null, fs.existsSync( p ) &&
                        fs.statSync( path ).isDirectory() );
                    return true;
                } else {
                    fs.exists( path, function ( exists ) {
                        // TODO: Figure out if there's any
                        // error propagation we need to do here.
//                        if ( e ) return void then( e );
                        if ( !exists )
                            return void then( null, false );
                        fs.stat( path, function ( e, stats ) {
                            if ( e ) return void then( e );
                            then( null, stats.isDirectory() );
                        } );
                    } );
                    return false;
                }
            },
            fileExistsAsync: function ( path, then, opt_sync ) {
                if ( opt_sync ) {
                    then( null, fs.existsSync( p ) &&
                        fs.statSync( path ).isFile() );
                    return true;
                } else {
                    fs.exists( path, function ( exists ) {
                        // TODO: Figure out if there's any
                        // error propagation we need to do here.
//                        if ( e ) return void then( e );
                        if ( !exists )
                            return void then( null, false );
                        fs.stat( path, function ( e, stats ) {
                            if ( e ) return void then( e );
                            then( null, stats.isFile() );
                        } );
                    } );
                    return false;
                }
            },
            inFileAsync: function ( path, then, opt_sync ) {
                // TODO: See if there's a synchronous way to do this.
                if ( opt_sync )
                    return false;
                // TODO: See if we'd get a cleaner interface by
                // skipping the Node readable stream.
                var stream = fs.createReadStream( path );
                // TODO: See if we really want to do this. What
                // happpens to binary operations? What should we do
                // with non-UTF-8 files?
                stream.setEncoding( "utf8" );
                function onError( e ) {
                    stream.removeListener( "error", onError );
                    stream.removeListener( "open", onOpen );
                    then( e );
                }
                function onOpen( fd ) {
                    stream.removeListener( "error", onError );
                    stream.removeListener( "open", onOpen );
                    then( null, nodeInToRainbowIn( path, stream,
                        function () {
                        
                        // TODO: Both of these seem to cause the
                        // process to terminate, consistently. Do
                        // something that actually works instead.
//                        fs.closeSync( fd );
//                        fs.close( fd, function ( e ) {} );
                    } ) );
                }
                stream.on( "error", onError );
                stream.on( "open", onOpen );
                return false;
            },
            outFileAsync: function ( path, append, then, opt_sync ) {
                // TODO: See if there's a synchronous way to do this.
                if ( opt_sync )
                    return false;
                // TODO: See if we'd get a cleaner interface by
                // skipping the Node writable stream.
                var stream = fs.createWriteStream( path,
                    { flags: append ? "a" : "w" } );
                function onError( e ) {
                    stream.removeListener( "error", onError );
                    stream.removeListener( "open", onOpen );
                    then( e );
                }
                function onOpen( fd ) {
                    stream.removeListener( "error", onError );
                    stream.removeListener( "open", onOpen );
                    then( null, nodeOutToRainbowOut( function () {
                      return stream;
                    } ) );
                }
                stream.on( "error", onError );
                stream.on( "open", onOpen );
                return false;
            },
            makeDirectoryAsync: function ( path, then, opt_sync ) {
                if ( opt_sync ) {
                    fs.mkdirSync( path );
                    then( null, true );
                    return true;
                } else {
                    fs.mkdir( path, function ( e ) {
                        if ( e ) return void then( e );
                        then( null, true );
                    } );
                    return false;
                }
            },
            makeDirectoriesAsync: function ( path, then, opt_sync ) {
                // TODO: Implement this.
                then(
                    new ArcError().initAE( "No make-directory*." ) );
                return true;
            },
            mvFileAsync: function (
                fromPath, toPath, then, opt_sync ) {
                
                if ( opt_sync ) {
                    fs.renameSync( fromPath, toPath );
                    then( null );
                    return true;
                } else {
                    fs.rename( fromPath, toPath, function ( e ) {
                        if ( e ) return void then( e );
                        then( null );
                    } );
                    return false;
                }
            },
            rmFileAsync: function ( path, then, opt_sync ) {
                if ( opt_sync ) {
                    fs.unlinkSync( path );
                    then( null );
                    return true;
                } else {
                    fs.unlink( path, function ( e ) {
                        if ( e ) return void then( e );
                        then( null );
                    } );
                    return false;
                }
            }
        }
    );
};

var sharedRainbow = null;
exports.getSharedRainbow = function () {
    return sharedRainbow || (sharedRainbow = exports.makeNodeRainbow(
        process.stdin, function () { return process.stdout; },
        function () { return process.stderr; } ));
};

if ( require.main === module )
    exports.getSharedRainbow().mainCliAsync( process.argv.slice( 2 ),
        function ( e ) {
        
        if ( e ) {
            // TODO: See if we ever get here. We at least get to this
            // callback when we exit the REPL using Ctrl+D or when we
            // use the `--help` or `-q` option, but we haven't gotten
            // here with an error yet.
            console.log( e );
            process.exit( 1 );
            return;
        }
        
        process.exit();
    } );
