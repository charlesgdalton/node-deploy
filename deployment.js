const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');
const path = require('path');

let web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://10.10.10.11:8540'));
console.log('Connected to Http Provider!');


const input = fs.readFileSync(path.resolve('./contracts/Permissioning.sol'));
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[':SSPermissions'].bytecode;
const abi = JSON.parse(output.contracts[':SSPermissions'].interface);
console.log('Parsed everything!');


web3.eth.sendTransaction({
  from: '0x00E66aE8337A77602957B4f74866C3faF6799A36', //this is bob, which is why 10.10.10.11
  data: '0x' + bytecode,
  gas: 4700000
}).then((tx) => {
  console.log(tx.contractAddress);
}).catch((e) => {
  console.error(`ERROR: ${e}`);
});

module.exports = {
  bytecode,
  abi
}
