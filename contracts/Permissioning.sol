pragma solidity ^0.4.24;


/* contract SSPermissions {
  bytes32 documentKeyId1 = 0x45ce99addb0f8385bd24f30da619ddcc0cadadab73e2a4ffb7801083086b3fc2;
  bytes32 documentKeyId2 = 0x99284e283434f1264060fd30e188cca05ba18b9ca7af63a4fce6d0ed39079251;
  address alice = 0x007D8d0A4776dB12237b71bb4136C46C107a87B4;
  address bob = 0x00E66aE8337A77602957B4f74866C3faF6799A36;

  /// Both Alice and Bob can access the specified document
  function checkPermissions(address user, bytes32 document) constant returns (bool) {
    if ((document == documentKeyId1 || document == documentKeyId2) && (user == alice || user == bob) ) return true;
    return false;
  }
} */

// ACL ADDRESS: 0xC4F5DE89e5ddD32a57F25c5A1dfe0052d690E226
// nEW ACL ADDRESS: 0x962fC5D40A5C8a4De8575451674d112297E33E79
contract SSPermissions {
  struct User {
    bool isAdmin;
    uint index;
  }

  struct Document {
    bool validity;
    mapping(address => bool) canUserAccess;
    uint index;
  }

  mapping(bytes32 => Document) documents;
  bytes32[] docIndex;
  mapping(address => User) users;
  address[] userIndex;
  address creator;
  address alice = 0x007D8d0A4776dB12237b71bb4136C46C107a87B4;
  address bob = 0x00E66aE8337A77602957B4f74866C3faF6799A36;
  address charlie = 0x00d990EAAae496A0ff78603c418f6273Bb6AF90F;

  constructor() public {
    creator = msg.sender;
    createUser(creator);
    makeAdmin(creator);
    createDocument(0x45ce99addb0f8385bd24f30da619ddcc0cadadab73e2a4ffb7801083086b3fc2);
    addAccessor(0x45ce99addb0f8385bd24f30da619ddcc0cadadab73e2a4ffb7801083086b3fc2, bob);
  }

  address[] adminIndex;

  modifier adminOnly {
    if(users[msg.sender].isAdmin || msg.sender == creator) _;
  }

  function isUser(address _userId) public view returns(bool) {
    return users[_userId].index != 0;
  }

  function isAdmin(address _userId) public view returns(bool) {
    return users[_userId].isAdmin;
  }

  function isDoc(bytes32 _document) public view returns(bool) {
    return documents[_document].validity;
  }

  function createUser(address _userId) public returns(bool) {
    require(!isUser(_userId));
    userIndex.push(_userId);
    users[_userId].index = userIndex.length+1;
    return true;
  }

  function removeUser(address _userId) public returns(bool) {
    require(isUser(_userId));
    uint keyToReplace = users[_userId].index;
    address lastUser = userIndex[userIndex.length-1];
    users[userIndex[keyToReplace]].isAdmin = users[lastUser].isAdmin;
    userIndex.length--;
  }

  function makeAdmin(address _userId) adminOnly public {
    require(isUser(_userId));
    adminIndex.push(_userId);
    users[_userId].isAdmin = true;
  }

  function removeAdmin(address _userId) adminOnly public {
    require(isUser(_userId));
    users[_userId].isAdmin = false;
  }
  function makeUser(address _userId) adminOnly public {
    require(isUser(_userId));
    users[_userId].isAdmin = false;
  }

  function createDocument(bytes32 _document) public {
    require(!isDoc(_document));
    docIndex.push(_document);
    documents[_document].validity = true;
    documents[_document].canUserAccess[msg.sender] = true;
    for(uint i; adminIndex.length > i; i++) {
        if(users[adminIndex[i]].isAdmin == true) {
            documents[_document].canUserAccess[adminIndex[i]] = true;
        }
    }
  }

  function addAccessor(bytes32 _document, address _accessor) public adminOnly {
    require(isDoc(_document));
    documents[_document].canUserAccess[_accessor] = true;
  }

  function removeAccessor(bytes32 _document, address _accessor) public {
    require(isDoc(_document));
    require(documents[_document].canUserAccess[msg.sender] ||
    isAdmin(msg.sender));
    documents[_document].canUserAccess[_accessor] = false;
  }

  /// Both Alice and Bob can access the specified document
  function checkPermissions(address _user, bytes32 _document) public constant returns (bool) {
    require(isUser(_user));
    if(documents[_document].canUserAccess[_user] == true || isAdmin(_user)) {
      return true;
    }
  }
}
