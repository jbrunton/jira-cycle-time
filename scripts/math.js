function Math() { 
}

Math.prototype.fib = function(n) {
  if (n <= 1) {
    return n;
  } else {
    return this.fib(n-1) + this.fib(n-2);
  }
}

module.exports = Math;
