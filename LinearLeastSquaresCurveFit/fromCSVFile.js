var parse = require('csv-parse');
var math = require('mathjs');
var fs = require('fs');

var curvefit1 = require('./boundedLinearLeastSquaresCurveFit');
var curvefit2 = require('./unboundedLinearLeastSquaresCurveFit');

module.exports = {
    fromCSVFile: function (dataPath, callback, bounded, minValue, maxValue, delimiterChar) {
        function parseRow(element, index, array) {
            array[index] = parseFloat(element);
        }
        
        function parseData(element, index, array) {
            element.forEach(parseRow);
        }
        
        if (typeof maxValue === 'undefined') minValue = 0;
        if (typeof maxValue != 'number') minValue = 0;
        
        if (typeof maxValue === 'undefined') maxValue = 1;
        if (typeof maxValue != 'number' || maxValue <= minValue) maxValue = minValue + 1;
        
        if (typeof delimiterChar === 'undefined') delimiterChar = ';';
        else if (typeof delimiterChar === 'string') {
            if (delimiterChar.length != 1) delimiterChar = ';';
        } else delimiterChar = ';';
        
        var dataparser = parse({ delimiter: delimiterChar }, function (err, data) {
            if (!err) {
                data.forEach(parseData);
                
                var target = data[data.length - 1];
                var minValues = [];
                var maxValues = [];
                var vectorData = [];
                
                for (var c = 0; c < data.length - 1; c++) {
                    var row = math.matrix(data[c]);
                    row.resize([data[c].length, 1]);
                    vectorData.push(row);
                    minValues.push(minValue);
                    maxValues.push(maxValue);
                }
                var x = null;
                    if (bounded) {
                    // returns array
                    x = curvefit1.boundedLinearLeastSquaresCurveFit(vectorData, target, minValues, maxValues);
                }
                else {  
                    // res is a matrix 
                    var res = curvefit2.unboundedLinearLeastSquaresCurveFit(vectorData, target);
                    x = [];
                    for (var ind = 0; ind < vectorData.length; ind++) {
                        x.push(math.subset(res, math.index(ind)));
                    }
                }
                
                if (typeof callback === 'function') {
                    callback(x);
                }
            }
        });
        
        if (fs.existsSync(dataPath)) {
            var datastream = fs.createReadStream(dataPath);
            datastream.pipe(dataparser);
        }
    }
}
