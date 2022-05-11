pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

template Multiplier2 () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;  
   signal output c;  

   // Constraints.  
   c <== a * b;  
}

template Multiplier3 () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal output d;

   // Components
   component firstMultiplier2 = Multiplier2();
   component secondMultiplier2 = Multiplier2();

   // Assignment of signals.
   firstMultiplier2.a <== a;
   firstMultiplier2.b <== b;
   secondMultiplier2.a <== firstMultiplier2.c;
   secondMultiplier2.b <== c;

   // Constraints.  
   d <== secondMultiplier2.c;  
}

component main = Multiplier3();