var makeUser = function(Permissioning, username) {
  Permissioning.methods.makeUser(username).send({
      from: '0x00E66aE8337A77602957B4f74866C3faF6799A36'
    }, (err, res) => {
    if(err) {
      return console.log(err);
    }

    console.log(res);
  });
};

module.exports = {makeUser};
