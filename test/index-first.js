// http://rocketnia.github.com/rainbow-js/test/index-last.js

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


// TODO: See what to do about concurrent reads. Right now we just
// always favor the latest read and never respond to the previous
// ones.
function makeInputAndOutput( name ) {
    var buffer = [];
    var cursor = 0;
    var closed = false;
    var callback = null, callbackMethod = null;
    
    function useCallback() {
        if ( callback === null )
            return;
        var then = callback, thenMethod = callbackMethod;
        callback = null, callbackMethod = null;
        thenMethod( then );
    }
    
    var output = {};
    output.writeString = function ( string ) {
        if ( closed ) return;
        if ( string === "" )
            return;
        buffer.push( { type: "string", val: string } );
        useCallback();
    };
    output.writeByte = function ( theByte ) {
        if ( closed ) return;
        buffer.push( { type: "byte", val: theByte } );
        useCallback();
    };
    output.close = function () {
        closed = true;
        useCallback();
    };
    output.flush = function () {};
    
    var input = {};
    var readByteAsync = input.readByteAsync = function (
        then, opt_sync ) {
        
        if ( buffer.length !== 0 ) {
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
            callback = then, callbackMethod = readByteAsync;
            return false;
        }
    };
    function peekOrReadCharCodeAsync(
        then, reading, method, opt_sync ) {
        
        if ( buffer.length !== 0 ) {
            
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
                    callback = then, callbackMethod = method;
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
                if ( bufferIndex )
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
            callback = then, callbackMethod = method;
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

var consoleIn = makeInputAndOutput( "consoleIn" );

var rainbowStdin = makeInputAndOutput( "rainbowStdin" );
var rainbowStdout = makeInputAndOutput( "rainbowStdout" );
var rainbowStderr = makeInputAndOutput( "rainbowStderr" );

var System_in = rainbowStdin.i;
var System_out = rainbowStdout.o;
var System_err = rainbowStderr.o;
