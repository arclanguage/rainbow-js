// rainbow.test.js
//
// Unit tests for rainbow.js.

//   Copyright (c) 2011 the Rainbow.js authors.
//   Licensed under the Perl Foundations's Artistic License 2.0.

// TODO: Make this file actually do something. These are currently
// just suggested tests for putting into a test framework later on.

/*

arc> `(1)
(1)
arc> `(1 ,2)
(1 2)
arc> `(1 ,readc)
(1 [builtin:readc])
arc> `(1 . ,2)
(1 . 2)
arc> `,2
2
arc> `(1 `(2 ,(3 ,4)))
(1 `(2 ,(3 4)))
arc> `(1 ,@'(2 3) 4)
(1 2 3 4)
arc> ((fn (a b c) 3) 4 5 6)
3
arc> ((fn (a b) 3) 4 5)
3
arc> ((fn (a . b) b) 1 2 3 4)
(2 3 4)
arc> ((fn ((o a 1) . b) b) 1 2 3 4)
(2 3 4)
arc> (assign call (fn (func . args) (apply func args)))
(fn (func . args) (apply func args))
arc> (call (fn (a) (+ a 2)) 4)
6
arc> ((fn ((a b)) ((fn a a) b a)) '(1 2))
(2 1)
arc> ((fn ((a b c d e f)) ((fn a a) f e d c b a)) '(1 2))
(nil nil nil nil 2 1)
arc> ((fn ((a b c d e f)) ((fn a a) f e d c b a)) '(1 2 3 4 5 6))
(6 5 4 3 2 1)
arc> (call (fn ((a b c d e f)) ((fn a a) f e d c b a)) '(1 2 3 4 5 6))
(6 5 4 3 2 1)


This was particularly troublesome. It's based on 'unique-id from
srv.arc. The problem turned out to be a mistake in translating Java's
Object.clone() to JavaScript. We just constructed every clone using
"new InterpretedFunction()" rather than its own constructor, and this
gave the clones the wrong methods.

arc> (fn ((o opt 8)) (fn (res val) ((fn (var) res) val)))

*/

// These produce errors in both Rainbow.js and the Java version:

/*

arc> (fn ((a b c d e f)) ((fn a a) f e d c b a))
arc> (fn a ((fn a)))
arc> (if)

*/

// TODO: Fix the following.

/*

// This one might be confusing since it involves at least two other
// errors. First of all, it's supposed to result in an error since
// the argument list is the wrong size and 1 can't be destructured as
// a pair. Secondly, it falls into the same
// lambda-in-functional-position-in-another-lambda corner case as
// (fn a ((fn a))) above, so there's an error in Java Rainbow. If we
// replace (fn a a) with 'list, we get the correct error, but if we
// leave it this way, we instead get an apparently infinite loop.
// Maybe an error occurs during the process of stringifying the
// function to generate the error message.
arc> ((fn ((a b c d e f)) ((fn a a) f e d c b a)) 1 2 3 4 5 6)

arc> (call (fn ((a b c d e f)) ((fn a a) f e d c b a)) 1 2 3 4 5 6)

*/
