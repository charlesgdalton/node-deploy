pragma solidity ^0.4.24;

contract SSPermissions {
  bytes32 documentKeyId = 0x45ce99addb0f8385bd24f30da619ddcc0cadadab73e2a4ffb7801083086b3fc2;
  address alice = 0x007D8d0A4776dB12237b71bb4136C46C107a87B4;
  address bob = 0x00E66aE8337A77602957B4f74866C3faF6799A36;

  /// Both Alice and Bob can access the specified document
  function checkPermissions(address user, bytes32 document) constant returns (bool) {
    if (document == documentKeyId && (user == alice || user == bob) ) return true;
    return false;
  }
}
