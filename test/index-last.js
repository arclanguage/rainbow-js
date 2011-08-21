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


function handle( el, eventName, handler ) {
    if ( el.addEventListener )
        el.addEventListener( eventName, handler, !"capture" );
    else  // IE
        el.attachEvent( "on" + eventName, handler );
}

function keyCode( event ) {
    return event.which ||
        event.keyCode;  // IE
}

function preventDefault( event ) {
    if ( event.preventDefault )
        event.preventDefault();
    else
        event.returnValue = false;  // IE
}

handle( window, "load", function () {
    
    var ENTER_KEY = 13;
    
    var repl = document.getElementById( "repl" );
    
    var scrollback = document.createElement( "pre" );
    scrollback.className = "scrollback";
    scrollback.appendChild( document.createTextNode( "" ) );
    repl.appendChild( scrollback );
    
    var prompt = document.createElement( "textarea" );
    prompt.className = "prompt";
    handle( prompt, "keydown", function ( event ) {
        if ( keyCode( event ) === ENTER_KEY )
            preventDefault( event );
    } );
    handle( prompt, "keyup", function ( event ) {
        if ( keyCode( event ) === ENTER_KEY )
            doEval();
    } );
    repl.appendChild( prompt );
    
    var evalButton = document.createElement( "button" );
    evalButton.className = "eval";
    evalButton.appendChild( document.createTextNode( "Eval" ) );
    handle( evalButton, "click", function ( event ) {
        doEval();
    } );
    repl.appendChild( evalButton );
    
    function doEval() {
        var command = prompt.value + "\n";
        prompt.value = "";
        consoleIn.o.writeString( command );
    }
    
    function readStringAvailable( stream, then ) {
        if ( stream.readStringAvailable !== void 0 )
            return stream.readStringAvailable();
        
        var chars = [];
        var going = true;
        while ( going ) {
            if ( !stream.readCharCodeAsync( function ( e, c ) {
                    if ( e ) throw e;
                    if ( c !== null )
                        going = false;
                    else
                        chars.push( String.fromCharCode( c ) );
                }, !!"sync" ) )
                going = false;
        }
        return chars.join( "" );
    }
    
    var goingToScroll = false;
    function pr( string ) {
        scrollback.appendChild(
            document.createTextNode( string ) );
        if ( !goingToScroll ) {
            goingToScroll = true;
            setTimeout( function () {
                goingToScroll = false;
                scrollback.scrollTop = scrollback.scrollHeight;
            }, 0 );
        }
    }
    
    function processConsoleIn( e, c ) {
        if ( e ) throw e;
        var string = readStringAvailable( consoleIn.i );
        if ( string === "" ) return;
        pr( string );
        rainbowStdin.o.writeString( string );
        consoleIn.i.peekCharCodeAsync( processConsoleIn );
    }
    consoleIn.i.peekCharCodeAsync( processConsoleIn );
    
    function processStdout( e, c ) {
        if ( e ) throw e;
        var string = readStringAvailable( rainbowStdout.i );
        if ( string === "" ) return;
        pr( string );
        rainbowStdout.i.peekCharCodeAsync( processStdout );
    }
    rainbowStdout.i.peekCharCodeAsync( processStdout );
    
    function processStderr( e, c ) {
        if ( e ) throw e;
        var string = readStringAvailable( rainbowStderr.i );
        if ( string === "" ) return;
        pr( string );
        rainbowStderr.i.peekCharCodeAsync( processStderr );
    }
    rainbowStderr.i.peekCharCodeAsync( processStderr );
    
    Console.mainAsync( {}, function () {} );
} );
