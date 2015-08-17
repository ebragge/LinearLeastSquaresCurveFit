/**********************************************************************************/
/*                                                                    *
 * Calculate best fit x for Ax = b using Moore-Penrose pseudoinverse A
 * http://en.m.wikipedia.org/wiki/Moore-Penrose_pseudoinverse
 *
 *   Ax = b
 *
 *        *
 *   x = A b
 *
 *    *     T  -1  T
 *   A  = (A A)   A
 *
 * 
 *      | x  |
 *      |  0 |
 *      |    |
 *  x = | x  | 
 *      |  1 |
 *      |    |
 *      | x  |
 *      |  n |
 * 
 *   where   min  <= x  <= max
 *              i     i       i
 */

var math = require('mathjs');
var curvefit = require('./unboundedLinearLeastSquaresCurveFit');
var createMatrix = require('./createMatrix');
var fitError = require('./fitError');

var fs = require('fs');

module.exports = {
    boundedLinearLeastSquaresCurveFit: function (vectorData, target, minValues, maxValues) {
        
        function removeVector(ii) {
            vectorDataCopy.splice(ii, 1);
            index.splice(ii, 1);
            activeVectors--;
            noSolution = activeVectors > 0; // Recalculate after VECTOR removal
        }
        
        // Make copies since arrays change within calculation
        var vectorDataCopy = vectorData.slice();
        var activeVectors = vectorData.length;
        
        var b = createMatrix.createVector(target);
        
        // Solution
        var result = new Array(activeVectors);
        
        // Keep track of active vectors
        var index = new Array(activeVectors);

        for (var i = 0; i < activeVectors; i++) {
            index[i] = i;
            result[i] = 0;
        }
                
        var x = null;
        var noSolution = true;

        while (noSolution) {
            var A = createMatrix.createMatrix(vectorDataCopy);
            x = curvefit.unboundedLinearLeastSquaresCurveFitA(A, b, true);
            var err = fitError.fitError(A, x, b);
            
            // Uses bounded values
            var xx = createMatrix.cloneMatrix(x);
            for (var i = activeVectors - 1; i >= 0; i--) {
                var factor = math.subset(x, math.index(i, 0));
                var minimum = minValues[index[i]];
                var maximum = maxValues[index[i]];
                if (factor < minimum || factor > maximum) { // boundary break
                    xx.subset(math.index(i, 0), factor < minimum ? minimum : maximum);
                }
            }

            noSolution = false;
            var smallestError = null;
            var removeIndex = -1;
            
            for (var i = activeVectors - 1; i >= 0; i--) {
                var factor = math.subset(x, math.index(i, 0));
                var minimum = minValues[index[i]];
                var maximum = maxValues[index[i]];
                if (factor < minimum || factor > maximum) { // boundary break
                    
                    var xc = createMatrix.cloneMatrix(xx);
                    xc.subset(math.index(i, 0), factor);
                    var errc = fitError.fitError(A, xc, b);

                    // Find vector which has least effect on result
                    if (smallestError == null || errc - err < smallestError) {
                        removeIndex = i;
                        smallestError = errc - err; 
                    }
                }
            }
            if (removeIndex >= 0) {
                var factor = math.subset(x, math.index(removeIndex, 0));
                var minimum = minValues[index[removeIndex]];
                var maximum = maxValues[index[removeIndex]];
                var val = factor < minimum ? minimum : maximum;
                
                result[index[removeIndex]] = val;     // Use boundary value
                
                for (var j = 0; j < target.length; j++) { // Modify target data 
                    b.subset(math.index(j, 0),
                        (math.subset(b, math.index(j, 0))) -
                        (val * math.subset(vectorDataCopy[removeIndex], math.index(j, 0))));
                }
                removeVector(removeIndex); // Remove vector from further calculations
            }
        }
        for (var i = activeVectors - 1; i >= 0; i--) {
            result[index[i]] = math.subset(x, math.index(i, 0));
        }   
        return result;
    }
}
