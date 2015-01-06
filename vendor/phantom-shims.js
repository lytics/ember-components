// Shim Function.prototype.bind for PhantomJS
// see: https://github.com/ariya/phantomjs/issues/10522
Function.prototype.bind || (Function.prototype.bind = function(context) {
  var fn = this;
  var args = [].slice.call(arguments, 1);

  return function() {
    return fn.apply(context, args.concat([].slice.call(arguments)));
  };
});