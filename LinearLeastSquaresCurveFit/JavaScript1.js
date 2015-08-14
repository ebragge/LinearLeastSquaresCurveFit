var fit = require('./index');
var fs = require('fs');

fit.createFittingCurveUsingDataFromCSVFile("example_data2.csv", 
    function (result) {
    console.log(result);
    fs.appendFileSync('bound2.txt', result);
}, true, 0, 1, ';'
);