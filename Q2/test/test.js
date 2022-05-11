const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing

        // Takes in the inputs, compiled circuit in wasm and verification key produced from the ceremony and returns the proof stored in 'proof' variable and the public variables stored in 'publicSignals' 
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

        // Prints the public output in the console
        console.log('1x2 =',publicSignals[0]);

        // Converts the elements of the 'publicSignals' array to big integer form
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // Converts the elements of the 'proof' array to big integer form
        const editedProof = unstringifyBigInts(proof);
        // Generates the arguments for the `verifyProof` function
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        
        // - Removes whitespaces, square brackets ([]) and quotation marks("") from the calldata
        // - Splits by comma(,) turning it into an array
        // - Then, converts each element of the array to a big integer form and then to string
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        
        // An array of the first and second element of argv array as the value of a
        const a = [argv[0], argv[1]];
        // An array of the third, fourth,fifth and six element of argv array as the value of b
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        // An array of the seventh and eight element of argv array as the value of c
        const c = [argv[6], argv[7]];
        // An array of just the last element in argv
        const Input = argv.slice(8);

        // Assert that the value of verifyProof would be true when the values of a, b, c and Input are used as the arguments
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here

        // Takes in the inputs, compiled circuit in wasm and verification key produced from the ceremony and returns the proof stored in 'proof' variable and the public variables stored in 'publicSignals' 
        const { proof, publicSignals } = await groth16.fullProve({"a":"2", "b":"3", "c":"4"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");

        // Prints the public output in the console
        console.log('2x3x4 =',publicSignals[0]);

        // Converts the elements of the 'publicSignals' array to big integer form
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // Converts the elements of the 'proof' array to big integer form
        const editedProof = unstringifyBigInts(proof);
        // Generates the arguments for the `verifyProof` function
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        
        // - Removes whitespaces, square brackets ([]) and quotation marks("") from the calldata
        // - Splits by comma(,) turning it into an array
        // - Then, converts each element of the array to a big integer form and then to string
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        
        // An array of the first and second element of argv array as the value of a
        const a = [argv[0], argv[1]];
        // An array of the third, fourth,fifth and six element of argv array as the value of b
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        // An array of the seventh and eight element of argv array as the value of c
        const c = [argv[6], argv[7]];
        // An array of just the last element in argv
        const Input = argv.slice(8);

        // Assert that the value of verifyProof would be true when the values of a, b, c and Input are used as the arguments
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let Input = [0]
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {

    beforeEach(async function () {
        //[assignment] insert your script here
        Verifier = await ethers.getContractFactory("PlonkVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const { proof, publicSignals } = await plonk.fullProve({"a":"3", "b":"4", "c":"5"}, "contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3_plonk/circuit_final.zkey");

        // Prints the public output in the console
        console.log('3x4x5 =', publicSignals[0]);

        // Converts the elements of the 'publicSignals' array to big integer form
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        // Converts the elements of the 'proof' array to big integer form
        const editedProof = unstringifyBigInts(proof);
        // Generates the arguments for the `verifyProof` function
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);
        
        // - Removes whitespaces, square brackets ([]) and quotation marks("") from the calldata
        // - Splits by comma(,) turning it into an array
        // - Then, converts each element of the array to string
        const argv = calldata.replace(/["[\]\s]/g, "").split(',');
        
        // First argument of the `verifyProof` function in bytes
        const proofArg = argv[0]
        // Second argument of the `verifyProof` function as array of numbers(as string)
        const publicSignalsArg = unstringifyBigInts([argv[1]]).map( x => x.toString())

        // Assert that the value of verifyProof would be true when the values of a, b, c and Input are used as the arguments
        expect(await verifier.verifyProof(proofArg, publicSignalsArg)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        const proofArg = '0x0000000000000000000000'
        const publicSignalsArg = ['0']
        expect(await verifier.verifyProof(proofArg, publicSignalsArg)).to.be.false;
    });
});