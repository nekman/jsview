/**
 * ReDefine 
 * 
 * Utility for CommonJS that re-defines RequireJS define method 
 * and make it possible to use stub/fake dependencies.
 */
(function(fs) {
  
  var ReDefine = function() {    
  };

  ReDefine.prototype = {
    define: function(dependencies, callback) {
      var fakes = [], 
          self = this;

      dependencies.forEach(function(dependency) {
        var fake = self.fakeDependencies[dependency];
        fake && fakes.push(fake);
      });

      if (typeof callback === 'function') {
        return callback.apply(null, fakes);
      }

      return callback;
    },

    use: function(fakeDependencies) {
      this.fakeDependencies = fakeDependencies || [];

      return this;
    },

    require: function(module) {
      var file = fs.readFileSync(__dirname + module).toString(),

          // Redefine local define to instance define.
          define = this.define.bind(this);

      //Eval is evil, but runs the code in the local scope.
      return eval(file);
    }
  };

  module.exports = new ReDefine;

}(require('fs')));