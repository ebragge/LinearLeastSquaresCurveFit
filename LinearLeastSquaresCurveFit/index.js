var curvefit = require('./fitCurveUsingFunctions');
var csv = require('./fromCSVFile');
var test = require('./tests');

module.exports = {
    createFittingCurveUsingFunctions: function (functions, x, y, bounded, minValues, maxValues) {
        return curvefit.fitCurveUsingFunctions(functions, x, y, bounded, minValues, maxValues)
    },
    createFittingUsingDataFromCSVFile: function(dataPath, callback, bounded, minValue, maxValue, delimiterChar) {
        return csv.fromCSVFile(dataPath, callback, bounded, minValue, maxValue, delimiterChar);
    },
    tests: function() {
        return test.tests();
    }
}

