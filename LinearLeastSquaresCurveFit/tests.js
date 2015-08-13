var fun = require('./usingFunctions');
var csv = require('./dataFromCSVFile');
var arr = require('./dataFromArrays');
var fs = require('fs');

module.exports = {
    tests: function () {
        test1();
        test2();
        test3();
        test4();
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
    csv.dataFromCSVFile('example_data.csv', function (result) {
        console.log(result);
    }, true, 0, 1);
}

function test3() {
    csv.dataFromCSVFile('example_data.csv', function (result) {
        console.log(result);
    });
}

function test4() {
    var x = arr.dataFromArrays([[1,1,1,1,1,1,1],[0,1,2,3,4,5,6],[0,1,4,9,16,25,36],[0,1,8,27,64,125,216]],[0,1,10,100,10,1,0]);
    console.log(x);
    fs.appendFileSync('tmp.txt', x + '\n');
    x = fitCurveExample2([0, 1, 2, 3, 4, 5, 6], 
                         [0, 1, 10, 100, 10, 1, 0]);
    console.log(x);
    fs.appendFileSync('tmp.txt', x + '\n');
}

function fitCurveExample(x, y, bounded, minValue, maxValue) {
    //y = A + B*x + C*x*x + D*exp(x) + E*ln(x)
    
    return fun.usingFunctions([
        function (x) { return 1; }, 
        function (x) { return x; }, 
        function (x) { return x * x; }, 
        function (x) { return Math.exp(x); },
        function (x) { return Math.log(x) }], 
        x, y, bounded, 
        [minValue, minValue, minValue, minValue, minValue], 
        [maxValue, maxValue, maxValue, maxValue, maxValue]);
}

function fitCurveExample2(x, y, bounded, minValue, maxValue) {
    //y = A + B*x + C*x*x + D*x*x*x
    
    return fun.usingFunctions([
        function (x) { return 1; }, 
        function (x) { return x; }, 
        function (x) { return x * x; }, 
        function (x) { return x * x * x; }], 
        x, y, bounded, 
        [minValue, minValue, minValue, minValue, minValue], 
        [maxValue, maxValue, maxValue, maxValue, maxValue]);
}
