// http://rocketnia.github.com/rainbow-js/test/index-first.js

// Copyright (c) 2011 Ross Angle
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


"use strict";


function makeInputAndOutput( name ) {
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

function handle( el, eventName, handler ) {
    if ( el.addEventListener )
        el.addEventListener( eventName, handler, !"capture" );
    else  // IE
        el.attachEvent( "on" + eventName, handler );
}

var consoleIn = makeInputAndOutput( "consoleIn" );

var rainbowStdin = makeInputAndOutput( "rainbowStdin" );
var rainbowStdout = makeInputAndOutput( "rainbowStdout" );
var rainbowStderr = makeInputAndOutput( "rainbowStderr" );

var System_in = rainbowStdin.i;
var System_out = rainbowStdout.o;
var System_err = rainbowStderr.o;

var System_fs = {
    dirAsync: function ( path, then, opt_sync ) {
        then( new ArcError().initAE( "No filesystem." ) );
        return true;
    },
    dirExistsAsync: function ( path, then, opt_sync ) {
        then( null, false );
        return true;
    },
    fileExistsAsync: function ( path, then, opt_sync ) {
        if ( opt_sync )
            return then( new ArcError().initAE(
                "Can't access the Web synchronously." ) ), true;
        var req = new XMLHttpRequest();
        
        req.open( "GET", path, !!"async" );
        // TODO: See if this helps support support cross-origin
        // loading. Note that Opera hits the "no AJAX" case, so we
        // might want to fall back to the above anyway.
//        if ( "withCredentials" in req ) {
//            req.open( "GET", path, !!"async" );
//        } else if ( "XDomainRequest" in window ) {
//            req = new XDomainRequest();
//            req.open( "GET", path );
//        } else {
//            then( null, false );
//            return true;
//        }
        
        // NOTE: We're not using handle() because Opera doesn't
        // support addEventListener() or attachEvent() on
        // XMLHttpRequest.
        req.onerror = function () {
            then( null, false );
        };
        req.onload = function () {
            then( null, true );
        };
        
        req.send( null );
        return false;
    },
    inFileAsync: function ( path, then, opt_sync ) {
        if ( opt_sync )
            return then( new ArcError().initAE(
                "Can't access the Web synchronously." ) ), true;
        var req = new XMLHttpRequest();
        
        req.open( "GET", path, !!"async" );
        // TODO: See if this helps support support cross-origin
        // loading. Note that Opera hits the "no AJAX" case, so we
        // might want to fall back to the above anyway.
//        if ( "withCredentials" in req ) {
//            req.open( "GET", path, !!"async" );
//        } else if ( "XDomainRequest" in window ) {
//            req = new XDomainRequest();
//            req.open( "GET", path );
//        } else {
//            then( new ArcError().initAE( "No AJAX." ) );
//            return true;
//        }
        
        // NOTE: We're not using handle() because Opera doesn't
        // support addEventListener() or attachEvent() on
        // XMLHttpRequest.
        req.onerror = function () {
            then( new ArcError().initAE(
                "Couldn't open page: " + path + " because of " +
                "error: " + req.statusText ) );
        };
        req.onload = function () {
            then( null, new StringInputPort().init(
                req.responseText ).unwrap() );
        };
        
        req.send( null );
        return false;
    },
    outFileAsync: function ( path, append, then, opt_sync ) {
        then( new ArcError().initAE( "No filesystem." ) );
        return true;
    },
    makeDirectoryAsync: function ( path, then, opt_sync ) {
        then( new ArcError().initAE( "No filesystem." ) );
        return true;
    },
    makeDirectoriesAsync: function ( path, then, opt_sync ) {
        then( new ArcError().initAE( "No filesystem." ) );
        return true;
    },
    mvFileAsync: function ( fromPath, toPath, then, opt_sync ) {
        then( new ArcError().initAE( "No filesystem." ) );
        return true;
    },
    rmFileAsync: function ( path, then, opt_sync ) {
        then( new ArcError().initAE( "No filesystem." ) );
        return true;
    }
};
