var fun = require('./usingFunctions');
var arr = require('./dataFromArrays');
var csv = require('./dataFromCSVFile');

var test = require('./tests');

module.exports = {
    createFittingCurveUsingFunctions: function (functions, x, y, bounded, minValues, maxValues) {
        return fun.usingFunctions(functions, x, y, bounded, minValues, maxValues)
    },
    createFittingCurveUsingDataFromArrays: function (vectors, target, bounded, minValues, maxValues) {
        return arr.dataFromArrays(vectors, target, bounded, minValues, maxValues);
    },
    createFittingCurveUsingDataFromCSVFile: function(dataPath, callback, bounded, minValue, maxValue, delimiterChar) {
        return csv.dataFromCSVFile(dataPath, callback, bounded, minValue, maxValue, delimiterChar);
    },
    tests: function() {
        return test.tests();
    }
}
