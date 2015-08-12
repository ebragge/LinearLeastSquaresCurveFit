/**********************************************************************************/
/*                                                                    *
 * Calculate best fit x for Ax = b using Moore-Penrose pseudoinverse A
 * http://en.m.wikipedia.org/wiki/Moore-Penrose_pseudoinverse#Linear_least-squares
 *
 *   Ax = b
 *
 *        *
 *   x = A b
 *
 *    *     T  -1  T
 *   A  = (A A)   A
 *
 */

var math = require('mathjs');
var pInv = require('./pseudoInverse'); 

module.exports = {
    unboundedLinearLeastSquaresCurveFit: function (vectors, target) {
        var A = createMatrix(vectors);
        var x = math.multiply(pInv.pseudoInverse(A), target);
        if (typeof (x) == 'number') { // convert number back to 1x1 matrix
            return math.matrix([[x]]);
        }
        else return x;
    }
}

// Create matrix from vector data
function createMatrix(vectors) {
    var A = null;
    for (var index = 0; index < vectors.length; index++) {
        var cc = math.zeros(1, vectors.length);
        cc.subset(math.index(0, index), 1);
        if (A == null) {
            A = math.multiply(vectors[index], cc);
        } else {
            A = math.add(A, math.multiply(vectors[index], cc));
        }
    }
    return A;
}
