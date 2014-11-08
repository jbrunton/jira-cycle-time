var moment = require('moment');

require('../../../scripts/ui/helpers/date_helper');
var dateTemplate = require('./templates/date.hbs');

describe ('Handlebars Helpers', function() {  
  describe ('date', function() {
    it ("formats dates", function() {
      var exampleDate = moment('2014-07-04T14:15:00');
      var output = dateTemplate({date: exampleDate});
      expect(output).toBe('July 4th 2014, 2:15:00 pm');
    });
  });
});
