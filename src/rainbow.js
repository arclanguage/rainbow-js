// rainbow.js
//
// A port of Rainbow to JavaScript.

// Copyright (c) 2011, 2012 Ross Angle
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

// To load this file, the variables System_in, System_out, System_err,
// and System_fs must already be defined. Here's an example
// implementation where stdin is always at EOF, stdout and stderr are
// noops, and filesystem operations never work:

//var System_in = {
//    readByteAsync: function ( then, opt_sync ) {
//        then( null, null );
//        return true;
//    },
//    readCharCodeAsync: function ( then, opt_sync ) {
//        then( null, null );
//        return true;
//    },
//    peekCharCodeAsync: function ( then, opt_sync ) {
//        then( null, null );
//        return true;
//    },
//    close: function () {}
//};
//var System_out = {
//    writeString: function ( string ) {},
//    writeByte: function ( theByte ) {},
//    close: function () {},
//    flush: function () {}
//};
//var System_err = {
//    writeString: function ( string ) {},
//    writeByte: function ( theByte ) {},
//    close: function () {},
//    flush: function () {}
//};
//var System_fs = {
//    dirAsync: function ( path, then, opt_sync ) {
//        then( new ArcError( "No filesystem." ) );
//        // This would have done then( null, arcListOfDirs ) on
//        // success.
//        return true;
//    },
//    dirExistsAsync: function ( path, then, opt_sync ) {
//        then( null, false );
//        return true;
//    },
//    fileExistsAsync: function ( path, then, opt_sync ) {
//        then( null, false );
//        return true;
//    },
//    inFileAsync: function ( path, then, opt_sync ) {
//        then( new ArcError( "No filesystem." ) );
//        // This would have done then( null, inputStream ) on
//        // success, where inputStream is like stdin.
//        return true;
//    },
//    outFileAsync: function ( path, append, then, opt_sync ) {
//        then( new ArcError( "No filesystem." ) );
//        // This would have done then( null, outputStream ) on
//        // success, where outputStream is like stdout.
//        return true;
//    },
//    makeDirectoryAsync: function ( path, then, opt_sync ) {
//        then( new ArcError( "No filesystem." ) );
//        // This would have done then( null, true ) on success,
//        // then( null, false ) on noncritical failure(?), had an
//        // error if the file already existed and wasn't a directory,
//        // or had an error on critical failure(?). These
//        // critical/noncritical failures were determined by
//        // java.io.File.mkdir() in the original.
//        return true;
//    },
//    makeDirectoriesAsync: function ( path, then, opt_sync ) {
//        then( new ArcError( "No filesystem." ) );
//        // This would have done then( null, true ) on success,
//        // then( null, false ) on noncritical failure(?), had an
//        // error if the file already existed and wasn't a directory,
//        // or had an error on critical failure(?). These
//        // critical/noncritical failures were determined by
//        // java.io.File.mkdirs() in the original, and they are
//        // to be only partial failures, whereby some but not all of
//        // the directories have been created.
//        return true;
//    },
//    mvFileAsync: function ( fromPath, toPath, then, opt_sync ) {
//        then( new ArcError( "No filesystem." ) );
//        // This would have done then( null ) on success.
//        return true;
//    },
//    rmFileAsync: function ( path, then, opt_sync ) {
//        then( new ArcError( "No filesystem." ) );
//        // This would have done then( null ) on success.
//        return true;
//    }
//};

// TODO: Actually document these stream interfaces.


// Tackled so far:
//
// ArcError.java
// LexicalClosure.java
// parser/ParseException.java
// types/*
//   types/ArcObject.java
// ../../cc/*
//   ../../cc/ArcParser.jj
//   ../../cc/ComplexParser.jj (no code needed)
//   types/Symbol.java
//   types/Pair.java
// Nil.java
// Truth.java
// vm/*
//   vm/Instruction.java
//   types/LiteralObject.java
//   types/ArcCharacter.java
//   types/ArcString.java
//   types/ArcException.java
//   types/ArcNumber.java
//   types/ArcThreadLocal.java
//   types/Complex.java
//   types/Rational.java
//   types/Real.java
//   types/Tagged.java
//   types/JavaObject.java (as JsObject)
//   types/Hash.java
//   vm/VM.java
//   vm/instructions/ListBuilder.java
//   vm/instructions/Append.java
//   vm/instructions/AppendAll.java
//   vm/instructions/AppendDot.java
//   vm/instructions/Catch.java
//   vm/instructions/Close.java (as Close_Instruction)
//   vm/instructions/Finally.java (no code needed)
//   vm/instructions/FinallyInvoke.java
//   vm/instructions/FinishList.java
//   vm/instructions/FreeSym.java
//   vm/instructions/LexSym.java
//   vm/instructions/Listify.java
//   vm/instructions/Literal.java
//   vm/instructions/NewList.java
//   vm/instructions/OnError.java (no code needed)
//   vm/instructions/PopArg.java
//   vm/instructions/SetThreadLocal.java
//   vm/instructions/StackSym.java
//   vm/instructions/TableMapper.java
//   vm/instructions/assign/bound/Assign_Lex.java
//   vm/instructions/assign/bound/Assign_Lex_Free.java
//   vm/instructions/assign/bound/Assign_Lex_Lex.java
//   vm/instructions/assign/bound/Assign_Lex_Literal.java
//   vm/instructions/assign/bound/Assign_Lex_Other.java
//   vm/instructions/assign/bound/Assign_Lex_Stack.java
//   vm/instructions/assign/free/Assign_Free.java
//   vm/instructions/assign/free/Assign_Free_Free.java
//   vm/instructions/assign/free/Assign_Free_Lex.java
//   vm/instructions/assign/free/Assign_Free_Literal.java
//   vm/instructions/assign/free/Assign_Free_Other.java
//   vm/instructions/assign/free/Assign_Free_Stack.java
//   vm/instructions/assign/stack/Assign_Stack.java
//   vm/instructions/assign/stack/Assign_Stack_Free.java
//   vm/instructions/assign/stack/Assign_Stack_Lex.java
//   vm/instructions/assign/stack/Assign_Stack_Literal.java
//   vm/instructions/assign/stack/Assign_Stack_Other.java
//   vm/instructions/assign/stack/Assign_Stack_Stack.java
//   vm/instructions/cond/Cond.java
//   vm/instructions/cond/optimise/If_bound_bound_literal.java
//   vm/instructions/cond/optimise/If_bound_bound_other.java
//   vm/instructions/cond/optimise/If_bound_literal_literal.java
//   vm/instructions/cond/optimise/If_bound_other_literal.java
//   vm/instructions/cond/optimise/If_bound_other_other.java
//   vm/instructions/cond/optimise/If_other_bound_other.java
//   vm/instructions/cond/optimise/If_other_other_literal.java
//   vm/instructions/cond/optimise/If_other_stack_literal.java
//   vm/instructions/cond/optimise/If_other_stack_other.java
//   vm/instructions/cond/optimise/If_stack_literal_free.java
//   vm/instructions/cond/optimise/If_stack_stack_literal.java
//   vm/instructions/invoke/Invoke.java (no code needed)
//   vm/instructions/invoke/Invoke_0.java
//   vm/instructions/invoke/Invoke_1.java
//   vm/instructions/invoke/Invoke_2.java
//   vm/instructions/invoke/Invoke_3.java
//   vm/instructions/invoke/Invoke_N.java
//   vm/interpreter/StackSymbol.java
//   vm/interpreter/BoundSymbol.java
//   vm/interpreter/SingleAssignment.java
//   vm/interpreter/LastAssignment.java
//   vm/interpreter/Assignment.java
//   vm/interpreter/Conditional.java (no code needed)
//   vm/interpreter/Else.java
//   vm/interpreter/IfClause.java
//   vm/interpreter/IfThen.java
//   vm/interpreter/Quotation.java
//   vm/interpreter/Invocation.java
//   vm/interpreter/QuasiQuotation.java
//   vm/interpreter/qq/Unquote.java
//   vm/interpreter/qq/UnquoteSplicing.java
//   vm/interpreter/visitor/Visitor.java
//   vm/interpreter/visitor/FunctionOwnershipVisitor.java
//   vm/interpreter/visitor/MeasureLexicalReach.java
//   vm/interpreter/visitor/ReferenceCounter.java
//   vm/interceptor/FunctionProfile.java
//   vm/interceptor/InvocationCounter.java
//   vm/interceptor/ProfileData.java
//   vm/interceptor/VMInterceptor.java
//   vm/compiler/AssignmentBuilder.java
//   vm/compiler/Compiler.java
//   vm/compiler/FunctionBodyBuilder.java
//   vm/compiler/FunctionParameterListBuilder.java
//   vm/compiler/IfBuilder.java
//   vm/compiler/InvocationBuilder.java
//   vm/compiler/PairExpander.java
//   vm/compiler/QuasiQuoteCompiler.java
// util/*
//   util/Argv.java
//   util/Decompiler.java
// functions/Builtin.java
// functions/Closure.java
// functions/Evaluation.java
// functions/interpreted/*
//   functions/interpreted/InterpretedFunction.java
//   functions/interpreted/SimpleArgs.java
//   functions/interpreted/ComplexArgs.java
//   functions/interpreted/StackFunctionSupport.java
//   functions/interpreted/optimise/Bind.java
//   functions/interpreted/optimise/Bind_A.java
//   functions/interpreted/optimise/Bind_A_A.java
//   functions/interpreted/optimise/Bind_A_A_A.java
//   functions/interpreted/optimise/Bind_A_A_R.java
//   functions/interpreted/optimise/Bind_A_A_Obound.java
//   functions/interpreted/optimise/Bind_A_Oliteral.java
//   functions/interpreted/optimise/Bind_A_Oother.java
//   functions/interpreted/optimise/Bind_A_R.java
//   functions/interpreted/optimise/Bind_D_A_A_A_d.java
//   functions/interpreted/optimise/Bind_D_A_A_d.java
//   functions/interpreted/optimise/Bind_Obound.java
//   functions/interpreted/optimise/Bind_Oliteral.java
//   functions/interpreted/optimise/Bind_Oother.java
//   functions/interpreted/optimise/Bind_R.java
//   functions/interpreted/optimise/stack/Stack_A.java
//   functions/interpreted/optimise/stack/Stack_A_A.java
//   functions/interpreted/optimise/stack/Stack_A_A_A.java
//   functions/interpreted/optimise/stack/Stack_A_A_A_A.java
//   functions/interpreted/optimise/stack/Stack_A_A_R.java
//   functions/interpreted/optimise/stack/Stack_A_R.java
//   functions/interpreted/optimise/stack/Stack_R.java
//   functions/interpreted/optimise/stack/Stack_D_A_A_A_A_d.java
//   functions/interpreted/optimise/stack/Stack_D_A_A_d.java
//   functions/interpreted/optimise/stack/Stack_A_Oliteral.java
//   functions/interpreted/optimise/stack/Stack_Oliteral.java
// functions/Macex.java
// functions/Uniq.java
// functions/errors/*
//   functions/errors/Details.java
//   functions/errors/Err.java
//   functions/errors/OnErr.java
//   functions/errors/Protect.java
// functions/eval/*
//   functions/eval/Apply.java
//   functions/eval/Eval.java
//   functions/eval/SSExpand.java
//   functions/eval/SSyntax.java
// functions/java/JavaDebug.java
// functions/lists/*
//   functions/lists/Car.java
//   functions/lists/Cdr.java
//   functions/lists/Cons.java
//   functions/lists/Len.java
//   functions/lists/NewString.java
//   functions/lists/Scar.java
//   functions/lists/Scdr.java
// functions/maths/*
//   functions/maths/Acos.java
//   functions/maths/Add.java
//   functions/maths/Asin.java
//   functions/maths/Atan.java
//   functions/maths/ComplexParts.java
//   functions/maths/Cosine.java
//   functions/maths/Divide.java
//   functions/maths/Expt.java
//   functions/maths/Logarithm.java
//   functions/maths/MakeComplex.java
//   functions/maths/Maths.java
//   functions/maths/Mod.java
//   functions/maths/Multiply.java
//   functions/maths/PolarCoordinates.java
//   functions/maths/Quotient.java
//   functions/maths/Rand.java
//   functions/maths/Sine.java
//   functions/maths/Sqrt.java
//   functions/maths/Tangent.java
//   functions/maths/Trunc.java
// functions/predicates/*
//   functions/predicates/Bound.java
//   functions/predicates/Exact.java
//   functions/predicates/GreaterThan.java
//   functions/predicates/Is.java
//   functions/predicates/LessThan.java
// functions/rainbow/*
//   functions/rainbow/RainbowDebug.java
//   functions/rainbow/RainbowProfile.java
//   functions/rainbow/RainbowProfileReport.java
// functions/system/CurrentGcMilliseconds.java
// functions/system/CurrentProcessMilliseconds.java
// functions/system/Declare.java
// functions/system/MSec.java
// functions/system/Seconds.java
// functions/tables/*
//   functions/tables/MapTable.java
//   functions/tables/Sref.java
//   functions/tables/Table.java
// functions/threads/AtomicInvoke.java
// functions/threads/BreakThread.java
// functions/threads/CCC.java
// functions/threads/CurrentThread.java
// functions/threads/Dead.java
// functions/threads/KillThread.java
// functions/threads/NewThreadLocal.java
// functions/threads/ThreadLocalGet.java
// functions/threads/ThreadLocalSet.java
// functions/typing/*
//   functions/typing/Annotate.java
//   functions/typing/Coerce.java
//   functions/typing/Rep.java
//   functions/typing/Type.java
//   functions/typing/Typing.java
// functions/Environment.java
//
//
// Kinda tackled so far:
//
// types/Input.java
// types/Output.java
// types/StringInputPort.java
// types/StringOutputPort.java
// functions/IO.java
// functions/io/Close.java (as Close_Builtin)
// functions/io/Disp.java
// functions/io/FlushOut.java
// functions/io/ForceClose.java
// functions/io/StdErr.java
// functions/io/StdIn.java
// functions/io/StdOut.java
// functions/io/Write.java
// functions/io/WriteB.java
// functions/io/WriteC.java
// functions/strings/*
//   functions/strings/InString.java
//   functions/strings/Inside.java
//   functions/strings/OutString.java
// functions/io/CallWStdIn.java
// functions/io/CallWStdOut.java
// functions/io/ReadB.java
// functions/io/ReadC.java
// functions/io/Sread.java
// functions/fs/*
//   functions/fs/Dir.java
//   functions/fs/DirExists.java
//   functions/fs/FileExists.java
//   functions/fs/InFile.java
//   functions/fs/OutFile.java
//   functions/fs/MakeDirectory.java
//   functions/fs/MakeDirectories.java
//   functions/fs/MvFile.java
//   functions/fs/RmFile.java
// Console.java
// functions/threads/NewThread.java (just a dummy)
//
//
// Skipped so far:
//
// types/ArcSocket.java
// types/FileInputPort.java
// types/FileOutputPort.java
// types/JavaProxy.java
// types/PipedInputPort.java
// types/SocketInputPort.java
// types/SocketOutputPort.java
// cheat/*
//   cheat/NoWrapTextPane.java
// functions/java/JavaClass.java
// functions/java/JavaImplement.java
// functions/java/JavaInvoke.java
// functions/java/JavaNew.java
// functions/java/JavaStaticField.java
// functions/java/JavaStaticInvoke.java
// functions/network/*
//   functions/network/ClientIp.java
//   functions/network/Connect.java
//   functions/network/OpenSocket.java
//   functions/network/SocketAccept.java
// functions/system/Memory.java
// functions/system/PipeFrom.java
// functions/system/Quit.java
// functions/system/SetUID.java
// functions/system/ShellInvoke.java
// functions/system/SystemFunctions.java
// functions/system/TimeDate.java
// functions/system/WhichOS.java
// functions/threads/Sleep.java
//
//
// Still to go:
//
// ../../arc/*, especially
//   ...
//   ../../arc/rainbow/build/optimisers.arc
//   ...
//
//
// Differences: Primitive number data types used internally in Rainbow
// are just treated as JavaScript numbers.


"use strict";


// ===================================================================
// Parts of the port that didn't come from any file
// ===================================================================

// PORT TODO: Figure out whether setTimeout is better or worse than
// invoking the callback on the same stack (risking an overflow).

function System_out_print( string ) {
    System_out.writeString( "" + string );
}

function System_out_println0() {
    System_out.writeString( "\n" );
}

function System_out_println( string ) {
    System_out.writeString( "" + string + "\n" );
}

function printStackTrace( e, opt_stream ) {
    if ( void 0 === opt_stream ) opt_stream = System_err;
    // PORT TODO: Find an equivalent for this Java.
//    e.printStackTrace( opt_stream );
    opt_stream.writeString(
        "" + e + "\n" + (e.stack || e) + "\n" );
    while ( e instanceof ArcError && (e = e.getCause()) ) {
        if ( e instanceof ArcException )
            e = e.getOriginal();
        opt_stream.writeString(
            "Caused by: " + e + "\n" + (e.stack || e) + "\n" );
    }
}

var classes = {};

var stringMapPrefix = "rainbow_";
function StringMap() {}
StringMap.prototype.init = function () {
    this.contents_ = {};
    return this;
};
StringMap.prototype.get = function ( k ) {
    return this.contents_[ stringMapPrefix + k ];
};
StringMap.prototype.put = function ( k, v ) {
    return this.contents_[ stringMapPrefix + k ] = v;
};
StringMap.prototype.has = function ( k ) {
    return stringMapPrefix + k in this.contents_;
};


// ===================================================================
// from ArcError.java
// ===================================================================

// PORT NOTE: We've found and removed all uses of
// new ArcError( Exception );
/** @constructor */
function ArcError( message, opt_e ) {
    Error.call( this, message );
    this.message = message;
    this.stack = new Error().stack;
    this.e_ = opt_e;
    this.arcStack_ = [];
}

// PORT TODO: Figure out a way to do this inheritance and also get a
// real stack trace.
ArcError.prototype = new Error();

ArcError.prototype.getMessage = function () {
    return this.message;
};

// PORT NOTE: This didn't exist in Java.
ArcError.prototype.getCause = function () {
    return this.e_;
};


// ===================================================================
// from LexicalClosure.java
// ===================================================================
// Needed late: ArcError Pair

/** @constructor */
function LexicalClosure( length, parent ) {
    this.parent = parent;
    this.bindings_ = new Array( ~~length );
    this.count_ = 0;
}

LexicalClosure.prototype.add = function ( value ) {
    if ( this.bindings_.length <= this.count_ )
        throw new ArcError(
            "Can't add " + value + " to bindings: already full " +
            "(" + this.count_ + ") " +
            Pair.buildFrom1( this.bindings_ ) );
    this.bindings_[ this.count_ ] = value;
    this.count_++;
};

LexicalClosure.prototype.nth = function ( n ) {
    return n === 0 ? this : this.parent.nth( n - 1 );
};

LexicalClosure.prototype.toString = function ( n ) {
   var b = [];
   for ( var i = 0; i < this.bindings_.length; i++ ) {
       b.push( i );
       b.push( " : " );
       b.push( this.bindings_[ i ] );
       b.push( "\n" );
   }
   return b.join( "" ) + "\nparent: " +
       (this.parent === null ? "<none>" : this.parent.toString());
};

LexicalClosure.prototype.at = function ( index ) {
    return this.bindings_[ index ];
};

LexicalClosure.prototype.set = function ( index, o ) {
    return this.bindings_[ index ] = o;
};

LexicalClosure.prototype.finished = function () {
    return this.count_ === this.bindings_.length;
};

LexicalClosure.prototype.count = function () {
    return this.count_;
};

LexicalClosure.prototype.size = function () {
    return this.bindings_.length;
};


// ===================================================================
// from parser/ParseException.java
// ===================================================================

/** @constructor */
function ParseException() {
    Error.call( this );
}

// PORT TODO: Figure out a way to do this inheritance and also get a
// real stack trace.
ParseException.prototype = new Error();


// ===================================================================
// from types/ArcObject.java
// from parser/ArcParser.java
// from types/Symbol.java
// from types/Pair.java
// from Nil.java
// from Truth.java
// from vm/Instruction.java
// ===================================================================
// Needed late: ArcError Hash Invoke_N.Other StringInputPort
// ParseException ArcString ArcCharacter Rational Symbol Real Complex
// FreeSym ArcNumber Literal "hash codes"


// PORT NOTE: This was originally abstract.
/** @constructor */
function ArcObject() {
}

// PORT NOTE: We're representing interfaces as properties.
ArcObject.prototype.implementsConditional = false;
ArcObject.prototype.className = "ArcObject";

ArcObject.prototype.literal = function () {
    return false;
};

ArcObject.prototype.addInstructions = function ( i ) {
    throw new ArcError(
        "addInstructions not defined on " + this + ", a " +
        this.className );
};

ArcObject.prototype.invoke = function ( vm, args ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var typeDispatcherTable = ArcObject.TYPE_DISPATCHER_TABLE.value();
    // PORT NOTE: This was a cast in Java.
    if ( !(typeDispatcherTable instanceof Hash) )
        throw new TypeError();
    var fn = typeDispatcherTable.value( this.type() );
    if ( fn instanceof Nil )
        throw new ArcError(
            "No handler for " + this.type() + " in call* table: " +
            "called " + this + " with args " + args );
    fn.invoke( vm, new Pair( this, args ) );
};

// PORT NOTE: We've made sure all uses of .invokef were renamed.
ArcObject.prototype.invokef0 = function ( vm ) {
    this.invoke( vm, ArcObject.NIL );
};

ArcObject.prototype.invokef1 = function ( vm, arg ) {
    this.invoke( vm, new Pair( arg, ArcObject.NIL ) );
};

ArcObject.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    this.invoke(
        vm, new Pair( arg1, new Pair( arg2, ArcObject.NIL ) ) );
};

ArcObject.prototype.invokef3 = function ( vm, arg1, arg2, arg3 ) {
    this.invoke( vm, new Pair(
        arg1, new Pair( arg2, new Pair( arg3, ArcObject.NIL ) ) ) );
};

ArcObject.prototype.len = function () {
    throw new ArcError(
        "len: expects one string, list or hash argument, got " +
        this.type() );
};

ArcObject.prototype.scar = function () {
    throw new ArcError( "Can't set car of " + this.type() );
};

ArcObject.prototype.sref = function ( value, index ) {
    throw new ArcError(
        "Can't sref " + this + "( a " + this.type() + "), other " +
        "args were " + value + ", " + index );
};

ArcObject.prototype.compareTo = function ( right ) {
    return 0;
};

ArcObject.prototype.xcar = function () {
    return ArcObject.NIL;
};

ArcObject.prototype.car = function () {
    throw new ArcError( "Can't take car of " + this );
};

ArcObject.prototype.cdr = function () {
    throw new ArcError( "Can't take cdr of " + this );
};

ArcObject.prototype.isCar = function ( s ) {
    return false;
};

// PORT NOTE: This was originally abstract.
ArcObject.prototype.type = void 0;

ArcObject.prototype.copy = function () {
    return this;
};

ArcObject.prototype.unwrap = function () {
    return this;
};

ArcObject.prototype.isSame = function ( other ) {
    return this === other;
};

ArcObject.prototype.copyTo = function ( c ) {
    return c;
};

ArcObject.prototype.isNotPair = function () {
    return true;
};

ArcObject.prototype.mustBePairOrNil = function () {
    throw new Pair.NotPair();
};

ArcObject.prototype.mustBeNil = function () {
    throw new ArcObject.NotNil();
};

ArcObject.prototype.or = function ( other ) {
    return this;
};

// ASYNC PORT NOTE: The synchronous Java version is below.
ArcObject.prototype.invokeAndWait = function ( vm, args ) {
    var orig = args;
    var len = 0;
    while ( !(args instanceof Nil) ) {
        vm.pushA( args.car() );
        args = args.cdr();
        len++;
    }
    vm.pushFrame(
        new ArcObject.ConvertError( orig, vm.getAp(), this ) );
    var i = new Invoke_N.Other( len );
    i.belongsTo( this );
    vm.pushFrame( i );
    var i2 = new Literal( this );
    i2.belongsTo( this );
    vm.pushFrame( i2 );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//ArcObject.prototype.invokeAndWait = function ( vm, args ) {
//    var orig = args;
//    var len = 0;
//    while ( !(args instanceof Nil) ) {
//        vm.pushA( args.car() );
//        args = args.cdr();
//        len++;
//    }
//    vm.pushA( this );
//    var i = new Invoke_N.Other( len );
//    i.belongsTo( this );
//    vm.pushFrame( i );
//    try {
//        return vm.thread();
//    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
//        throw new ArcError(
//           "error invoking " + this + " with args " + orig + ": " + e,
//           e );
//    }
//};

ArcObject.prototype.hasLen = function ( i ) {
    throw new ArcError(
        "has length: not a proper list: ends with " + this );
};

ArcObject.prototype.longerThan = function ( i ) {
    throw new ArcError(
        "longer than: not a proper list: ends with " + this );
};

ArcObject.prototype.nest = function ( i ) {
    return this;
};

ArcObject.prototype.collectReferences = function ( b, bs ) {
};

ArcObject.prototype.visit = function ( v ) {
};

ArcObject.prototype.replaceBoundSymbols = function (
    lexicalBindings ) {
    
    return this;
};

ArcObject.prototype.unassigned = function ( name ) {
};

ArcObject.prototype.assigned = function ( name ) {
};

ArcObject.prototype.assignedName = function () {
    return ArcObject.NIL;
};

ArcObject.prototype.profileName = function () {
    return this.assignedName().toString();
};

ArcObject.prototype.add = function ( other ) {
    throw new ArcError(
        "add not implemented for " + this.type() + " " + this );
};

ArcObject.prototype.sqrt = function () {
    throw new ArcError(
        "sqrt not implemented for " + this.type() + " " + this );
};

ArcObject.prototype.multiply = function ( argObject ) {
    throw new ArcError(
        "multiply not implemented for " + this.type() + " " + this );
};

// PORT NOTE: In Java, this extended Throwable.
/** @constructor */
ArcObject.NotNil = function () {
};

ArcObject.prototype.reduce = function () {
    return this;
};

ArcObject.prototype.hasClosures = function () {
    return false;
};

// PORT NOTE: We've made sure all uses of .inline were renamed.
ArcObject.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    return this;
};

ArcObject.prototype.inline3 = function ( p, arg, paramIndex ) {
    return this;
};

ArcObject.prototype.assigns = function ( nesting ) {
    return false;
};

ArcObject.prototype.disp = function () {
    return this.toString();
};

// PORT NOTE: The original just used Java's own default
// implementations of hashCode() and equals().
ArcObject.prototype.hashCode = function () {
    return this.hashCode_ || (this.hashCode_ = 1 + Math.random());
};

// PORT NOTE: The original just used Java's own default
// implementations of hashCode() and equals().
ArcObject.prototype.equals = function ( other ) {
    return this === other;
};


// ASYNC PORT NOTE: This is a completely reworked design.

var ArcParser = {};

ArcParser.isNonSymAtom = function ( s ) {
    if ( /^-?[01-9]+\/[01-9]+$/.test( s )
        || /^-?[01-9]+$/.test( s )
        || /^[-+]?[01-9]*\.?[01-9]+(e-?[01-9]+)?$/.test( s )
        || s === "+inf.0"
        || s === "-inf.0"
        || s === "+nan.0"
        || s === "+i"
        || s === "-i"
        || /^([-+]?[01-9]*\.?[01-9]+(?:e-?[01-9]+)?)([-+])([01-9]*\.?[01-9]+(?:e-?[01-9]+)?)?i$/.
            test( s )
        || /\\(?!\|)/.test( s ) )
        return true;
    
    for ( var i = 0, len = s.length; i < len; i++ ) {
        var code = s.charCodeAt( i );
        if ( !(/^[-+$%&*\/<=>?^_~.!:01-9a-zA-Z]+$/.test(
                s.charAt( i ) )
                || (0x0080 <= code && code < 0x10000)) )
            return true;
    }
    
    return false;
};

ArcParser.readFirstObjectFromString = function ( s ) {
    var result = null;
    if ( !ArcParser.readObjectAsync(
        new StringInputPort( s ).unwrap(), function ( e, o ) {
            if ( e ) throw e;
            result = o;
        }, !!"sync" ) )
        throw new ParseException();
    return result;
};

ArcParser.readObjectAsync = function ( input, then, opt_sync ) {
    function peekChar( then ) {
        return input.peekCharCodeAsync( function (
            e, charCode ) {
            
            if ( e ) return void then( e );
            then( null, charCode === null ?
                null : String.fromCharCode( charCode ) );
        }, opt_sync );
    }
    function readChar( then ) {
        return input.readCharCodeAsync( function (
            e, charCode ) {
            
            if ( e ) return void then( e );
            then( null, charCode === null ?
                null : String.fromCharCode( charCode ) );
        } );
    }
    function finishComment( then ) {
        var thisSync = true;
        var done = false;
        while ( thisSync && !done ) {
            done = true;
            if ( !readChar( function ( e, c ) {
                    if ( e ) return void then( e );
                    if ( c === null || c === "\n" ) {
                        then( null );
                    } else if ( c === "\r" ) {
                        if ( !peekChar( function ( e, c2 ) {
                                if ( e ) return void then( e );
                                if ( c2 === "\n" ) {
                                    if ( !readChar( function (
                                            e, c2 ) {
                                            
                                            if ( e )
                                                return void then( e );
                                            then( null );
                                        } ) )
                                        thisSync = false;
                                } else {
                                    then( null );
                                }
                            } ) )
                            thisSync = false;
                    } else {
                        done = false;
                        if ( !thisSync )
                            finishComment( then );
                    }
                } ) )
                thisSync = false;
        }
        return thisSync;
    }
    function readWhite( then ) {
        var thisSync = true;
        var done = false;
        while ( thisSync && !done ) {
            done = true;
            if ( !peekChar( function ( e, c ) {
                    if ( e ) return void then( e );
                    function thenReadWhite( e, opt_c ) {
                        if ( e ) return void then( e );
                        done = false;
                        if ( !thisSync )
                            readWhite( then );
                    }
                    if ( c === ";" ) {
                        if ( !finishComment( thenReadWhite ) )
                            thisSync = false;
                    } else if ( c === null
                        || /[^ \t\r\n]/.test( c ) ) {
                        then( null );
                    } else {
                        if ( !readChar( thenReadWhite ) )
                            thisSync = false;
                    }
                } ) )
                thisSync = false;
        }
        return thisSync;
    }
    function finishInterpolatedString( parts, then ) {
        function partsPlus( part ) {
            var lenm1 = parts.length - 1;
            var last = parts[ lenm1 ];
            return typeof part === "string" &&
                last instanceof ArcString ?
                    parts.slice( 0, lenm1 ).concat(
                        [ ArcString.make( last.value() + part ) ] ) :
                typeof part === "string" ?
                    parts.concat( [ ArcString.make( part ) ] ) :
                    parts.concat( [ part ] );
        }
        var thisSync = true;
        var done = false;
        function y( c ) {
            parts = partsPlus( c );
            done = false;
            if ( !thisSync )
                finishInterpolatedString( parts, then );
        }
        function err( opt_error ) {
            if ( opt_error === void 0 )
                opt_error = new ParseException();
            then( opt_error );
        }
        function finishInterpolation() {
            if ( !readObject( function ( e, o ) {
                    if ( e ) return err( e );
                    if ( !readWhite( function ( e ) {
                            if ( e ) return err( e );
                            if ( !readChar( function ( e, c3 ) {
                                    if ( e ) return err( e );
                                    if ( c3 === ")" )
                                        y( o );
                                    else
                                        err();
                                } ) )
                                thisSync = false;
                        } ) )
                        thisSync = false;
                } ) )
                thisSync = false;
        }
        while ( thisSync && !done ) {
            done = true;
            if ( !readChar( function ( e, c ) {
                    if ( e ) return err( e );
                    if ( c === null ) {
                        err();
                    } else if ( c === "\"" ) {
                        then( null, parts );
                    } else if ( c === "\\" ) {
                        if ( !readChar( function ( e, c2 ) {
                                if ( e ) return err( e );
                                if ( c2 === "\"" ) {
                                    y( "\"" );
                                } else if ( c2 === "\\" ) {
                                    y( "\\" );
                                } else if ( c2 === "n" ) {
                                    y( "\n" );
                                } else if ( c2 === "r" ) {
                                    y( "\r" );
                                } else if ( c2 === "t" ) {
                                    y( "\t" );
                                } else if ( c2 === "#" ) {
                                    if ( !readChar( function (
                                            e, c3 ) {
                                            
                                            if ( e ) return err( e );
                                            if ( c3 === "(" )
                                                y( "#(" );
                                            else
                                                err();
                                        } ) )
                                        thisSync = false;
                                } else {
                                    err();
                                }
                            } ) )
                            thisSync = false;
                    } else if ( c === "#" ) {
                        if ( !peekChar( function ( e, c2 ) {
                                if ( e ) return err( e );
                                if ( c2 !== "(" )
                                    return void y( "#" );
                                if ( !readChar( function ( e, c2 ) {
                                        if ( e ) return err( e );
                                        finishInterpolation();
                                    } ) )
                                    thisSync = false;
                            } ) )
                            thisSync = false;
                    } else {
                        y( c );
                    }
                } ) )
                thisSync = false;
        }
        return thisSync;
    }
    function finishNamedCharacter( soFar, then ) {
        var thisSync = true;
        var done = false;
        function code( code ) {
            then( null, ArcCharacter.makeFromCharCode( code ) );
        }
        while ( thisSync && !done ) {
            done = true;
            if ( !peekChar( function ( e, c ) {
                    if ( e ) return void then( e );
                    if ( c === null || /[^01-9a-zA-Z]/.test( c ) ) {
                        if ( soFar === "newline" )
                            code( "\n".charCodeAt( 0 ) );
                        else if ( soFar === "tab" )
                            code( "\t".charCodeAt( 0 ) );
                        else if ( soFar === "space" )
                            code( " ".charCodeAt( 0 ) );
                        else if ( soFar === "return" )
                            code( "\r".charCodeAt( 0 ) );
                        else if ( soFar === "null" )
                            code( "\0".charCodeAt( 0 ) );
                        else if ( /^[01-9][01-9]+$/.test( soFar ) )
                            code( parseInt( soFar, 10 ) );
                        else if ( /^u[0-9a-f]+$/i.test( soFar ) )
                            code( parseInt(
                                soFar.substring( 1 ), 16 ) );
                        else if ( soFar.length === 1 )
                            code( soFar.charCodeAt( 0 ) );
                        else
                            then( new ParseException() );
                    } else {
                        if ( !readChar( function ( e, c ) {
                                if ( e ) return void then( e );
                                done = false;
                                soFar += c;
                                if ( !thisSync )
                                    finishNamedCharacter(
                                        soFar, then );
                            } ) )
                            thisSync = false;
                    }
                } ) )
                thisSync = false;
        }
        return thisSync;
    }
    function finishHexInteger( soFar, then ) {
        var thisSync = true;
        var done = false;
        while ( thisSync && !done ) {
            done = true;
            if ( !peekChar( function ( e, c ) {
                    if ( e ) return void then( e );
                    if ( c === null || /[^01-9a-fA-F]/.test( c ) ) {
                        if ( soFar === "" )
                            return void then( new ParseException() );
                        then( null, Rational.make1(
                            parseInt( soFar, 16 ) ) );
                    } else {
                        if ( !readChar( function ( e, c ) {
                                if ( e ) return void then( e );
                                done = false;
                                soFar += c;
                                if ( !thisSync )
                                    finishHexInteger( soFar, then );
                            } ) )
                            thisSync = false;
                    }
                } ) )
                thisSync = false;
        }
        return thisSync;
    }
    function finishPipedSymbol( soFar, then ) {
        var thisSync = true;
        var done = false;
        while ( thisSync && !done ) {
            done = true;
            if ( !readChar( function ( e, c ) {
                    if ( e ) return void then( e );
                    if ( c === null ) {
                        then( new ParseException() );
                    } else if ( c === "|" ) {
                        then( null, Symbol.make( soFar ) );
                    } else {
                        done = false;
                        soFar += c;
                        if ( !thisSync )
                            finishPipedSymbol( soFar, then );
                    }
                } ) )
                thisSync = false;
        }
        return thisSync;
    }
    function finishList( soFar, end, then ) {
        var thisSync = true;
        var done = false;
        while ( thisSync && !done ) {
            done = true;
            if ( !readWhite( function ( e ) {
                    if ( e ) return void then( e );
                    if ( !peekChar( function ( e, c ) {
                            if ( e ) return void then( e );
                            if ( c === null ) {
                                then( new ParseException() );
                            } else if ( c === end ) {
                                if ( !readChar( function ( e, c ) {
                                        if ( e )
                                            return void then( e );
                                        then( null, soFar );
                                    } ) )
                                    thisSync = false;
                            } else {
                                if ( !readObject( function ( e, o ) {
                                        if ( e )
                                            return void then( e );
                                        done = false;
                                        soFar = soFar.concat( [ o ] );
                                        if ( !thisSync )
                                            finishList(
                                                soFar, end, then );
                                    } ) )
                                    thisSync = false;
                            }
                        } ) )
                        thisSync = false;
                } ) )
                thisSync = false;
        }
        return thisSync;
    }
    function finishAtom( soFar, then ) {
        var thisSync = true;
        var done = false;
        while ( thisSync && !done ) {
            done = true;
            if ( !peekChar( function ( e, c ) {
                    if ( e ) return void then( e );
                    var code = c !== null && c.charCodeAt( 0 );
                    if ( c !== null &&
                        (/^[-+$%&*\/<=>?^_~.!:01-9a-zA-Z]+$/.test( c )
                            || (0x0080 <= code && code < 0x10000)) ) {
                        if ( !readChar( function ( e, c ) {
                                if ( e ) return void then( e );
                                done = false;
                                soFar += c;
                                if ( !thisSync )
                                    finishAtom( soFar, then );
                            } ) )
                            thisSync = false;
                    } else if ( c === "\\" ) {
                        if ( !readChar( function ( e, c ) {
                                if ( e ) return void then( e );
                                if ( !readChar( function ( e, c2 ) {
                                        if ( e )
                                            return void then( e );
                                        if ( c2 === "|" ) {
                                            done = false;
                                            soFar += "\\|";
                                            if ( !thisSync )
                                                finishAtom(
                                                    soFar, then );
                                        } else {
                                            then(
                                                new ParseException()
                                            );
                                        }
                                    } ) )
                                    thisSync = false;
                            } ) )
                            thisSync = false;
                    } else {
                        var matches;
                        if ( /^-?[01-9]+\/[01-9]+$/.test( soFar ) )
                            then( null, Rational.parse( soFar ) );
                        else if ( /^-?[01-9]+$/.test( soFar ) )
                            then( null, Rational.make1(
                                parseInt( soFar, 10 ) ) );
                        else if (
                            /^[-+]?[01-9]*\.?[01-9]+(e-?[01-9]+)?$/.
                                test( soFar ) )
                            then( null, Real.parse( soFar ) );
                        else if ( soFar === "+inf.0" )
                            then( null, Real.positiveInfinity() );
                        else if ( soFar === "-inf.0" )
                            then( null, Real.negativeInfinity() );
                        else if ( soFar === "+nan.0" )
                            then( null, Real.nan() );
                        else if ( soFar === "+i" )
                            then( null, new Complex( 0, 1 ) );
                        else if ( soFar === "-i" )
                            then( null, new Complex( 0, -1 ) );
                        else if ( matches =
                            /^([-+]?[01-9]*\.?[01-9]+(?:e-?[01-9]+)?)([-+])([01-9]*\.?[01-9]+(?:e-?[01-9]+)?)?i$/.
                                exec( soFar ) )
                            then( null, new Complex(
                                Real.parse( matches[ 1 ] ).value(),
                                Real.parse( matches[ 2 ] +
                                    (matches[ 3 ] || "1") ).value()
                            ) );
                        else
                            then( null, Symbol.make( soFar ) );
                    }
                } ) )
                thisSync = false;
        }
        return thisSync;
    }
    function readObject( then ) {
        var thisSync = true;
        function doString() {
            if ( !finishInterpolatedString( [], function (
                    e, parts ) {
                    
                    if ( e ) return void then( e );
                    if ( parts.length === 0 )
                        then( null, ArcString.make( "" ) );
                    else if ( parts.length === 1 )
                        then( null, parts[ 0 ] );
                    else
                        then( null, Pair.buildFrom1(
                            [ Symbol.make( "string" ) ].concat(
                                parts ) ) );
                } ) )
                thisSync = false;
        }
        function doSymbol() {
            if ( !finishPipedSymbol( "", function ( e, name ) {
                    if ( e ) return void then( e );
                    then( null, Symbol.make( name ) );
                } ) )
                thisSync = false;
        }
        function doHash() {
            if ( !readChar( function ( e, c2 ) {
                    if ( e ) return void then( e );
                    if ( c2 !== null && /x/i.test( c2 ) ) {
                        if ( !finishHexInteger( "", then ) )
                            thisSync = false;
                    } else if ( c2 === "\\" ) {
                        if ( !readChar( function ( e, c ) {
                                if ( e ) return void then( e );
                                if ( /[^a-zA-Z]/.test( e ) )
                                    return void then( null,
                                        ArcCharacter.makeFromCharCode(
                                            e.charCodeAt( 0 ) ) );
                                if (
                                    !finishNamedCharacter( c, then ) )
                                    thisSync = false;
                            } ) )
                            thisSync = false;
                    } else {
                        then( new ParseException() );
                    }
                } ) )
                thisSync = false;
        }
        function doQuote( quoteName ) {
            if ( !readObject( function ( e, o ) {
                    if ( e ) return void then( e );
                    if ( o === null )
                        then( new ParseException() );
                    else
                        then( null, Pair.buildFrom1(
                            [ Symbol.mkSym( quoteName ), o ] ) );
                } ) )
                thisSync = false;
        }
        function doComma() {
            if ( !peekChar( function ( e, c2 ) {
                    if ( e ) return void then( e );
                    if ( c2 === null ) {
                        then( new ParseException() );
                    } else if ( c2 === "@" ) {
                        if ( !readChar( function ( e, c2 ) {
                                if ( e ) return void then( e );
                                doQuote( "unquote-splicing" );
                            } ) )
                            thisSync = false;
                    } else {
                        doQuote( "unquote" );
                    }
                } ) )
                thisSync = false;
        }
        function doParen() {
            if ( !finishList( [], ")", function ( e, list ) {
                    if ( e ) return void then( e );
                    if ( list.length === 0 ) {
                        then( null, ArcObject.EMPTY_LIST );
                    } else {
                        try { var result = Pair.parse( list ); }
                        catch ( e ) { return void then( e ); };
                        then( null, result );
                    }
                } ) )
                thisSync = false;
        }
        function doBracket() {
            if ( !finishList( [], "]", function ( e, list ) {
                    if ( e ) return void then( e );
                    then( null, Pair.buildFrom1( [
                        Symbol.mkSym( "fn" ),
                        Pair.buildFrom1( [ Symbol.mkSym( "_" ) ] ),
                        Pair.buildFrom1( list ) ] ) );
                } ) )
                thisSync = false;
        }
        function doAtom( c ) {
            if ( !finishAtom( c, then ) )
                thisSync = false;
        }
        if ( !readWhite( function ( e ) {
                if ( e ) return void then( e );
                if ( !readChar( function ( e, c ) {
                        if ( e ) return void then( e );
                        if ( c === null )
                            then( null, null );
                        else if ( c === "\"" )
                            doString();
                        else if ( c === "|" )
                            doSymbol();
                        else if ( c === "#" )
                            doHash();
                        else if ( c === "'" )
                            doQuote( "quote" );
                        else if ( c === "," )
                            doComma();
                        else if ( c === "`" )
                            doQuote( "quasiquote" );
                        else if ( c === "(" )
                            doParen();
                        else if ( c === "[" )
                            doBracket();
                        else
                            doAtom( c );
                    } ) )
                    thisSync = false;
            } ) )
            thisSync = false;
        return thisSync;
    }
    return readObject( then );
};


// PORT NOTE: In Java, this was protected.
/** @constructor */
function Symbol( name, parseableName ) {
    ArcObject.call( this );
    this.name_ = name;
    this.parseableName_ = parseableName;
    // PORT TODO: Find an equivalent for this Java.
//    this.hash = name.hashCode();
    this.hash_ = name;
    this.value_ = null;
    this.coerceFrom_ = null;
}

Symbol.prototype = new ArcObject();
Symbol.prototype.className = "Symbol";

Symbol.prototype.addInstructions = function ( i ) {
    i.push( new FreeSym( this ) );
};

Symbol.mkSym = function ( name ) {
    var result = Symbol.make( name );
    if ( !(result instanceof Symbol) )
        throw new ArcError(
            "can't make symbol from \"" + name + "\"" );
    else
        return result;
};

Symbol.make = function ( name ) {
    if ( name === "t" )
        return ArcObject.T;
    else if ( name === "nil" )
        return ArcObject.NIL;
    else if ( Symbol.requiresPiping_.test( name )
        || ArcParser.isNonSymAtom( name )
        || name === "." )
        return Symbol.nu( name, "|" + name + "|" );
    else if ( Symbol.hasEscapedPiping_.test( name ) )
        return Symbol.nu( name.replace( /\\\|/g, "|" ), name );
    else
        return Symbol.nu( name, name );
};

Symbol.prototype.disp = function () {
    return this.name_;
};

Symbol.prototype.toString = function () {
    return this.parseableName_;
};

Symbol.nu = function ( s, parseableName ) {
    if ( Symbol.map_.has( s ) )
        return Symbol.map_.get( s );
    
    var result = new Symbol( s, parseableName );
    Symbol.map_.put( s, result );
    return result;
};

Symbol.parse = function ( s ) {
    return Symbol.make( s.substring( 1, s.length - 1 ) );
};

Symbol.prototype.name = function () {
    return this.name_;
};

Symbol.prototype.compareTo = function ( right ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(right instanceof Symbol) )
        throw new TypeError();
    return this.name_.localeCompare( right.name );
};

Symbol.prototype.type = function () {
    return Symbol.TYPE;
};

Symbol.prototype.unwrap = function () {
    return this.name();
};

Symbol.prototype.hashCode = function () {
    return this.hash_;
};

Symbol.prototype.equals = function ( object ) {
    return this === object;
};

Symbol.is = function ( s, o ) {
    return o instanceof Symbol && o.name() === s;
};

Symbol.prototype.setValue = function ( value ) {
    var old = this.value_;
    this.value_ = value;
    if ( old !== null )
        old.unassigned( this );
    value.assigned( this );
};

Symbol.prototype.value = function () {
    if ( this.value_ === null )
        throw new ArcError(
            "Symbol " + this.name_ + " is not bound" );
    return this.value_;
};

Symbol.prototype.bound = function () {
    return this.value_ !== null;
};

Symbol.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof Symbol) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "Symbol, got " + argument );
    }
};

Symbol.prototype.addCoercion = function ( from, fn ) {
    if ( this.coerceFrom_ === null )
        this.coerceFrom_ = {};
    this.coerceFrom_[ from.name() ] = fn;
};

Symbol.prototype.getCoercion = function ( from ) {
    return this.coerceFrom_[ from ] || null;
};

Symbol.map_ = new StringMap().init();
Symbol.requiresPiping_ = /.*(["'; \t\n\)\(]|([^\\]|^)\|).*/;
Symbol.hasEscapedPiping_ = /.*\\\|/;

Symbol.TYPE = Symbol.mkSym( "sym" );
Symbol.DOT = Symbol.mkSym( "." );
Symbol.BANG = Symbol.mkSym( "!" );


/** @constructor */
function Pair( car, cdr ) {
    ArcObject.call( this );
    if ( car === null )
        throw new ArcError(
            "Can't create Pair with null car: use NIL instead" );
    if ( cdr === null )
        throw new ArcError(
            "Can't create Pair with null cdr: use NIL instead" );
    this.car_ = car;
    this.cdr_ = cdr;
}

// PORT NOTE: We've changed all uses of the zero-argument Pair() to
// Pair.of(). It turns out the only time we use it is port-specific
// too.
// PORT NOTE: In Java, this was another constructor.
Pair.of = function () {
    var result = new Pair( void 0, void 0 );
    result.real_ = result.imaginary_ = null;
    return result;
};

Pair.prototype = new ArcObject();
Pair.prototype.className = "Pair";

Pair.prototype.invoke = function ( vm, args ) {
    var index = ArcNumber.cast( args.car(), this );
    vm.pushA( this.nth( index.toInt() ).car() );
};

Pair.prototype.xcar = function () {
    return this.car_;
};

Pair.prototype.car = function () {
    return this.car_;
};

Pair.prototype.cdr = function () {
    return this.cdr_;
};

Pair.prototype.mustBeNil = function () {
    if ( this.car_ !== null )
        throw new ArcObject.NotNil();
};

Pair.prototype.isNotPair = function () {
    return false;
};

Pair.prototype.scar = function ( newCar ) {
    return this.car_ = newCar;
};

Pair.prototype.sref = function ( value, idx ) {
    var index = Rational.cast( idx, this );
    var n = index.toInt();
    return this.nth( n ).scar( value );
};

Pair.prototype.isCar = function ( s ) {
    return s === this.car_;
};

Pair.prototype.toString = function () {
    if ( this.isSpecial() ) {
        var s = this.car();
        // PORT NOTE: This local variable didn't exist in Java.
        var prefix = Pair.specials_[ s.name() ];
        // PORT NOTE: This local variable didn't exist in Java.
        var cdr = this.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(cdr instanceof Pair) )
            throw new TypeError();
        return prefix + cdr.internalToString_();
    } else {
        return "(" + this.internalToString_() + ")";
    }
};

Pair.prototype.internalToString_ = function () {
    return Pair.internalToString_( this );
};

Pair.internalToString_ = function ( o ) {
    var result = [];
    while ( !o.isNotPair() ) {
        result.push( o.car() );
        if ( !o.cdr().isNotPair() )
            result.push( " " );
        o = o.cdr();
    }
    
    if ( !(o instanceof Nil) )
        result.push( " . ", o );
    return result.join( "" );
};

Pair.prototype.setCdr = function ( cdr ) {
    this.cdr_ = cdr;
};

Pair.parse = function ( items ) {
    if ( items === null || items.length === 0 )
        return ArcObject.NIL;
    
    if ( items[ 0 ] === Symbol.DOT )
        return Pair.illegalDot_( items );
    
    return new Pair(
        items[ 0 ], Pair.internalParse_( items.slice( 1 ) ) );
};

Pair.internalParse_ = function ( items ) {
    if ( items.length === 0 )
        return ArcObject.NIL;
    
    if ( items[ 0 ] === Symbol.DOT ) {
        if ( items.length === 2 ) {
            // PORT NOTE: This local variable didn't exist in Java.
            var result = items[ 1 ];
            // PORT NOTE: This was a cast in Java.
            if ( !(result instanceof ArcObject) )
                throw new TypeError();
            return result;
        } else {
            return Pair.illegalDot_( items );
        }
    }
    
    // PORT NOTE: This local variable didn't exist in Java.
    var car = items[ 0 ];
    // PORT NOTE: This was a cast in Java.
    if ( !(car instanceof ArcObject) )
        throw new TypeError();
    return new Pair( car, Pair.internalParse_( items.slice( 1 ) ) );
};

Pair.illegalDot_ = function ( items ) {
    throw new ArcError( "Error: illegal use of \".\" in " + items );
};

Pair.buildFrom_ = function ( items, last, n ) {
    if ( n === items.length ) {
        return last;
    } else {
        // PORT NOTE: This local variable didn't exist in Java.
        var car = items[ n ];
        // PORT NOTE: This was a cast in Java.
        if ( !(car instanceof ArcObject) )
            throw new TypeError();
        return new Pair( car, Pair.buildFrom_( items, last, n + 1 ) );
    }
};

// PORT NOTE: We've renamed all uses of buildFrom(), and we've
// replaced all varargs uses with passing Arrays.
Pair.buildFrom2 = function ( items, last ) {
    if ( items === null || items.length === 0 )
        return last;
    return Pair.buildFrom_( items, last, 0 );
};

Pair.buildFrom1 = function ( items ) {
    return Pair.buildFrom2( items, ArcObject.NIL );
};

Pair.prototype.type = function () {
    return Pair.TYPE;
};

Pair.prototype.len = function () {
    return this.size();
};

Pair.prototype.improperLen = function () {
    return Pair.improperLen( this );
};

Pair.improperLen = function ( o ) {
    var count = 0;
    while ( !o.isNotPair() ) {
        count++;
        o = o.cdr();
    }
    return count;
};

Pair.prototype.size = function () {
    if ( this instanceof Nil ) {
        return 0;
    } else {
        var result = 1;
        var rest = this.cdr_;
        while ( !(rest instanceof Nil) ) {
            if ( rest.isNotPair() )
                throw new ArcError(
                    "cannot take size: not a proper list: " + this );
            result++;
            rest = rest.cdr();
        }
        return result;
    }
};

Pair.prototype.compareTo = function ( right ) {
    throw new ArcError( "Pair.compareTo:unimplemented" );
};

Pair.prototype.copyTo = function ( c ) {
    c.push( this.car() );
    if ( this.cdr() instanceof Nil )
        return c;
    else if ( !(this.cdr() instanceof Pair) )
        throw new ArcError( "Not a list: " + this );
    this.cdr().copyTo( c );
    return c;
};

Pair.prototype.equals = function ( other ) {
    if ( this === other )
        return true;
    var iAmNil = this instanceof Nil;
    // PORT NOTE: This was a cast in Java.
    if ( !(other instanceof ArcObject) )
        throw new TypeError();
    var itIsNil = other instanceof Nil;
    if ( iAmNil !== itIsNil ) {
        return false;
    } else if ( iAmNil && itIsNil ) {
        return true;
    } else {
        var isPair = other instanceof Pair;
        if ( isPair ) {
            var eqCar = other.car_.equals( this.car_ );
            var eqCdr = other.cdr_.equals( this.cdr_ );
            return eqCar && eqCdr;
        } else {
            return false;
        }
    }
};

Pair.prototype.hashCode = function () {
    // PORT TODO: Find an equivalent for this Java.
//    return car().hashCode() + (37 * cdr().hashCode());
    return this.car().hashCode() + this.cdr().hashCode();
};

Pair.prototype.nth = function ( index ) {
    try {
        // PORT NOTE: This local variable didn't exist in Java.
        var result = Pair.nth_( this, index );
        // PORT NOTE: This was a cast in Java.
        if ( !(result instanceof Pair) )
            throw new TypeError();
        return result;
    } catch ( oob ) { if ( !(oob instanceof Pair.OOB) ) throw e;
        throw new ArcError(
            "Error: index " + index + " too large for list " + this );
    }
};

Pair.nth_ = function ( p, index ) {
    while ( 0 < index ) {
        if ( p.cdr() instanceof Nil )
            throw new Pair.OOB();
        p = p.cdr();
        index--;
    }
    return p;
};

Pair.prototype.hasLen = function ( i ) {
    return this.cdr().hasLen( i - 1 );
};

Pair.prototype.longerThan = function ( i ) {
    return i < 0 || this.cdr().longerThan( i - 1 );
};

Pair.prototype.profileName = function () {
    return "ref:" + this.type().toString();
};

// PORT TODO: Figure out a way to do this inheritance and also get a
// real stack trace.
/** @constructor */
Pair.OOB = function () {
    Error.call( this );
};
Pair.OOB.prototype = new Error();

Pair.prototype.isSpecial = function () {
    return this.car() instanceof Symbol &&
        this.car().name() in Pair.specials_ &&
        this.cdr() instanceof Pair &&
        this.cdr().size() === 1;
};

Pair.prototype.copy = function () {
    if ( this instanceof Nil )
        return this;
    return new Pair( this.car(), this.cdr().copy() );
};

Pair.prototype.unwrap = function () {
    var result = [];
    Pair.unwrapList_( result, this );
    return result;
};

Pair.prototype.isSame = function ( other ) {
    return ArcObject.prototype.isSame.call( this, other ) ||
        (this instanceof Nil && other instanceof Nil);
};

Pair.unwrapList_ = function ( result, list ) {
    if ( list instanceof Nil )
        return;
    result.push( list.car().unwrap() );
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr = list.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr instanceof Pair) )
        throw new TypeError();
    Pair.unwrapList_( result, cdr );
};

Pair.prototype.toArray = function () {
    var result = new Array( ~~this.size() );
    var i = 0;
    this.toArray_( result, i );
    return result;
};

Pair.prototype.toArray_ = function ( result, i ) {
    if ( i < result.length ) {
        result[ i ] = this.car_;
        // PORT NOTE: This local variable didn't exist in Java.
        var cdr = this.cdr_;
        // PORT NOTE: This was a cast in Java.
        if ( !(cdr instanceof Pair) )
            throw new TypeError();
        if ( !(cdr instanceof Nil) ) {
            cdr.toArray_( result, i + 1 );
        }
    }
};

Pair.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof Pair) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a cons, " +
            "got " + argument );
    }
};

Pair.prototype.mustBePairOrNil = function () {
};

Pair.append = function ( pair, value ) {
    if ( pair === null ) {
        return new Pair( value, ArcObject.NIL );
    } else {
        var test = pair;
        while ( !(test.cdr_ instanceof Nil) ) {
            test = test.cdr_;
            // PORT NOTE: This was a cast in Java.
            if ( !(test instanceof Pair) )
                throw new TypeError();
        }
        test.cdr_ = new Pair( value, ArcObject.NIL );
    }
    return pair;
};

Pair.prototype.add = function ( other ) {
    if ( other instanceof Pair ) {
        var list = [];
        this.copyTo( list );
        other.copyTo( list );
        return Pair.buildFrom1( list );
    } else {
        throw new ArcError(
            "+ : expects cons, got " + other.type() + " " + other );
    }
};

Pair.prototype.rev = function () {
    return null;
};

Pair.prototype.visit = function ( v ) {
    v.acceptPair( this );
    var o = this;
    while ( !o.isNotPair() ) {
        o.car().visit( v );
        o = o.cdr();
    }
    
    if ( !(o instanceof Nil) )
        o.visit( v );
    v.endPair( this );
};

Pair.prototype.isProper = function () {
    return Pair.isProper( this );
};

Pair.isProper = function ( pair ) {
    while ( !pair.isNotPair() )
        pair = pair.cdr();
    return pair instanceof Nil;
};

Pair.prototype.isProper = function () {
    return Pair.isProper( this );
};

/** @constructor */
Pair.NotPair = function () {
};

Pair.TYPE = Symbol.mkSym( "cons" );

Pair.specials_ = {
    "quasiquote": "`",
    "quote": "'",
    "unquote": ",",
    "unquote-splicing": ",@"
};


/** @constructor */
function Nil( rep ) {
    // PORT NOTE: This is for inheritance from Pair.
    this.car_ = this.cdr_ = null;
    
    this.rep_ = rep;
}

Nil.prototype = Pair.of();
Nil.prototype.className = "Nil";

Nil.prototype.addInstructions = function ( i ) {
    i.push( new Literal( Nil.NIL ) );
};

Nil.prototype.invoke = function ( vm, args ) {
    throw new ArcError(
        "Function dispatch on inappropriate object: " + this + " " +
        "with args " + args );
};

Nil.prototype.mustBePairOrNil = function () {
};

Nil.prototype.literal = function () {
    return true;
};

Nil.prototype.len = function () {
    return 0;
};

Nil.prototype.isNotPair = function () {
    return true;
};

Nil.prototype.mustBeNil = function () {
};

Nil.prototype.toString = function () {
    return this.rep_;
};

Nil.prototype.xcar = function () {
    return this;
};

Nil.prototype.car = function () {
    return this;
};

Nil.prototype.cdr = function () {
    return this;
};

Nil.prototype.isCar = function ( s ) {
    return false;
};

Nil.prototype.setCar = function ( item ) {
    throw new Error( "can't set the car of " + this );
};

Nil.prototype.setCdr = function ( item ) {
    throw new Error( "can't set the cdr of " + this );
};

Nil.prototype.size = function ( item ) {
    return 0;
};

Nil.prototype.copyTo = function ( c ) {
    return c;
};

Nil.prototype.type = function () {
    return Nil.TYPE;
};

Nil.prototype.hashCode = function () {
    // PORT TODO: Find an equivalent for this Java.
//    return "nil".hashCode();
    return "nil";
};

Nil.prototype.equals = function ( other ) {
    if ( this === other )
        return true;
    // NOTE: This was a cast in Java.
    if ( !(other instanceof ArcObject) )
        throw new TypeError();
    return other instanceof Nil;
};

Nil.prototype.unwrap = function () {
    // PORT TODO: See if this Java is significantly different.
//    return Boolean.FALSE;
    return false;
};

Nil.prototype.isSame = function ( other ) {
    return other instanceof Nil;
};

Nil.prototype.or = function ( other ) {
    return other;
};

Nil.prototype.hasLen = function ( i ) {
    return i === 0;
};

Nil.prototype.longerThan = function ( i ) {
    return i < 0;
};

Nil.TYPE = Symbol.TYPE;
Nil.NIL = new Nil( "nil" );
Nil.EMPTY_LIST = new Nil( "()" );


// PORT NOTE: This was private in Java.
/** @constructor */
function Truth() {
    Symbol.call( this, this.name_, this.parseableName_ );
    if ( Truth.T !== void 0 ) throw new Error();
}

Truth.prototype = new Symbol( "t", "t" );
Truth.prototype.className = "Truth";

Truth.prototype.literal = function () {
    return true;
};

Truth.prototype.addInstructions = function ( i ) {
    i.push( new Literal( Truth.T ) );
};

Truth.prototype.toString = function () {
    return "t";
};

Truth.prototype.compareTo = function ( right ) {
    throw new ArcError( "Truth.compareTo:unimplemented" );
};

Truth.prototype.type = function () {
    return Symbol.TYPE;
};

Truth.valueOf = function ( b ) {
    return b ? Truth.T : ArcObject.NIL;
};

Truth.prototype.hashCode = function () {
    // PORT TODO: Find an equivalent for this Java.
//    return "t".hashCode();
    return "t";
};

Truth.prototype.equals = function ( object ) {
    return this === object;
};

Truth.prototype.unwrap = function () {
    // PORT TODO: See if this Java is significantly different.
//    return Boolean.TRUE;
    return true;
};

Truth.prototype.setValue = function ( value ) {
    throw new ArcError( "error: can't rebind t!" );
};

Truth.prototype.value = function ( other ) {
    return this;
};

Truth.T = new Truth();


// PORT NOTE: This was originally abstract.
/** @constructor */
function Instruction() {
    ArcObject.call( this );
    this.owner_ = null;
}

Instruction.prototype = new ArcObject();
// PORT NOTE: We're representing interfaces as properties.
Instruction.prototype.implementsFinally = false;
Instruction.prototype.implementsOnError = false;
Instruction.prototype.implementsInvoke = false;
// ASYNC PORT NOTE: This interface didn't exist in Java.
Instruction.prototype.implementsAsync = false;
Instruction.prototype.className = "Instruction";

Instruction.prototype.type = function () {
    return Symbol.mkSym( "instruction" );
};

// PORT TODO: Find all uses of Instruction.toString( LexicalClosure ),
// and rename them.
Instruction.prototype.toStringWithLc = function ( lc ) {
    return this.toString();
};

// PORT NOTE: This didn't exist in Java. We're using it to debug.
Instruction.prototype.toString = function () {
    return "(" + this.className + ")";
};

Instruction.prototype.symValue = function ( s ) {
    if ( s.bound() )
        return "" + s.value();
    else
        return "#unbound#";
};

// PORT NOTE: This was originally abstract.
Instruction.prototype.operate = void 0;

Instruction.prototype.belongsTo = function ( fn ) {
    this.owner_ = fn;
};

Instruction.prototype.visit = function ( v ) {
    v.acceptInstruction( this );
};

Instruction.prototype.owner = function () {
    return this.owner_;
};


// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
ArcObject.ConvertError = function ( orig, ap, owner ) {
    Instruction.call( this );
    this.orig_ = orig;
    this.ap_ = ap;
    this.belongsTo( owner );
};

ArcObject.ConvertError.prototype = new Instruction();
ArcObject.ConvertError.prototype.implementsOnError = true;
ArcObject.ConvertError.prototype.className = "ArcObject.ConvertError";

// ASYNC PORT NOTE: This method of the OnError interface didn't exist
// in Java. The point is to let certain errors propagate without
// losing their stack traces.
ArcObject.ConvertError.prototype.catches = function ( error ) {
    return error instanceof Error;
};

ArcObject.ConvertError.prototype.operate = function ( vm ) {
    var error = vm.error();
    if ( error === null )
        return;
    vm.clearError();
    vm.setAp( this.ap_ );
    
    throw new ArcError(
        "error invoking " + this.owner() + " with args " +
        this.orig_ + ": " + error, error );
};

ArcObject.TYPE_DISPATCHER_TABLE = Symbol.mkSym( "call*" );
ArcObject.NIL = Nil.NIL;
ArcObject.EMPTY_LIST = Nil.EMPTY_LIST;
ArcObject.T = Truth.T;


// ===================================================================
// from types/LiteralObject.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Literal

// PORT NOTE: This was originally abstract.
/** @constructor */
function LiteralObject() {
    ArcObject.call( this );
}

LiteralObject.prototype = new ArcObject();
LiteralObject.prototype.className = "LiteralObject";

LiteralObject.prototype.literal = function () {
    return true;
};

LiteralObject.prototype.addInstructions = function ( i ) {
    i.push( new Literal( this ) );
};

LiteralObject.prototype.profileName = function () {
    return "ref:" + this.type().toString();
};


// ===================================================================
// from types/ArcCharacter.java
// ===================================================================
// Needed early: LiteralObject Symbol
// Needed late: ArcError

/** @constructor */
function ArcCharacter( value ) {
    LiteralObject.call( this );
    this.value_ = value;
    ArcCharacter.chars_[ value ] = this;
}

ArcCharacter.prototype = new LiteralObject();
ArcCharacter.prototype.className = "ArcCharacter";

// PORT NOTE: We've made sure all uses of .make were renamed.
ArcCharacter.makeFromCharCode = function ( ch ) {
    return ArcCharacter.chars_[ ch ] === void 0 ?
        new ArcCharacter( ch ) : ArcCharacter.chars_[ ch ];
};

ArcCharacter.makeFromString = function ( representation ) {
    if ( representation.length === 3 )
        return ArcCharacter.makeFromCharCode(
            representation.charCodeAt( 2 ) );
    if ( /^#\\U/i.test( representation ) )
        return ArcCharacter.makeFromCharCode(
            parseInt( representation.substring( 3 ), 16 ) );
    
    for ( var i = 0; i < ArcCharacter.named_.length; i++ )
        if ( ArcCharacter.named_[ i ].is_( representation ) )
            return ArcCharacter.named_[ i ];
    
    try {
        var intValue = ArcCharacter.parseInt_( representation );
        return make( intValue );
    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
        throw new ArcError(
            "Can't make character from " + representation );
    }
};

ArcCharacter.parseInt_ = function ( representation ) {
    return parseInt( representation.substring( 2 ), 8 );
};

ArcCharacter.prototype.literal = function () {
    return true;
};

ArcCharacter.prototype.toString = function () {
    return "#\\" + String.fromCharCode( this.value_ );
};

ArcCharacter.prototype.is_ = function ( representation ) {
    return this.toString() === representation;
};

ArcCharacter.prototype.compareTo = function ( right ) {
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(right instanceof ArcCharacter) )
        throw new TypeError();
    return this.value_ - other.value_;
};

ArcCharacter.prototype.type = function () {
    return ArcCharacter.TYPE;
};

ArcCharacter.prototype.unwrap = function () {
    return this.value();
};

ArcCharacter.prototype.value = function () {
    return this.value_;
};

ArcCharacter.prototype.disp = function () {
    return String.fromCharCode( this.value_ );
};

ArcCharacter.prototype.hashCode = function () {
    // PORT TODO: Find an equivalent for this Java.
//    return new Character(value).hashCode();
    return this.disp();
};

ArcCharacter.prototype.equals = function ( other ) {
    return this === other ||
        (other instanceof ArcCharacter &&
            other.value_ === this.value_);
};

ArcCharacter.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof ArcCharacter) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "character, got " + argument );
    }
};

ArcCharacter.TYPE = Symbol.mkSym( "char" );
ArcCharacter.chars_ = new Array( 65536 );

// PORT NOTE: This was an anonymous class in Java.
/** @constructor */
ArcCharacter.Anon_NULL_ = function () {
    ArcCharacter.call( this, 0 );
};
ArcCharacter.Anon_NULL_.prototype = new ArcCharacter( 0 );
ArcCharacter.Anon_NULL_.prototype.className =
    "ArcCharacter.Anon_NULL_";
ArcCharacter.Anon_NULL_.prototype.toString = function () {
    return "#\\null";
};
ArcCharacter.NULL = new ArcCharacter.Anon_NULL_();

// PORT NOTE: This was an anonymous class in Java.
/** @constructor */
ArcCharacter.Anon_named_1_ = function () {
    ArcCharacter.call( this, "\n".charCodeAt( 0 ) );
};
ArcCharacter.Anon_named_1_.prototype =
    new ArcCharacter( "\n".charCodeAt( 0 ) );
ArcCharacter.Anon_named_1_.prototype.className =
    "ArcCharacter.Anon_named_1_";
ArcCharacter.Anon_named_1_.prototype.toString = function () {
    return "#\\newline";
};

// PORT NOTE: This was an anonymous class in Java.
/** @constructor */
ArcCharacter.Anon_named_2_ = function () {
    ArcCharacter.call( this, "\t".charCodeAt( 0 ) );
};
ArcCharacter.Anon_named_2_.prototype =
    new ArcCharacter( "\t".charCodeAt( 0 ) );
ArcCharacter.Anon_named_2_.prototype.className =
    "ArcCharacter.Anon_named_2_";
ArcCharacter.Anon_named_2_.prototype.toString = function () {
    return "#\\tab";
};

// PORT NOTE: This was an anonymous class in Java.
/** @constructor */
ArcCharacter.Anon_named_3_ = function () {
    ArcCharacter.call( this, "\r".charCodeAt( 0 ) );
};
ArcCharacter.Anon_named_3_.prototype =
    new ArcCharacter( "\r".charCodeAt( 0 ) );
ArcCharacter.Anon_named_3_.prototype.className =
    "ArcCharacter.Anon_named_3_";
ArcCharacter.Anon_named_3_.prototype.toString = function () {
    return "#\\return";
};

// PORT NOTE: This was an anonymous class in Java.
/** @constructor */
ArcCharacter.Anon_named_4_ = function () {
    ArcCharacter.call( this, " ".charCodeAt( 0 ) );
};
ArcCharacter.Anon_named_4_.prototype =
    new ArcCharacter( " ".charCodeAt( 0 ) );
ArcCharacter.Anon_named_4_.prototype.className =
    "ArcCharacter.Anon_named_4_";
ArcCharacter.Anon_named_4_.prototype.toString = function () {
    return "#\\space";
};

ArcCharacter.named_ = [
    ArcCharacter.NULL,
    new ArcCharacter.Anon_named_1_(),
    new ArcCharacter.Anon_named_2_(),
    new ArcCharacter.Anon_named_3_(),
    new ArcCharacter.Anon_named_4_()
];


// ===================================================================
// from types/ArcString.java
// ===================================================================
// Needed early: LiteralObject Symbol
// Needed late: Builtin Rational ArcError ArcCharacter Typing

/** @constructor */
function ArcString( value ) {
    LiteralObject.call( this );
    this.value_ = value;
}

ArcString.prototype = new LiteralObject();
ArcString.prototype.className = "ArcString";

ArcString.prototype.invoke = function ( vm, args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var string = this;
    var index = Rational.cast( args.car(), this );
    if ( !index.isInteger() )
        throw new ArcError(
            "string-ref: expects exact integer: got " + index );
    var i = ~~index.toInt();
    if ( !(0 <= i || i < string.value.length()) )
        throw new ArcError(
            "string-ref: index " + i + " out of range " +
            "[0, " + (string.value_.length - 1) + "] for string " +
            this.toString() );
    vm.pushA( ArcCharacter.makeFromCharCode(
        string.value_.charCodeAt( i ) ) );
};

ArcString.prototype.value = function ( vm, args ) {
    return this.value_;
};

ArcString.prototype.disp = function ( vm, args ) {
    return this.value_;
};

ArcString.prototype.toString = function ( vm, args ) {
    return this.escape_( this.value_ );
};

ArcString.prototype.escape_ = function ( value ) {
    var sb = [];
    sb.push( "\"" );
    var v = value;
    for ( var i = 0; i < v.length; i++ ) {
        switch ( v.charAt( i ) ) {
            case "\"": sb.push( "\\\"" ); break;
            case "\\": sb.push( "\\\\" ); break;
            case "\n": sb.push( "\\n" ); break;
            case "\r": sb.push( "\\r" ); break;
            default: sb.push( v.charAt( i ) );
        }
    }
    sb.push( "\"" );
    return sb.join( "" );
};

ArcString.prototype.compareTo = function ( right ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(right instanceof ArcString) )
        throw new TypeError();
    return this.value_.localeCompare( right.value_ );
};

ArcString.prototype.len = function () {
    return this.value_.length;
};

ArcString.prototype.scar = function ( character ) {
    var newCar = ArcCharacter.cast( character, this );
    var sb = [ newCar.disp() ];
    sb.push( this.value().substring( 1 ) );
    this.setValue( sb.join( "" ) );
    return character;
};

ArcString.prototype.sref = function ( value, index ) {
    var v = ArcCharacter.cast( value, ArcCharacter );
    var i = Rational.cast( index, this );
    this.srefChar( i, v );
    return value;
};

ArcString.prototype.type = function () {
    return ArcString.TYPE;
};

ArcString.prototype.unwrap = function () {
    return this.value();
};

ArcString.make = function ( element ) {
    return new ArcString( element );
};

ArcString.prototype.setValue = function ( s ) {
    this.value_ = s;
};

ArcString.prototype.hashCode = function () {
    // PORT TODO: Find an equivalent for this Java.
//    return value.hashCode();
    return this.value_;
};

ArcString.prototype.equals = function ( object ) {
    return this === object ||
        (object instanceof ArcString &&
            object.value_ === this.value_);
};

ArcString.prototype.srefChar = function ( index, value ) {
    // NOTE: In Java, this error is implicit in the use of
    // StringBuilder.
    index = index.toInt();
    if ( !(0 <= index && index < this.value_.length) )
        throw new RangeError();
    this.value_ = this.value_.substring( 0, index ) +
        String.fromCharCode( value.value() ) +
        this.value_.substring( index + 1 );
};

ArcString.prototype.isSame = function ( other ) {
    return this.equals( other );
};

ArcString.prototype.add = function ( other ) {
    var s = [ this.value_ ];
    if ( other instanceof ArcString ) {
        s.push( other.value() );
    } else {
        // PORT NOTE: This local variable didn't exist in Java.
        var otherType = other.type();
        // PORT NOTE: This was a cast in Java.
        if ( !(otherType instanceof Symbol) )
            throw new TypeError();
        // PORT NOTE: This local variable didn't exist in Java.
        var coercion = Typing.STRING.getCoercion( otherType );
        // PORT NOTE: This was a cast in Java.
        // PORT TODO: See if this is guaranteed to be a Coercion
        // already.
        if ( !(coercion instanceof Typing.Coercion) )
            throw new TypeError();
        // PORT NOTE: This local variable didn't exist in Java.
        var asString = coercion.coerce1( other );
        // PORT NOTE: This was a cast in Java.
        if ( !(asString instanceof ArcString) )
            throw new TypeError();
        s.push( asString.value() );
    }
    return ArcString.make( s.join( "" ) );
};

ArcString.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof ArcString) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "string, got " + argument );
    }
};

ArcString.TYPE = Symbol.mkSym( "string" );


// ===================================================================
// from types/ArcException.java
// ===================================================================
// Needed early: LiteralObject Symbol ArcString
// Needed late: ArcError

// PORT NOTE: We didn't port the zero-arg ArcException(), and there
// are no uses of it.
/** @constructor */
function ArcException( e, operating, stackTrace ) {
    LiteralObject.call( this );
    this.operating_ = operating;
    this.original_ = e;
    this.stackTrace_ = stackTrace;
}

ArcException.prototype = new LiteralObject();
ArcException.prototype.className = "ArcException";

ArcException.prototype.type = function () {
    return ArcException.TYPE;
};

ArcException.prototype.message = function () {
    if ( this.original_ !== null )
        return ArcString.make( this.original_.message );
    else
        return ArcException.NO_MESSAGE_;
};

ArcException.prototype.toString = function () {
    return this.message().toString();
};

ArcException.prototype.getOriginal = function () {
    return this.original_;
};

ArcException.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof ArcException) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected an " +
            "exception, got " + argument );
    }
};

ArcException.prototype.getStackTrace = function () {
    return this.stackTrace_;
};

ArcException.prototype.getOperating = function () {
    return this.operating_;
};

ArcException.TYPE = Symbol.mkSym( "exn" );
ArcException.NO_MESSAGE_ = ArcString.make( "no message" );


// ===================================================================
// from types/ArcNumber.java
// ===================================================================
// Needed early: LiteralObject Symbol
// Needed late: ArcError

// PORT NOTE: This was originally abstract.
/** @constructor */
function ArcNumber() {
    LiteralObject.call( this );
}

ArcNumber.prototype = new LiteralObject();
ArcNumber.prototype.className = "ArcNumber";

// PORT NOTE: This was originally abstract.
ArcNumber.prototype.isInteger = void 0;

// PORT NOTE: This was originally abstract.
ArcNumber.prototype.toDouble = void 0;

// PORT NOTE: This was originally abstract.
ArcNumber.prototype.toInt = void 0;

// PORT NOTE: This was originally abstract.
ArcNumber.prototype.negate = void 0;

// PORT NOTE: This was originally abstract.
ArcNumber.prototype.round = void 0;

ArcNumber.prototype.roundJava = function () {
    throw new ArcError(
        "round[closest] not implemented for " +
        this.className + "(" + this + ")" );
};

ArcNumber.prototype.literal = function () {
    return true;
};

ArcNumber.prototype.compareTo = function ( right ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(right instanceof ArcNumber) )
        throw new TypeError();
    var comparison = right.toDouble() - this.toDouble();
    return comparison < 0 ? 1 : comparison === 0 ? 0 : -1;
};

ArcNumber.prototype.type = function () {
    return this.isInteger() ? ArcNumber.INT_TYPE : ArcNumber.NUM_TYPE;
};

ArcNumber.prototype.isSame = function ( other ) {
    return this.equals( other );
};

ArcNumber.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof ArcNumber) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "number, got " + argument );
    }
};

ArcNumber.prototype.mod = function ( other ) {
    throw new ArcError(
        "mod: not implemented for " +
        this.className + "(" + this + ")" );
};

ArcNumber.INT_TYPE = Symbol.mkSym( "int" );
ArcNumber.NUM_TYPE = Symbol.mkSym( "num" );


// ===================================================================
// from types/ArcThreadLocal.java
// ===================================================================
// Needed early: LiteralObject Symbol
// Needed late: ArcError

/** @constructor */
function ArcThreadLocal() {
    LiteralObject.call( this );
    this.value_ = null;
}

ArcThreadLocal.prototype = new LiteralObject();
ArcThreadLocal.prototype.className = "ArcThreadLocal";

ArcThreadLocal.prototype.set = function ( value ) {
    this.value_ = value;
};

ArcThreadLocal.prototype.get = function () {
    return this.value_;
};

ArcThreadLocal.prototype.type = function () {
    return ArcThreadLocal.TYPE;
};

ArcThreadLocal.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof ArcThreadLocal) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "thread-local, got " + argument );
    }
};

ArcThreadLocal.TYPE = Symbol.mkSym( "thread-local" );


// ===================================================================
// from types/Complex.java
// ===================================================================
// Needed early: LiteralObject
// Needed late: Real ParseException ArcError

// PORT NOTE: We've gotten rid of all uses of Complex that passed
// ArcNumbers instead of primitives.
/** @constructor */
function Complex( real, imaginary ) {
    ArcNumber.call( this );
    this.real_ = real;
    this.imaginary_ = imaginary;
}

Complex.prototype = new ArcNumber();
Complex.prototype.className = "Complex";

// PORT NOTE: The Java version used ComplexParser here.
Complex.parse = function ( number ) {
    var matches;
    if ( soFar === "+i" )
        return new Complex( 0, 1 );
    else if ( soFar === "-i" )
        return new Complex( 0, -1 );
    else if ( matches =
        /^([-+]?[01-9]*\.?[01-9]+(?:e-?[01-9]+)?)([-+])([01-9]*\.?[01-9]+(?:e-?[01-9]+)?)?i$/.
            exec( soFar ) )
        return new Complex(
            Real.parse( matches[ 1 ] ).value(),
            Real.parse(
                matches[ 2 ] + (matches[ 3 ] || "1") ).
                value() );
    else
        throw new ParseException();
};

Complex.prototype.isInteger = function () {
    return this.imaginary_ === 0 && Math.floor( this.real_ ) === real;
};

Complex.prototype.toDouble = function () {
    throw new ArcError( "Cannot convert complex to double" );
};

Complex.prototype.toInt = function () {
    throw new ArcError( "Cannot convert complex to int" );
};

Complex.prototype.negate = function () {
    return new Complex( -this.real_, -this.imaginary_ );
};

Complex.prototype.toString = function () {
    return new Real( this.real_ ).toString() +
        (this.imaginary_ < 0 ? "" : "+") +
        new Real( this.imaginary_ ).toString() + "i";
};

Complex.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof Complex) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "complex number, got " + argument );
    }
};

Complex.prototype.round = function () {
    return new ArcError( "Can't convert " + this + " to integer" );
};

Complex.prototype.imaginaryPart = function () {
    return new Real( this.imaginary_ );
};

Complex.prototype.realPart = function () {
    return new Real( this.real_ );
};

// PORT NOTE: We've renamed all calls to
// Complex.multiply( ArcNumber ).
Complex.prototype.multiplyByNumber = function ( other ) {
    var d = argument.toDouble();
    return new Complex( this.real_ * d, this.imaginary_ * d );
};

Complex.prototype.multiply = function ( other ) {
    if ( other instanceof Complex ) {
        return this.timesComplex( other );
    } else {
        // PORT NOTE: This was a cast in Java.
        if ( !(other instanceof ArcNumber) )
            throw new TypeError();
        var d = other.toDouble();
        return new Complex( this.real_ * d, this.imaginary_ * d );
    }
};

// PORT NOTE: We've renamed all calls to Complex.times(). They're
// split between Complex.timesComplex() and Complex.timesDouble().
Complex.prototype.timesComplex = function ( c ) {
    var r1 = this.real_;
    var r2 = c.real_;
    var i1 = this.imaginary_;
    var i2 = c.imaginary_;
    
    return new Complex( r1 * r2 - i1 * i2, r1 * i2 + r2 * i1 );
};

// PORT NOTE: We've renamed all uses of Complex.plus().
Complex.prototype.plusComplex = function ( other ) {
    return new Complex( this.real_ + other.real_,
        this.imaginary_ + other.imaginary_ );
};

Complex.prototype.plusRational = function ( other ) {
    return new Complex(
        this.real_ + other.toDouble(), this.imaginary_ );
};

Complex.prototype.plusReal = function ( other ) {
    return new Complex(
        this.real_ + other.toDouble(), this.imaginary_ );
};

Complex.prototype.add = function ( other ) {
    if ( other instanceof Complex )
        return this.plusComplex( other );
    else if ( other instanceof Rational )
        return this.plusRational( other );
    else if ( other instanceof Real )
        return this.plusReal( other );
    else
        throw new ArcError(
            "+: expects a number, got " + other.type() + " " +
            other );
};

Complex.prototype.inverse = function () {
    // <http://en.wikipedia.org/wiki/
    // Complex_numbers#The_field_of_complex_numbers>
    // for a + bi
    // real part: a / (a^2 + b^2)
    // imaginary part: -b / (a^2 + b^2)
    
    var denominator =
        this.real_ * this.real_ + this.imaginary_ * this.imaginary_;
    var r = this.real_ / denominator;
    var i = -this.imaginary_ / denominator;
    return new Complex( r, i );
};

Complex.prototype.timesDouble = function ( scalar ) {
    var r = this.real_ * scalar;
    var i = this.imaginary_ * scalar;
    
    return new Complex( r, i );
};

Complex.prototype.radius = function () {
    return Math.sqrt(
        this.real_ * this.real_ + this.imaginary_ * this.imaginary_ );
};

Complex.prototype.theta = function () {
    return Math.atan2( this.imaginary_, this.real_ );
};

Complex.prototype.log = function () {
    return new Complex( Math.log( this.radius() ), this.theta() );
};

Complex.prototype.expt = function ( exponent ) {
    // <http://en.wikipedia.org/wiki/
    // Exponentiation#Complex_power_of_a_complex_number>
    // a^b = e^(b log a)
    
    if ( exponent instanceof Complex )
        return this.log().timesComplex( exponent ).exp();
    else
        return this.log().timesDouble( exponent.toDouble() ).exp();
};

Complex.prototype.sqrt = function () {
    return this.expt( Real.make( 0.5 ) );
};

Complex.prototype.exp = function () {
    // <http://en.wikipedia.org/wiki/
    // Exponentiation#Imaginary_powers_of_e>
    // e^(x+iy) = e^x . e^iy = e^x . (cos y + i.sin y)
    
    var e_x = Math.exp( this.real_ );
    return new Complex(
        e_x * Math.cos( this.imaginary_ ),
        e_x * Math.sin( this.imaginary_ ) );
};

Complex.prototype.compareTo = function ( right ) {
    throw new ArcError(
        "Compare: complex numbers are unordered and cannot be " +
        "compared" );
};

Complex.make = function ( o ) {
    if ( o instanceof Complex )
        return o;
    else if ( o instanceof ArcNumber )
        return new Complex( o.toDouble(), 0 );
    else
        throw new ArcError( "Can't make complex number from " + o );
};

Complex.prototype.isSame = function ( other ) {
    if ( other instanceof Complex )
        return other.real_ === this.real_ &&
            other.imaginary_ === this.imaginary_;
    else
        return other instanceof ArcNumber && this.imaginary_ === 0 &&
            other.toDouble() === this.real_;
};

Complex.ZERO = new Complex( 0, 0 );


// ===================================================================
// from types/Rational.java
// ===================================================================
// Needed early: ArcNumber
// Needed late: ArcError

// PORT NOTE: We've changed all uses of the zero- and one-parameter
// Rationals to uses of this one.
// PORT TODO: It seems this actually normalizes its *denominator* to
// be negative when the value as a whole is negative. This makes the
// value impossible to write out and read back in. But don't fix it!
// Get it fixed in the original.
/** @constructor */
function Rational( numerator, denominator ) {
    ArcNumber.call( this );
    if ( denominator === 0 && numerator !== 0 )
        throw new ArcError( "/: division by zero" );
    var gcd = this.gcd_( numerator, denominator );
    this.numerator_ = numerator / gcd;
    this.denominator_ = denominator / gcd;
}

Rational.prototype = new ArcNumber();
Rational.prototype.className = "Rational";

Rational.parse = function ( rep ) {
    var parts = rep.split( "/" );
    return Rational.make2(
        parseInt( parts[ 0 ], 10 ), parseInt( parts[ 1 ], 10 ) );
};

Rational.parseHex = function ( rep ) {
    rep = rep.substring( 2 );
    return new Rational( parseInt( rep, 16 ), 1 );
};

// PORT NOTE: We've renamed all uses of Rational.make().
Rational.make1 = function ( result ) {
    return new Rational( result, 1 );
};

Rational.make2 = function ( a, b ) {
    return new Rational( a, b );
};

Rational.prototype.toString = function () {
    return this.numerator_ +
        (this.denominator_ === 1 ? "" : "/" + this.denominator_);
};

Rational.prototype.isInteger = function () {
    return this.denominator_ === 1;
};

Rational.prototype.toDouble = function () {
    return this.numerator_ / this.denominator_;
};

Rational.prototype.toInt = function () {
    if ( this.numerator_ === 0 ) {
        return 0;
    } else {
        // PORT NOTE: In Java, this was just integer division.
        var result = this.numerator_ / this.denominator_;
        return result < 0 ?
            Math.ceil( result ) : Math.floor( result );
    }
};

Rational.prototype.gcd_ = function ( a, b ) {
    if ( b === 0 )
        return a;
    return this.gcd_( b, a % b );
};

Rational.prototype.mod = function ( other ) {
    if ( !this.isInteger() || !other.isInteger() )
        throw new ArcError(
            "modulo: expects integer, got " +
            "(" + this + " " + other + ")" );
    var divisor = other.toInt();
    var result = this.numerator_ % divisor;
    if ( result < 0 )
        result += divisor;
    return Rational.make1( result );
};

Rational.prototype.times = function ( other ) {
    return new Rational(
        this.numerator_ * other.numerator_,
        this.denominator_ * other.denominator_ );
};

Rational.prototype.plus = function ( other ) {
    var num =
        this.numerator_ * other.denominator_ +
        other.numerator_ * this.denominator_;
    var div = this.denominator_ * other.denominator_;
    return Rational.make2( num, div );
};

Rational.prototype.negate = function () {
    return Rational.make2( -this.numerator_, this.denominator_ );
};

Rational.prototype.invert = function () {
    return new Rational( this.denominator_, this.numerator_ );
};

Rational.prototype.unwrap = function () {
    if ( this.isInteger() )
        return this.toInt();
    else
        return this.toDouble();
};

Rational.prototype.hashCode = function () {
    if ( this.isInteger() )
        return this.toInt();
    else
        return this.toDouble();
};

Rational.prototype.hashCode = function () {
    // PORT TODO: Find an equivalent for this Java.
//    return (int) ((37 * numerator) + denominator);
    return 37 * this.numerator_ + this.denominator_ + "";
};

Rational.prototype.equals = function ( object ) {
    return object instanceof Rational && this.sameValue_( object );
};

Rational.prototype.sameValue_ = function ( other ) {
    return this.numerator_ === other.numerator_ &&
        this.denominator_ === other.denominator_;
};

Rational.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof Rational) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "Rational, got " + argument );
    }
};

Rational.prototype.round = function () {
    if ( this.denominator_ === 1 ) {
        return this;
    } else if ( this.denominator_ === 2 ) {
        // PORT TODO: Figure out what this case is even for.
        // PORT NOTE: In Java, this was just integer division.
        var r = this.numerator_ / this.denominator_;
        r = r < 0 ? Math.ceil( r ) : Math.floor( r );
        return Rational.make1( r + (r % 2 === 1 ? 1 : 0) );
    } else {
        return Rational.make1(
            Math.round( this.numerator_ / this.denominator_ ) );
    }
};

Rational.prototype.roundJava = function () {
    if ( this.denominator_ === 1 ) {
        return this;
    } else {
        return Rational.make1(
            Math.round( this.numerator_ / this.denominator_ ) );
    }
};

Rational.prototype.stringify = function ( base ) {
    var num = this.numerator_.toString( base.toInt() );
    if ( this.isInteger() ) {
        return ArcString.make( num );
    } else {
        var den = this.denominator_.toString( base.toInt() );
        return ArcString.make( num + "/" + den );
    }
};

Rational.prototype.sqrt = function () {
    var d = Math.sqrt( this.numerator_ / this.denominator_ );
    if ( Math.floor( d ) === d )
        return Rational.make1( d );
    else
        return Real.make( d );
};

Rational.prototype.multiply = function ( other ) {
    if ( other instanceof Complex )
        return other.multiplyByNumber( this );
    else if ( other instanceof Real )
        return other.multiplyNumber( this );
    else if ( other instanceof Rational )
        return this.times( other );
    else
        throw new ArcError(
            "*: expects a number, got " + other.type() + " " +
            other );
};

Rational.prototype.add = function ( other ) {
    if ( other instanceof Complex )
        return other.plusRational( this );
    else if ( other instanceof Real )
        return other.plus( this );
    else if ( other instanceof Rational )
        return this.plus( other );
    else
        throw new ArcError(
            "+: expects a number, got " + other.type() + " " +
            other );
};

Rational.ZERO = Rational.make1( 0 );
Rational.ONE = Rational.make1( 1 );
Rational.TEN = Rational.make1( 10 );


// ===================================================================
// from types/Real.java
// ===================================================================
// Needed early: ArcNumber
// Needed late: Real Complex ArcError

/** @constructor */
function Real( value ) {
    ArcNumber.call( this );
    this.value_ = value;
}

Real.prototype = new ArcNumber();
Real.prototype.className = "Real";

Real.positiveInfinity = function () {
    return new Real( 1 / 0 );
};

Real.negativeInfinity = function () {
    return new Real( -1 / 0 );
};

Real.nan = function () {
    return new Real( 0 / 0 );
};

Real.parse = function ( rep ) {
    return Real.make( parseFloat( rep ) );
};

Real.make = function ( v ) {
    return new Real( v );
};

Real.prototype.toString = function () {
    if ( this.value_ === -1 / 0 )
        return "-inf.0";
    else if ( this.value_ === 1 / 0 )
        return "+inf.0";
    else if ( this.value_ !== this.value_ )
        return "+nan.0";
    else
        // PORT TODO: Find an equivalent for this Java.
//        return new DecimalFormat("0.0##############").format(value);
        return "" + this.value_;
};

Real.prototype.unwrap = function () {
    if ( this.isInteger() )
        // PORT TODO: Find an equivalent for this Java.
//        return (long) value();
        return this.value();
    else
        return this.value();
};

Real.prototype.type = function () {
    return ArcNumber.NUM_TYPE;
};

Real.prototype.value = function () {
    return this.value_;
};

Real.prototype.isInteger = function () {
    return Math.floor( this.value_ ) === this.value_;
};

Real.prototype.toDouble = function () {
    return this.value_;
};

Real.prototype.toInt = function () {
    // PORT TODO: Find an equivalent for this Java.
//    return (long) value;
    return this.value_ < 0 ?
        Math.ceil( this.value_ ) : Math.floor( this.value_ );
};

Real.prototype.negate = function () {
    return Real.make( -this.value_ );
};

Real.prototype.hashCode = function () {
    // PORT TODO: Find an equivalent for this Java.
//    return new Double(value).hashCode();
    return "" + this.value_;
};

Real.prototype.equals = function ( other ) {
    if ( other instanceof Complex )
        return other.isSame( this );
    return this === other ||
        (other instanceof Real && this.value_ === other.value_);
};

Real.prototype.round = function () {
    var r = Math.round( this.value_ );
    if ( Math.abs( this.value_ - r ) === 0.5 && r % 2 == 1 ) {
        if ( r < this.value_ )
            return Rational.make1( r + 1 );
        else
            return Rational.make1( r - 1 );
    } else {
        return Rational.make1( r );
    }
};

Real.prototype.roundJava = function () {
    return Rational.make1( Math.round( this.value_ ) );
};

Real.prototype.plus = function ( r ) {
    return Real.make( this.value_ + r.toDouble() );
};

Real.prototype.sqrt = function () {
    return Real.make( Math.sqrt( this.value_ ) );
};

// PORT NOTE: We've renamed all uses of Real.multiply( ArcNumber ).
Real.prototype.multiplyNumber = function ( other ) {
    return Real.make( this.value_ * other.toDouble() );
};

Real.prototype.multiply = function ( other ) {
    if ( other instanceof Complex )
        return other.multiplyByNumber( this );
    else if ( other instanceof ArcNumber )
        return this.multiplyNumber( other );
    else
        throw new ArcError(
            "*: expects a number, got " + other.type() + " " +
            other );
};

Real.prototype.add = function ( other ) {
    if ( other instanceof Complex )
        return other.plusReal( this );
    else if ( other instanceof Rational )
        return this.plus( other );
    else if ( other instanceof Real )
        return this.plus( other );
    else
        throw new ArcError(
            "+: expects a number, got " + other.type() + " " +
            other );
};


// ===================================================================
// from types/Tagged.java
// ===================================================================
// Needed early: LiteralObject Symbol
// Needed late: Hash Pair Nil

/** @constructor */
function Tagged( type, rep ) {
    LiteralObject.call( this );
    this.type_ = type;
    this.rep_ = rep;
}

Tagged.prototype = new LiteralObject();
Tagged.prototype.className = "Tagged";

Tagged.prototype.invoke = function ( vm, args ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var typeDispatcherTable = ArcObject.TYPE_DISPATCHER_TABLE.value();
    // PORT NOTE: This was a cast in Java.
    if ( !(typeDispatcherTable instanceof Hash) )
        throw new TypeError();
    return typeDispatcherTable.value( this.type_ ).invoke(
        vm, new Pair( this.rep_, args ) );
};

Tagged.prototype.getType = function () {
    return this.type_;
};

Tagged.prototype.getRep = function () {
    return this.rep_;
};

Tagged.prototype.compareTo = function ( right ) {
    return 0;
};

Tagged.prototype.type = function () {
    return this.type_;
};

Tagged.hasTag = function ( o, s ) {
    return o instanceof Tagged && o.getType().toString() === s;
};

Tagged.ifTagged = function ( o, tag ) {
    if ( Tagged.hasTag( o, tag ) )
        return o.getRep();
    return null;
};

Tagged.rep = function ( o ) {
    return o instanceof Tagged ? o.rep_ : o;
};

Tagged.prototype.toString = function () {
    return this.stringify_();
};

Tagged.prototype.defaultToString = function () {
    return "#<tagged " + this.type_ + " " + this.rep_ + ">";
};

// ASYNC PORT NOTE: The synchronous Java version is below.
Tagged.prototype.stringify_ = function () {
    var writer = Tagged.TAGGED_WRITE_FN_;
    if ( !writer.bound() )
        return this.defaultToString();
    
    var dispatchers = writer.value();
    // PORT NOTE: This was a cast in Java.
    if ( !(dispatchers instanceof Hash) )
        throw new TypeError();
    var fn = dispatchers.value( this.type_ );
    if ( fn instanceof Nil )
        return this.defaultToString();
    
    var vm = new VM();
    fn.invoke( vm, Pair.buildFrom1( [ rep ] ) );
    // PORT TODO: Find an equivalent for this Java.
//    return (String) JavaObject.unwrap( vm.thread(), String.class );
    // ASYNC PORT NOTE: This error text didn't exist in Java.
    var ourResult;
    if ( !vm.threadAsync( function ( e, result ) {
            if ( e ) throw e;
            ourResult = result;
        }, !!"sync" ) )
        throw new ArcError(
            "An asynchronous operation was attempted during a " +
            "toString()." );
    return "" + JsObject.unwrap( ourResult );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//Tagged.prototype.stringify_ = function () {
//    var writer = Tagged.TAGGED_WRITE_FN_;
//    if ( !writer.bound() )
//        return this.defaultToString();
//    
//    var dispatchers = writer.value();
//    // PORT NOTE: This was a cast in Java.
//    if ( !(dispatchers instanceof Hash) )
//        throw new TypeError();
//    var fn = dispatchers.value( this.type_ );
//    if ( fn instanceof Nil )
//        return this.defaultToString();
//    
//    var vm = new VM();
//    fn.invoke( vm, Pair.buildFrom1( [ rep ] ) );
//    // PORT TODO: Find an equivalent for this Java.
////    return (String) JavaObject.unwrap( vm.thread(), String.class );
//    return "" + JsObject.unwrap( vm.thread() );
//};

Tagged.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof Tagged) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "Tagged, got " + argument );
    }
};

Tagged.TAGGED_WRITE_FN_ = Symbol.mkSym( "tagged-writers" );


// ===================================================================
// from types/JavaObject.java
// ===================================================================
// Needed early: LiteralObject Symbol
// Needed late: ArcError Nil Pair

// PORT TODO: Apparently, if this is named JavaObject, the Closure
// Compiler chokes on the JavaObject.invokeMethod_( ... ) function
// call (as I've reported at
// <http://code.google.com/p/closure-compiler/issues/detail?id=536>).
// In that case, figure out what we should really call this.

/** @constructor */
function JsObject( object ) {
    LiteralObject.call( this );
    this.object_ = object;
}

JsObject.prototype = new LiteralObject();
JsObject.prototype.className = "JsObject";

// PORT NOTE: A bunch of Java-spedific things have not been ported:
//
// getClassInstance
// instantiate
// construct
// findConstructor
// staticInvoke
// truncateString
// toClass
// getStaticFieldValue
// invokeMethod (the original, which took a Class object too)
// javaTypes
// unwrapList (the originals, which took a Class[] object too)
// unwrap (the original, which took a Class object too)
// autoProxyable
// convert
// methodCache
// findMethod
// findMethodIfPresent
// wrap
// wrapList
// wrapMap
//
// We've made sure there are no dangling uses of these things either.

// PORT TODO: See if porting things by spirit, like this, would help.
/*
JsObject.getClassInstance = function ( className ) {
    if ( /\.\.|^\.|\.$/.test( className ) )
        throw new SyntaxError();
    className = className.split( /\./g );
    var len = className.length;
    for ( var i = 0; i < len; i++ )
        if ( !/^[_$a-zA-Z][_$a-zA-Z01-9]*$/.test( className[ i ] ) )
            throw new SyntaxError();
    var result = window;
    for ( var i = 0, len = className.length; i < len; i++ ) {
        var part = className[ i ];
        if ( !(part in result) )
            throw new ArcError( "Can't find class " + className );
        result = result[ className[ i ] ];
    }
    return new JsObject( result );
};
*/

// PORT NOTE: We've renamed all uses of JsObject.invoke().
JsObject.prototype.invokeJs = function ( methodName, args ) {
    return JsObject.invokeMethod_( this.object_, methodName, args );
};

JsObject.prototype.type = function () {
    return JsObject.TYPE;
};

JsObject.prototype.unwrap = function () {
    return this.object_;
};

JsObject.prototype.toString = function () {
    return "" + this.object_;
};

JsObject.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof JsObject) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "java-object, got " + argument );
    }
};

JsObject.invokeMethod_ = function ( target, methodName, args ) {
    // PORT TODO: In Java, certain errors were caught here, and some
    // were converted to ArcErrors. See what the equivalent would be
    // here.
    var method = Object( target )[ methodName ];
    if ( Object.prototype.toString.call( method ) !==
        "[object Function]" )
        throw new ArcError(
            "Field " + methodName + " is not a method on " + target );
    return method.apply( target, JsObject.unwrapList1_( args ) );
};

JsObject.unwrapList1_ = function ( args ) {
    var result = [];
    JsObject.unwrapList2_( result, args );
    return result;
};

JsObject.unwrapList2_ = function ( result, args ) {
    result.push( JsObject.unwrap( args.car() ) );
    if ( !(args.cdr() instanceof Nil) ) {
        // PORT NOTE: This local variable didn't exist in Java.
        var cdr = args.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(cdr instanceof Pair) )
            throw new TypeError();
        JsObject.unwrapList2_( result, cdr );
    }
};

JsObject.unwrap = function ( arcObject ) {
    return arcObject.unwrap();
};

// PORT NOTE: This may be slightly different from Java Rainbow's
// version. In particular, we don't have cases for ArcCharacter,
// InputStream, OutputStream, or Map like Java Rainbow does.
JsObject.wrap = function ( o ) {
    if ( o === null ) {
        return ArcObject.NIL;
    } else if ( o instanceof ArcObject ) {
        return o;
    }
    // PORT NOTE: This local variable didn't exist in Java.
    var type = Object.prototype.toString.call( o );
    if ( type === "[object Number]" ) {
        o *= 1;
        return o === Math.floor( o ) ?
            Rational.make1( o ) : Real.make( o );
    } else if ( type === "[object String]" ) {
        return ArcString.make( "" + o );
    } else if ( type === "[object Array]"
        || type === "[object Arguments]" ) {
        return JsObject.wrapList_( o );
    } else if ( type === "[object Boolean]" ) {
        if ( !!o ) {
            return ArcObject.T;
        } else {
            return ArcObject.NIL;
        }
    } else {
        return new JsObject( o );
    }
};

JsObject.wrapList_ = function ( objects ) {
    var result = new Array( ~~objects.length );
    for ( var i = 0; i < objects.length; i++ ) {
        result[ i ] = JsObject.wrap( objects[ i ] );
    }
    return Pair.buildFrom1( result );
};

JsObject.prototype.close = function () {
    // PORT TODO: The Java version takes this opportunity to close raw
    // InputStream and OutputStream objects. Handle any analogous
    // JavaScript objects here.
    throw new ArcError( "close: unexpected object: " + this );
};

JsObject.TYPE = Symbol.mkSym( "java-object" );


// ===================================================================
// from types/Hash.java
// ===================================================================
// Needed early: LiteralObject Symbol
// Needed late: Pair Nil

// PORT NOTE: Since JavaScript doesn't implement LinkedHashMap, we
// implement something similar.

/** @constructor */
function Hash() {
    LiteralObject.call( this );
    this.name_ = ArcObject.NIL;
    this.map_ = new StringMap().init();
    this.firstEntry_ = null;
    this.lastEntry_ = null;
    this.naming_ = new Hash.DontName();
    this.len_ = 0;
}

Hash.prototype = new LiteralObject();
Hash.prototype.className = "Hash";

Hash.prototype.unassigned = function ( name ) {
    if ( this.name_ === name ) {
        this.name_ = ArcObject.NIL;
        this.naming_ = new Hash.DontName();
    }
};

Hash.prototype.assigned = function ( name ) {
    this.name_ = name;
    this.naming_ = new Hash.DoName( this );
};

Hash.prototype.assignedName = function () {
    return this.name_;
};

Hash.prototype.invoke = function ( vm, args ) {
    vm.pushA( this.value( args.car() ).or( args.cdr().car() ) );
};

Hash.prototype.toString = function () {
    return "#hash" + this.toList();
};

Hash.prototype.toList = function () {
    var pairs = [];
    for ( var k = this.firstEntry_; k !== null; k = k.next ) {
        var o = k.key;
        var keyValue =
            new Pair( o, new Pair( this.value( o ), ArcObject.NIL ) );
        pairs.push( keyValue );
    }
    return Pair.buildFrom2( pairs, ArcObject.EMPTY_LIST );
};

Hash.prototype.len = function () {
    return this.size();
};

Hash.prototype.sref = function ( value, key ) {
    if ( value instanceof Nil ) {
        var previous = this.value( key );
        this.unref( key );
        this.naming_.unname( previous, key );
    } else {
        var hash = key.hashCode();
        var list = this.map_.get( hash ) || this.map_.put( hash, [] );
        var entry = null;
        for ( var i = 0, len = list.length; i < len; i++ ) {
            var thisEntry = list[ i ];
            if ( key.equals( thisEntry.key ) ) {
                entry = thisEntry;
                break;
            }
        }
        if ( entry === null ) {
            var prev = this.lastEntry_;
            this.lastEntry_ =
                { key: key, value: value, prev: prev, next: null };
            if ( prev === null )
                this.firstEntry_ = this.lastEntry_;
            else
                prev.next = this.lastEntry_;
            list.push( this.lastEntry_ );
            this.len_++;
        } else {
            entry.value = value;
        }
        
        this.naming_.name( value, key );
    }
    return value;
};

Hash.prototype.unref = function ( key ) {
    var hash = key.hashCode();
    var list = this.map_.get( hash );
    if ( !list )
        return;
    for ( var i = 0, len = list.length; i < len; i++ ) {
        var entry = list[ i ];
        if ( !key.equals( entry.key ) )
            continue;
        list.splice( i, 1 );
        if ( entry.prev )
            entry.prev.next = entry.next;
        if ( entry.next )
            entry.next.prev = entry.prev;
        if ( this.firstEntry_ === entry )
            this.firstEntry_ = entry.next;
        if ( this.lastEntry_ === entry )
            this.lastEntry_ = entry.prev;
        this.len--;
        return;
    }
};

Hash.prototype.value = function ( key ) {
    var hash = key.hashCode();
    var list = this.map_.get( hash );
    if ( !list )
        return ArcObject.NIL;
    for ( var i = 0, len = list.length; i < len; i++ ) {
        var entry = list[ i ];
        if ( key.equals( entry.key ) )
            return entry.value;
    }
    return ArcObject.NIL;
};

Hash.prototype.compareTo = function ( right ) {
    return 0;
};

Hash.prototype.type = function () {
    return Hash.TYPE;
};

// PORT NOTE: There is no Hash equivalent in JavaScript, so we're
// leaving out the Java version of Hash.unwrap().

Hash.prototype.size = function () {
    return this.len_;
};

Hash.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof Hash) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a hash, " +
            "got " + argument + ", a " + argument.type() );
    }
};

// PORT NOTE: This was an interface in Java.
/** @constructor */
Hash.Naming = function () {
};

Hash.Naming.prototype.name = void 0;
Hash.Naming.prototype.unname = void 0;

// PORT NOTE: This was an inner class in Java.
/** @constructor */
Hash.DoName = function ( this_Hash ) {
    Hash.Naming.call( this );
    this.this_Hash_ = this_Hash;
};

Hash.DoName.prototype = new Hash.Naming();

Hash.DoName.prototype.name = function ( o, name ) {
    o.assigned( new Pair( name, this.this_Hash_ ) );
};

Hash.DoName.prototype.unname = function ( o, name ) {
    o.unassigned( new Pair( name, this.this_Hash_ ) );
};

// PORT NOTE: This was an inner class in Java.
/** @constructor */
Hash.DontName = function () {
    Hash.Naming.call( this );
};

Hash.DontName.prototype = new Hash.Naming();

Hash.DontName.prototype.name = function ( o, name ) {};
Hash.DontName.prototype.unname = function ( o, name ) {};

Hash.TYPE = Symbol.mkSym( "table" );


// ===================================================================
// from vm/VM.java
// ===================================================================
// Needed early: ArcObject Symbol
// Needed late: VMInterceptor ArcError Nil Instruction Pair
// ArcException

/** @constructor */
function VM() {
    ArcObject.call( this );
    
    this.threadId = VM.threadCount_++;
    
    this.args = new Array( 100 );
    this.ap = -1;
    
    this.params = [];
    this.lcs = new Array( 100 );
    this.ins = new Array( 100 );
    this.ip = -1;
    
    this.currentLc = null;
    this.currentParams = null;
    
    // PORT NOTE: The error field was public in Java, but there's also
    // an error method.
    this.error_ = null;
    this.interceptor_ = VMInterceptor.NULL;
    // PORT NOTE: The dead field was public in Java, but there's also
    // a dead method.
    this.dead_ = false;
    this.ipThreshold = 0;
    
    this.profileData = null;
    this.debug_target_frame = 0;
    
    this.operating_ = null;
}

VM.prototype = new ArcObject();
VM.prototype.className = "VM";

// PORT NOTE: We've removed VM.thread( LexicalClosure, Pair ), which
// was unused.

// ASYNC PORT NOTE: The Java version wasn't asynchronous.
VM.prototype.threadAsync = function ( then, opt_sync ) {
    var oldThreshold = this.ipThreshold;
    this.ipThreshold = this.ip;
    var self = this;
    var achievedSync = this.loopAsync_( function () {
        self.ipThreshold = oldThreshold;
        if ( self.error_ === null ) {
            self.interceptor_.end( self );
            then( null, self.popA() );
        } else {
            var ae = self.error_;
            self.error_ = null;
            var stackTrace = ae.getStackTrace();
            var msg = "\nAt instruction " + ae.getOperating();
            if ( stackTrace !== null )
                for (
                    var i = 0, len = stackTrace.length; i < len; i++ )
                    msg += "\n" + stackTrace[ i ].profileName();
            then( new ArcError(
                "Unhandled exception on " +
                "thread#" + self.threadId + ": " +
                ae.getOriginal().message + msg, ae.getOriginal() ) );
        }
    }, opt_sync );
    if ( opt_sync && !achievedSync )
        this.ipThreshold = oldThreshold;
    return achievedSync;
};

// ASYNC PORT NOTE: The Java version wasn't asynchronous.
VM.prototype.loopAsync_ = function ( then, opt_sync ) {
    this.interceptor_.check( this );
    var self = this;
    var achievedSync = true;
    function loop() {
        while ( self.ipThreshold <= self.ip ) {
            try {
                if ( self.ins[ self.ip ] instanceof Nil ) {
                    self.ip--;
                } else {
                    self.currentLc = self.lcs[ self.ip ];
                    self.currentParams = self.params[ self.ip ];
                    // PORT NOTE: This local variable didn't exist in
                    // Java.
                    var newOperating = self.ins[ self.ip ].car();
                    // PORT NOTE: This was a cast in Java.
                    if ( !(newOperating instanceof Instruction) )
                        throw new TypeError();
                    self.operating_ = newOperating;
                    // PORT NOTE: This local variable didn't exist in
                    // Java.
                    var newInsIp = self.ins[ self.ip ].cdr();
                    // PORT NOTE: This was a cast in Java.
                    if ( !(newInsIp instanceof Pair) )
                        throw new TypeError();
                    self.ins[ self.ip ] = newInsIp;
                    if ( self.operating_.implementsAsync ) {
                        // ASYNC PORT NOTE: The Async interface didn't
                        // exist in Java, and neither did this case.
                        var achievedSyncThisTime = true;
                        achievedSyncThisTime =
                            self.operating_.operateAsync( self,
                                function ( e ) {
                                
                                if ( e )
                                    self.handleError_( e );
                                else
                                    self.interceptor_.check( self );
                                if ( !achievedSyncThisTime )
                                    loop();
                            }, opt_sync );
                        if ( !achievedSyncThisTime ) {
                            achievedSync = false;
                            return;
                        }
                    } else {
                        self.operating_.operate( self );
                        self.interceptor_.check( self );
                    }
                }
            } catch ( e ) {
                self.handleError_( e );
            }
        }
        then();
    }
    loop();
    return achievedSync;
};

VM.prototype.loadCurrentContext = function () {
    this.currentLc = this.peekL();
    this.currentParams = this.params[ this.ip ];
};

VM.prototype.hasInstructions = function () {
    return this.ipThreshold <= this.ip;
};

VM.prototype.lastCommonAncestor = function ( other ) {
    for ( var i = 0; i < this.ip; i++ )
        if ( this.ins[ i ] !== other.ins[ i ] )
            return i - 1;
    return this.ip;
};

VM.prototype.gatherFinallies = function ( oldIP ) {
    var instructions = [];
    var lexClosures = [];
    
    while ( oldIP < this.ip ) {
        var nextInstruction = this.peekI().car();
        if ( nextInstruction.implementsFinally ) {
            instructions.push( this.peekI() );
            lexClosures.push( this.peekL() );
        }
        this.popFrame();
    }
    
    return [ instructions, lexClosures ];
};

VM.prototype.handleError_ = function ( e ) {
    var stackTrace = [];
    var instructions = [];
    var lexClosures = [];
    
    while ( this.ipThreshold <= this.ip ) {
        // ASYNC PORT NOTE: This local variable didn't exist in Java.
        var firstI = this.peekI().car();
        // ASYNC PORT TODO: This just checked "instanceof Catch" in
        // the original. Get this extension into the original.
        if ( firstI.implementsOnError && firstI.catches( e ) )
            break;
        
        var nextInstruction = this.peekI().car();
        if ( nextInstruction.implementsFinally ) {
            instructions.push( this.peekI() );
            lexClosures.push( this.peekL() );
        }
        if ( nextInstruction instanceof Instruction ) {
            var instructionOwner = this.peekI().car().owner();
            if ( instructionOwner !== null )
                stackTrace.push( instructionOwner );
        }
        this.popFrame();
    }
    
    this.error_ = new ArcException( e, this.operating_, stackTrace );
    
    for ( var i = instructions.length - 1; 0 <= i; i-- )
        this.pushInvocation2( lexClosures[ i ], instructions[ i ] );
};

VM.prototype.die = function () {
    this.dead_ = true;
    var instructions = [];
    var lexClosures = [];
    
    while ( 0 <= this.ip ) {
        if ( this.peekI().car().implementsFinally ) {
            instructions.push( this.peekI() );
            lexClosures.push( this.peekL() );
        }
        this.popFrame();
    }
    
    for ( var i = instructions.length - 1; 0 <= i; i-- )
        this.pushInvocation2( lexClosures[ i ], instructions[ i ] );
};

VM.prototype.error = function () {
    return this.error_;
};

VM.prototype.show = function () {
    System_out_println( "Thread Dump for thread#" + threadId );
    System_out_println( "" + (this.ap + 1) + " args" );
    this.showArgs_();
    System_out_println();
    var fc = this.ip + 1;
    if ( this.ins[ this.ip ] instanceof Nil )
        fc = this.ip;
    System_out_println( "" + fc + " instruction frames" );
    this.showInstructions_();
};

VM.prototype.popFrame = function () {
    this.ip--;
};

VM.prototype.pushFrame = function ( i ) {
    if ( this.ipThreshold <= this.ip
        && this.peekI() instanceof Nil ) {
        this.ins[ this.ip ] = new Pair( i, ArcObject.NIL );
    } else {
        this.ip++;
        // PORT NOTE: In Java, this was handled by catching
        // ArrayIndexOutOfBoundsException.
        if ( 0 <= this.ip && this.ip < this.ins.length ) {
            this.ins[ this.ip ] = new Pair( i, ArcObject.NIL );
        } else {
            this.newInstructionArray_( this.ins.length * 2 );
            this.newClosureArray_( this.lcs.length * 2 );
            this.newParamsArray_( this.params.length * 2 );
            this.ins[ this.ip ] = new Pair( i, ArcObject.NIL );
        }
    }
};

// PORT TODO: Rename all uses of pushInvocation.
VM.prototype.pushInvocation2 = function ( lc, instructions ) {
    if ( this.ipThreshold <= this.ip
        && this.peekI() instanceof Nil ) {
        this.ins[ this.ip ] = instructions;
        this.lcs[ this.ip ] = lc;
    } else {
        this.ip++;
        // PORT NOTE: In Java, this was handled by catching
        // ArrayIndexOutOfBoundsException.
        if ( 0 <= this.ip && this.ip < this.ins.length ) {
            this.ins[ this.ip ] = instructions;
            this.lcs[ this.ip ] = lc;
        } else {
            this.newInstructionArray_( this.ins.length * 2 );
            this.newClosureArray_( this.lcs.length * 2 );
            this.newParamsArray_( this.params.length * 2 );
            this.ins[ this.ip ] = instructions;
            this.lcs[ this.ip ] = lc;
        }
    }
};

VM.prototype.pushInvocation3 = function ( lc, instructions, args ) {
    if ( this.ipThreshold <= this.ip
        && this.peekI() instanceof Nil ) {
        this.ins[ this.ip ] = instructions;
        this.lcs[ this.ip ] = lc;
        this.params[ this.ip ] = args;
    } else {
        this.ip++;
        // PORT NOTE: In Java, this was handled by catching
        // ArrayIndexOutOfBoundsException.
        if ( 0 <= this.ip && this.ip < this.ins.length ) {
            this.ins[ this.ip ] = instructions;
            this.lcs[ this.ip ] = lc;
            this.params[ this.ip ] = args;
        } else {
            this.newInstructionArray_( this.ins.length * 2 );
            this.newClosureArray_( this.lcs.length * 2 );
            this.newParamsArray_( this.params.length * 2 );
            this.ins[ this.ip ] = instructions;
            this.lcs[ this.ip ] = lc;
            this.params[ this.ip ] = args;
        }
    }
};

VM.prototype.pushConditional = function ( instructions ) {
    if ( this.ipThreshold <= this.ip
        && this.peekI() instanceof Nil ) {
        this.ins[ this.ip ] = instructions;
    } else {
        this.ip++;
        // PORT NOTE: In Java, this was handled by catching
        // ArrayIndexOutOfBoundsException.
        if ( 0 <= this.ip && this.ip < this.ins.length ) {
            this.ins[ this.ip ] = instructions;
            this.lcs[ this.ip ] = this.currentLc;
            this.params[ this.ip ] = this.currentParams;
        } else {
            this.newInstructionArray_( this.ins.length * 2 );
            this.newClosureArray_( this.lcs.length * 2 );
            this.newParamsArray_( this.params.length * 2 );
            this.ins[ this.ip ] = instructions;
            this.lcs[ this.ip ] = this.currentLc;
            this.params[ this.ip ] = this.currentParams;
        }
    }
};

VM.prototype.peekI = function () {
    return this.ins[ this.ip ];
};

VM.prototype.peekL = function () {
    return this.lcs[ this.ip ];
};

VM.prototype.param = function ( index ) {
    return this.currentParams[ index ];
};

VM.prototype.pushParam = function ( index ) {
    this.ap++;
    // PORT NOTE: In Java, this was handled by catching
    // ArrayIndexOutOfBoundsException.
    if ( 0 <= this.ap && this.ap < this.args.length ) {
        this.args[ this.ap ] = this.currentParams[ index ];
    } else {
        this.newArgArray_( this.args.length * 2 );
        this.args[ this.ap ] = this.currentParams[ index ];
    }
};

VM.prototype.pushA = function ( arg ) {
    this.ap++;
    // PORT NOTE: In Java, this was handled by catching
    // ArrayIndexOutOfBoundsException.
    if ( 0 <= this.ap && this.ap < this.args.length ) {
        this.args[ this.ap ] = arg;
    } else {
        this.newArgArray_( this.args.length * 2 );
        this.args[ this.ap ] = arg;
    }
};

VM.prototype.peekA = function () {
    return this.args[ this.ap ];
};

VM.prototype.popA = function () {
    return this.args[ this.ap-- ];
};

VM.prototype.popArgs = function ( argCount ) {
    var result = ArcObject.EMPTY_LIST;
    for ( var i = 0; i < argCount; i++ ) {
        var arg = this.args[ this.ap - i ];
        result = new Pair( arg, result );
    }
    this.ap -= argCount;
    return result;
};

VM.prototype.showArgs_ = function () {
    var start = 5 < this.ap ? this.ap - 5 : 0;
    for ( var i = start; i < this.ap + 1; i++ )
        System_out_println( "" + i + ". " + this.args[ i ] );
};

VM.prototype.showInstructions_ = function () {
    var end = 20 < this.ip ? this.ip - 20 : 0;
    for ( var i = this.ip; end <= i; i-- )
        if ( !(this.ins[ i ] instanceof Nil) )
            this.showFrame_( i );
};

VM.prototype.showFrame_ = function ( frame ) {
    var instructions = this.ins[ frame ];
    var lc = this.lcs[ frame ];
    var stk = this.params[ frame ];
    // PORT NOTE: This local variable didn't exist in Java.
    System_out_print( "\nInstruction Frame " + frame + ":" );
    while ( !(instructions instanceof Nil) ) {
        var i = instructions.car();
        // PORT NOTE: This was a cast in Java.
        if ( !(i instanceof Instruction) )
            throw new TypeError();
        instructions = instructions.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(newInstructions instanceof Pair) )
            throw new TypeError();
        System_out_print( i.toStringWithLc( lc ) );
        System_out_print( " " );
    }
    System_out_print( "[" );
    for ( var i = 0, len = stk.length; i < len; i++ )
        System_out_print( "" + stk[ i ] + " " );
    System_out_print( "]" );
    System_out_println0();
};

VM.prototype.lc = function () {
    return this.currentLc;
};

VM.prototype.clearError = function () {
    this.error_ = null;
};

// TODO: Rename all uses of VM.ap() and VM.ap( int ).
VM.prototype.getAp = function () {
    return this.ap;
};

VM.prototype.setAp = function ( ap ) {
    this.ap = ap;
};

VM.prototype.setInterceptor = function ( interceptor ) {
    this.interceptor_ = interceptor;
    interceptor.install( this );
};

VM.prototype.type = function () {
    return VM.TYPE;
};

VM.prototype.copy = function () {
    var vm = new VM();
    this.copyTo( vm );
    return vm;
};

VM.prototype.copyTo = function ( vm ) {
    vm.ap = this.ap;
    vm.ip = this.ip;
    if ( vm.ins.length < this.ins.length ) {
        vm.ins = this.ins.slice();
        vm.lcs = this.lcs.slice();
        vm.params = this.params.slice();
    } else {
        this.copyArray_( this.ins, vm.ins );
        this.copyArray_( this.lcs, vm.lcs );
        this.copyArray_( this.params, vm.params );
    }
    
    if ( vm.args.length !== this.args.length ) {
        vm.args = this.args.slice();
    } else {
        this.copyArray_( this.args, vm.args );
    }
    
    vm.currentLc = this.currentLc;
    vm.error_ = this.error_;
    vm.interceptor_ = this.interceptor_;
    vm.dead_ = this.dead_;
    vm.ipThreshold = this.ipThreshold;
};

VM.prototype.dead = function () {
    return this.dead_;
};

VM.prototype.toString = function () {
    return "[thread#" + this.threadId + ": instruction stack " +
        this.ip + "; arg stack " + this.ap + "]";
};

VM.prototype.newArgArray_ = function ( newLength ) {
    var newArgs = new Array( ~~newLength );
    this.copyArray_( this.args, newArgs );
    this.args = newArgs;
};

VM.prototype.newClosureArray_ = function ( newLength ) {
    var newL = new Array( ~~newLength );
    this.copyArray_( this.lcs, newL );
    this.lcs = newL;
};

VM.prototype.newInstructionArray_ = function ( newLength ) {
    var newI = new Array( ~~newLength );
    this.copyArray_( this.ins, newI );
    this.ins = newI;
};

VM.prototype.newParamsArray_ = function ( newLength ) {
    var newP = new Array( ~~newLength );
    this.copyArray_( this.params, newP );
    this.params = newP;
};

VM.prototype.copyArray_ = function ( src, dest ) {
    // PORT TODO: Find an equivalent for this Java.
//    System.arraycopy(src, 0, dest, 0, src.length);
    for ( var i = 0, len = src.length; i < len; i++ )
        dest[ i ] = src[ i ];
};

VM.prototype.nextInstruction = function () {
    if ( !this.hasInstructions() )
        return null;
    
    if ( this.ins[ this.ip ] instanceof Nil ) {
        this.ip--;
        return this.nextInstruction();
    }
    
    return this.ins[ this.ip ].car();
};

VM.TYPE = Symbol.mkSym( "thread" );
VM.threadCount_ = 0;


// ===================================================================
// from vm/instructions/ListBuilder.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Pair

/** @constructor */
function ListBuilder() {
    ArcObject.call( this );
    this.list_ = [];
    this.last_ = ArcObject.NIL;
}

ListBuilder.prototype = new ArcObject();
ListBuilder.prototype.className = "ListBuilder";

ListBuilder.prototype.append = function ( o ) {
    this.list_.push( o );
};

ListBuilder.prototype.appendAll = function ( p ) {
    p.copyTo( this.list_ );
};

ListBuilder.prototype.last = function ( o ) {
    this.last_ = o;
};

ListBuilder.prototype.list = function () {
    return Pair.buildFrom2( this.list_, this.last_ );
};

ListBuilder.prototype.type = function () {
    return Symbol.mkSym( "list-builder" );
};

ListBuilder.prototype.toString = function () {
    return "ListBuilder:" + this.list().toString();
};


// ===================================================================
// from vm/instructions/Append.java
// ===================================================================
// Needed early: Instruction
// Needed late: ListBuilder

/** @constructor */
function Append() {
    Instruction.call( this );
}

Append.prototype = new Instruction();
Append.prototype.className = "Append";

Append.prototype.operate = function ( vm ) {
    var arg = vm.popA();
    var builder = vm.peekA();
    // PORT NOTE: This was a cast in Java.
    if ( !(builder instanceof ListBuilder) )
        throw new TypeError();
    builder.append( arg );
};

Append.prototype.toString = function () {
    return "(append)";
};


// ===================================================================
// from vm/instructions/AppendAll.java
// ===================================================================
// Needed early: Instruction
// Needed late: ListBuilder Pair

/** @constructor */
function AppendAll() {
    Instruction.call( this );
}

AppendAll.prototype = new Instruction();
AppendAll.prototype.className = "AppendAll";

AppendAll.prototype.operate = function ( vm ) {
    var arg = vm.popA();
    var builder = vm.peekA();
    // PORT NOTE: This was a cast in Java.
    if ( !(builder instanceof ListBuilder) )
        throw new TypeError();
    // PORT NOTE: This was a cast in Java.
    if ( !(arg instanceof Pair) )
        throw new TypeError();
    builder.appendAll( arg );
};

AppendAll.prototype.toString = function () {
    return "(append-all)";
};


// ===================================================================
// from vm/instructions/AppendDot.java
// ===================================================================
// Needed early: Instruction
// Needed late: ListBuilder

/** @constructor */
function AppendDot() {
    Instruction.call( this );
}

AppendDot.prototype = new Instruction();
AppendDot.prototype.className = "AppendDot";

AppendDot.prototype.operate = function ( vm ) {
    var arg = vm.popA();
    var builder = vm.peekA();
    // PORT NOTE: This was a cast in Java.
    if ( !(builder instanceof ListBuilder) )
        throw new TypeError();
    builder.last( arg );
};

AppendDot.prototype.toString = function () {
    return "(append-dot)";
};


// ===================================================================
// from vm/instructions/Catch.java
// ===================================================================
// Needed early: Instruction
// Needed late: Pair

/** @constructor */
function Catch( onerr, ap ) {
    Instruction.call( this );
    this.onerr_ = onerr;
    this.ap_ = ap;
}

Catch.prototype = new Instruction();
Catch.prototype.implementsOnError = true;
Catch.prototype.className = "Catch";

// ASYNC PORT NOTE: This method of the OnError interface didn't exist
// in Java. The point is to let certain errors propagate without
// losing their stack traces.
Catch.prototype.catches = function ( error ) {
    return true;
};

Catch.prototype.operate = function ( vm ) {
    var error = vm.error();
    if ( error === null )
        return;
    
    vm.clearError();
    vm.setAp( this.ap_ );
    this.onerr_.invoke( vm, Pair.buildFrom1( [ error ] ) );
};

Catch.prototype.toString = function () {
    return "(catch " + this.onerr_ + ")";
};


// ===================================================================
// from vm/instructions/Close.java
// ===================================================================
// Needed early: Instruction
// Needed late: rainbow.functions.Closure

/** @constructor */
function Close_Instruction( ifn ) {
    Instruction.call( this );
    this.ifn_ = ifn;
}

Close_Instruction.prototype = new Instruction();
Close_Instruction.prototype.className = "Close_Instruction";

Close_Instruction.prototype.operate = function ( vm ) {
    vm.pushA( new Closure( this.ifn_, vm.lc() ) );
};

Close_Instruction.prototype.toString = function () {
    return "(close " + this.ifn_ + ")";
};


// ===================================================================
// from vm/instructions/FinallyInvoke.java
// ===================================================================
// Needed early: Instruction
// Needed late: rainbow.functions.Closure

/** @constructor */
function FinallyInvoke( after ) {
    Instruction.call( this );
    this.after_ = after;
}

FinallyInvoke.prototype = new Instruction();
FinallyInvoke.prototype.implementsFinally = true;
FinallyInvoke.prototype.className = "FinallyInvoke";

FinallyInvoke.prototype.operate = function ( vm ) {
    this.after_.invoke( vm, ArcObject.NIL );
};

FinallyInvoke.prototype.toString = function () {
    return "(finally:" + this.after_ + ")";
};


// ===================================================================
// from vm/instructions/FinishList.java
// ===================================================================
// Needed early: Instruction
// Needed late: ListBuilder

/** @constructor */
function FinishList() {
    Instruction.call( this );
}

FinishList.prototype = new Instruction();
FinishList.prototype.className = "FinishList";

FinishList.prototype.operate = function ( vm ) {
    var builder = vm.popA();
    // PORT NOTE: This was a cast in Java.
    if ( !(builder instanceof ListBuilder) )
        throw new TypeError();
    vm.pushA( builder.list() );
};

FinishList.prototype.toString = function () {
    return "(finish-list)";
};


// ===================================================================
// from vm/instructions/FreeSym.java
// ===================================================================
// Needed early: Instruction

/** @constructor */
function FreeSym( sym ) {
    Instruction.call( this );
    this.sym_ = sym;
}

FreeSym.prototype = new Instruction();
FreeSym.prototype.className = "FreeSym";

FreeSym.prototype.operate = function ( vm ) {
    vm.pushA( this.sym_.value() );
};

FreeSym.prototype.toString = function () {
    return "(free-sym " + this.sym_ + ")";
};

FreeSym.prototype.toStringWithLc = function ( lc ) {
    return "(free-sym " + this.sym_ + " -> " +
        this.symValue( sym ) + ")";
};


// ===================================================================
// from vm/instructions/LexSym.java
// ===================================================================
// Needed early: Instruction
// Needed implicitly: rainbow.vm.interpreter.BoundSymbol

/** @constructor */
function LexSym( sym ) {
    Instruction.call( this );
    this.sym_ = sym;
}

LexSym.prototype = new Instruction();
LexSym.prototype.className = "LexSym";

LexSym.prototype.operate = function ( vm ) {
    vm.pushA( this.sym_.interpret( vm.lc() ) );
};

LexSym.prototype.toString = function () {
    return "(lex-sym " + this.sym_ + ")";
};

LexSym.prototype.toStringWithLc = function ( lc ) {
    return "(lex-sym " + this.sym_ + " -> " +
        this.sym_.interpret( lc ) + ")";
};


// ===================================================================
// from vm/instructions/Listify.java
// ===================================================================
// Needed early: Instruction

/** @constructor */
function Listify( size ) {
    Instruction.call( this );
    this.size_ = size;
}

Listify.prototype = new Instruction();
Listify.prototype.className = "Listify";

Listify.prototype.operate = function ( vm ) {
    vm.pushA( vm.popArgs( this.size_ ) );
};

Listify.prototype.toString = function () {
    return "(listify " + this.size_ + ")";
};


// ===================================================================
// from vm/instructions/Literal.java
// ===================================================================
// Needed early: Instruction

/** @constructor */
function Literal( arg ) {
    Instruction.call( this );
    this.arg_ = arg;
}

Literal.prototype = new Instruction();
Literal.prototype.className = "Literal";

Literal.prototype.operate = function ( vm ) {
    vm.pushA( this.arg_ );
};

Literal.prototype.toString = function () {
    return "(literal " + this.arg_ + ")";
};


// ===================================================================
// from vm/instructions/NewList.java
// ===================================================================
// Needed early: Instruction
// Needed late: ListBuilder

/** @constructor */
function NewList() {
    Instruction.call( this );
}

NewList.prototype = new Instruction();
NewList.prototype.className = "NewList";

NewList.prototype.operate = function ( vm ) {
    vm.pushA( new ListBuilder() );
};

NewList.prototype.toString = function () {
    return "(new-list)";
};


// ===================================================================
// from vm/instructions/PopArg.java
// ===================================================================
// Needed early: Instruction

/** @constructor */
function PopArg( name ) {
    Instruction.call( this );
    this.name_ = name;
}

PopArg.prototype = new Instruction();
PopArg.prototype.className = "PopArg";

PopArg.prototype.operate = function ( vm ) {
    vm.popA();
};

PopArg.prototype.toString = function () {
    return "(pop-arg:" + this.name_ + ")";
};


// ===================================================================
// from vm/instructions/SetThreadLocal.java
// ===================================================================
// Needed early: Instruction

// PORT NOTE: Despite the general-sounding name, this is really just
// used for setting the values of IO.stdIn_ and IO.stdOut_.

/** @constructor */
function SetThreadLocal( tl, value ) {
    Instruction.call( this );
    this.tl_ = tl;
    this.value_ = value;
}

SetThreadLocal.prototype = new Instruction();
SetThreadLocal.prototype.implementsFinally = true;
SetThreadLocal.prototype.className = "SetThreadLocal";

SetThreadLocal.prototype.operate = function ( vm ) {
    this.tl_.value = this.value_;
};


// ===================================================================
// from vm/instructions/StackSym.java
// ===================================================================
// Needed early: Instruction

/** @constructor */
function StackSym( name, index ) {
    Instruction.call( this );
    this.sym_ = name;
    this.index_ = index;
}

StackSym.prototype = new Instruction();
StackSym.prototype.className = "StackSym";

StackSym.prototype.operate = function ( vm ) {
    vm.pushParam( this.index_ );
};

StackSym.prototype.toString = function () {
    return "(stack-bound symbol:" + this.sym_ + ")";
};


// ===================================================================
// from vm/instructions/TableMapper.java
// ===================================================================
// Needed early: Instruction
// Needed late: Pair Nil PopArg

/** @constructor */
function TableMapper( fn ) {
    Instruction.call( this );
    this.fn_ = fn;
}

TableMapper.prototype = new Instruction();
TableMapper.prototype.className = "TableMapper";

TableMapper.prototype.operate = function ( vm ) {
    var list = vm.popA();
    // PORT NOTE: This was a cast in Java.
    if ( !(list instanceof Pair) )
        throw new TypeError();
    if ( !(list instanceof Nil) ) {
        vm.pushA( list.cdr() );
        vm.pushFrame( this );
        var args = list.car();
        // PORT NOTE: This was a cast in Java.
        if ( !(args instanceof Pair) )
            throw new TypeError();
        var i = new PopArg( "map-table-iterator" );
        i.belongsTo( this );
        vm.pushFrame( i );
        this.fn_.invoke( vm, args );
    }
};

TableMapper.prototype.toString = function () {
    return "(table-mapper " + this.fn_ + ")";
};


// ===================================================================
// from vm/instructions/assign/bound/Assign_Lex.java
// ===================================================================
// Needed early: Instruction
// Needed late: BoundSymbol Assign_Lex_Lex StackSymbol
// Assign_Lex_Stack Symbol Assign_Lex_Free Assign_Lex_Literal
// Quotation Assign_Lex_Other

/** @constructor */
function Assign_Lex( name ) {
    Instruction.call( this );
    this.name = name;
}

Assign_Lex.prototype = new Instruction();
Assign_Lex.prototype.className = "Assign_Lex";

Assign_Lex.addInstructions = function ( i, name, expr, last ) {
    if ( expr instanceof BoundSymbol )
        Assign_Lex_Lex.addInstructions( i, name, expr, last );
    else if ( expr instanceof StackSymbol )
        Assign_Lex_Stack.addInstructions( i, name, expr, last );
    else if ( expr instanceof Symbol )
        Assign_Lex_Free.addInstructions( i, name, expr, last );
    else if ( expr.literal() )
        Assign_Lex_Literal.addInstructions( i, name, expr, last );
    else if ( expr instanceof Quotation )
        Assign_Lex_Literal.addInstructions(
            i, name, expr.quoted(), last );
    else
        Assign_Lex_Other.addInstructions( i, name, expr, last );
};


// ===================================================================
// from vm/instructions/assign/bound/Assign_Lex_Free.java
// ===================================================================
// Needed early: Assign_Lex

/** @constructor */
function Assign_Lex_Free( name, symbol ) {
    Assign_Lex.call( this, name );
    this.value = symbol;
}

Assign_Lex_Free.prototype = new Assign_Lex();
Assign_Lex_Free.prototype.className = "Assign_Lex_Free";

Assign_Lex_Free.prototype.operate = function ( vm ) {
    var v = this.value.value();
    this.name.setSymbolValue( vm.lc(), v );
    vm.pushA( v );
};

Assign_Lex_Free.addInstructions = function ( i, name, symbol, last ) {
    if ( last )
        i.push( new Assign_Lex_Free( name, symbol ) );
    else
        i.push( new Assign_Lex_Free.Intermediate( name, symbol ) );
};

Assign_Lex_Free.prototype.toString = function () {
    return "(assign-lex " + this.name + " " + this.value + ")";
};

/** @constructor */
Assign_Lex_Free.Intermediate = function ( name, value ) {
    Assign_Lex_Free.call( this, name, value );
};

Assign_Lex_Free.Intermediate.prototype = new Assign_Lex_Free();
Assign_Lex_Free.Intermediate.prototype.className =
    "Assign_Lex_Free.Intermediate";

Assign_Lex_Free.Intermediate.prototype.operate = function ( vm ) {
    this.name.setSymbolValue( vm.lc(), this.value.value() );
};


// ===================================================================
// from vm/instructions/assign/bound/Assign_Lex_Lex.java
// ===================================================================
// Needed early: Assign_Lex

/** @constructor */
function Assign_Lex_Lex( name, value ) {
    Assign_Lex.call( this, name );
    this.value = value;
}

Assign_Lex_Lex.prototype = new Assign_Lex();
Assign_Lex_Lex.prototype.className = "Assign_Lex_Lex";

Assign_Lex_Lex.prototype.operate = function ( vm ) {
    var v = this.value.interpret( vm.lc() );
    this.name.setSymbolValue( vm.lc(), v );
    vm.pushA( v );
};

Assign_Lex_Lex.addInstructions = function ( i, name, value, last ) {
    if ( last )
        i.push( new Assign_Lex_Lex( name, value ) );
    else
        i.push( new Assign_Lex_Lex.Intermediate( name, value ) );
};

Assign_Lex_Lex.prototype.toString = function () {
    return "(assign-lex " + this.name + " " + this.value + ")";
};

Assign_Lex_Lex.prototype.toStringWithLc = function ( lc ) {
    return "(assign-lex " +
        this.name + "-->" + this.name.interpret( lc ) +
        this.value + "-->" + this.value.interpret( lc ) + ")";
};

/** @constructor */
Assign_Lex_Lex.Intermediate = function ( name, value ) {
    Assign_Lex_Lex.call( this, name, value );
};

Assign_Lex_Lex.Intermediate.prototype = new Assign_Lex_Lex();
Assign_Lex_Lex.Intermediate.prototype.className =
    "Assign_Lex_Lex.Intermediate";

Assign_Lex_Lex.Intermediate.prototype.operate = function ( vm ) {
    this.name.setSymbolValue(
        vm.lc(), this.value.interpret( vm.lc() ) );
};


// ===================================================================
// from vm/instructions/assign/bound/Assign_Lex_Literal.java
// ===================================================================
// Needed early: Assign_Lex

/** @constructor */
function Assign_Lex_Literal( name, expr ) {
    Assign_Lex.call( this, name );
    this.expr = expr;
}

Assign_Lex_Literal.prototype = new Assign_Lex();
Assign_Lex_Literal.prototype.className = "Assign_Lex_Literal";

Assign_Lex_Literal.prototype.operate = function ( vm ) {
    this.name.setSymbolValue( vm.lc(), this.expr );
    vm.pushA( this.expr );
};

Assign_Lex_Literal.addInstructions = function (
    i, name, expr, last ) {
    
    if ( last )
        i.push( new Assign_Lex_Literal( name, expr ) );
    else
        i.push( new Assign_Lex_Literal.Intermediate( name, expr ) );
};

Assign_Lex_Literal.prototype.toString = function () {
    return "(assign-lex " + this.name + " " + this.expr + ")";
};

/** @constructor */
Assign_Lex_Literal.Intermediate = function ( name, value ) {
    Assign_Lex_Literal.call( this, name, value );
};

Assign_Lex_Literal.Intermediate.prototype = new Assign_Lex_Literal();
Assign_Lex_Literal.Intermediate.prototype.className =
    "Assign_Lex_Literal.Intermediate";

Assign_Lex_Literal.Intermediate.prototype.operate = function ( vm ) {
    this.name.setSymbolValue( vm.lc(), this.expr );
};


// ===================================================================
// from vm/instructions/assign/bound/Assign_Lex_Other.java
// ===================================================================
// Needed early: Assign_Lex

/** @constructor */
function Assign_Lex_Other( name ) {
    Assign_Lex.call( this, name );
}

Assign_Lex_Other.prototype = new Assign_Lex();
Assign_Lex_Other.prototype.className = "Assign_Lex_Other";

Assign_Lex_Other.prototype.operate = function ( vm ) {
    this.name.setSymbolValue( vm.lc(), vm.peekA() );
};

Assign_Lex_Other.prototype.toString = function () {
    return "(assign-lex " + this.name + ")";
};

Assign_Lex_Other.prototype.toStringWithLc = function ( lc ) {
    return "(assign-lex " + this.name + " -> " +
        this.name.interpret( lc ) + ")";
};

Assign_Lex_Other.addInstructions = function ( i, name, expr, last ) {
    expr.addInstructions( i );
    if ( last )
        i.push( new Assign_Lex_Other( name ) );
    else
        i.push( new Assign_Lex_Other.Intermediate( name ) );
};

/** @constructor */
Assign_Lex_Other.Intermediate = function ( name ) {
    Assign_Lex_Other.call( this, name );
};

Assign_Lex_Other.Intermediate.prototype = new Assign_Lex_Other();
Assign_Lex_Other.Intermediate.prototype.className =
    "Assign_Lex_Other.Intermediate";

Assign_Lex_Other.Intermediate.prototype.operate = function ( vm ) {
    this.name.setSymbolValue( vm.lc(), vm.popA() );
};


// ===================================================================
// from vm/instructions/assign/bound/Assign_Lex_Stack.java
// ===================================================================
// Needed early: Assign_Lex

/** @constructor */
function Assign_Lex_Stack( name, value ) {
    Assign_Lex.call( this, name );
    this.value = value;
}

Assign_Lex_Stack.prototype = new Assign_Lex();
Assign_Lex_Stack.prototype.className = "Assign_Lex_Stack";

Assign_Lex_Stack.prototype.operate = function ( vm ) {
    var v = this.value.get( vm );
    this.name.setSymbolValue( vm.lc(), v );
    vm.pushA( v );
};

Assign_Lex_Stack.addInstructions = function ( i, name, value, last ) {
    if ( last )
        i.push( new Assign_Lex_Stack( name, value ) );
    else
        i.push( new Assign_Lex_Stack.Intermediate( name, value ) );
};

Assign_Lex_Stack.prototype.toString = function () {
    return "(assign-lex " + this.name + " " + this.value + ")";
};

Assign_Lex_Stack.prototype.toStringWithLc = function ( lc ) {
    return "(assign-lex " +
        this.name + "-->" + this.name.interpret( lc ) + " <-- " +
        this.value + ")";
};

/** @constructor */
Assign_Lex_Stack.Intermediate = function ( name, value ) {
    Assign_Lex_Stack.call( this, name, value );
};

Assign_Lex_Stack.Intermediate.prototype = new Assign_Lex_Stack();
Assign_Lex_Stack.Intermediate.prototype.className =
    "Assign_Lex_Stack.Intermediate";

Assign_Lex_Stack.Intermediate.prototype.operate = function ( vm ) {
    this.name.setSymbolValue( vm.lc(), this.value.get( vm ) );
};


// ===================================================================
// from vm/instructions/assign/free/Assign_Free.java
// ===================================================================
// Needed early: Instruction
// Needed late: BoundSymbol Assign_Free_Lex StackSymbol
// Assign_Free_Stack Symbol Assign_Free_Free Assign_Free_Literal
// Quotation Assign_Free_Other

/** @constructor */
function Assign_Free( name ) {
    Instruction.call( this );
    this.name = name;
}

Assign_Free.prototype = new Instruction();
Assign_Free.prototype.className = "Assign_Free";

Assign_Free.addInstructions = function ( i, name, expr, last ) {
    if ( expr instanceof BoundSymbol )
        Assign_Free_Lex.addInstructions( i, name, expr, last );
    else if ( expr instanceof StackSymbol )
        Assign_Free_Stack.addInstructions( i, name, expr, last );
    else if ( expr instanceof Symbol )
        Assign_Free_Free.addInstructions( i, name, expr, last );
    else if ( expr.literal() )
        Assign_Free_Literal.addInstructions( i, name, expr, last );
    else if ( expr instanceof Quotation )
        Assign_Free_Literal.addInstructions(
            i, name, expr.quoted(), last );
    else
        Assign_Free_Other.addInstructions( i, name, expr, last );
};


// ===================================================================
// from vm/instructions/assign/free/Assign_Free_Free.java
// ===================================================================
// Needed early: Assign_Free

/** @constructor */
function Assign_Free_Free( name, symbol ) {
    Assign_Free.call( this, name );
    this.value = symbol;
}

Assign_Free_Free.prototype = new Assign_Free();
Assign_Free_Free.prototype.className = "Assign_Free_Free";

Assign_Free_Free.prototype.operate = function ( vm ) {
    var v = this.value.value();
    this.name.setValue( v );
    vm.pushA( v );
};

Assign_Free_Free.addInstructions = function ( i, name, value, last ) {
    if ( last )
        i.push( new Assign_Free_Free( name, value ) );
    else
        i.push( new Assign_Free_Free.Intermediate( name, value ) );
};

Assign_Free_Free.prototype.toString = function () {
    return "(assign-free-free " + this.name + " " + this.value + ")";
};

/** @constructor */
Assign_Free_Free.Intermediate = function ( name, value ) {
    Assign_Free_Free.call( this, name, value );
};

Assign_Free_Free.Intermediate.prototype = new Assign_Free_Free();
Assign_Free_Free.Intermediate.prototype.className =
    "Assign_Free_Free.Intermediate";

Assign_Free_Free.Intermediate.prototype.operate = function ( vm ) {
    this.name.setValue( this.value.value() );
};


// ===================================================================
// from vm/instructions/assign/free/Assign_Free_Lex.java
// ===================================================================
// Needed early: Assign_Free

/** @constructor */
function Assign_Free_Lex( name, value ) {
    Assign_Free.call( this, name );
    this.value = value;
}

Assign_Free_Lex.prototype = new Assign_Free();
Assign_Free_Lex.prototype.className = "Assign_Free_Lex";

Assign_Free_Lex.prototype.operate = function ( vm ) {
    var v = this.value.interpret( vm.lc() );
    this.name.setValue( v );
    vm.pushA( v );
};

Assign_Free_Lex.addInstructions = function ( i, name, value, last ) {
    if ( last )
        i.push( new Assign_Free_Lex( name, value ) );
    else
        i.push( new Assign_Free_Lex.Intermediate( name, value ) );
};

Assign_Free_Lex.prototype.toString = function () {
    return "(assign-free-lex " + this.name + " " + this.value + ")";
};

/** @constructor */
Assign_Free_Lex.Intermediate = function ( name, value ) {
    Assign_Free_Lex.call( this, name, value );
};

Assign_Free_Lex.Intermediate.prototype = new Assign_Free_Lex();
Assign_Free_Lex.Intermediate.prototype.className =
    "Assign_Free_Lex.Intermediate";

Assign_Free_Lex.Intermediate.prototype.operate = function ( vm ) {
    this.name.setValue( this.value.interpret( vm.lc() ) );
};


// ===================================================================
// from vm/instructions/assign/free/Assign_Free_Literal.java
// ===================================================================
// Needed early: Assign_Free

/** @constructor */
function Assign_Free_Literal( name, expr ) {
    Assign_Free.call( this, name );
    this.expr = expr;
}

Assign_Free_Literal.prototype = new Assign_Free();
Assign_Free_Literal.prototype.className = "Assign_Free_Literal";

Assign_Free_Literal.prototype.operate = function ( vm ) {
    this.name.setValue( this.expr );
    vm.pushA( this.expr );
};

Assign_Free_Literal.addInstructions = function (
    i, name, expr, last ) {
    
    if ( last )
        i.push( new Assign_Free_Literal( name, expr ) );
    else
        i.push( new Assign_Free_Literal.Intermediate( name, expr ) );
};

Assign_Free_Literal.prototype.toString = function () {
    return "(assign-free-literal " + this.name + " " +
        this.expr + ")";
};

/** @constructor */
Assign_Free_Literal.Intermediate = function ( name, expr ) {
    Assign_Free_Literal.call( this, name, expr );
};

Assign_Free_Literal.Intermediate.prototype =
    new Assign_Free_Literal();
Assign_Free_Literal.Intermediate.prototype.className =
    "Assign_Free_Literal.Intermediate";

Assign_Free_Literal.Intermediate.prototype.operate = function ( vm ) {
    this.name.setValue( this.expr );
};


// ===================================================================
// from vm/instructions/assign/free/Assign_Free_Other.java
// ===================================================================
// Needed early: Assign_Free

/** @constructor */
function Assign_Free_Other( name ) {
    Assign_Free.call( this, name );
}

Assign_Free_Other.prototype = new Assign_Free();
Assign_Free_Other.prototype.className = "Assign_Free_Other";

Assign_Free_Other.prototype.operate = function ( vm ) {
    this.name.setValue( vm.peekA() );
};

Assign_Free_Other.prototype.toString = function () {
    return "(assign-free-other " + this.name + ")";
};

Assign_Free_Other.prototype.toStringWithLc = function ( lc ) {
    return "(assign-free-other " + this.name + " -> " +
        this.symValue( name ) + ")";
};

Assign_Free_Other.addInstructions = function ( i, name, expr, last ) {
    expr.addInstructions( i );
    if ( last )
        i.push( new Assign_Free_Other( name ) );
    else
        i.push( new Assign_Free_Other.Intermediate( name ) );
};

/** @constructor */
Assign_Free_Other.Intermediate = function ( name ) {
    Assign_Free_Other.call( this, name );
};

Assign_Free_Other.Intermediate.prototype = new Assign_Free_Other();
Assign_Free_Other.Intermediate.prototype.className =
    "Assign_Free_Other.Intermediate";

Assign_Free_Other.Intermediate.prototype.operate = function ( vm ) {
    this.name.setValue( vm.popA() );
};


// ===================================================================
// from vm/instructions/assign/free/Assign_Free_Stack.java
// ===================================================================
// Needed early: Assign_Free

/** @constructor */
function Assign_Free_Stack( name, value ) {
    Assign_Free.call( this, name );
    this.value = value;
}

Assign_Free_Stack.prototype = new Assign_Free();
Assign_Free_Stack.prototype.className = "Assign_Free_Stack";

Assign_Free_Stack.prototype.operate = function ( vm ) {
    var v = this.value.get( vm );
    this.name.setValue( v );
    vm.pushA( v );
};

Assign_Free_Stack.addInstructions = function (
    i, name, value, last ) {
    
    if ( last )
        i.push( new Assign_Free_Stack( name, value ) );
    else
        i.push( new Assign_Free_Stack.Intermediate( name, value ) );
};

Assign_Free_Stack.prototype.toString = function () {
    return "(assign-free-stack " + this.name + " " + this.value + ")";
};

/** @constructor */
Assign_Free_Stack.Intermediate = function ( name, value ) {
    Assign_Free_Stack.call( this, name, value );
};

Assign_Free_Stack.Intermediate.prototype = new Assign_Free_Stack();
Assign_Free_Stack.Intermediate.prototype.className =
    "Assign_Free_Stack.Intermediate";

Assign_Free_Stack.Intermediate.prototype.operate = function ( vm ) {
    this.name.setValue( this.value.get( vm ) );
};


// ===================================================================
// from vm/instructions/assign/stack/Assign_Stack.java
// ===================================================================
// Needed early: Instruction
// Needed late: BoundSymbol Assign_Stack_Lex StackSymbol
// Assign_Stack_Stack Symbol Assign_Stack_Free Assign_Stack_Literal
// Quotation Assign_Stack_Other

/** @constructor */
function Assign_Stack( name ) {
    Instruction.call( this );
    this.name = name;
}

Assign_Stack.prototype = new Instruction();
Assign_Stack.prototype.className = "Assign_Stack";

Assign_Stack.addInstructions = function ( i, name, expr, last ) {
    if ( expr instanceof BoundSymbol )
        Assign_Stack_Lex.addInstructions( i, name, expr, last );
    else if ( expr instanceof StackSymbol )
        Assign_Stack_Stack.addInstructions( i, name, expr, last );
    else if ( expr instanceof Symbol )
        Assign_Stack_Free.addInstructions( i, name, expr, last );
    else if ( expr.literal() )
        Assign_Stack_Literal.addInstructions( i, name, expr, last );
    else if ( expr instanceof Quotation )
        Assign_Stack_Literal.addInstructions(
            i, name, expr.quoted(), last );
    else
        Assign_Stack_Other.addInstructions( i, name, expr, last );
};


// ===================================================================
// from vm/instructions/assign/stack/Assign_Stack_Free.java
// ===================================================================
// Needed early: Assign_Stack

/** @constructor */
function Assign_Stack_Free( name, symbol ) {
    Assign_Stack.call( this, name );
    this.value = symbol;
}

Assign_Stack_Free.prototype = new Assign_Stack();
Assign_Stack_Free.prototype.className = "Assign_Stack_Free";

Assign_Stack_Free.prototype.operate = function ( vm ) {
    var v = this.value.value();
    this.name.set( vm, v );
    vm.pushA( v );
};

Assign_Stack_Free.addInstructions = function (
    i, name, value, last ) {
    
    if ( last )
        i.push( new Assign_Stack_Free( name, value ) );
    else
        i.push( new Assign_Stack_Free.Intermediate( name, value ) );
};

Assign_Stack_Free.prototype.toString = function () {
    return "(assign-free " + this.name + " " + this.value + ")";
};

/** @constructor */
Assign_Stack_Free.Intermediate = function ( name, value ) {
    Assign_Stack_Free.call( this, name, value );
};

Assign_Stack_Free.Intermediate.prototype = new Assign_Stack_Free();
Assign_Stack_Free.Intermediate.prototype.className =
    "Assign_Stack_Free.Intermediate";

Assign_Stack_Free.Intermediate.prototype.operate = function ( vm ) {
    this.name.set( vm, this.value.value() );
};


// ===================================================================
// from vm/instructions/assign/stack/Assign_Stack_Lex.java
// ===================================================================
// Needed early: Assign_Stack

/** @constructor */
function Assign_Stack_Lex( name, value ) {
    Assign_Stack.call( this, name );
    this.value = value;
}

Assign_Stack_Lex.prototype = new Assign_Stack();
Assign_Stack_Lex.prototype.className = "Assign_Stack_Lex";

Assign_Stack_Lex.prototype.operate = function ( vm ) {
    var v = this.value.interpret( vm.lc() );
    this.name.set( vm, v );
    vm.pushA( v );
};

Assign_Stack_Lex.addInstructions = function ( i, name, value, last ) {
    if ( last )
        i.push( new Assign_Stack_Lex( name, value ) );
    else
        i.push( new Assign_Stack_Lex.Intermediate( name, value ) );
};

Assign_Stack_Lex.prototype.toString = function () {
    return "(assign-free " + this.name + " " + this.value + ")";
};

/** @constructor */
Assign_Stack_Lex.Intermediate = function ( name, value ) {
    Assign_Stack_Lex.call( this, name, value );
};

Assign_Stack_Lex.Intermediate.prototype = new Assign_Stack_Lex();
Assign_Stack_Lex.Intermediate.prototype.className =
    "Assign_Stack_Lex.Intermediate";

Assign_Stack_Lex.Intermediate.prototype.operate = function ( vm ) {
    this.name.set( vm, this.value.interpret( vm.lc() ) );
};


// ===================================================================
// from vm/instructions/assign/stack/Assign_Stack_Literal.java
// ===================================================================
// Needed early: Assign_Stack

/** @constructor */
function Assign_Stack_Literal( name, value ) {
    Assign_Stack.call( this, name );
    this.value = value;
}

Assign_Stack_Literal.prototype = new Assign_Stack();
Assign_Stack_Literal.prototype.className = "Assign_Stack_Literal";

Assign_Stack_Literal.prototype.operate = function ( vm ) {
    this.name.set( vm, this.value );
    vm.pushA( this.value );
};

Assign_Stack_Literal.addInstructions = function (
    i, name, value, last ) {
    
    if ( last )
        i.push( new Assign_Stack_Literal( name, value ) );
    else
        i.push(
            new Assign_Stack_Literal.Intermediate( name, value ) );
};

Assign_Stack_Literal.prototype.toString = function () {
    return "(assign-free " + this.name + " " + this.value + ")";
};

/** @constructor */
Assign_Stack_Literal.Intermediate = function ( name, value ) {
    Assign_Stack_Literal.call( this, name, value );
};

Assign_Stack_Literal.Intermediate.prototype =
    new Assign_Stack_Literal();
Assign_Stack_Literal.Intermediate.prototype.className =
    "Assign_Stack_Literal.Intermediate";

Assign_Stack_Literal.Intermediate.prototype.operate = function (
    vm ) {
    
    this.name.set( vm, this.value );
};


// ===================================================================
// from vm/instructions/assign/stack/Assign_Stack_Other.java
// ===================================================================
// Needed early: Assign_Stack

/** @constructor */
function Assign_Stack_Other( name ) {
    Assign_Stack.call( this, name );
}

Assign_Stack_Other.prototype = new Assign_Stack();
Assign_Stack_Other.prototype.className = "Assign_Stack_Other";

Assign_Stack_Other.prototype.operate = function ( vm ) {
    this.name.set( vm, vm.peekA() );
};

Assign_Stack_Other.prototype.toString = function () {
    return "(assign-stack " + this.name + ")";
};

Assign_Stack_Other.addInstructions = function (
    i, name, expr, last ) {
    
    expr.addInstructions( i );
    if ( last )
        i.push( new Assign_Stack_Other( name ) );
    else
        i.push( new Assign_Stack_Other.Intermediate( name ) );
};

/** @constructor */
Assign_Stack_Other.Intermediate = function ( name ) {
    Assign_Stack_Other.call( this, name );
};

Assign_Stack_Other.Intermediate.prototype = new Assign_Stack_Other();
Assign_Stack_Other.Intermediate.prototype.className =
    "Assign_Stack_Other.Intermediate";

Assign_Stack_Other.Intermediate.prototype.operate = function ( vm ) {
    this.name.set( vm, vm.popA() );
};


// ===================================================================
// from vm/instructions/assign/stack/Assign_Stack_Stack.java
// ===================================================================
// Needed early: Assign_Stack

/** @constructor */
function Assign_Stack_Stack( name, value ) {
    Assign_Stack.call( this, name );
    this.value = value;
}

Assign_Stack_Stack.prototype = new Assign_Stack();
Assign_Stack_Stack.prototype.className = "Assign_Stack_Stack";

Assign_Stack_Stack.prototype.operate = function ( vm ) {
    var v = this.value.get( vm );
    this.name.set( vm, v );
    vm.pushA( v );
};

Assign_Stack_Stack.addInstructions = function (
    i, name, value, last ) {
    
    if ( last )
        i.push( new Assign_Stack_Stack( name, value ) );
    else
        i.push( new Assign_Stack_Stack.Intermediate( name, value ) );
};

Assign_Stack_Stack.prototype.toString = function () {
    return "(assign-free " + this.name + " " + this.value + ")";
};

/** @constructor */
Assign_Stack_Stack.Intermediate = function ( name, value ) {
    Assign_Stack_Stack.call( this, name, value );
};

Assign_Stack_Stack.Intermediate.prototype = new Assign_Stack_Stack();
Assign_Stack_Stack.Intermediate.prototype.className =
    "Assign_Stack_Stack.Intermediate";

Assign_Stack_Stack.Intermediate.prototype.operate = function ( vm ) {
    this.name.set( vm, this.value.get( vm ) );
};


// ===================================================================
// from vm/instructions/assign/cond/Cond.java
// ===================================================================
// Needed early: Instruction
// Needed late: Nil

/** @constructor */
function Cond( thenExpr, elseExpr, sig ) {
    Instruction.call( this );
    this.thenExpr_ = thenExpr;
    this.thenInstructions_ = Cond.instructionsFor( thenExpr );
    this.elseExpr_ = elseExpr;
    this.elseInstructions_ = Cond.instructionsFor( elseExpr );
}

Cond.prototype = new Instruction();
Cond.prototype.className = "Cond";

Cond.instructionsFor = function ( expr ) {
    var list = [];
    expr.addInstructions( list );
    return Pair.buildFrom1( list );
};

Cond.prototype.operate = function ( vm ) {
    vm.pushConditional( vm.popA() instanceof Nil ?
        this.elseInstructions_ : this.thenInstructions_ );
};

Cond.prototype.visit = function ( v ) {
    Instruction.prototype.visit.call( this, v );
    this.thenInstructions_.visit( v );
    this.elseInstructions_.visit( v );
};

Cond.prototype.toString = function () {
    return "(cond then:" + this.thenExpr_ + ", " +
        "else:" + this.elseExpr_ + ")";
};


// ===================================================================
// from vm/instructions/cond/optimise/If_bound_bound_literal.java
// ===================================================================
// Needed early: Instruction
// Needed late: Nil BoundSymbol rainbow.vm.interpreter.Else

/** @constructor */
function If_bound_bound_literal( ifExpr, thenExpr, elseExpr ) {
    Instruction.call( this );
    this.ifExpr_ = ifExpr;
    this.thenExpr_ = thenExpr;
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_bound_bound_literal" ] = If_bound_bound_literal;

If_bound_bound_literal.prototype = new Instruction();
If_bound_bound_literal.prototype.className = "If_bound_bound_literal";

If_bound_bound_literal.prototype.operate = function ( vm ) {
    if ( this.ifExpr_.interpret( vm.lc() ) instanceof Nil )
        vm.pushA( this.elseExpr_ );
    else
        vm.pushA( this.thenExpr_.interpret( vm.lc() ) );
};

If_bound_bound_literal[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(ifExpr instanceof BoundSymbol) )
        throw new TypeError();
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(thenExpr instanceof BoundSymbol) )
        throw new TypeError();
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(elseExpr instanceof Else) )
        throw new TypeError();
    if ( ifExpr.isSameBoundSymbol( thenExpr ) ) {
        if ( elseExpr.ifExpression instanceof Nil )
            ifExpr.addInstructions( i );
        else
            i.push( new If_bound_bound_literal.Or(
                ifExpr, elseExpr.ifExpression ) );
    } else {
        i.push( new If_bound_bound_literal(
            ifExpr, thenExpr, elseExpr.ifExpression ) );
    }
};

If_bound_bound_literal.prototype.toString = function () {
    return "(if " + this.ifExpr_ + " " + this.thenExpr_ + " " +
        this.elseExpr_ + ")";
};

/** @constructor */
If_bound_bound_literal.Or = function ( a, elseExpr ) {
    Instruction.call( this );
    this.a_ = a;
    this.elseExpr_ = elseExpr;
};

If_bound_bound_literal.Or.prototype = new Instruction();
If_bound_bound_literal.Or.prototype.className =
    "If_bound_bound_literal.Or";

If_bound_bound_literal.Or.prototype.operate = function ( vm ) {
    var cond = this.a_.interpret( vm.lc() );
    if ( cond instanceof Nil )
        vm.pushA( this.elseExpr_ );
    else
        vm.pushA( cond );
};

If_bound_bound_literal.Or.prototype.toString = function () {
    return "(if[bbl$or] " + a + " " + a + " " + elseExpr + ")";
};


// ===================================================================
// from vm/instructions/cond/optimise/If_bound_bound_other.java
// ===================================================================
// Needed early: Instruction
// Needed late: Cond Nil BoundSymbol

/** @constructor */
function If_bound_bound_other( ifExpr, thenExpr, elseExpr ) {
    Instruction.call( this );
    this.ifExpr_ = ifExpr;
    this.thenExpr_ = thenExpr;
    this.elseInstructions_ = Cond.instructionsFor( elseExpr );
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_bound_bound_other" ] = If_bound_bound_other;

If_bound_bound_other.prototype = new Instruction();
If_bound_bound_other.prototype.className = "If_bound_bound_other";

If_bound_bound_other.prototype.operate = function ( vm ) {
    if ( this.ifExpr_.interpret( vm.lc() ) instanceof Nil )
        vm.pushConditional( this.elseInstructions_ );
    else
        vm.pushA( this.thenExpr_.interpret( vm.lc() ) );
};

If_bound_bound_other[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(ifExpr instanceof BoundSymbol) )
        throw new TypeError();
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(thenExpr instanceof BoundSymbol) )
        throw new TypeError();
    if ( ifExpr.isSameBoundSymbol( thenExpr ) ) {
        i.push( new If_bound_bound_other.Or( ifExpr, elseExpr ) );
    } else {
        i.push( new If_bound_bound_other(
            ifExpr, thenExpr, elseExpr ) );
    }
};

If_bound_bound_other.prototype.visit = function ( v ) {
    Instruction.prototype.visit.call( this, v );
    this.elseInstructions_.visit( v );
};

If_bound_bound_other.prototype.toString = function () {
    return "(if " + this.ifExpr_ + " " + this.thenExpr_ + " " +
        this.elseExpr_ + ")";
};

/** @constructor */
If_bound_bound_other.Or = function ( a, elseExpr ) {
    Instruction.call( this );
    this.a_ = a;
    this.elseInstructions_ = Cond.instructionsFor( elseExpr );
    this.elseExpr_ = elseExpr;
};

If_bound_bound_other.Or.prototype = new Instruction();
If_bound_bound_other.Or.prototype.className =
    "If_bound_bound_other.Or";

If_bound_bound_other.Or.prototype.operate = function ( vm ) {
    var cond = this.a_.interpret( vm.lc() );
    if ( cond instanceof Nil )
        vm.pushConditional( this.elseInstructions_ );
    else
        vm.pushA( cond );
};

If_bound_bound_other.Or.prototype.visit = function ( v ) {
    Instruction.prototype.visit.call( this, v );
    this.elseInstructions_.visit( v );
};

If_bound_bound_other.Or.prototype.toString = function () {
    return "(if " + a + " " + a + " " + elseExpr + ")";
};


// ===================================================================
// from vm/instructions/cond/optimise/If_bound_literal_literal.java
// ===================================================================
// Needed early: Instruction
// Needed late: Nil rainbow.vm.interpreter.Else BoundSymbol

/** @constructor */
function If_bound_literal_literal( ifExpr, thenExpr, elseExpr ) {
    Instruction.call( this );
    this.ifExpr_ = ifExpr;
    this.thenExpr_ = thenExpr;
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_bound_literal_literal" ] = If_bound_literal_literal;

If_bound_literal_literal.prototype = new Instruction();
If_bound_literal_literal.prototype.className =
    "If_bound_literal_literal";

If_bound_literal_literal.prototype.operate = function ( vm ) {
    if ( this.ifExpr_.interpret( vm.lc() ) instanceof Nil )
        vm.pushA( this.elseExpr_ );
    else
        vm.pushA( this.thenExpr_ );
};

If_bound_literal_literal.prototype.toString = function () {
    return "(if " + this.ifExpr_ + " " + this.thenExpr_ + " " +
        this.elseExpr_ + ")";
};

If_bound_literal_literal[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(elseExpr instanceof Else) )
        throw new TypeError();
    // PORT NOTE: This was a cast in Java.
    if ( !(ifExpr instanceof BoundSymbol) )
        throw new TypeError();
    i.push( new If_bound_literal_literal(
        ifExpr, thenExpr, elseExpr.ifExpression ) );
};


// ===================================================================
// from vm/instructions/cond/optimise/If_bound_other_literal.java
// ===================================================================
// Needed early: Instruction
// Needed late: Cond Nil BoundSymbol rainbow.vm.interpreter.Else

/** @constructor */
function If_bound_other_literal( ifExpr, thenExpr, elseExpr ) {
    Instruction.call( this );
    this.ifExpr_ = ifExpr;
    this.thenExpr_ = thenExpr;
    this.thenInstructions_ = Cond.instructionsFor( thenExpr );
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_bound_other_literal" ] = If_bound_other_literal;

If_bound_other_literal.prototype = new Instruction();
If_bound_other_literal.prototype.className = "If_bound_other_literal";

If_bound_other_literal.prototype.operate = function ( vm ) {
    if ( this.ifExpr_.interpret( vm.lc() ) instanceof Nil )
        vm.pushA( this.elseExpr_ );
    else
        vm.pushConditional( this.thenInstructions_ );
};

If_bound_other_literal.prototype.toString = function () {
    return "(if " + this.ifExpr_ + " " + this.thenExpr_ + " " +
        this.elseExpr_ + ")";
};

If_bound_other_literal.prototype.visit = function ( v ) {
    Instruction.prototype.visit.call( this, v );
    this.thenInstructions_.visit( v );
};

If_bound_other_literal[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(ifExpr instanceof BoundSymbol) )
        throw new TypeError();
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(elseExpr instanceof Else) )
        throw new TypeError();
    i.push( new If_bound_other_literal(
        ifExpr, thenExpr, elseExpr.ifExpression ) );
};


// ===================================================================
// from vm/instructions/cond/optimise/If_bound_other_other.java
// ===================================================================
// Needed early: Instruction
// Needed late: Cond Nil BoundSymbol

/** @constructor */
function If_bound_other_other( ifExpr, thenExpr, elseExpr ) {
    Instruction.call( this );
    this.ifExpr_ = ifExpr;
    this.thenExpr_ = thenExpr;
    this.thenInstructions_ = Cond.instructionsFor( thenExpr );
    this.elseExpr_ = elseExpr;
    this.elseInstructions_ = Cond.instructionsFor( elseExpr );
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_bound_other_other" ] = If_bound_other_other;

If_bound_other_other.prototype = new Instruction();
If_bound_other_other.prototype.className = "If_bound_other_other";

If_bound_other_other.prototype.operate = function ( vm ) {
    if ( this.ifExpr_.interpret( vm.lc() ) instanceof Nil )
        vm.pushConditional( this.elseInstructions_ );
    else
        vm.pushConditional( this.thenInstructions_ );
};

If_bound_other_other.prototype.toString = function () {
    return "(if " + this.ifExpr_ + " " + this.thenExpr_ + " " +
        this.elseExpr_ + ")";
};

If_bound_other_other.prototype.visit = function ( v ) {
    Instruction.prototype.visit.call( this, v );
    this.thenInstructions_.visit( v );
};

If_bound_other_other[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(ifExpr instanceof BoundSymbol) )
        throw new TypeError();
    i.push( new If_bound_other_other( ifExpr, thenExpr, elseExpr ) );
};


// ===================================================================
// from vm/instructions/cond/optimise/If_other_bound_other.java
// ===================================================================
// Needed early: Instruction
// Needed late: Cond Nil BoundSymbol

/** @constructor */
function If_other_bound_other( thenExpr, elseExpr ) {
    Instruction.call( this );
    this.elseInstructions_ = Cond.instructionsFor( elseExpr );
    this.thenExpr_ = thenExpr;
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_other_bound_other" ] = If_other_bound_other;

If_other_bound_other.prototype = new Instruction();
If_other_bound_other.prototype.className = "If_other_bound_other";

If_other_bound_other.prototype.operate = function ( vm ) {
    if ( vm.popA() instanceof Nil )
        vm.pushConditional( this.elseInstructions_ );
    else
        vm.pushA( this.thenExpr_.interpret( vm.lc() ) );
};

If_other_bound_other.prototype.toString = function () {
    return "(if ? " + this.thenExpr_ + " " + this.elseExpr_ + ")";
};

If_other_bound_other.prototype.visit = function ( v ) {
    Instruction.prototype.visit.call( this, v );
    this.elseInstructions_.visit( v );
};

If_other_bound_other[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    ifExpr.addInstructions( i );
    // PORT NOTE: This was a cast in Java.
    if ( !(thenExpr instanceof BoundSymbol) )
        throw new TypeError();
    i.push( new If_other_bound_other( thenExpr, elseExpr ) );
};


// ===================================================================
// from vm/instructions/cond/optimise/If_other_other_literal.java
// ===================================================================
// Needed early: Instruction
// Needed late: Cond Nil rainbow.vm.interpreter.Else

/** @constructor */
function If_other_other_literal( thenExpr, elseExpr ) {
    Instruction.call( this );
    this.thenInstructions_ = Cond.instructionsFor( thenExpr );
    this.thenExpr_ = thenExpr;
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_other_other_literal" ] = If_other_other_literal;

If_other_other_literal.prototype = new Instruction();
If_other_other_literal.prototype.className = "If_other_other_literal";

If_other_other_literal.prototype.operate = function ( vm ) {
    if ( vm.popA() instanceof Nil )
        vm.pushA( this.elseExpr_ );
    else
        vm.pushConditional( this.thenInstructions_ );
};

If_other_other_literal.prototype.toString = function () {
    return "(if ? " + this.thenExpr_ + " " + this.elseExpr_ + ")";
};

If_other_other_literal.prototype.visit = function ( v ) {
    Instruction.prototype.visit.call( this, v );
    this.thenInstructions_.visit( v );
};

If_other_other_literal[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(elseExpr instanceof Else) )
        throw new TypeError();
    ifExpr.addInstructions( i );
    i.push( new If_other_other_literal(
        thenExpr, elseExpr.ifExpression ) );
};


// ===================================================================
// from vm/instructions/cond/optimise/If_other_stack_literal.java
// ===================================================================
// Needed early: Instruction
// Needed late: Nil rainbow.vm.interpreter.Else StackSymbol

/** @constructor */
function If_other_stack_literal( thenExpr, elseExpr ) {
    Instruction.call( this );
    this.thenExpr_ = thenExpr;
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_other_stack_literal" ] = If_other_stack_literal;

If_other_stack_literal.prototype = new Instruction();
If_other_stack_literal.prototype.className = "If_other_stack_literal";

If_other_stack_literal.prototype.operate = function ( vm ) {
    if ( vm.popA() instanceof Nil )
        vm.pushA( this.elseExpr_ );
    else
        vm.pushA( this.thenExpr_.get( vm ) );
};

If_other_stack_literal.prototype.toString = function () {
    return "(if ? " + this.thenExpr_ + " " + this.elseExpr_ + ")";
};

If_other_stack_literal[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(elseExpr instanceof Else) )
        throw new TypeError();
    ifExpr.addInstructions( i );
    // PORT NOTE: This was a cast in Java.
    if ( !(thenExpr instanceof StackSymbol) )
        throw new TypeError();
    i.push( new If_other_stack_literal(
        thenExpr, elseExpr.ifExpression ) );
};


// ===================================================================
// from vm/instructions/cond/optimise/If_other_stack_other.java
// ===================================================================
// Needed early: Instruction
// Needed late: Cond Nil StackSymbol

/** @constructor */
function If_other_stack_other( thenExpr, elseExpr ) {
    Instruction.call( this );
    this.thenExpr_ = thenExpr;
    this.elseInstructions_ = Cond.instructionsFor( elseExpr );
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_other_stack_other" ] = If_other_stack_other;

If_other_stack_other.prototype = new Instruction();
If_other_stack_other.prototype.className = "If_other_stack_other";

If_other_stack_other.prototype.operate = function ( vm ) {
    if ( vm.popA() instanceof Nil )
        vm.pushConditional( this.elseInstructions_ );
    else
        vm.pushA( this.thenExpr_.get( vm ) );
};

If_other_stack_other.prototype.toString = function () {
    return "(if ? " + this.thenExpr_ + " " + this.elseExpr_ + ")";
};

If_other_stack_other.prototype.visit = function ( v ) {
    Instruction.prototype.visit.call( this, v );
    this.elseInstructions_.visit( v );
};

If_other_stack_other[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    ifExpr.addInstructions( i );
    // PORT NOTE: This was a cast in Java.
    if ( !(thenExpr instanceof StackSymbol) )
        throw new TypeError();
    i.push( new If_other_stack_other( thenExpr, elseExpr ) );
};


// ===================================================================
// from vm/instructions/cond/optimise/If_stack_literal_free.java
// ===================================================================
// Needed early: Instruction
// Needed late: Nil StackSymbol rainbow.vm.interpreter.Else Symbol

/** @constructor */
function If_stack_literal_free( ifExpr, thenExpr, elseExpr ) {
    this.ifExpr_ = ifExpr;
    this.thenExpr_ = thenExpr;
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_stack_literal_free" ] = If_stack_literal_free;

If_stack_literal_free.prototype = new Instruction();
If_stack_literal_free.prototype.className = "If_stack_literal_free";

If_stack_literal_free.prototype.operate = function ( vm ) {
    if ( this.ifExpr_.get( vm ) instanceof Nil )
        vm.pushA( this.elseExpr_.value() );
    else
        vm.pushA( this.thenExpr_ );
};

If_stack_literal_free.prototype.toString = function () {
    return "(if " + this.ifExpr_ + " " + this.thenExpr_ + " " +
        this.elseExpr_ + ")";
};

If_stack_literal_free[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(ifExpr instanceof StackSymbol) )
        throw new TypeError();
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(elseExpr instanceof Else) )
        throw new TypeError();
    var ee = elseExpr.ifExpression;
    // PORT NOTE: This was a cast in Java.
    if ( !(ee instanceof Symbol) )
        throw new TypeError();
    i.push( new If_stack_literal_free( ifExpr, thenExpr, ee ) );
};


// ===================================================================
// from vm/instructions/cond/optimise/If_stack_stack_literal.java
// ===================================================================
// Needed early: Instruction
// Needed late: Nil StackSymbol rainbow.vm.interpreter.Else

/** @constructor */
function If_stack_stack_literal( ifExpr, thenExpr, elseExpr ) {
    Instruction.call( this );
    this.ifExpr_ = ifExpr;
    this.thenExpr_ = thenExpr;
    this.elseExpr_ = elseExpr;
}
classes[ "rainbow.vm.instructions.cond.optimise." +
    "If_stack_stack_literal" ] = If_stack_stack_literal;

If_stack_stack_literal.prototype = new Instruction();
If_stack_stack_literal.prototype.className = "If_stack_stack_literal";

If_stack_stack_literal.prototype.operate = function ( vm ) {
    if ( this.ifExpr_.get( vm ) instanceof Nil )
        vm.pushA( this.elseExpr_ );
    else
        vm.pushA( this.thenExpr_.get( vm ) );
};

If_stack_stack_literal.prototype.toString = function () {
    return "(if " + this.ifExpr_ + " " + this.thenExpr_ + " " +
        this.elseExpr_ + ")";
};

If_stack_stack_literal[ "addInstructions" ] = function (
    i, ifExpr, thenExpr, elseExpr ) {
    
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(ifExpr instanceof StackSymbol) )
        throw new TypeError();
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(thenExpr instanceof StackSymbol) )
        throw new TypeError();
    // PORT NOTE: This was a cast and a local variable in Java.
    if ( !(elseExpr instanceof Else) )
        throw new TypeError();
    if ( ifExpr.isSameStackSymbol( thenExpr ) ) {
        if ( elseExpr.ifExpression instanceof Nil )
            ifExpr.addInstructions( i );
        else
            i.push( new If_stack_stack_literal.Or(
                ifExpr, elseExpr.ifExpression ) );
    } else {
        i.push( new If_stack_stack_literal(
            ifExpr, thenExpr, elseExpr.ifExpression ) );
    }
};

/** @constructor */
If_stack_stack_literal.Or = function ( a, elseExpr ) {
    Instruction.call( this );
    this.a_ = a;
    this.elseExpr_ = elseExpr;
};

If_stack_stack_literal.Or.prototype = new Instruction();
If_stack_stack_literal.Or.prototype.className =
    "If_stack_stack_literal.Or";

If_stack_stack_literal.Or.prototype.operate = function ( vm ) {
    var cond = this.a_.get( vm );
    if ( cond instanceof Nil )
        vm.pushA( this.elseExpr_ );
    else
        vm.pushA( cond );
};

If_stack_stack_literal.Or.prototype.toString = function () {
    return "(if[ssl$or] " + a + " " + a + " " + elseExpr + ")";
};


// ===================================================================
// from vm/instructions/invoke/Invoke_0.java
// ===================================================================
// Needed early: Instruction
// Needed late: BoundSymbol Symbol

var Invoke_0 = {};

Invoke_0.addInstructions = function ( i, fn ) {
    if ( fn instanceof BoundSymbol ) {
        i.push( new Invoke_0.Lex( fn ) );
    } else if ( fn instanceof Symbol ) {
        i.push( new Invoke_0.Free( fn ) );
    } else {
        fn.addInstructions( i );
        i.push( new Invoke_0.Other() );
    }
};

/** @constructor */
Invoke_0.Lex = function ( fn ) {
    Instruction.call( this );
    this.fn = fn;
};

Invoke_0.Lex.prototype = new Instruction();
Invoke_0.Lex.prototype.implementsInvoke = true;
Invoke_0.Lex.prototype.className = "Invoke_0.Lex";

Invoke_0.Lex.prototype.operate = function ( vm ) {
    this.fn.interpret( vm.lc() ).invoke( vm, ArcObject.NIL );
};

Invoke_0.Lex.prototype.toString = function () {
    return "(invoke " + this.fn + ")";
};

Invoke_0.Lex.prototype.getInvokee = function ( vm ) {
    return this.fn.interpret( vm.lc() );
};

/** @constructor */
Invoke_0.Free = function ( fn ) {
    Instruction.call( this );
    this.fn = fn;
};

Invoke_0.Free.prototype = new Instruction();
Invoke_0.Free.prototype.implementsInvoke = true;
Invoke_0.Free.prototype.className = "Invoke_0.Free";

Invoke_0.Free.prototype.operate = function ( vm ) {
    this.fn.value().invoke( vm, ArcObject.NIL );
};

Invoke_0.Free.prototype.toString = function () {
    return "(invoke " + this.fn + ")";
};

Invoke_0.Free.prototype.getInvokee = function ( vm ) {
    return this.fn.value();
};

/** @constructor */
Invoke_0.Other = function () {
    Instruction.call( this );
};

Invoke_0.Other.prototype = new Instruction();
Invoke_0.Other.prototype.implementsInvoke = true;
Invoke_0.Other.prototype.className = "Invoke_0.Other";

Invoke_0.Other.prototype.operate = function ( vm ) {
    vm.popA().invoke( vm, ArcObject.NIL );
};

Invoke_0.Other.prototype.toString = function () {
    return "(invoke <0>)";
};

Invoke_0.Other.prototype.getInvokee = function ( vm ) {
    return vm.peekA();
};


// ===================================================================
// from vm/instructions/invoke/Invoke_1.java
// ===================================================================
// Needed early: Instruction
// Needed late: BoundSymbol Symbol Pair

var Invoke_1 = {};

Invoke_1.addInstructions = function ( i, fn, arg ) {
    arg.addInstructions( i );
    if ( fn instanceof BoundSymbol ) {
        i.push( new Invoke_1.Lex( fn ) );
    } else if ( fn instanceof Symbol ) {
        i.push( new Invoke_1.Free( fn ) );
    } else {
        fn.addInstructions( i );
        i.push( new Invoke_1.Other() );
    }
};

/** @constructor */
Invoke_1.Lex = function ( fn ) {
    Instruction.call( this );
    this.fn = fn;
};

Invoke_1.Lex.prototype = new Instruction();
Invoke_1.Lex.prototype.implementsInvoke = true;
Invoke_1.Lex.prototype.className = "Invoke_1.Lex";

Invoke_1.Lex.prototype.operate = function ( vm ) {
    this.fn.interpret( vm.lc() ).invoke( vm,
        new Pair( vm.popA(), ArcObject.NIL ) );
};

Invoke_1.Lex.prototype.toString = function () {
    return "(invoke " + this.fn + " <1>)";
};

Invoke_1.Lex.prototype.getInvokee = function ( vm ) {
    return this.fn.interpret( vm.lc() );
};

/** @constructor */
Invoke_1.Free = function ( fn ) {
    Instruction.call( this );
    this.fn = fn;
};

Invoke_1.Free.prototype = new Instruction();
Invoke_1.Free.prototype.implementsInvoke = true;
Invoke_1.Free.prototype.className = "Invoke_1.Free";

Invoke_1.Free.prototype.operate = function ( vm ) {
    this.fn.value().invoke( vm,
        new Pair( vm.popA(), ArcObject.NIL ) );
};

Invoke_1.Free.prototype.toString = function () {
    return "(invoke " + this.fn + " <1>)";
};

Invoke_1.Free.prototype.getInvokee = function ( vm ) {
    return this.fn.value();
};

/** @constructor */
Invoke_1.Other = function () {
    Instruction.call( this );
};

Invoke_1.Other.prototype = new Instruction();
Invoke_1.Other.prototype.implementsInvoke = true;
Invoke_1.Other.prototype.className = "Invoke_1.Other";

Invoke_1.Other.prototype.operate = function ( vm ) {
    vm.popA().invoke( vm, new Pair( vm.popA(), ArcObject.NIL ) );
};

Invoke_1.Other.prototype.toString = function () {
    return "(invoke <1>)";
};

Invoke_1.Other.prototype.getInvokee = function ( vm ) {
    return vm.peekA();
};


// ===================================================================
// from vm/instructions/invoke/Invoke_2.java
// ===================================================================
// Needed early: Instruction
// Needed late: BoundSymbol Symbol Pair

var Invoke_2 = {};

Invoke_2.addInstructions = function ( i, fn, arg1, arg2 ) {
    arg1.addInstructions( i );
    arg2.addInstructions( i );
    if ( fn instanceof BoundSymbol ) {
        i.push( new Invoke_2.Lex( fn ) );
    } else if ( fn instanceof Symbol ) {
        i.push( new Invoke_2.Free( fn ) );
    } else {
        fn.addInstructions( i );
        i.push( new Invoke_2.Other() );
    }
};

/** @constructor */
Invoke_2.Lex = function ( fn ) {
    Instruction.call( this );
    this.fn = fn;
};

Invoke_2.Lex.prototype = new Instruction();
Invoke_2.Lex.prototype.implementsInvoke = true;
Invoke_2.Lex.prototype.className = "Invoke_2.Lex";

Invoke_2.Lex.prototype.operate = function ( vm ) {
    var arg2 = vm.popA();
    var arg1 = vm.popA();
    this.fn.interpret( vm.lc() ).invoke( vm,
        new Pair( arg1, new Pair( arg2, ArcObject.NIL ) ) );
};

Invoke_2.Lex.prototype.toString = function () {
    return "(invoke " + this.fn + " <2>)";
};

Invoke_2.Lex.prototype.toStringWithLc = function ( lc ) {
    return "(invoke " + this.fn + " -> " +
        this.fn.interpret( lc ) + " <2>)";
};

Invoke_2.Lex.prototype.getInvokee = function ( vm ) {
    return this.fn.interpret( vm.lc() );
};

/** @constructor */
Invoke_2.Free = function ( fn ) {
    Instruction.call( this );
    this.fn = fn;
};

Invoke_2.Free.prototype = new Instruction();
Invoke_2.Free.prototype.implementsInvoke = true;
Invoke_2.Free.prototype.className = "Invoke_2.Free";

Invoke_2.Free.prototype.operate = function ( vm ) {
    var arg2 = vm.popA();
    var arg1 = vm.popA();
    this.fn.value().invoke( vm,
        new Pair( arg1, new Pair( arg2, ArcObject.NIL ) ) );
};

Invoke_2.Free.prototype.toString = function () {
    return "(invoke_2:free " + this.fn + " <2>)";
};

Invoke_2.Free.prototype.toStringWithLc = function ( lc ) {
    return "(invoke_2:free " + this.fn + " -> " +
        this.fn.value() + " <2>)";
};

Invoke_2.Free.prototype.getInvokee = function ( vm ) {
    return this.fn.value();
};

/** @constructor */
Invoke_2.Other = function () {
    Instruction.call( this );
};

Invoke_2.Other.prototype = new Instruction();
Invoke_2.Other.prototype.implementsInvoke = true;
Invoke_2.Other.prototype.className = "Invoke_2.Other";

Invoke_2.Other.prototype.operate = function ( vm ) {
    var f = vm.popA();
    var arg2 = vm.popA();
    var arg1 = vm.popA();
    // PORT TODO: See if try-catch is a bug.
    try {
        f.invoke( vm,
            new Pair( arg1, new Pair( arg2, ArcObject.NIL ) ) );
    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
        printStackTrace( e );
    }
};

Invoke_2.Other.prototype.toString = function () {
    return "(invoke <2>)";
};

Invoke_2.Other.prototype.getInvokee = function ( vm ) {
    return vm.peekA();
};


// ===================================================================
// from vm/instructions/invoke/Invoke_3.java
// ===================================================================
// Needed early: Instruction
// Needed late: BoundSymbol Symbol Pair

var Invoke_3 = {};

Invoke_3.addInstructions = function ( i, fn, arg1, arg2, arg3 ) {
    arg1.addInstructions( i );
    arg2.addInstructions( i );
    arg3.addInstructions( i );
    if ( fn instanceof BoundSymbol ) {
        i.push( new Invoke_3.Lex( fn ) );
    } else if ( fn instanceof Symbol ) {
        i.push( new Invoke_3.Free( fn ) );
    } else {
        fn.addInstructions( i );
        i.push( new Invoke_3.Other() );
    }
};

/** @constructor */
Invoke_3.Lex = function ( fn ) {
    Instruction.call( this );
    this.fn = fn;
};

Invoke_3.Lex.prototype = new Instruction();
Invoke_3.Lex.prototype.implementsInvoke = true;
Invoke_3.Lex.prototype.className = "Invoke_3.Lex";

Invoke_3.Lex.prototype.operate = function ( vm ) {
    var arg3 = vm.popA();
    var arg2 = vm.popA();
    var arg1 = vm.popA();
    this.fn.interpret( vm.lc() ).invoke( vm, new Pair( arg1,
        new Pair( arg2, new Pair( arg3, ArcObject.NIL ) ) ) );
};

Invoke_3.Lex.prototype.toString = function () {
    return "(invoke " + this.fn + " <3>)";
};

Invoke_3.Lex.prototype.getInvokee = function ( vm ) {
    return this.fn.interpret( vm.lc() );
};

/** @constructor */
Invoke_3.Free = function ( fn ) {
    Instruction.call( this );
    this.fn = fn;
};

Invoke_3.Free.prototype = new Instruction();
Invoke_3.Free.prototype.implementsInvoke = true;
Invoke_3.Free.prototype.className = "Invoke_3.Free";

Invoke_3.Free.prototype.operate = function ( vm ) {
    var arg3 = vm.popA();
    var arg2 = vm.popA();
    var arg1 = vm.popA();
    this.fn.value().invoke( vm, new Pair( arg1,
        new Pair( arg2, new Pair( arg3, ArcObject.NIL ) ) ) );
};

Invoke_3.Free.prototype.toString = function () {
    return "(invoke_3:free " + this.fn + " <3>)";
};

Invoke_3.Free.prototype.getInvokee = function ( vm ) {
    return this.fn.value();
};

/** @constructor */
Invoke_3.Other = function () {
    Instruction.call( this );
};

Invoke_3.Other.prototype = new Instruction();
Invoke_3.Other.prototype.implementsInvoke = true;
Invoke_3.Other.prototype.className = "Invoke_3.Other";

Invoke_3.Other.prototype.operate = function ( vm ) {
    var f = vm.popA();
    var arg3 = vm.popA();
    var arg2 = vm.popA();
    var arg1 = vm.popA();
    f.invoke( vm, new Pair( arg1,
        new Pair( arg2, new Pair( arg3, ArcObject.NIL ) ) ) );
};

Invoke_3.Other.prototype.toString = function () {
    return "(invoke <3>)";
};

Invoke_3.Other.prototype.getInvokee = function ( vm ) {
    return vm.peekA();
};


// ===================================================================
// from vm/instructions/invoke/Invoke_N.java
// ===================================================================
// Needed early: Instruction
// Needed late: Nil Pair BoundSymbol Symbol

var Invoke_N = {};

Invoke_N.addInstructions = function ( i, fn, args ) {
    var argCount = args.len();
    while ( !(args instanceof Nil) ) {
        args.car().addInstructions( i );
        args = args.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(args instanceof Pair) )
            throw new TypeError();
    }
    if ( fn instanceof BoundSymbol ) {
        i.push( new Invoke_N.Lex( fn, argCount ) );
    } else if ( fn instanceof Symbol ) {
        i.push( new Invoke_N.Free( fn, argCount ) );
    } else {
        fn.addInstructions( i );
        i.push( new Invoke_N.Other( argCount ) );
    }
};

/** @constructor */
Invoke_N.Lex = function ( fn, argCount ) {
    Instruction.call( this );
    this.fn = fn;
    this.argCount = argCount;
};

Invoke_N.Lex.prototype = new Instruction();
Invoke_N.Lex.prototype.implementsInvoke = true;
Invoke_N.Lex.prototype.className = "Invoke_N.Lex";

Invoke_N.Lex.prototype.operate = function ( vm ) {
    this.fn.interpret( vm.lc() ).invoke( vm,
        vm.popArgs( this.argCount ) );
};

Invoke_N.Lex.prototype.toString = function () {
    return "(invoke " + this.fn + " <" + this.argCount + ">)";
};

Invoke_N.Lex.prototype.getInvokee = function ( vm ) {
    return this.fn.interpret( vm.lc() );
};

/** @constructor */
Invoke_N.Free = function ( fn, argCount ) {
    Instruction.call( this );
    this.fn = fn;
    this.argCount = argCount;
};

Invoke_N.Free.prototype = new Instruction();
Invoke_N.Free.prototype.implementsInvoke = true;
Invoke_N.Free.prototype.className = "Invoke_N.Free";

Invoke_N.Free.prototype.operate = function ( vm ) {
    this.fn.value().invoke( vm, vm.popArgs( this.argCount ) );
};

Invoke_N.Free.prototype.toString = function () {
    return "(invoke " + this.fn + " <" + this.argCount + ">)";
};

Invoke_N.Free.prototype.getInvokee = function ( vm ) {
    return this.fn.value();
};

/** @constructor */
Invoke_N.Other = function ( argCount ) {
    Instruction.call( this );
    this.argCount = argCount;
};

Invoke_N.Other.prototype = new Instruction();
Invoke_N.Other.prototype.implementsInvoke = true;
Invoke_N.Other.prototype.className = "Invoke_N.Other";

Invoke_N.Other.prototype.operate = function ( vm ) {
    var f = vm.popA();
    f.invoke( vm, vm.popArgs( this.argCount ) );
};

Invoke_N.Other.prototype.toString = function () {
    return "(invoke <" + this.argCount + ">)";
};

Invoke_N.Other.prototype.getInvokee = function ( vm ) {
    return vm.peekA();
};


// ===================================================================
// from vm/interpreter/StackSymbol.java
// ===================================================================
// Needed early: ArcObject
// Needed late: StackSym Symbol

/** @constructor */
function StackSymbol( name, index ) {
    ArcObject.call( this );
    this.name = name;
    this.index_ = index;
}

StackSymbol.prototype = new ArcObject();
StackSymbol.prototype.className = "StackSymbol";

StackSymbol.prototype.get = function ( vm ) {
    return vm.param( this.index_ );
};

StackSymbol.prototype.set = function ( vm, newValue ) {
    vm.params[ vm.ip ][ this.index_ ] = newValue;
};

StackSymbol.prototype.addInstructions = function ( i ) {
    i.push( new StackSym( this.name, this.index_ ) );
};

StackSymbol.prototype.type = function () {
    return Symbol.mkSym( "stack-symbol" );
};

StackSymbol.prototype.toString = function () {
//    return "" + this.name + "[" + this.index_ + "]";
    return this.name.toString();
};

StackSymbol.prototype.isSameStackSymbol = function ( b2 ) {
    return this.name === b2.name && this.index_ === b2.index_;
};

StackSymbol.prototype.inline3 = function ( p, arg, paramIndex ) {
    if ( this.isSameStackSymbol( p ) )
        return arg;
    else if ( paramIndex < this.index_ )
        return new StackSymbol( this.name, this.index - 1 );
    else
        return this;
};


// ===================================================================
// from vm/interpreter/BoundSymbol.java
// ===================================================================
// Needed early: ArcObject Symbol
// Needed late: LexSym ArcError StackSymbol

/** @constructor */
function BoundSymbol( name, nesting, index ) {
    ArcObject.call( this );
    this.nesting = nesting;
    this.index = index;
    this.name = name;
}

BoundSymbol.prototype = new ArcObject();
BoundSymbol.prototype.className = "BoundSymbol";

BoundSymbol.make = function ( name, nesting, index ) {
    return new BoundSymbol( name, nesting, index );
};

BoundSymbol.prototype.setSymbolValue = function ( lc, value ) {
    lc.nth( this.nesting ).set( this.index, value );
};

BoundSymbol.prototype.interpret = function ( lc ) {
    var n = this.nesting;
    while ( 0 < n ) {
        lc = lc.parent;
        n--;
    }
    return lc.at( this.index );
};

BoundSymbol.prototype.addInstructions = function ( i ) {
    i.push( new LexSym( this ) );
};

BoundSymbol.prototype.type = function () {
    return BoundSymbol.TYPE;
};

BoundSymbol.prototype.toString = function () {
    return this.name.toString();
};

BoundSymbol.prototype.isSameBoundSymbol = function ( other ) {
    return this.nesting === other.nesting &&
        this.name === other.name && this.index === other.index;
};

BoundSymbol.prototype.nest = function ( threshold ) {
    if ( threshold <= this.nesting )
        return BoundSymbol.make(
            this.name, this.nesting + 1, this.index );
    else
        return this;
};

BoundSymbol.prototype.unnest = function () {
    return BoundSymbol.make(
        this.name, this.nesting - 1, this.index );
};

BoundSymbol.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    
    if ( this.isSameBoundSymbol( p ) ) {
        return arg;
    } else if ( unnest ) {
        if ( this.nesting === 0 )
            throw new ArcError(
                "can't unnest " + this + ", looking for " + p + " " +
                "to inline with " + arg );
        return this.unnest();
    } else if ( nesting === this.nesting
        && paramIndex < this.index ) {
        return BoundSymbol.make(
            this.name, this.nesting, this.index - 1 );
    } else {
        return this;
    }
};

BoundSymbol.prototype.visit = function ( v ) {
    v.acceptBoundSymbol( this );
};

BoundSymbol.prototype.replaceBoundSymbols = function (
    lexicalBindings ) {
    
    var index = lexicalBindings[ this.name.name() ];
    if ( index === void 0 )
        return this.unnest();
    else if ( index === this.index )
        return new StackSymbol( this.name, index );
    else
        throw new ArcError(
            "error: parameter index mismatch: expected " +
            index + ", got " + this.index );
};

BoundSymbol.TYPE = Symbol.mkSym( "bound-symbol" );


// ===================================================================
// from vm/interpreter/SingleAssignment.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Symbol BoundSymbol ArcError Assign_Lex StackSymbol
// Assign_Stack Assign_Free InterpretedFunction

// PORT TODO: Remove all uses of the zero-arg SingleAssignment().
/** @constructor */
function SingleAssignment( next ) {
    ArcObject.call( this );
    this.name = null;
    this.expression = null;
    this.next_ = next;
}

SingleAssignment.prototype = new ArcObject();
SingleAssignment.prototype.className = "SingleAssignment";

SingleAssignment.prototype.take = function ( o ) {
    if ( this.name === null ) {
        if ( o instanceof Symbol || o instanceof BoundSymbol )
            this.name = o;
        else
            throw new ArcError( "assign: can't assign to " + o );
    } else if ( this.expression === null ) {
        this.expression = o;
    } else {
        this.next_.take( o );
    }
};

SingleAssignment.prototype.toString = function () {
    return "" + this.name + " " + this.expression;
};

SingleAssignment.prototype.addInstructions = function ( i ) {
    this.addMyInstructions( i, false );
    this.next_.addInstructions( i );
};

SingleAssignment.prototype.addMyInstructions = function ( i, last ) {
    if ( this.name instanceof BoundSymbol )
        Assign_Lex.addInstructions(
            i, this.name, this.expression, last );
    else if ( this.name instanceof StackSymbol )
        Assign_Stack.addInstructions(
            i, this.name, this.expression, last );
    else if ( this.name instanceof Symbol )
        Assign_Free.addInstructions(
            i, this.name, this.expression, last );
    else
        throw new ArcError(
            "what kind of symbol is " + this.name + "??" );
};

SingleAssignment.prototype.type = function () {
    return Symbol.mkSym( "assignment" );
};

SingleAssignment.prototype.assigns = function ( nesting ) {
    return true;
};

SingleAssignment.prototype.hasClosures = function () {
    if ( this.expression instanceof InterpretedFunction )
        return this.expression.requiresClosure() ||
            this.next_.hasClosures();
    return this.expression.hasClosures() || this.next_.hasClosures();
};

SingleAssignment.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    
    var sa = new SingleAssignment( null );
    if ( this.name instanceof BoundSymbol
        && p.isSameBoundSymbol( this.name ) )
        throw new ArcError(
            "Can't inline " + p + " -> " + arg + "; assignment" );
    sa.name = this.name;
    sa.expression = this.expression.inline5(
        p, arg, unnest, nesting, paramIndex );
    sa.next_ = this.next_inline5(
        p, arg, unnest, nesting, paramIndex );
    return sa;
};

SingleAssignment.prototype.inline3 = function ( p, arg, paramIndex ) {
    var sa = new SingleAssignment( null );
    if ( this.name instanceof StackSymbol
        && p.isSameStackSymbol( this.name ) )
        throw new ArcError(
            "Can't inline " + p + " -> " + arg + "; assignment" );
    sa.name = this.name;
    sa.expression = this.expression.inline3( p, arg, paramIndex );
    sa.next_ = this.next_inline3( p, arg, paramIndex );
    return sa;
};

SingleAssignment.prototype.nest = function ( threshold ) {
    var sa = new SingleAssignment( null );
    sa.name = this.name.nest( threshold );
    sa.expression = this.expression.nest( threshold );
    sa.next_ = this.next_.nest( threshold );
    return sa;
};

SingleAssignment.prototype.replaceBoundSymbols = function (
    lexicalBindings ) {
    
    var sa = new SingleAssignment( null );
    sa.name = this.name.replaceBoundSymbols( lexicalBindings );
    sa.expression =
        this.expression.replaceBoundSymbols( lexicalBindings );
    // PORT NOTE: This local variable didn't exist in Java.
    var newNext = this.next_.replaceBoundSymbols( lexicalBindings );
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !(newNext instanceof SingleAssignment) )
        throw new TypeError();
    sa.next_ = newNext;
    return sa;
};

SingleAssignment.prototype.visit = function ( v ) {
    v.acceptSingleAssignment( this );
    this.name.visit( v );
    this.expression.visit( v );
    this.next_.visit( v );
    v.endSingleAssignment( this );
};

SingleAssignment.prototype.assignsTo = function ( name ) {
    if ( this.name instanceof Symbol ) {
        return this.name.name() === name;
    } else if ( this.name instanceof StackSymbol ) {
        return this.name.name.name() === name;
    } else {
        // PORT NOTE: This local variable didn't exist in Java.
        var name = this.name;
        // PORT NOTE: This was a cast in Java.
        // PORT TODO: See if it's possible for this to throw an error.
        if ( !(name instanceof BoundSymbol) )
            throw new TypeError();
        return this.name.name.name() === name;
    }
};


// ===================================================================
// from vm/interpreter/LastAssignment.java
// ===================================================================
// Needed early: SingleAssignment
// Needed late: Symbol BoundSymbol ArcError Assign_Lex StackSymbol
// Assign_Stack Assign_Free InterpretedFunction

/** @constructor */
function LastAssignment() {
    SingleAssignment.call( this, null );
}

LastAssignment.prototype = new SingleAssignment( null );
LastAssignment.prototype.className = "LastAssignment";

LastAssignment.prototype.take = function ( o ) {
    if ( this.name === null ) {
        if ( o instanceof Symbol || o instanceof BoundSymbol )
            this.name = o;
        else
            throw new ArcError( "assign: can't assign to " + o );
    } else if ( this.expression === null ) {
        this.expression = o;
    } else {
        throw new ArcError( "assign: error: unexpected " + o );
    }
};

LastAssignment.prototype.toString = function () {
    return "" + this.name + " " + this.expression;
};

LastAssignment.prototype.addInstructions = function ( i ) {
    this.addMyInstructions( i, true );
};

LastAssignment.prototype.hasClosures = function () {
    if ( this.expression instanceof InterpretedFunction )
        return this.expression.requiresClosure();
    return this.expression.hasClosures();
};

LastAssignment.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    
    var sa = new LastAssignment();
    if ( this.name instanceof BoundSymbol
        && p.isSameBoundSymbol( this.name ) )
        throw new ArcError(
            "Can't inline " + p + " -> " + arg + "; assignment" );
    sa.name = this.name.inline5(
        p, arg, unnest, nesting, paramIndex );
    sa.expression = this.expression.inline5(
        p, arg, unnest, nesting, paramIndex );
    return sa;
};

LastAssignment.prototype.inline3 = function ( p, arg, paramIndex ) {
    var sa = new LastAssignment();
    if ( this.name instanceof StackSymbol
        && p.isSameStackSymbol( this.name ) )
        throw new ArcError(
            "Can't inline " + p + " -> " + arg + "; assignment" );
    sa.name = this.name.inline3( p, arg, paramIndex );
    sa.expression = this.expression.inline3( p, arg, paramIndex );
    return sa;
};

LastAssignment.prototype.nest = function ( threshold ) {
    var sa = new LastAssignment();
    sa.name = this.name.nest( threshold );
    sa.expression = this.expression.nest( threshold );
    return sa;
};

LastAssignment.prototype.replaceBoundSymbols = function (
    lexicalBindings ) {
    
    var sa = new LastAssignment();
    sa.name = this.name.replaceBoundSymbols( lexicalBindings );
    sa.expression =
        this.expression.replaceBoundSymbols( lexicalBindings );
    return sa;
};

LastAssignment.prototype.visit = function ( v ) {
    v.acceptLastAssignment( this );
    this.name.visit( v );
    this.expression.visit( v );
    v.endLastAssignment( this );
};


// ===================================================================
// from vm/interpreter/Assignment.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Symbol ArcError LastAssignment SingleAssignment

/** @constructor */
function Assignment() {
    ArcObject.call( this );
    this.assignment = null;
}

Assignment.prototype = new ArcObject();
Assignment.prototype.className = "Assignment";

Assignment.prototype.type = function () {
    return Symbol.mkSym( "assignment" );
};

Assignment.prototype.take = function ( o ) {
    this.assignment.take( o );
};

Assignment.prototype.addInstructions = function ( i ) {
    this.assignment.addInstructions( i );
};

Assignment.prototype.prepare = function ( size ) {
    if ( size % 2 !== 0 )
        throw new ArcError(
            "assign: requires even number of arguments" );
    
    size = size / 2 - 1;
    if ( size < 0 )
        throw new ArcError( "assign: nothing to assign" );
    
    this.assignment = new LastAssignment();
    while ( 0 < size ) {
        this.assignment = new SingleAssignment( this.assignment );
        size--;
    }
};

Assignment.prototype.toString = function () {
    return "(assign " + this.assignment + ")";
};

Assignment.prototype.assigns = function ( nesting ) {
    return this.assignment.assigns( nesting );
};

Assignment.prototype.hasClosures = function () {
    return this.assignment.hasClosures();
};

Assignment.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    
    var a = new Assignment();
    a.assignment = this.assignment.inline5(
        p, arg, unnest, nesting, paramIndex );
    return a;
};

Assignment.prototype.inline3 = function ( p, arg, paramIndex ) {
    var a = new Assignment();
    a.assignment = this.assignment.inline3( p, arg, paramIndex );
    return a;
};

Assignment.prototype.nest = function ( threshold ) {
    var a = new Assignment();
    a.assignment = this.assignment.nest( threshold );
    return a;
};

Assignment.prototype.visit = function ( v ) {
    v.acceptAssignment( this );
    this.assignment.visit( v );
    v.endAssignment( this );
};

Assignment.prototype.replaceBoundSymbols = function (
    lexicalBindings ) {
    
    var a = new Assignment();
    // PORT NOTE: This local variable didn't exist in Java.
    var newAssignment =
        this.assignment.replaceBoundSymbols( lexicalBindings );
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !(newAssignment instanceof SingleAssignment) )
        throw new TypeError();
    a.assignment = newAssignment;
    return a;
};


// ===================================================================
// from vm/interpreter/Else.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Symbol ArcError InterpretedFunction Invocation

/** @constructor */
function Else() {
    ArcObject.call( this );
    this.ifExpression = null;
}

Else.prototype = new ArcObject();
Else.prototype.implementsConditional = true;
Else.prototype.className = "Else";

Else.prototype.type = function () {
    return Symbol.mkSym( "else-clause" );
};

Else.prototype.add = function ( c ) {
    throw new ArcError(
        "Internal error: if clause: unexpected extra condition: " +
        c );
};

Else.prototype.take = function ( expression ) {
    if ( this.ifExpression === null )
        this.ifExpression = expression;
    else
        throw new ArcError(
            "Internal error: if clause: unexpected: " + expression );
};

Else.prototype.addInstructions = function ( i ) {
    this.ifExpression.addInstructions( i );
};

Else.prototype.reduce = function () {
    return this;
};

Else.prototype.inspect = function () {
    return "#<else " + this.ifExpression + ">";
};

Else.prototype.toString = function () {
    return "" + this.ifExpression;
};

Else.prototype.assigns = function ( nesting ) {
    return this.ifExpression.assigns( nesting );
};

Else.prototype.hasClosures = function () {
    if ( this.ifExpression instanceof InterpretedFunction )
        return this.ifExpression.requiresClosure();
    else
        return this.ifExpression.hasClosures();
};

Else.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    
    var e = new Else();
    e.ifExpression = this.ifExpression.inline5(
        p, arg, unnest, nesting, paramIndex ).reduce();
    return e;
};

Else.prototype.inline3 = function ( p, arg, paramIndex ) {
    var e = new Else();
    e.ifExpression = this.ifExpression.inline3(
        p, arg, paramIndex ).reduce();
    return e;
};

Else.prototype.nest = function ( threshold ) {
    var e = new Else();
    e.ifExpression = this.ifExpression.nest( threshold );
    return e;
};

Else.prototype.replaceBoundSymbols = function ( lexicalbindings ) {
    var e = new Else();
    e.ifExpression =
        this.ifExpression.replaceBoundSymbols( lexicalbindings );
    return e;
};

Else.prototype.visit = function ( v ) {
    v.acceptElse( this );
    this.ifExpression.visit( v );
    v.endElse( this );
};

Else.prototype.sig = function () {
    return "_" + Invocation.sig( this.ifExpression );
};


// ===================================================================
// from vm/interpreter/IfClause.java
// ===================================================================
// Needed early: ArcObject Symbol
// Needed late: ArcError IfThen

/** @constructor */
function IfClause() {
    ArcObject.call( this );
    this.first_ = null;
}

IfClause.prototype = new ArcObject();
IfClause.prototype.className = "IfClause";

IfClause.prototype.type = function () {
    return IfClause.TYPE;
};

IfClause.prototype.append = function ( c ) {
    if ( this.first_ !== null )
        this.first_.add( c );
    else
        this.first_ = c;
};

IfClause.prototype.reduce = function () {
    // PORT NOTE: This local variable didn't exist in Java.
    var newFirst = this.first_.reduce();
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !newFirst.implementsConditional )
        throw new TypeError();
    this.first_ = newFirst;
    if ( newFirst instanceof Else )
        return newFirst.ifExpression;
    else
        return this;
};

IfClause.prototype.take = function ( expression ) {
    this.first_.take( expression );
};

IfClause.prototype.addInstructions = function ( i ) {
    this.first_.addInstructions( i );
};

IfClause.prototype.toString = function () {
    return "(if " + this.first_ + ")";
};

IfClause.prototype.assigns = function ( nesting ) {
    return this.first_.assigns( nesting );
};

IfClause.prototype.hasClosures = function () {
    return this.first_.hasClosures();
};

IfClause.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    
    var ic = new IfClause();
    // PORT NOTE: This local variable didn't exist in Java.
    var newFirst = this.first_.inline5(
        p, arg, unnest, nesting, paramIndex ).reduce();
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !newFirst.implementsConditional )
        throw new TypeError();
    ic.first_ = newFirst;
    return ic;
};

IfClause.prototype.inline3 = function ( p, arg, paramIndex ) {
    var ic = new IfClause();
    // PORT NOTE: This local variable didn't exist in Java.
    var newFirst = this.first_.inline3( p, arg, paramIndex ).reduce();
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !newFirst.implementsConditional )
        throw new TypeError();
    ic.first_ = newFirst;
    return ic;
};

IfClause.prototype.nest = function ( threshold ) {
    var ic = new IfClause();
    // PORT NOTE: This local variable didn't exist in Java.
    var newFirst = this.first_.nest( threshold );
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !newFirst.implementsConditional )
        throw new TypeError();
    ic.first_ = newFirst;
    return ic;
};

IfClause.prototype.replaceBoundSymbols = function (
    lexicalbindings ) {
    
    var ic = new IfClause();
    // PORT NOTE: This local variable didn't exist in Java.
    var newFirst = this.first_.replaceBoundSymbols( lexicalbindings );
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !newFirst.implementsConditional )
        throw new TypeError();
    ic.first_ = newFirst;
    return ic;
};

IfClause.prototype.visit = function ( v ) {
    v.acceptIfClause( this );
    this.first_.visit( v );
    v.endIfClause( this );
};

IfClause.prototype.isAifIf = function () {
    var b = this.first_ instanceof IfThen;
    if ( !b )
        return false;
    return this.first_.ifExpression.toString() === "it";
};

IfClause.prototype.thenExpression = function () {
    // PORT NOTE: This local variable didn't exist in Java.
    var first = this.first_;
    // PORT NOTE: This was a cast in Java.
    if ( !(first instanceof IfThen) )
        throw new TypeError();
    return first.thenExpression;
};

IfClause.prototype.elseExpression = function () {
    // PORT NOTE: This local variable didn't exist in Java.
    var first = this.first_;
    // PORT NOTE: This was a cast in Java.
    if ( !(first instanceof IfThen) )
        throw new TypeError();
    return first.next;
};

IfClause.TYPE = Symbol.mkSym( "if-clause" );


// ===================================================================
// from vm/interpreter/IfThen.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Symbol ArcError classes Cond Nil Else StackSymbol
// InterpretedFunction

/** @constructor */
function IfThen() {
    ArcObject.call( this );
    this.ifExpression = null;
    this.thenExpression = null;
    this.next = null;
}

IfThen.prototype = new ArcObject();
IfThen.prototype.implementsConditional = true;
IfThen.prototype.className = "IfThen";

IfThen.prototype.type = function () {
    return Symbol.mkSym( "if-then-clause" );
};

IfThen.prototype.add = function ( c ) {
    if ( this.next !== null )
        this.next.add( c );
    else
        this.next = c;
};

IfThen.prototype.take = function ( expression ) {
    if ( this.ifExpression === null )
        this.ifExpression = expression;
    else if ( this.thenExpression === null )
        this.thenExpression = expression;
    else
        this.next.take( expression );
};

IfThen.prototype.addInstructions = function ( i ) {
    var sig = this.sig();
    var prefix = "rainbow.vm.instructions.cond.optimise.If";
    var classname = prefix + sig;
    try {
        if ( !(classname in IfThen.handlers) ) {
            IfThen.loadHandler( classname );
            this.addInstructions( i );
        } else {
            var m = IfThen.handlers[ classname ];
            if ( m === null )
                this.defaultAddInstructions( i, sig );
            else
                m( i, this.ifExpression, this.thenExpression,
                    this.next );
        }
    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
        throw new ArcError(
            "Couldn't instantiate " + classname + ": " + e, e );
    }
};

IfThen.loadHandler = function ( classname ) {
    // PORT NOTE: In Java, these were handled by catching
    // ClassNotFoundExceptions and NoSuchMethodExceptions.
    var C = classes[ classname ];
    if ( C === void 0 ) {
        IfThen.handlers[ classname ] = null;
        return;
    }
    // PORT TODO: Figure out a better way to have the Closure Compiler
    // realize that "addInstructions" is actually used here. For now,
    // we just keep it from renaming "addInstructions" by using a
    // string literal.
    var m = C[ "addInstructions" ];
    if ( m === void 0 )
        throw new ArcError(
            "couldn't find handler method " +
            "'addInstructions(List,ArcObject,ArcObject,ArcObject) " +
            "on " + classname );
    IfThen.handlers[ classname ] = m;
};

IfThen.prototype.defaultAddInstructions = function ( i, sig ) {
    this.ifExpression.addInstructions( i );
    i.push( new Cond( this.thenExpression, this.next, sig ) );
};

IfThen.prototype.reduce = function () {
    // PORT NOTE: This local variable didn't exist in Java.
    var newNext = this.next.reduce();
    // PORT NOTE: This was a cast in Java.
    if ( !newNext.implementsConditional )
        throw new TypeError();
    this.next = newNext;
    if ( this.ifExpression instanceof Nil ) {
        return this.next;
    } else if ( this.reduceToIfBound_() || this.reduceToIfStack_() ) {
        var e = new Else();
        e.take( this.ifExpression );
        return e;
    } else {
        return this;
    }
};

IfThen.prototype.reduceToIfBound_ = function () {
    if ( !(this.ifExpression instanceof BoundSymbol)
        || !(this.thenExpression instanceof BoundSymbol)
        || !(this.next instanceof Else) ) {
        return false;
    } else {
        var b1 = this.ifExpression;
        var b2 = this.thenExpression;
        var e = this.next;
        return b1.isSameBoundSymbol( b2 ) &&
            e.ifExpression instanceof Nil;
    }
};

IfThen.prototype.reduceToIfStack_ = function () {
    if ( !(this.ifExpression instanceof StackSymbol)
        || !(this.thenExpression instanceof StackSymbol)
        || !(this.next instanceof Else) ) {
        return false;
    } else {
        var b1 = this.ifExpression;
        var b2 = this.thenExpression;
        var e = this.next;
        return b1.isSameStackSymbol( b2 ) &&
            e.ifExpression instanceof Nil;
    }
};

IfThen.prototype.toString = function () {
    return "" + this.ifExpression + " " + this.thenExpression + " " +
        this.next;
};

IfThen.prototype.assigns = function ( nesting ) {
    return this.ifExpression.assigns( nesting ) ||
        this.thenExpression.assigns( nesting ) ||
        this.next.assigns( nesting );
};

IfThen.prototype.hasClosures = function () {
    if ( this.ifExpression instanceof InterpretedFunction )
        if ( this.ifExpression.requiresClosure() )
            return true;
    if ( this.thenExpression instanceof InterpretedFunction )
        if ( this.thenExpression.requiresClosure() )
            return true;
    return this.ifExpression.hasClosures() ||
        this.thenExpression.hasClosures() ||
        this.next.hasClosures();
};

IfThen.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    
    var other = new IfThen();
    other.ifExpression = this.ifExpression.inline5(
        p, arg, unnest, nesting, paramIndex ).reduce();
    other.thenExpression = this.thenExpression.inline5(
        p, arg, unnest, nesting, paramIndex ).reduce();
    // PORT NOTE: This local variable didn't exist in Java.
    var newNext = this.next.inline5(
        p, arg, unnest, nesting, paramIndex ).reduce();
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !newNext.implementsConditional )
        throw new TypeError();
    other.next = newNext;
    return other;
};

IfThen.prototype.inline3 = function ( p, arg, paramIndex ) {
    var other = new IfThen();
    other.ifExpression = this.ifExpression.inline3(
        p, arg, paramIndex ).reduce();
    other.thenExpression = this.thenExpression.inline3(
        p, arg, paramIndex ).reduce();
    // PORT NOTE: This local variable didn't exist in Java.
    var newNext = this.next.inline3(
        p, arg, paramIndex ).reduce();
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !newNext.implementsConditional )
        throw new TypeError();
    other.next = newNext;
    return other;
};

IfThen.prototype.nest = function ( threshold ) {
    var other = new IfThen();
    other.ifExpression = this.ifExpression.nest( threshold );
    other.thenExpression = this.thenExpression.nest( threshold );
    // PORT NOTE: This local variable didn't exist in Java.
    var newNext = this.next.nest( threshold );
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !newNext.implementsConditional )
        throw new TypeError();
    other.next = newNext;
    return other;
};

IfThen.prototype.replaceBoundSymbols = function ( lexicalbindings ) {
    var other = new IfThen();
    other.ifExpression = this.ifExpression.replaceBoundSymbols(
        lexicalbindings );
    other.thenExpression = this.thenExpression.replaceBoundSymbols(
        lexicalbindings );
    // PORT NOTE: This local variable didn't exist in Java.
    var newNext = this.next.replaceBoundSymbols( lexicalbindings );
    // PORT NOTE: This was a cast in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( !newNext.implementsConditional )
        throw new TypeError();
    other.next = newNext;
    return other;
};

IfThen.prototype.visit = function ( v ) {
    v.acceptIfThen( this );
    this.ifExpression.visit( v );
    this.thenExpression.visit( v );
    this.next.visit( v );
    v.endIfThen( this );
};

IfThen.prototype.sig = function () {
    var s = "";
    s += "_";
    s += Invocation.sig( this.ifExpression );
    s += "_";
    s += Invocation.sig( this.thenExpression );
    if ( this.next instanceof Else ) {
        s += "_";
        s += Invocation.sig( this.next.ifExpression );
    } else {
        s += "_other";
    }
    return s;
};

IfThen.handlers = {};


// ===================================================================
// from vm/interpreter/Quotation.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Literal Symbol

/** @constructor */
function Quotation( quoted ) {
    ArcObject.call( this );
    this.quoted_ = quoted;
}

Quotation.prototype = new ArcObject();
Quotation.prototype.className = "Quotation";

Quotation.prototype.addInstructions = function ( i ) {
    i.push( new Literal( this.quoted_ ) );
};

Quotation.prototype.quoted = function () {
    return this.quoted_;
};

Quotation.prototype.type = function () {
    return Symbol.mkSym( "quotation" );
};

Quotation.prototype.interpret = function ( lc ) {
    return this.quoted_;
};

Quotation.prototype.toString = function () {
    return "'" + this.quoted_;
};


// ===================================================================
// from vm/interpreter/Invocation.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Symbol Decompiler InterpretedFunction Bind ArcError
// Pair Nil BoundSymbol StackSymbol Quotation

/** @constructor */
function Invocation( parts ) {
    ArcObject.call( this );
    this.parts = parts;
    this.constructors_ = {};
}

Invocation.prototype = new ArcObject();
Invocation.prototype.className = "Invocation";

Invocation.prototype.type = function () {
    return Symbol.mkSym( "if-then-clause" );
};

Invocation.prototype.toString = function () {
    return Decompiler.decompile( this ).toString();
};

Invocation.prototype.addInstructions = function ( i ) {
    this.inlineDoForm_( i ) || this.addOptimisedHandler_( i ) ||
        this.defaultAddInstructions( i );
};

Invocation.prototype.reduce = function () {
    if ( this.parts.longerThan( 1 ) )
        if ( this.parts.car() instanceof InterpretedFunction ) {
            var fn = this.parts.car();
            var plist = fn.parameterList();
            
            if ( plist.isNotPair() ||
                !(plist.car() instanceof Symbol) )
                return this;
            
            var param = plist.car();
            var arg = this.parts.cdr().car();
            if ( fn.canInline( param, arg ) ) {
                try {
                    var newfn = fn.curry( param, arg, true );
                } catch ( e ) { if ( !(e instanceof Error) ) throw e;
                    throw new ArcError(
                        "couldn't curry " + param + "->" + arg + " " +
                        "for " + fn + " in expression " +
                        this + ": " + e, e );
                }
                return new Invocation(
                    new Pair( newfn, this.parts.cdr().cdr() )
                ).reduce();
            }
        }
    return this;
};

Invocation.prototype.inlineDoForm_ = function ( i ) {
    if ( this.parts.len() === 1
        && this.parts.car() instanceof Bind ) {
        var fn = this.parts.car();
        fn.buildInstructions( i );
        return true;
    }
    return false;
};

Invocation.prototype.addOptimisedHandler_ = function ( i ) {
    var cname = "rainbow.vm.instructions.invoke.optimise.Invoke" +
        this.sig_();
    if ( cname in this.constructors_ ) {
        var C = this.constructors_[ cname ];
        if ( C === null )
            return false;
        try {
            this.addOptimisedInstructions_( i, new C( this.parts ) );
            return true;
        } catch ( e ) { if ( !(e instanceof Error) ) throw e;
            throw new ArcError(
                "couldn't create optimiser " + cname, e );
        }
    } else {
        // PORT NOTE: In Java, this was handled by catching
        // ClassNotFoundExceptions and NoSuchMethodExceptions.
        var Co = classes[ cname ];
        if ( Co === void 0 ) {
            this.constructors_[ cname ] = null;
            return false;
        }
        this.constructors_[ cname ] = Co;
        return this.addOptimisedHandler_( i );
    }
};

Invocation.prototype.addOptimisedInstructions_ = function ( i, ins ) {
    var p = this.parts.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(p instanceof Pair) )
        throw new TypeError();
    while ( !(p instanceof Nil) ) {
        if ( this.sig( p.car() ) === "other" )
            p.car().addInstructions( i );
        p = p.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(p instanceof Pair) )
            throw new TypeError();
    }
    
    if ( this.sig( this.parts.car() ) === "other" )
        this.parts.car().addInstructions( i );
    i.push( ins );
};

Invocation.prototype.sig_ = function () {
    var s = "";
    var p = this.parts;
    while ( !(p instanceof Nil) ) {
        s += "_";
        s += Invocation.sig( p.car() );
        p = p.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(p instanceof Pair) )
            throw new TypeError();
    }
    return s;
};

Invocation.sig = function ( o ) {
    if ( o instanceof BoundSymbol )
        return "bound";
    else if ( o instanceof Symbol )
        return "free";
    else if ( o instanceof StackSymbol )
        return "stack";
    else if ( o.literal() )
        return "literal";
    else if ( o instanceof Quotation )
        return "quote";
    else
        return "other";
};

Invocation.prototype.defaultAddInstructions = function ( i ) {
    switch ( this.parts.len() ) {
    case 1:
        Invoke_0.addInstructions( i,
            this.parts.car()
        );
        break;
    case 2:
        Invoke_1.addInstructions( i,
            this.parts.car(),
            this.parts.cdr().car()
        );
        break;
    case 3:
        Invoke_2.addInstructions( i,
            this.parts.car(),
            this.parts.cdr().car(),
            this.parts.cdr().cdr().car()
        );
        break;
    case 4:
        Invoke_3.addInstructions( i,
            this.parts.car(),
            this.parts.cdr().car(),
            this.parts.cdr().cdr().car(),
            this.parts.cdr().cdr().cdr().car()
        );
        break;
    default:
        // PORT NOTE: These local variables didn't exist in Java.
        var fn = this.parts.car();
        var args = this.parts.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(args instanceof Pair) )
            throw new TypeError();
        Invoke_N.addInstructions( i, fn, args );
        break;
    }
    return true;
};

Invocation.prototype.assigns = function ( nesting ) {
    var pt = this.parts;
    while ( !(pt instanceof Nil) ) {
        if ( pt.car().assigns( nesting ) )
            return true;
        pt = pt.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(pt instanceof Pair) )
            throw new TypeError();
    }
    return false;
};

Invocation.prototype.hasClosures = function () {
    var pt = this.parts;
    while ( !(pt instanceof Nil) ) {
        if ( pt.car() instanceof InterpretedFunction ) {
            if ( pt.car().requiresClosure() )
                return true;
        } else if ( pt.car().hasClosures() ) {
            return true;
        }
        pt = pt.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(pt instanceof Pair) )
            throw new TypeError();
    }
    return false;
};

Invocation.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    
    var pt = this.parts;
    var inlined = [];
    while ( !(pt instanceof Nil) ) {
        try {
            inlined.push( pt.car().inline5(
                p, arg, unnest, nesting, paramIndex ) );
        } catch ( e ) { if ( !(e instanceof Error) ) throw e;
            throw new ArcError(
                "couldn't inline " + p + "->" + arg + "(unnest:" +
                unnest + ";nesting:" + nesting + ") in " +
                this + " : " + e, e );
        }
        pt = pt.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(pt instanceof Pair) )
            throw new TypeError();
    }
    return new Invocation( Pair.buildFrom1( inlined ) );
};

Invocation.prototype.inline3 = function ( p, arg, paramIndex ) {
    var pt = this.parts;
    var inlined = [];
    while ( !(pt instanceof Nil) ) {
        try {
            inlined.push( pt.car().inline3( p, arg, paramIndex ) );
        } catch ( e ) { if ( !(e instanceof Error) ) throw e;
            throw new ArcError(
                "couldn't inline " + p + "->" + arg + ") in " +
                this + " : " + e, e );
        }
        pt = pt.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(pt instanceof Pair) )
            throw new TypeError();
    }
    return new Invocation( Pair.buildFrom1( inlined ) );
};

Invocation.prototype.nest = function ( threshold ) {
    var pt = this.parts;
    var inlined = [];
    while ( !(pt instanceof Nil) ) {
        inlined.push( pt.car().nest( threshold ) );
        pt = pt.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(pt instanceof Pair) )
            throw new TypeError();
    }
    return new Invocation( Pair.buildFrom1( inlined ) );
};

Invocation.prototype.replaceBoundSymbols = function (
    lexicalBindings ) {
    
    var pt = this.parts;
    var inlined = [];
    while ( !(pt instanceof Nil) ) {
        inlined.push( pt.car().replaceBoundSymbols(
            lexicalBindings ) );
        pt = pt.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(pt instanceof Pair) )
            throw new TypeError();
    }
    return new Invocation( Pair.buildFrom1( inlined ) );
};

Invocation.prototype.visit = function ( v ) {
    v.acceptInvocation( this );
    var pt = this.parts;
    while ( !(pt instanceof Nil) ) {
        pt.car().visit( v );
        pt = pt.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(pt instanceof Pair) )
            throw new TypeError();
    }
    v.endInvocation( this );
};


// ===================================================================
// from vm/interpreter/QuasiQuotation.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Symbol Literal QuasiQuoteCompiler Listify AppendAll
// Append AppendDot Nil Pair InterpretedFunction

/** @constructor */
function QuasiQuotation( target ) {
    ArcObject.call( this );
    this.target_ = target;
}

QuasiQuotation.prototype = new ArcObject();
QuasiQuotation.prototype.className = "QuasiQuotation";

QuasiQuotation.prototype.type = function () {
    return Symbol.mkSym( "quasiquotation" );
};

// PORT TODO: Rename all uses of addInstructions( List, ArcObject ).
QuasiQuotation.prototype.addInstructions = function ( i ) {
    this.addInstructions2( i, this.target_ );
};

QuasiQuotation.prototype.toString = function () {
    return "`" + this.target_;
};

QuasiQuotation.prototype.unquotes = function () {
    var l = [];
    this.appendUnquotes_( l, this.target_, 1 );
    return l;
};

QuasiQuotation.prototype.appendUnquotes_ = function (
    l, expr, nesting ) {
    
    if ( QuasiQuotation.isUnQuote( expr ) ) {
        if ( nesting === 1 )
            l.push( expr.cdr().car() );
        else
            this.appendUnquotes_( l, expr.cdr().car(), nesting - 1 );
        return;
    } else if ( QuasiQuotation.isUnQuoteSplicing( expr ) ) {
        if ( nesting === 1 )
            l.push( expr.cdr().car() );
        else
            this.appendUnquotes_( l, expr.cdr().car(), nesting - 1 );
        return;
    } else if ( QuasiQuotation.isQuasiQuote( expr ) ) {
        this.appendUnquotes_( l, expr.cdr().car(), nesting + 1 );
        return;
    } else if ( expr.isNotPair() ) {
        return;
    }
    
    while ( !expr.isNotPair() )
        if ( QuasiQuotation.isUnQuote( expr )
            || QuasiQuotation.isQuasiQuote( expr ) ) {
            // catch post-dot unquotes
            this.appendUnquotes_( l, expr, nesting );
            expr = expr.cdr().cdr();
        } else {
            var current = expr.car();
            expr = expr.cdr();
            if ( QuasiQuotation.isUnQuoteSplicing( current ) )
                this.appendUnquotes_( l, current, nesting );
            else if ( QuasiQuotation.isUnQuote( current )
                || QuasiQuotation.isQuasiQuote( current )
                || QuasiQuotation.isPair_( current ) )
                this.appendUnquotes_( l, current, nesting );
        }
};

QuasiQuotation.prototype.addInstructions2 = function ( i, target ) {
    return this.addInstructions_( i, target, 1 );
};

QuasiQuotation.prototype.addInstructions_ = function (
    i, expr, nesting ) {
    
    if ( QuasiQuotation.isUnQuote( expr ) ) {
        if ( nesting === 1 ) {
            expr.cdr().car().addInstructions( i );
        } else {
            i.push( new Literal( QuasiQuoteCompiler.UNQUOTE ) );
            this.addInstructions_( i, expr.cdr().car(), nesting - 1 );
            i.push( new Listify( 2 ) );
        }
        return;
    } else if ( QuasiQuotation.isUnQuoteSplicing( expr ) ) {
        if ( nesting === 1 ) {
            expr.cdr().car().addInstructions( i );
            i.push( new AppendAll() );
        } else {
            i.push(
                new Literal( QuasiQuoteCompiler.UNQUOTE_SPLICING ) );
            this.addInstructions_( i, expr.cdr().car(), nesting - 1 );
            i.push( new Listify( 2 ) );
            i.push( new Append() );
        }
        return;
    } else if ( QuasiQuotation.isQuasiQuote( expr ) ) {
        i.push( new Literal( QuasiQuoteCompiler.QUASIQUOTE ) );
        this.addInstructions_( i, expr.cdr().car(), nesting + 1 );
        i.push( new Listify( 2 ) );
        return;
    } else if ( expr.isNotPair() ) {
        i.push( new Literal( expr ) );
        return;
    }
    
    i.push( new NewList() );
    
    while ( !expr.isNotPair() )
        if ( QuasiQuotation.isUnQuote( expr )
            || QuasiQuotation.isQuasiQuote( expr ) ) {
            // catch post-dot unquotes
            this.addInstructions_( i, expr, nesting );
            expr = expr.cdr().cdr();
            i.push( new AppendDot() );
        } else {
            var current = expr.car();
            expr = expr.cdr();
            if ( QuasiQuotation.isUnQuoteSplicing( current ) ) {
                this.addInstructions_( i, current, nesting );
            } else if ( QuasiQuotation.isUnQuote( current )
                || QuasiQuotation.isQuasiQuote( current )
                || QuasiQuotation.isPair_( current ) ) {
                this.addInstructions_( i, current, nesting );
                i.push( new Append() );
            } else {
                i.push( new Literal( current ) );
                i.push( new Append() );
            }
        }
    
    if ( !(expr instanceof Nil) ) {
        i.push( new Literal( expr ) );
        i.push( new AppendDot() );
    }
    
    i.push( new FinishList() );
};

QuasiQuotation.isQQPair = function ( expression, car ) {
    return expression instanceof Pair && expression.isCar( car ) &&
        expression.cdr().cdr() instanceof Nil;
};

QuasiQuotation.isUnQuote = function ( expression ) {
    return QuasiQuotation.isQQPair(
        expression, QuasiQuoteCompiler.UNQUOTE );
};

QuasiQuotation.isUnQuoteSplicing = function ( expression ) {
    return QuasiQuotation.isQQPair(
        expression, QuasiQuoteCompiler.UNQUOTE_SPLICING );
};

QuasiQuotation.isQuasiQuote = function ( expression ) {
    return QuasiQuotation.isQQPair(
        expression, QuasiQuoteCompiler.QUASIQUOTE );
};

QuasiQuotation.isPair_ = function ( expression ) {
    return expression instanceof Pair;
};

QuasiQuotation.prototype.assigns = function ( nesting ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var unquotes = this.unquotes();
    for ( var i = 0, len = unquotes.length; i < len; i++ )
        if ( unquotes[ i ].assigns( nesting ) )
            return true;
    return false;
};

QuasiQuotation.prototype.hasClosures = function () {
    // PORT NOTE: This local variable didn't exist in Java.
    var unquotes = this.unquotes();
    for ( var i = 0, len = unquotes.length; i < len; i++ ) {
        var o = unquotes[ i ];
        if ( o instanceof InterpretedFunction ) {
            if ( o.requiresClosure() )
                return true;
        } else if ( o.hasClosures() ) {
            return true;
        }
    }
    return false;
};

QuasiQuotation.prototype.inline5 = function (
    p, arg, unnest, lexicalNesting, paramIndex ) {
    
    return new QuasiQuotation( QuasiQuotation.inline5_( p, arg,
        unnest, lexicalNesting, paramIndex, this.target_, 1 ) );
};

QuasiQuotation.inline5_ = function (
    p, arg, unnest, lexicalNesting, paramIndex, expr, nesting ) {
    
    if ( QuasiQuotation.isUnQuote( expr ) ) {
        if ( nesting === 1 )
            return Pair.buildFrom1( [ QuasiQuoteCompiler.UNQUOTE,
                expr.cdr().car().inline5(
                    p, arg, unnest, lexicalNesting, paramIndex ) ] );
        else
            return Pair.buildFrom1( [ QuasiQuoteCompiler.UNQUOTE,
                QuasiQuotation.inline5_(
                    p, arg, unnest, lexicalNesting, paramIndex,
                    expr.cdr().car(), nesting - 1 ) ] );
    } else if ( QuasiQuotation.isUnQuoteSplicing( expr ) ) {
        if ( nesting === 1 )
            return Pair.buildFrom1( [
                QuasiQuoteCompiler.UNQUOTE_SPLICING,
                expr.cdr().car().inline5(
                    p, arg, unnest, lexicalNesting, paramIndex ) ] );
        else
            return Pair.buildFrom1( [
                QuasiQuoteCompiler.UNQUOTE_SPLICING,
                QuasiQuotation.inline5_(
                    p, arg, unnest, lexicalNesting, paramIndex,
                    expr.cdr().car(), nesting - 1 ) ] );
    } else if ( QuasiQuotation.isQuasiQuote( expr ) ) {
        return Pair.buildFrom1( [ QuasiQuoteCompiler.QUASIQUOTE,
            QuasiQuotation.inline5_(
                p, arg, unnest, lexicalNesting, paramIndex,
                expr.cdr().car(), nesting + 1 ) ] );
    } else if ( expr.isNotPair() ) {
        return expr;
    }
    
    var list = [];
    var last = ArcObject.NIL;
    
    while ( !expr.isNotPair() )
        if ( QuasiQuotation.isUnQuote( expr )
            || QuasiQuotation.isQuasiQuote( expr ) ) {
            // catch post-dot unquotes
            last = QuasiQuotation.inline5_( p, arg, unnest,
                lexicalNesting, paramIndex, expr, nesting );
            expr = expr.cdr().cdr();
        } else {
            var current = expr.car();
            expr = expr.cdr();
            if ( QuasiQuotation.isUnQuoteSplicing( current ) )
                list.push( QuasiQuotation.inline5_( p, arg, unnest,
                    lexicalNesting, paramIndex, current, nesting ) );
            else if ( QuasiQuotation.isUnQuote( current )
                || QuasiQuotation.isQuasiQuote( current )
                || QuasiQuotation.isPair_( current ) )
                list.push( QuasiQuotation.inline5_( p, arg, unnest,
                    lexicalNesting, paramIndex, current, nesting ) );
            else
                list.push( current );
        }
    
    if ( !(expr instanceof Nil) )
        last = expr;
    
    return Pair.buildFrom2( list, last );
};

QuasiQuotation.prototype.inline3 = function ( p, arg, paramIndex ) {
    return new QuasiQuotation( QuasiQuotation.inline3_( p, arg,
        paramIndex, this.target_, 1 ) );
};

QuasiQuotation.inline3_ = function (
    p, arg, paramIndex, expr, nesting ) {
    
    if ( QuasiQuotation.isUnQuote( expr ) ) {
        if ( nesting === 1 )
            return Pair.buildFrom1( [ QuasiQuoteCompiler.UNQUOTE,
                expr.cdr().car().inline3( p, arg, paramIndex ) ] );
        else
            return Pair.buildFrom1( [ QuasiQuoteCompiler.UNQUOTE,
                QuasiQuotation.inline5_( p, arg, paramIndex,
                    expr.cdr().car(), nesting - 1 ) ] );
    } else if ( QuasiQuotation.isUnQuoteSplicing( expr ) ) {
        if ( nesting === 1 )
            return Pair.buildFrom1( [
                QuasiQuoteCompiler.UNQUOTE_SPLICING,
                expr.cdr().car().inline3( p, arg, paramIndex ) ] );
        else
            return Pair.buildFrom1( [
                QuasiQuoteCompiler.UNQUOTE_SPLICING,
                QuasiQuotation.inline3_( p, arg, paramIndex,
                    expr.cdr().car(), nesting - 1 ) ] );
    } else if ( QuasiQuotation.isQuasiQuote( expr ) ) {
        return Pair.buildFrom1( [ QuasiQuoteCompiler.QUASIQUOTE,
            QuasiQuotation.inline3_( p, arg, paramIndex,
                expr.cdr().car(), nesting + 1 ) ] );
    } else if ( expr.isNotPair() ) {
        return expr;
    }
    
    var list = [];
    var last = ArcObject.NIL;
    
    while ( !expr.isNotPair() )
        if ( QuasiQuotation.isUnQuote( expr )
            || QuasiQuotation.isQuasiQuote( expr ) ) {
            // catch post-dot unquotes
            last = QuasiQuotation.inline3_( p, arg, paramIndex,
                expr, nesting );
            expr = expr.cdr().cdr();
        } else {
            var current = expr.car();
            expr = expr.cdr();
            if ( QuasiQuotation.isUnQuoteSplicing( current ) )
                list.push( QuasiQuotation.inline3_( p, arg,
                    paramIndex, current, nesting ) );
            else if ( QuasiQuotation.isUnQuote( current )
                || QuasiQuotation.isQuasiQuote( current )
                || QuasiQuotation.isPair_( current ) )
                list.push( QuasiQuotation.inline3_( p, arg,
                    paramIndex, current, nesting ) );
            else
                list.push( current );
        }
    
    if ( !(expr instanceof Nil) )
        last = expr;
    
    return Pair.buildFrom2( list, last );
};

QuasiQuotation.prototype.nest = function ( threshold ) {
    return new QuasiQuotation( QuasiQuotation.nest_(
        threshold, this.target_, 1 ) );
};

QuasiQuotation.nest_ = function ( threshold, expr, nesting ) {
    if ( QuasiQuotation.isUnQuote( expr ) ) {
        if ( nesting === 1 )
            return Pair.buildFrom1( [ QuasiQuoteCompiler.UNQUOTE,
                expr.cdr().car().nest( threshold ) ] );
        else
            return Pair.buildFrom1( [ QuasiQuoteCompiler.UNQUOTE,
                QuasiQuotation.nest_( threshold,
                    expr.cdr().car(), nesting - 1 ) ] );
    } else if ( QuasiQuotation.isUnQuoteSplicing( expr ) ) {
        if ( nesting === 1 )
            return Pair.buildFrom1( [
                QuasiQuoteCompiler.UNQUOTE_SPLICING,
                expr.cdr().car().nest( threshold ) ] );
        else
            return Pair.buildFrom1( [
                QuasiQuoteCompiler.UNQUOTE_SPLICING,
                QuasiQuotation.nest_( threshold,
                    expr.cdr().car(), nesting - 1 ) ] );
    } else if ( QuasiQuotation.isQuasiQuote( expr ) ) {
        return Pair.buildFrom1( [ QuasiQuoteCompiler.QUASIQUOTE,
            QuasiQuotation.nest_( threshold,
                expr.cdr().car(), nesting + 1 ) ] );
    } else if ( expr.isNotPair() ) {
        return expr;
    }
    
    var list = [];
    var last = ArcObject.NIL;
    
    while ( !expr.isNotPair() )
        if ( QuasiQuotation.isUnQuote( expr )
            || QuasiQuotation.isQuasiQuote( expr ) ) {
            // catch post-dot unquotes
            last = QuasiQuotation.nest_( threshold, expr, nesting );
            expr = expr.cdr().cdr();
        } else {
            var current = expr.car();
            expr = expr.cdr();
            if ( QuasiQuotation.isUnQuoteSplicing( current )
                || QuasiQuotation.isUnQuote( current )
                || QuasiQuotation.isQuasiQuote( current )
                || QuasiQuotation.isPair_( current ) )
                list.push( QuasiQuotation.nest_( threshold,
                    current, nesting ) );
            else
                list.push( current );
        }
    
    if ( !(expr instanceof Nil) )
        last = expr;
    
    return Pair.buildFrom2( list, last );
};

QuasiQuotation.prototype.replaceBoundSymbols = function (
    lexicalBindings ) {
    
    return new QuasiQuotation( QuasiQuotation.replaceBoundSymbols_(
        lexicalBindings, this.target_, 1 ) );
};

QuasiQuotation.replaceBoundSymbols_ = function (
    lexicalBindings, expr, nesting ) {
    
    if ( QuasiQuotation.isUnQuote( expr ) ) {
        if ( nesting === 1 )
            return Pair.buildFrom1( [ QuasiQuoteCompiler.UNQUOTE,
                expr.cdr().car().replaceBoundSymbols(
                    lexicalBindings ) ] );
        else
            return Pair.buildFrom1( [ QuasiQuoteCompiler.UNQUOTE,
                QuasiQuotation.replaceBoundSymbols_( lexicalBindings,
                    expr.cdr().car(), nesting - 1 ) ] );
    } else if ( QuasiQuotation.isUnQuoteSplicing( expr ) ) {
        if ( nesting === 1 )
            return Pair.buildFrom1( [
                QuasiQuoteCompiler.UNQUOTE_SPLICING,
                expr.cdr().car().replaceBoundSymbols(
                    lexicalBindings ) ] );
        else
            return Pair.buildFrom1( [
                QuasiQuoteCompiler.UNQUOTE_SPLICING,
                QuasiQuotation.replaceBoundSymbols_( lexicalBindings,
                    expr.cdr().car(), nesting - 1 ) ] );
    } else if ( QuasiQuotation.isQuasiQuote( expr ) ) {
        return Pair.buildFrom1( [ QuasiQuoteCompiler.QUASIQUOTE,
            QuasiQuotation.replaceBoundSymbols_( lexicalBindings,
                expr.cdr().car(), nesting + 1 ) ] );
    } else if ( expr.isNotPair() ) {
        return expr;
    }
    
    var list = [];
    var last = ArcObject.NIL;
    
    while ( !expr.isNotPair() )
        if ( QuasiQuotation.isUnQuote( expr )
            || QuasiQuotation.isQuasiQuote( expr ) ) {
            // catch post-dot unquotes
            last = QuasiQuotation.replaceBoundSymbols_(
                lexicalBindings, expr, nesting );
            expr = expr.cdr().cdr();
        } else {
            var current = expr.car();
            expr = expr.cdr();
            if ( QuasiQuotation.isUnQuoteSplicing( current )
                || QuasiQuotation.isUnQuote( current )
                || QuasiQuotation.isQuasiQuote( current )
                || QuasiQuotation.isPair_( current ) )
                list.push( QuasiQuotation.replaceBoundSymbols_(
                    lexicalBindings, current, nesting ) );
            else
                list.push( current );
        }
    
    if ( !(expr instanceof Nil) )
        last = expr;
    
    return Pair.buildFrom2( list, last );
};

QuasiQuotation.prototype.visit = function ( v ) {
    v.acceptQuasiQuotation( this );
    // PORT NOTE: This local variable didn't exist in Java.
    var unquotes = this.unquotes();
    for ( var i = 0, len = unquotes.length; i < len; i++ )
        unquotes[ i ].visit( v );
    v.endQuasiQuotation( this );
};


// ===================================================================
// from vm/interpreter/qq/Unquote.java
// ===================================================================

/** @constructor */
function Unquote() {
}


// ===================================================================
// from vm/interpreter/qq/UnquoteSplicing.java
// ===================================================================

/** @constructor */
function UnquoteSplicing() {
}


// ===================================================================
// from vm/interpreter/visitor/Visitor.java
// ===================================================================

/** @constructor */
function Visitor() {
}

Visitor.prototype.acceptObject = function ( o ) {
};

Visitor.prototype.endObject = function ( o ) {
};

// PORT TODO: Rename all uses of accept().
Visitor.prototype.acceptInterpretedFunction = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptAssignment = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptBoundSymbol = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptElse = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptIfClause = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptIfThen = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptInstruction = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptInvocation = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptLastAssignment = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptPair = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptQuasiQuotation = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptQuotation = function ( o ) {
    this.acceptObject( o );
};

Visitor.prototype.acceptSingleAssignment = function ( o ) {
    this.acceptObject( o );
};

// PORT TODO: Rename all uses of end().
Visitor.prototype.endInterpretedFunction = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endAssignment = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endElse = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endIfClause = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endIfThen = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endInvocation = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endLastAssignment = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endPair = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endQuasiQuotation = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endQuotation = function ( o ) {
    this.endObject( o );
};

Visitor.prototype.endSingleAssignment = function ( o ) {
    this.endObject( o );
};


// ===================================================================
// from vm/interpreter/visitor/FunctionOwnershipVisitor.java
// ===================================================================
// Needed early: Visitor
// Needed late: Pair ArcObject

/** @constructor */
function FunctionOwnershipVisitor( top ) {
    Visitor.call( this );
    this.owners_ = new Pair( top, ArcObject.NIL );
}

FunctionOwnershipVisitor.prototype = new Visitor();

FunctionOwnershipVisitor.prototype.acceptInterpretedFunction =
    function ( o ) {
    
    o.belongsTo( this.owners_.car() );
    this.owners_ = new Pair( o, this.owners_ );
};

FunctionOwnershipVisitor.prototype.endInterpretedFunction = function (
    o ) {
    
    this.owners_ = this.owners_.cdr();
};


// ===================================================================
// from vm/interpreter/visitor/MeasureLexicalReach.java
// ===================================================================
// Needed early: Visitor

/** @constructor */
function MeasureLexicalReach( top ) {
    Visitor.call( this );
    this.stack_ = [];
    this.referrers_ = [];
    this.nesting_ = 0;
    this.reach_ = -1;
}

MeasureLexicalReach.prototype = new Visitor();

MeasureLexicalReach.prototype.reach = function () {
    return this.reach_;
};

MeasureLexicalReach.prototype.acceptInterpretedFunction =
    function ( f ) {
    
    if ( f.nests() )
        this.nesting_++;
};

MeasureLexicalReach.prototype.acceptObject = function ( o ) {
};

MeasureLexicalReach.prototype.endObject = function ( o ) {
};

MeasureLexicalReach.prototype.endInterpretedFunction = function (
    f ) {
    
    if ( f.nests() )
        this.nesting_--;
};

MeasureLexicalReach.prototype.acceptBoundSymbol = function ( b ) {
    var it = b.nesting - this.nesting_;
    if ( this.reach_ < it )
        this.reach_ = it;
};


// ===================================================================
// from vm/interpreter/visitor/ReferenceCounter.java
// ===================================================================
// Needed early: Visitor
// Needed late: Pair ArcObject

/** @constructor */
function ReferenceCounter( target ) {
    Visitor.call( this );
    this.stack_ = [];
    this.referrers_ = [];
    this.target_ = target;
}

ReferenceCounter.prototype = new Visitor();

ReferenceCounter.prototype.count = function () {
    return this.referrers_.length;
};

ReferenceCounter.prototype.acceptInterpretedFunction = function (
    f ) {
    
    this.stack_.unshift( f );
    if ( f.nests() )
        this.target_ = this.target_.nest( 0 );
};

ReferenceCounter.prototype.acceptObject = function ( o ) {
    this.stack_.unshift( o );
};

ReferenceCounter.prototype.endObject = function ( o ) {
    this.stack_.shift();
};

ReferenceCounter.prototype.endInterpretedFunction = function ( f ) {
    this.stack_.shift();
    if ( f.nests() )
        this.target_ = this.target_.unnest();
};

ReferenceCounter.prototype.acceptBoundSymbol = function ( b ) {
    if ( b.isSameBoundSymbol( this.target_ )
        && 0 < this.stack_.length )
        this.referrers_.push( this.stack_[ 0 ] );
};


// ===================================================================
// from vm/interceptor/FunctionProfile.java
// ===================================================================
// Needed late: ArcString InterpretedFunction Real ArcObject Pair
// InvocationCounter

// PORT NOTE: JavaScript can't do nanoseconds, but we pretend.

/** @constructor */
function FunctionProfile() {
    this.target = null;
    this.name = null;
    this.invocationCount = 0;
    this.nanoTime = 0;
    this.totalNanoTime = 0;
    this.children = [];
    this.parent = null;
    this.callerCounts = {};
    this.calleeCounts = {};
}

FunctionProfile.prototype.addNanoTime = function ( nanos ) {
    this.nanoTime += nanos;
    this.totalNanoTime += nanos;
    var p = this.parent;
    while ( p !== null ) {
        p.totalNanoTime += nanos;
        p = p.parent;
    }
};

FunctionProfile.prototype.toPair = function () {
    var fn = ArcString.make( this.target.profileName() );
    if ( this.target instanceof InterpretedFunction )
        fn = ArcString.make( this.target.localProfileName() );
    var nanos = Real.make( this.nanoTime / 1000000 );
    var totalNanos = Real.make( this.totalNanoTime / 1000000 );
    var invs = Rational.make1( invocationCount );
    var kidz = ArcObject.NIL;
    for ( var i = 0, children = this.children, len = children.length;
        i < len; i++ )
        kidz = new Pair( children[ i ].toPair(), kidz );
    return Pair.buildFrom1( [ totalNanos, nanos, invs, fn, kidz,
        this.toPair_( this.callerCounts ),
        this.toPair_( this.calleeCounts ) ] );
};

FunctionProfile.prototype.toPair_ = function ( cc ) {
    var callers = ArcObject.NIL;
    for ( var k in cc )
        callers = new Pair( cc[ k ].toPair(), callers );
    return callers;
};

FunctionProfile.get = function ( map, fn ) {
    var name = fn.profileName();
    var fp = map[ name ];
    if ( fp === void 0 ) {
        fp = new FunctionProfile();
        fp.target = fn;
        fp.name = name;
        map[ name ] = fp;
        if ( fn instanceof InterpretedFunction ) {
            var parent = fn.lexicalOwner();
            if ( parent !== null ) {
                var pfp = FunctionProfile.get( map, parent );
                pfp.children.push( fp );
                fp.parent = pfp;
            }
        }
    }
    
    return fp;
};

FunctionProfile.prototype.addCaller = function ( invocation ) {
    if ( invocation === null )
        return;
    InvocationCounter.get( this.callerCounts, invocation ).count++;
};

FunctionProfile.prototype.addCallee = function ( invocation ) {
    if ( invocation === null )
        return;
    InvocationCounter.get( this.calleeCounts, invocation ).count++;
};


// ===================================================================
// from vm/interceptor/InvocationCounter.java
// ===================================================================
// Needed late: InterpretedFunction Pair ArcString Rational

/** @constructor */
function InvocationCounter( target ) {
    this.target = target;
    this.count = 0;
    this.key = target.profileName();
}

InvocationCounter.prototype.inc = function () {
    this.count++;
};

InvocationCounter.prototype.toPair = function () {
    var n = key;
    if ( this.target instanceof InterpretedFunction )
        n = this.target.localProfileName();
    return new Pair( ArcString.make( n ),
        new Pair( Rational.make1( this.count ), ArcObject.NIL ) );
};

InvocationCounter.get = function ( map, o ) {
    var ic = map[ o.profileName() ];
    if ( ic === void 0 ) {
        ic = new InvocationCounter( o );
        map[ ic.key ] = ic;
    }
    return ic;
};


// ===================================================================
// from vm/interceptor/ProfileData.java
// ===================================================================

/** @constructor */
function ProfileData() {
    this.invocationProfile = {};
    this.instructionProfile = {};
    this.lastInvokee = null;
    this.now = 0;
}


// ===================================================================
// from vm/interceptor/VMInterceptor.java
// ===================================================================
// Needed late: FunctionProfile ProfileData

// PORT NOTE: This was originally an enum.

/** @constructor */
function VMInterceptor() {
}

VMInterceptor.updateNanoTime_ = function ( vm ) {
    var last = vm.profileData.lastInvokee;
    if ( last !== null )
        FunctionProfile.get( vm.profileData.invocationProfile, last ).
            addNanoTime(
                new Date().getTime() * 1000000 - vm.profileData.now );
};

// PORT NOTE: This was originally abstract.
VMInterceptor.prototype.check = void 0;

// PORT NOTE: This was originally abstract.
VMInterceptor.prototype.end = void 0;

// PORT NOTE: This was originally abstract.
VMInterceptor.prototype.install = void 0;

// PORT TODO: Stop using window.prompt.
VMInterceptor.debug = function ( vm ) {
    vm.show();
    var command = prompt(
        "q to resume execution, f to skip to the end of this " +
        "frame, any other key to step" );
    if ( command === null )
        return;
    if ( /^q$/i.test( command ) ) {
        vm.setInterceptor( VMInterceptor.NULL );
    } else if ( /^f$/i.test( command ) ) {
        vm.debug_target_frame = vm.ip - 1;
        vm.setInterceptor( VMInterceptor.NEXT_FRAME );
    }
};

/** @constructor */
VMInterceptor.NULL_class = function () {
};

VMInterceptor.NULL_class.prototype = new VMInterceptor();

VMInterceptor.NULL_class.prototype.check = function ( vm ) {
};

VMInterceptor.NULL_class.prototype.end = function ( vm ) {
};

VMInterceptor.NULL_class.prototype.install = function ( vm ) {
};

VMInterceptor.NULL = new VMInterceptor.NULL_class();

/** @constructor */
VMInterceptor.DEBUG_class = function () {
};

VMInterceptor.DEBUG_class.prototype = new VMInterceptor();

VMInterceptor.DEBUG_class.prototype.check = function ( vm ) {
    VMInterceptor.debug( vm );
};

VMInterceptor.DEBUG_class.prototype.end = function ( vm ) {
    System_out_println( "VM thread finished: returning." );
    VMInterceptor.debug( vm );
};

VMInterceptor.DEBUG_class.prototype.install = function ( vm ) {
};

VMInterceptor.DEBUG = new VMInterceptor.DEBUG_class();

/** @constructor */
VMInterceptor.KILL_class = function () {
};

VMInterceptor.KILL_class.prototype = new VMInterceptor();

VMInterceptor.KILL_class.prototype.check = function ( vm ) {
    vm.die();
};

VMInterceptor.KILL_class.prototype.end = function ( vm ) {
};

VMInterceptor.KILL_class.prototype.install = function ( vm ) {
};

VMInterceptor.KILL = new VMInterceptor.KILL_class();

/** @constructor */
VMInterceptor.NEXT_FRAME_class = function () {
};

VMInterceptor.NEXT_FRAME_class.prototype = new VMInterceptor();

VMInterceptor.NEXT_FRAME_class.prototype.check = function ( vm ) {
    if ( vm.ip <= vm.debug_target_frame )
        vm.setInterceptor( VMInterceptor.DEBUG );
};

VMInterceptor.NEXT_FRAME_class.prototype.end = function ( vm ) {
};

VMInterceptor.NEXT_FRAME_class.prototype.install = function ( vm ) {
};

VMInterceptor.NEXT_FRAME = new VMInterceptor.NEXT_FRAME_class();

/** @constructor */
VMInterceptor.PROFILE_class = function () {
};

VMInterceptor.PROFILE_class.prototype = new VMInterceptor();

VMInterceptor.PROFILE_class.prototype.addInstruction_ = function (
    i, vm ) {
    
    var c =
        vm.profileData.instructionProfile[ i.getClass().getName() ];
    if ( c === void 0 )
        c = 1;
    else
        c++;
    vm.profileData.instructionProfile[ i.getClass().getName() ] = c;
};

VMInterceptor.PROFILE_class.prototype.check = function ( vm ) {
    VMInterceptor.updateNanoTime_( vm );
    var thisInstruction = vm.nextInstruction();
    if ( thisInstruction === null )
        return;
    vm.loadCurrentContext();
    this.addInstruction( thisInstruction, vm );
    if ( thisInstruction.implementsInvoke ) {
        var fn = thisInstruction.getInvokee( vm );
        if ( fn instanceof Closure )
            fn = fn.fn();
        var thisProfile = FunctionProfile.get(
            vm.profileData.invocationProfile, fn );
        var caller = thisInstruction.owner();
        thisProfile.addCaller( caller );
        FunctionProfile.
            get( vm.profileData.invocationProfile, caller ).
            addCallee( fn );
        thisProfile.invocationCount++;
        vm.profileData.lastInvokee = fn;
    } else if ( thisInstruction.owner() !== null ) {
        vm.profileData.lastInvokee = thisInstruction.owner();
    } else {
        vm.profileData.lastInvokee = ArcObject.NIL;
    }
    vm.profileData.now = new Date().getTime() * 1000000;
};

VMInterceptor.PROFILE_class.prototype.end = function ( vm ) {
};

VMInterceptor.PROFILE_class.prototype.install = function ( vm ) {
    vm.profileData = new ProfileData();
    vm.profileData.now = new Date().getTime() * 1000000;
};

VMInterceptor.PROFILE = new VMInterceptor.PROFILE_class();


// ===================================================================
// from vm/compiler/AssignmentBuilder.java
// ===================================================================
// Needed early: Instruction
// Needed late: Assignment ArcString Nil ArcError Compiler

var AssignmentBuilder = {};

// ASYNC PORT NOTE: The synchronous Java version is below.
AssignmentBuilder.build = function ( vm, body, lexicalBindings ) {
    var assignment = new Assignment();
    assignment.prepare( body.len() );
    
    var i = new Literal( assignment );
    // ASYNC PORT TODO: Come up with a better owner for this.
    i.belongsTo( ArcString.make( "AssignmentBuilder.build" ) );
    vm.pushFrame( i );
    
    vm.pushFrame( new AssignmentBuilder.BuildAssignment1(
        assignment, body, lexicalBindings ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
AssignmentBuilder.BuildAssignment1 = function (
    assignment, body, lexicalBindings ) {
    
    Instruction.call( this );
    this.assignment_ = assignment;
    this.body_ = body;
    this.lexicalBindings_ = lexicalBindings;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "AssignmentBuilder.build" ) );
};

AssignmentBuilder.BuildAssignment1.prototype = new Instruction();
AssignmentBuilder.BuildAssignment1.prototype.className =
    "AssignmentBuilder.BuildAssignment1";

AssignmentBuilder.BuildAssignment1.prototype.operate = function (
    vm ) {
    
    if ( this.body_ instanceof Nil )
        return;
    
    try {
        this.body_.mustBePairOrNil();
    } catch ( e ) { if ( !(e instanceof Pair.NotPair) ) throw e;
        throw new ArcError( "assign: unexpected: " + this.body_ );
    }
    
    vm.pushFrame( new AssignmentBuilder.BuildAssignment2(
        this.assignment_, this.body_.cdr(), this.lexicalBindings_ ) );
    Compiler.compile( vm, this.body_.car(), this.lexicalBindings_ );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
AssignmentBuilder.BuildAssignment2 = function (
    assignment, body, lexicalBindings ) {
    
    Instruction.call( this );
    this.assignment_ = assignment;
    this.body_ = body;
    this.lexicalBindings_ = lexicalBindings;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "AssignmentBuilder.build" ) );
};

AssignmentBuilder.BuildAssignment2.prototype = new Instruction();
AssignmentBuilder.BuildAssignment2.prototype.className =
    "AssignmentBuilder.BuildAssignment2";

AssignmentBuilder.BuildAssignment2.prototype.operate = function (
    vm ) {
    
    this.assignment_.take( vm.popA().reduce() );
    vm.pushFrame( new AssignmentBuilder.BuildAssignment1(
        this.assignment_, this.body_, this.lexicalBindings_ ) );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//AssignmentBuilder.build = function ( vm, body, lexicalBindings ) {
//    var assignment = new Assignment();
//    assignment.prepare( body.len() );
//    while ( !(body instanceof Nil) ) {
//        try {
//            body.mustBePairOrNil();
//        } catch ( e ) { if ( !(e instanceof Pair.NotPair) ) throw e;
//            throw new ArcError( "assign: unexpected: " + body );
//        }
//        assignment.take( Compiler.compile(
//            vm, body.car(), lexicalBindings ).reduce() );
//        body = body.cdr();
//    }
//    return assignment;
//};


// ===================================================================
// from vm/compiler/Compiler.java
// ===================================================================
// Needed early: ArcObject Symbol Instruction
// Needed late: Nil ArcString Evaluation Pair BoundSymbol Quotation
// QuasiQuoteCompiler QuasiQuotation FunctionBodyBuilder IfBuilder
// AssignmentBuilder InvocationBuilder Tagged

var Compiler = {};

Compiler.atstrings = ArcObject.NIL;
Compiler.atStringFunction = Symbol.mkSym( "at-string" );

// ASYNC PORT NOTE: The synchronous Java version is below.
Compiler.compile = function ( vm, expression, lexicalBindings ) {
    if ( expression instanceof Nil ) {
        vm.pushA( expression );
    } else if ( expression instanceof ArcString
        && !(Compiler.atstrings instanceof Nil) ) {
        vm.pushFrame(
            new Compiler.FinishAtString( lexicalBindings ) );
        Compiler.atString_( vm, expression );
    } else if ( Evaluation.isSpecialSyntax( expression ) ) {
        Compiler.compile(
            vm, Evaluation.ssExpand( expression ), lexicalBindings );
    } else if ( expression instanceof Pair ) {
        Compiler.compilePair( vm, expression, lexicalBindings );
    } else if ( expression instanceof Symbol ) {
        for ( var i = 0; i < lexicalBindings.length; i++ )
            if ( expression.name() in lexicalBindings[ i ] )
                return void vm.pushA( BoundSymbol.make( expression, i,
                    lexicalBindings[ i ][ expression.name() ] ) );
        vm.pushA( expression );
    } else {
        vm.pushA( expression );
    }
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
Compiler.FinishAtString = function ( lexicalBindings ) {
    Instruction.call( this );
    this.lexicalBindings_ = lexicalBindings;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "Compiler.compile" ) );
};

Compiler.FinishAtString.prototype = new Instruction();
Compiler.FinishAtString.prototype.className =
    "Compiler.FinishAtString";

Compiler.FinishAtString.prototype.operate = function ( vm ) {
    var string = vm.popA();
    if ( string instanceof ArcString )
        vm.pushA( string );
    else
        Compiler.compile( vm, string, this.lexicalBindings_ );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//Compiler.compile = function ( vm, expression, lexicalBindings ) {
//    if ( expression instanceof Nil ) {
//        return expression;
//    } else if ( expression instanceof ArcString
//        && !(Compiler.atstrings instanceof Nil) ) {
//        var string = Compiler.atString_( vm, expression );
//        if ( string instanceof ArcString )
//            return string;
//        else
//            return Compiler.compile( vm, string, lexicalBindings );
//    } else if ( Evaluation.isSpecialSyntax( expression ) ) {
//        return Compiler.compile(
//            vm, Evaluation.ssExpand( expression ), lexicalBindings );
//    } else if ( expression instanceof Pair ) {
//        return Compiler.compilePair(
//            vm, expression, lexicalBindings );
//    } else if ( expression instanceof Symbol ) {
//        for ( var i = 0; i < lexicalBindings.length; i++ )
//            if ( expression.name() in lexicalBindings[ i ] )
//                return BoundSymbol.make( expression, i,
//                    lexicalBindings[ i ][ expression.name() ] );
//        return expression;
//    } else {
//        return expression;
//    }
//};

// ASYNC PORT NOTE: The synchronous Java version is below.
Compiler.compilePair = function ( vm, expression, lexicalBindings ) {
    var f = Compiler.getMacro_( expression );
    if ( f !== null ) {
        // PORT NOTE: This local variable didn't exist in Java.
        var cdr = expression.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(cdr instanceof Pair) )
            throw new TypeError();
        vm.pushFrame( new Compiler.ThenCompile( lexicalBindings ) );
        f.invokeAndWait( vm, cdr );
    } else {
        var fun = expression.car();
        if ( Symbol.is( "quote", fun ) ) {
            vm.pushA( new Quotation( expression.cdr().car() ) );
        } else if ( fun === QuasiQuoteCompiler.QUASIQUOTE ) {
            vm.pushFrame( new Compiler.WrapQuasiQuotation() );
            QuasiQuoteCompiler.compile(
                vm, expression.cdr().car(), lexicalBindings, 1 );
        } else if ( Symbol.is( "fn", fun ) ) {
            // PORT NOTE: This local variable didn't exist in Java.
            var cdr = expression.cdr();
            // PORT NOTE: This was a cast in Java.
            if ( !(cdr instanceof Pair) )
                throw new TypeError();
            FunctionBodyBuilder.build( vm, cdr, lexicalBindings );
        } else if ( Symbol.is( "if", fun ) ) {
            IfBuilder.build( vm, expression.cdr(), lexicalBindings );
        } else if ( Symbol.is( "assign", fun ) ) {
            AssignmentBuilder.build(
                vm, expression.cdr(), lexicalBindings );
        } else if ( Symbol.is( "compose", fun.xcar() ) ) {
            // PORT NOTE: This local variable didn't exist in Java.
            var funCdr = fun.cdr();
            // PORT NOTE: This was a cast in Java.
            if ( !(funCdr instanceof Pair) )
                throw new TypeError();
            // PORT NOTE: This local variable didn't exist in Java.
            var expressionCdr = expression.cdr();
            // PORT NOTE: This was a cast in Java.
            if ( !(expressionCdr instanceof Pair) )
                throw new TypeError();
            Compiler.compile( vm,
                Compiler.decompose_( funCdr, expressionCdr ),
                lexicalBindings );
        } else if ( Symbol.is( "complement", fun.xcar() ) ) {
            // PORT NOTE: This local variable didn't exist in Java.
            var cdr = expression.cdr();
            // PORT NOTE: This was a cast in Java.
            if ( !(cdr instanceof Pair) )
                throw new TypeError();
            Compiler.compile( vm,
                Compiler.decomplement_( fun.cdr().car(), cdr ),
                lexicalBindings );
        } else if ( Evaluation.isSpecialSyntax( fun ) ) {
            Compiler.compile( vm,
                new Pair(
                    Evaluation.ssExpand( fun ), expression.cdr() ),
                lexicalBindings );
        } else {
            InvocationBuilder.build(
                vm, expression, lexicalBindings );
        }
    }
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
Compiler.ThenCompile = function ( lexicalBindings ) {
    Instruction.call( this );
    this.lexicalBindings_ = lexicalBindings;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "Compiler.compilePair" ) );
};

Compiler.ThenCompile.prototype = new Instruction();
Compiler.ThenCompile.prototype.className = "Compiler.ThenCompile";

Compiler.ThenCompile.prototype.operate = function ( vm ) {
    Compiler.compile( vm, vm.popA(), this.lexicalBindings_ );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
Compiler.WrapQuasiQuotation = function () {
    Instruction.call( this );
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "Compiler.compilePair" ) );
};

Compiler.WrapQuasiQuotation.prototype = new Instruction();
Compiler.WrapQuasiQuotation.prototype.className =
    "Compiler.WrapQuasiQuotation";

Compiler.WrapQuasiQuotation.prototype.operate = function ( vm ) {
    vm.pushA( new QuasiQuotation( vm.popA() ) );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//Compiler.compilePair = function ( vm, expression, lexicalBindings ) {
//    var f = Compiler.getMacro_( expression );
//    if ( f !== null ) {
//        // PORT NOTE: This local variable didn't exist in Java.
//        var cdr = expression.cdr();
//        // PORT NOTE: This was a cast in Java.
//        if ( !(cdr instanceof Pair) )
//            throw new TypeError();
//        var expanded = f.invokeAndWait( vm, cdr );
//        return Compiler.compile( vm, expanded, lexicalBindings );
//    } else {
//        var fun = expression.car();
//        if ( Symbol.is( "quote", fun ) ) {
//            return new Quotation( expression.cdr().car() );
//        } else if ( fun === QuasiQuoteCompiler.QUASIQUOTE ) {
//            return new QuasiQuotation( QuasiQuoteCompiler.compile(
//                vm, expression.cdr().car(), lexicalBindings, 1 ) );
//        } else if ( Symbol.is( "fn", fun ) ) {
//            // PORT NOTE: This local variable didn't exist in Java.
//            var cdr = expression.cdr();
//            // PORT NOTE: This was a cast in Java.
//            if ( !(cdr instanceof Pair) )
//                throw new TypeError();
//            return FunctionBodyBuilder.build(
//                vm, cdr, lexicalBindings );
//        } else if ( Symbol.is( "if", fun ) ) {
//            return IfBuilder.build(
//                vm, expression.cdr(), lexicalBindings );
//        } else if ( Symbol.is( "assign", fun ) ) {
//            return AssignmentBuilder.build(
//                vm, expression.cdr(), lexicalBindings );
//        } else if ( Symbol.is( "compose", fun.xcar() ) ) {
//            // PORT NOTE: This local variable didn't exist in Java.
//            var funCdr = fun.cdr();
//            // PORT NOTE: This was a cast in Java.
//            if ( !(funCdr instanceof Pair) )
//                throw new TypeError();
//            // PORT NOTE: This local variable didn't exist in Java.
//            var expressionCdr = expression.cdr();
//            // PORT NOTE: This was a cast in Java.
//            if ( !(expressionCdr instanceof Pair) )
//                throw new TypeError();
//            return Compiler.compile( vm,
//                Compiler.decompose_( funCdr, expressionCdr ),
//                lexicalBindings );
//        } else if ( Symbol.is( "complement", fun.xcar() ) ) {
//            // PORT NOTE: This local variable didn't exist in Java.
//            var cdr = expression.cdr();
//            // PORT NOTE: This was a cast in Java.
//            if ( !(cdr instanceof Pair) )
//                throw new TypeError();
//            return Compiler.compile( vm,
//                Compiler.decomplement_( fun.cdr().car(), cdr ),
//                lexicalBindings );
//        } else if ( Evaluation.isSpecialSyntax( fun ) ) {
//            return Compiler.compile( vm,
//                new Pair(
//                    Evaluation.ssExpand( fun ), expression.cdr() ),
//                lexicalBindings );
//        } else {
//            return InvocationBuilder.build(
//                vm, expression, lexicalBindings );
//        }
//    }
//};

Compiler.decompose_ = function ( fns, args ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var car = fns.car();
    if ( fns.cdr() instanceof Nil )
        return new Pair( car, args );
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr = fns.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr instanceof Pair) )
        throw new TypeError();
    return new Pair( car,
        new Pair( Compiler.decompose_( cdr, args ), ArcObject.NIL ) );
};

Compiler.decomplement_ = function ( not, args ) {
    return new Pair( Symbol.mkSym( "no" ),
        new Pair( new Pair( not, args ), ArcObject.NIL ) );
};

// ASYNC PORT NOTE: The synchronous Java version is below.
Compiler.atString_ = function ( vm, expression ) {
    if ( !Compiler.atStringFunction.bound() )
        return void vm.pushA( expression );
    
    var fn = Compiler.atStringFunction.value();
    fn.invokeAndWait( vm, new Pair( expression, ArcObject.NIL ) );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//Compiler.atString_ = function ( vm, expression ) {
//    if ( !Compiler.atStringFunction.bound() )
//        return expression;
//    
//    var fn = Compiler.atStringFunction.value();
//    return fn.invokeAndWait(
//        vm, new Pair( expression, ArcObject.NIL ) );
//};

Compiler.getMacro_ = function ( maybeMacCall ) {
    var first = maybeMacCall.car();
    if ( !(first instanceof Symbol) )
        return null;
    
    if ( !first.bound() )
        return null;
    
    return Tagged.ifTagged( first.value(), "mac" );
};


// ===================================================================
// from vm/compiler/FunctionBodyBuilder.java
// ===================================================================
// Needed late: Nil Pair ArcObject FunctionParameterListBuilder Pair
// PairExpander ArcError classes SimpleArgs ComplexArgs

var FunctionBodyBuilder = {};

// ASYNC PORT NOTE: The synchronous Java version is below.
FunctionBodyBuilder.build = function ( vm, args, lexicalBindings ) {
    if ( lexicalBindings === null )
        throw new ReferenceError(
            "can't have null lexical bindings!" );
    var myParams = {};
    var parameters = args.car();
    var complexParams;
    var parameterList;
    if ( !(parameters instanceof Nil) )
        lexicalBindings = [ myParams ].concat( lexicalBindings );
    vm.pushFrame( new FunctionBodyBuilder.Intermediate(
        args, lexicalBindings, myParams ) );
    if ( parameters instanceof Nil )
        vm.pushA( new Pair( ArcObject.NIL, ArcObject.NIL ) );
    else
        FunctionParameterListBuilder.build(
            vm, parameters, lexicalBindings );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
FunctionBodyBuilder.Intermediate = function (
    args, lexicalBindings, myParams ) {
    
    Instruction.call( this );
    this.args_ = args;
    this.lexicalBindings_ = lexicalBindings;
    this.myParams_ = myParams;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "FunctionBodyBuilder.build" ) );
}

FunctionBodyBuilder.Intermediate.prototype = new Instruction();
FunctionBodyBuilder.Intermediate.prototype.className =
    "FunctionBodyBuilder.Intermediate";

FunctionBodyBuilder.Intermediate.prototype.operate = function ( vm ) {
    var fpl = vm.popA();
    var complexParams = fpl.car();
    var parameterList = fpl.cdr();
    
    var body = this.args_.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(body instanceof Pair) )
        throw new TypeError();
    vm.pushFrame( new FunctionBodyBuilder.Finish( parameterList,
        this.myParams_, body, complexParams, vm.getAp() ) );
    PairExpander.expand( vm, body, this.lexicalBindings_ );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
FunctionBodyBuilder.Finish = function (
    parameterList, myParams, body, complexParams, ap ) {
    
    Instruction.call( this );
    this.parameterList_ = parameterList;
    this.myParams_ = myParams;
    this.body_ = body;
    this.complexParams_ = complexParams;
    this.ap_ = ap;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "FunctionBodyBuilder.build" ) );
}

FunctionBodyBuilder.Finish.prototype = new Instruction();
FunctionBodyBuilder.Finish.prototype.implementsOnError = true;
FunctionBodyBuilder.Finish.prototype.className =
    "FunctionBodyBuilder.Finish";

// ASYNC PORT NOTE: This method of the OnError interface didn't exist
// in Java. The point is to let certain errors propagate without
// losing their stack traces.
FunctionBodyBuilder.Finish.prototype.catches = function ( error ) {
    return error instanceof Error;
};

FunctionBodyBuilder.Finish.prototype.operate = function ( vm ) {
    var error = vm.error();
    if ( error !== null ) {
        vm.clearError();
        vm.setAp( this.ap_ );
        
        throw new ArcError(
            "building function fn " + this.parameterList_ + " " +
            this.body_ + ": " + error, error );
    }
    
    vm.pushA( FunctionBodyBuilder.buildFunctionBody(
        this.parameterList_, this.myParams_, vm.popA(),
        this.complexParams_ ) );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//FunctionBodyBuilder.build = function ( vm, args, lexicalBindings ) {
//    if ( lexicalBindings === null )
//        throw new ReferenceError(
//            "can't have null lexical bindings!" );
//    var myParams = {};
//    var parameters = args.car();
//    var complexParams;
//    var parameterList;
//    if ( parameters instanceof Nil ) {
//        complexParams = ArcObject.NIL;
//        parameterList = ArcObject.NIL;
//    } else {
//        lexicalBindings = [ myParams ].concat( lexicalBindings );
//        var fpl = FunctionParameterListBuilder.build(
//            vm, parameters, lexicalBindings );
//        complexParams = fpl.car();
//        parameterList = fpl.cdr();
//    }
//    
//    var body = args.cdr();
//    // PORT NOTE: This was a cast in Java.
//    if ( !(body instanceof Pair) )
//        throw new TypeError();
//    try {
//        var expandedBody =
//            PairExpander.expand( vm, body, lexicalBindings );
//    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
//        throw new ArcError(
//            "building function fn " + parameterList + " " +
//            body + ": " + e, e );
//    }
//    return FunctionBodyBuilder.buildFunctionBody(
//        parameterList, myParams, expandedBody, complexParams );
//};

FunctionBodyBuilder.buildFunctionBody = function (
    parameterList, lexicalBindings, expandedBody, complexParams ) {
    
    var cname = "rainbow.function.interpreted.optimise.Bind" +
        FunctionBodyBuilder.sig( parameterList, false );
    // PORT NOTE: In Java, this was handled by catching
    // ClassNotFoundException and NoSuchMethodException.
    var Cons = classes[ cname ];
    if ( Cons === void 0 )
        return FunctionBodyBuilder.defaultFunctionBody_(
            parameterList, lexicalBindings, expandedBody,
            complexParams );
    
    try {
        // PORT NOTE: This local variable didn't exist in Java.
        // PORT TODO: Figure out a better way to have the Closure
        // Compiler realize that "of" is actually used here. For now,
        // we just keep it from renaming "of" by using a string
        // literal.
        var result = Cons[ "of" ](
            parameterList, lexicalBindings, expandedBody );
        // PORT NOTE: This was a cast in Java.
        if ( !(result instanceof ArcObject) )
            throw new TypeError();
        return result;
    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
        throw new ArcError(
            "Couldn't instantiate " + cname + ": " + e, e );
    }
};

FunctionBodyBuilder.buildStackFunctionBody = function (
    parameterList, lexicalBindings, expandedBody, complexParams ) {
    
    var sig = FunctionBodyBuilder.sig( parameterList, false );
    if ( sig === "" )
        return FunctionBodyBuilder.buildFunctionBody(
            parameterList, lexicalBindings, expandedBody,
            complexParams );
    
    var cname = "rainbow.function.interpreted.optimise.stack.Stack" +
        sig;
    // PORT NOTE: In Java, this was handled by catching
    // ClassNotFoundException and NoSuchMethodException.
    var Cons = classes[ cname ];
    if ( Cons === void 0 )
        throw new ArcError(
            "no stack-based function implementation for " +
            parameterList + "; couldn't find " + cname );
    
    try {
        // PORT NOTE: This local variable didn't exist in Java.
        // PORT TODO: Figure out a better way to have the Closure
        // Compiler realize that "of3" is actually used here. For now,
        // we just keep it from renaming "of3" by using a string
        // literal.
        var result = Cons[ "of3" ](
            parameterList, lexicalBindings, expandedBody );
        // PORT NOTE: This was a cast in Java.
        if ( !(result instanceof ArcObject) )
            throw new TypeError();
        return result;
    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
        throw new ArcError(
            "Couldn't instantiate " + cname + ": " + e, e );
    }
};

FunctionBodyBuilder.convertToStackParams = function ( ifn ) {
    var sig = FunctionBodyBuilder.sig( ifn.parameterList(), false );
    var cname = "rainbow.function.interpreted.optimise.stack.Stack" +
        sig;
    // PORT NOTE: In Java, this was handled by catching
    // ClassNotFoundException and NoSuchMethodException.
    var Cons = classes[ cname ];
    if ( Cons === void 0 ) {
//        System_out_println(
//            "no implementation " + cname + " for " + ifn );
        return ifn;
    }
    
    try {
        // PORT NOTE: This local variable didn't exist in Java.
        // PORT TODO: Figure out a better way to have the Closure
        // Compiler realize that "of1" is actually used here. For now,
        // we just keep it from renaming "of1" by using a string
        // literal.
        var result = Cons[ "of1" ]( ifn );
        // PORT NOTE: This was a cast in Java.
        if ( !(result instanceof ArcObject) )
            throw new TypeError();
        return result;
    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
        throw new ArcError(
            "Couldn't instantiate " + cname + ": " + e, e );
    }
};

FunctionBodyBuilder.defaultFunctionBody_ = function (
    parameterList, lexicalBindings, expandedBody, complexParams ) {
    
    if ( complexParams instanceof Nil )
        return new SimpleArgs(
            parameterList, lexicalBindings, expandedBody );
    else
        return new ComplexArgs(
            parameterList, lexicalBindings, expandedBody );
};

FunctionBodyBuilder.sig = function ( parameterList, optionable ) {
    if ( parameterList instanceof Nil )
        return "";
    
    if ( parameterList instanceof Pair ) {
        if ( optionable ) {
            if ( ComplexArgs.optional( parameterList ) ) {
                var expr = parameterList.cdr().cdr().car();
                if ( expr.literal() )
                    return "_Oliteral";
                else if ( expr instanceof BoundSymbol )
                    return "_Obound";
                else
                    return "_Oother";
            } else {
                var next = parameterList.car();
                return "_D" + FunctionBodyBuilder.sig( next, true ) +
                    FunctionBodyBuilder.sig(
                        parameterList.cdr(), false ) + "_d";
            }
        } else {
            return FunctionBodyBuilder.sig(
                parameterList.car(), true ) +
                FunctionBodyBuilder.sig( parameterList.cdr(), false );
        }
    } else if ( !optionable ) {
        return "_R";
    } else {
        return "_A";
    }
};

FunctionBodyBuilder.visit = function (
    v, parameterList, optionable ) {
    
    if ( parameterList instanceof Nil )
        return;
    
    if ( parameterList instanceof Pair ) {
        if ( optionable && ComplexArgs.optional( parameterList ) ) {
            parameterList.cdr().cdr().car().visit( v );
        } else {
            FunctionBodyBuilder.visit( v, parameterList.car(), true );
            FunctionBodyBuilder.visit(
                v, parameterList.cdr(), false );
        }
    }
};


// ===================================================================
// from vm/compiler/FunctionParameterListBuilder.java
// ===================================================================
// Needed early: Symbol Instruction
// Needed late: ArcObject ArcString Pair Nil ComplexArgs ArcError

var FunctionParameterListBuilder = {};

FunctionParameterListBuilder.O = Symbol.mkSym( "o" );
FunctionParameterListBuilder.NIL_ARG = Symbol.mkSym( "#NIL#" );

// ASYNC PORT NOTE: The synchronous Java version is below.
FunctionParameterListBuilder.build = function (
    vm, parameters, lexicalBindings ) {
    
    FunctionParameterListBuilder.index(
        parameters, lexicalBindings[ 0 ], [ 0 ], false );
    FunctionParameterListBuilder.buildParams_(
        vm, parameters, lexicalBindings );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//FunctionParameterListBuilder.build = function (
//    vm, parameters, lexicalBindings ) {
//    
//    FunctionParameterListBuilder.index(
//        parameters, lexicalBindings[ 0 ], [ 0 ], false );
//    return FunctionParameterListBuilder.buildParams_(
//        vm, parameters, lexicalBindings );
//};

// ASYNC PORT NOTE: The synchronous Java version is below.
FunctionParameterListBuilder.buildParams_ = function (
    vm, parameters, lexicalBindings ) {
    
    var complexParams = { value: ArcObject.NIL };
    var result = [];
    
    vm.pushFrame( new FunctionParameterListBuilder.ReturnParams(
        result, complexParams ) );
    vm.pushFrame( new FunctionParameterListBuilder.BuildParams1(
        result, complexParams, parameters, lexicalBindings ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
FunctionParameterListBuilder.ReturnParams = function (
    result, complexParams ) {
    
    Instruction.call( this );
    this.result_ = result;
    this.complexParams_ = complexParams;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make(
        "FunctionParameterListBuilder.buildParams_" ) );
};

FunctionParameterListBuilder.ReturnParams.prototype =
    new Instruction();
FunctionParameterListBuilder.ReturnParams.prototype.className =
    "FunctionParameterListBuilder.ReturnParams";

FunctionParameterListBuilder.ReturnParams.prototype.operate =
    function ( vm ) {
    
    if ( this.result_.length === 0 )
        vm.pushA( FunctionParameterListBuilder.returnParams_(
            this.complexParams_.value, vm.popA() ) );
    else
        vm.pushA( FunctionParameterListBuilder.returnParams_(
            this.complexParams_.value,
            Pair.buildFrom2( this.result_, vm.popA() ) ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
FunctionParameterListBuilder.BuildParams1 = function (
    result, complexParams, parameters, lexicalBindings ) {
    
    Instruction.call( this );
    this.result_ = result;
    this.complexParams_ = complexParams;
    this.parameters_ = parameters;
    this.lexicalBindings_ = lexicalBindings;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make(
        "FunctionParameterListBuilder.buildParams_" ) );
};

FunctionParameterListBuilder.BuildParams1.prototype =
    new Instruction();
FunctionParameterListBuilder.BuildParams1.prototype.className =
    "FunctionParameterListBuilder.BuildParams1";

FunctionParameterListBuilder.BuildParams1.prototype.operate =
    function ( vm ) {
    
    if ( this.parameters_.isNotPair() ) {
        var i = new Literal( this.parameters_ );
        i.belongsTo( this );
        vm.pushFrame( i );
        return;
    }
    
    var first = this.parameters_.car();
    var newParameters = this.parameters_.cdr();
    if ( !(first instanceof Pair) ) {
        this.result_.push( first );
        vm.pushFrame( new FunctionParameterListBuilder.BuildParams1(
            this.result_, this.complexParams_, newParameters,
            this.lexicalBindings_ ) );
    } else if ( first instanceof Nil ) {
        this.result_.push( FunctionParameterListBuilder.NIL_ARG );
        vm.pushFrame( new FunctionParameterListBuilder.BuildParams1(
            this.result_, this.complexParams_, newParameters,
            this.lexicalBindings_ ) );
    } else {
        this.complexParams_.value = ArcObject.T;
        if ( ComplexArgs.optional( first ) ) {
            var optionalParamName = first.cdr().car();
            vm.pushFrame(
                new FunctionParameterListBuilder.BuildParams2a(
                    this.result_, this.complexParams_, newParameters,
                    this.lexicalBindings_, optionalParamName ) );
            Compiler.compile(
                vm, first.cdr().cdr().car(), this.lexicalBindings_ );
        } else {
            vm.pushFrame(
                new FunctionParameterListBuilder.BuildParams2b(
                    this.result_, this.complexParams_, newParameters,
                    this.lexicalBindings_ ) );
            FunctionParameterListBuilder.buildParams_(
                vm, first, this.lexicalBindings_ );
//            result.push(
//                FunctionParameterListBuilder.buildParams_(
//                    vm, first, this.lexicalBindings_ ).cdr() );
//            }
        }
    }
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
FunctionParameterListBuilder.BuildParams2a = function (
    result, complexParams, parameters, lexicalBindings,
    optionalParamName ) {
    
    Instruction.call( this );
    this.result_ = result;
    this.complexParams_ = complexParams;
    this.parameters_ = parameters;
    this.lexicalBindings_ = lexicalBindings;
    this.optionalParamName_ = optionalParamName;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make(
        "FunctionParameterListBuilder.buildParams_" ) );
};

FunctionParameterListBuilder.BuildParams2a.prototype =
    new Instruction();
FunctionParameterListBuilder.BuildParams2a.prototype.className =
    "FunctionParameterListBuilder.BuildParams2a";

FunctionParameterListBuilder.BuildParams2a.prototype.operate =
    function ( vm ) {
    
    this.result_.push( Pair.buildFrom1( [
        FunctionParameterListBuilder.O, this.optionalParamName_,
        vm.popA() ] ) );
    vm.pushFrame( new FunctionParameterListBuilder.BuildParams1(
        this.result_, this.complexParams_, this.parameters_,
        this.lexicalBindings_ ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
FunctionParameterListBuilder.BuildParams2b = function (
    result, complexParams, parameters, lexicalBindings ) {
    
    Instruction.call( this );
    this.result_ = result;
    this.complexParams_ = complexParams;
    this.parameters_ = parameters;
    this.lexicalBindings_ = lexicalBindings;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make(
        "FunctionParameterListBuilder.buildParams_" ) );
};

FunctionParameterListBuilder.BuildParams2b.prototype =
    new Instruction();
FunctionParameterListBuilder.BuildParams2b.prototype.className =
    "FunctionParameterListBuilder.BuildParams2b";

FunctionParameterListBuilder.BuildParams2b.prototype.operate =
    function ( vm ) {
    
    this.result_.push( vm.popA().cdr() );
    vm.pushFrame( new FunctionParameterListBuilder.BuildParams1(
        this.result_, this.complexParams_, this.parameters_,
        this.lexicalBindings_ ) );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//FunctionParameterListBuilder.buildParams_ = function (
//    vm, parameters, lexicalBindings ) {
//    
//    var complexParams = ArcObject.NIL;
//    var result = [];
//    
//    while ( !parameters.isNotPair() ) {
//        var first = parameters.car();
//        parameters = parameters.cdr();
//        if ( !(first instanceof Pair) ) {
//            result.push( first );
//        } else if ( first instanceof Nil ) {
//            result.push( FunctionParameterListBuilder.NIL_ARG );
//        } else {
//            complexParams = ArcObject.T;
//            if ( ComplexArgs.optional( first ) ) {
//                var optionalParamName = first.cdr().car();
//                var compiledOptionalExpression = Compiler.compile(
//                    vm, first.cdr().cdr().car(), lexicalBindings );
//                result.push( Pair.buildFrom1( [
//                    FunctionParameterListBuilder.O, optionalParamName,
//                    compiledOptionalExpression ] ) );
//            } else {
//                result.push(
//                    FunctionParameterListBuilder.buildParams_(
//                        vm, first, lexicalBindings ).cdr() );
//            }
//        }
//    }
//    
//    if ( result.length === 0 )
//        return FunctionParameterListBuilder.returnParams_(
//            complexParams, parameters );
//    else
//        return FunctionParameterListBuilder.returnParams_(
//            complexParams, Pair.buildFrom2( result, parameters ) );
//};

FunctionParameterListBuilder.isComplex = function ( parameters ) {
    while ( !parameters.isNotPair() ) {
        if ( parameters.car() instanceof Pair )
            return ArcObject.T;
        parameters = parameters.cdr();
    }
    return ArcObject.NIL;
};

FunctionParameterListBuilder.returnParams_ = function (
    complexParams, params ) {
    
    return new Pair( complexParams, params );
};

FunctionParameterListBuilder.index = function (
    parameterList, map, i, optionable ) {
    
    if ( parameterList instanceof Nil )
        return;
    
    if ( parameterList instanceof Pair ) {
        if ( optionable && ComplexArgs.optional( parameterList ) ) {
            FunctionParameterListBuilder.index(
                parameterList.cdr().car(), map, i, true );
        } else {
            var first = parameterList.car();
            if ( first instanceof Nil ) {
                map[ FunctionParameterListBuilder.NIL_ARG.name() ] =
                    i[ 0 ];
                i[ 0 ]++;
            } else {
                FunctionParameterListBuilder.index(
                    first, map, i, true );
            }
            FunctionParameterListBuilder.index(
                parameterList.cdr(), map, i, false );
        }
    } else {
        // PORT TODO: The Java version just assumes it'll be a symbol,
        // and it doesn't call name(), so in fact this check may be a
        // change in functionality. See if it is and what to do about
        // it.
        if ( !(parameterList instanceof Symbol) )
            throw new TypeError();
        map[ parameterList.name() ] = i[ 0 ];
        i[ 0 ]++;
    }
};

// PORT TODO: Rename all uses of .curry().
FunctionParameterListBuilder.curryStack = function (
    params, param, arg, paramIndex ) {
    
    var last = ArcObject.NIL;
    var list = [];
    while ( !params.isNotPair() ) {
        var curriedParam =
            FunctionParameterListBuilder.curryStackParam_(
                param, arg, paramIndex, params.car() );
        if ( curriedParam !== null )
            list.push( curriedParam );
        params = params.cdr();
    }
    if ( params instanceof Symbol ) {
        var rest = FunctionParameterListBuilder.curryStackParam_(
            param, arg, paramIndex, params );
        if ( rest !== null )
            last = rest;
    }
    try {
        return Pair.buildFrom2( list, last );
    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
        throw new ArcError(
            "couldn't curry params " + params + ", got list " +
            list + " and last " + last );
    }
};

FunctionParameterListBuilder.curryBound = function (
    params, param, arg, paramIndex ) {
    
    var last = ArcObject.NIL;
    var list = [];
    while ( !params.isNotPair() ) {
        var curriedParam =
            FunctionParameterListBuilder.curryBoundParam_(
                param, arg, paramIndex, params.car() );
        if ( curriedParam !== null )
            list.push( curriedParam );
        params = params.cdr();
    }
    if ( params instanceof Symbol ) {
        var rest = FunctionParameterListBuilder.curryBoundParam_(
            param, arg, paramIndex, params );
        if ( rest !== null )
            last = rest;
    }
    try {
        return Pair.buildFrom2( list, last );
    } catch ( e ) { if ( !(e instanceof Error) ) throw e;
        throw new ArcError(
            "couldn't curry params " + params + ", got list " +
            list + " and last " + last );
    }
};

FunctionParameterListBuilder.curryStackParam_ = function (
    param, arg, paramIndex, c ) {
    
    var curriedParam = null;
    if ( c instanceof Symbol && !c.isSame( param.name ) )
        curriedParam = c;
    else if ( ComplexArgs.optional( c )
        && !c.cdr().car().isSame( param.name ) )
        curriedParam = Pair.buildFrom1( [
            FunctionParameterListBuilder.O,
            c.cdr().car(),
            c.cdr().cdr().car().inline3( param, arg, paramIndex )
        ] );
    else if ( !ComplexArgs.optional( c ) && c instanceof Pair )
        curriedParam = c;
    return curriedParam;
};

FunctionParameterListBuilder.curryBoundParam_ = function (
    param, arg, paramIndex, c ) {
    
    var curriedParam = null;
    if ( c instanceof Symbol && !c.isSame( param.name ) )
        curriedParam = c;
    else if ( ComplexArgs.optional( c )
        && !c.cdr().car().isSame( param.name ) )
        curriedParam = Pair.buildFrom1( [
            FunctionParameterListBuilder.O,
            c.cdr().car(),
            c.cdr().cdr().car().inline5(
                param, arg, false, 0, paramIndex )
        ] );
    else if ( !ComplexArgs.optional( c ) && c instanceof Pair )
        curriedParam = c;
    return curriedParam;
};


// ===================================================================
// from vm/compiler/IfBuilder.java
// ===================================================================
// Needed late: IfClause Else IfThen Pair ArcObject Nil ArcError
// Compiler

var IfBuilder = {};

// ASYNC PORT NOTE: The synchronous Java version is below.
IfBuilder.build = function ( vm, body, lexicalBindings ) {
    var original = body;
    var clause = new IfClause();
    while ( 0 < body.len() )
        switch ( body.len() ) {
        case 0: break;
        case 1: clause.append( new Else() ); body = body.cdr(); break;
        case 2:
            clause.append( new IfThen() );
            body = body.cdr();
            // PORT NOTE: This was a cast in Java.
            if ( !(body instanceof Pair) )
                throw new TypeError();
            body.setCdr( new Pair( ArcObject.NIL, ArcObject.NIL ) );
            body = body.cdr();
            break;
        default:
            clause.append( new IfThen() );
            body = body.cdr().cdr();
            break;
        }
    
    body = original;
    vm.pushFrame( new IfBuilder.Reduce( clause ) );
    vm.pushFrame(
        new IfBuilder.BuildIf1( clause, body, lexicalBindings ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
IfBuilder.Reduce = function ( clause ) {
    Instruction.call( this );
    this.clause_ = clause;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "IfBuilder.build" ) );
};

IfBuilder.Reduce.prototype = new Instruction();
IfBuilder.Reduce.prototype.className = "IfBuilder.Reduce";

IfBuilder.Reduce.prototype.operate = function ( vm ) {
    vm.pushA( this.clause_.reduce() );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
IfBuilder.BuildIf1 = function ( clause, body, lexicalBindings ) {
    Instruction.call( this );
    this.clause_ = clause;
    this.body_ = body;
    this.lexicalBindings_ = lexicalBindings;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "IfBuilder.build" ) );
};

IfBuilder.BuildIf1.prototype = new Instruction();
IfBuilder.BuildIf1.prototype.className = "IfBuilder.BuildIf1";

IfBuilder.BuildIf1.prototype.operate = function ( vm ) {
    if ( this.body_ instanceof Nil )
        return;
    
    try {
        this.body_.mustBePairOrNil();
    } catch ( e ) { if ( !(e instanceof Pair.NotPair) ) throw e;
        throw new ArcError( "if: unexpected: " + this.body_ );
    }
    
    vm.pushFrame( new IfBuilder.BuildIf2(
        this.clause_, this.body_.cdr(), this.lexicalBindings_ ) );
    Compiler.compile( vm, this.body_.car(), this.lexicalBindings_ );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
IfBuilder.BuildIf2 = function ( clause, body, lexicalBindings ) {
    Instruction.call( this );
    this.clause_ = clause;
    this.body_ = body;
    this.lexicalBindings_ = lexicalBindings;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "AssignmentBuilder.build" ) );
};

IfBuilder.BuildIf2.prototype = new Instruction();
IfBuilder.BuildIf2.prototype.className = "IfBuilder.BuildIf2";

IfBuilder.BuildIf2.prototype.operate = function ( vm ) {
    this.clause_.take( vm.popA().reduce() );
    vm.pushFrame( new IfBuilder.BuildIf1(
        this.clause_, this.body_, this.lexicalBindings_ ) );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//IfBuilder.build = function ( vm, body, lexicalBindings ) {
//    var original = body;
//    var clause = new IfClause();
//    while ( 0 < body.len() )
//        switch ( body.len() ) {
//        case 0: break;
//        case 1: clause.append( new Else() ); body = body.cdr(); break;
//        case 2:
//            clause.append( new IfThen() );
//            body = body.cdr();
//            // PORT NOTE: This was a cast in Java.
//            if ( !(body instanceof Pair) )
//                throw new TypeError();
//            body.setCdr( new Pair( ArcObject.NIL, ArcObject.NIL ) );
//            body = body.cdr();
//            break;
//        default:
//            clause.append( new IfThen() );
//            body = body.cdr();
//            break;
//        }
//    
//    body = original;
//    while ( !(body instanceof Nil) ) {
//        try {
//            body.mustBePairOrNil();
//        } catch ( notPair ) {
//            if ( !(notPair instanceof Pair.NotPair) ) throw notPair;
//            throw new ArcError( "if: unexpected: " + body );
//        }
//        clause.take( Compiler.compile(
//            vm, body.car(), lexicalBindings ).reduce() );
//        body = body.cdr();
//    }
//    
//    return clause.reduce();
//};


// ===================================================================
// from vm/compiler/InvocationBuilder.java
// ===================================================================
// Needed late: Nil Pair ArcError Compiler Invocation

var InvocationBuilder = {};

// ASYNC PORT NOTE: The synchronous Java version is below.
InvocationBuilder.build = function ( vm, body, lexicalBindings ) {
    var original = body;
    var list = [];
    vm.pushFrame( new InvocationBuilder.BuildInvocation(
        body, lexicalBindings, original, list ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
InvocationBuilder.BuildInvocation = function (
    body, lexicalBindings, original, list ) {
    
    Instruction.call( this );
    this.body_ = body;
    this.lexicalBindings_ = lexicalBindings;
    this.original_ = original;
    this.list_ = list;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "InvocationBuilder.build" ) );
};

InvocationBuilder.BuildInvocation.prototype = new Instruction();
InvocationBuilder.BuildInvocation.prototype.className =
    "InvocationBuilder.BuildInvocation";

InvocationBuilder.BuildInvocation.prototype.operate = function (
    vm ) {
    
    if ( this.body_ instanceof Nil ) {
        vm.pushA( new Invocation(
            Pair.buildFrom1( this.list_ ) ).reduce() );
        return;
    }
    
    try {
        this.body_.mustBePairOrNil();
    } catch ( notPair ) {
        if ( !(notPair instanceof Pair.NotPair) ) throw notPair;
        throw new ArcError(
            "can't compile " + this.original_ + "; not a proper " +
            "list" );
    }
    vm.pushFrame( new InvocationBuilder.BuildInvocation(
        this.body_.cdr(), this.lexicalBindings_, this.original_,
        this.list_ ) );
    vm.pushFrame( new InvocationBuilder.ReducePush( this.list_ ) );
    Compiler.compile( vm, this.body_.car(), this.lexicalBindings_ );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
InvocationBuilder.ReducePush = function ( list ) {
    Instruction.call( this );
    this.list_ = list;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "InvocationBuilder.build" ) );
};

InvocationBuilder.ReducePush.prototype = new Instruction();
InvocationBuilder.ReducePush.prototype.className =
    "InvocationBuilder.ReducePush";

InvocationBuilder.ReducePush.prototype.operate = function ( vm ) {
    this.list_.push( vm.popA().reduce() );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//InvocationBuilder.build = function ( vm, body, lexicalBindings ) {
//    var original = body;
//    var list = [];
//    while ( !(body instanceof Nil) ) {
//        try {
//            body.mustBePairOrNil();
//        } catch ( notPair ) {
//            if ( !(notPair instanceof Pair.NotPair) ) throw notPair;
//            throw new ArcError(
//                "can't compile " + original + "; not a proper list" );
//        }
//        list.push( Compiler.compile(
//            vm, body.car(), lexicalBindings ).reduce() );
//        body = body.cdr();
//    }
//    return new Invocation( Pair.buildFrom1( list ) ).reduce();
//};


// ===================================================================
// from vm/compiler/PairExpander.java
// ===================================================================
// Needed late: Nil Pair Compiler

var PairExpander = {};

// ASYNC PORT NOTE: The synchronous Java version is below.
PairExpander.expand = function ( vm, body, lexicalBindings ) {
    var result = [];
    vm.pushFrame( new PairExpander.ExpandPair(
        body, lexicalBindings, result ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
PairExpander.ExpandPair = function ( body, lexicalBindings, result ) {
    Instruction.call( this );
    this.body_ = body;
    this.lexicalBindings_ = lexicalBindings;
    this.result_ = result;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "PairExpander.expand" ) );
};

PairExpander.ExpandPair.prototype = new Instruction();
PairExpander.ExpandPair.prototype.className =
    "PairExpander.ExpandPair";

PairExpander.ExpandPair.prototype.operate = function ( vm ) {
    if ( this.body_ instanceof Nil
        || !(this.body_ instanceof Pair) ) {
        vm.pushFrame( new PairExpander.FinishPair( this.result_ ) );
        Compiler.compile( vm, this.body_, this.lexicalBindings_ );
        return;
    }
    
    vm.pushFrame( new PairExpander.ExpandPair(
        this.body_.cdr(), this.lexicalBindings_, this.result_ ) );
    
    var next = this.body_.car();
    vm.pushFrame( new PairExpander.ReducePush( this.result_ ) );
    Compiler.compile( vm, next, this.lexicalBindings_ );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
PairExpander.ReducePush = function ( list ) {
    Instruction.call( this );
    this.list_ = list;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "PairExpander.expand" ) );
};

PairExpander.ReducePush.prototype = new Instruction();
PairExpander.ReducePush.prototype.className =
    "PairExpander.ReducePush";

PairExpander.ReducePush.prototype.operate = function ( vm ) {
    this.list_.push( vm.popA().reduce() );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
PairExpander.FinishPair = function ( result ) {
    Instruction.call( this );
    this.result_ = result;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "PairExpander.expand" ) );
};

PairExpander.FinishPair.prototype = new Instruction();
PairExpander.FinishPair.prototype.className =
    "PairExpander.FinishPair";

PairExpander.FinishPair.prototype.operate = function ( vm ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var newResult =
        Pair.buildFrom2( this.result_, vm.popA().reduce() );
    // PORT NOTE: This was a cast in Java.
    if ( !(newResult instanceof Pair) )
        throw new TypeError();
    vm.pushA( newResult );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//PairExpander.expand = function ( vm, body, lexicalBindings ) {
//    var result = [];
//    
//    while ( !(body instanceof Nil) && body instanceof Pair ) {
//        var next = body.car();
//        body = body.cdr();
//        result.push(
//            Compiler.compile( vm, next, lexicalBindings ).reduce() );
//    }
//    
//    // PORT NOTE: This local variable didn't exist in Java.
//    var result = Pair.buildFrom2( result,
//        Compiler.compile( vm, body, lexicalBindings ).reduce() );
//    // PORT NOTE: This was a cast in Java.
//    if ( !(result instanceof Pair) )
//        throw new TypeError();
//    return result;
//};


// ===================================================================
// from vm/compiler/QuasiQuoteCompiler.java
// ===================================================================
// Needed early: Symbol
// Needed late: QuasiQuotation Pair Compiler

var QuasiQuoteCompiler = {};

QuasiQuoteCompiler.QUASIQUOTE = Symbol.mkSym( "quasiquote" );
QuasiQuoteCompiler.UNQUOTE = Symbol.mkSym( "unquote" );
QuasiQuoteCompiler.UNQUOTE_SPLICING =
    Symbol.mkSym( "unquote-splicing" );

// ASYNC PORT NOTE: The synchronous Java version is below.
QuasiQuoteCompiler.compile = function (
    vm, expression, lexicalBindings, nesting ) {
    
    if ( expression.isNotPair() ) {
        vm.pushA( expression );
    } else if ( QuasiQuotation.isUnQuote( expression ) ) {
        QuasiQuoteCompiler.compileUnquote_( vm,
            QuasiQuoteCompiler.UNQUOTE, expression, nesting,
            lexicalBindings );
    } else if ( QuasiQuotation.isUnQuoteSplicing( expression ) ) {
        QuasiQuoteCompiler.compileUnquote_( vm,
            QuasiQuoteCompiler.UNQUOTE_SPLICING, expression, nesting,
            lexicalBindings );
    } else if ( QuasiQuotation.isQuasiQuote( expression ) ) {
        vm.pushFrame( new QuasiQuoteCompiler.Prefix(
            QuasiQuoteCompiler.QUASIQUOTE ) );
        QuasiQuoteCompiler.compile( vm, expression.cdr().car(),
            lexicalBindings, nesting + 1 );
    } else {
        var result = [];
        
        vm.pushFrame( new QuasiQuoteCompiler.CompileQuasiQuote(
            result, expression, lexicalBindings, nesting ) );
    }
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
QuasiQuoteCompiler.CompileQuasiQuote = function (
    result, expression, lexicalBindings, nesting ) {
    
    Instruction.call( this );
    this.result_ = result;
    this.expression_ = expression;
    this.lexicalBindings_ = lexicalBindings;
    this.nesting_ = nesting;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "QuasiQuoteCompiler.compile" ) );
};

QuasiQuoteCompiler.CompileQuasiQuote.prototype = new Instruction();
QuasiQuoteCompiler.CompileQuasiQuote.prototype.className =
    "QuasiQuoteCompiler.CompileQuasiQuote";

QuasiQuoteCompiler.CompileQuasiQuote.prototype.operate = function (
    vm ) {
    
    if ( this.expression_.isNotPair() ) {
        vm.pushFrame(
            new QuasiQuoteCompiler.FinishQuasiQuote( this.result_ ) );
        QuasiQuoteCompiler.compile( vm, this.expression_,
            this.lexicalBindings_, this.nesting_ );
        return;
    }
    
    var next = this.expression_.car();
    vm.pushFrame( new QuasiQuoteCompiler.CompileQuasiQuote(
        this.result_, this.expression_.cdr(), this.lexicalBindings_,
        this.nesting_ ) );
    if ( next.isNotPair() ) {
        this.result_.push( next );
    } else {
        vm.pushFrame( new QuasiQuoteCompiler.Push( this.result_ ) );
        QuasiQuoteCompiler.compile(
            vm, next, this.lexicalBindings_, this.nesting_ );
    }
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
QuasiQuoteCompiler.FinishQuasiQuote = function ( result ) {
    Instruction.call( this );
    this.result_ = result;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "QuasiQuoteCompiler.compile" ) );
};

QuasiQuoteCompiler.FinishQuasiQuote.prototype = new Instruction();
QuasiQuoteCompiler.FinishQuasiQuote.prototype.className =
    "QuasiQuoteCompiler.FinishQuasiQuote";

QuasiQuoteCompiler.FinishQuasiQuote.prototype.operate = function (
    vm ) {
    
    vm.pushA( Pair.buildFrom2( this.result_, vm.popA() ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
QuasiQuoteCompiler.Push = function ( result ) {
    Instruction.call( this );
    this.result_ = result;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "QuasiQuoteCompiler.compile" ) );
};

QuasiQuoteCompiler.Push.prototype = new Instruction();
QuasiQuoteCompiler.Push.prototype.className =
    "QuasiQuoteCompiler.Push";

QuasiQuoteCompiler.Push.prototype.operate = function ( vm ) {
    this.result_.push( vm.popA() );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//QuasiQuoteCompiler.compile = function (
//    vm, expression, lexicalBindings, nesting ) {
//    
//    if ( expression.isNotPair() )
//        return expression;
//    
//    if ( QuasiQuotation.isUnQuote( expression ) ) {
//        return QuasiQuoteCompiler.compileUnquote_( vm,
//            QuasiQuoteCompiler.UNQUOTE, expression, nesting,
//            lexicalBindings );
//    } else if ( QuasiQuotation.isUnQuoteSplicing( expression ) ) {
//        return QuasiQuoteCompiler.compileUnquote_( vm,
//            QuasiQuoteCompiler.UNQUOTE_SPLICING, expression, nesting,
//            lexicalBindings );
//    } else if ( QuasiQuotation.isQuasiQuote( expression ) ) {
//        return Pair.buildFrom1( [ QuasiQuoteCompiler.QUASIQUOTE,
//            QuasiQuoteCompiler.compile( vm, expression.cdr().car(),
//                lexicalBindings, nesting + 1 ) ] );
//    } else {
//        var result = [];
//        
//        while ( !expression.isNotPair() ) {
//            var next = expression.car();
//            expression = expression.cdr();
//            if ( next.isNotPair() )
//                result.push( next );
//            else
//                result.push( QuasiQuoteCompiler.compile( vm, next,
//                    lexicalBindings, nesting ) );
//        }
//        
//        return Pair.buildFrom2( result, QuasiQuoteCompiler.compile(
//            vm, expression, lexicalBindings, nesting ) );
//    }
//};

// ASYNC PORT NOTE: The synchronous Java version is below.
QuasiQuoteCompiler.compileUnquote_ = function (
    vm, prefix, expression, nesting, lexicalBindings ) {
    
    var compileMe = expression.cdr().car();
    vm.pushFrame( new QuasiQuoteCompiler.Prefix( prefix ) );
    if ( nesting === 1 )
        Compiler.compile( vm, compileMe, lexicalBindings );
    else
        QuasiQuoteCompiler.compile(
            vm, compileMe, lexicalBindings, nesting - 1 );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
QuasiQuoteCompiler.Prefix = function ( prefix ) {
    Instruction.call( this );
    this.prefix_ = prefix;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo( ArcString.make( "QuasiQuoteCompiler.compile" ) );
};

QuasiQuoteCompiler.Prefix.prototype = new Instruction();
QuasiQuoteCompiler.Prefix.prototype.className =
    "QuasiQuoteCompiler.Prefix";

QuasiQuoteCompiler.Prefix.prototype.operate = function ( vm ) {
    vm.pushA( Pair.buildFrom1( [ this.prefix_, vm.popA() ] ) );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//QuasiQuoteCompiler.compileUnquote_ = function (
//    vm, prefix, expression, nesting, lexicalBindings ) {
//    
//    var compileMe = expression.cdr().car();
//    var compiled;
//    if ( nesting === 1 )
//        compiled = Compiler.compile( vm, compileMe, lexicalBindings );
//    else
//        compiled = QuasiQuoteCompiler.compile(
//            vm, compileMe, lexicalBindings, nesting - 1 );
//    return Pair.buildFrom1( [ prefix, compiled ] );
//};


// ===================================================================
// from util/Argv.java
// ===================================================================

/** @constructor */
function Argv( args ) {
    this.args_ = args.slice();
    this.parsed_ = {};
}

Argv.prototype.terminal = function ( option ) {
    var result = [];
    var index = args.indexOf( option );
    if ( -1 < index ) {
        result = result.concat( args.slice( index + 1 ) );
        args = args.slice( 0, index );
    }
    this.parsed[ option ] = result;
    return result;
};

Argv.prototype.multi = function ( option ) {
    var add = false;
    var result = [];
    for ( var i = 0, len = this.args.length; i < len; i++ ) {
        var arg = this.args[ i ];
        if ( arg === option )
            add = true;
        else if ( /^-/.test( arg ) )
            add = false;
        else if ( add )
            result.push( arg );
    }
    this.parsed[ option ] = result;
    return result;
};

Argv.prototype.present = function ( option ) {
    for ( var i = 0; i < this.args.length; i++ ) {
        var arg = this.args[ i ];
        if ( arg === option )
            return true;
    }
    return false;
};


// ===================================================================
// from util/Decompiler.java
// ===================================================================
// Needed early: Symbol
// Needed late: InterpretedFunction Nil IfClause LastAssignment Pair

var Decompiler = {};

Decompiler.LET = Symbol.mkSym( "let" );
Decompiler.SELF = Symbol.mkSym( "self" );
Decompiler.IT = Symbol.mkSym( "it" );
Decompiler.AFN = Symbol.mkSym( "afn" );
Decompiler.DO = Symbol.mkSym( "do" );
Decompiler.WITH = Symbol.mkSym( "with" );
Decompiler.AIF = Symbol.mkSym( "aif" );

Decompiler.decompile = function ( o ) {
    if ( o.parts.car() instanceof InterpretedFunction )
        return Decompiler.decompile_(
            Decompiler.withLetDo_( o.parts ) );
    else
        return o.parts;
};

Decompiler.decompile_ = function ( pair ) {
    if ( pair.car() === Decompiler.LET )
        return Decompiler.decompileLet_( pair.cdr() );
    else
        return pair;
};

Decompiler.decompileLet_ = function ( args ) {
    if ( args.car() === Decompiler.IT ) {
        var arg = args.cdr().car();
        var rest = args.cdr().cdr();
        if ( rest.cdr() instanceof Nil
            && rest.car() instanceof IfClause ) {
            var aif = rest.car();
            if ( aif.isAifIf() )
                return Decompiler.makeAif_( aif, arg );
        }
    } else if ( args.car() === Decompiler.SELF
        && args.cdr().car() instanceof Nil ) {
        var rest = args.cdr().cdr();
        if ( rest.car() instanceof Assignment
            && rest.cdr() instanceof Nil ) {
            var a = rest.car();
            if ( a.assignment.assignsTo( "self" )
                && a.assignment.expression instanceof
                    InterpretedFunction
                && a.assignment instanceof LastAssignment )
                return Decompiler.makeAfn( a.assignment.expression );
        }
    }
    return new Pair( Decompiler.LET, args );
};

Decompiler.makeAfn_ = function ( ifn ) {
    return Pair.buildFrom1(
        [ Decompiler.AFN, ifn.parameterList() ].concat( ifn.body ) );
};

Decompiler.withLetDo_ = function ( parts ) {
    var ifn = parts.car();
    var args = parts.cdr();
    var params = ifn.parameterList();
    if ( args.len() === params.len() ) {
        if ( args.len() === 0 )
            return Decompiler.makeDo_( ifn );
        else if ( args.len() === 1 )
            return Decompiler.makeLet_( ifn, args, params );
        else
            return Decompiler.makeWith_( ifn, args, params );
    } else {
        return parts;
    }
};

Decompiler.makeDo_ = function ( ifn ) {
    return Pair.buildFrom1( [ Decompiler.DO ].concat( ifn.body ) );
};

Decompiler.makeWith_ = function ( ifn, args, params ) {
    var w = [];
    while ( !(params instanceof Nil ) ) {
        w.push( params.car() );
        w.push( args.car() );
        params = params.cdr();
        args = args.cdr();
    }
    return Pair.buildFrom1(
        [ Decompiler.WITH, Pair.buildFrom1( w ) ].concat( ifn.body )
    );
};

Decompiler.makeLet_ = function ( ifn, args, params ) {
    return Pair.buildFrom1( [ Decompiler.LET, params.car(), args.car()
        ].concat( ifn.body ) );
};

Decompiler.makeAif_ = function ( ifClause, arg ) {
    return Pair.buildFrom1( [ Decompiler.AIF, arg,
        ifClause.thenExpression(), ifClause.elseExpression() ] );
};


// ===================================================================
// from functions/Builtin.java
// ===================================================================
// Needed early: ArcObject Symbol
// Needed late: Symbol ArcError

// PORT TODO: The name-mangling tricks this does won't work yet.
// Figure out something that will.

// PORT TODO: Change all original uses of the constructor to uses of
// InterpretedFunction.of().
/** @constructor */
function Builtin() {
    ArcObject.call( this );
}

Builtin.prototype = new ArcObject();
Builtin.prototype.className = "Builtin";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Builtin.of = function (
    parameterList, lexicalBindings, body ) {
    
    return new Builtin().init(
        parameterList, lexicalBindings, body );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Builtin.prototype.init = function ( name ) {
    // PORT NOTE: The name field was protected in Java, but there's
    // also a name method.
    this.name_ = name;
    Symbol.mkSym( name ).setValue( this );
    return this;
};

// PORT TODO: Rename all uses of .invoke( Pair ).
Builtin.prototype.invokePair = function ( args ) {
    throw new ArcError(
        "Builtin:invoke(args):provide implementation! " +
        this.name() + " args " + args );
};

Builtin.prototype.invoke = function ( vm, args ) {
    vm.pushA( this.invokePair( args ) );
};

Builtin.prototype.compareTo = function ( right ) {
    return 0;
};

Builtin.prototype.type = function () {
    return Builtin.TYPE;
};

Builtin.checkMaxArgCount = function ( args, functionClass, maxArgs ) {
    if ( maxArgs < args.len() ) {
        System_out_println(
            functionClass + " got args " + args + " was expecting " +
            "expecting at most " + maxArgs );
        throw new ArcError(
            functionClass.toLowerCase() + " expects at most " +
            maxArgs + " arguments: given " + args );
    }
};

Builtin.checkMinArgCount = function ( args, functionClass, min ) {
    if ( args.size() < min ) {
        throw new ArcError(
            functionClass.toLowerCase() + " expects at least " +
            min + " arguments: given " + args );
    }
};

Builtin.checkExactArgsCount = function (
    args, argCount, functionClass ) {
    
    if ( args.len() !== argCount ) {
        throw new ArcError(
            functionClass.toLowerCase() + " expects " +
            argCount + " arguments: given " + args );
    }
};

Builtin.prototype.toString = function () {
    return "[builtin:" +
        (this.name_ === null || this.name_.length === 0 ?
            this.className : this.name_) + "]";
};

Builtin.prototype.profileName = function () {
    return this.toString();
};

Builtin.prototype.name = function () {
    return this.name_ === "" ?
        this.className.toLowerCase() : this.name_;
};

Builtin.TYPE = Symbol.mkSym( "fn" );


// ===================================================================
// from functions/Closure.java
// ===================================================================
// Needed early: ArcObject
// Needed late: Builtin

/** @constructor */
function Closure( expression, lc ) {
    ArcObject.call( this );
    this.expression_ = expression;
    this.lc_ = lc;
}

Closure.prototype = new ArcObject();
Closure.prototype.className = "Closure";

Closure.prototype.invokef0 = function ( vm ) {
    this.expression_.invokeN0( vm, this.lc_ );
};

Closure.prototype.invokef1 = function ( vm, arg ) {
    this.expression_.invokeN1( vm, this.lc_, arg );
};

Closure.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    this.expression_.invokeN2( vm, this.lc_, arg1, arg2 );
};

Closure.prototype.invoke = function ( vm, args ) {
    this.expression_.invoke3( vm, this.lc_, args );
};

Closure.prototype.type = function () {
    return Builtin.TYPE;
};

Closure.prototype.toString = function () {
    return this.expression_.toString();
};

Closure.prototype.profileName = function () {
    return this.expression_.profileName();
};

Closure.prototype.fn = function () {
    return this.expression_;
};


// ===================================================================
// from functions/Evaluation.java
// ===================================================================
// Needed early: ArcError
// Needed late: Symbol rainbow.functions.eval.SSyntax
// rainbow.functions.eval.SSExpand

var Evaluation = {};

Evaluation.isSpecialSyntax = function ( expression ) {
    return expression instanceof Symbol &&
        SSyntax.isSpecial( expression );
};

Evaluation.ssExpand = function ( expression ) {
    return SSExpand.expand( Symbol.cast( expression, "ssexpand" ) );
};

// PORT TODO: See if this is unused. But don't remove it! (The
// spelling is correct, too.)
/** @constructor */
Evaluation.UnknownSytax = function ( symbol ) {
    ArcError.call( this, "Unknown syntax " + symbol );
};

Evaluation.UnknownSytax.prototype = new ArcError( void 0 );
Evaluation.UnknownSytax.prototype.className =
    "Evaluation.UnknownSytax";

Evaluation.isListListQuoted = function ( symbol ) {
    return /[.!]/.test( symbol );
};

Evaluation.isComposeComplement = function ( symbol ) {
    return Evaluation.isCompose_( symbol ) ||
        Evaluation.isComplement_( symbol );
};

// PORT TODO: Make sure SSExpand.ANDF_INTRASYM_CHAR is a char code.
Evaluation.isAndf = function ( symbol ) {
    if ( symbol.length === 0 )
        return false;
    else if ( symbol.charCodeAt( 0 ) === SSExpand.ANDF_INTRASYM_CHAR )
        return Evaluation.isAndf( symbol.substring( 1 ) );
    else if ( symbol.charAt( symbol.length - 1 ) ===
        SSExpand.ANDF_INTRASYM_CHAR )
        return Evaluation.isAndf(
            symbol.substring( 0, symbol.length - 1 ) );
    else
        return symbol.indexOf( SSExpand.ANDF_INTRASYM ) !== -1;
};

Evaluation.isComplement_ = function ( symbol ) {
    return /^~/.test( symbol );
};

Evaluation.isCompose_ = function ( symbol ) {
    return /:/.test( symbol );
};


// ===================================================================
// from functions/interpreted/InterpretedFunction.java
// ===================================================================
// Needed early: ArcObject Visitor
// Needed late: FunctionOwnershipVisitor Nil ArcString Pair
// FunctionBodyBuilder Literal PopArg BoundSymbol Quotation Symbol
// ReferenceCounter ArcError Close_Instruction MeasureLexicalReach
// LiteralObject Builtin FunctionParameterListBuilder IfClause

// PORT TODO: Change all original uses of the constructor to uses of
// InterpretedFunction.of().
/** @constructor */
function InterpretedFunction() {
    ArcObject.call( this );
}

InterpretedFunction.prototype = new ArcObject();
InterpretedFunction.prototype.Cons_ = InterpretedFunction;
InterpretedFunction.prototype.className = "InterpretedFunction";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
InterpretedFunction.of = function (
    parameterList, lexicalBindings, body ) {
    
    return new InterpretedFunction().init(
        parameterList, lexicalBindings, body );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
InterpretedFunction.prototype.init = function (
    parameterList, lexicalBindings, body ) {
    
    this.name = ArcObject.NIL;
    // PORT NOTE: The parameterList field was protected in Java, but
    // there's also a parameterList method.
    this.parameterList_ = parameterList;
    this.lexicalBindings = lexicalBindings;
    this.body = body.toArray();
    // PORT NOTE: The instructions field was protected in Java, but
    // there's also an instructions method.
    this.instructions_ = null;
    this.lexicalOwner_ = null;
    this.curried = null;
    this.profileName_ = null;
    this.localProfileName_ = null;
    this.buildInstructionList_();
    return this;
};

InterpretedFunction.prototype.unassigned = function ( name ) {
    if ( this.name === name )
        this.name = ArcObject.NIL;
};

InterpretedFunction.prototype.assigned = function ( name ) {
    this.name = name;
    
    var v = new FunctionOwnershipVisitor( this );
    for ( var i = 0, len = this.body.length; i < len; i++ )
        this.body[ i ].visit( v );
};

InterpretedFunction.prototype.assignedName = function () {
    return this.name;
};

InterpretedFunction.prototype.profileName = function () {
    if ( this.profileName_ !== null )
        return this.profileName_;
    
    if ( this.name instanceof Nil ) {
        this.profileName_ = this.toString();
        if ( this.lexicalOwner_ !== null )
            this.profileName_ +=
                " in " + this.lexicalOwner_.profileName();
    } else {
        this.profileName_ = this.assignedName().toString();
    }
    
    return this.profileName_;
};

InterpretedFunction.prototype.localProfileName = function () {
    if ( this.localProfileName_ !== null )
        return this.localProfileName_;
    
    if ( this.name instanceof Nil )
        this.localProfileName_ = this.toString();
    else
        this.localProfileName_ = this.assignedName().toString();
    
    return this.localProfileName_;
};

InterpretedFunction.prototype.ownerHierarchy = function () {
    var me = ArcString.make( this.localProfileName() );
    if ( this.lexicalOwner_ !== null )
        return new Pair( me, this.lexicalOwner_.ownerHierarchy() );
    else
        return new Pair( me, ArcObject.NIL );
};

InterpretedFunction.prototype.lexicalDepth = function () {
    if ( this.lexicalOwner_ === null )
        return 1;
    else
        return 1 + this.lexicalOwner_.lexicalDepth();
};

InterpretedFunction.prototype.reduce = function () {
    if ( Console.stackfunctions && this.canIGoOnTheStack_()
        && !(this.parameterList_ instanceof Nil) ) {
        // TODO: .reduce() this to break out of the if clause in
        // curried optional-arg functions
        return FunctionBodyBuilder.convertToStackParams( this );
    } else {
        return this;
    }
};

InterpretedFunction.prototype.canIGoOnTheStack_ = function () {
    // if I need to make closures, I can't keep my params on the param
    // stack
    // TODO: this could be more subtle: create LC for params that need
    // it, put all other params on the stack. probably poor for
    // performance though
    return !this.hasClosures();
};

InterpretedFunction.prototype.buildInstructionList_ = function () {
    var i = [];
    this.buildInstructions( i );
    this.instructions_ = Pair.buildFrom1( i );
    this.claimInstructions_( this );
};

InterpretedFunction.prototype.belongsTo = function ( container ) {
    this.lexicalOwner_ = container;
};

InterpretedFunction.prototype.lexicalOwner = function () {
    return this.lexicalOwner_;
};

// NOTE: This was an anonymous class in Java.
/** @constructor */
InterpretedFunction.Visitor_claimInstructions_ = function ( owner ) {
    Visitor.call( this );
    this.owner_ = owner;
};

InterpretedFunction.Visitor_claimInstructions_.prototype =
    new Visitor();

InterpretedFunction.Visitor_claimInstructions_.prototype.
    acceptInstruction = function ( o ) {
    
    o.belongsTo( this.owner_ );
};

InterpretedFunction.prototype.claimInstructions_ = function (
    owner ) {
    
    this.instructions_.visit(
        new InterpretedFunction.Visitor_claimInstructions_( owner ) );
};

InterpretedFunction.prototype.buildInstructions = function ( i ) {
    if ( this.body.length === 0 )
        i.push( new Literal( ArcObject.NIL ) );
    else
        for ( var b = 0; b < this.body.length; b++ ) {
            var expr = this.body[ b ];
            var last = b === this.body.length - 1;
            expr.addInstructions( i );
            if ( !last )
                i.push( new PopArg( "intermediate-fn-expression" ) );
        }
};

InterpretedFunction.prototype.canInline = function ( param, arg ) {
    return (this.body.length === 1
        && this.inlineableArg_( param, arg )
        && !this.assigns( 0 )
        && !this.hasClosures());
};

InterpretedFunction.prototype.inlineableArg_ = function (
    param, arg ) {
    
    var paramIndex = this.lexicalBindings[ param.name() ];
    var p = BoundSymbol.make( param, 0, paramIndex );
    return (arg.literal()
        || arg instanceof Quotation
        || arg instanceof Symbol
        || arg instanceof BoundSymbol
        // TODO: this last condition allows inlining of invocations,
        // it's dubious and may cause out-of-order evaluation!
        || this.countReferences_( p ) <= 1);
};

InterpretedFunction.prototype.countReferences_ = function ( p ) {
    var v = new ReferenceCounter( p );
    for ( var i = 0, len = this.body.length; i < len; i++ )
        this.body[ i ].visit( v );
    return v.count();
};

InterpretedFunction.prototype.maybeNest_ = function ( p ) {
    if ( !(this.parameterList_ instanceof Nil) )
        return p.nest( 0 );
    else
        return p;
};

InterpretedFunction.prototype.hasClosures = function () {
    for ( var i = 0, len = this.body.length; i < len; i++ ) {
        var o = this.body[ i ];
        if ( o instanceof InterpretedFunction ) {
            if ( o.requiresClosure() )
                return true;
        } else if ( o.hasClosures() ) {
            return true;
        }
    }
    return false;
};

InterpretedFunction.prototype.assigned_ = function ( nesting ) {
    for ( var i = 0, len = this.body.length; i < len; i++ )
        if ( this.body[ i ].assigns( nesting ) )
            return true;
    return false;
};

InterpretedFunction.prototype.nests = function () {
    return !(this.parameterList_ instanceof Nil);
};

InterpretedFunction.prototype.assigns = function ( nesting ) {
    if ( !(this.parameterList_ instanceof Nil) )
        return this.assigned_( nesting + 1 );
    else
        return this.assigned_( nesting );
};

InterpretedFunction.prototype.invokef0 = function ( vm ) {
    return this.invokeN0( vm, null );
};

// PORT TODO: Rename all uses of .invokeN.
InterpretedFunction.prototype.invokeN0 = function ( vm, lc ) {
    return this.invoke3( vm, lc, ArcObject.NIL );
};

InterpretedFunction.prototype.invokef1 = function ( vm, arg ) {
    return this.invokeN1( vm, null, arg );
};

InterpretedFunction.prototype.invokeN1 = function ( vm, lc, arg ) {
    return this.invoke3( vm, lc, new Pair( arg, ArcObject.NIL ) );
};

InterpretedFunction.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    return this.invokeN2( vm, null, arg1, arg2 );
};

InterpretedFunction.prototype.invokeN2 = function (
    vm, lc, arg1, arg2 ) {
    
    return this.invoke3( vm, lc,
        new Pair( arg1, new Pair( arg2, ArcObject.NIL ) ) );
};

InterpretedFunction.prototype.invokef3 = function (
    vm, arg1, arg2, arg3 ) {
    
    return this.invokeN3( vm, null, arg1, arg2, arg3 );
};

InterpretedFunction.prototype.invokeN3 = function (
    vm, lc, arg1, arg2, arg3 ) {
    
    return this.invoke3( vm, lc, new Pair( arg1,
        new Pair( arg2, new Pair( arg3, ArcObject.NIL ) ) ) );
};

InterpretedFunction.prototype.invoke = function ( vm, args ) {
    return this.invoke3( vm, null, args );
};

// TODO: Rename all uses of .invoke( VM, LexicalClosure, Pair ).
InterpretedFunction.prototype.invoke3 = function ( vm, lc, args ) {
    throw new ArcError(
        "error: invoke(vm, lc, args) not implemented in " +
        this.className + "; " + this );
};

InterpretedFunction.prototype.instructions = function () {
    return this.instructions_;
};

InterpretedFunction.prototype.addInstructions = function ( i ) {
    if ( this.requiresClosure() )
        i.push( new Close_Instruction( this ) );
    else
        i.push( new Literal( this ) );
};

InterpretedFunction.prototype.literal = function () {
    return !this.requiresClosure();
};

InterpretedFunction.prototype.requiresClosure = function () {
    var v = new MeasureLexicalReach();
    this.visit( v );
    return -1 < v.reach();
};

InterpretedFunction.prototype.visit = function ( v ) {
    v.acceptInterpretedFunction( this );
    FunctionBodyBuilder.visit( v, this.parameterList_, false );
    for ( var i = 0, len = this.body.length; i < len; i++ )
        this.body[ i ].visit( v );
    v.endInterpretedFunction( this );
    if ( this.curried !== null )
        this.curried.visit( v );
};

InterpretedFunction.prototype.isIdFn = function () {
    if ( this.parameterList_.len() === 1 )
        if ( this.parameterList_.car() instanceof Symbol )
            if ( this.body.length === 1 )
                if ( this.body[ 0 ] instanceof BoundSymbol ) {
                    var p1 = this.parameterList_.car();
                    var rv = this.body[ 0 ];
                    var equiv = BoundSymbol.make( p1, 0, 0 );
                    return rv.isSameBoundSymbol( equiv );
                }
    return false;
};

InterpretedFunction.prototype.compareTo = function ( right ) {
    throw new ArcError( "Can't compare " + this + " to " + right );
};

InterpretedFunction.prototype.toString = function () {
    if ( this.isBracketFn_() ) {
        if ( this.body[ 0 ] instanceof Nil ) {
            return "[]";
        } else {
            var s = this.body[ 0 ].toString();
            return "[" + s.substring( 1, s.length - 1 ) + "]";
        }
    }
    return Pair.buildFrom1( [ Symbol.mkSym( "fn" ),
        this.parameterList() ].concat( this.body ) ).toString();
};

InterpretedFunction.prototype.isBracketFn_ = function () {
    return (this.parameterList_ instanceof Pair
        && this.parameterList_.car() === Symbol.mkSym( "_" )
        && this.parameterList_.cdr() instanceof Nil
        && this.body.length === 1
        && !(this.body[ 0 ] instanceof LiteralObject));
};

InterpretedFunction.prototype.parameterList = function () {
    return this.parameterList_;
};

InterpretedFunction.prototype.type = function () {
    return Builtin.TYPE;
};

InterpretedFunction.prototype.nth = function ( index ) {
    return this.body[ index ];
};

InterpretedFunction.prototype.last = function () {
    return this.body[ this.body.length - 1 ];
};

InterpretedFunction.prototype.length = function () {
    return this.body.length;
};

InterpretedFunction.prototype.requireNil = function ( test, info ) {
    try {
        test.cdr().mustBeNil();
    } catch ( e ) { if ( !(e instanceof Pair.NotPair) ) throw e;
        this.throwArgMismatchError( info );
    }
};

InterpretedFunction.prototype.requireNotNil = function (
    destructured, arg ) {
    
    if ( destructured instanceof Nil )
        this.throwArgMismatchError( arg );
};

InterpretedFunction.prototype.throwArgMismatchError = function (
    args ) {
    
    throw new ArcError(
        "args " + args + " doesn't match signature for " + this );
};

InterpretedFunction.prototype.curry = function (
    param, arg, requiresNesting ) {
    
    var paramIndex = this.lexicalBindings[ param.name() ];
    // PORT NOTE: This was implicit unboxing in Java.
    // PORT TODO: See if it's possible for this to throw an error.
    if ( paramIndex === void 0 )
        throw new ReferenceError();
    var p = BoundSymbol.make( param, 0, paramIndex );
    var newParams = FunctionParameterListBuilder.curryBound(
        this.parameterList_, p, arg, paramIndex );
    var lexicalBindings = {};
    FunctionParameterListBuilder.index(
        newParams, lexicalBindings, [ 0 ], false );
    var unnest = newParams instanceof Nil;
    if ( !unnest && requiresNesting )
        arg = arg.nest( 0 );
    
    var newBody = [];
    for ( var i = 0; i < this.body.length; i++ )
        newBody.push( this.body[ i ].inline5(
            p, arg, unnest, 0, paramIndex ).reduce() );
    var nb = Pair.buildFrom1( newBody );
    var complexParams =
        FunctionParameterListBuilder.isComplex( newParams );
    return FunctionBodyBuilder.buildFunctionBody(
        newParams, lexicalBindings, nb, complexParams );
};

InterpretedFunction.prototype.inline5 = function (
    p, arg, unnest, nesting, paramIndex ) {
    
    p = this.maybeNest_( p );
    var fn = this.cloneThis_();
    
    var newBody = [];
    for ( var i = 0; i < this.body.length; i++ )
        newBody.push( this.body[ i ].inline5(
            p, arg, false, nesting + 1, paramIndex ).reduce() );
    var nb = Pair.buildFrom1( newBody );
    fn.body = nb.toArray();
    fn.buildInstructionList_();
    return fn;
};

InterpretedFunction.prototype.inline3 = function (
    p, arg, paramIndex ) {
    
    if ( !(this.parameterList_ instanceof Nil) )
        return this;
    var fn = this.cloneThis_();
    
    var newBody = [];
    for ( var i = 0; i < this.body.length; i++ )
        newBody.push( this.body[ i ].inline3(
            p, arg, paramIndex ).reduce() );
    var nb = Pair.buildFrom1( newBody );
    fn.body = nb.toArray();
    fn.buildInstructionList_();
    return fn;
};

InterpretedFunction.prototype.nest = function ( threshold ) {
    if ( !(this.parameterList_ instanceof Nil) )
        threshold++;
    var fn = this.cloneThis_();
    
    var newBody = [];
    for ( var i = 0; i < this.body.length; i++ )
        newBody.push( this.body[ i ].nest( threshold ) );
    var nb = Pair.buildFrom1( newBody );
    fn.body = nb.toArray();
    fn.buildInstructionList_();
    return fn;
};

// PORT NOTE: In Java, this used Object.clone().
InterpretedFunction.prototype.cloneThis_ = function () {
    var result = new this.Cons_();
    // PORT TODO: See if it would be more appropriate to do
    // class-specific cloneThis_ methods.
    for ( var k in this )
        if ( this.hasOwnProperty( k ) )
            result[ k ] = this[ k ];
//    result.name = this.name;
//    result.parameterList_ = this.parameterList_;
//    result.lexicalBindings = this.lexicalBindings;
//    result.body = this.body;
//    result.instructions_ = this.instructions_;
//    result.lexicalOwner_ = this.lexicalOwner_;
//    result.curried = this.curried;
//    result.profileName_ = this.profileName_;
//    result.localProfileName_ = this.localProfileName_;
    return result;
};

InterpretedFunction.prototype.checkArgsLength = function (
    expected, args ) {
    
    if ( !args.hasLen( expected ) )
        throw new ArcError(
            "error: " + this + " expects " + expected + " args, " +
            "got " + args );
};

InterpretedFunction.prototype.isAifBody = function () {
    return (this.body.length === 1
        && this.body[ 0 ] instanceof IfClause
        && this.body[ 0 ].isAifIf());
};


// ===================================================================
// from functions/interpreted/SimpleArgs.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: LexicalClosure Nil Symbol

/** @constructor */
function SimpleArgs( parameterList, lexicalBindings, body ) {
    InterpretedFunction.call( this );
    this.init( parameterList, lexicalBindings, body );
}

SimpleArgs.prototype = new InterpretedFunction();
SimpleArgs.prototype.Cons_ = SimpleArgs;
SimpleArgs.prototype.className = "SimpleArgs";

SimpleArgs.prototype.invoke3 = function ( vm, lc, args ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    SimpleArgs.simple_( lc, this.parameterList_, args );
    vm.pushInvocation2( lc, this.instructions_ );
};

SimpleArgs.simple_ = function ( lc, parameterList, args ) {
    while ( !(parameterList instanceof Nil) ) {
        if ( parameterList instanceof Symbol ) {
            lc.add( args );
            return;
        } else {
            lc.add( args.car() );
            args = args.cdr();
            parameterList = parameterList.cdr();
        }
    }
};


// ===================================================================
// from functions/interpreted/ComplexArgs.java
// ===================================================================
// Needed early: InterpretedFunction Symbol
// Needed late: LexicalClosure Nil Pair ArcError

/** @constructor */
function ComplexArgs( parameterList, lexicalBindings, body ) {
    InterpretedFunction.call( this );
    this.init( parameterList, lexicalBindings, body );
}

ComplexArgs.prototype = new InterpretedFunction();
ComplexArgs.prototype.Cons_ = ComplexArgs;
ComplexArgs.prototype.className = "ComplexArgs";

// ASYNC PORT NOTE: The synchronous Java version is below.
ComplexArgs.prototype.invoke3 = function ( vm, lc, args ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    vm.pushFrame(
        new ComplexArgs.Run( lc, this.instructions_, this ) );
    this.complex_( vm, lc, this.parameterList_, args );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
ComplexArgs.Run = function ( lc, instructions, owner ) {
    Instruction.call( this );
    this.lc_ = lc;
    this.instructions_ = instructions;
    this.belongsTo( owner );
};

ComplexArgs.Run.prototype = new Instruction();
ComplexArgs.Run.prototype.className = "ComplexArgs.Run";

ComplexArgs.Run.prototype.operate = function ( vm ) {
    vm.pushInvocation2( this.lc_, this.instructions_ );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//ComplexArgs.prototype.invoke3 = function ( vm, lc, args ) {
//    var len = 0;
//    for ( var k in this.lexicalBindings )
//        len++;
//    lc = new LexicalClosure( len, lc );
//    ComplexArgs.complex_( vm, lc, this.parameterList_, args );
//    vm.pushInvocation2( lc, this.instructions_ );
//};

// ASYNC PORT NOTE: The synchronous Java version is below.
ComplexArgs.prototype.complex_ = function (
    vm, lc, parameters, args ) {
    
    vm.pushFrame(
        new ComplexArgs.BuildComplex( lc, parameters, args, this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
ComplexArgs.BuildComplex = function ( lc, parameters, args, owner ) {
    Instruction.call( this );
    this.lc_ = lc;
    this.parameters_ = parameters;
    this.args_ = args;
    this.belongsTo( owner );
};

ComplexArgs.BuildComplex.prototype = new Instruction();
ComplexArgs.BuildComplex.prototype.className =
    "ComplexArgs.BuildComplex";

ComplexArgs.BuildComplex.prototype.operate = function ( vm ) {
    if ( this.parameters_.isNotPair() ) {
        if ( this.parameters_ instanceof Symbol )
            this.lc_.add( this.args_ );
        return;
    }
    
    var nextParameter = this.parameters_.car();
    var nextArg = this.args_.car();
    
    vm.pushFrame( new ComplexArgs.BuildComplex(
        this.lc_, this.parameters_.cdr(), this.args_.cdr(),
        this.owner() ) );
    
    if ( nextParameter instanceof Symbol ) {
        this.lc_.add( nextArg );
    } else if ( ComplexArgs.optional( nextParameter ) ) {
        var optional =
            ComplexArgs.optionalParam_( nextParameter );
        if ( !(this.args_ instanceof Nil) ) {
            this.lc_.add( nextArg );
        } else {
            vm.pushFrame(
                new ComplexArgs.AddToLc( this.lc_, this ) );
            ComplexArgs.evalOptional_( vm, this.lc_, optional );
        }
    } else {
        try {
            nextArg.mustBePairOrNil();
        } catch ( e ) {
            if ( !(e instanceof Pair.NotPair) ) throw e;
            throw new ArcError(
                "Expected list argument for destructuring " +
                "parameter " + nextParameter + ", got " +
                nextArg );
        }
        this.owner().complex_( vm, this.lc_, nextParameter, nextArg );
    }
    
    this.parameters_ = this.parameters_.cdr();
    this.args_ = this.args_.cdr();
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
ComplexArgs.AddToLc = function ( lc, owner ) {
    Instruction.call( this );
    this.lc_ = lc;
    this.belongsTo( owner );
};

ComplexArgs.AddToLc.prototype = new Instruction();
ComplexArgs.AddToLc.prototype.className = "ComplexArgs.AddToLc";

ComplexArgs.AddToLc.prototype.operate = function ( vm ) {
    this.lc_.add( vm.popA() );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//ComplexArgs.complex_ = function ( vm, lc, parameters, args ) {
//    while ( !parameters.isNotPair() ) {
//        var nextParameter = parameters.car();
//        var nextArg = args.car();
//        
//        if ( nextParameter instanceof Symbol ) {
//            lc.add( nextArg );
//        } else if ( ComplexArgs.optional( nextParameter ) ) {
//            var optional =
//                ComplexArgs.optionalParam_( nextParameter );
//            if ( !(args instanceof Nil) )
//                lc.add( nextArg );
//            else
//                lc.add(
//                    ComplexArgs.evalOptional_( vm, lc, optional ) );
//        } else {
//            try {
//                nextArg.mustBePairOrNil();
//            } catch ( e ) {
//                if ( !(e instanceof Pair.NotPair) ) throw e;
//                throw new ArcError(
//                    "Expected list argument for destructuring " +
//                    "parameter " + nextParameter + ", got " +
//                    nextArg );
//            }
//            ComplexArgs.complex_( vm, lc, nextParameter, nextArg );
//        }
//        
//        parameters = parameters.cdr();
//        args = args.cdr();
//    }
//    
//    if ( parameters instanceof Symbol )
//        lc.add( args );
//};

// ASYNC PORT NOTE: The synchronous Java version is below.
ComplexArgs.evalOptional_ = function ( vm, lc, optional ) {
    var i = [];
    optional.cdr().car().addInstructions( i );
    vm.pushInvocation2( lc, Pair.buildFrom1( i ) );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//ComplexArgs.evalOptional_ = function ( vm, lc, optional ) {
//    var i = [];
//    optional.cdr().car().addInstructions( i );
//    vm.pushInvocation2( lc, Pair.buildFrom1( i ) );
//    return vm.thread();
//};

ComplexArgs.optional = function ( nextParameter ) {
    if ( !(nextParameter instanceof Pair) )
        return false;
    
    return nextParameter.car() === ComplexArgs.o_;
};

ComplexArgs.optionalParam_ = function ( nextParameter ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var result = nextParameter.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(result instanceof Pair) )
        throw new TypeError();
    return result;
};

ComplexArgs.o_ = Symbol.mkSym( "o" );


// ===================================================================
// from functions/interpreted/StackFunctionSupport.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: StackSymbol Quotation Symbol
// FunctionParameterListBuilder Pair FunctionBodyBuilder

// PORT NOTE: This was abstract in Java.
// PORT NOTE: We've changed all original uses of the constructor
// (which were just super() calls) to uses of
// StackFunctionSupport.of().
/** @constructor */
function StackFunctionSupport() {
    InterpretedFunction.call( this );
}

StackFunctionSupport.prototype = new InterpretedFunction();
StackFunctionSupport.prototype.Cons_ = StackFunctionSupport;
StackFunctionSupport.prototype.className = "StackFunctionSupport";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
StackFunctionSupport.of = function (
    parameterList, lexicalBindings, body ) {
    
    return new StackFunctionSupport().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
StackFunctionSupport.prototype.initStackFunctionSupport = function (
    parameterList, lexicalBindings, body ) {
    
    return this.init( parameterList, lexicalBindings, body );
};

StackFunctionSupport.prototype.canInline = function ( param, arg ) {
    return this.inlineableArg_( param, arg ) && !this.assigns( 0 );
};

StackFunctionSupport.prototype.inlineableArg_ = function (
    param, arg ) {
    
    var paramIndex = this.lexicalBindings[ param.name() ];
    var p = new StackSymbol( param, paramIndex );
    return (arg.literal()
        || arg instanceof Quotation
        || arg instanceof Symbol
        || (this.body.length === 1
            && this.body[ 0 ] instanceof StackSymbol
            && p.isSameStackSymbol( this.body[ 0 ] )));
};

StackFunctionSupport.prototype.nests = function () {
    return false;
};

StackFunctionSupport.prototype.curry = function (
    param, arg, requiresNesting ) {
    
    var paramIndex = this.lexicalBindings[ param.name() ];
    var p = new StackSymbol( param, paramIndex );
    var newParams = FunctionParameterListBuilder.curryStack(
        this.parameterList_, p, arg, paramIndex );
    var lexicalBindings = {};
    FunctionParameterListBuilder.index(
        newParams, lexicalBindings, [ 0 ], false );
    
    var newBody = [];
    for ( var i = 0; i < this.body.length; i++ )
        newBody.push(
            this.body[ i ].inline3( p, arg, paramIndex ).reduce() );
    var nb = Pair.buildFrom1( newBody );
    var complexParams =
        FunctionParameterListBuilder.isComplex( newParams );
    return FunctionBodyBuilder.buildStackFunctionBody(
        newParams, lexicalBindings, nb, complexParams );
};

// PORT NOTE: We've renamed all uses of .convert().
StackFunctionSupport.convertBody = function (
    lexicalBindings, body ) {
    
    var nb = new Array( ~~body.length );
    for ( var i = 0; i < body.length; i++ )
        nb[ i ] = StackFunctionSupport.convertItem(
            lexicalBindings, body[ i ] );
    return Pair.buildFrom1( nb );
};

StackFunctionSupport.convertItem = function (
    lexicalBindings, item ) {
    
    return item.replaceBoundSymbols( lexicalBindings );
};


// ===================================================================
// from functions/interpreted/optimise/Bind.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: ArcObject ArcError

/** @constructor */
function Bind() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind" ] = Bind;

Bind.prototype = new InterpretedFunction();
Bind.prototype.Cons_ = Bind;
Bind.prototype.className = "Bind";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind[ "of" ] = function ( parameterList, lexicalBindings, body ) {
    return new Bind().init( parameterList, lexicalBindings, body );
};

Bind.prototype.invokeN0 = function ( vm, lc ) {
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind.prototype.invoke3 = function ( vm, lc, args ) {
    try {
        args.mustBeNil();
    } catch ( notNil ) {
        if ( !(notNil instanceof ArcObject.NotNil) ) throw notNil;
        throw new ArcError( "expected 0 args, got " + args );
    }
    vm.pushInvocation2( lc, this.instructions_ );
};


// ===================================================================
// from functions/interpreted/optimise/Bind_A.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: ArcError LexicalClosure Nil ArcObject

/** @constructor */
function Bind_A() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_A" ] = Bind_A;

Bind_A.prototype = new InterpretedFunction();
Bind_A.prototype.Cons_ = Bind_A;
Bind_A.prototype.className = "Bind_A";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_A[ "of" ] = function ( parameterList, lexicalBindings, body ) {
    return new Bind_A().init( parameterList, lexicalBindings, body );
};

Bind_A.prototype.invokeN0 = function ( vm, lc ) {
    throw new ArcError(
        "function " + this + " expects 1 arg, got none" );
};

Bind_A.prototype.invokeN1 = function ( vm, lc, arg ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_A.prototype.invoke3 = function ( vm, lc, args ) {
    if ( args instanceof Nil )
        this.invokeN0( vm, lc );
    try {
        args.cdr().mustBeNil();
    } catch ( notNil ) {
        if ( !(notNil instanceof ArcObject.NotNil) ) throw notNil;
        throw new ArcError(
            "expected 1 arg, got " + args + " calling " + this );
    }
    this.invokeN1( vm, lc, args.car() );
};


// ===================================================================
// from functions/interpreted/optimise/Bind_A_A.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: ArcError LexicalClosure ArcObject

/** @constructor */
function Bind_A_A() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_A_A" ] = Bind_A_A;

Bind_A_A.prototype = new InterpretedFunction();
Bind_A_A.prototype.Cons_ = Bind_A_A;
Bind_A_A.prototype.className = "Bind_A_A";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_A_A[ "of" ] = function ( parameterList, lexicalBindings, body ) {
    return new Bind_A_A().init(
        parameterList, lexicalBindings, body );
};

Bind_A_A.prototype.invokeN0 = function ( vm, lc ) {
    throw new ArcError( "error: expected 2 args, got none" );
};

Bind_A_A.prototype.invokeN1 = function ( vm, lc, arg ) {
    throw new ArcError( "error: expected 2 args, got 1: " + arg );
};

Bind_A_A.prototype.invokeN2 = function ( vm, lc, arg1, arg2 ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg1 );
    lc.add( arg2 );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_A_A.prototype.invoke3 = function ( vm, lc, args ) {
    try {
        args.cdr().cdr().mustBeNil();
    } catch ( notNil ) {
        if ( !(notNil instanceof ArcObject.NotNil) ) throw notNil;
        throw new ArcError( "expected 2 args, got " + args );
    }
    this.invokeN2( vm, lc, args.car(), args.cdr().car() );
};


// ===================================================================
// from functions/interpreted/optimise/Bind_A_A_A.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: LexicalClosure

/** @constructor */
function Bind_A_A_A() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_A_A_A" ] = Bind_A_A_A;

Bind_A_A_A.prototype = new InterpretedFunction();
Bind_A_A_A.prototype.Cons_ = Bind_A_A_A;
Bind_A_A_A.prototype.className = "Bind_A_A_A";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_A_A_A[ "of" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Bind_A_A_A().init(
        parameterList, lexicalBindings, body );
};

Bind_A_A_A.prototype.invokeN3 = function (
    vm, lc, arg1, arg2, arg3 ) {
    
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg1 );
    lc.add( arg2 );
    lc.add( arg3 );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_A_A_A.prototype.invoke3 = function ( vm, lc, args ) {
    this.requireNil( args.cdr().cdr().cdr(), args );
    this.invokeN3( vm, lc,
        args.car(), args.cdr().car(), args.cdr().cdr().car() );
};


// ===================================================================
// from functions/interpreted/optimise/Bind_A_A_R.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: LexicalClosure

/** @constructor */
function Bind_A_A_R() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_A_A_R" ] = Bind_A_A_R;

Bind_A_A_R.prototype = new InterpretedFunction();
Bind_A_A_R.prototype.Cons_ = Bind_A_A_R;
Bind_A_A_R.prototype.className = "Bind_A_A_R";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_A_A_R[ "of" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Bind_A_A_R().init(
        parameterList, lexicalBindings, body );
};

Bind_A_A_R.prototype.invokeN0 = function ( vm, lc ) {
    throw new ArcError( "error: expected at least 2 arg, got none" );
};

Bind_A_A_R.prototype.invokeN1 = function ( vm, lc, arg ) {
    throw new ArcError(
        "error: expected at least 2 args, got one: " + arg );
};

Bind_A_A_R.prototype.invoke3 = function ( vm, lc, args ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( args.car() );
    lc.add( args.cdr().car() );
    lc.add( args.cdr().cdr() );
    vm.pushInvocation2( lc, this.instructions_ );
};


// ===================================================================
// from functions/interpreted/optimise/Bind_A_Obound.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: BoundSymbol Symbol LexicalClosure Nil

/** @constructor */
function Bind_A_Obound() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_A_Obound" ] = Bind_A_Obound;

Bind_A_Obound.prototype = new InterpretedFunction();
Bind_A_Obound.prototype.Cons_ = Bind_A_Obound;
Bind_A_Obound.prototype.className = "Bind_A_Obound";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_A_Obound[ "of" ] = function (
    parameterList, lexicalBindings, body ) {
    
    var result = new Bind_A_Obound().init(
        parameterList, lexicalBindings, body );
    // PORT NOTE: This local variable didn't exist in Java.
    var optExpr = parameterList.cdr().car().cdr().cdr().car();
    // PORT NOTE: This was a cast in Java.
    if ( !(optExpr instanceof BoundSymbol) )
        throw new TypeError();
    result.optExpr_ = optExpr;
    var optParam = parameterList.cdr().car().cdr().car();
    // PORT NOTE: This was a cast in Java.
    if ( !(optParam instanceof Symbol) )
        throw new TypeError();
    if ( result.canInline( optParam, result.optExpr_ ) )
        try {
            // PORT NOTE: This local variable didn't exist in Java.
            var curried =
                result.curry( optParam, result.optExpr_, false );
            // PORT NOTE: This was a cast in Java.
            // PORT TODO: See if this can ever throw an error.
            if ( !(curried instanceof InterpretedFunction) )
                throw new TypeError();
            result.curried = curried;
        } catch ( e ) { if ( !(e instanceof Error) ) throw e;
            printStackTrace( e );
        }
    return result;
};

Bind_A_Obound.prototype.invokeN1 = function ( vm, lc, arg ) {
    if ( this.curried !== null ) {
        this.curried.invokeN1( vm, lc, arg );
    } else {
        var len = 0;
        for ( var k in this.lexicalBindings )
            len++;
        lc = new LexicalClosure( len, lc );
        lc.add( arg );
        lc.add( this.optExpr_.interpret( lc ) );
        vm.pushInvocation2( lc, this.instructions_ );
    }
};

Bind_A_Obound.prototype.invokeN2 = function ( vm, lc, arg1, arg2 ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg1 );
    lc.add( arg2 );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_A_Obound.prototype.invoke3 = function ( vm, lc, args ) {
    this.requireNotNil( args, args );
    var arg1 = args.car();
    var rest = args.cdr();
    if ( rest instanceof Nil ) {
        this.invokeN1( vm, lc, arg1 );
    } else {
        this.requireNil( rest.cdr(), args );
        this.invokeN2( vm, lc, arg1, rest.car() );
    }
};


// ===================================================================
// from functions/interpreted/optimise/Bind_A_Oliteral.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: Symbol LexicalClosure Nil

/** @constructor */
function Bind_A_Oliteral() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_A_Oliteral" ] = Bind_A_Oliteral;

Bind_A_Oliteral.prototype = new InterpretedFunction();
Bind_A_Oliteral.prototype.Cons_ = Bind_A_Oliteral;
Bind_A_Oliteral.prototype.className = "Bind_A_Oliteral";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_A_Oliteral[ "of" ] = function (
    parameterList, lexicalBindings, expandedBody ) {
    
    var result = new Bind_A_Oliteral().init(
        parameterList, lexicalBindings, expandedBody );
    result.optExpr_ = parameterList.cdr().car().cdr().cdr().car();
    var optParam = parameterList.cdr().car().cdr().car();
    // PORT NOTE: This was a cast in Java.
    if ( !(optParam instanceof Symbol) )
        throw new TypeError();
    if ( result.canInline( optParam, result.optExpr_ ) )
        try {
            // PORT NOTE: This local variable didn't exist in Java.
            var curried =
                result.curry( optParam, result.optExpr_, false );
            // PORT NOTE: This was a cast in Java.
            // PORT TODO: See if this can ever throw an error.
            if ( !(curried instanceof InterpretedFunction) )
                throw new TypeError();
            result.curried = curried;
        } catch ( e ) { if ( !(e instanceof Error) ) throw e;
            printStackTrace( e );
        }
    return result;
};

Bind_A_Oliteral.prototype.invokeN1 = function ( vm, lc, arg ) {
    if ( this.curried !== null ) {
        this.curried.invokeN1( vm, lc, arg );
    } else {
        var len = 0;
        for ( var k in this.lexicalBindings )
            len++;
        lc = new LexicalClosure( len, lc );
        lc.add( arg );
        lc.add( this.optExpr_ );
        vm.pushInvocation2( lc, this.instructions_ );
    }
};

Bind_A_Oliteral.prototype.invokeN2 = function ( vm, lc, arg1, arg2 ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg1 );
    lc.add( arg2 );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_A_Oliteral.prototype.invoke3 = function ( vm, lc, args ) {
    this.requireNotNil( args, args );
    var arg1 = args.car();
    var rest = args.cdr();
    if ( rest instanceof Nil ) {
        this.invokeN1( vm, lc, arg1 );
    } else {
        this.requireNil( rest.cdr(), args );
        this.invokeN2( vm, lc, arg1, rest.car() );
    }
};


// ===================================================================
// from functions/interpreted/optimise/Bind_A_Oother.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: Symbol LexicalClosure BindAndRun Nil

/** @constructor */
function Bind_A_Oother() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_A_Oother" ] = Bind_A_Oother;

Bind_A_Oother.prototype = new InterpretedFunction();
Bind_A_Oother.prototype.Cons_ = Bind_A_Oother;
Bind_A_Oother.prototype.className = "Bind_A_Oother";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_A_Oother[ "of" ] = function (
    parameterList, lexicalBindings, expandedBody ) {
    
    var result = new Bind_A_Oother().init(
        parameterList, lexicalBindings, expandedBody );
    var optExpr = parameterList.cdr().car().cdr().cdr().car();
    var i = [];
    optExpr.addInstructions( i );
    result.optInstructions_ = Pair.buildFrom1( i );
    return result;
};

// ASYNC PORT NOTE: The synchronous Java version is below.
Bind_A_Oother.prototype.invokeN1 = function ( vm, lc, arg ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg );
    vm.pushFrame( new BindAndRun( lc, this.instructions_, this ) );
    vm.pushInvocation2( lc, this.optInstructions_ );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//Bind_A_Oother.prototype.invokeN1 = function ( vm, lc, arg ) {
//    var len = 0;
//    for ( var k in this.lexicalBindings )
//        len++;
//    lc = new LexicalClosure( len, lc );
//    lc.add( arg );
//    vm.pushInvocation2( lc, this.optInstructions_ );
//    lc.add( vm.thread() );
//    vm.pushInvocation2( lc, this.instructions_ );
//};

Bind_A_Oother.prototype.invokeN2 = function ( vm, lc, arg1, arg2 ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg1 );
    lc.add( arg2 );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_A_Oother.prototype.invoke3 = function ( vm, lc, args ) {
    this.requireNotNil( args, args );
    var arg1 = args.car();
    var rest = args.cdr();
    if ( rest instanceof Nil ) {
        this.invokeN1( vm, lc, arg1 );
    } else {
        this.requireNil( rest.cdr(), args );
        this.invokeN2( vm, lc, arg1, rest.car() );
    }
};


// ===================================================================
// from functions/interpreted/optimise/Bind_A_R.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: ArcError LexicalClosure

/** @constructor */
function Bind_A_R() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_A_R" ] = Bind_A_R;

Bind_A_R.prototype = new InterpretedFunction();
Bind_A_R.prototype.Cons_ = Bind_A_R;
Bind_A_R.prototype.className = "Bind_A_R";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_A_R[ "of" ] = function ( parameterList, lexicalBindings, body ) {
    return new Bind_A_R().init(
        parameterList, lexicalBindings, body );
};

Bind_A_R.prototype.invokeN0 = function ( vm, lc ) {
    throw new ArcError( "error: expected at least 1 arg, got none" );
};

Bind_A_R.prototype.invoke3 = function ( vm, lc, args ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( args.car() );
    lc.add( args.cdr() );
    vm.pushInvocation2( lc, this.instructions_ );
};


// ===================================================================
// from functions/interpreted/optimise/Bind_D_A_A_A_d.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: LexicalClosure Pair ArcError

/** @constructor */
function Bind_D_A_A_A_d() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_D_A_A_A_d" ] = Bind_D_A_A_A_d;

Bind_D_A_A_A_d.prototype = new InterpretedFunction();
Bind_D_A_A_A_d.prototype.Cons_ = Bind_D_A_A_A_d;
Bind_D_A_A_A_d.prototype.className = "Bind_D_A_A_A_d";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_D_A_A_A_d[ "of" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Bind_D_A_A_A_d().init(
        parameterList, lexicalBindings, body );
};

Bind_D_A_A_A_d.prototype.invokeN1 = function ( vm, lc, arg ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    
    var destructured = arg;
    // PORT NOTE: This was a cast in Java.
    if ( !(destructured instanceof Pair) )
        throw new TypeError();
    lc.add( destructured.car() );
    
    destructured = destructured.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(destructured instanceof Pair) )
        throw new TypeError();
    lc.add( destructured.car() );
    
    destructured = destructured.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(destructured instanceof Pair) )
        throw new TypeError();
    lc.add( destructured.car() );
    
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_D_A_A_A_d.prototype.invoke3 = function ( vm, lc, args ) {
    try {
        args.cdr().mustBeNil();
    } catch ( notNil ) {
        if ( !(notNil instanceof ArcObject.NotNil) ) throw notNil;
        throw new ArcError(
            "expected 1 arg, got extra " + args.cdr() + " calling " +
            this );
    }
    this.invokeN1( vm, lc, args.car() );
};


// ===================================================================
// from functions/interpreted/optimise/Bind_D_A_A_d.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: LexicalClosure Pair ArcError

/** @constructor */
function Bind_D_A_A_d() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_D_A_A_d" ] = Bind_D_A_A_d;

Bind_D_A_A_d.prototype = new InterpretedFunction();
Bind_D_A_A_d.prototype.Cons_ = Bind_D_A_A_d;
Bind_D_A_A_d.prototype.className = "Bind_D_A_A_d";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_D_A_A_d[ "of" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Bind_D_A_A_d().init(
        parameterList, lexicalBindings, body );
};

Bind_D_A_A_d.prototype.invokeN1 = function ( vm, lc, arg ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    
    var destructured = arg;
    // PORT NOTE: This was a cast in Java.
    if ( !(destructured instanceof Pair) )
        throw new TypeError();
    lc.add( destructured.car() );
    
    destructured = destructured.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(destructured instanceof Pair) )
        throw new TypeError();
    lc.add( destructured.car() );
    
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_D_A_A_d.prototype.invoke3 = function ( vm, lc, args ) {
    this.requireNil( args.cdr(), args );
    this.invokeN1( vm, lc, args.car() );
};


// ===================================================================
// from functions/interpreted/optimise/Bind_Obound.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: Pair Symbol LexicalClosure Nil

/** @constructor */
function Bind_Obound() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_Obound" ] = Bind_Obound;

Bind_Obound.prototype = new InterpretedFunction();
Bind_Obound.prototype.Cons_ = Bind_Obound;
Bind_Obound.prototype.className = "Bind_Obound";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_Obound[ "of" ] = function (
    parameterList, lexicalBindings, body ) {
    
    var result = new Bind_Obound().init(
        parameterList, lexicalBindings, body );
    var opt = parameterList.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(opt instanceof Pair) )
        throw new TypeError();
    // PORT NOTE: This local variable didn't exist in Java.
    var optionalExpression = opt.cdr().cdr().car();
    // PORT NOTE: This was a cast in Java.
    if ( !(optionalExpression instanceof BoundSymbol) )
        throw new TypeError();
    result.optionalExpression_ = optionalExpression;
    return result;
};

Bind_Obound.prototype.invokeN0 = function ( vm, lc ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( this.optionalExpression_.interpret( lc ) );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_Obound.prototype.invokeN1 = function ( vm, lc, arg ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_Obound.prototype.invoke3 = function ( vm, lc, args ) {
    if ( args instanceof Nil ) {
        this.invokeN0( vm, lc );
    } else {
        try {
            args.cdr().mustBeNil();
        } catch ( notNil ) {
            if ( !(notNil instanceof ArcObject.NotNil) ) throw notNil;
            throw new ArcError(
                "expected 0 or 1 args, got extra " +
                args.cdr() + " calling " + this );
        }
        this.invokeN1( vm, lc, args.car() );
    }
};


// ===================================================================
// from functions/interpreted/optimise/Bind_Oliteral.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: Symbol LexicalClosure Nil

/** @constructor */
function Bind_Oliteral() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_Oliteral" ] = Bind_Oliteral;

Bind_Oliteral.prototype = new InterpretedFunction();
Bind_Oliteral.prototype.Cons_ = Bind_Oliteral;
Bind_Oliteral.prototype.className = "Bind_Oliteral";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_Oliteral[ "of" ] = function (
    parameterList, lexicalBindings, expandedBody ) {
    
    var result = new Bind_Oliteral().init(
        parameterList, lexicalBindings, expandedBody );
    result.optExpr_ = parameterList.car().cdr().cdr().car();
    var optParam = parameterList.car().cdr().car();
    // PORT NOTE: This was a cast in Java.
    if ( !(optParam instanceof Symbol) )
        throw new TypeError();
    if ( result.canInline( optParam, result.optExpr_ ) ) {
        // PORT NOTE: This local variable didn't exist in Java.
        var curried =
            result.curry( optParam, result.optExpr_, false );
        // PORT NOTE: This was a cast in Java.
        // PORT TODO: See if this can ever throw an error.
        if ( !(curried instanceof InterpretedFunction) )
            throw new TypeError();
        result.curried = curried;
    }
    return result;
};

Bind_Oliteral.prototype.invokeN0 = function ( vm, lc ) {
    if ( this.curried !== null ) {
        this.curried.invokeN0( vm, lc );
    } else {
        var len = 0;
        for ( var k in this.lexicalBindings )
            len++;
        lc = new LexicalClosure( len, lc );
        lc.add( this.optExpr_ );
        vm.pushInvocation2( lc, this.instructions_ );
    }
};

Bind_Oliteral.prototype.invokeN1 = function ( vm, lc, arg ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_Oliteral.prototype.invoke3 = function ( vm, lc, args ) {
    if ( args instanceof Nil ) {
        this.invokeN0( vm, lc );
    } else {
        try {
            args.cdr().mustBeNil();
        } catch ( notNil ) {
            if ( !(notNil instanceof ArcObject.NotNil) ) throw notNil;
            throw new ArcError(
                "expected 0 or 1 args, got extra " +
                args.cdr() + " calling " + this );
        }
        this.invokeN1( vm, lc, args.car() );
    }
};


// ===================================================================
// from functions/interpreted/optimise/Bind_Oother.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: Symbol LexicalClosure Nil ArcError

/** @constructor */
function Bind_Oother() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_Oother" ] = Bind_Oother;

Bind_Oother.prototype = new InterpretedFunction();
Bind_Oother.prototype.Cons_ = Bind_Oother;
Bind_Oother.prototype.className = "Bind_Oother";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_Oother[ "of" ] = function (
    parameterList, lexicalBindings, expandedBody ) {
    
    var result = new Bind_Oother().init(
        parameterList, lexicalBindings, expandedBody );
    result.init( parameterList, lexicalBindings, expandedBody );
    result.optExpr_ = parameterList.car().cdr().cdr().car();
    var i = [];
    result.optExpr_.addInstructions( i );
    result.optInstructions_ = Pair.buildFrom1( i );
    return result;
};

// ASYNC PORT NOTE: The synchronous Java version is below.
Bind_Oother.prototype.invokeN0 = function ( vm, lc ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    vm.pushFrame( new BindAndRun( lc, this.instructions_, this ) );
    vm.pushInvocation2( lc, this.optInstructions_ );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//Bind_Oother.prototype.invokeN0 = function ( vm, lc ) {
//    var len = 0;
//    for ( var k in this.lexicalBindings )
//        len++;
//    lc = new LexicalClosure( len, lc );
//    vm.pushInvocation2( lc, this.optInstructions_ );
//    lc.add( vm.thread() );
//    vm.pushInvocation2( lc, this.instructions_ );
//};

Bind_Oother.prototype.invokeN1 = function ( vm, lc, arg ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( arg );
    vm.pushInvocation2( lc, this.instructions_ );
};

Bind_Oother.prototype.invoke3 = function ( vm, lc, args ) {
    if ( args instanceof Nil ) {
        this.invokeN0( vm, lc );
    } else {
        try {
            args.cdr().mustBeNil();
        } catch ( notNil ) {
            if ( !(notNil instanceof ArcObject.NotNil) ) throw notNil;
            throw new ArcError(
                "expected 0 or 1 args, got extra " +
                args.cdr() + " calling " + this );
        }
        this.invokeN1( vm, lc, args.car() );
    }
};


// ===================================================================
// from functions/interpreted/optimise/Bind_R.java
// ===================================================================
// Needed early: InterpretedFunction
// Needed late: LexicalClosure

/** @constructor */
function Bind_R() {
    InterpretedFunction.call( this );
}
classes[ "rainbow.function.interpreted.optimise." +
    "Bind_R" ] = Bind_R;

Bind_R.prototype = new InterpretedFunction();
Bind_R.prototype.Cons_ = Bind_R;
Bind_R.prototype.className = "Bind_R";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Bind_R[ "of" ] = function ( parameterList, lexicalBindings, body ) {
    return new Bind_R().init( parameterList, lexicalBindings, body );
};

Bind_R.prototype.invoke3 = function ( vm, lc, args ) {
    var len = 0;
    for ( var k in this.lexicalBindings )
        len++;
    lc = new LexicalClosure( len, lc );
    lc.add( args );
    vm.pushInvocation2( lc, this.instructions_ );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_A.java
// ===================================================================
// Needed early: StackFunctionSupport

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of Stack_A.of*().
/** @constructor */
function Stack_A() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_A" ] = Stack_A;

Stack_A.prototype = new StackFunctionSupport();
Stack_A.prototype.Cons_ = Stack_A;
Stack_A.prototype.className = "Stack_A";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A[ "of1" ] = function ( original ) {
    return Stack_A[ "of3" ]( original.parameterList(),
        original.lexicalBindings, StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A[ "of3" ] = function ( parameterList, lexicalBindings, body ) {
    return new Stack_A().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

Stack_A.prototype.invokef1 = function ( vm, arg ) {
    vm.pushInvocation3( null, this.instructions_, [ arg ] );
};

Stack_A.prototype.invokeN1 = function ( vm, lc, arg ) {
    vm.pushInvocation3( lc, this.instructions_, [ arg ] );
};

Stack_A.prototype.invoke = function ( vm, args ) {
    this.checkArgsLength( 1, args );
    this.invokef1( vm, args.car() );
};

Stack_A.prototype.invoke3 = function ( vm, lc, args ) {
    this.checkArgsLength( 1, args );
    this.invokeN1( vm, lc, args.car() );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_A_A.java
// ===================================================================
// Needed early: StackFunctionSupport

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of Stack_A_A.of*().
/** @constructor */
function Stack_A_A() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_A_A" ] = Stack_A_A;

Stack_A_A.prototype = new StackFunctionSupport();
Stack_A_A.prototype.Cons_ = Stack_A_A;
Stack_A_A.prototype.className = "Stack_A_A";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_A[ "of1" ] = function ( original ) {
    return Stack_A_A[ "of3" ]( original.parameterList(),
        original.lexicalBindings, StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_A[ "of3" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Stack_A_A().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

Stack_A_A.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    vm.pushInvocation3( null, this.instructions_, [ arg1, arg2 ] );
};

Stack_A_A.prototype.invokeN2 = function ( vm, lc, arg1, arg2 ) {
    vm.pushInvocation3( lc, this.instructions_, [ arg1, arg2 ] );
};

Stack_A_A.prototype.invoke = function ( vm, args ) {
    this.checkArgsLength( 2, args );
    this.invokef2( vm, args.car(), args.cdr().car() );
};

Stack_A_A.prototype.invoke3 = function ( vm, lc, args ) {
    this.checkArgsLength( 2, args );
    this.invokeN2( vm, lc, args.car(), args.cdr().car() );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_A_A_A.java
// ===================================================================
// Needed early: StackFunctionSupport

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of Stack_A_A_A.of*().
/** @constructor */
function Stack_A_A_A() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_A_A_A" ] = Stack_A_A_A;

Stack_A_A_A.prototype = new StackFunctionSupport();
Stack_A_A_A.prototype.Cons_ = Stack_A_A_A;
Stack_A_A_A.prototype.className = "Stack_A_A_A";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_A_A[ "of1" ] = function ( original ) {
    return Stack_A_A_A[ "of3" ]( original.parameterList(),
        original.lexicalBindings, StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_A_A[ "of3" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Stack_A_A_A().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

Stack_A_A_A.prototype.invokef3 = function ( vm, arg1, arg2, arg3 ) {
    vm.pushInvocation3(
        null, this.instructions_, [ arg1, arg2, arg3 ] );
};

Stack_A_A_A.prototype.invokeN3 = function (
    vm, lc, arg1, arg2, arg3 ) {
    
    vm.pushInvocation3(
        lc, this.instructions_, [ arg1, arg2, arg3 ] );
};

Stack_A_A_A.prototype.invoke = function ( vm, args ) {
    this.checkArgsLength( 3, args );
    this.invokef3( vm,
        args.car(), args.cdr().car(), args.cdr().cdr().car() );
};

Stack_A_A_A.prototype.invoke3 = function ( vm, lc, args ) {
    this.checkArgsLength( 3, args );
    this.invokeN3( vm, lc,
        args.car(), args.cdr().car(), args.cdr().cdr().car() );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_A_A_A_A.java
// ===================================================================
// Needed early: StackFunctionSupport

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of Stack_A_A_A_A.of*().
/** @constructor */
function Stack_A_A_A_A() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_A_A_A_A" ] = Stack_A_A_A_A;

Stack_A_A_A_A.prototype = new StackFunctionSupport();
Stack_A_A_A_A.prototype.Cons_ = Stack_A_A_A_A;
Stack_A_A_A_A.prototype.className = "Stack_A_A_A_A";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_A_A_A[ "of1" ] = function ( original ) {
    return Stack_A_A_A_A[ "of3" ]( original.parameterList(),
        original.lexicalBindings, StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_A_A_A[ "of3" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Stack_A_A_A_A().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

Stack_A_A_A_A.prototype.invokef4 = function (
    vm, arg1, arg2, arg3, arg4 ) {
    
    vm.pushInvocation3(
        null, this.instructions_, [ arg1, arg2, arg3, arg4 ] );
};

Stack_A_A_A_A.prototype.invokeN4 = function (
    vm, lc, arg1, arg2, arg3, arg4 ) {
    
    vm.pushInvocation3(
        lc, this.instructions_, [ arg1, arg2, arg3, arg4 ] );
};

Stack_A_A_A_A.prototype.invoke = function ( vm, args ) {
    this.checkArgsLength( 4, args );
    this.invokef4( vm, args.car(), args.cdr().car(),
        args.cdr().cdr().car(), args.cdr().cdr().cdr().car() );
};

Stack_A_A_A_A.prototype.invoke3 = function ( vm, lc, args ) {
    this.checkArgsLength( 4, args );
    this.invokeN4( vm, lc, args.car(), args.cdr().car(),
        args.cdr().cdr().car(), args.cdr().cdr().cdr().car() );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_A_A_R.java
// ===================================================================
// Needed early: StackFunctionSupport

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of Stack_A_A_R.of*().
/** @constructor */
function Stack_A_A_R() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_A_A_R" ] = Stack_A_A_R;

Stack_A_A_R.prototype = new StackFunctionSupport();
Stack_A_A_R.prototype.Cons_ = Stack_A_A_R;
Stack_A_A_R.prototype.className = "Stack_A_A_R";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_A_R[ "of1" ] = function ( original ) {
    return Stack_A_A_R[ "of3" ]( original.parameterList(),
        original.lexicalBindings, StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_A_R[ "of3" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Stack_A_A_R().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

Stack_A_A_R.prototype.invoke3 = function ( vm, lc, args ) {
    vm.pushInvocation3( lc, this.instructions_,
        [ args.car(), args.cdr().car(), args.cdr().cdr() ] );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_A_R.java
// ===================================================================
// Needed early: StackFunctionSupport

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of Stack_A_R.of*().
/** @constructor */
function Stack_A_R() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_A_R" ] = Stack_A_R;

Stack_A_R.prototype = new StackFunctionSupport();
Stack_A_R.prototype.Cons_ = Stack_A_R;
Stack_A_R.prototype.className = "Stack_A_R";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_R[ "of1" ] = function ( original ) {
    return Stack_A_R[ "of3" ]( original.parameterList(),
        original.lexicalBindings, StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_R[ "of3" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Stack_A_R().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

Stack_A_R.prototype.invoke3 = function ( vm, lc, args ) {
    vm.pushInvocation3( lc, this.instructions_,
        [ args.car(), args.cdr() ] );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_R.java
// ===================================================================
// Needed early: StackFunctionSupport

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of Stack_R.of*().
/** @constructor */
function Stack_R() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_R" ] = Stack_R;

Stack_R.prototype = new StackFunctionSupport();
Stack_R.prototype.Cons_ = Stack_R;
Stack_R.prototype.className = "Stack_R";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_R[ "of1" ] = function ( original ) {
    return Stack_R[ "of3" ]( original.parameterList(),
        original.lexicalBindings, StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_R[ "of3" ] = function ( parameterList, lexicalBindings, body ) {
    return new Stack_R().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

Stack_R.prototype.invoke3 = function ( vm, lc, args ) {
    vm.pushInvocation3( lc, this.instructions_, [ args ] );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_D_A_A_A_A_d.java
// ===================================================================
// Needed early: StackFunctionSupport

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of
// Stack_D_A_A_A_A_d.of*().
/** @constructor */
function Stack_D_A_A_A_A_d() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_D_A_A_A_A_d" ] = Stack_D_A_A_A_A_d;

Stack_D_A_A_A_A_d.prototype = new StackFunctionSupport();
Stack_D_A_A_A_A_d.prototype.Cons_ = Stack_D_A_A_A_A_d;
Stack_D_A_A_A_A_d.prototype.className = "Stack_D_A_A_A_A_d";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_D_A_A_A_A_d[ "of1" ] = function ( original ) {
    return Stack_D_A_A_A_A_d[ "of3" ]( original.parameterList(),
        original.lexicalBindings, StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_D_A_A_A_A_d[ "of3" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Stack_D_A_A_A_A_d().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

Stack_D_A_A_A_A_d.prototype.invokef1 = function ( vm, arg ) {
    vm.pushInvocation3( null, this.instructions_, [
        arg.car(),
        arg.cdr().car(),
        arg.cdr().cdr().car(),
        arg.cdr().cdr().cdr().car()
    ] );
};

Stack_D_A_A_A_A_d.prototype.invokeN1 = function ( vm, lc, arg ) {
    vm.pushInvocation3( lc, this.instructions_, [
        arg.car(),
        arg.cdr().car(),
        arg.cdr().cdr().car(),
        arg.cdr().cdr().cdr().car()
    ] );
};

Stack_D_A_A_A_A_d.prototype.invoke = function ( vm, args ) {
    this.checkArgsLength( 1, args );
    this.invokef1( vm, args.car() );
};

Stack_D_A_A_A_A_d.prototype.invoke3 = function ( vm, lc, args ) {
    this.checkArgsLength( 1, args );
    this.invokeN1( vm, lc, args.car() );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_D_A_A_d.java
// ===================================================================
// Needed early: StackFunctionSupport

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of Stack_D_A_A_d.of*().
/** @constructor */
function Stack_D_A_A_d() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_D_A_A_d" ] = Stack_D_A_A_d;

Stack_D_A_A_d.prototype = new StackFunctionSupport();
Stack_D_A_A_d.prototype.Cons_ = Stack_D_A_A_d;
Stack_D_A_A_d.prototype.className = "Stack_D_A_A_d";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_D_A_A_d[ "of1" ] = function ( original ) {
    return Stack_D_A_A_d[ "of3" ]( original.parameterList(),
        original.lexicalBindings, StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_D_A_A_d[ "of3" ] = function (
    parameterList, lexicalBindings, body ) {
    
    return new Stack_D_A_A_d().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
};

Stack_D_A_A_d.prototype.invokef1 = function ( vm, arg ) {
    vm.pushInvocation3( null, this.instructions_,
        [ arg.car(), arg.cdr().car() ] );
};

Stack_D_A_A_d.prototype.invokeN1 = function ( vm, lc, arg ) {
    vm.pushInvocation3( lc, this.instructions_,
        [ arg.car(), arg.cdr().car() ] );
};

Stack_D_A_A_d.prototype.invoke = function ( vm, args ) {
    this.checkArgsLength( 1, args );
    this.invokef1( vm, args.car() );
};

Stack_D_A_A_d.prototype.invoke3 = function ( vm, lc, args ) {
    this.checkArgsLength( 1, args );
    this.invokeN1( vm, lc, args.car() );
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_A_Oliteral.java
// ===================================================================
// Needed early: StackFunctionSupport
// Needed late: Symbol InterpretedFunction Nil

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of
// Stack_A_Oliteral.of*().
/** @constructor */
function Stack_A_Oliteral() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_A_Oliteral" ] = Stack_A_Oliteral;

Stack_A_Oliteral.prototype = new StackFunctionSupport();
Stack_A_Oliteral.prototype.Cons_ = Stack_A_Oliteral;
Stack_A_Oliteral.prototype.className = "Stack_A_Oliteral";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_Oliteral[ "of1" ] = function ( original ) {
    var result = new Stack_A_Oliteral().initStackFunctionSupport(
        original.parameterList(), original.lexicalBindings,
        StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
    result.optExpr_ =
        result.parameterList_.cdr().car().cdr().cdr().car();
    var optParam = result.parameterList_.cdr().car().cdr().car();
    // PORT NOTE: This was a cast in Java.
    if ( !(optParam instanceof Symbol) )
        throw new TypeError();
    if ( result.canInline( optParam, result.optExpr_ ) ) {
        // PORT NOTE: This local variable didn't exist in Java.
        var curried =
            result.curry( optParam, result.optExpr_, false );
        // PORT NOTE: This was a cast in Java.
        // PORT TODO: See if this can ever throw an error.
        if ( !(curried instanceof InterpretedFunction) )
            throw new TypeError();
        result.curried = curried;
    }
    return result;
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_A_Oliteral[ "of3" ] = function (
    parameterList, lexicalBindings, body ) {
    
    var result = new Stack_A_Oliteral().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
    // PORT TODO: See if this inconsistency with the one-arg
    // constructor and Stack_Oliteral is a bug. But don't fix it!
    result.optExpr_ = parameterList.car().cdr().cdr().car();
    return result;
};

Stack_A_Oliteral.prototype.invokef1 = function ( vm, arg ) {
    if ( this.curried !== null )
        this.curried.invokef1( vm, arg );
    else
        vm.pushInvocation3(
            null, this.instructions_, [ arg, this.optExpr_ ] );
};

Stack_A_Oliteral.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    vm.pushInvocation3( null, this.instructions_, [ arg1, arg2 ] );
};

Stack_A_Oliteral.prototype.invokeN1 = function ( vm, lc, arg ) {
    if ( this.curried !== null )
        this.curried.invokeN1( vm, lc, arg );
    else
        vm.pushInvocation3(
            lc, this.instructions_, [ arg, this.optExpr_ ] );
};

Stack_A_Oliteral.prototype.invokeN2 = function (
    vm, lc, arg1, arg2 ) {
    
    vm.pushInvocation3( lc, this.instructions_, [ arg1, arg2 ] );
};

Stack_A_Oliteral.prototype.invoke = function ( vm, args ) {
    if ( args instanceof Nil ) {
        this.throwArgMismatchError( args );
    } else {
        var arg1 = args.car();
        if ( args.cdr() instanceof Nil )
            this.invokef1( vm, arg1 );
        else
            this.invokef2( vm, arg1, args.cdr().car() );
    }
};

Stack_A_Oliteral.prototype.invoke3 = function ( vm, lc, args ) {
    if ( args instanceof Nil ) {
        this.throwArgMismatchError( args );
    } else {
        var arg1 = args.car();
        if ( args.cdr() instanceof Nil )
            this.invokeN1( vm, lc, arg1 );
        else
            this.invokeN( vm, lc, arg1, args.cdr().car() );
    }
};


// ===================================================================
// from functions/interpreted/optimise/stack/Stack_Oliteral.java
// ===================================================================
// Needed early: StackFunctionSupport
// Needed late: Symbol InterpretedFunction Nil

// PORT NOTE: We've changed all original uses of the constructor
// (which were only reflection uses) to uses of Stack_Oliteral.of*().
/** @constructor */
function Stack_Oliteral() {
    StackFunctionSupport.call( this );
}
classes[ "rainbow.function.interpreted.optimise.stack." +
    "Stack_Oliteral" ] = Stack_Oliteral;

Stack_Oliteral.prototype = new StackFunctionSupport();
Stack_Oliteral.prototype.Cons_ = Stack_Oliteral;
Stack_Oliteral.prototype.className = "Stack_Oliteral";

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_Oliteral[ "of1" ] = function ( original ) {
    var result = new Stack_Oliteral().initStackFunctionSupport(
        original.parameterList(), original.lexicalBindings,
        StackFunctionSupport.convertBody(
            original.lexicalBindings, original.body ) );
    result.optExpr_ =
        result.parameterList_.car().cdr().cdr().car();
    var optParam = result.parameterList_.car().cdr().car();
    // PORT NOTE: This was a cast in Java.
    if ( !(optParam instanceof Symbol) )
        throw new TypeError();
    if ( result.canInline( optParam, result.optExpr_ ) ) {
        // PORT NOTE: This local variable didn't exist in Java.
        var curried =
            result.curry( optParam, result.optExpr_, false );
        // PORT NOTE: This was a cast in Java.
        // PORT TODO: See if this can ever throw an error.
        if ( !(curried instanceof InterpretedFunction) )
            throw new TypeError();
        result.curried = curried;
    }
    return result;
};

// PORT NOTE: This didn't exist in Java. (It was part of the
// constructor.)
Stack_Oliteral[ "of3" ] = function (
    parameterList, lexicalBindings, body ) {
    
    var result = new Stack_Oliteral().initStackFunctionSupport(
        parameterList, lexicalBindings, body );
    result.optExpr_ = parameterList.car().cdr().cdr().car();
    return result;
};

Stack_Oliteral.prototype.invokef0 = function ( vm ) {
    if ( this.curried !== null )
        this.curried.invokef0( vm );
    else
        vm.pushInvocation3(
            null, this.instructions_, [ this.optExpr_ ] );
};

Stack_Oliteral.prototype.invokef1 = function ( vm, arg ) {
    vm.pushInvocation3( null, this.instructions_, [ arg ] );
};

Stack_Oliteral.prototype.invokeN0 = function ( vm, lc ) {
    if ( this.curried !== null )
        this.curried.invokeN1( vm, lc );
    else
        vm.pushInvocation3( lc, this.instructions_,
            [ this.optExpr_ ] );
};

Stack_Oliteral.prototype.invokeN1 = function ( vm, lc, arg ) {
    vm.pushInvocation3( lc, this.instructions_, [ arg ] );
};

Stack_Oliteral.prototype.invoke = function ( vm, args ) {
    if ( args instanceof Nil ) {
        this.invokef0( vm );
    } else {
        this.checkArgsLength( 1, args );
        this.invokef1( vm, args.car() );
    }
};

Stack_Oliteral.prototype.invoke3 = function ( vm, lc, args ) {
    if ( args instanceof Nil ) {
        this.invokeN0( vm );
    } else {
        this.checkArgsLength( 1, args );
        this.invokeN1( vm, lc, args.car() );
    }
};


// ===================================================================
// from functions/Macex.java
// ===================================================================
// Needed early: Builtin
// Needed late: Nil ArcObject Pair Symbol Tagged

/** @constructor */
function Macex() {
    Builtin.call( this );
    this.init( "macex" );
}

Macex.prototype = new Builtin();
Macex.prototype.className = "Macex";

// ASYNC PORT NOTE: The synchronous Java version is below.
Macex.prototype.invoke = function ( vm, args ) {
    if ( args instanceof Nil ) {
        vm.pushA( ArcObject.NIL );
        return;
    }
    
    var expression = args.car();
    if ( !(expression instanceof Pair) ) {
        vm.pushA( expression );
        return;
    }
    
    var macroName = expression.car();
    if ( !(macroName instanceof Symbol) ) {
        vm.pushA( expression );
        return;
    }
    
    if ( !macroName.bound() ) {
        vm.pushA( expression );
        return;
    }
    
    var macro = macroName.value();
    var fn = Tagged.ifTagged( macro, "mac" );
    if ( fn === null ) {
        vm.pushA( expression );
        return;
    }
    
    // PORT NOTE: This local variable didn't exist in Java.
    var body = expression.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(body instanceof Pair) )
        throw new TypeError();
    vm.pushFrame( new Macex.Again( this ) );
    fn.invokeAndWait( vm, body );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
Macex.Again = function ( owner ) {
    Instruction.call( this );
    this.belongsTo( owner );
};

Macex.Again.prototype = new Instruction();
Macex.Again.prototype.className = "Macex.Again";

Macex.Again.prototype.operate = function ( vm ) {
    this.owner().invoke( vm, new Pair( vm.popA(), ArcObject.NIL ) );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//Macex.prototype.invoke = function ( vm, args ) {
//    if ( args instanceof Nil ) {
//        vm.pushA( ArcObject.NIL );
//        return;
//    }
//    
//    var expression = args.car();
//    if ( !(expression instanceof Pair) ) {
//        vm.pushA( expression );
//        return;
//    }
//    
//    var macroName = expression.car();
//    if ( !(macroName instanceof Symbol) ) {
//        vm.pushA( expression );
//        return;
//    }
//    
//    if ( !macroName.bound() ) {
//        vm.pushA( expression );
//        return;
//    }
//    
//    var macro = macroName.value();
//    var fn = Tagged.ifTagged( macro, "mac" );
//    if ( fn === null ) {
//        vm.pushA( expression );
//        return;
//    }
//    
//    // PORT NOTE: This local variable didn't exist in Java.
//    var body = expression.cdr();
//    // PORT NOTE: This was a cast in Java.
//    if ( !(body instanceof Pair) )
//        throw new TypeError();
//    expression = fn.invokeAndWait( vm, body );
//    this.invoke( vm, new Pair( expression, ArcObject.NIL ) );
//};


// ===================================================================
// from functions/Uniq.java
// ===================================================================
// Needed early: Builtin
// Needed late: Symbol ArcObject ArcError

/** @constructor */
function Uniq() {
    Builtin.call( this );
    this.init( "uniq" );
}

Uniq.prototype = new Builtin();
Uniq.prototype.className = "Uniq";

Uniq.prototype.invokef0 = function ( vm ) {
    // PORT NOTE: This was synchronized on Uniq.class in Java.
    vm.pushA( Symbol.mkSym( "gs" + (++Uniq.count_) ) );
};

Uniq.prototype.invokePair = function ( args ) {
    try {
        args.mustBeNil();
    } catch ( notNil ) {
        if ( !(notNil instanceof ArcObject.NotNil) )
            throw new ArcError(
                "uniq: expects no args, got " + args );
    }
    // PORT NOTE: This was synchronized on Uniq.class in Java.
    return Symbol.mkSym( "gs" + (++Uniq.count_) );
};

Uniq.count_ = 0;


// ===================================================================
// from functions/errors/Details.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcException

/** @constructor */
function Details() {
    Builtin.call( this );
    this.init( "details" );
}

Details.prototype = new Builtin();
Details.prototype.className = "Details";

Details.prototype.invokePair = function ( args ) {
    return ArcException.cast( args.car(), this ).message();
};


// ===================================================================
// from functions/errors/Err.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcError ArcString

/** @constructor */
function Err() {
    Builtin.call( this );
    this.init( "err" );
}

Err.prototype = new Builtin();
Err.prototype.className = "Err";

Err.prototype.invokePair = function ( args ) {
    throw new ArcError( ArcString.cast( args.car(), this ).value() );
};


// ===================================================================
// from functions/errors/OnErr.java
// ===================================================================
// Needed early: Builtin
// Needed late: Catch ArcObject

/** @constructor */
function OnErr() {
    Builtin.call( this );
    this.init( "on-err" );
}

OnErr.prototype = new Builtin();
OnErr.prototype.className = "OnErr";

OnErr.prototype.invoke = function ( vm, args ) {
    var c = new Catch( args.car(), vm.getAp() );
    c.belongsTo( this );
    vm.pushFrame( c );
    args.cdr().car().invoke( vm, ArcObject.NIL );
};


// ===================================================================
// from functions/errors/Protect.java
// ===================================================================
// Needed early: Builtin Visitor
// Needed late: Pair FinallyInvoke PopArg ArcObject

/** @constructor */
function Protect() {
    Builtin.call( this );
    this.init( "protect" );
    
    this.v_ = new Protect.Anon_v_( this );
}

Protect.prototype = new Builtin();
Protect.prototype.className = "Protect";

// PORT NOTE: This was an anonymous inner class in Java.
/** @constructor */
Protect.Anon_v_ = function ( this_Protect ) {
    this.this_Protect_ = this_Protect;
};
Protect.Anon_v_.prototype = new Visitor();
Protect.Anon_v_.prototype.acceptInstruction = function ( o ) {
    o.belongsTo( this.this_Protect_ );
};

Protect.prototype.invoke = function ( vm, args ) {
    var instructions = new Pair(
        new FinallyInvoke( args.cdr().car() ),
        new Pair(
            new PopArg( "clear up 'protect/after' return value" ),
            ArcObject.NIL ) );
    instructions.visit( this.v_ );
    vm.pushInvocation2( null, instructions );
    args.car().invoke( vm, ArcObject.NIL );
};


// ===================================================================
// from functions/eval/Apply.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcError Pair Nil

/** @constructor */
function Apply() {
    Builtin.call( this );
    this.init( "apply" );
}

Apply.prototype = new Builtin();
Apply.prototype.className = "Apply";

Apply.prototype.invokef0 = function ( vm ) {
    throw new ArcError( "apply: expects at least 2 args, got none" );
};

Apply.prototype.invokef1 = function ( vm, arg ) {
    throw new ArcError(
        "apply: expects at least 2 args, got " + arg );
};

Apply.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(arg2 instanceof Pair) )
        throw new TypeError();
    arg1.invoke( vm, arg2 );
};

Apply.prototype.invokef3 = function ( vm, arg1, arg2, arg3 ) {
    arg1.invoke( vm, new Pair( arg2, arg3 ) );
};

Apply.prototype.invoke = function ( vm, args ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var car = args.car();
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr instanceof Pair) )
        throw new TypeError();
    car.invoke( vm, this.constructApplyArgs_( cdr ) );
};

Apply.prototype.constructApplyArgs_ = function ( args ) {
    if ( args.cdr() instanceof Nil )
        return Pair.cast( args.car(), this );
    else
        return new Pair( args.car(), this.constructApplyArgs_(
            Pair.cast( args.cdr(), this ) ) );
};


// ===================================================================
// from functions/eval/Eval.java
// ===================================================================
// Needed early: Builtin
// Needed late: Compiler Pair

/** @constructor */
function Eval() {
    Builtin.call( this );
    this.init( "eval" );
}

Eval.prototype = new Builtin();
Eval.prototype.className = "Eval";

// ASYNC PORT NOTE: The synchronous Java version is below.
Eval.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new Eval.ReduceAndExecute( this ) );
    Compiler.compile( vm, args.car(), [] );
};

//// ASYNC PORT NOTE: This was the synchronous Java version.
//Eval.prototype.invoke = function ( vm, args ) {
//    var expression = args.car();
//    expression = Compiler.compile( vm, expression, [] ).reduce();
//    var i = [];
//    expression.addInstructions( i );
//    vm.pushInvocation2( null, Pair.buildFrom1( i ) );
//};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
Eval.ReduceAndExecute = function ( owner ) {
    Instruction.call( this );
    this.belongsTo( owner );
};

Eval.ReduceAndExecute.prototype = new Instruction();
Eval.ReduceAndExecute.prototype.className = "Eval.ReduceAndExecute";

Eval.ReduceAndExecute.prototype.operate = function ( vm ) {
    var expression = vm.popA().reduce();
    var i = [];
    expression.addInstructions( i );
    vm.pushInvocation2( null, Pair.buildFrom1( i ) );
};


// ===================================================================
// from functions/eval/SSExpand.java
// ===================================================================
// Needed early: Builtin
// Needed late: Symbol Evaluation ArcError Pair ArcParser
// StringInputPort ParseException Nil ArcObject

/** @constructor */
function SSExpand() {
    Builtin.call( this );
    this.init( "ssexpand" );
}

SSExpand.prototype = new Builtin();
SSExpand.prototype.className = "SSExpand";

SSExpand.prototype.invokePair = function ( args ) {
    return SSExpand.expand( Symbol.cast( args.car(), this ) );
};

SSExpand.expand = function ( s ) {
    var symbol = s.name();
    if ( Evaluation.isComposeComplement( symbol ) )
        return SSExpand.expandCompose_( symbol );
    else if ( Evaluation.isAndf( symbol ) )
        return SSExpand.expandAndf_( symbol );
    else if ( Evaluation.isListListQuoted( symbol ) )
        return SSExpand.expandExpression_( symbol );
    else
        throw new ArcError( "Unknown syntax " + symbol );
};

SSExpand.expandAndf_ = function ( symbol ) {
    var toks = [ Symbol.mkSym( "andf" ) ];
    var tokenised = SSExpand.andToks_( symbol );
    for ( var i = 0, len = tokenised.length; i < len; i++ ) {
        var s = tokenised[ i ];
        // PORT NOTE: This local variable didn't exist in Java.
        var sym = Symbol.make( s );
        // PORT NOTE: This was a cast in Java.
        if ( !(sym instanceof Symbol) )
            throw new TypeError();
        toks.push( SSExpand.readValueObject_( sym ) );
    }
    return Pair.buildFrom1( toks );
};

SSExpand.andToks_ = function ( symbol ) {
    if ( symbol.length === 0 ) {
        return [ "" ];
    } else if (
        symbol.charCodeAt( 0 ) === SSExpand.ANDF_INTRASYM_CHAR ) {
        var result = SSExpand.andToks_( symbol.substring( 1 ) );
        result[ 0 ] = SSExpand.ANDF_INTRASYM + result[ 0 ];
        return result;
    } else if ( symbol.charCodeAt( symbol.length - 1 ) ===
        SSExpand.ANDF_INTRASYM_CHAR ) {
        var result = SSExpand.andToks_(
            symbol.substring( 0, symbol.length - 1 ) );
        result[ result.length - 1 ] += SSExpand.ANDF_INTRASYM;
        return result;
    } else {
        return symbol.split( SSExpand.ANDF_INTRASYM );
    }
};

// PORT NOTE: We changed the parameters of the private
// SSExpand.expandToks( Iterator ).
SSExpand.expandToks_ = function ( list, i ) {
    var s = SSExpand.readValueObject_( list[ i++ ] );
    var sep = null;
    if ( i < list.length ) {
        sep = list[ i++ ];
        // PORT NOTE: This was a cast in Java.
        if ( !(sep instanceof Symbol) )
            throw new TypeError();
    }
    
    var next = sep === Symbol.BANG ?
        Pair.buildFrom1( [ Symbol.mkSym( "quote" ), s ] ) : s;
    if ( i < list.length )
        return Pair.buildFrom1(
            [ SSExpand.expandToks_( list, i ), next ] );
    else if ( sep !== null )
        return Pair.buildFrom1( [ Symbol.mkSym( "get" ), next ] );
    else
        return next;
};

// PORT NOTE: We renamed each private SSExpand.readValue().
// PORT TODO: This seems really different from Arc. Figure out if it
// should be. But don't correct it!
SSExpand.readValueString_ = function ( s ) {
    try {
        return ArcParser.readFirstObjectFromString( s );
    } catch ( e ) { if ( !(e instanceof ParseException) ) throw e;
        throw new ArcError(
            "Couldn't read value of symbol: " + s, e );
    }
};

SSExpand.readValueObject_ = function ( symbol ) {
    if ( symbol instanceof Nil )
        return symbol;
    // PORT NOTE: This was a cast in Java.
    if ( !(symbol instanceof Symbol) )
        throw new TypeError();
    return SSExpand.readValueString_( symbol.name() );
};

SSExpand.expandExpression_ = function ( symbol ) {
    // PORT NOTE: The original version uses java.util.StringTokenizer.
    var tokens = symbol.replace( /#/g, "#h" ).replace( /%/g, "#p" ).
        replace( /([.!])/g, "%$1%" ).split( /%+/ );
    var list = [];
    var wasSep = false;
    for ( var i = 0, len = tokens.length; i < len; i++ ) {
        if ( tokens[ i ] === "" ) continue;
        var sym = Symbol.make(
            tokens[ i ].replace( /#p/g, "%" ).replace( /#h/g, "#" ) );
        if ( SSExpand.isSpecialListSyntax_( sym ) ) {
            if ( wasSep )
                throw new ArcError( "Bad syntax " + symbol );
            else
                wasSep = true;
        } else {
            wasSep = false;
        }
        list.unshift( sym );
    }
    if ( wasSep )
        list.unshift( Symbol.mkSym( "#<eof>" ) );
    
    return SSExpand.expandToks_( list, 0 );
};

SSExpand.isSpecialListSyntax_ = function ( sym ) {
    return sym === Symbol.DOT || sym === Symbol.BANG;
};

SSExpand.expandCompose_ = function ( symbol ) {
    var elements = symbol.split( ":" );
    if ( elements.length === 1 )
        return SSExpand.possiblyComplement_( elements[ 0 ] );
    var list = [ Symbol.mkSym( "compose" ) ];
    for ( var i = 0, len = elements.length; i < len; i++ )
        list.push( SSExpand.possiblyComplement_( elements[ i ] ) );
    return Pair.buildFrom2( list, ArcObject.NIL );
};

SSExpand.possiblyComplement_ = function ( element ) {
    return /^~/.test( element ) ?
        Pair.buildFrom1( [ Symbol.mkSym( "complement" ),
            SSExpand.readValueString_( element.substring( 1 ) ) ] ) :
        SSExpand.readValueString_( element );
};

SSExpand.ANDF_INTRASYM = "&";
SSExpand.ANDF_INTRASYM_CHAR = "&".charCodeAt( 0 );


// ===================================================================
// from functions/eval/SSyntax.java
// ===================================================================
// Needed early: Builtin
// Needed late: Symbol ArcObject Evaluation

/** @constructor */
function SSyntax() {
    Builtin.call( this );
    this.init( "ssyntax" );
}

SSyntax.prototype = new Builtin();
SSyntax.prototype.className = "SSyntax";

SSyntax.prototype.invokePair = function ( args ) {
    return args.car() instanceof Symbol &&
        SSyntax.isSpecial( args.car() ) ?
        ArcObject.T : ArcObject.NIL;
};

SSyntax.isSpecial = function ( symbol ) {
    return (Evaluation.isComposeComplement( symbol.name() )
        || Evaluation.isAndf( symbol.name() )
        || Evaluation.isListListQuoted( symbol.name() ));
};


// ===================================================================
// from functions/java/JavaDebug.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function JavaDebug() {
    Builtin.call( this );
    this.init( "java-debug" );
}

JavaDebug.prototype = new Builtin();
JavaDebug.prototype.className = "JavaDebug";

JavaDebug.prototype.invokePair = function ( args ) {
    return args.car();
};


// ===================================================================
// from functions/java/JavaInvoke.java
// ===================================================================
// Needed early: Builtin
// Needed late: JsObject Symbol Pair

/** @constructor */
function JavaInvoke() {
    Builtin.call( this );
    this.init( "java-invoke" );
}

JavaInvoke.prototype = new Builtin();
JavaInvoke.prototype.className = "JavaInvoke";

JavaInvoke.prototype.invokePair = function ( args ) {
    var target = JsObject.cast( args.car(), this );
    var methodName = Symbol.cast( args.cdr().car(), this ).name();
    // PORT NOTE: This local variable didn't exist in Java.
    var jsArgs = args.cdr().cdr().car();
    // PORT NOTE: This was a cast in Java.
    if ( !(jsArgs instanceof Pair) )
        throw new TypeError();
    return JsObject.wrap( target.invokeJs( methodName, jsArgs ) );
};


// ===================================================================
// from functions/lists/Car.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function Car() {
    Builtin.call( this );
    this.init( "car" );
}

Car.prototype = new Builtin();
Car.prototype.className = "Car";

Car.prototype.invokef1 = function ( vm, arg ) {
    vm.pushA( arg.car() );
};

Car.prototype.invokePair = function ( args ) {
    Builtin.checkExactArgsCount( args, 1, this.className );
    return args.car().car();
};


// ===================================================================
// from functions/lists/Cdr.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function Cdr() {
    Builtin.call( this );
    this.init( "cdr" );
}

Cdr.prototype = new Builtin();
Cdr.prototype.className = "Cdr";

Cdr.prototype.invokef1 = function ( vm, arg ) {
    vm.pushA( arg.cdr() );
};

Cdr.prototype.invokePair = function ( args ) {
    Builtin.checkExactArgsCount( args, 1, this.className );
    return args.car().cdr();
};


// ===================================================================
// from functions/lists/Cons.java
// ===================================================================
// Needed early: Builtin
// Needed late: Pair

/** @constructor */
function Cons() {
    Builtin.call( this );
    this.init( "cons" );
}

Cons.prototype = new Builtin();
Cons.prototype.className = "Cons";

Cons.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    vm.pushA( new Pair( arg1, arg2 ) );
};

Cons.prototype.invokePair = function ( args ) {
    Builtin.checkExactArgsCount( args, 2, this.className );
    return new Pair( args.car(), args.cdr().car() );
};


// ===================================================================
// from functions/lists/Len.java
// ===================================================================
// Needed early: Builtin
// Needed late: Rational

/** @constructor */
function Len() {
    Builtin.call( this );
    this.init( "len" );
}

Len.prototype = new Builtin();
Len.prototype.className = "Len";

Len.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    return new Rational( args.car().len(), 1 );
};


// ===================================================================
// from functions/lists/NewString.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber ArcCharacter Nil ArcString

/** @constructor */
function NewString() {
    Builtin.call( this );
    this.init( "newstring" );
}

NewString.prototype = new Builtin();
NewString.prototype.className = "NewString";

NewString.prototype.invokePair = function ( args ) {
    var n = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(n instanceof ArcNumber) )
        throw new TypeError();
    var c = ArcCharacter.NULL;
    if ( !(args.cdr() instanceof Nil) ) {
        c = args.cdr().car();
        // PORT NOTE: This was a cast in Java.
        if ( !(c instanceof ArcCharacter) )
            throw new TypeError();
    }
    var b = [];
    for ( var i = 0; i < n.toInt(); i++ )
        b.push( c.value() );
    return ArcString.make( b.join( "" ) );
};


// ===================================================================
// from functions/lists/Scar.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function Scar() {
    Builtin.call( this );
    this.init( "scar" );
}

Scar.prototype = new Builtin();
Scar.prototype.className = "Scar";

Scar.prototype.invokef2 = function ( args, arg1, arg2 ) {
    vm.pushA( arg1.scar( arg2 ) );
};

Scar.prototype.invokePair = function ( args ) {
    return args.car().scar( args.cdr().car() );
};


// ===================================================================
// from functions/lists/Scdr.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function Scdr() {
    Builtin.call( this );
    this.init( "scdr" );
}

Scdr.prototype = new Builtin();
Scdr.prototype.className = "Scdr";

Scdr.prototype.invokePair = function ( args ) {
    var target = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(target instanceof Pair) )
        throw new TypeError();
    var newValue = args.cdr().car();
    target.setCdr( newValue );
    return newValue;
};


// ===================================================================
// from functions/maths/Acos.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Real

/** @constructor */
function Acos() {
    Builtin.call( this );
    this.init( "acos" );
}

Acos.prototype = new Builtin();
Acos.prototype.className = "Acos";

Acos.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var result =
        Math.acos( ArcNumber.cast( args.car(), this ).toDouble() );
    return new Real( result );
};


// ===================================================================
// from functions/maths/Add.java
// ===================================================================
// Needed early: Builtin
// Needed late: Rational Nil Maths

/** @constructor */
function Add() {
    Builtin.call( this );
    this.init( "+" );
}

Add.prototype = new Builtin();
Add.prototype.className = "Add";

Add.prototype.invokef0 = function ( vm ) {
    vm.pushA( Rational.ZERO );
};

Add.prototype.invokef1 = function ( vm, arg ) {
    vm.pushA( arg );
};

Add.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    vm.pushA( arg1.add( arg2 ) );
};

Add.prototype.invokef3 = function ( vm, arg1, arg2, arg3 ) {
    vm.pushA( arg1.add( arg2 ).add( arg3 ) );
};

Add.prototype.invokePair = function ( args ) {
    if ( args instanceof Nil )
        return Rational.ZERO;
    var result = args.car();
    var rest = args.cdr();
    while ( !(rest instanceof Nil) ) {
        result = result.add( rest.car() );
        rest = rest.cdr();
    }
    return result;
};

Add.sum = function ( args ) {
    return Maths.precision( args ).sum( args );
};


// ===================================================================
// from functions/maths/Asin.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Real

/** @constructor */
function Asin() {
    Builtin.call( this );
    this.init( "asin" );
}

Asin.prototype = new Builtin();
Asin.prototype.className = "Asin";

Asin.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var result =
        Math.asin( ArcNumber.cast( args.car(), this ).toDouble() );
    return new Real( result );
};


// ===================================================================
// from functions/maths/Atan.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Real

/** @constructor */
function Atan() {
    Builtin.call( this );
    this.init( "atan" );
}

Atan.prototype = new Builtin();
Atan.prototype.className = "Atan";

Atan.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var result =
        Math.atan( ArcNumber.cast( args.car(), this ).toDouble() );
    return new Real( result );
};


// ===================================================================
// from functions/maths/ComplexParts.java
// ===================================================================
// Needed early: Builtin
// Needed late: Complex Pair

/** @constructor */
function ComplexParts() {
    Builtin.call( this );
    this.init( "complex-parts" );
}

ComplexParts.prototype = new Builtin();
ComplexParts.prototype.className = "ComplexParts";

ComplexParts.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var x = Complex.cast( args.car(), this );
    return Pair.buildFrom1( [ x.realPart(), x.imaginaryPart() ] );
};


// ===================================================================
// from functions/maths/Cosine.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Real

/** @constructor */
function Cosine() {
    Builtin.call( this );
    this.init( "cos" );
}

Cosine.prototype = new Builtin();
Cosine.prototype.className = "Cosine";

Cosine.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var result =
        Math.cos( ArcNumber.cast( args.car(), this ).toDouble() );
    return new Real( result );
};


// ===================================================================
// from functions/maths/Divide.java
// ===================================================================
// Needed early: Builtin
// Needed late: Nil ArcError Maths

/** @constructor */
function Divide() {
    Builtin.call( this );
    this.init( "/" );
}

Divide.prototype = new Builtin();
Divide.prototype.className = "Divide";

Divide.prototype.invokePair = function ( args ) {
    if ( args instanceof Nil )
        throw new ArcError( "Function `/` expected at least 1 arg" );
    
    return Maths.precision( args ).divide( args );
};


// ===================================================================
// from functions/maths/Expt.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Complex Real

/** @constructor */
function Expt() {
    Builtin.call( this );
    this.init( "expt" );
}

Expt.prototype = new Builtin();
Expt.prototype.className = "Expt";

Expt.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 2 );
    var base = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(base instanceof ArcNumber) )
        throw new TypeError();
    var exp = args.cdr().car();
    // PORT NOTE: This was a cast in Java.
    if ( !(exp instanceof ArcNumber) )
        throw new TypeError();
    if ( base instanceof Complex ) {
        return base.expt( exp );
    } else if ( exp instanceof Complex ) {
        var complexBase = new Complex( base.toDouble(), 0 );
        return complexBase.expt( exp );
    } else {
        var value = base.toDouble();
        var exponent = exp.toDouble();
        return new Real( Math.pow( value, exponent ) );
    }
};


// ===================================================================
// from functions/maths/Logarithm.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Complex Real

/** @constructor */
function Logarithm() {
    Builtin.call( this );
    this.init( "log" );
}

Logarithm.prototype = new Builtin();
Logarithm.prototype.className = "Logarithm";

Logarithm.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var arg = ArcNumber.cast( args.car(), this );
    if ( arg instanceof Complex )
        return arg.log();
    else
        return new Real( Math.log( arg.toDouble() ) );
};


// ===================================================================
// from functions/maths/MakeComplex.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Complex

/** @constructor */
function MakeComplex() {
    Builtin.call( this );
    this.init( "make-complex" );
}

MakeComplex.prototype = new Builtin();
MakeComplex.prototype.className = "MakeComplex";

// TODO: this can be implemented in arc
// (def make-complex (real image) (+ real (* 0+i imag)))
MakeComplex.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 2 );
    var a = ArcNumber.cast( args.car(), this );
    var b = ArcNumber.cast( args.cdr().car(), this );
    return new Complex( a.toDouble(), b.toDouble() );
};


// ===================================================================
// from functions/maths/Maths.java
// ===================================================================
// Needed early: Builtin
// Needed late: Nil Real Complex Pair Nil ArcNumber Rational

// PORT NOTE: This was originally abstract.
var Maths = {};

// PORT TODO: Find an equivalent for this Java:
// public static final Random random = new Random();
Maths.random = {};
Maths.random.nextDouble = function () {
    return Math.rand();
};
Maths.random.nextLong = function () {
    while ( true ) {
        var result = Math.floor( Math.rand() * 0x0020000000000000 );
        if ( result < 0x0020000000000000 )
            return result;
    }
};

Maths.precision = function ( args ) {
    if ( args instanceof Nil ) {
        return Maths.rationalOps_;
    } else if ( args.car() instanceof Real ) {
        return Maths.doubleOps_;
    } else if ( args.car() instanceof Complex ) {
        return complexOps;
    } else {
        // PORT NOTE: This local variable didn't exist in Java.
        var cdr = args.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(cdr instanceof Pair) )
            throw new TypeError();
        return Maths.precision( args.cdr() );
    }
}

// PORT NOTE: This was originally an interface.
/** @constructor */
Maths.MathsOps = function () {
};

// PORT NOTE: This was originally an interface method.
Maths.MathsOps.prototype.sum = void 0;

// PORT NOTE: This was originally an interface method.
Maths.MathsOps.prototype.multiply = void 0;

// PORT NOTE: This was originally an interface method.
Maths.MathsOps.prototype.divide = void 0;

// PORT NOTE: This was an anonymous class in Java.
/** @constructor */
Maths.Anon_doubleOps_ = function () {
    Maths.MathsOps.call( this );
};

Maths.Anon_doubleOps_.prototype = new Maths.MathsOps();

Maths.Anon_doubleOps_.prototype.sum = function ( args ) {
    return Real.make( this.sumNumbers_( args ) );
};

Maths.Anon_doubleOps_.prototype.sumNumbers_ = function ( args ) {
    if ( args instanceof Nil )
        return 0;
    // PORT NOTE: This local variable didn't exist in Java.
    var car = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(car instanceof ArcNumber) )
        throw new TypeError();
    // PORT NOTE: This local variable didn't exist in Java.
    var carDouble = car.toDouble();
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr instanceof Pair) )
        throw new TypeError();
    return carDouble + this.sumNumbers_( cdr );
};

Maths.Anon_doubleOps_.prototype.multiply = function ( args ) {
    return Real.make( this.multiplyDouble_( args ) );
};

Maths.Anon_doubleOps_.prototype.divide = function ( args ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr1 = args.cdr();
    // PORT NOTE: This local variable didn't exist in Java.
    var car = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(car instanceof ArcNumber) )
        throw new TypeError();
    var first =
        cdr1 instanceof Nil ? 1 / car.toDouble() : car.toDouble();
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr2 = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr2 instanceof Pair) )
        throw new TypeError();
    return Real.make( first / this.multiplyDouble_( cdr2 ) );
};

Maths.Anon_doubleOps_.prototype.multiplyDouble_ = function ( args ) {
    if ( args instanceof Nil )
        return 1;
    var left = args.car();
    
    // PORT NOTE: This was a cast in Java.
    if ( !(left instanceof ArcNumber) )
        throw new TypeError();
    var first = left.toDouble();
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr instanceof Pair) )
        throw new TypeError();
    var rest = this.multiplyDouble_( cdr );
    return first * rest;
};

Maths.doubleOps_ = new Maths.Anon_doubleOps_();

// PORT NOTE: This was an anonymous class in Java.
/** @constructor */
Maths.Anon_complexOps_ = function () {
    Maths.MathsOps.call( this );
};

Maths.Anon_complexOps_.prototype = new Maths.MathsOps();

Maths.Anon_complexOps_.prototype.sum = function ( args ) {
    if ( args instanceof Nil )
        return Complex.ZERO;
    // PORT NOTE: This local variable didn't exist in Java.
    var first = Complex.make( args.car() );
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr instanceof Pair) )
        throw new TypeError();
    return first.plusComplex( this.sum( cdr ) );
};

Maths.Anon_complexOps_.prototype.multiply = function ( args ) {
    if ( args instanceof Nil )
        return new Complex( 1, 0 );
    
    // PORT NOTE: This local variable didn't exist in Java.
    var first = Complex.make( args.car() );
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr instanceof Pair) )
        throw new TypeError();
    return first.timesComplex( this.multiply( cdr ) );
};

// PORT TODO: See if this inconsistency with the other MathsOps
// (the fact that a one-length list isn't inverted) is a bug. But
// don't fix it!
Maths.Anon_complexOps_.prototype.divide = function ( args ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var first = Complex.make( args.car() );
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr instanceof Pair) )
        throw new TypeError();
    return first.timesComplex( this.multiply( cdr ).inverse() );
};

Maths.complexOps_ = new Maths.Anon_complexOps_();

// PORT NOTE: This was an anonymous class in Java.
/** @constructor */
Maths.Anon_rationalOps_ = function () {
    Maths.MathsOps.call( this );
};

Maths.Anon_rationalOps_.prototype = new Maths.MathsOps();

Maths.Anon_rationalOps_.prototype.sum = function ( args ) {
    if ( args instanceof Nil ) {
        return Rational.ZERO;
    } else {
        var r = args.car();
        // PORT NOTE: This was a cast in Java.
        if ( !(r instanceof Rational) )
            throw new TypeError();
        // PORT NOTE: This local variable didn't exist in Java.
        var cdr = args.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(cdr instanceof Pair) )
            throw new TypeError();
        return r.plus( this.sum( cdr ) );
    }
};

Maths.Anon_rationalOps_.prototype.multiply = function ( args ) {
    if ( args instanceof Nil )
        return Rational.ONE;
    var left = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(left instanceof Rational) )
        throw new TypeError();
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr instanceof Pair) )
        throw new TypeError();
    return left.times( this.multiply( cdr ) );
};

Maths.Anon_rationalOps_.prototype.divide = function ( args ) {
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr1 = args.cdr();
    // PORT NOTE: This local variable didn't exist in Java.
    var left = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(left instanceof Rational) )
        throw new TypeError();
    var first = cdr1 instanceof Nil ? left.invert() : left;
    // PORT NOTE: This local variable didn't exist in Java.
    var cdr2 = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(cdr2 instanceof Pair) )
        throw new TypeError();
    return first.times( this.multiply( cdr2 ).invert() );
};

Maths.rationalOps_ = new Maths.Anon_rationalOps_();


// ===================================================================
// from functions/maths/Mod.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber

/** @constructor */
function Mod() {
    Builtin.call( this );
    this.init( "mod" );
}

Mod.prototype = new Builtin();
Mod.prototype.className = "Mod";

Mod.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(arg1 instanceof ArcNumber) )
        throw new TypeError();
    // PORT NOTE: This was a cast in Java.
    if ( !(arg2 instanceof ArcNumber) )
        throw new TypeError();
    vm.pushA( arg1.mod( arg2 ) );
};

Mod.prototype.invoke = function ( vm, args ) {
    Builtin.checkMaxArgCount( args, this.className, 2 );
    this.invokef2( vm, args.car(), args.cdr().car() );
};


// ===================================================================
// from functions/maths/Multiply.java
// ===================================================================
// Needed early: Builtin
// Needed late: Rational Nil

/** @constructor */
function Multiply() {
    Builtin.call( this );
    this.init( "*" );
}

Multiply.prototype = new Builtin();
Multiply.prototype.className = "Multiply";

Multiply.prototype.invokef0 = function ( vm ) {
    vm.pushA( Rational.ONE );
};

Multiply.prototype.invokef1 = function ( vm, arg ) {
    vm.pushA( arg );
};

Multiply.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    vm.pushA( arg1.multiply( arg2 ) );
};

Multiply.prototype.invokef3 = function ( vm, arg1, arg2, arg3 ) {
    vm.pushA( arg1.multiply( arg2 ).multiply( arg3 ) );
};

Multiply.prototype.invokePair = function ( args ) {
    if ( args instanceof Nil )
        return Rational.ONE;
    var result = args.car();
    var rest = args.cdr();
    while ( !(rest instanceof Nil) ) {
        result = result.multiply( rest.car() );
        rest = rest.cdr();
    }
    return result;
};


// ===================================================================
// from functions/maths/PolarCoordinates.java
// ===================================================================
// Needed early: Builtin
// Needed late: Complex Pair Real

/** @constructor */
function PolarCoordinates() {
    Builtin.call( this );
    this.init( "polar-coordinates" );
}

PolarCoordinates.prototype = new Builtin();
PolarCoordinates.prototype.className = "PolarCoordinates";

PolarCoordinates.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var x = Complex.cast( args.car(), this );
    return Pair.buildFrom1(
        [ new Real( x.radius() ), new Real( x.theta() ) ] );
};


// ===================================================================
// from functions/maths/Quotient.java
// ===================================================================
// Needed early: Builtin
// Needed late: Rational ArcError

/** @constructor */
function Quotient() {
    Builtin.call( this );
    this.init( "quotient" );
}

Quotient.prototype = new Builtin();
Quotient.prototype.className = "Quotient";

Quotient.prototype.invokePair = function ( args ) {
    Builtin.checkExactArgsCount( args, 2, this.className );
    var top = Rational.cast( args.car(), this );
    var bottom = Rational.cast( args.cdr().car(), this );
    if ( !(top.isInteger() && bottom.isInteger()) )
        throw new ArcError(
            "Type error: " + this + " : expected integer, got " +
            args );
    // PORT NOTE: In Java, this was just integer division.
    var result = top.toInt() / bottom.toInt();
    return Rational.make1(
        result < 0 ? Math.ceil( result ) : Math.floor( result ) );
};


// ===================================================================
// from functions/maths/Rand.java
// ===================================================================
// Needed early: Builtin
// Needed late: Rational ArcError

/** @constructor */
function Rand() {
    Builtin.call( this );
    this.init( "rand" );
}

Rand.prototype = new Builtin();
Rand.prototype.className = "Rand";

Rand.prototype.invokePair = function ( args ) {
    if ( args instanceof Nil ) {
        return new Real( Maths.random.nextDouble() );
    } else {
        var r = args.car();
        // PORT NOTE: This was a cast in Java.
        if ( !(r instanceof ArcNumber) )
            throw new TypeError();
        if ( !r.isInteger() )
            throw new ArcError(
                "rand: requires one exact integer argument, got " +
                args );
        // PORT TODO: Fix this and the Java version so that they're
        // less biased.
        return new Rational(
            Math.abs( Maths.random.nextLong() % r.toInt() ), 1 );
    }
};


// ===================================================================
// from functions/maths/Sine.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Real

/** @constructor */
function Sine() {
    Builtin.call( this );
    this.init( "sin" );
}

Sine.prototype = new Builtin();
Sine.prototype.className = "Sine";

Sine.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var result =
        Math.sin( ArcNumber.cast( args.car(), this ).toDouble() );
    return new Real( result );
};


// ===================================================================
// from functions/maths/Sqrt.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function Sqrt() {
    Builtin.call( this );
    this.init( "sqrt" );
}

Sqrt.prototype = new Builtin();
Sqrt.prototype.className = "Sqrt";

Sqrt.prototype.invokef1 = function ( vm, arg ) {
    vm.pushA( arg.sqrt() );
};

Sqrt.prototype.invoke = function ( vm, args ) {
    Builtin.checkExactArgsCount( args, 1, this.className );
    this.invokef1( vm, args.car() );
};


// ===================================================================
// from functions/maths/Subtract.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcError ArcNumber Pair Nil Add

/** @constructor */
function Subtract() {
    Builtin.call( this );
    this.init( "-" );
}

Subtract.prototype = new Builtin();
Subtract.prototype.className = "Subtract";

Subtract.prototype.invokef1 = function ( vm ) {
    throw new ArcError( "- : expected at least 1 arg" );
};

Subtract.prototype.invokef1 = function ( vm, arg ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(arg instanceof ArcNumber) )
        throw new TypeError();
    vm.pushA( arg.negate() );
};

Subtract.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(arg2 instanceof ArcNumber) )
        throw new TypeError();
    vm.pushA( arg1.add( arg2.negate() ) );
};

Subtract.prototype.invokePair = function ( args ) {
    if ( args instanceof Nil )
        throw new ArcError( "Function `-` expected at least 1 arg" );
    
    // PORT NOTE: This local variable didn't exist in Java.
    var car = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(car instanceof ArcNumber) )
        throw new TypeError();
    var first = car.negate();
    var rest = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(rest instanceof Pair) )
        throw new TypeError();
    
    if ( rest instanceof Nil )
        return first;
    return Add.sum( new Pair( first, rest ) ).negate();
};


// ===================================================================
// from functions/maths/Tangent.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Real

/** @constructor */
function Tangent() {
    Builtin.call( this );
    this.init( "tan" );
}

Tangent.prototype = new Builtin();
Tangent.prototype.className = "Tangent";

Tangent.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var result =
        Math.tan( ArcNumber.cast( args.car(), this ).toDouble() );
    return new Real( result );
};


// ===================================================================
// from functions/maths/Trunc.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Rational

/** @constructor */
function Trunc() {
    Builtin.call( this );
    this.init( "trunc" );
}

Trunc.prototype = new Builtin();
Trunc.prototype.className = "Trunc";

// PORT TODO: Note that (trunc -1.1) should be -1. This is a bug. But
// don't fix it!
Trunc.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    // PORT NOTE: This local variable didn't exist in Java.
    var car = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(car instanceof ArcNumber) )
        throw new TypeError();
    var value = car.toDouble();
    return new Rational( Math.floor( value ), 1 );
};


// ===================================================================
// from functions/predicates/Bound.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcError Symbol Truth

/** @constructor */
function Bound() {
    Builtin.call( this );
    this.init( "bound" );
}

Bound.prototype = new Builtin();
Bound.prototype.className = "Bound";

Bound.prototype.invokef0 = function ( vm ) {
    throw new ArcError( "bound: requires 1 arg" );
};

Bound.prototype.invokef1 = function ( vm, arg ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(arg instanceof Symbol) )
        throw new TypeError();
    vm.pushA( Truth.valueOf( arg.bound() ) );
};

Bound.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var sym = Symbol.cast( args.car(), this );
    return Truth.valueOf( sym.bound() );
};


// ===================================================================
// from functions/predicates/Exact.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcNumber Truth Rational

/** @constructor */
function Exact() {
    Builtin.call( this );
    this.init( "exact" );
}

Exact.prototype = new Builtin();
Exact.prototype.className = "Exact";

Exact.prototype.invokePair = function ( args ) {
    var arg = ArcNumber.cast( args.car(), this );
    return Truth.valueOf(
        arg instanceof Rational && arg.isInteger() );
};


// ===================================================================
// from functions/predicates/GreaterThan.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcObject Pair Nil

/** @constructor */
function GreaterThan() {
    Builtin.call( this );
    this.init( ">" );
}

GreaterThan.prototype = new Builtin();
GreaterThan.prototype.className = "GreaterThan";

GreaterThan.prototype.invokef0 = function ( vm ) {
    vm.pushA( ArcObject.T );
};

GreaterThan.prototype.invokef1 = function ( vm, arg1 ) {
    vm.pushA( ArcObject.T );
};

GreaterThan.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    vm.pushA(
        arg1.compareTo( arg2 ) <= 0 ? ArcObject.NIL : ArcObject.T );
};

GreaterThan.prototype.invokePair = function ( args ) {
    if ( args.len() < 2 )
        return ArcObject.T;
    var left = args.car();
    var others = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(others instanceof Pair) )
        throw new TypeError();
    while ( !(others instanceof Nil) ) {
        var right = others.car();
        var comparison = left.compareTo( right );
        if ( comparison <= 0 )
            return ArcObject.NIL;
        left = right;
        others = others.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(others instanceof Pair) )
            throw new TypeError();
    }
    return ArcObject.T;
};


// ===================================================================
// from functions/predicates/Is.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcObject Truth

/** @constructor */
function Is() {
    Builtin.call( this );
    this.init( "is" );
}

Is.prototype = new Builtin();
Is.prototype.className = "Is";

Is.prototype.invokef0 = function ( vm ) {
    vm.pushA( ArcObject.T );
};

Is.prototype.invokef1 = function ( vm, arg ) {
    vm.pushA( ArcObject.T );
};

Is.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    vm.pushA( Truth.valueOf( arg1.isSame( arg2 ) ) );
};

Is.prototype.invokePair = function ( args ) {
    return this.checkIs_( args.car(), args.cdr() );
};

Is.prototype.checkIs_ = function ( test, args ) {
    if ( args instanceof Nil )
        return ArcObject.T;
    
    if ( !test.isSame( args.car() ) )
        return ArcObject.NIL;
    
    return this.checkIs_( test, args.cdr() );
};


// ===================================================================
// from functions/predicates/LessThan.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcObject Pair Nil

/** @constructor */
function LessThan() {
    Builtin.call( this );
    this.init( "<" );
}

LessThan.prototype = new Builtin();
LessThan.prototype.className = "LessThan";

LessThan.prototype.invokef0 = function ( vm ) {
    vm.pushA( ArcObject.T );
};

LessThan.prototype.invokef1 = function ( vm, arg1 ) {
    vm.pushA( ArcObject.T );
};

LessThan.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    vm.pushA(
        arg1.compareTo( arg2 ) < 0 ? ArcObject.T : ArcObject.NIL );
};

LessThan.prototype.invokePair = function ( args ) {
    var left = args.car();
    var others = args.cdr();
    // PORT NOTE: This was a cast in Java.
    if ( !(others instanceof Pair) )
        throw new TypeError();
    while ( !(others instanceof Nil) ) {
        var right = others.car();
        var comparison = left.compareTo( right );
        if ( comparison >= 0 )
            return ArcObject.NIL;
        left = right;
        others = others.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(others instanceof Pair) )
            throw new TypeError();
    }
    return ArcObject.T;
};


// ===================================================================
// from functions/rainbow/RainbowDebug.java
// ===================================================================
// Needed early: Builtin
// Needed late: VMInterceptor Symbol

/** @constructor */
function RainbowDebug() {
    Builtin.call( this );
    this.init( "rainbow-debug" );
}

RainbowDebug.prototype = new Builtin();
RainbowDebug.prototype.className = "RainbowDebug";

RainbowDebug.prototype.invoke = function ( vm, args ) {
    vm.setInterceptor( VMInterceptor.DEBUG );
    vm.pushA( Symbol.mkSym( this.name_ ) );
};


// ===================================================================
// from functions/rainbow/RainbowProfile.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcObject VM VMInterceptor

/** @constructor */
function RainbowProfile() {
    Builtin.call( this );
    this.init( "rainbow-profile" );
}

RainbowProfile.prototype = new Builtin();
RainbowProfile.prototype.className = "RainbowProfile";

RainbowProfile.prototype.invokef0 = function ( vm ) {
    this.profile( vm );
    vm.pushA( ArcObject.NIL );
};

RainbowProfile.prototype.invokef1 = function ( vm, arg ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(arg instanceof VM) )
        throw new TypeError();
    this.profile( arg );
    vm.pushA( ArcObject.NIL );
};

RainbowProfile.prototype.profile = function ( target ) {
    target.setInterceptor( VMInterceptor.PROFILE );
};


// ===================================================================
// from functions/rainbow/RainbowProfileReport.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcObject VM VMInterceptor

/** @constructor */
function RainbowProfileReport() {
    Builtin.call( this );
    this.init( "rainbow-profile-report" );
}

RainbowProfileReport.prototype = new Builtin();
RainbowProfileReport.prototype.className = "RainbowProfileReport";

RainbowProfileReport.prototype.invokef0 = function ( vm ) {
    vm.pushA( this.report( vm ) );
};

RainbowProfileReport.prototype.invokef1 = function ( vm, arg ) {
    // PORT NOTE: This was a cast in Java.
    if ( !(arg instanceof VM) )
        throw new TypeError();
    vm.pushA( this.report( vm ) );
};

RainbowProfileReport.prototype.createReport_ = function ( target ) {
    var report = new Hash();
    report.sref(
        this.createInvocationReport_(
            target.profileData.invocationProfile ),
        Symbol.mkSym( "invocation-profile" ) );
    report.sref(
        this.createInstructionReport_(
            target.profileData.instructionProfile ),
        Symbol.mkSym( "instruction-profile" ) );
    return report;
};

// PORT NOTE: We renamed the private .createReport( Map ).
RainbowProfileReport.prototype.createInstructionReport_ = function (
    profile ) {
    
    var result = ArcObject.NIL;
    if ( profile !== null ) {
        // PORT NOTE: The Java version used a TreeSet and a nested
        // class here.
        var sorted = [];
        for ( var k in profile )
            sorted.push( { k: k, v: profile[ k ] } );
        sorted.sort( function ( o1, o2 ) {
            var comparison = o1.v.compareTo( o2.v );
            if ( comparison === 0 )
                comparison = o2.k.localeCompare( o1.k );
            return comparison;
        } );
        for ( var i = 0, len = sorted.length; i < len; i++ ) {
            var e = sorted[ i ];
            var thisResult = new Pair(
                Rational.make1( e.v ), ArcString.make( e.k ) );
            result = new Pair( thisResult, result );
        }
    }
    return result;
};

RainbowProfileReport.prototype.createInvocationReport_ = function (
    profile ) {
    
    var result = ArcObject.NIL;
    if ( profile !== null ) {
        // PORT NOTE: The Java version used a TreeSet and a nested
        // class here.
        var sorted = [];
        for ( var k in profile ) {
            var fp = profile[ k ];
            if ( fp.parent === null )
                sorted.push( fp );
        }
        sorted.sort( function ( o1, o2 ) {
            var c = o1.totalNanoTime < o2.totalNanoTime ? -1 :
                o1.totalNanoTime === o2.totalNanoTime ? 0 : 1;
            if ( c === 0 )
                c = o1.nanoTime < o2.nanoTime ? -1 :
                    o1.nanoTime === o2.nanoTime ? 0 : 1;
            if ( c === 0 )
                c = o1.name.localeCompare( o2.name );
            if ( c === 0 )
                throw new ArcError(
                    "can't compare " + o1.name + " with " + o2.name );
            return c;
        } );
        for ( var i = 0, len = sorted.length; i < len; i++ ) {
            var e = sorted[ i ];
            result = new Pair( e.toPair(), result );
        }
    }
    return result;
};


// ===================================================================
// from functions/system/CurrentGcMilliseconds.java
// ===================================================================
// Needed early: Builtin
// Needed late: Rational

/** @constructor */
function CurrentGcMilliseconds() {
    Builtin.call( this );
    this.init( "current-gc-milliseconds" );
}

CurrentGcMilliseconds.prototype = new Builtin();
CurrentGcMilliseconds.prototype.className = "CurrentGcMilliseconds";

CurrentGcMilliseconds.prototype.invoke = function ( vm, args ) {
    vm.pushA( Rational.make1( 1 ) );
};


// ===================================================================
// from functions/system/CurrentProcessMilliseconds.java
// ===================================================================
// Needed early: Builtin
// Needed late: Rational

/** @constructor */
function CurrentProcessMilliseconds() {
    Builtin.call( this );
    this.init( "current-process-milliseconds" );
}

CurrentProcessMilliseconds.prototype = new Builtin();
CurrentProcessMilliseconds.prototype.className =
    "CurrentProcessMilliseconds";

CurrentProcessMilliseconds.prototype.invoke = function ( vm, args ) {
    vm.pushA( Rational.make1( 1 ) );
};


// ===================================================================
// from functions/system/Declare.java
// ===================================================================
// Needed early: Builtin Symbol
// Needed late: Compiler ArcObject

/** @constructor */
function Declare() {
    Builtin.call( this );
    this.init( "declare" );
}

Declare.prototype = new Builtin();
Declare.prototype.className = "Declare";

Declare.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    if ( arg1 === Declare.atstrings ) {
        var prev = Compiler.atstrings;
        Compiler.atstrings = arg2;
        vm.pushA( prev );
    } else {
        vm.pushA( ArcObject.NIL );
    }
};

Declare.prototype.invoke = function ( vm, args ) {
    this.invokef2( vm, args.car(), args.cdr().car() );
};

Declare.atstrings = Symbol.mkSym( "atstrings" );


// ===================================================================
// from functions/system/MSec.java
// ===================================================================
// Needed early: Builtin
// Needed late: Rational

/** @constructor */
function MSec() {
    Builtin.call( this );
    this.init( "msec" );
}

MSec.prototype = new Builtin();
MSec.prototype.className = "MSec";

MSec.prototype.invokePair = function ( args ) {
    return Rational.make1( new Date().getTime() );
};


// ===================================================================
// from functions/system/Seconds.java
// ===================================================================
// Needed early: Builtin
// Needed late: Rational

/** @constructor */
function Seconds() {
    Builtin.call( this );
    this.init( "seconds" );
}

Seconds.prototype = new Builtin();
Seconds.prototype.className = "Seconds";

Seconds.prototype.invokePair = function ( args ) {
    // PORT NOTE: In Java, this was just integer division.
    var result = new Date().getTime() / 1000;
    return Rational.make1(
        result < 0 ? Math.ceil( result ) : Math.floor( result ) );
};


// ===================================================================
// from functions/tables/MapTable.java
// ===================================================================
// Needed early: Builtin
// Needed late: Hash TableMapper

/** @constructor */
function MapTable() {
    Builtin.call( this );
    this.init( "maptable" );
}

MapTable.prototype = new Builtin();
MapTable.prototype.className = "MapTable";

MapTable.prototype.invokef2 = function ( vm, f, hash ) {
    vm.pushA( hash );
    // PORT NOTE: This was a cast in Java.
    if ( !(hash instanceof Hash) )
        throw new TypeError();
    vm.pushA( hash.toList() );
    var i = new TableMapper( f );
    i.belongsTo( this );
    vm.pushFrame( i );
};

MapTable.prototype.invoke = function ( vm, args ) {
    Builtin.checkExactArgsCount( args, 2, this.className );
    this.invokef2( vm, args.car(), args.cdr().car() );
};


// ===================================================================
// from functions/tables/Sref.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function Sref() {
    Builtin.call( this );
    this.init( "sref" );
}

Sref.prototype = new Builtin();
Sref.prototype.className = "Sref";

Sref.prototype.invokef3 = function ( vm, arg1, arg2, arg3 ) {
    vm.pushA( arg1.sref( arg2, arg3 ) );
};

Sref.prototype.invoke = function ( vm, args ) {
    Builtin.checkExactArgsCount( args, 3, this.className );
    this.invokef3(
        vm, args.car(), args.cdr().car(), args.cdr().cdr().car() );
};


// ===================================================================
// from functions/tables/Table.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function Table() {
    Builtin.call( this );
    this.init( "table" );
}

Table.prototype = new Builtin();
Table.prototype.className = "Table";

Table.prototype.invoke = function ( vm, args ) {
    var hash = new Hash();
    vm.pushA( hash );
    if ( !(args instanceof Nil) ) {
        var i = new PopArg( "table-initialiser" );
        i.belongsTo( this );
        vm.pushFrame( i );
        var f = args.car();
        f.invoke( vm, Pair.buildFrom1( [ hash ] ) );
    }
};


// ===================================================================
// from functions/threads/AtomicInvoke.java
// ===================================================================
// Needed early: Builtin Instruction

// PORT TODO: See if there's a way to actually implement this. It may
// not make sense except when used with continuations, but then
// continuations may let us implement threads by way of cooperative
// multithreading.

/** @constructor */
function AtomicInvoke() {
    Builtin.call( this );
    this.init( "atomic-invoke" );
}

AtomicInvoke.prototype = new Builtin();
AtomicInvoke.prototype.className = "AtomicInvoke";

AtomicInvoke.prototype.invokef1 = function ( vm, f ) {
    while ( vm !== AtomicInvoke.owner_
        && AtomicInvoke.owner_ !== null ) {
        // PORT NOTE: Yes, this is deadlock. We would do the
        // equivalent of Java "lock.wait()" here, but there are no
        // other threads to wait for.
    }
    AtomicInvoke.owner_ = vm;
    AtomicInvoke.entryCount_++;
    var i = new AtomicInvoke.ReleaseLock();
    i.belongsTo( this );
    vm.pushFrame( i );
    
    f.invoke( vm, ArcObject.NIL );
};

AtomicInvoke.prototype.invoke = function ( vm, args ) {
    this.invokef1( vm, args.car() );
};

/** @constructor */
AtomicInvoke.ReleaseLock = function () {
    Instruction.call( this );
};

AtomicInvoke.ReleaseLock.prototype = new Instruction();
AtomicInvoke.ReleaseLock.prototype.className =
    "AtomicInvoke.ReleaseLock";

AtomicInvoke.ReleaseLock.prototype.operate = function ( vm ) {
    AtomicInvoke.entryCount_--;
    if ( AtomicInvoke.entryCount_ === 0 )
        AtomicInvoke.owner_ = null;
};

AtomicInvoke.owner_ = null;
AtomicInvoke.entryCount_ = 0;


// ===================================================================
// from functions/threads/BreakThread.java
// ===================================================================
// Needed early: Builtin
// Needed late: VM VMInterceptor ArcObject

/** @constructor */
function BreakThread() {
    Builtin.call( this );
    this.init( "break-thread" );
}

BreakThread.prototype = new Builtin();
BreakThread.prototype.className = "BreakThread";

BreakThread.prototype.invokePair = function ( args ) {
    var victim = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(victim instanceof VM) )
        throw new TypeError();
    victim.setInterceptor( VMInterceptor.KILL );
    return ArcObject.NIL;
};


// ===================================================================
// from functions/threads/CCC.java
// ===================================================================
// Needed early: Builtin Instruction ArcObject LexicalClosure Pair
// Needed late: ArcError

/** @constructor */
function CCC() {
    Builtin.call( this );
    this.init( "ccc" );
}

CCC.prototype = new Builtin();
CCC.prototype.className = "CCC";

CCC.prototype.invokef1 = function ( vm, fn ) {
    if ( fn instanceof Nil )
        throw new ArcError( "Can't ccc nil!" );
    var e = new CCC.ContinuationWrapper( vm );
    
    
//    // TODO: no longer need TCV
//    var tcv = new CCC.TriggerCopyVM_( e );
//    tcv.belongsTo( this );
//    vm.pushFrame( tcv );
    
    
    fn.invokef1( vm, e );
};

CCC.prototype.invoke = function ( vm, args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    this.invokef1( vm, args.car() );
};

/** @constructor */
CCC.TriggerCopyVM_ = function ( cc ) {
    Instruction.call( this );
    this.cc_ = cc;
}

CCC.TriggerCopyVM_.prototype = new Instruction();
CCC.TriggerCopyVM_.prototype.className = "CCC.TriggerCopyVM_";

CCC.TriggerCopyVM_.prototype.operate = function ( vm ) {
    this.cc_.setCopyRequired();
};

CCC.TriggerCopyVM_.prototype.toString = function () {
    return "#<require-vm-copy #" + this.cc_.vm_.threadId + ">";
};

/** @constructor */
CCC.ContinuationWrapper = function ( vm ) {
    ArcObject.call( this );
    this.vm_ = vm.copy();
    this.copyRequired_ = false;
};

CCC.ContinuationWrapper.prototype = new ArcObject();
CCC.ContinuationWrapper.prototype.className =
    "CCC.ContinuationWrapper";

CCC.ContinuationWrapper.prototype.applyFinallies_ = function (
    vm, finallies ) {
    
    var fc = finallies[ 0 ].length;
    for ( var i = fc - 1; 0 <= i; i-- ) {
        var lc = finallies[ 1 ][ i ];
        // PORT NOTE: This was a cast in Java.
        // PORT TODO: See if this can throw an error.
        if ( !(lc instanceof LexicalClosure) )
            throw new TypeError();
        var insructions = finallies[ 0 ][ i ];
        // PORT NOTE: This was a cast in Java.
        // PORT TODO: See if this can throw an error.
        if ( !(insructions instanceof Pair) )
            throw new TypeError();
        vm.pushInvocation2( lc, instructions );
    }
};

CCC.ContinuationWrapper.prototype.invokef1 = function ( vm, arg ) {
    var oldIP = vm.lastCommonAncestor( this.vm_ );
    var finallies = vm.gatherFinallies( oldIP );
    this.vm_.copyTo( vm );
    vm.pushA( arg );
    this.applyFinallies_( vm, finallies );
};

CCC.ContinuationWrapper.prototype.faster_but_broken_invokef1 =
    function ( vm, arg ) {
    
    if ( this.copyRequired_ ) {
        var oldIP = vm.lastCommonAncestor( this.vm_ );
        var finallies = vm.gatherFinallies( oldIP );
        this.vm_.copyTo( vm );
        vm.pushA( arg );
        this.applyFinallies_( vm, finallies );
    } else {
        var finallies = vm.gatherFinallies( this.vm.ip );
        vm.ap = this.vm.ap;
        vm.ip = this.vm.ip;
        vm.currentLc = this.vm.currentLc;
        vm.currentParams = this.vm.currentParams;
        vm.error_ = this.vm.error_;
        vm.dead_ = this.vm.dead_;
        vm.ipThreshold = this.vm.ipThreshold;
        vm.pushA( arg );
        this.applyFinallies_( vm, finallies );
    }
};

CCC.ContinuationWrapper.prototype.invoke = function ( vm, args ) {
    this.invokef1( vm, args.car() );
};

CCC.ContinuationWrapper.prototype.type = function () {
    return Builtin.TYPE;
};

CCC.ContinuationWrapper.prototype.setCopyRequired = function (
    vm, args ) {
    
    this.copyRequired_ = true;
};

CCC.ContinuationWrapper.prototype.toString = function () {
    return "#<continuation ip:" + this.vm_.ip + ";" +
        "ap:" + this.vm_.ap + ";VM#" + this.vm_.threadId + ">";
};


// ===================================================================
// from functions/threads/CurrentThread.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function CurrentThread() {
    Builtin.call( this );
    this.init( "current-thread" );
}

CurrentThread.prototype = new Builtin();
CurrentThread.prototype.className = "CurrentThread";

CurrentThread.prototype.invoke = function ( vm, args ) {
    vm.pushA( vm );
};


// ===================================================================
// from functions/threads/Dead.java
// ===================================================================
// Needed early: Builtin
// Needed late: VM Truth

/** @constructor */
function Dead() {
    Builtin.call( this );
    this.init( "dead" );
}

Dead.prototype = new Builtin();
Dead.prototype.className = "Dead";

Dead.prototype.invoke = function ( vm, args ) {
    var victim = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(victim instanceof VM) )
        throw new TypeError();
    vm.pushA( Truth.valueOf( victim.dead() ) );
};


// ===================================================================
// from functions/threads/KillThread.java
// ===================================================================
// Needed early: Builtin
// Needed late: VM VMInterceptor ArcObject

// PORT TODO: Figure out whether this should be different from
// BreakThread. But don't change it!

/** @constructor */
function KillThread() {
    Builtin.call( this );
    this.init( "kill-thread" );
}

KillThread.prototype = new Builtin();
KillThread.prototype.className = "KillThread";

KillThread.prototype.invoke = function ( vm, args ) {
    var victim = args.car();
    // PORT NOTE: This was a cast in Java.
    if ( !(victim instanceof VM) )
        throw new TypeError();
    victim.setInterceptor( VMInterceptor.KILL );
    vm.pushA( ArcObject.NIL );
};


// ===================================================================
// from functions/threads/NewThreadLocal.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcThreadLocal

/** @constructor */
function NewThreadLocal() {
    Builtin.call( this );
    this.init( "thread-local" );
}

NewThreadLocal.prototype = new Builtin();
NewThreadLocal.prototype.className = "NewThreadLocal";

NewThreadLocal.prototype.invokePair = function ( args ) {
    return new ArcThreadLocal();
};


// ===================================================================
// from functions/threads/ThreadLocalGet.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcThreadLocal

/** @constructor */
function ThreadLocalGet() {
    Builtin.call( this );
    this.init( "thread-local-ref" );
}

ThreadLocalGet.prototype = new Builtin();
ThreadLocalGet.prototype.className = "ThreadLocalGet";

ThreadLocalGet.prototype.invokePair = function ( args ) {
    var tl = ArcThreadLocal.cast( args.car(), this );
    return tl.get();
};


// ===================================================================
// from functions/threads/ThreadLocalSet.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcThreadLocal

/** @constructor */
function ThreadLocalSet() {
    Builtin.call( this );
    this.init( "thread-local-set" );
}

ThreadLocalSet.prototype = new Builtin();
ThreadLocalSet.prototype.className = "ThreadLocalSet";

ThreadLocalSet.prototype.invokePair = function ( args ) {
    var tl = ArcThreadLocal.cast( args.car(), this );
    var value = args.cdr().car();
    tl.set( value );
    return value;
};


// ===================================================================
// from functions/typing/Annotate.java
// ===================================================================
// Needed early: Builtin
// Needed late: Tagged

/** @constructor */
function Annotate() {
    Builtin.call( this );
    this.init( "annotate" );
}

Annotate.prototype = new Builtin();
Annotate.prototype.className = "Annotate";

Annotate.prototype.invokePair = function ( args ) {
    var type = args.car();
    var rep = args.cdr().car();
    if ( type === rep.type() )
        return rep;
    else
        return new Tagged( type, rep );
};


// ===================================================================
// from functions/typing/Coerce.java
// ===================================================================
// Needed early: Builtin
// Needed late: Typing Symbol ArcError

/** @constructor */
function Coerce() {
    Builtin.call( this );
    this.init( "coerce" );
    Typing.init();
}

Coerce.prototype = new Builtin();
Coerce.prototype.className = "Coerce";

Coerce.prototype.invokef2 = function ( vm, arg, toType ) {
    var fromType = arg.type();
    if ( fromType === toType ) {
        vm.pushA( arg );
        return;
    }
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(toType instanceof Symbol) )
            throw new TypeError();
        // PORT NOTE: This was a cast in Java.
        if ( !(fromType instanceof Symbol) )
            throw new TypeError();
        var coercer = toType.getCoercion( fromType );
        coercer.invokef1( vm, arg );
    } catch ( e ) {
        if ( e instanceof Typing.CantCoerce )
            throw new ArcError(
                "Can't coerce " + arg + " to " + toType );
        throw new ArcError(
            "Can't coerce " + arg + " ( a " + arg.type() + " ) to " +
            toType, e );
    }
};

Coerce.prototype.invokef3 = function ( vm, arg, toType, base ) {
    var fromType = arg.type();
    if ( fromType === toType ) {
        vm.pushA( arg );
        return;
    }
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(toType instanceof Symbol) )
            throw new TypeError();
        // PORT NOTE: This was a cast in Java.
        if ( !(fromType instanceof Symbol) )
            throw new TypeError();
        var coercer = toType.getCoercion( fromType );
        coercer.invokef2( vm, arg, base );
    } catch ( e ) {
        if ( e instanceof Typing.CantCoerce )
            throw new ArcError(
                "Can't coerce " + arg + " to " + toType );
        throw new ArcError(
            "Can't coerce " + arg + " ( a " + arg.type() + " ) to " +
            toType, e );
    }
};

Coerce.prototype.invoke = function ( vm, args ) {
    if ( args.hasLen( 2 ) )
        this.invokef2( vm, args.car(), args.cdr().car() );
    else if ( args.hasLen( 3 ) )
        this.invokef3( vm,
            args.car(), args.cdr().car(), args.cdr().cdr().car() );
    else
        throw new ArcError(
            "coerce expects 2 or 3 args, got " + args );
};


// ===================================================================
// from functions/typing/Rep.java
// ===================================================================
// Needed early: Builtin
// Needed late: Tagged

/** @constructor */
function Rep() {
    Builtin.call( this );
    this.init( "rep" );
}

Rep.prototype = new Builtin();
Rep.prototype.className = "Rep";

Rep.prototype.invokePair = function ( args ) {
    var arg = args.car();
    if ( arg instanceof Tagged )
        return Tagged.cast( args.car(), this ).getRep();
    else
        return arg;
};


// ===================================================================
// from functions/typing/Type.java
// ===================================================================
// Needed early: Builtin

/** @constructor */
function Type() {
    Builtin.call( this );
    this.init( "type" );
}

Type.prototype = new Builtin();
Type.prototype.className = "Type";

Type.prototype.invokef1 = function ( vm, arg ) {
    vm.pushA( arg.type() );
};

Type.prototype.invokePair = function ( args ) {
    Builtin.checkMaxArgCount( args, this.className, 1 );
    var arg = args.car();
    return arg.type();
};


// ===================================================================
// from functions/typing/Typing.java
// ===================================================================
// Needed early: Symbol ArcObject
// Needed late: ArcString ArcCharacter Pair Nil Rational ArcNumber
// Complex Real ParseException ArcError

var Typing = {};

Typing.STRING = Symbol.mkSym( "string" );
Typing.SYM = Symbol.mkSym( "sym" );
Typing.INT = Symbol.mkSym( "int" );
Typing.NUM = Symbol.mkSym( "num" );
Typing.CONS = Symbol.mkSym( "cons" );
Typing.CHAR = Symbol.mkSym( "char" );

Typing.init = function () {
    Typing.CONS.addCoercion( Typing.STRING,
        new Typing.Coercion( "string-cons", function ( arg ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(arg instanceof ArcString) )
                throw new TypeError();
            var source = arg.value();
            var chars = [];
            for ( var i = 0; i < source.length; i++ )
                chars.push( ArcCharacter.makeFromCharCode(
                    source.charCodeAt( i ) ) );
            return Pair.buildFrom1( chars );
        } ) );
    
    Typing.STRING.addCoercion( Typing.CONS,
        new Typing.Coercion( "cons-string", function ( items ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(items instanceof Pair) )
                throw new TypeError();
            var result = [];
            while ( !(items instanceof Nil) ) {
                result.push( items.car().disp() );
                items = items.cdr();
                // PORT NOTE: This was a cast in Java.
                if ( !(items instanceof Pair) )
                    throw new TypeError();
            }
            return ArcString.make( result.join( "" ) );
        } ) );
    
    Typing.STRING.addCoercion( Typing.INT,
        new Typing.Coercion( "int-string", function ( arg ) {
            return this.coerce2( arg, Rational.TEN );
        }, function ( n, base ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(base instanceof ArcNumber) )
                throw new TypeError();
            // PORT NOTE: This was a cast in Java.
            if ( !(n instanceof ArcNumber) )
                throw new TypeError();
            if ( n instanceof Complex )
                return Typing.stringifyComplex_( n );
            else if ( n instanceof Real && base.toInt() !== 10 )
                return Typing.cantCoerce_();
            else if ( n instanceof Rational )
                return Typing.stringifyRational_( n, base );
            else
                return Typing.stringifyReal_( n, base );
        } ) );
    
    // PORT NOTE: Yes, this is the same coercion as for int-string,
    // aside from the name and types involved.
    Typing.STRING.addCoercion( Typing.NUM,
        new Typing.Coercion( "num-string", function ( arg ) {
            return this.coerce2( arg, Rational.TEN );
        }, function ( n, base ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(base instanceof ArcNumber) )
                throw new TypeError();
            // PORT NOTE: This was a cast in Java.
            if ( !(n instanceof ArcNumber) )
                throw new TypeError();
            if ( n instanceof Complex )
                return Typing.stringifyComplex_( n );
            else if ( n instanceof Real && base.toInt() !== 10 )
                return Typing.cantCoerce_();
            else if ( n instanceof Rational )
                return Typing.stringifyRational_( n, base );
            else
                return Typing.stringifyReal_( n, base );
        } ) );
    
    Typing.SYM.addCoercion( Typing.STRING,
        new Typing.Coercion( "string-sym", function ( original ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(original instanceof ArcString) )
                throw new TypeError();
            return Symbol.make( original.value() );
        } ) );
    
    Typing.STRING.addCoercion( Typing.SYM,
        new Typing.Coercion( "sym-string", function ( original ) {
            if ( original instanceof Nil )
                return ArcString.make( "" );
            var source = original.disp();
            return ArcString.make( source );
        } ) );
    
    Typing.INT.addCoercion( Typing.CHAR,
        new Typing.Coercion( "char-int", function ( original ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(original instanceof ArcCharacter) )
                throw new TypeError();
            var source = original.value();
            return Rational.make1( source );
        }, function ( original, unused ) {
            return this.coerce1( original );
        } ) );
    
    Typing.INT.addCoercion( Typing.NUM,
        new Typing.Coercion( "num-int", function ( original ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(original instanceof ArcNumber) )
                throw new TypeError();
            return original.round();
        }, function ( original, unused ) {
            return this.coerce1( original );
        } ) );
    
    Typing.NUM.addCoercion( Typing.INT,
        new Typing.Coercion( "int-num", function ( original ) {
            return original;
        } ) );
    
    Typing.CHAR.addCoercion( Typing.INT,
        new Typing.Coercion( "int-char", function ( num ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(num instanceof ArcNumber) )
                throw new TypeError();
            if ( !num.isInteger() )
                Typing.cantCoerce_();
            return ArcCharacter.makeFromCharCode( num.toInt() );
        } ) );
    
    Typing.STRING.addCoercion( Typing.CHAR,
        new Typing.Coercion( "char-string", function ( original ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(original instanceof ArcCharacter) )
                throw new TypeError();
            var source = original.value();
            return ArcString.make( String.fromCharCode( source ) );
        } ) );
    
    Typing.SYM.addCoercion( Typing.CHAR,
        new Typing.Coercion( "char-sym", function ( original ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(original instanceof ArcCharacter) )
                throw new TypeError();
            var source = original.value();
            return Symbol.make( String.fromCharCode( source ) );
        } ) );
    
    Typing.NUM.addCoercion( Typing.STRING,
        new Typing.Coercion( "string-num", function ( original ) {
            return this.coerce2( original, Rational.TEN );
        }, function ( original, base ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(base instanceof ArcNumber) )
                throw new TypeError();
            // PORT NOTE: This was a cast in Java.
            if ( !(original instanceof ArcString) )
                throw new TypeError();
            var source = original.value().toLowerCase();
            if ( source === "+inf.0" )
                return Real.positiveInfinity();
            else if ( source === "-inf.0" )
                return Real.negativeInfinity();
            else if ( source === "+nan.0" )
                return Real.nan();
            else if ( /i$/i.test( source ) )
                return Typing.coerceComplex_( source );
            else if ( /\./.test( source )
                || (base.toInt() < 15 && /.e./.test( source )) )
                return Typing.coerceDouble_( source, base.toInt() );
            else if ( /\//.test( source ) )
                return Typing.coerceFraction_( source, base.toInt() );
            else
                return Typing.coerceInt_( source, base.toInt() );
        } ) );
    
    Typing.INT.addCoercion( Typing.STRING,
        new Typing.Coercion( "string-int", function ( original ) {
            return this.coerce2( original, Rational.TEN );
        }, function ( original, base ) {
            // PORT NOTE: This was a cast in Java.
            if ( !(base instanceof ArcNumber) )
                throw new TypeError();
            // PORT NOTE: This was a cast in Java.
            if ( !(original instanceof ArcString) )
                throw new TypeError();
            var source = original.value().toLowerCase();
            if ( source === "+inf.0" || source === "-inf.0"
                || source === "+nan.0" || /i$/i.test( source ) ) {
                throw new Typing.CantCoerce();
            } else if ( /\./.test( source )
                || (base.toInt() < 15 && /.e./i.test( source )) ) {
                // PORT NOTE: This local variable didn't exist in
                // Java.
                var coercedDouble =
                    Typing.coerceDouble_( source, base.toInt() );
                // PORT NOTE: This was a cast in Java.
                if ( !(coercedDouble instanceof Real) )
                    throw new TypeError();
                return coercedDouble.roundJava();
            } else if ( /\//.test( source ) ) {
                // PORT NOTE: This local variable didn't exist in
                // Java.
                var coercedFraction =
                    Typing.coerceFraction_( source, base.toInt() );
                // PORT NOTE: This was a cast in Java.
                if ( !(coercedFraction instanceof Rational) )
                    throw new TypeError();
                return coercedFraction.roundJava();
            } else {
                return Typing.coerceInt_( source, base.toInt() );
            }
        } ) );
};

Typing.stringifyComplex_ = function ( c ) {
    return ArcString.make( c.toString() );
};

Typing.stringifyRational_ = function ( rational, base ) {
    return rational.stringify( base );
};

Typing.stringifyReal_ = function ( d, base ) {
    if ( base.toInt() === 10 ) {
        return ArcString.make( d.toString() );
    } else {
        var num = d.toInt().toString( ~~base.toInt() );
        return ArcString.make( "" + num + ".0" );
    }
};

Typing.coerceComplex_ = function ( source ) {
    try {
        return Complex.parse( source );
    } catch ( e ) { if ( !(e instanceof ParseException) ) throw e;
        throw new Typing.CantCoerce();
    }
};

Typing.coerceInt_ = function ( source, base ) {
    var value = parseInt( source, ~~base );
    return Rational.make1( value );
};

Typing.coerceFraction_ = function ( source, base ) {
    var parts = source.split( /\//g );
    if ( 2 < parts.length )
        throw new Typing.CantCoerce();
    var num = parseInt( parts[ 0 ], ~~base );
    var div = parseInt( parts[ 1 ], ~~base );
    return Rational.make2( num, div );
};

// PORT TODO: Notice that this is pretty buggy in the way it uses
// .split() and doesn't use the whole result. But don't fix it!
Typing.coerceDouble_ = function ( source, base ) {
    var negative = false;
    if ( /^-/.test( source ) ) {
        negative = true;
        source = source.substring( 1 );
    }
    source = source.toUpperCase();
    if ( !/E/.test( source ) )
        source += "E0";
    if ( !/\./.test( source ) ) {
        var parts = source.split( /E/g );
        source = parts[ 0 ] + ".0E" + parts[ 1 ];
    } else if ( /^\./.test( source ) ) {
        source = "0" + source;
    }
    
    var parts = source.split( /\./g );
    var integral = parseInt( parts[ 0 ], ~~base );
    parts = parts[ 1 ].split( /E/g );
    if ( /^\+/.test( parts[ 1 ] ) )
        parts[ 1 ] = parts[ 1 ].substring( 1 );
    var decimal = parseInt( parts[ 0 ], ~~base ) /
        Math.pow( base, parts[ 0 ].length );
    var exponent = Math.pow( base, parseInt( parts[ 1 ], ~~base ) );
    
    var result = (integral + decimal) * exponent;
    if ( negative )
        result = -result;
    return Real.make( result );
};

// PORT NOTE: In the original, this only took one argument, and its
// instances were all based on anonymous classes.
/** @constructor */
Typing.Coercion = function ( name, opt_coerce1, opt_coerce2 ) {
    ArcObject.call( this );
    this.name_ = name;
    if ( opt_coerce1 !== void 0 )
        this.coerce1 = opt_coerce1;
    if ( opt_coerce2 !== void 0 )
        this.coerce2 = opt_coerce2;
};

Typing.Coercion.prototype = new ArcObject();
Typing.Coercion.prototype.className = "Typing.Coercion";

Typing.Coercion.prototype.type = function () {
    return Symbol.mkSym( "fn" );
};

Typing.Coercion.prototype.coerce1 = function ( original ) {
    throw new ArcError(
        "not implemented: " + name + ".coerce 1 arg" );
};

Typing.Coercion.prototype.coerce2 = function ( original, base ) {
    throw new ArcError(
        "not implemented: " + name + ".coerce 2 args" );
};

Typing.Coercion.prototype.invokef1 = function ( vm, arg ) {
    vm.pushA( this.coerce1( arg ) );
};

Typing.Coercion.prototype.invokef2 = function ( vm, arg1, arg2 ) {
    vm.pushA( this.coerce2( arg1, arg2 ) );
};

Typing.cantCoerce_ = function () {
    throw new Typing.CantCoerce();
}

// PORT TODO: Figure out a way to do this inheritance and also get a
// real stack trace.
/** @constructor */
Typing.CantCoerce = function () {
};
Typing.CantCoerce.prototype = new Error();


// ===================================================================
// from functions/Environment.java
// ===================================================================
// Needed late: (lots)

var Environment = {};

// PORT TODO: Skipped dependencies are commented out here. Uncomment
// them if and as they're implemented.

Environment.init = function () {
    // system
    new MSec();
    new Seconds();
//    new TimeDate();
    new CurrentProcessMilliseconds();
    new CurrentGcMilliseconds();
//    new PipeFrom();
//    new ShellInvoke();
//    new WhichOS();
    new Declare();
//    new SetUID();
//    new Memory();
//    new Quit();
    
    // maths
    Symbol.mkSym( "pi" ).setValue( new Real( Math.PI ) );
    Symbol.mkSym( "e" ).setValue( new Real( Math.E ) );
    new Trunc();
    new Expt();
    new Rand();
    new Sqrt();
    new Quotient();
    new Mod();
    new Add();
    new Subtract();
    new Multiply();
    new Divide();
    new Sine();
    new Cosine();
    new Tangent();
    new Asin();
    new Acos();
    new Atan();
    new Logarithm();
    new ComplexParts();
    new MakeComplex();
    new PolarCoordinates();
    
    // typing
    new Type();
    new Annotate();
    new Rep();
    new Coerce();
    
    // java integration
//    new JavaNew();
//    new JavaClass();
    new JavaInvoke();
//    new JavaStaticInvoke();
//    new JavaStaticField();
    new JavaDebug();
//    new JavaImplement();
    
    // threading
    new NewThread();
    new KillThread();
    // TODO: break-thread just duplicates kill-thread, should do
    // something else
    new BreakThread();
//    new Sleep();
    new Dead();
    new AtomicInvoke();
    new CCC();
    new NewThreadLocal();
    new ThreadLocalGet();
    new ThreadLocalSet();
    
    new Uniq();
    new Macex();
    
    // errors
    new Protect();
    new Err();
    new OnErr();
    new Details();
    
    // lists
    new NewString();
    new Car();
    new Cdr();
    new Scar();
    new Scdr();
    new Cons();
    new Len();
    
    // predicates
    new Bound();
    new LessThan();
    new GreaterThan();
    new Exact();
    new Is();
    
    // evaluation
    new Apply();
    new Eval();
    new SSExpand();
    new SSyntax();
    
    // tables
    new Table();
    new MapTable();
    new Sref();
    new Hash();
    
    // IO
    new CallWStdIn();
    new CallWStdOut();
    new StdIn();
    new StdOut();
    new StdErr();
    new Disp();
    new Write();
    new Sread();
    new WriteB();
    new WriteC();
    new ReadB();
    new ReadC();
    new FlushOut();
    new Close_Builtin();
    new ForceClose();
    
//    new OpenSocket();
//    new ClientIp();
//    new SocketAccept();
//    new Connect();
    
    new OutFile();
    new InFile();
    
    new DirExists();
    new FileExists();
    new Dir();
    new RmFile();
    new MvFile();
    new MakeDirectory();
    new MakeDirectories();
    
    new InString();
    new OutString();
    new Inside();
    
    // rainbow-specific
    new RainbowDebug();
    new RainbowProfile();
    new RainbowProfileReport();
};


// ===================================================================
// from types/Input.java
// ===================================================================
// Needed early: LiteralObject Symbol
// Needed late: ArcError ArcObject Rational ArcCharacter

// ASYNC PORT NOTE: This is a completely reworked design.

/** @constructor */
function Input( original ) {
    LiteralObject.call( this );
    this.original_ = original;
}

Input.prototype = new LiteralObject();
Input.prototype.className = "Input";

Input.prototype.readByteAsync = function ( then, opt_sync ) {
    return this.original_.readByteAsync( function ( e, theByte ) {
        if ( e )
            return then(
                new ArcError( "Cannot read byte from " + this, e ) );
        if ( theByte === null )
            return then( null, ArcObject.NIL );
        return then( null, Rational.make1( theByte ) );
    }, opt_sync );
};

Input.prototype.readCharacterAsync = function ( then, opt_sync ) {
    return this.original_.readCharCodeAsync( function ( e, result ) {
        if ( e )
            return then( new ArcError( "reading character: " + e ) );
        if ( result === null )
            return then( null, ArcObject.NIL );
        return then( null, ArcCharacter.makeFromCharCode( result ) );
    }, opt_sync );
};

// PORT TODO: See if the Java version's .peek() behaves strangely at
// EOF.
Input.prototype.peekCharacterAsync = function ( then, opt_sync ) {
    return this.original_.peekCharCodeAsync( function ( e, result ) {
        if ( e )
            return then( e );
        if ( result === null )
            return then( null, ArcObject.NIL );
        return then( null, ArcCharacter.makeFromCharCode( result ) );
    }, opt_sync );
};

Input.prototype.readObjectAsync = function ( eof, then, opt_sync ) {
    return ArcParser.readObjectAsync( this.original_, function (
        e, result ) {
        
        if ( e )
            return then(
                new ArcError( "Can't parse input: " + e, e ) );
        if ( result === null )
            return then( null, eof );
        else
            return then( null, result );
    }, opt_sync );
};

Input.prototype.type = function () {
    return Input.TYPE;
};

Input.prototype.unwrap = function () {
    return this.original_;
};

Input.prototype.close = function () {
    this.closed_ = true;
    this.original_.close();
};

Input.prototype.getName = function () {
    return "<input>";
};

Input.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof Input) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected " +
            "input-port, got " + argument );
    }
};

Input.TYPE = Symbol.mkSym( "input" );


// ===================================================================
// from types/Output.java
// ===================================================================
// Needed early: LiteralObject Symbol
// Needed late: ArcError

// ASYNC PORT NOTE: This is a completely reworked design.

/** @constructor */
function Output( out ) {
    LiteralObject.call( this );
    this.out_ = out;
}

Output.prototype = new LiteralObject();
Output.prototype.className = "Output";

Output.prototype.write = function ( s ) {
    this.out_.writeString( "" + s );
};

Output.prototype.type = function () {
    return Output.TYPE;
};

Output.prototype.unwrap = function () {
    return this.out_;
};

// PORT NOTE: We've renamed all uses of Output.writeByte( Rational ).
Output.prototype.writeRational = function ( rational ) {
    if ( !rational.isInteger() )
        throw new ArcError(
            "write byte: expected byte, got " + rational );
    this.writeByte( rational.toInt() );
};

Output.prototype.writeChar = function ( arcCharacter ) {
    this.out_.writeString(
        String.fromCharCode( arcCharacter.value() ) );
};

Output.prototype.close = function () {
    this.out_.close();
};

Output.prototype.writeByte = function ( b ) {
    this.out_.writeByte( b );
};

Output.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof Output) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected " +
            "output-port, got " + argument );
    }
};

Output.prototype.flush = function () {
    this.out_.flush();
};

Output.TYPE = Symbol.mkSym( "output" );


// ===================================================================
// from types/StringInputPort.java
// ===================================================================
// Needed early: Input

// PORT TODO: We've just picked an arbitrary byte encoding here. The
// Java version uses the platform's default charset. Figure out if
// there's something better we can do here (or there too).
/** @constructor */
function StringInputPort( s ) {
    var peekedBytes = [];
    var charI = 0;
    function getBytes() {
        if ( s.length <= charI )
            return false;
        var code = s.charCodeAt( charI++ );
        peekedBytes.push( code >>> 8 & 0xFF, code & 0xFF );
        return true;
    }
    function readByte() {
        return peekedBytes.length !== 0 || getBytes() ?
            peekedBytes.shift() : null;
    }
    Input.call( this, {
        readByteAsync: function ( then, opt_sync ) {
//            setTimeout( function () {
                then( null, readByte() );
//            }, 0 );
            return true;
        },
        readCharCodeAsync: function ( then, opt_sync ) {
            var self = this;
            var b1 = readByte();
            var b2 = readByte();
            // PORT TODO: Figure out what to really do in the case
            // where there's just one byte left in the stream, but
            // we're reading or peeking at a character code....
            then( null, b2 === null ? null : b1 << 8 | b2 );
            return true;
        },
        peekCharCodeAsync: function ( then, opt_sync ) {
            // PORT TODO: Figure out what to really do in the case
            // where there's just one byte left in the stream, but
            // we're reading or peeking at a character code....
            then( null, 2 <= peekedBytes.length || getBytes() ?
                peekedBytes[ 0 ] << 8 | peekedBytes[ 1 ] : null );
            return true;
        },
        close: function () {}
    } );
}

StringInputPort.prototype = new Input( void 0 );
StringInputPort.prototype.className = "StringInputPort";


// ===================================================================
// from types/StringOutputPort.java
// ===================================================================
// Needed early: Output

// PORT TODO: We've just picked an arbitrary byte encoding here. The
// Java version uses the platform's default charset. Figure out if
// there's something better we can do here (or there too).
/** @constructor */
function StringOutputPort() {
    var self = this;
    self.parts_ = [];
    self.leftoverByte_ = null;
    Output.call( this, {
        writeString: function ( string ) {
            if ( self.leftoverByte_ === null ) {
                self.parts_.push( string );
                return;
            }
            for ( var i = 0, len = string.length; i < len; i++ ) {
                var code = string.charCodeAt( i );
                self.parts_.push( String.fromCharCode(
                    self.leftoverByte_ << 8 | (code >>> 8 & 0xFF) ) );
                self.leftoverByte_ = code & 0xFF;
            }
        },
        writeByte: function ( theByte ) {
            if ( self.leftoverByte_ === null ) {
                self.leftoverByte_ = theByte;
                return;
            }
            self.parts_.push( String.fromCharCode(
                self.leftoverByte_ << 8 | theByte ) );
            self.leftoverByte_ = null;
        },
        close: function () {},
        flush: function () {}
    } );
}

StringOutputPort.prototype = new Output( void 0 );
StringOutputPort.prototype.className = "StringOutputPort";

StringOutputPort.prototype.value = function () {
    // PORT TODO: See what the Java version does if there aren't
    // enough bytes to make a whole number of characters. When that
    // happens for us, we just ignore the last byte at the moment.
    var string = this.parts_.join( "" );
    this.parts_ = [ string ];
    return ArcString.make( string );
};

StringOutputPort.prototype.toString = function () {
    return "#<string-output-port>";
};

StringOutputPort.cast = function ( argument, caller ) {
    try {
        // PORT NOTE: This was a cast in Java.
        if ( !(argument instanceof StringOutputPort) )
            throw new TypeError();
        return argument;
    } catch ( e ) { if ( !(e instanceof TypeError) ) throw e;
        throw new ArcError(
            "Wrong argument type: " + caller + " expected a " +
            "StringOutputPort, got " + argument );
    }
};


// ===================================================================
// from functions/IO.java
// ===================================================================
// Needed early: Output System_out System_err Input System_in Input
// Output ArcSocket JsObject Nil Pair ArcObject

var IO = {};

/** @constructor */
IO.Anon_STD_OUT_ = function () {
    Output.call( this, System_out );
};

IO.Anon_STD_OUT_.prototype = new Output( void 0 );
IO.Anon_STD_OUT_.prototype.className = "IO.Anon_STD_OUT_";

IO.Anon_STD_OUT_.prototype.close = function () {
};

IO.Anon_STD_OUT_.prototype.toString = function () {
    return "IO.STD_OUT";
};

IO.STD_OUT = new IO.Anon_STD_OUT_();

/** @constructor */
IO.Anon_STD_ERR_ = function () {
    Output.call( this, System_err );
};

IO.Anon_STD_ERR_.prototype = new Output( void 0 );
IO.Anon_STD_ERR_.prototype.className = "IO.Anon_STD_ERR_";

IO.Anon_STD_ERR_.prototype.close = function () {
};

IO.Anon_STD_ERR_.prototype.toString = function () {
    return "IO.STD_ERR";
};

IO.STD_ERR = new IO.Anon_STD_ERR_();

/** @constructor */
IO.Anon_STD_IN_ = function () {
    Input.call( this, System_in );
};

IO.Anon_STD_IN_.prototype = new Input( void 0 );
IO.Anon_STD_IN_.prototype.className = "IO.Anon_STD_IN_";

IO.Anon_STD_IN_.prototype.close = function () {
};

IO.Anon_STD_IN_.prototype.toString = function () {
    return "IO.STD_IN";
};

IO.STD_IN = new IO.Anon_STD_IN_();

// PORT NOTE: This was public in Java, but there was a method by the
// same name.
IO.stdIn_ = { value: IO.STD_IN };

// PORT NOTE: This was public in Java, but there was a method by the
// same name.
IO.stdOut_ = { value: IO.STD_OUT };

IO.stdIn = function () {
    return IO.stdIn_.value;
};

IO.stdOut = function () {
    return IO.stdOut_.value;
};

IO.close = function ( port ) {
    if ( port instanceof Input )
        port.close();
    else if ( port instanceof Output )
        port.close();
    // PORT TODO: Put this in when ArcSocket is defined.
//    else if ( port instanceof ArcSocket )
//        port.close();
    else if ( port instanceof JsObject )
        port.close();
    else
        throw new ArcError(
            "close: expected Input or Output object; got " + port );
};

IO.chooseOutputPort = function ( port, caller ) {
    if ( port instanceof Nil )
        return IO.stdOut();
    else
        return Output.cast( port, caller );
};

IO.chooseInputPort = function ( port, caller ) {
    if ( port instanceof Nil )
        return IO.stdIn();
    else
        return Input.cast( port, caller );
};

IO.closeAll = function ( args ) {
    while ( !(args instanceof Nil) ) {
        IO.close( args.car() );
        args = args.cdr();
        // PORT NOTE: This was a cast in Java.
        if ( !(args instanceof Pair) )
            throw new TypeError();
    }
    return ArcObject.NIL;
};


// ===================================================================
// from functions/io/Close.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO

/** @constructor */
function Close_Builtin() {
    Builtin.call( this );
    this.init( "close" );
}

Close_Builtin.prototype = new Builtin();
Close_Builtin.prototype.className = "Close_Builtin";

Close_Builtin.prototype.invokePair = function ( args ) {
    return IO.closeAll( args );
};


// ===================================================================
// from functions/io/Disp.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO ArcObject

/** @constructor */
function Disp() {
    Builtin.call( this );
    this.init( "disp" );
}

Disp.prototype = new Builtin();
Disp.prototype.className = "Disp";

Disp.prototype.invokef1 = function ( vm, arg ) {
    this.disp_( IO.stdOut(), arg );
    vm.pushA( ArcObject.NIL );
};

Disp.prototype.invokePair = function ( args ) {
    this.disp_(
        IO.chooseOutputPort( args.cdr().car(), this ), args.car() );
    return ArcObject.NIL;
};

Disp.prototype.disp_ = function ( out, o ) {
    out.write( o.disp() );
};


// ===================================================================
// from functions/io/FlushOut.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO ArcObject

/** @constructor */
function FlushOut() {
    Builtin.call( this );
    this.init( "flushout" );
}

FlushOut.prototype = new Builtin();
FlushOut.prototype.className = "FlushOut";

FlushOut.prototype.invokePair = function ( args ) {
    IO.stdOut().flush();
    return ArcObject.T;
};


// ===================================================================
// from functions/io/ForceClose.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO

// PORT TODO: See if this should be different from close. But don't
// change it!

/** @constructor */
function ForceClose() {
    Builtin.call( this );
    this.init( "force-close" );
}

ForceClose.prototype = new Builtin();
ForceClose.prototype.className = "ForceClose";

ForceClose.prototype.invokePair = function ( args ) {
    return IO.closeAll( args );
};


// ===================================================================
// from functions/io/StdErr.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO ArcObject

// PORT TODO: This should be able to set stderr. But don't change it!

/** @constructor */
function StdErr() {
    Builtin.call( this );
    this.init( "stderr" );
}

StdErr.prototype = new Builtin();
StdErr.prototype.className = "StdErr";

StdErr.prototype.invokePair = function ( args ) {
    return IO.STD_ERR;
};


// ===================================================================
// from functions/io/StdIn.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO

// PORT TODO: This should be able to set stdin. But don't change it!

/** @constructor */
function StdIn() {
    Builtin.call( this );
    this.init( "stdin" );
}

StdIn.prototype = new Builtin();
StdIn.prototype.className = "StdIn";

StdIn.prototype.invokePair = function ( args ) {
    Builtin.checkExactArgsCount( args, 0, this.className );
    return IO.stdIn();
};


// ===================================================================
// from functions/io/StdOut.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO

// PORT TODO: This should be able to set stdout. But don't change it!

/** @constructor */
function StdOut() {
    Builtin.call( this );
    this.init( "stdout" );
}

StdOut.prototype = new Builtin();
StdOut.prototype.className = "StdOut";

StdOut.prototype.invokePair = function ( args ) {
    return IO.stdOut();
};


// ===================================================================
// from functions/io/Write.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO ArcObject

/** @constructor */
function Write() {
    Builtin.call( this );
    this.init( "write" );
}

Write.prototype = new Builtin();
Write.prototype.className = "Write";

Write.prototype.invokePair = function ( args ) {
    IO.chooseOutputPort( args.cdr().car(), this ).write( args.car() );
    return ArcObject.NIL;
};


// ===================================================================
// from functions/io/WriteB.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO Rational ArcObject

/** @constructor */
function WriteB() {
    Builtin.call( this );
    this.init( "writeb" );
}

WriteB.prototype = new Builtin();
WriteB.prototype.className = "WriteB";

WriteB.prototype.invokePair = function ( args ) {
    IO.chooseOutputPort( args.cdr().car(), this ).writeRational(
        Rational.cast( args.car(), this ) );
    return ArcObject.NIL;
};


// ===================================================================
// from functions/io/WriteC.java
// ===================================================================
// Needed early: Builtin
// Needed late: IO ArcCharacter ArcObject

/** @constructor */
function WriteC() {
    Builtin.call( this );
    this.init( "writec" );
}

WriteC.prototype = new Builtin();
WriteC.prototype.className = "WriteC";

WriteC.prototype.invokePair = function ( args ) {
    IO.chooseOutputPort( args.cdr().car(), this ).writeChar(
        ArcCharacter.cast( args.car(), this ) );
    return args.car();
};


// ===================================================================
// from functions/strings/InString.java
// ===================================================================
// Needed early: Builtin
// Needed late: StringInputPort ArcString

/** @constructor */
function InString() {
    Builtin.call( this );
    this.init( "instring" );
}

InString.prototype = new Builtin();
InString.prototype.className = "InString";

InString.prototype.invokePair = function ( args ) {
    return new StringInputPort(
        ArcString.cast( args.car(), this ).value() );
};


// ===================================================================
// from functions/strings/Inside.java
// ===================================================================
// Needed early: Builtin
// Needed late: StringOutputPort

/** @constructor */
function Inside() {
    Builtin.call( this );
    this.init( "inside" );
}

Inside.prototype = new Builtin();
Inside.prototype.className = "Inside";

Inside.prototype.invokePair = function ( args ) {
    var sop = StringOutputPort.cast( args.car(), this );
    return sop.value();
};


// ===================================================================
// from functions/strings/OutString.java
// ===================================================================
// Needed early: Builtin
// Needed late: StringOutputPort

/** @constructor */
function OutString() {
    Builtin.call( this );
    this.init( "outstring" );
}

OutString.prototype = new Builtin();
OutString.prototype.className = "OutString";

OutString.prototype.invokePair = function ( args ) {
    return new StringOutputPort();
};


// ===================================================================
// from functions/io/CallWStdIn.java
// ===================================================================
// Needed early: Builtin
// Needed late: SetThreadLocal IO Input ArcObject

/** @constructor */
function CallWStdIn() {
    Builtin.call( this );
    this.init( "call-w/stdin" );
}

CallWStdIn.prototype = new Builtin();
CallWStdIn.prototype.className = "CallWStdIn";

CallWStdIn.prototype.invoke = function ( vm, args ) {
    var i = new SetThreadLocal( IO.stdIn_, IO.stdIn() );
    i.belongsTo( this );
    vm.pushFrame( i );
    IO.stdIn_.value = Input.cast( args.car(), this );
    args.cdr().car().invoke( vm, ArcObject.NIL );
};


// ===================================================================
// from functions/io/CallWStdOut.java
// ===================================================================
// Needed early: Builtin
// Needed late: SetThreadLocal IO Output ArcObject

/** @constructor */
function CallWStdOut() {
    Builtin.call( this );
    this.init( "call-w/stdout" );
}

CallWStdOut.prototype = new Builtin();
CallWStdOut.prototype.className = "CallWStdOut";

CallWStdOut.prototype.invoke = function ( vm, args ) {
    var i = new SetThreadLocal( IO.stdOut_, IO.stdOut() );
    i.belongsTo( this );
    vm.pushFrame( i );
    IO.stdOut_.value = Output.cast( args.car(), this );
    args.cdr().car().invoke( vm, ArcObject.NIL );
};


// ===================================================================
// from functions/io/ReadB.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: IO

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function ReadB() {
    Builtin.call( this );
    this.init( "readb" );
}

ReadB.prototype = new Builtin();
ReadB.prototype.className = "ReadB";

ReadB.prototype.invokef1 = function ( vm, arg ) {
    vm.pushFrame( new ReadB.Go(
        IO.chooseInputPort( arg, this ), this ) );
};

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
ReadB.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new ReadB.Go(
        IO.chooseInputPort( args.car(), this ), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
ReadB.Go = function ( port, owner ) {
    Instruction.call( this );
    this.port_ = port;
    this.belongsTo( owner );
};

ReadB.Go.prototype = new Instruction();
ReadB.Go.prototype.implementsAsync = true;
ReadB.Go.prototype.className = "ReadB.Go";

ReadB.Go.prototype.operateAsync = function ( vm, then, opt_sync ) {
    return this.port_.readByteAsync( function ( e, result ) {
        if ( e ) return void then( e );
        vm.pushA( result );
        then( null );
    }, opt_sync );
};

ReadB.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/io/ReadC.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: IO

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function ReadC() {
    Builtin.call( this );
    this.init( "readc" );
}

ReadC.prototype = new Builtin();
ReadC.prototype.className = "ReadC";

ReadC.prototype.invokef1 = function ( vm, arg ) {
    vm.pushFrame( new ReadC.Go(
        IO.chooseInputPort( arg, this ), this ) );
};

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
ReadC.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new ReadC.Go(
        IO.chooseInputPort( args.car(), this ), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
ReadC.Go = function ( port, owner ) {
    Instruction.call( this );
    this.port_ = port;
    this.belongsTo( owner );
};

ReadC.Go.prototype = new Instruction();
ReadC.Go.prototype.implementsAsync = true;
ReadC.Go.prototype.className = "ReadC.Go";

ReadC.Go.prototype.operateAsync = function ( vm, then, opt_sync ) {
    return this.port_.readCharacterAsync( function ( e, result ) {
        if ( e ) return void then( e );
        vm.pushA( result );
        then( null );
    }, opt_sync );
};

ReadC.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/io/Sread.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: Input

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function Sread() {
    Builtin.call( this );
    this.init( "sread" );
}

Sread.prototype = new Builtin();
Sread.prototype.className = "Sread";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
Sread.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new Sread.Go(
        Input.cast( args.car(), this ), args.cdr().car(), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
Sread.Go = function ( port, eof, owner ) {
    Instruction.call( this );
    this.port_ = port;
    this.eof_ = eof;
    this.belongsTo( owner );
};

Sread.Go.prototype = new Instruction();
Sread.Go.prototype.implementsAsync = true;
Sread.Go.prototype.className = "Sread.Go";

Sread.Go.prototype.operateAsync = function ( vm, then, opt_sync ) {
    return this.port_.readObjectAsync( this.eof_, function (
        e, result ) {
        
        if ( e ) return void then( e );
        vm.pushA( result );
        then( null );
    }, opt_sync );
};

Sread.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/fs/Dir.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: System_fs

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function Dir() {
    Builtin.call( this );
    this.init( "dir" );
}

Dir.prototype = new Builtin();
Dir.prototype.className = "Dir";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
Dir.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new Dir.Go(
        ArcString.cast( args.car(), this ).value(), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
Dir.Go = function ( path, owner ) {
    Instruction.call( this );
    this.path_ = path;
    this.belongsTo( owner );
};

Dir.Go.prototype = new Instruction();
Dir.Go.prototype.implementsAsync = true;
Dir.Go.prototype.className = "Dir.Go";

Dir.Go.prototype.operateAsync = function ( vm, then, opt_sync ) {
    return System_fs.dirAsync( this.path_, function ( e, result ) {
        if ( e ) return void then( e );
        vm.pushA( result );
        then( null );
    }, opt_sync );
};

Dir.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/fs/DirExists.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: System_fs ArcObject

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function DirExists() {
    Builtin.call( this );
    this.init( "dir-exists" );
}

DirExists.prototype = new Builtin();
DirExists.prototype.className = "DirExists";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
DirExists.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new DirExists.Go( args.car(), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
DirExists.Go = function ( path, owner ) {
    Instruction.call( this );
    this.path_ = path;
    this.belongsTo( owner );
};

DirExists.Go.prototype = new Instruction();
DirExists.Go.prototype.implementsAsync = true;
DirExists.Go.prototype.className = "DirExists.Go";

DirExists.Go.prototype.operateAsync = function (
    vm, then, opt_sync ) {
    
    return System_fs.dirExistsAsync(
        ArcString.cast( this.path_, this.owner() ).value(),
        function ( e, result ) {
        
        if ( e ) return void then( e );
        vm.pushA( result ? this.path_ : ArcObject.NIL );
        then( null );
    }, opt_sync );
};

DirExists.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/fs/FileExists.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: System_fs ArcObject

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function FileExists() {
    Builtin.call( this );
    this.init( "file-exists" );
}

FileExists.prototype = new Builtin();
FileExists.prototype.className = "FileExists";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
FileExists.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new FileExists.Go( args.car(), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
FileExists.Go = function ( path, owner ) {
    Instruction.call( this );
    this.path_ = path;
    this.belongsTo( owner );
};

FileExists.Go.prototype = new Instruction();
FileExists.Go.prototype.implementsAsync = true;
FileExists.Go.prototype.className = "FileExists.Go";

FileExists.Go.prototype.operateAsync = function (
    vm, then, opt_sync ) {
    
    return System_fs.fileExistsAsync(
        ArcString.cast( this.path_, this.owner() ).value(),
        function ( e, result ) {
        
        if ( e ) return void then( e );
        vm.pushA( result );
        then( null );
    }, opt_sync );
};

FileExists.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/fs/InFile.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: System_fs

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function InFile() {
    Builtin.call( this );
    this.init( "infile" );
}

InFile.prototype = new Builtin();
InFile.prototype.className = "InFile";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
InFile.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new InFile.Go(
        ArcString.cast( args.car(), this ).value(), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
InFile.Go = function ( path, owner ) {
    Instruction.call( this );
    this.path_ = path;
    this.belongsTo( owner );
};

InFile.Go.prototype = new Instruction();
InFile.Go.prototype.implementsAsync = true;
InFile.Go.prototype.className = "InFile.Go";

InFile.Go.prototype.operateAsync = function ( vm, then, opt_sync ) {
    return System_fs.inFileAsync( this.path_, function ( e, result ) {
        if ( e ) return void then( e );
        vm.pushA( new Input( result ) );
        then( null );
    }, opt_sync );
};

InFile.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/fs/OutFile.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: Nil Symbol System_fs

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function OutFile() {
    Builtin.call( this );
    this.init( "outfile" );
}

OutFile.prototype = new Builtin();
OutFile.prototype.className = "OutFile";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
OutFile.prototype.invoke = function ( vm, args ) {
    var name = ArcString.cast( args.car(), this ).value();
    var appendSymbol = args.cdr().car();
    var append = !(appendSymbol instanceof Nil) &&
        Symbol.cast( appendSymbol, this ).name() === "append";
    vm.pushFrame( new OutFile.Go( name, append, this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
OutFile.Go = function ( name, append, owner ) {
    Instruction.call( this );
    this.name_ = name;
    this.append_ = append;
    this.belongsTo( owner );
};

OutFile.Go.prototype = new Instruction();
OutFile.Go.prototype.implementsAsync = true;
OutFile.Go.prototype.className = "OutFile.Go";

OutFile.Go.prototype.operateAsync = function ( vm, then, opt_sync ) {
    return System_fs.outFileAsync( this.name_, this.append_,
        function ( e, result ) {
        
        if ( e ) return void then( e );
        vm.pushA( new Output( result ) );
        then( null );
    }, opt_sync );
};

OutFile.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/fs/MakeDirectory.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: System_fs Truth

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function MakeDirectory() {
    Builtin.call( this );
    this.init( "make-directory" );
}

MakeDirectory.prototype = new Builtin();
MakeDirectory.prototype.className = "MakeDirectory";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
MakeDirectory.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new MakeDirectory.Go(
        ArcString.cast( args.car(), this ).value(), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
MakeDirectory.Go = function ( path, owner ) {
    Instruction.call( this );
    this.path_ = path;
    this.belongsTo( owner );
};

MakeDirectory.Go.prototype = new Instruction();
MakeDirectory.Go.prototype.implementsAsync = true;
MakeDirectory.Go.prototype.className = "MakeDirectory.Go";

MakeDirectory.Go.prototype.operateAsync = function (
    vm, then, opt_sync ) {
    
    return System_fs.makeDirectoryAsync( this.path_, function (
        e, result ) {
        
        if ( e ) return void then( e );
        vm.pushA( result ? Truth.T : Truth.NIL );
        then( null );
    }, opt_sync );
};

MakeDirectory.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/fs/MakeDirectories.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: System_fs Truth

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function MakeDirectories() {
    Builtin.call( this );
    this.init( "make-directory*" );
}

MakeDirectories.prototype = new Builtin();
MakeDirectories.prototype.className = "MakeDirectories";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
MakeDirectories.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new MakeDirectories.Go(
        ArcString.cast( args.car(), this ).value(), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
MakeDirectories.Go = function ( path, owner ) {
    Instruction.call( this );
    this.path_ = path;
    this.belongsTo( owner );
};

MakeDirectories.Go.prototype = new Instruction();
MakeDirectories.Go.prototype.implementsAsync = true;
MakeDirectories.Go.prototype.className = "MakeDirectories.Go";

MakeDirectories.Go.prototype.operateAsync = function (
    vm, then, opt_sync ) {
    
    return System_fs.makeDirectoriesAsync( this.path_, function (
        e, result ) {
        
        if ( e ) return void then( e );
        vm.pushA( result ? Truth.T : Truth.NIL );
        then( null );
    }, opt_sync );
};

MakeDirectories.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/fs/MvFile.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: System_fs ArcObject

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function MvFile() {
    Builtin.call( this );
    this.init( "mvfile" );
}

MvFile.prototype = new Builtin();
MvFile.prototype.className = "MvFile";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
MvFile.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new MvFile.Go(
        ArcString.cast( args.car(), this ).value(),
        ArcString.cast( args.cdr().car(), this ).value(),
        this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
MvFile.Go = function ( opath, npath, owner ) {
    Instruction.call( this );
    this.opath_ = opath;
    this.npath_ = npath;
    this.belongsTo( owner );
};

MvFile.Go.prototype = new Instruction();
MvFile.Go.prototype.implementsAsync = true;
MvFile.Go.prototype.className = "MvFile.Go";

MvFile.Go.prototype.operateAsync = function ( vm, then, opt_sync ) {
    return System_fs.mvFileAsync( this.opath_, this.npath_, function (
        e ) {
        
        if ( e ) return void then( e );
        vm.pushA( ArcObject.NIL );
        then( null );
    }, opt_sync );
};

MvFile.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from functions/fs/RmFile.java
// ===================================================================
// Needed early: Builtin Instruction
// Needed late: System_fs ArcObject

// ASYNC PORT NOTE: This had to be converted to an asynchronous
// design.

/** @constructor */
function RmFile() {
    Builtin.call( this );
    this.init( "rmfile" );
}

RmFile.prototype = new Builtin();
RmFile.prototype.className = "RmFile";

// ASYNC PORT NOTE: The original implemented .invoke( Pair ), but we
// can't do that (since it's synchronous), so we're implementing
// .invoke( VM, Pair ) instead.
RmFile.prototype.invoke = function ( vm, args ) {
    vm.pushFrame( new RmFile.Go(
        ArcString.cast( args.car(), this ).value(), this ) );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
RmFile.Go = function ( path, owner ) {
    Instruction.call( this );
    this.path_ = path;
    this.belongsTo( owner );
};

RmFile.Go.prototype = new Instruction();
RmFile.Go.prototype.implementsAsync = true;
RmFile.Go.prototype.className = "RmFile.Go";

RmFile.Go.prototype.operateAsync = function ( vm, then, opt_sync ) {
    return System_fs.rmFileAsync( this.path_, function ( e ) {
        if ( e ) return void then( e );
        vm.pushA( ArcObject.NIL );
        then( null );
    }, opt_sync );
};

RmFile.Go.prototype.operate = function ( vm ) {
    throw new Error();
};


// ===================================================================
// from Console.java
// ===================================================================
// Needed early: ArcObject Visitor Instruction
// Needed late: Environment VM Symbol ArcParser StringInputPort
// ParseException ArcError System_fs Compiler

// PORT NOTE: This is substantially different from the original.

var Console = {};

Console.o = ArcObject.NIL;
Console.debugJava = false;
Console.stackfunctions = true;

// PORT TODO: If the "options" parameter is going to come from
// someplace that the Closure Compiler won't compile alongside this,
// change this to use things like options[ "nosf" ] which won't be
// minified.
Console.mainAsync = function ( options, then, opt_sync ) {
    var started = new Date().getTime();
    
    // PORT TODO: See if we should implement the original's
    // getArcPath() instead of this.
    var path = options[ "ARC_PATH" ] || [];
    if ( path.indexOf( "." ) === -1 )
        path = [ "." ].concat( path );
    
    var programArgs = Console.parseAll_( options[ "args" ] || [] );
    
    if ( options[ "nosf" ] )
        Console.stackfunctions = false;
    
    Environment.init();
    var vm = new VM();
//    vm.setInterceptor( VMInterceptor.DEBUG );
    
    Symbol.mkSym( "*argv*" ).setValue(
        Pair.buildFrom1( programArgs ) );
    // PORT TODO: Implement *env*.
    Symbol.mkSym( "call*" ).setValue( new Hash() );
    Symbol.mkSym( "sig" ).setValue( new Hash() );
    
    var filesToLoad = (options[ "noLibs" ] ? [] : [
        "arc",
        "strings",
        "lib/bag-of-tricks",
        "rainbow/rainbow",
        "rainbow/rainbow-libs"
    ]).concat( options[ "f" ] || [] );
    
    var achievedSync = true;
    
    if ( !Console.loadAllAsync_( vm, path, filesToLoad, function (
            e ) {
            
            if ( e ) return void then( e );
            
            if ( !Console.interpretAllAsync_(
                    vm, options[ "e" ] || [], function ( e ) {
                    
                    if ( e ) return void then( e );
                    
                    if ( options[ "q" ] ) {
                        then();
                    } else {
                        var ready = new Date().getTime();
                        System_out_println(
                            "repl in " + (ready - started) + "ms" );
                        if ( !Console.replAsync_(
                            vm, then, opt_sync ) )
                            achievedSync = false;
                    }
                }, opt_sync ) )
                achievedSync = false;
        }, opt_sync ) )
        achievedSync = false;
    
    return achievedSync;
};

Console.parseAll_ = function ( list ) {
    var result = [];
    for ( var i = 0, len = list.length; i < len; i++ ) {
        // PORT NOTE: This local variable didn't exist in Java.
        var it = list[ i ];
        // PORT NOTE: This was a cast in Java.
        if ( Object.prototype.toString.call( it ) !==
            "[object String]" )
            throw new TypeError();
        result.push( ArcParser.readFirstObjectFromString( "" + it ) );
    }
    return result;
};

Console.loadAllAsync_ = function (
    vm, arcPath, files, then, opt_sync ) {
    
    var thisSync = true;
    var n = files.length;
    function next( i ) {
        if ( i === n )
            return void then();
        var file = files[ i ];
        if ( !Console.loadFileAsync( vm, arcPath, file,
                function ( e ) {
                if ( e ) return void then( e );
                next( i + 1 );
            }, opt_sync ) )
            thisSync = false;
    }
    next( 0 );
    return thisSync;
};

Console.interpretAllAsync_ = function (
    vm, expressionsToEval, then, opt_sync ) {
    
    var sb = [];
    for ( var i = 0, len = expressionsToEval.length; i < len; i++ ) {
        var arg = expressionsToEval[ i ];
        // PORT NOTE: This was a cast in Java.
        if ( Object.prototype.toString.call( arg ) !==
            "[object String]" )
            throw new TypeError();
        sb.push( arg + " " );
    }
    var input = new StringInputPort( sb.join( "" ) ).unwrap();
    
    var achievedSync = true;
    function read( e, expression ) {
        if ( e ) return void then( e );
        if ( expression === null ) return void then();
        if ( !Console.interpretAsync_( vm, expression, function (
            e ) {
            
            if ( e ) return void then( e );
            if ( !ArcParser.readObjectAsync( input, read, opt_sync ) )
                achievedSync = false;
        }, opt_sync ) )
            achievedSync = false;
    }
    if ( !ArcParser.readObjectAsync( input, read, opt_sync ) )
        achievedSync = false;
    return achievedSync;
};

Console.replAsync_ = function ( vm, then, opt_sync ) {
    System_out_print( "arc> " );
    var achievedSync = true;
    var done = false;
    while ( !done ) {
        if ( !ArcParser.readObjectAsync( System_in, function (
                e, expression ) {
                
                if ( e ) {
                    if ( !(e instanceof ParseException) )
                        return void then( e );
                    printStackTrace( e );
                    if ( !achievedSync )
                        Console.replAsync_( vm, then, opt_sync );
                    return;
                }
                if ( expression === null ) {
                    done = true;
                    if ( !achievedSync )
                        then();
                    return;
                }
                if ( !Console.interpretAsync_( vm, expression,
                        function ( e ) {
                        
                        if ( e ) return void then( e );
                        if ( !achievedSync )
                            Console.replAsync_( vm, then, opt_sync );
                    }, opt_sync ) )
                    achievedSync = false;
            }, opt_sync ) )
            achievedSync = false;
            
        if ( !achievedSync )
            return false;
    }
    then();
    return true;
};

Console.interpretAsync_ = function (
    vm, expression, then, opt_sync ) {
    
    return Console.compileAndEvalAsync_( vm, expression,
        function ( e, result ) {
        
        if ( e ) {
            if ( !(e instanceof ArcError) ) return void then( e );
            System_out_println( "Message    : " + e.getMessage() );
            System_out_print( "Java stack : " );
            printStackTrace( e, System_out );
            then();
            return;
        }
        System_out_println( result );
        then();
    }, opt_sync );
};

// PORT TODO: See if this should be changed to consume only a constant
// number of stack frames, rather than a number proportional to
// arcPath.length.
Console.findAsync = function ( arcPath, filePath, then, opt_sync ) {
    // PORT NOTE: The original used File.separator.
    // PORT TODO: See if we should stop hardcoding the path separator.
    var options = [];
    var originalLength = arcPath.length;
    for ( var i = 0; i < originalLength; i++ ) {
        var base = "" + arcPath[ i ] + "/" + filePath;
        options.push( base, base + ".arc" );
    }
    var finalLength = options.length;
    var thisSync = true;
    function findNext( i ) {
        if ( i === finalLength )
            return void then( new Error(
                "Could not find " + filePath + " under " +
                JSON.stringify( arcPath ) ) );
        var option = options[ i ];
        if ( !Console.isValidSourceFileAsync_( option,
                function ( e, valid ) {
                if ( e ) return void then( e );
                if ( valid )
                    return void then( null, option );
                findNext( i + 1 );
            }, opt_sync ) )
            thisSync = false;
    }
    findNext( 0 );
    return thisSync;
};

Console.loadFileAsync = function (
    vm, arcPath, path, then, opt_sync ) {
    
    var thisSync = true;
    var f = path;
    function finish( f ) {
        if ( !System_fs.inFileAsync( f, function ( e, stream ) {
                if ( e ) return void then( e );
                if ( !Console.loadAsync(
                    vm, stream, then, opt_sync ) )
                    thisSync = false;
            }, opt_sync ) )
            thisSync = false;
    }
    // PORT TODO: Stop checking if the path is valid if it isn't
    // absolute. To accomplish this, we may want to add a System_fs
    // interface for normalizing paths. Confer with the original.
    if ( !Console.isValidSourceFileAsync_( f, function ( e, valid ) {
            if ( e ) return void then( e );
            if ( valid ) {
                finish( f );
            } else {
                if ( !Console.findAsync( arcPath, path,
                        function ( e, f ) {
                        
                        if ( e ) return void then( e );
                        finish( f );
                    }, opt_sync ) )
                    thisSync = false;
            }
        }, opt_sync ) )
        thisSync = false;
    return thisSync;
};

// PORT TODO: See if this should be changed to consume only a constant
// number of stack frames, rather than a number proportional to the
// number of commands available in the stream without blocking.
Console.loadAsync = function ( vm, stream, then, opt_sync ) {
    var thisSync = true;
    if ( !ArcParser.readObjectAsync( stream, function ( e, command ) {
            if ( e ) return void then( e );
            if ( command === null )
                return void then();
            if ( !Console.compileAndEvalAsync_( vm, command,
                    function ( e, result ) {
                    
                    if ( e ) return void then( e );
                    if ( !Console.loadAsync(
                        vm, stream, then, opt_sync ) )
                        thisSync = false;
                }, opt_sync ) )
                thisSync = false;
        }, opt_sync ) )
        thisSync = false;
    return thisSync;
};

// PORT NOTE: This was an anonymous class in Java.
/** @constructor */
Console.Anon_mkVisitor_ = function ( owner ) {
    Visitor.call( this );
    this.owner_ = owner;
};

Console.Anon_mkVisitor_.prototype = new Visitor();
Console.Anon_mkVisitor_.prototype.className =
    "Console.Anon_mkVisitor_";

Console.Anon_mkVisitor_.prototype.acceptInstruction = function ( o ) {
    o.belongsTo( this.owner_ );
};

Console.mkVisitor_ = function ( owner ) {
    return new Console.Anon_mkVisitor_( owner );
};

Console.compileAndEvalAsync_ = function (
    vm, expression, then, opt_sync ) {
    
    vm.pushFrame( new Console.CompileAndEval( expression ) );
    return vm.threadAsync( then, opt_sync );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
Console.CompileAndEval = function ( expression ) {
    Instruction.call( this );
    this.expression_ = expression;
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo(
        ArcString.make( "Console.compileAndEvalAsync_" ) );
};

Console.CompileAndEval.prototype = new Instruction();
Console.CompileAndEval.prototype.className = "Console.CompileAndEval";

Console.CompileAndEval.prototype.operate = function ( vm ) {
    vm.pushFrame( new Console.AndEval() );
    Compiler.compile( vm, this.expression_, [] );
};

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
Console.AndEval = function () {
    Instruction.call( this );
    // ASYNC PORT TODO: Come up with a better owner for this.
    this.belongsTo(
        ArcString.make( "Console.compileAndEvalAsync_" ) );
};

Console.AndEval.prototype = new Instruction();
Console.AndEval.prototype.className = "Console.AndEval";

Console.AndEval.prototype.operate = function ( vm ) {
    var expression = vm.popA().reduce();
    var i = [];
    expression.addInstructions( i );
    var instructions = Pair.buildFrom1( i );
    instructions.visit( Console.mkVisitor_( expression ) );
    vm.pushInvocation2( null, instructions );
};

Console.isValidSourceFileAsync_ = function ( f, then, opt_sync ) {
    return System_fs.fileExistsAsync( f, then, opt_sync );
};


// ===================================================================
// from functions/threads/NewThread.java
// ===================================================================
// Needed early: Builtin
// Needed late: ArcError

// PORT NOTE: This is just here so that src/arc/rainbow/profile.arc
// can load.
// PORT TODO: Figure out whether it's even appropriate to keep this in
// here.

/** @constructor */
function NewThread() {
    Builtin.call( this );
    this.init( "new-thread" );
}

NewThread.prototype = new Builtin();
NewThread.prototype.className = "NewThread";

NewThread.prototype.invokePair = function ( args ) {
    throw new ArcError( "Rainbow.js doesn't support new-thread." );
};


// ===================================================================
// Port-specific things for asynchronous IO
// ===================================================================
// Needed early: Instruction

// ASYNC PORT NOTE: This didn't exist in Java.
/** @constructor */
function BindAndRun( lc, instructions, owner ) {
    Instruction.call( this );
    this.lc_ = lc;
    this.instructions_ = instructions;
    this.belongsTo( owner );
};

BindAndRun.prototype = new Instruction();
BindAndRun.prototype.className = "BindAndRun";

BindAndRun.prototype.operate = function ( vm ) {
    this.lc_.add( vm.popA() );
    vm.pushInvocation2( this.lc_, this.instructions_ );
};



/*

(Search for "ASYNC PORT TODO" and "ASYNC PORT NOTE" to see progress on
this.)

Places that need to be changed if input is to be asynchronous:

* = already has an asynchronous equivalent ready to go (and yep,
that's all of them)


*|ComplexArgs.evalOptional_()
*|  ComplexArgs.complex_()
*|    ComplexArgs.prototype.invoke3()
*|Bind_A_Oother.prototype.invokeN1()
*|Bind_Oother.prototype.invokeN0()
*|ArcObject.prototype.invokeAndWait()
*|  Compiler.compilePair()
*|    Compiler.compile()
*|      AssignmentBuilder.build()
*|      FunctionParameterListBuilder.buildParams_()
*|        FunctionParameterListBuilder.build()
*|          FunctionBodyBuilder.build()
*|      IfBuilder.build()
*|      InvocationBuilder.build()
*|      PairExpander.expand()
*|        FunctionBodyBuilder.build()
*|      QuasiQuoteCompiler.compileUnquote_()
*|        QuasiQuoteCompiler.compile()
*|      Eval.prototype.invoke()
*|  Compiler.atString_()
*|    Compiler.compile()
*|  Macex.prototype.invoke()
*|Tagged.prototype.stringify_()
*|  Tagged.prototype.toString()
*|VM.prototype.thread2()


// ASYNC PORT TODO: Use VM.threadAsync() for something.

*/
