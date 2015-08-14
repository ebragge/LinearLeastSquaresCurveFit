var fit = require('./index');
var fs = require('fs');

fit.createFittingCurveUsingDataFromCSVFile("example_data4.csv", 
    function (result) {
    console.log(result);
    fs.appendFileSync('bound4.txt', result);
}, true, 0, 1, ';'
);