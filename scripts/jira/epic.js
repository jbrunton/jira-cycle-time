var Issue = require('./issue');
var Class = require('../shared/class');

module.exports = Epic;

Class(Epic).extends(Issue);

function Epic(json) {
  Issue.call(this, json);
}

Epic.fromJson = function(json) {
  return new Epic(json);
};
