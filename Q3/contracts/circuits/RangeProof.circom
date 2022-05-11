pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template RangeProof(n) {
    assert(n <= 252);
    signal input in; // this is the number to be proved inside the range
    signal input range[2]; // the two elements should be the range, i.e. [lower bound, upper bound]
    signal output out;

    component let = LessEqThan(n);
    component get = GreaterEqThan(n);

    // [assignment] insert your code here
    let.in[0] <== in;
    let.in[1] <== range[1];

    get.in[0] <== in;
    get.in[1] <== range[0];

    out <== let.out * get.out;
}