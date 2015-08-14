var fit = require('./index');
var fs = require('fs');

fit.createFittingCurveUsingDataFromCSVFile("example_data1.csv", 
    function (result) {
    console.log(result);
    fs.appendFileSync('bound1.txt', result);
}, true, 0, 1, ';'
);