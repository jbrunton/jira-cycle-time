function Greeter() {
}

Greeter.prototype.greet = function(whom) {
  return "Hello, " + whom + "!";
};

module.exports = Greeter;
