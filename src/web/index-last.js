// https://arclanguage.github.io/rainbow-js/test/index-last.js

//   Copyright (c) 2011, 2021-2022 the Rainbow.js authors.
//   Licensed under the Perl Foundations's Artistic License 2.0.


"use strict";


// Replace the contents of this file with this to get a Closure
// Compiler result that's only 98 KB:

//Console_st.compileAndEvalAsync_( new VM().init(),
//    ArcParser_st.readFirstObjectFromString(
//        "((fn a a) ((fn a a) 4 3 2) 1)" ),
//    function ( e, r ) { alert( r ); }, !!"sync" );

// Replace it with this to get a 13 KB result:

//alert( ArcParser_st.readFirstObjectFromString( "((1 2 3) 4)" ) );

// TODO: The 98 KB bloat is probably because of the fact that the
// fields of the "classes" object are all calculated strings, which
// the Closure Compiler shies away from optimizing. See if there's a
// better way to catch its attention, like this perhaps:
//
// var If_bound_bound_literal.old_classes_If_of_ = classes_If_of;
// classes_If_of = function ( expr ) {
//    if ( expr.ifExpression instanceof BoundSymbol
//        && expr.thenExpression instanceof BoundSymbol
//        && expr.next instanceof Else && expr.next.literal() )
//        return If_bound_bound_literal.of;
//    else
//        return If_bound_bound_literal.old_classes_If_of_();
// };
//
// With any luck, it'll be able to inline every single one of these
// functions to create one function with a big ... ? ... : ... switch.

// TODO: Keep the above KB measurements up to date. :-p They're
// actually out of date already.


// Rainbow.js extensions (just the one for now, since it allows usage
// of window.eval)
ArcSymbol_st.make( "window" ).setValue(
    new JsObject().init( window ) );


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

handle( window, "hashchange", function () {
    location.reload( !"bust cache" );
} );

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
    
    function readStringAvailable( stream ) {
        if ( stream.readStringAvailable !== void 0 )
            return stream.readStringAvailable();
        
        var chars = [];
        var going = true;
        while ( going ) {
            if ( !stream.readCharCodeAsync( function ( e, c ) {
                    if ( e ) throw e;
                    if ( c === null )
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
    
    // NOTE: We could say '"noLibs: location.hash !== "#libs"' here,
    // except that that causes two failed HTTP requests and one
    // successful one for each library.
    Console_st.mainAsync( { "noLibs": true, "e": [
        "(assign load-from-web" +
        "  (fn ()" +
        "    ( (fn (eof f loop)" +
        "        (assign loop" +
        "          (fn ()" +
        "            ( (fn (command)" +
        "              (if (is command eof)" +
        "                (eval" +
        "                  '(do (load \"strings.arc\")" +
        "                       (load \"lib/bag-of-tricks.arc\")" +
        "                       (load \"rainbow/rainbow.arc\")" +
        "                       (load \"rainbow/rainbow-libs.arc\")" +
        "                       ))" +
        "                ( (fn ()" +
        "                  eval.command" +
        "                  (loop)" +
        "                ) ))" +
        "            ) (sread f eof))))" +
        "        (loop)" +
        "    ) (uniq) (infile \"arc.arc\") nil)))" ].concat(
            location.hash !== "#libs" ? [] : [ "(load-from-web)" ]
        )
// Here's the same code again, for copying and pasting into a REPL:
/*

(assign load-from-web
  (fn ()
    ( (fn (eof f loop)
        (assign loop
          (fn ()
            ( (fn (command)
              (if (is command eof)
                (eval
                  '(do (load "strings.arc")
                       (load "lib/bag-of-tricks.arc")
                       (load "rainbow/rainbow.arc")))
                ( (fn ()
                  eval.command
                  (loop)
                ) ))
            ) (sread f eof))))
        (loop)
    ) (uniq) (infile "arc.arc") nil)))

*/
    }, function () {} );
} );
