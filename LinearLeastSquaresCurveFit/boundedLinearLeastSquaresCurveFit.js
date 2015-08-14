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

module.exports = {
    boundedLinearLeastSquaresCurveFit: function (vectors, target, minValues, maxValues) {
        return _boundedLinearLeastSquaresCurveFit(vectors, target, minValues, maxValues, false);
    }
}

function _boundedLinearLeastSquaresCurveFit(vectorData, target, minValues, maxValues, maxed, maxedVectors) {
    
    function removeVector(ii) {
        vectorDataCopy.splice(ii, 1);
        index.splice(ii, 1);
        activeVectors--;
        noSolution = activeVectors > 0; // Recalculate after VECTOR removal
    }
   
    // Make copies since arrays change within calculation
    var vectorDataCopy = vectorData.slice();
    var activeVectors = vectorData.length;

    var b = math.matrix(target);
    b.resize([target.length, 1]); // change size from [n] -> [n, 1] for matrix calculations
    
    // Keep track of boundary breaks
    var minimumBoundaryBroken = false;
    var maximumBoundaryBroken = false;
    
    // Solution
    var result = new Array(activeVectors);
    
    // Keep track of active vectors
    var index = new Array(activeVectors);
    for (var i = 0; i < activeVectors; i++) { index[i] = i; result[i] = 0; }
    
    // Remove maxed vectors from calculation
    if (maxed) { 
        for (var i = maxedVectors.length - 1; i >= 0; i--) {
            if (maxedVectors[i] == 1) {
                vectorDataCopy.splice(i, 1);
                index.splice(i, 1);
                activeVectors--;
                result[i] = maxValues[i];

                // Modify target 
                for (j = 0; j < target.length; j++) { 
                    b.subset(math.index(j, 0),
                             (math.subset(b, math.index(j, 0))) -
                             (maxValues[i] * math.subset(vectorData[i], math.index(j, 0))));
                }
            }
        }
    }
    
    var x = null;
    var noSolution = true;
    while (noSolution) {
        x = curvefit.unboundedLinearLeastSquaresCurveFit(vectorDataCopy, b);
        noSolution = false;
        var boundaryBreak = false;
        var biggestError = 0;
        var removeIndex;
        for (var i = activeVectors - 1; i >= 0; i--) {
            var factor = math.subset(x, math.index(i, 0));
            var minimum = minValues[index[i]];
            if (factor < minimum) { // Factor cannot be below minimum
                if (minimum - factor > biggestError) {
                    removeIndex = i;
                    biggestError = minimum - factor;
                }
                boundaryBreak = true;
                minimumBoundaryBroken = true;
            }
        }
        if ( boundaryBreak ) {     
            var factor = math.subset(x, math.index(removeIndex, 0));
            var minimum = minValues[index[removeIndex]];             
            result[index[removeIndex]] = minimum;     // Use minimum value
            for (var j = 0; j < target.length; j++) { // Modify target data 
                b.subset(math.index(j, 0),
                    (math.subset(b, math.index(j, 0))) -
                    (minimum * math.subset(vectorDataCopy[removeIndex], math.index(j, 0))));
            }
            removeVector(removeIndex); // Remove vector from further calculations
        }
        else {
            biggestError = 0;
            boundaryBreak = false;
            for (var i = activeVectors - 1; i >= 0; i--) {
                var factor = math.subset(x, math.index(i, 0));
                var maximum = maxValues[index[i]];
                if (factor > maximum) {  // Factor cannot exceed maximumValue
                    if (factor - maximum > biggestError) {
                        removeIndex = i;
                        biggestError = factor - maximum;
                    }
                    boundaryBreak = true;
                    maximumBoundaryBroken = true;
                }
            }
            if (boundaryBreak) {
                var factor = math.subset(x, math.index(removeIndex, 0));
                var maximum = maxValues[index[removeIndex]];
                result[index[removeIndex]] = maximum;     // Use maximum value
                for (var j = 0; j < target.length; j++) { // Modify target data 
                    b.subset(math.index(j, 0),
                        (math.subset(b, math.index(j, 0))) -
                        (maximum * math.subset(vectorDataCopy[removeIndex], math.index(j, 0))));
                }
                removeVector(removeIndex); // Remove vector from further calculations
            }
        }
    }
    for (var i = activeVectors - 1; i >= 0; i--) {
        result[index[i]] = math.subset(x, math.index(i, 0));
    }
    
    // If both boundaries are broken recalculate
    if (minimumBoundaryBroken && maximumBoundaryBroken) {
        var mVectors = [];
        for (var i = 0; i < result.length; i++) {
            if (result[i] == maxValues[i]) mVectors.push(1);
            else mVectors.push(0);
        }
        return _boundedLinearLeastSquaresCurveFit(vectorData, target, minValues, maxValues, true, mVectors)
    } 
    else {
        return result;
    }
}
