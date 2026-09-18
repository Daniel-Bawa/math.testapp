# MATH AI KNOWLEDGE BASE — APP BUILD v1

Purpose: a single, structured, script/AI-readable index of the mathematics textbooks held
in `App/knowledge/`. It is the data layer for the Math AI site built in `App/site/`.

Scope: this file is an index and normalization layer, not a reproduction of the source
books. Each topic record identifies source coverage, subject area, difficulty and page
references, and summarizes the topic in original wording. Detailed explanations, worked
examples, practice questions and answer keys are authored later as the base is expanded,
always with source attribution. No textbook prose is reproduced here.

## STANDARD TOPIC SCHEMA

Each topic record is a block opened by `TOPIC_ID` and closed by `END_TOPIC`, using
`FIELD: value` lines. The fields used in this build are:

- TOPIC_ID — stable identifier, prefixed per source (see the ID scheme in BUILD NOTES).
- TOPIC_NAME — the topic's title.
- SUBJECT_AREA — the branch of mathematics it belongs to.
- SOURCE_DOCUMENT — the SOURCE_NN key of the book it comes from.
- SOURCE_LOCATION — chapter/programme/module plus the printed page range.
- LEVEL — Foundation, Intermediate or Advanced.
- KEY_CONCEPTS — semicolon-separated list of the ideas the topic covers.
- OVERVIEW — a one- or two-sentence summary in original wording.

Later expansions may also use: LEARNING_OBJECTIVES, DEFINITIONS, RULES_AND_PRINCIPLES,
FORMULAS, METHODS_AND_PROCEDURES, WORKED_EXAMPLES, STEP_BY_STEP_SOLUTIONS,
COMMON_MISTAKES, PROBLEM_SOLVING_STRATEGIES, PRACTICE_QUESTIONS, ANSWERS, DIFFICULTY,
RELATED_TOPICS, SOURCE_VARIATION and CONFIDENCE.

## SOURCE DOCUMENTS

SOURCE_01 | Foundation Discrete Mathematics for Computing | Dexter J. Booth | 1st ed., 1995 | 311 pp | Discrete mathematics for computer science
SOURCE_02 | Advanced Engineering Mathematics | K. A. Stroud with additions by Dexter J. Booth | 5th ed. | 1136 pp | Advanced engineering mathematics for later undergraduate years
SOURCE_03 | Engineering Mathematics | K. A. Stroud with Dexter J. Booth | 8th ed., 2020 | 1181 pp | Core engineering mathematics, foundation topics through transform methods
SOURCE_04 | Foundation Mathematics | K. A. Stroud with Dexter J. Booth | 2009 | 753 pp | Pre-degree foundation mathematics
SOURCE_05 | Engineering Mathematics | K. A. Stroud with additions by Dexter J. Booth | 6th ed., 2007 | 1290 pp | Earlier edition of SOURCE_03; foundation topics plus part II
SOURCE_06 | Engineering Mathematics | K. A. Stroud | 7th ed. | uploaded copy: 122 pp, no text layer | Pending OCR, not content-indexed

## TOPIC MAP — SOURCE 01: FOUNDATION DISCRETE MATHEMATICS FOR COMPUTING

TOPIC_ID: DM-01
TOPIC_NAME: Propositions: either true or false
SUBJECT_AREA: Foundations of Logic
SOURCE_DOCUMENT: SOURCE_01
SOURCE_LOCATION: SOURCE_01 Ch. 1 (pp. 2-27)
LEVEL: Foundation
KEY_CONCEPTS: propositions; logical connectives AND, OR and NOT; compound propositions; truth tables; logical equivalence; symbolic translation; switching circuits
OVERVIEW: Introduces sentences that are either true or false, shows how AND, OR and NOT build compound propositions, and tabulates their behaviour in truth tables that also model switching circuits.
END_TOPIC

TOPIC_ID: DM-02
TOPIC_NAME: Truth and consequences
SUBJECT_AREA: Foundations of Logic
SOURCE_DOCUMENT: SOURCE_01
SOURCE_LOCATION: SOURCE_01 Ch. 2 (pp. 28-58)
LEVEL: Foundation
KEY_CONCEPTS: implication; implication truth table; Boolean variables; biconditional; necessity and sufficiency; logical equivalence; rules of logic; converse, inverse and contrapositive
OVERVIEW: Adds the implication and biconditional connectives, defines logical equivalence through matching truth tables, and gathers the rules used to simplify compound propositions.
END_TOPIC

TOPIC_ID: DM-03
TOPIC_NAME: Sets and numbers
SUBJECT_AREA: Sets, Lists and Counting
SOURCE_DOCUMENT: SOURCE_01
SOURCE_LOCATION: SOURCE_01 Ch. 3 (pp. 61-107)
LEVEL: Foundation
KEY_CONCEPTS: data types and sets; membership; subsets; universal set and complement; power set; cardinality; union and intersection; Venn diagrams; partitions; numbers
OVERVIEW: Treats sets as the language of data types, covering membership, subsets, the power set, the operations of union, intersection and complement, partitions and their Venn-diagram representation.
END_TOPIC

TOPIC_ID: DM-04
TOPIC_NAME: Counting
SUBJECT_AREA: Sets, Lists and Counting
SOURCE_DOCUMENT: SOURCE_01
SOURCE_LOCATION: SOURCE_01 Ch. 4 (pp. 108-148)
LEVEL: Foundation
KEY_CONCEPTS: lists and list operations; append, head, tail and length; Cartesian product; ordered pairs and n-tuples; factorials; permutations; combinations; Pascal's triangle; combinatorics
OVERVIEW: Contrasts ordered lists with sets, then develops counting through the Cartesian product, factorials, permutations and combinations, with Pascal's triangle reading off binomial coefficients.
END_TOPIC

TOPIC_ID: DM-05
TOPIC_NAME: Predicate calculus
SUBJECT_AREA: Further Logic
SOURCE_DOCUMENT: SOURCE_01
SOURCE_LOCATION: SOURCE_01 Ch. 5 (pp. 151-170)
LEVEL: Intermediate
KEY_CONCEPTS: predicates; open sentences; universal quantifier; existential quantifier; quantified propositions; negating quantified propositions; counterexamples
OVERVIEW: Extends propositional logic to open sentences containing variables, introduces the universal and existential quantifiers, and shows how negating a quantified statement swaps its quantifier.
END_TOPIC

TOPIC_ID: DM-06
TOPIC_NAME: Proof
SUBJECT_AREA: Further Logic
SOURCE_DOCUMENT: SOURCE_01
SOURCE_LOCATION: SOURCE_01 Ch. 6 (pp. 171-194)
LEVEL: Intermediate
KEY_CONCEPTS: arguments and validity; syllogisms; modus ponens; modus tollens; axioms; assumptions; proof by contradiction; rules of natural deduction
OVERVIEW: Examines what makes an argument valid, sets out the roles of axioms and temporary assumptions, and presents proof by contradiction alongside the rules of natural deduction.
END_TOPIC

TOPIC_ID: DM-07
TOPIC_NAME: Relations
SUBJECT_AREA: Relations and Functions
SOURCE_DOCUMENT: SOURCE_01
SOURCE_LOCATION: SOURCE_01 Ch. 7 (pp. 197-242)
LEVEL: Intermediate
KEY_CONCEPTS: relationships and relations; binary relations; digraphs; reflexivity; antisymmetry; transitivity; order relations; equivalence relations and classes; trees
OVERVIEW: Defines relations as sets of ordered tuples, classifies them by reflexivity, antisymmetry and transitivity, and separates order relations from equivalence relations, with trees as a related structure.
END_TOPIC

TOPIC_ID: DM-08
TOPIC_NAME: Functions
SUBJECT_AREA: Relations and Functions
SOURCE_DOCUMENT: SOURCE_01
SOURCE_LOCATION: SOURCE_01 Ch. 8 (pp. 243-293)
LEVEL: Intermediate
KEY_CONCEPTS: input/process/output systems; functions as rules; domain and range; total and partial functions; pre- and post-conditions; mappings; composition; inverse functions; recursive processes; multivariable functions
OVERVIEW: Presents a function as the processing unit that turns each input into a single output, covering domain, range, partial versus total functions, mappings, composition, inverses and recursion.
END_TOPIC

## TOPIC MAP — SOURCE 02: ADVANCED ENGINEERING MATHEMATICS (5TH ED.)

TOPIC_ID: AEM-01
TOPIC_NAME: Numerical solutions of equations and interpolation
SUBJECT_AREA: Numerical Methods
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 1 (pp. 1-45)
LEVEL: Advanced
KEY_CONCEPTS: polynomial roots; bisection; fixed-point iteration; spreadsheet methods; Newton-Raphson; modified Newton-Raphson; linear and graphical interpolation; finite differences; Lagrange interpolation
OVERVIEW: Methods for locating roots of equations that have no algebraic solution, together with interpolation techniques for estimating values between known data points.
END_TOPIC

TOPIC_ID: AEM-02
TOPIC_NAME: Laplace transforms 1
SUBJECT_AREA: Transforms and Differential Equations
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 2 (pp. 46-91)
LEVEL: Advanced
KEY_CONCEPTS: Laplace transform; first shift theorem; multiplication and division rules; inverse transforms; partial fractions; differential equations; first- and second-order equations; simultaneous equations
OVERVIEW: Introduces the Laplace transform and its inverse, then applies them to solve first- and second-order linear differential equations and simultaneous systems.
END_TOPIC

TOPIC_ID: AEM-03
TOPIC_NAME: Laplace transforms 2
SUBJECT_AREA: Transforms and Differential Equations
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 3 (pp. 92-122)
LEVEL: Advanced
KEY_CONCEPTS: Heaviside unit step; second shift theorem; differential equations with step functions; convolution; convolution theorem
OVERVIEW: Extends the transform to discontinuous inputs using the Heaviside unit step and the second shift theorem, and introduces convolution and its theorem.
END_TOPIC

TOPIC_ID: AEM-04
TOPIC_NAME: Laplace transforms 3
SUBJECT_AREA: Transforms and Applications
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 4 (pp. 123-154)
LEVEL: Advanced
KEY_CONCEPTS: periodic functions; inverse transforms; Dirac delta (unit impulse); impulse differential equations; harmonic oscillators; damping; forced motion; resonance
OVERVIEW: Applies the transform to periodic and impulsive forcing, modelling damped and forced harmonic oscillators and the phenomenon of resonance.
END_TOPIC

TOPIC_ID: AEM-05
TOPIC_NAME: Difference equations and the Z transform
SUBJECT_AREA: Discrete and Transform Methods
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 5 (pp. 155-192)
LEVEL: Advanced
KEY_CONCEPTS: sequences; difference equations; particular solutions; Z transform; shift theorems; inverse transforms; initial and final value theorems; sampling
OVERVIEW: Covers the discrete-time counterpart of the Laplace transform: difference equations solved with the Z transform, including the shift theorems and initial- and final-value results.
END_TOPIC

TOPIC_ID: AEM-06
TOPIC_NAME: Introduction to invariant linear systems
SUBJECT_AREA: Systems
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 6 (pp. 193-235)
LEVEL: Advanced
KEY_CONCEPTS: input-response relationships; linearity; time (shift) invariance; differential and difference equations; impulse response; transfer functions
OVERVIEW: Describes systems whose behaviour does not change with time, defining linearity and shift invariance and linking impulse response to transfer functions.
END_TOPIC

TOPIC_ID: AEM-07
TOPIC_NAME: Fourier series 1
SUBJECT_AREA: Fourier Analysis
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 7 (pp. 236-266)
LEVEL: Advanced
KEY_CONCEPTS: periodic functions; harmonics; orthogonal functions; Fourier series; Dirichlet conditions; Gibbs phenomenon
OVERVIEW: Builds periodic functions as sums of harmonics, deriving Fourier series and discussing the conditions for convergence and the Gibbs overshoot.
END_TOPIC

TOPIC_ID: AEM-08
TOPIC_NAME: Fourier series 2
SUBJECT_AREA: Fourier Analysis
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 8 (pp. 267-296)
LEVEL: Advanced
KEY_CONCEPTS: arbitrary periods; Fourier coefficients; odd and even functions; half-range series; odd and even harmonics
OVERVIEW: Extends Fourier series to functions of any period, exploits symmetry in odd and even functions, and constructs half-range series.
END_TOPIC

TOPIC_ID: AEM-09
TOPIC_NAME: Introduction to the Fourier transform
SUBJECT_AREA: Fourier Analysis
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 9 (pp. 297-333)
LEVEL: Advanced
KEY_CONCEPTS: complex Fourier series; complex spectra; Fourier integral; special functions; transform properties; convolution; sine and cosine transforms
OVERVIEW: Moves from discrete harmonics to the continuous Fourier transform, covering the Fourier integral, its properties and convolution.
END_TOPIC

TOPIC_ID: AEM-10
TOPIC_NAME: Power series solutions of ordinary differential equations 1
SUBJECT_AREA: Differential Equations
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 10 (pp. 334-356)
LEVEL: Advanced
KEY_CONCEPTS: higher derivatives; Leibnitz theorem; power-series solutions; Leibnitz-Maclaurin method; Cauchy-Euler equations
OVERVIEW: Begins solving ordinary differential equations with power series, using Leibnitz's theorem and the Leibnitz-Maclaurin method, including Cauchy-Euler equations.
END_TOPIC

TOPIC_ID: AEM-11
TOPIC_NAME: Power series solutions of ordinary differential equations 2
SUBJECT_AREA: Differential Equations
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 11 (pp. 357-377)
LEVEL: Advanced
KEY_CONCEPTS: Frobenius method; indicial equation
OVERVIEW: Handles equations with regular singular points through the Frobenius method and its indicial equation.
END_TOPIC

TOPIC_ID: AEM-12
TOPIC_NAME: Power series solutions of ordinary differential equations 3
SUBJECT_AREA: Special Functions
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 12 (pp. 378-397)
LEVEL: Advanced
KEY_CONCEPTS: Bessel functions; Legendre equation and polynomials; Rodrigues formula; generating function; Sturm-Liouville systems; orthogonality
OVERVIEW: Introduces the special functions that arise from series solutions, notably Bessel and Legendre, together with orthogonality and Sturm-Liouville theory.
END_TOPIC

TOPIC_ID: AEM-13
TOPIC_NAME: Numerical solutions of ordinary differential equations
SUBJECT_AREA: Numerical Differential Equations
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 13 (pp. 398-438)
LEVEL: Advanced
KEY_CONCEPTS: Taylor series method; Euler method; improved Euler (Euler-Cauchy); Runge-Kutta; second-order equations; predictor-corrector methods
OVERVIEW: Step-by-step numerical integration of differential equations, from Euler and Taylor methods to Runge-Kutta and predictor-corrector schemes.
END_TOPIC

TOPIC_ID: AEM-14
TOPIC_NAME: Partial differentiation
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 14 (pp. 439-481)
LEVEL: Advanced
KEY_CONCEPTS: small increments; Taylor's theorem; rates of change; implicit functions; change of variables; inverse functions; stationary values; maxima and minima; saddle points; Lagrange multipliers
OVERVIEW: Extends calculus to functions of several variables, covering partial derivatives, stationary points and constrained optimization by Lagrange multipliers.
END_TOPIC

TOPIC_ID: AEM-15
TOPIC_NAME: Partial differential equations
SUBJECT_AREA: Differential Equations
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 15 (pp. 482-518)
LEVEL: Advanced
KEY_CONCEPTS: direct integration; initial and boundary conditions; wave equation; heat equation; Laplace equation; separation of variables; polar coordinates
OVERVIEW: Solves the classic second-order partial differential equations — wave, heat and Laplace — by separation of variables subject to boundary conditions.
END_TOPIC

TOPIC_ID: AEM-16
TOPIC_NAME: Matrix algebra
SUBJECT_AREA: Linear Algebra
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 16 (pp. 519-562)
LEVEL: Advanced
KEY_CONCEPTS: singular and non-singular matrices; rank; elementary operations; consistency; inverse method; row transformations; Gaussian elimination; triangular decomposition; matrix transformations; rotation
OVERVIEW: Systematizes matrix methods for linear systems, ranking matrices to test consistency and solving them by inverse, Gaussian elimination and triangular decomposition.
END_TOPIC

TOPIC_ID: AEM-17
TOPIC_NAME: Systems of ordinary differential equations
SUBJECT_AREA: Linear Algebra and Differential Equations
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 17 (pp. 563-592)
LEVEL: Advanced
KEY_CONCEPTS: eigenvalues and eigenvectors; Cayley-Hamilton theorem; first-order systems; diagonalisation; second-order systems
OVERVIEW: Couples differential equations as first-order systems and uses eigenvalues and eigenvectors, with the Cayley-Hamilton theorem, to decouple and solve them.
END_TOPIC

TOPIC_ID: AEM-18
TOPIC_NAME: Numerical solutions of partial differential equations
SUBJECT_AREA: Numerical Methods
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 18 (pp. 593-641)
LEVEL: Advanced
KEY_CONCEPTS: numerical derivatives; two-variable functions; grid values; computational molecules; boundary conditions; second-order equations; time-dependent equations; Crank-Nicolson; dimensional analysis
OVERVIEW: Discrete grid methods for second-order and time-dependent partial differential equations, including the Crank-Nicolson scheme and dimensional analysis.
END_TOPIC

TOPIC_ID: AEM-19
TOPIC_NAME: Multiple integration 1
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 19 (pp. 642-690)
LEVEL: Advanced
KEY_CONCEPTS: differentials; exact differentials; areas; line integrals; parametric equations; path dependence; Green's theorem
OVERVIEW: Introduces line integrals along curves, exact differentials and path independence, and Green's theorem in the plane.
END_TOPIC

TOPIC_ID: AEM-20
TOPIC_NAME: Multiple integration 2
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 20 (pp. 691-734)
LEVEL: Advanced
KEY_CONCEPTS: double integrals; surface integrals; coordinate systems; volume integrals; change of variables; curvilinear coordinates
OVERVIEW: Extends integration to double and triple integrals, changing variables and using curvilinear coordinate systems to evaluate volumes.
END_TOPIC

TOPIC_ID: AEM-21
TOPIC_NAME: Integral functions
SUBJECT_AREA: Special Functions
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 21 (pp. 735-770)
LEVEL: Advanced
KEY_CONCEPTS: functions defined by integrals; gamma and related functions; error function; applications
OVERVIEW: Treats functions that are defined by integrals and their applications, extending the transform and series techniques of earlier chapters.
END_TOPIC

TOPIC_ID: AEM-22
TOPIC_NAME: Vector analysis 1
SUBJECT_AREA: Vector Calculus
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 22 (pp. 771-817)
LEVEL: Advanced
KEY_CONCEPTS: vector quantities; vector representation; components; scalar product; vector product
OVERVIEW: Introduces vector quantities and their algebra in two and three dimensions, including the scalar and vector products.
END_TOPIC

TOPIC_ID: AEM-23
TOPIC_NAME: Vector analysis 2
SUBJECT_AREA: Vector Calculus
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 23 (pp. 818-868)
LEVEL: Advanced
KEY_CONCEPTS: vector operators; gradient; divergence; curl; vector differentiation
OVERVIEW: Develops the vector operators gradient, divergence and curl and applies them to the study of fields.
END_TOPIC

TOPIC_ID: AEM-24
TOPIC_NAME: Vector analysis 3
SUBJECT_AREA: Vector Calculus
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 24 (pp. 869-894)
LEVEL: Advanced
KEY_CONCEPTS: integral theorems; divergence theorem; Stokes' theorem; coordinate systems
OVERVIEW: Completes the vector calculus sequence with the integral theorems and their expression in different coordinate systems.
END_TOPIC

TOPIC_ID: AEM-25
TOPIC_NAME: Complex analysis 1
SUBJECT_AREA: Complex Analysis
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 25 (pp. 895-934)
LEVEL: Advanced
KEY_CONCEPTS: functions of a complex variable; limits and continuity; analytic functions; Cauchy-Riemann equations; transformations
OVERVIEW: Introduces functions of a complex variable and the transformations they describe.
END_TOPIC

TOPIC_ID: AEM-26
TOPIC_NAME: Complex analysis 2
SUBJECT_AREA: Complex Analysis
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 26 (pp. 935-982)
LEVEL: Advanced
KEY_CONCEPTS: analytic functions; contour integration; transformations
OVERVIEW: Continues complex analysis, developing analytic functions, contour integration and their transformations.
END_TOPIC

TOPIC_ID: AEM-27
TOPIC_NAME: Complex analysis 3
SUBJECT_AREA: Complex Analysis
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 27 (pp. 983-1013)
LEVEL: Advanced
KEY_CONCEPTS: residues; residue theorem; contour integration
OVERVIEW: Covers advanced complex analysis, including residue and contour-integral methods.
END_TOPIC

TOPIC_ID: AEM-28
TOPIC_NAME: Optimization and linear programming
SUBJECT_AREA: Optimization
SOURCE_DOCUMENT: SOURCE_02
SOURCE_LOCATION: SOURCE_02 Ch. 28 (pp. 1014-1062)
LEVEL: Advanced
KEY_CONCEPTS: objective functions; constraints; optimal solutions; linear programming
OVERVIEW: Formulates optimization problems with objective functions and constraints and solves linear programs.
END_TOPIC

## TOPIC MAP — SOURCE 03: ENGINEERING MATHEMATICS (8TH ED.)

TOPIC_ID: EM-01
TOPIC_NAME: Arithmetic
SUBJECT_AREA: Foundation Mathematics
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Part I, Programme F.1 (pp. 3-62)
LEVEL: Foundation
KEY_CONCEPTS: types of number; place value; integers; brackets and precedence; estimation and rounding; factors and primes; HCF and LCM; fractions, ratios and percentages; decimals and significant figures; powers and roots; surds; standard form; number systems and bases
OVERVIEW: Foundation number work: the kinds of number, the rules and precedence of arithmetic, factors and primes, fractions, decimals and percentages, powers and surds, and standard form.
END_TOPIC

TOPIC_ID: EM-02
TOPIC_NAME: Introduction to algebra
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.2 (pp. 63-96)
LEVEL: Foundation
KEY_CONCEPTS: algebraic expressions; constants; variables; rules of precedence; terms and coefficients; like terms; expanding and nesting brackets; powers and indices; logarithms; algebraic multiplication and division; algebraic fractions; factorisation
OVERVIEW: Turns arithmetic into algebra with symbols, covering constants and variables, precedence, collecting terms, brackets, indices and logarithms, algebraic fractions and factorisation.
END_TOPIC

TOPIC_ID: EM-03
TOPIC_NAME: Expressions and equations
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.3 (pp. 97-122)
LEVEL: Foundation
KEY_CONCEPTS: evaluating expressions; equations; transposition of formulas; polynomial expressions; evaluation by nesting; remainder theorem; factor theorem; general quadratic equation; fourth-order factorisation
OVERVIEW: How to evaluate and rearrange expressions, and how polynomials behave, including the remainder and factor theorems used to factorise higher-order expressions.
END_TOPIC

TOPIC_ID: EM-04
TOPIC_NAME: Graphs
SUBJECT_AREA: Coordinate Geometry
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.4 (pp. 123-156)
LEVEL: Foundation
KEY_CONCEPTS: equations and graphs; ordered pairs; Cartesian axes; drawing graphs; spreadsheets for graphs; inequalities; absolute values (modulus)
OVERVIEW: Introduces the Cartesian plane and graph drawing, including the use of spreadsheets and the treatment of inequalities and modulus.
END_TOPIC

TOPIC_ID: EM-05
TOPIC_NAME: Linear equations
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.5 (pp. 157-172)
LEVEL: Foundation
KEY_CONCEPTS: simple equations; simultaneous linear equations in two unknowns; substitution; equating coefficients; three unknowns; pre-simplification
OVERVIEW: Solving linear equations, singly and simultaneously in two or three unknowns by substitution and by equating coefficients.
END_TOPIC

TOPIC_ID: EM-06
TOPIC_NAME: Polynomial equations
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.6 (pp. 173-186)
LEVEL: Foundation
KEY_CONCEPTS: quadratic equations; cubic equations with a linear factor; fourth-order equations with linear factors
OVERVIEW: Solving polynomial equations up to fourth order where the necessary linear factors can be found.
END_TOPIC

TOPIC_ID: EM-07
TOPIC_NAME: Binomials
SUBJECT_AREA: Algebra and Combinatorics
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.7 (pp. 187-214)
LEVEL: Foundation
KEY_CONCEPTS: factorials; combinations; combinatorial coefficients; Pascal's triangle; binomial expansions; general term; sigma notation; sums of natural numbers; the exponential number e
OVERVIEW: Binomial expansion built on factorials and combinations, with Pascal's triangle, sigma notation and the constant e.
END_TOPIC

TOPIC_ID: EM-08
TOPIC_NAME: Partial fractions
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.8 (pp. 215-234)
LEVEL: Foundation
KEY_CONCEPTS: partial fractions; denominators with repeated factors; quadratic factors
OVERVIEW: Splitting rational expressions into partial fractions, including denominators with repeated and quadratic factors.
END_TOPIC

TOPIC_ID: EM-09
TOPIC_NAME: Trigonometry
SUBJECT_AREA: Trigonometry
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.9 (pp. 235-258)
LEVEL: Foundation
KEY_CONCEPTS: angles and rotation; radians; triangles; trigonometric ratios; reciprocal ratios; Pythagoras' theorem; special triangles; fundamental and compound-angle identities
OVERVIEW: Angles and the trigonometric ratios, radians, special triangles, and the fundamental and compound-angle identities.
END_TOPIC

TOPIC_ID: EM-10
TOPIC_NAME: Functions
SUBJECT_AREA: Functions
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.10 (pp. 259-278)
LEVEL: Foundation
KEY_CONCEPTS: functions as rules; arithmetic operations on functions; inverses of functions; graphs of inverses; composition
OVERVIEW: Functions as rules mapping inputs to outputs, with the arithmetic of functions, inverse functions and composition.
END_TOPIC

TOPIC_ID: EM-11
TOPIC_NAME: Trigonometric and exponential functions
SUBJECT_AREA: Functions and Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.11 (pp. 279-308)
LEVEL: Foundation
KEY_CONCEPTS: trigonometric functions; tangent; period; amplitude; phase difference; inverse trigonometric functions; trigonometric equations; exponential and logarithmic functions; odd and even functions; limits
OVERVIEW: Graphs and properties of the trigonometric, exponential and logarithmic functions, including periodicity, amplitude, symmetry and limits.
END_TOPIC

TOPIC_ID: EM-12
TOPIC_NAME: Differentiation
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.12 (pp. 309-346)
LEVEL: Foundation
KEY_CONCEPTS: gradients; derivatives of powers; differentiating polynomials; second and higher derivatives; standard derivatives; product, quotient and chain rules; Newton-Raphson method
OVERVIEW: Introduces the derivative through gradients, derives the standard derivatives and the product, quotient and chain rules, and applies Newton-Raphson iteration.
END_TOPIC

TOPIC_ID: EM-13
TOPIC_NAME: Integration
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Programme F.13 (pp. 347-378)
LEVEL: Foundation
KEY_CONCEPTS: constant of integration; standard integrals; integration of polynomials; functions of a linear function; integration by partial fractions; areas under curves; integration as summation
OVERVIEW: Integration as the reverse of differentiation, covering standard integrals, polynomials, partial fractions, areas under curves and integration as a summation.
END_TOPIC

TOPIC_ID: EM-14
TOPIC_NAME: Complex numbers 1
SUBJECT_AREA: Complex Numbers
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Part II, Ch. 1 (pp. 379-405)
LEVEL: Intermediate
KEY_CONCEPTS: imaginary unit; powers of i; complex arithmetic; equal complex numbers; graphical representation; polar form; exponential form
OVERVIEW: Introduces the imaginary unit and complex arithmetic, representing complex numbers graphically and in polar and exponential form.
END_TOPIC

TOPIC_ID: EM-15
TOPIC_NAME: Complex numbers 2
SUBJECT_AREA: Complex Numbers
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 2 (pp. 406-430)
LEVEL: Intermediate
KEY_CONCEPTS: polar calculations; roots of complex numbers; expansions; powers of trigonometric functions; loci
OVERVIEW: Uses polar and exponential form for products, quotients and roots, and examines loci of complex points.
END_TOPIC

TOPIC_ID: EM-16
TOPIC_NAME: Hyperbolic functions
SUBJECT_AREA: Functions
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 3 (pp. 431-452)
LEVEL: Intermediate
KEY_CONCEPTS: hyperbolic graphs; evaluating hyperbolic functions; inverse hyperbolic functions; logarithmic forms; hyperbolic identities; relationship with trigonometric functions
OVERVIEW: Defines and graphs the hyperbolic functions, their inverses and logarithmic forms, and relates them to the trigonometric functions.
END_TOPIC

TOPIC_ID: EM-17
TOPIC_NAME: Determinants
SUBJECT_AREA: Linear Algebra
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 4 (pp. 453-483)
LEVEL: Intermediate
KEY_CONCEPTS: determinants; third-order determinants; simultaneous equations; consistency; properties of determinants
OVERVIEW: Evaluates determinants and uses them to solve simultaneous equations and test their consistency.
END_TOPIC

TOPIC_ID: EM-18
TOPIC_NAME: Matrices
SUBJECT_AREA: Linear Algebra
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 5 (pp. 484-518)
LEVEL: Intermediate
KEY_CONCEPTS: matrix definitions and notation; matrix operations; transpose; special matrices; determinant; cofactors; adjoint; inverse; Gaussian elimination; eigenvalues and eigenvectors; Cayley-Hamilton theorem
OVERVIEW: Matrix algebra, including operations, transpose, the inverse via cofactors and the adjoint, Gaussian elimination and eigenvalues.
END_TOPIC

TOPIC_ID: EM-19
TOPIC_NAME: Vectors
SUBJECT_AREA: Vector Mathematics
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 6 (pp. 519-543)
LEVEL: Intermediate
KEY_CONCEPTS: scalars and vectors; representation; components; unit vectors; vectors in space; direction cosines; scalar and vector products; angle between vectors; direction ratios
OVERVIEW: Vector quantities, their components and products, with directions expressed through direction cosines and ratios.
END_TOPIC

TOPIC_ID: EM-20
TOPIC_NAME: Differentiation (further)
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 7 (pp. 544-562)
LEVEL: Intermediate
KEY_CONCEPTS: standard derivatives; chain, product and quotient rules; logarithmic differentiation; implicit functions; parametric equations
OVERVIEW: Consolidates advanced differentiation techniques, including logarithmic and implicit differentiation and parametric curves.
END_TOPIC

TOPIC_ID: EM-21
TOPIC_NAME: Differentiation applications
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 8 (pp. 563-584)
LEVEL: Intermediate
KEY_CONCEPTS: derivatives of inverse trigonometric functions; applications of differentiation
OVERVIEW: Applies differentiation further, including the derivatives of the inverse trigonometric functions.
END_TOPIC

TOPIC_ID: EM-22
TOPIC_NAME: Tangents, normals and curvature
SUBJECT_AREA: Calculus and Geometry
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 9 (pp. 585-606)
LEVEL: Intermediate
KEY_CONCEPTS: tangents; normals; curvature; centre of curvature
OVERVIEW: Uses derivatives to find tangents and normals to curves and to measure curvature.
END_TOPIC

TOPIC_ID: EM-23
TOPIC_NAME: Sequences
SUBJECT_AREA: Sequences
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 10 (pp. 607-641)
LEVEL: Intermediate
KEY_CONCEPTS: sequences; arithmetic and geometric sequences; limits of sequences
OVERVIEW: Studies ordered sequences and their behaviour, including the limits they approach.
END_TOPIC

TOPIC_ID: EM-24
TOPIC_NAME: Series 1
SUBJECT_AREA: Series
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 11 (pp. 642-665)
LEVEL: Intermediate
KEY_CONCEPTS: arithmetic series; geometric series; series of powers; infinite series; limiting values; convergence and divergence; tests for convergence; absolute convergence
OVERVIEW: Sums of sequences, from arithmetic and geometric series to infinite series and the tests that decide convergence.
END_TOPIC

TOPIC_ID: EM-25
TOPIC_NAME: Series 2
SUBJECT_AREA: Series
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 12 (pp. 666-691)
LEVEL: Intermediate
KEY_CONCEPTS: power series; Maclaurin's series; Taylor's series; standard series; binomial series; approximations; indeterminate forms and L'Hopital's rule
OVERVIEW: Represents functions as power series, including Maclaurin and Taylor series, and evaluates limiting values.
END_TOPIC

TOPIC_ID: EM-26
TOPIC_NAME: Curves and curve fitting
SUBJECT_AREA: Coordinate and Data Methods
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 13 (pp. 692-735)
LEVEL: Intermediate
KEY_CONCEPTS: standard curves; asymptotes; systematic curve sketching; straight-line laws; curve fitting; method of least squares
OVERVIEW: Recognizes and sketches standard curves, and fits straight-line laws to experimental data by least squares.
END_TOPIC

TOPIC_ID: EM-27
TOPIC_NAME: Partial differentiation 1
SUBJECT_AREA: Multivariable Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 14 (pp. 736-756)
LEVEL: Intermediate
KEY_CONCEPTS: partial derivatives; higher partial derivatives; small increments
OVERVIEW: Introduces partial derivatives of functions of several variables and their use in small-increment approximations.
END_TOPIC

TOPIC_ID: EM-28
TOPIC_NAME: Partial differentiation 2
SUBJECT_AREA: Multivariable Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 15 (pp. 757-772)
LEVEL: Intermediate
KEY_CONCEPTS: rates of change; change of variables
OVERVIEW: Applies partial differentiation to rates of change and to changing the variables of a function.
END_TOPIC

TOPIC_ID: EM-29
TOPIC_NAME: Integration 1
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 16 (pp. 773-799)
LEVEL: Intermediate
KEY_CONCEPTS: standard integrals; functions of a linear function; integrals of the form f'(x)/f(x); integration by parts; integration by partial fractions; integration of trigonometric functions
OVERVIEW: Integration techniques including substitution-type forms, integration by parts and partial fractions.
END_TOPIC

TOPIC_ID: EM-30
TOPIC_NAME: Integration 2
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 17 (pp. 800-827)
LEVEL: Intermediate
KEY_CONCEPTS: further integration techniques
OVERVIEW: Continues integration methods beyond the standard forms introduced earlier.
END_TOPIC

TOPIC_ID: EM-31
TOPIC_NAME: Reduction formulas
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 18 (pp. 828-840)
LEVEL: Intermediate
KEY_CONCEPTS: reduction formulas
OVERVIEW: Derives and applies reduction formulas that express an integral in terms of a simpler one.
END_TOPIC

TOPIC_ID: EM-32
TOPIC_NAME: Integration applications 1
SUBJECT_AREA: Applied Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 19 (pp. 841-858)
LEVEL: Intermediate
KEY_CONCEPTS: areas under curves; definite integrals; parametric equations; mean values; root mean square (rms) values
OVERVIEW: Applies definite integration to areas, mean values and root-mean-square values.
END_TOPIC

TOPIC_ID: EM-33
TOPIC_NAME: Integration applications 2
SUBJECT_AREA: Applied Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 20 (pp. 859-880)
LEVEL: Intermediate
KEY_CONCEPTS: volumes of solids of revolution; centroids; centre of gravity; lengths of curves; surfaces of revolution; rules of Pappus
OVERVIEW: Uses integration to find volumes of revolution, centroids, curve lengths and surfaces of revolution.
END_TOPIC

TOPIC_ID: EM-34
TOPIC_NAME: Integration applications 3
SUBJECT_AREA: Applied Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 21 (pp. 881-909)
LEVEL: Intermediate
KEY_CONCEPTS: moments of inertia; radius of gyration; parallel axes theorem; perpendicular axes theorem; second moments of area; centres of pressure
OVERVIEW: Applies integration to moments of inertia, radii of gyration and centres of pressure.
END_TOPIC

TOPIC_ID: EM-35
TOPIC_NAME: Approximate integration
SUBJECT_AREA: Numerical Methods
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 22 (pp. 910-928)
LEVEL: Intermediate
KEY_CONCEPTS: approximate integration; series methods; Simpson's rule
OVERVIEW: Numerically approximating definite integrals, including the use of Simpson's rule.
END_TOPIC

TOPIC_ID: EM-36
TOPIC_NAME: Polar coordinate systems
SUBJECT_AREA: Coordinate Geometry
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 23 (pp. 929-950)
LEVEL: Intermediate
KEY_CONCEPTS: polar coordinates; polar curves; standard polar curves
OVERVIEW: Describes points and curves in polar coordinates and the standard polar curves.
END_TOPIC

TOPIC_ID: EM-37
TOPIC_NAME: Multiple integrals
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 24 (pp. 951-976)
LEVEL: Intermediate
KEY_CONCEPTS: summation in two directions; double integrals; triple integrals; volumes
OVERVIEW: Extends integration to double and triple integrals, chiefly to find volumes.
END_TOPIC

TOPIC_ID: EM-38
TOPIC_NAME: First-order differential equations
SUBJECT_AREA: Differential Equations
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 25 (pp. 977-1012)
LEVEL: Intermediate
KEY_CONCEPTS: forming differential equations; direct integration; separating the variables; homogeneous equations; integrating factor; Bernoulli's equation
OVERVIEW: Introduces differential equations and solves first-order equations by direct integration, separation of variables, integrating factors and Bernoulli's method.
END_TOPIC

TOPIC_ID: EM-39
TOPIC_NAME: Second-order differential equations
SUBJECT_AREA: Differential Equations
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 26 (pp. 1013-1035)
LEVEL: Intermediate
KEY_CONCEPTS: second-order linear equations; complementary function; particular integral
OVERVIEW: Solves second-order linear differential equations through their complementary function and a particular integral.
END_TOPIC

TOPIC_ID: EM-40
TOPIC_NAME: Introduction to Laplace transforms
SUBJECT_AREA: Transforms
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 27 (pp. 1036-1053)
LEVEL: Intermediate
KEY_CONCEPTS: Laplace transform; inverse Laplace transform; tables of transforms; transform of a derivative; two properties of transforms; higher derivatives; linear constant-coefficient inhomogeneous equations
OVERVIEW: Introduces the Laplace transform and its inverse, using tables to solve constant-coefficient differential equations.
END_TOPIC

TOPIC_ID: EM-41
TOPIC_NAME: Data handling and statistics
SUBJECT_AREA: Statistics
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 28 (pp. 1054-1084)
LEVEL: Intermediate
KEY_CONCEPTS: arranging data; tally diagrams; grouped data; relative frequency; class boundaries; histograms; measures of central tendency; dispersion; standard deviation; normal distribution
OVERVIEW: Organizing and displaying data, summarizing it by measures of central tendency and dispersion, and introducing the normal distribution.
END_TOPIC

TOPIC_ID: EM-42
TOPIC_NAME: Probability
SUBJECT_AREA: Probability
SOURCE_DOCUMENT: SOURCE_03
SOURCE_LOCATION: SOURCE_03 Ch. 29 (p. 1085 ff.)
LEVEL: Intermediate
KEY_CONCEPTS: empirical and classical probability; mutually exclusive events; addition law; independence and dependence; multiplication law; conditional probability
OVERVIEW: Introduces probability, the addition and multiplication laws, independence and conditional probability.
END_TOPIC

## TOPIC MAP — SOURCE 04: FOUNDATION MATHEMATICS

TOPIC_ID: FM-01
TOPIC_NAME: Arithmetic and number systems
SUBJECT_AREA: Foundation Mathematics
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 1, Units 1-6 (pp. 1-71)
LEVEL: Foundation
KEY_CONCEPTS: natural numbers and integers; place value; arithmetic operations and precedence; factors and prime numbers; HCF and LCM; fractions, ratios and percentages; decimals and rounding; powers and roots; surds; standard form; denary, binary, octal, duodecimal and hexadecimal systems
OVERVIEW: Foundation arithmetic: the number types and their laws, factors and primes, fractions, decimals and percentages, powers and surds, standard form, and the common number bases.
END_TOPIC

TOPIC_ID: FM-02
TOPIC_NAME: Introduction to algebra
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 2, Units 7-10 (pp. 72-115)
LEVEL: Foundation
KEY_CONCEPTS: variables and constants; terms and coefficients; collecting like terms; expanding and nesting brackets; powers and indices; logarithms; algebraic multiplication and division; algebraic fractions; factorisation of algebraic expressions
OVERVIEW: Introduces algebraic notation and manipulation, from collecting terms and brackets to indices, logarithms, algebraic fractions and factorisation.
END_TOPIC

TOPIC_ID: FM-03
TOPIC_NAME: Expressions, equations and polynomial evaluation
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 3, Units 11-12 (pp. 116-144)
LEVEL: Foundation
KEY_CONCEPTS: evaluating expressions; equations; transposition of formulas; polynomial expressions; evaluation by nesting; remainder theorem; factor theorem; fourth-order factorisation
OVERVIEW: Evaluating and rearranging expressions, then evaluating polynomials and applying the remainder and factor theorems.
END_TOPIC

TOPIC_ID: FM-04
TOPIC_NAME: Graphs, spreadsheets, inequalities and absolute values
SUBJECT_AREA: Algebra and Graphs
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 4, Units 13-16 (pp. 145-183)
LEVEL: Foundation
KEY_CONCEPTS: ordered pairs; Cartesian axes; drawing graphs; spreadsheet formulas and graphs; inequalities; modulus and its graph
OVERVIEW: Graph work on Cartesian axes, including spreadsheets as a graphing tool, together with inequalities and modulus.
END_TOPIC

TOPIC_ID: FM-05
TOPIC_NAME: Linear and simultaneous equations
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 5, Unit 17 (pp. 184-202)
LEVEL: Foundation
KEY_CONCEPTS: simple linear equations; solution by substitution; solution by equating coefficients; two and three unknowns; pre-simplification
OVERVIEW: Solving linear equations and simultaneous linear equations in two and three unknowns.
END_TOPIC

TOPIC_ID: FM-06
TOPIC_NAME: Polynomial equations
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 6, Unit 18 (pp. 203-222)
LEVEL: Foundation
KEY_CONCEPTS: quadratic equations; factor method; completing the square; quadratic formula; cubic equations with a linear factor; fourth-order equations
OVERVIEW: Solving polynomial equations by factoring, completing the square and the quadratic formula, extended to cubic and quartic cases.
END_TOPIC

TOPIC_ID: FM-07
TOPIC_NAME: Partial fractions
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 7, Units 19-20 (pp. 223-244)
LEVEL: Intermediate
KEY_CONCEPTS: partial-fraction decomposition; denominators with repeated factors; quadratic factors
OVERVIEW: Decomposing rational expressions into partial fractions, including repeated and quadratic factors.
END_TOPIC

TOPIC_ID: FM-08
TOPIC_NAME: Trigonometry
SUBJECT_AREA: Trigonometry
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 8, Units 21-22 (pp. 245-272)
LEVEL: Foundation
KEY_CONCEPTS: angles and rotation; radians; trigonometric ratios; reciprocal ratios; Pythagoras' theorem; special triangles; fundamental identity; compound and double angles; sums and differences of angles
OVERVIEW: Angles and the trigonometric ratios together with the fundamental, compound-angle and double-angle identities.
END_TOPIC

TOPIC_ID: FM-09
TOPIC_NAME: Functions and limits
SUBJECT_AREA: Functions and Calculus Foundations
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 9, Units 23-29 (pp. 273-332)
LEVEL: Intermediate
KEY_CONCEPTS: functions as rules; combining functions; inverses; composition; trigonometric functions; amplitude, period and phase; inverse trigonometric functions; exponential and logarithmic functions; odd and even functions; limits
OVERVIEW: Functions and their combinations, the trigonometric, exponential and logarithmic families, symmetry, and the idea of a limit.
END_TOPIC

TOPIC_ID: FM-10
TOPIC_NAME: Matrices and simultaneous equations
SUBJECT_AREA: Linear Algebra
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 10, Units 30-32 (pp. 333-375)
LEVEL: Intermediate
KEY_CONCEPTS: matrix operations; scalar multiplication; matrix multiplication; identity matrix; determinant; inverse matrix; solving simultaneous equations; Cramer's rule
OVERVIEW: Matrix arithmetic, determinants and inverses, and their use in solving simultaneous linear equations.
END_TOPIC

TOPIC_ID: FM-11
TOPIC_NAME: Vectors
SUBJECT_AREA: Vectors
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 11, Units 33-35 (pp. 376-406)
LEVEL: Intermediate
KEY_CONCEPTS: scalar and vector quantities; representation; components; unit vectors; vectors in space; direction cosines; scalar product; vector product; angle between vectors
OVERVIEW: Scalar and vector quantities, their components, and the scalar and vector products.
END_TOPIC

TOPIC_ID: FM-12
TOPIC_NAME: Binomial series and sigma notation
SUBJECT_AREA: Series and Combinatorics
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 12, Units 36-38 (pp. 407-435)
LEVEL: Intermediate
KEY_CONCEPTS: factorials; combinations; Pascal's triangle; binomial expansion; general term; sigma notation; sums of natural numbers
OVERVIEW: Binomial expansion via factorials and combinations, using Pascal's triangle and sigma notation.
END_TOPIC

TOPIC_ID: FM-13
TOPIC_NAME: Sets
SUBJECT_AREA: Set Theory
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 13, Units 39-41 (pp. 436-472)
LEVEL: Foundation
KEY_CONCEPTS: sets and subsets; empty and universal sets; Venn diagrams; intersection and union; complement; distributive laws; cardinality; three-set operations
OVERVIEW: Set notation and operations, represented with Venn diagrams and described by the distributive laws and cardinality.
END_TOPIC

TOPIC_ID: FM-14
TOPIC_NAME: Probability
SUBJECT_AREA: Probability
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 14, Units 42-45 (pp. 473-497)
LEVEL: Intermediate
KEY_CONCEPTS: empirical probability; classical probability; events; mutually exclusive events; addition law; multiplication law; independence and dependence; conditional probability
OVERVIEW: Probability from the empirical and classical viewpoints, with the addition and multiplication laws and conditional probability.
END_TOPIC

TOPIC_ID: FM-15
TOPIC_NAME: Statistics
SUBJECT_AREA: Statistics
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 15, Units 46-49 (pp. 498-549)
LEVEL: Intermediate
KEY_CONCEPTS: arranging data; tally diagrams; grouped data; relative frequency; class boundaries; histograms; mean, mode and median; range; standard deviation; normal distribution
OVERVIEW: Organizing data and summarizing it by central tendency and dispersion, ending with the normal distribution.
END_TOPIC

TOPIC_ID: FM-16
TOPIC_NAME: Regression and correlation
SUBJECT_AREA: Statistics
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 16, Units 50-51 (pp. 550-576)
LEVEL: Intermediate
KEY_CONCEPTS: linear variation; least-squares regression; correlation; Pearson correlation; Spearman rank correlation
OVERVIEW: Fitting lines to paired data by least squares and measuring association with correlation coefficients.
END_TOPIC

TOPIC_ID: FM-17
TOPIC_NAME: Introduction to differentiation
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 17, Units 52-53 (pp. 577-619)
LEVEL: Intermediate
KEY_CONCEPTS: gradients; derivative from a curve; derivatives of powers; polynomial differentiation; second derivatives; standard derivatives; product, quotient and chain rules; Newton-Raphson method
OVERVIEW: The derivative as a gradient, the standard derivatives and the product, quotient and chain rules, with Newton-Raphson iteration.
END_TOPIC

TOPIC_ID: FM-18
TOPIC_NAME: Partial differentiation and errors
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 18, Units 54-56 (pp. 620-646)
LEVEL: Intermediate
KEY_CONCEPTS: partial derivatives; higher partial derivatives; small changes; calculating errors
OVERVIEW: Partial derivatives of functions of several variables and their use in estimating small changes and errors.
END_TOPIC

TOPIC_ID: FM-19
TOPIC_NAME: Integration
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_04
SOURCE_LOCATION: SOURCE_04 Module 19, Units 57-62 (p. 647 ff.)
LEVEL: Intermediate
KEY_CONCEPTS: standard integrals; integration of polynomial expressions; integration by partial fractions; integration by parts; areas under curves; integration as a summation; area between a curve and a line
OVERVIEW: Integration from the standard forms through parts and partial fractions, applied to areas under and between curves.
END_TOPIC

## TOPIC MAP — SOURCE 05: ENGINEERING MATHEMATICS (6TH ED.)

Note: SOURCE_05 is an earlier edition of the book indexed as SOURCE_03, so its topics
parallel the EM-* and FM-* records. Locations are given by part and programme because the
uploaded copy is a library scan whose printed contents page numbers are unreliable.

TOPIC_ID: EM6-01
TOPIC_NAME: Arithmetic
SUBJECT_AREA: Foundation Mathematics
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.1
LEVEL: Foundation
KEY_CONCEPTS: types of number; place value; integers; brackets and precedence; factors and primes; HCF and LCM; fractions; decimals; powers and surds; number systems and change of base
OVERVIEW: The foundation number programme, covering the kinds of number, arithmetic rules and precedence, factors and primes, fractions and decimals, powers and surds, and number bases.
END_TOPIC

TOPIC_ID: EM6-02
TOPIC_NAME: Introduction to algebra
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.2
LEVEL: Foundation
KEY_CONCEPTS: algebraic expressions; constants and variables; terms and coefficients; collecting like terms; brackets; powers and indices; logarithms; algebraic fractions; factorisation
OVERVIEW: The first algebra programme, covering notation, terms and brackets, indices and logarithms, algebraic fractions and factorisation.
END_TOPIC

TOPIC_ID: EM6-03
TOPIC_NAME: Expressions and equations
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.3
LEVEL: Foundation
KEY_CONCEPTS: evaluating expressions; equations; transposition of formulas; polynomial expressions; evaluation by nesting; remainder theorem; factor theorem; quartic factorisation
OVERVIEW: Evaluating and rearranging expressions, then polynomial evaluation with the remainder and factor theorems.
END_TOPIC

TOPIC_ID: EM6-04
TOPIC_NAME: Graphs
SUBJECT_AREA: Coordinate Geometry
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.4
LEVEL: Foundation
KEY_CONCEPTS: equations and graphs; ordered pairs; Cartesian axes; drawing graphs; spreadsheets; inequalities; modulus (absolute values)
OVERVIEW: Graphs on Cartesian axes, including spreadsheets, inequalities and modulus.
END_TOPIC

TOPIC_ID: EM6-05
TOPIC_NAME: Linear equations and simultaneous linear equations
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.5
LEVEL: Foundation
KEY_CONCEPTS: simple linear equations; two unknowns; solution by substitution; solution by equating coefficients; three unknowns; pre-simplification
OVERVIEW: Solving simple and simultaneous linear equations in two or three unknowns.
END_TOPIC

TOPIC_ID: EM6-06
TOPIC_NAME: Polynomial equations
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.6
LEVEL: Foundation
KEY_CONCEPTS: quadratic equations; cubic equations with a linear factor; quartic equations with two linear factors
OVERVIEW: Solving polynomial equations up to quartic order where linear factors can be found.
END_TOPIC

TOPIC_ID: EM6-07
TOPIC_NAME: Partial fractions
SUBJECT_AREA: Algebra
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.7
LEVEL: Foundation
KEY_CONCEPTS: partial fractions; denominators with repeated factors; quadratic factors
OVERVIEW: Splitting rational expressions into partial fractions, including repeated and quadratic factors.
END_TOPIC

TOPIC_ID: EM6-08
TOPIC_NAME: Trigonometry
SUBJECT_AREA: Trigonometry
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.8
LEVEL: Foundation
KEY_CONCEPTS: angles and rotation; radians; trigonometric and reciprocal ratios; Pythagoras; special triangles; fundamental identity; compound and double angles; sums and differences and products of ratios
OVERVIEW: Angles and the trigonometric ratios with the fundamental, compound-angle and double-angle identities.
END_TOPIC

TOPIC_ID: EM6-09
TOPIC_NAME: Binomial series
SUBJECT_AREA: Series and Combinatorics
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.9
LEVEL: Foundation
KEY_CONCEPTS: factorials; combinations; Pascal's triangle; binomial expansions; general term; sigma notation; sums of the first n natural numbers; the exponential number e
OVERVIEW: Binomial expansion from factorials and combinations, with Pascal's triangle and sigma notation.
END_TOPIC

TOPIC_ID: EM6-10
TOPIC_NAME: Functions
SUBJECT_AREA: Functions
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.10
LEVEL: Foundation
KEY_CONCEPTS: functions as rules; arithmetic operations; inverses and their graphs; composition; trigonometric functions; amplitude, period and phase; inverse trigonometric functions; exponential and logarithmic functions; odd and even functions; limits
OVERVIEW: Functions and their combinations, the trigonometric, exponential and logarithmic families, symmetry and limits.
END_TOPIC

TOPIC_ID: EM6-11
TOPIC_NAME: Differentiation
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.11
LEVEL: Foundation
KEY_CONCEPTS: gradients; derivative of a curve; derivatives of powers; differentiating polynomials; second derivatives; standard derivatives; product, quotient and chain rules; Newton-Raphson method
OVERVIEW: The derivative as a gradient, the standard derivatives and rules of differentiation, and Newton-Raphson iteration.
END_TOPIC

TOPIC_ID: EM6-12
TOPIC_NAME: Integration
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part I, Programme F.12
LEVEL: Foundation
KEY_CONCEPTS: constant of integration; standard integrals; integration of polynomials; functions of a linear function; integration by partial fractions; areas under curves; integration as a summation
OVERVIEW: Integration as the reverse of differentiation, with standard integrals, polynomials, partial fractions and areas under curves.
END_TOPIC

TOPIC_ID: EM6-13
TOPIC_NAME: Complex numbers 1
SUBJECT_AREA: Complex Numbers
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 1
LEVEL: Intermediate
KEY_CONCEPTS: the symbol j; quadratic equations; powers of j; complex numbers; equal complex numbers; graphical representation and addition; polar form; exponential form
OVERVIEW: Introduces the imaginary unit and complex arithmetic, with graphical representation and the polar and exponential forms.
END_TOPIC

TOPIC_ID: EM6-14
TOPIC_NAME: Complex numbers 2
SUBJECT_AREA: Complex Numbers
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 2
LEVEL: Intermediate
KEY_CONCEPTS: loci problems
OVERVIEW: Continues complex numbers with the loci traced by conditions on a complex variable.
END_TOPIC

TOPIC_ID: EM6-15
TOPIC_NAME: Hyperbolic functions
SUBJECT_AREA: Functions
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 3
LEVEL: Intermediate
KEY_CONCEPTS: graphs of hyperbolic functions; evaluation; inverse hyperbolic functions and their log form; hyperbolic identities; relationship with trigonometric functions
OVERVIEW: The hyperbolic functions, their graphs, inverses, logarithmic forms and relationship to the trigonometric functions.
END_TOPIC

TOPIC_ID: EM6-16
TOPIC_NAME: Determinants
SUBJECT_AREA: Linear Algebra
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 4
LEVEL: Intermediate
KEY_CONCEPTS: determinants; third-order determinants; simultaneous equations in three unknowns; consistency; properties of determinants
OVERVIEW: Evaluating determinants and using them to solve three-unknown systems and test consistency.
END_TOPIC

TOPIC_ID: EM6-17
TOPIC_NAME: Matrices
SUBJECT_AREA: Linear Algebra
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 5
LEVEL: Intermediate
KEY_CONCEPTS: matrix definitions and notation; equal matrices; addition and subtraction; scalar and matrix multiplication; transpose; special matrices; determinant; cofactors; adjoint; inverse; Gaussian elimination; eigenvalues and eigenvectors
OVERVIEW: Matrix algebra, determinants and inverses, Gaussian elimination and eigenvalues.
END_TOPIC

TOPIC_ID: EM6-18
TOPIC_NAME: Vectors
SUBJECT_AREA: Vectors
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 6
LEVEL: Intermediate
KEY_CONCEPTS: scalar and vector quantities; vector representation; types of vector; addition; components and unit vectors; vectors in space; direction cosines; scalar product; vector product; angle between vectors; direction ratios
OVERVIEW: Vector quantities and their algebra, components, space vectors, direction cosines and the scalar and vector products.
END_TOPIC

TOPIC_ID: EM6-19
TOPIC_NAME: Differentiation (advanced)
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 7
LEVEL: Advanced
KEY_CONCEPTS: standard derivatives; functions of a function; logarithmic differentiation; implicit functions; parametric equations
OVERVIEW: Advanced differentiation techniques, including logarithmic and implicit differentiation and parametric equations.
END_TOPIC

TOPIC_ID: EM6-20
TOPIC_NAME: Differentiation applications 1
SUBJECT_AREA: Calculus and Geometry
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 8
LEVEL: Advanced
KEY_CONCEPTS: equation of a straight line; tangents and normals; curvature; centre of curvature
OVERVIEW: Uses derivatives to find tangents and normals and to measure curvature.
END_TOPIC

TOPIC_ID: EM6-21
TOPIC_NAME: Differentiation applications 2
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 9
LEVEL: Advanced
KEY_CONCEPTS: differentiation of inverse trigonometric functions; derivatives of inverse hyperbolic functions; maximum and minimum values; points of inflexion
OVERVIEW: Extends differentiation to inverse trigonometric and hyperbolic functions and to maxima, minima and points of inflexion.
END_TOPIC

TOPIC_ID: EM6-22
TOPIC_NAME: Partial differentiation 1
SUBJECT_AREA: Multivariable Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 10
LEVEL: Advanced
KEY_CONCEPTS: partial differentiation; small increments
OVERVIEW: Introduces partial derivatives of functions of several variables and small-increment approximations.
END_TOPIC

TOPIC_ID: EM6-23
TOPIC_NAME: Partial differentiation 2
SUBJECT_AREA: Multivariable Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 11
LEVEL: Advanced
KEY_CONCEPTS: rate-of-change problems; change of variables
OVERVIEW: Applies partial differentiation to rate-of-change problems and to changing variables.
END_TOPIC

TOPIC_ID: EM6-24
TOPIC_NAME: Curves and curve fitting
SUBJECT_AREA: Applied Mathematics
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 12
LEVEL: Advanced
KEY_CONCEPTS: standard curves; asymptotes; systematic curve sketching; straight-line laws; graphs of the form y = ax^n and y = ae^kx; method of least squares
OVERVIEW: Recognizing and sketching standard curves and fitting straight-line laws to data by least squares.
END_TOPIC

TOPIC_ID: EM6-25
TOPIC_NAME: Series 1
SUBJECT_AREA: Series
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 13
LEVEL: Advanced
KEY_CONCEPTS: arithmetic series and mean; geometric series and mean; series of powers of natural numbers; infinite series; limiting values; convergent and divergent series; tests for convergence; absolute convergence
OVERVIEW: Arithmetic and geometric series, sums of powers, infinite series and tests for convergence.
END_TOPIC

TOPIC_ID: EM6-26
TOPIC_NAME: Series 2
SUBJECT_AREA: Series
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 14
LEVEL: Advanced
KEY_CONCEPTS: power series; Maclaurin's series; standard series; binomial series; approximate values; indeterminate forms; L'Hopital's rule; Taylor's series
OVERVIEW: Power series representations of functions, including Maclaurin and Taylor series, and limiting values.
END_TOPIC

TOPIC_ID: EM6-27
TOPIC_NAME: Integration 1
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 15
LEVEL: Advanced
KEY_CONCEPTS: standard integrals; functions of a linear function; integrals of f'(x)/f(x); integration by parts; integration by partial fractions; integration of trigonometric functions
OVERVIEW: Integration techniques including substitution-type forms, parts, partial fractions and trigonometric integrals.
END_TOPIC

TOPIC_ID: EM6-28
TOPIC_NAME: Integration 2
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 16
LEVEL: Advanced
KEY_CONCEPTS: further integration techniques
OVERVIEW: Continues integration methods beyond the standard forms.
END_TOPIC

TOPIC_ID: EM6-29
TOPIC_NAME: Reduction formulas
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 17
LEVEL: Advanced
KEY_CONCEPTS: reduction formulas
OVERVIEW: Deriving and applying reduction formulas that express an integral in terms of a simpler one.
END_TOPIC

TOPIC_ID: EM6-30
TOPIC_NAME: Integration applications 1
SUBJECT_AREA: Applied Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 18
LEVEL: Advanced
KEY_CONCEPTS: areas under curves; definite integrals; parametric equations; mean values; root mean square (rms) values
OVERVIEW: Applies definite integration to areas, mean values and rms values.
END_TOPIC

TOPIC_ID: EM6-31
TOPIC_NAME: Integration applications 2
SUBJECT_AREA: Applied Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 19
LEVEL: Advanced
KEY_CONCEPTS: volumes of solids of revolution; centroid of a plane figure; centre of gravity; lengths of curves; surfaces of revolution; rules of Pappus
OVERVIEW: Uses integration for volumes of revolution, centroids, curve lengths and surfaces of revolution.
END_TOPIC

TOPIC_ID: EM6-32
TOPIC_NAME: Integration applications 3
SUBJECT_AREA: Applied Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 20
LEVEL: Advanced
KEY_CONCEPTS: moments of inertia; radius of gyration; parallel axes theorem; perpendicular axes theorem; second moments of area; centres of pressure
OVERVIEW: Applies integration to moments of inertia, radii of gyration and centres of pressure.
END_TOPIC

TOPIC_ID: EM6-33
TOPIC_NAME: Approximate integration
SUBJECT_AREA: Numerical Methods
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 21
LEVEL: Advanced
KEY_CONCEPTS: approximate integration; series; Simpson's rule
OVERVIEW: Numerically approximating definite integrals, including Simpson's rule.
END_TOPIC

TOPIC_ID: EM6-34
TOPIC_NAME: Polar coordinate systems
SUBJECT_AREA: Coordinate Geometry
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 22
LEVEL: Advanced
KEY_CONCEPTS: polar coordinates; polar curves; standard polar curves
OVERVIEW: Describing points and curves in polar coordinates and the standard polar curves.
END_TOPIC

TOPIC_ID: EM6-35
TOPIC_NAME: Multiple integrals
SUBJECT_AREA: Calculus
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 23
LEVEL: Advanced
KEY_CONCEPTS: summation in two directions; double integrals; triple integrals; applications; volumes
OVERVIEW: Extends integration to double and triple integrals and their volumetric applications.
END_TOPIC

TOPIC_ID: EM6-36
TOPIC_NAME: First-order differential equations
SUBJECT_AREA: Differential Equations
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 24
LEVEL: Advanced
KEY_CONCEPTS: formation of differential equations; direct integration; separating the variables; homogeneous equations; integrating factor; Bernoulli's equation
OVERVIEW: Forming and solving first-order differential equations by direct integration, separation of variables, integrating factors and Bernoulli's method.
END_TOPIC

TOPIC_ID: EM6-37
TOPIC_NAME: Second-order differential equations
SUBJECT_AREA: Differential Equations
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 25
LEVEL: Advanced
KEY_CONCEPTS: second-order linear equations; complementary function; particular integral
OVERVIEW: Solving second-order linear differential equations through a complementary function and particular integral.
END_TOPIC

TOPIC_ID: EM6-38
TOPIC_NAME: Introduction to Laplace transforms
SUBJECT_AREA: Transforms
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 26
LEVEL: Advanced
KEY_CONCEPTS: Laplace transform; inverse transform; tables of transforms; transform of a derivative; two properties; generating new transforms; higher derivatives; linear constant-coefficient inhomogeneous equations
OVERVIEW: Introduces the Laplace transform and its inverse, using tables and properties to solve constant-coefficient differential equations.
END_TOPIC

TOPIC_ID: EM6-39
TOPIC_NAME: Statistics
SUBJECT_AREA: Statistics
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 27
LEVEL: Advanced
KEY_CONCEPTS: arranging data; tally diagrams; grouped data; class boundaries; histograms; mean; coding; mode; median; dispersion; standard deviation; frequency curves; normal distribution
OVERVIEW: Organizing and displaying data, summarizing it by central tendency and dispersion, and the normal distribution.
END_TOPIC

TOPIC_ID: EM6-40
TOPIC_NAME: Probability
SUBJECT_AREA: Probability
SOURCE_DOCUMENT: SOURCE_05
SOURCE_LOCATION: SOURCE_05 Part II, Programme 28
LEVEL: Advanced
KEY_CONCEPTS: empirical and classical probability; mutually exclusive events; addition law; independent and dependent events; multiplication law; conditional probability; discrete probability distributions; permutations and combinations; binomial distribution; Poisson distribution; normal distribution
OVERVIEW: Probability and probability distributions, including the addition and multiplication laws, conditional probability and the binomial, Poisson and normal distributions.
END_TOPIC

## SOURCE 06 PROCESSING STATUS

SOURCE_06_STATUS: PENDING_OCR
SOURCE_06_NOTE: The uploaded 7th-edition PDF (pdfcoffee copy) is a 122-page scan with no
text layer — every page yielded zero extractable characters. No topic claims are made
from it. OCR, or a text-readable replacement copy, is required before its contents can be
indexed into this topic map.

## DUPLICATE / OVERLAP POLICY

- SOURCE_03 and SOURCE_05 are the 8th and 6th editions of the same book; their programmes
  map onto one another, with SOURCE_05 an earlier ordering and notation.
- SOURCE_04 and SOURCE_05 overlap heavily with SOURCE_03 in foundation mathematics
  (arithmetic, algebra, trigonometry, differentiation, integration).
- Duplicates are merged by concept, keeping source-specific terminology, notation, examples
  and page references. Repeated coverage is not treated as a separate concept unless the
  method, difficulty or application differs.
- Where editions or books disagree, both versions are preserved and marked with a
  SOURCE_VARIATION note rather than silently reconciled.
- Discrete mathematics (SOURCE_01) does not overlap the engineering-mathematics books.

## STANDARDIZED RECORD TEMPLATE FOR NEXT EXPANSION

TOPIC_ID:
TOPIC_NAME:
SUBJECT_AREA:
SOURCE_DOCUMENT:
SOURCE_LOCATION:
LEVEL:
TOPIC_OVERVIEW:
LEARNING_OBJECTIVES:
KEY_CONCEPTS:
DEFINITIONS:
RULES_AND_PRINCIPLES:
FORMULAS:
METHODS_AND_PROCEDURES:
WORKED_EXAMPLES:
STEP_BY_STEP_SOLUTIONS:
COMMON_MISTAKES:
PROBLEM_SOLVING_STRATEGIES:
PRACTICE_QUESTIONS:
ANSWERS:
DIFFICULTY:
RELATED_TOPICS:
SOURCE_VARIATION:
CONFIDENCE:
END_TOPIC

## BUILD NOTES

- Compiled from the six PDFs stored in `App/knowledge/`. Text was extracted with pymupdf
  via `project AI/tools/extract_pdf.py` into `App/build/dumps/` (intermediate, disposable).
- Topic structure and page ranges come from each book's printed contents pages; key
  concepts are the section terms listed there, and overviews are original summaries.
- Text-quality triage (`scan_pdfs.py`): five sources returned clean text layers
  (1100-1400 chars/page); the 7th-edition copy returned 0 chars/page and is pending OCR.
- SOURCE_05 page numbers are not cited: its uploaded copy is a library scan whose printed
  contents figures were garbled, so locations are given by part and programme instead.
- ID scheme: DM- for SOURCE_01, AEM- for SOURCE_02, EM- for SOURCE_03, FM- for SOURCE_04,
  EM6- for SOURCE_05. IDs are zero-padded and stable; SOURCE_06 will use EM7-.
- This file is an index layer, not a reproduction. No textbook prose is quoted; all
  summaries are authored and every topic cites its source and location.

## CURRENT BUILD SUMMARY

SOURCE_COUNT: 6
CONTENT-INDEXED_SOURCES: 5
PENDING_OCR_SOURCES: 1
TOPICS_INDEXED: 137
TOPIC_BREAKDOWN: SOURCE_01 (DM) 8; SOURCE_02 (AEM) 28; SOURCE_03 (EM) 42; SOURCE_04 (FM) 19; SOURCE_05 (EM6) 40
PRIMARY_OVERLAP_AREAS: arithmetic; algebra; functions; trigonometry; matrices; vectors; differentiation; integration; statistics; probability; differential equations
NEXT_RECOMMENDED_BUILD_STEP: Expand the indexed topic groups into detailed, source-attributed records with definitions, formulas, worked examples, practice questions and answer keys, then build the App/site interface around this file.
