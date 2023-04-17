// var Web3 = require('web3');

// if (typeof web3 !== 'undefined') {
//     web3 = new Web3(web3.currentProvider); //如果已经设置了 Provider
// } else {
//     web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
// }

// const solc = require('solc')

// var source = "" +
//     "contract test {\n" +
//     "   function multiply(uint a) returns(uint d) {\n" +
//     "       return a * 7;\n" +
//     "   }\n" +
//     "}\n";
// // var compiled = web3.eth.compile.solidity(source);

// const solcOutput = solc.compile({ sources: { main: source } }, 1)

// console.log(solcOutput);

let Web3 = require('web3');
let web3;
const solc = require('solc')

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
}

let from = web3.eth.accounts[0];
// console.log(from);


let source = "pragma solidity ^0.4.0;contract Calc{  /*区块链存储*/  uint count;  /*执行会写入数据，所以需要`transaction`的方式执行。*/ uint result; function add(uint a, uint b) returns(uint){    count++;  result = a + b;  return result;  }  /*执行不会写入数据，所以允许`call`的方式执行。*/  function getCount() constant returns (uint){    return count;  } function getResult() constant returns (uint){ return result; }}";

// let source = "pragma solidity ^0.4.0; contract Calc {/*区块链存储*/uint count; /*执行会写入数据，所以需要`transaction`的方式执行。*/uint result; /*执行会写入数据，所以需要`transaction`的方式执行。*/function add(uint a, uint b)returns(uint) {count++; result = a + b; return result; }/*执行不会写入数据，所以允许`call`的方式执行。*/function getCount()constant returns (uint) {return count; }} function getResult() constant returns (uint){ return result; }}";

const calcCompiled = solc.compile({ sources: { main: source } }, 1)


let abiDefinition = calcCompiled.contracts['main:Calc'].interface;


let deployCode = calcCompiled.contracts['main:Calc'].bytecode;

let deployeAddr = web3.eth.accounts[0];
let calcContract = web3.eth.contract(JSON.parse(abiDefinition));


let gasEstimate = web3.eth.estimateGas({ data: deployCode });
console.log(gasEstimate);

let myContractReturned = calcContract.new({
    data: deployCode,
    from: deployeAddr,
    gas: gasEstimate
}, function(err, myContract) {
    console.log("+++++");
    if (!err) {
  
        if (!myContract.address) {
            console.log("contract deploy transaction hash: " + myContract.transactionHash) //部署合约的交易哈希值

            // 合约发布成功后，才能调用后续的方法
        } else {
            console.log("contract deploy address: " + myContract.address) // 合约的部署地址

            //使用transaction方式调用，写入到区块链上
            myContract.add.sendTransaction(1, 2, {
                from: deployeAddr
            });

            console.log("after contract deploy, call:" + myContract.getCount.call());
            console.log("result:" + myContract.getResult.call());
        }

    } else {
        console.log(err);
    }
});

