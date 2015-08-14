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
var mxA = require('./createMatrix'); 

module.exports = {
    unboundedLinearLeastSquaresCurveFit: function (vectors, target, forceMatrix) {
        var A = mxA.createMatrix(vectors);
        return this.unboundedLinearLeastSquaresCurveFitA(A, target);
    },
    unboundedLinearLeastSquaresCurveFitA: function (A, target, forceMatrix) {
        var x = math.multiply(pInv.pseudoInverse(A), target);
        if (forceMatrix && typeof (x) == 'number') { // convert number back to 1x1 matrix
            return math.matrix([[x]]);
        }
        else return x;
    }
}
