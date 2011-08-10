// rainbow.test.js
//
// Unit tests for rainbow.js.

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

*/

// These produce errors in both Rainbow.js and the Java version:

/*

arc> (fn ((a b c d e f)) ((fn a a) f e d c b a))
arc> (if)

*/

// TODO:

/*

arc> (fn a ((fn a)))
arc> (call (fn ((a b c d e f)) ((fn a a) f e d c b a)) 1 2 3 4 5 6)

*/
