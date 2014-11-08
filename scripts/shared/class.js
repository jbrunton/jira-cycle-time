module.exports = Class;

function Class(target) {
  return {
    extends: function(parent) {
      target.prototype = Object.create(parent.prototype);
    }
  }
}
