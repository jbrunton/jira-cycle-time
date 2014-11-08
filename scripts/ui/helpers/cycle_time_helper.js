var Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('cycle_time', function() {
  if (this.startedDate && this.completedDate) {
    var diffString = Handlebars.Utils.escapeExpression(this.startedDate.from(this.completedDate, true));
    return new Handlebars.SafeString(diffString);
  }
});
