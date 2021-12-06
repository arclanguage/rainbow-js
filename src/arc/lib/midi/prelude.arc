(require-lib 'lib/midi/midi)

(def measure (base i1 i2 i3 i4)
  (= i1 (base 'transpose i1)
     i2 (i1 'transpose i2)
     i3 (i2 'transpose i3)
     i4 (i3 'transpose i4))
  (let f (fn (v)
             (+ (list:list (base v 8) '(pause 1))
                (list:list (i1 75 7) '(pause 1))
                (mono (i2 75 1)
                      (i3 75 1)
                      (i4 82 1)
                      (i2 75 1)
                      (i3 75 1)
                      (i4 75 1)) ))
    (+ (f 105) (f 93))))

(def end-measure (n1 n2 n3 n4 n5 n6 last4)
  (+ (list:list (n1 100 16) '(pause 1))
     (list:list (n2 75 15)  '(pause 1))
     (mono (n3 75 1) (n4 75 1))
   (s5/0/-3   n5 85)
   (s-3/-7/-3 n5 92)
   (last4  n6 85)  ))

(def home (base) (measure base 4 3 5 4))
(def tall (base) (measure base 4 5 7 5))
(def dimi (base) (measure base 3 6 3 6))
(def psg1 (base) (+
  (measure base       3 5 7 5)
  (measure base       1 4 3 5)
  (measure (base 'transpose -2) 3 4 3 5)
  (measure (base 'transpose -9) 7 5 4 6)
  (home (base 'transpose -4))))
(def psg2 () (+
  (measure g2 7 5 5 5)
  (measure g2 7 5 4 6)))

(= measure/-3 (end-measure c2 c3 f3 a3 c4 f3 s-3/0/-3)
   measure/-2 (end-measure c2 b2 g4 b4 d5 d4 s3/2/0)
   measure/-1 (list (chord c2 '(12 16 3 5) 100 16)) )

(defseq prelude-measures
             '((instrument 0 6))
               (home c4)
               (measure c4 2 7 5 3)
               (measure b3 3 5 7 3)
               (home c4)
               (tall c4)
               (measure c4 2 4 3 5)
               (psg1 b3)
               (dimi g3)
               (tall f3)
               (dimi f3)
               (psg1 e3)
               (measure c3  7 3 2 4)
               (measure f2 12 4 3 4)
               (measure f2s 6 9 3 3)
               (measure g2s 9 6 1 2)
               (measure g2 10 2 4 3)
               (measure g2  9 3 5 4)
               (psg2)
               (measure g2 8 6 3 6)
               (measure g2 9 3 5 7)
               (psg2)
               (measure c2 12 7 3 6)
               measure/-3
               measure/-2
               measure/-1)
