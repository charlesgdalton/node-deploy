var removeAccessor = function(Permissioning, username, documentId) {
  Permissioning.methods.removeAccessor(documentId, username).send({
      from: '0x00E66aE8337A77602957B4f74866C3faF6799A36'
    }, (err, res) => {
    if(err) {
      return console.log(err);
    }

    console.log(res);
  }).catch((e) => {
    console.log();
  });
};

module.exports = {removeAccessor};
