var curvefit = require('./fitCurveUsingFunctions');
var csv = require('./fromCSVFile');

module.exports = {
    tests: function () {
        test1();
        test2();
        test3();
    }
}

function test1() {
    var x = fitCurveExample([1, 2, 3, 4, 5, 6, 7, 8, 9], 
                            [0, 1, 4, 10, 100, 118, 125, 129, 131]);
    console.log(x);
    
    x = fitCurveExample([1, 2, 3, 4, 5, 6, 7, 8, 9], 
                        [0, 1, 4, 10, 100, 118, 125, 129, 131], true, 
                        0, 1000);
    console.log(x);
    
    x = fitCurveExample([1, 2, 3, 4, 5, 6, 7, 8, 9], 
                        [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    console.log(x);
    
    x = fitCurveExample([1, 2, 3, 4, 5, 6, 7, 8, 9], 
                        [1, 2, 3, 4, 5, 6, 7, 8, 9], true, 
                        0, 1000);
    console.log(x);
}

function test2() {
    csv.fromCSVFile('example_data.csv', function (result) {
        console.log(result);
    }, true, 0, 1);
}

function test3() {
    csv.fromCSVFile('example_data.csv', function (result) {
        console.log(result);
    });
}

function fitCurveExample(x, y, bounded, minValue, maxValue) {
    //y = A + B*x + C*x*x + D*exp(x) + E*ln(x)
    
    return curvefit.fitCurveUsingFunctions([
        function (x) { return 1; }, 
        function (x) { return x; }, 
        function (x) { return x * x; }, 
        function (x) { return Math.exp(x); },
        function (x) { return Math.log(x) }], 
        x, y, bounded, 
        [minValue, minValue, minValue, minValue, minValue], 
        [maxValue, maxValue, maxValue, maxValue, maxValue]);
}
