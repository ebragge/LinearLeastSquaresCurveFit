var math = require('mathjs');

var curvefit1 = require('./boundedLinearLeastSquaresCurveFit');
var curvefit2 = require('./unboundedLinearLeastSquaresCurveFit');

module.exports = {
    fitCurveUsingFunctions: function (functions, x, y, bounded, minValues, maxValues) {
        
        function convertArrayToMatrix(array) {
            var matrix = math.matrix(array);
            matrix.resize([array.length, 1]);
            return matrix;
        }
        
        if (typeof x !== 'object' || typeof y !== 'object') {
            throw new Exception('Invalid arguments');
        }
        
        if (Object.prototype.toString.call(x) !== '[object Array]' ||
        Object.prototype.toString.call(y) !== '[object Array]') {
            throw new Exception('Invalid arguments');
        }
        
        if (x.length != y.length || x.length < functions.length) {
            throw new Exception('Invalid arguments');
        }
        
        var vectors = [];;
        
        for (var f = 0; f < functions.length; f++) {
            var fun = [];
            if (typeof functions[f] !== 'function') { throw new Exception('Invalid arguments'); }
            for (var ind = 0; ind < x.length; ind++) { fun.push(functions[f](x[ind])); }
            vectors.push(convertArrayToMatrix(fun));
        }
        
        if (bounded)
            // returns array
            return curvefit1.boundedLinearLeastSquaresCurveFit(vectors, y, minValues, maxValues);
        else {
            // res is a matrix 
            var res = curvefit2.unboundedLinearLeastSquaresCurveFit(vectors, y);
            var tmp = [];
            for (var ind = 0; ind < vectors.length; ind++) {
                tmp.push(math.subset(res, math.index(ind)));
            }
            // return array
            return tmp; 
        }
    }
}
