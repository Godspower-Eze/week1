#!/bin/bash

#export NODE_OPTIONS="--max-old-space-size=16384"

cd projects/zkPuzzles

mkdir Sudoku

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling Sudoku.circom..."

# compile circuit

circom sudoku.circom --r1cs --wasm --sym -o Sudoku
# snarkjs r1cs info Sudoku/sudoku.r1cs

# # Start a new zkey and make a contribution

# snarkjs groth16 setup Sudoku/sudoku.r1cs powersOfTau28_hez_final_10.ptau Sudoku/circuit_0000.zkey
# snarkjs zkey contribute Sudoku/circuit_0000.zkey Sudoku/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
# snarkjs zkey export verificationkey Sudoku/circuit_final.zkey Sudoku/verification_key.json

# # generate solidity contract
# snarkjs zkey export solidityverifier Sudoku/circuit_final.zkey ../SudokuVerifier.sol

# cd ../..