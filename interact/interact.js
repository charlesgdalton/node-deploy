const yargs = require('yargs');
const _ = require('lodash');
const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');
const path = require('path');

var {checkPermissions} = require('./callers/checkPermissions');
var {isAdmin} = require('./callers/isAdmin');
var {isDoc} = require('./callers/isDoc');
var {isUser} = require('./callers/isUser');

var {addAccessor} = require('./senders/addAccessor');
var {createDocument} = require('./senders/createDocument');
var {createUser} = require('./senders/createUser');
var {makeAdmin} = require('./senders/makeAdmin');
var {makeUser} = require('./senders/makeUser');
var {removeAccessor} = require('./senders/removeAccessor');
var {removeAdmin} = require('./senders/removeAdmin');

const documentIDOptions = {
  describe: 'ID of document',
  demand: true,
  alias: 'd'
};

const userAddressOptions = {
  describe: 'The address of a user',
  demand: true,
  alias: 'a'
};

const argv = yargs
  .command('isdoc', 'Checks to see if there is a document', {
    documentID: documentIDOptions
  })
  .command('isuser', 'Checks to see if there is a user', {
    userAddress: userAddressOptions
  })
  .command('createdocument', 'Creates a document', {
    documentID: documentIDOptions
  })
  .command('createuser', 'Creates a user', {
    userAddress: userAddressOptions
  })
  .command('checkpermissions', 'Checks permissions', {
    userAddress: userAddressOptions,
    documentID: documentIDOptions
  })
  .command('isadmin', 'Checks for admin', {
    userAddress: userAddressOptions
  })
  .command('addaccessor', 'Creates a user', {
    userAddress: userAddressOptions,
    documentID: documentIDOptions
  })
  .command('makeadmin', 'Creates a user', {
    userAddress: userAddressOptions
  })
  .command('makeuser', 'Creates a user', {
    userAddress: userAddressOptions
  })
  .command('removeaccessor', 'Creates a user', {
    userAddress: userAddressOptions,
    documentID: documentIDOptions
  })
  .command('removeadmin', 'Creates a user', {
    userAddress: userAddressOptions
  })
  .help()
  .argv;
let command = argv._[0];

let web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://10.10.10.11:8540'));
console.log('Connected to Http Provider!');

const input = fs.readFileSync(path.resolve('./contracts/Permissioning.sol'));
const output = solc.compile(input.toString(), 1);
const abi = JSON.parse(output.contracts[':SSPermissions'].interface);

var Permissioning = new web3.eth.Contract(abi, '0x962fC5D40A5C8a4De8575451674d112297E33E79');

if(command === 'checkpermissions') {
  checkPermissions(Permissioning, argv.userAddress, argv.documentID);
} else if(command === 'isadmin') {
  checkPermissions(Permissioning, argv.userAddress);
} else if(command === 'checkdoc') {
  isDoc(Permissioning, argv.documentID);
} else if(command === 'checkuser') {
  isUser(Permissioning, argv.userAddress);
} else if(command === 'addaccessor') {
  addAccessor(Permissioning, argv.userAddress, argv.documentID);
} else if(command === 'createdocument') {
  createDocument(Permissioning, argv.documentID);
} else if(command === 'createuser') {
  createUser(Permissioning, argv.userAddress);
} else if(command === 'makeadmin') {
  checkPermissions(Permissioning, argv.userAddress);
} else if(command === 'makeuser') {
  makeUser(Permissioning, argv.userAddress);
} else if(command === 'removeaccessor') {
  makeUser(Permissioning, argv.userAddress, argv.documentID);
} else if(command === 'removeadmin') {
  makeUser(Permissioning, argv.userAddress);
} else {
  console.log('If statement failed');
}
