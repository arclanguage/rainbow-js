# Rainbow.js

[![CI](https://github.com/arclanguage/rainbow-js/actions/workflows/ci.yml/badge.svg)](https://github.com/arclanguage/rainbow-js/actions/workflows/ci.yml)

Rainbow.js is an implementation of the [Arc programming language](https://arclanguage.github.io/) for JavaScript. It's a port of Conan Dalton's [Rainbow](https://github.com/conanite/rainbow), a performant implementation of Arc for Java.

Compared to Rainbow, Rainbow.js isn't quite as full-featured. Pieces that are missing include threads, a Java FFI, the `system` function, and sockets. In principle, some of these features could be added. Some, like threads, were only ever skipped because Rocketnia didn't realize it was possible to translate them to JavaScript at first. :)

To use Rainbow.js at the command line, first install Node.js, and then run the following command to install the `rainbow-js-arc` command:

```bash
npm install --global rainbow-js-arc
```

Then, pick a directory you'd like to run Arc from. This directory will need a number of libraries like arc.arc in it. The rainbow-js-arc command lets you copy those libraries into your chosen directory like so, where `<my-arc-host-dir>` is the directory's path:

```bash
rainbow-js-arc init-arc <my-arc-host-dir>
```

Then you can run commands similar to those of Java Rainbow, using `rainbow-js-arc run-compat [args...]` from within that directory. For instance, `rainbow-js-arc run-compat` runs a REPL, `rainbow-js-arc run-compat --help` displays information about other options, and `rainbow-js-arc run-compat -e '(prn "Hello, world!")' -q` displays "Hello, world!" and quits. More usage scenarios are documented in the [readme for Java Rainbow](https://github.com/conanite/rainbow#readme).

> ℹ️ For a better REPL experience, we recommend installing `rlwrap` and using `rlwrap rainbow-js-arc run-compat`.

Once you've copied the Arc core libraries into a directory, there isn't any easy way to upgrade or uninstall them except by deleting the directory and rebuilding it again. We recommend treating the Arc host directory as a build target and using a build script to copy in any libraries you want to add or patches you want to apply. Alternatively, you could use Git to track changes to the directory, so that in case it gets messed up when you try to upgrade or uninstall something by hand, you can restore a previous state.

Besides being usable from the command line, Rainbow.js can also be used from the browser. You can play around with a Rainbow.js REPL on the web [here](https://arclanguage.github.io/rainbow-js/test/) (or [here](https://arclanguage.github.io/rainbow-js/test/#libs), which loads the core Arc libraries and takes slightly more resources to do so).

Minified with the Closure Compiler, and without the core Arc libraries, Rainbow.js comes out to about 156KiB. The minification command we're using for the web REPL is like this, where index-first.js and index-last.js implement the REPL and the I/O primitives needed by Rainbow.js:

```bash
java -jar compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS \
  --js index-first.js --js rainbow.js --js index-last.js \
  --js_output_file index-min.js
```


## Priorities of Rainbow.js

Rainbow.js is split between being a faithful implementation of Arc and being a faithful port of Java Rainbow. Originally, we preferred to be faithful to Java Rainbow in a bug-for-bug way so that the maintenance of one codebase could be translated to the other. However, there have been many places where a more significant refactoring has been needed, and there have been a few pieces of functionality (such as the JavaScript FFI and `quit`'s status code support) that have been implemented despite not existing in Java Rainbow.

The reason we ported Rainbow was its performance. Rainbow.js is a rather faithful Arc implementation, complete with continuation support, and it was also the fastest one among the options at the time. Rainbow.js has been written with the Closure Compiler in mind to help ensure that performance carries over. In practice, it seems to have carried over well enough to provide a fast-loading REPL, although we still haven't properly properly tested this. (TODO: Run Rainbow's benchmark suite.)

The reason we ported Rainbow to JavaScript was JavaScript's cross-platform availability. In 2012, JavaScript was one of the only languages that could be used on an iOS device. As of 2022, many more languages compile to JavaScript and/or WebAssembly and have source map support for debugging purposes, so this may be a decision worth revisiting at some point.


## Future goals

Rainbow.js is maintained in basically one giant file of more than 10,000 lines of code, primarily because Rocketnia wasn't familiar with any easy way to find and replace text across multiple files. We might do something about that someday, possibly bringing the directory structure more in line with that of Java Rainbow.

Rocketnia observed in 2012 that simple Rainbow.js-based test applications that *didn't* have a full REPL could minify down to a smaller size. However, it wasn't very much smaller at the time. Ideally, if a Rainbow.js application only uses the compiler during initialization, we'd like the Closure Compiler to be able to weed out the whole Rainbow.js compiler as dead code. In 2022, ihe Closure Compiler is still one of the go-to options for JavaScript applications where tree-shaking of dead code is critical, so we may just need to try again (and possibly add a lot more type annotations to the code).

The JavaScript FFI capabilities of Rainbow.js could use some more attention. Presently, Rainbow.js just implements `java-invoke` in a way that imitates the way it works in Java Rainbow. Not only is "`java-invoke`" a misnomer in the Rainbow.js context, but it's not a full-featured FFI. The Rainbow.js web REPL also provides the `window` object, which makes it possible to `java-invoke` JavaScript's `eval` function to access JavaScript's other functionality, but some of the automatic type conversions `java-invoke` provides could make it difficult to pass certain JavaScript values around without them being subtly adjusted on their way through.


## Differences from Java Rainbow

Despite the focus on keeping the Rainbow.js code similar to the Java Rainbow code, it differs in at least the following ways:

* There is no support for threads or Java-specific operations. However, for certain thread operations and Java-specific operations that make sense in a single-threaded JavaScript program (even if they don't do anything useful!), a JavaScript equivalent is given under the same name.

* Input streams in the implementation of Rainbow.js are asynchronous, but in the language itself, they're still synchronous. This is done by making the evaluation model itself asynchronous. Actually, there's still one place where Arc code is run synchronously: when calculating the `toString` of a Rainbow tagged value. If input would block in this context, an `ArcError` is thrown instead.

* In order to allow for asynchronous I/O during the macroexpansion of an expression, compilation is now performed by way of `Instruction`s, the same way as execution is performed. For example, in Java Rainbow, calling `eval` creates a new VM object, whereas in Rainbow.js, it uses the same VM it's executing in. This means the behavior of capturing a continuation during compile time (during the expansion of a macro) may be quite different. For the moment, we recommend not actually capturing continuations at that time; the instructions are currently implemented in terms of a lot of mutation "on the heap," which a captured continuation won't restore, so it's bound to be a bit unreliable.

* The Java version of Rainbow uses the Java/CC parser generator. As of 2012, we've found no suitable replacement for that in JavaScript. Most JavaScript-targeting parser generators support parsing from strings but don't support incremental parsing from streams (which was to be expected in 2012, considering the fact that JavaScript did't really have a standard, widely used stream type), and although ANTLR seemed to be a bit of an exception, ANTLR's support for JavaScript seemed unstable. Instead of bothering to port the Java/CC grammar specification to use with some other grammar-based parser that doesn't give us what we need, we've hand-rolled a recursive descent parser. Our parser actually implements a syntax that's not quite the same as Rainbow's, in order to make the implementation easier. Where it differs from Rainbow (e.g. the way it parses `(#\newlyne)` as an error rather than as `(#\n ewlyne)`), it may be closer in behavior to other implementations of Arc.

* The `quit` function now uses its argument as the exit code if it's a number between 1 and 255, inclusive. Otherwise, it exits with an exit code of 0. This is consistent with the Racket implementations of Arc, which just use Racket's `exit` to implement `quit`, and it's handy for implementing continuous integration scripts. Currently, in Java Rainbow, `quit` ignores its argument and always exits with a status code of 0.

* Rainbow.js defines `peekc` from Arc, which Java Rainbow doesn't define.

* Rainbow.js has a modified version of rainbow/rainbow-libs.arc that doesn't load these Java-specific libraries:

  * rainbow/welder.arc
  * rainbow/fsb.arc
  * rainbow/tetris.arc
  * rainbow/mines.arc

There are other significant design issues worth mentioning, which we *don't* consider code differences:

* Where Java Rainbow uses doubles, longs, ints, and chars, Rainbow.js uses JavaScript numbers. These are 64-bit floating point values, with about 53 bits of precision when used for exact integer calculations. Some floating-point calculations and some calculations on very large integers may not be perfectly consistent with Rainbow.

* Where Java Rainbow relies on the platform's default charset for the purposes of mapping bytes to characters and vice versa, Rainbow.js currently uses big-endian UTF-16, since `String.prototype.charCodeAt` returns UTF-16 code units. The big endianness was chosen rather arbitrarily, but at least this way, `str.getCharCodeAt( i ).toString( 16 )` shows the nibbles in the same order as they appear in the stream.
