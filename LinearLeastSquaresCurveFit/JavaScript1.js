var fit = require('./index');
var fs = require('fs');

fit.createFittingCurveUsingDataFromCSVFile("example_data3.csv", 
    function (result) {
    console.log(result);
    fs.appendFileSync('bound3.txt', result);
}, true, 0, 1, ';'
);