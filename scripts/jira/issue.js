module.exports = Issue;

function Issue(json) {
  // _.assign(this, json);
  this.key = json.key;
  this.summary = json.fields.summary;
}

Issue.fromJson = function(json) {
  return new Issue(json);
};