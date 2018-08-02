
var isDoc = function(Permissioning, documentId) {
  Permissioning.methods.isDoc(documentId).call({
      from: '0x00E66aE8337A77602957B4f74866C3faF6799A36'
    }, (err, res) => {
    if(err) {
      console.log(err);
    }

    console.log(res);
  });
};

module.exports = {isDoc};
