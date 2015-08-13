var math = require('mathjs');

var curvefit1 = require('./boundedLinearLeastSquaresCurveFit');
var curvefit2 = require('./unboundedLinearLeastSquaresCurveFit');

module.exports = {
    dataFromArrays: function (vectors, target, bounded, minValues, maxValues) {
        
        function convertArrayToMatrix(array) {
            var matrix = math.matrix(array);
            matrix.resize([array.length, 1]);
            return matrix;
        }
        
        var mVectors = [];
        
        for (var v = 0; v < vectors.length; v++) {
            mVectors.push(convertArrayToMatrix(vectors[v]));
        }
        
        if (bounded)
            // returns array
            return curvefit1.boundedLinearLeastSquaresCurveFit(mVectors, target, minValues, maxValues);
        else {
            // res is a matrix 
            var res = curvefit2.unboundedLinearLeastSquaresCurveFit(mVectors, target);
            var tmp = [];
            for (var ind = 0; ind < vectors.length; ind++) {
                tmp.push(math.subset(res, math.index(ind)));
            }
            // return array
            return tmp;
        }
    }
}
