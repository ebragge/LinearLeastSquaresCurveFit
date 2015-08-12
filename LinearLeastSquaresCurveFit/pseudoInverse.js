/**********************************************************************************/
/*
 * pseudoinverse.js
 *                                         *                            
 * Calculate Moore-Penrose pseudoinverse A
 * http://en.m.wikipedia.org/wiki/Moore-Penrose_pseudoinverse
 *
 *    *     T  -1  T
 *   A  = (A A)   A
 *
 */

var math = require('mathjs');

module.exports = {
    pseudoInverse: function (matrix) {
        
        var type = matrix.type;
        if (type != 'DenseMatrix') {
            throw new Exception('Invalid type');
        }
        var size = matrix.size();
        if (size.length != 2) {
            throw new Exception('Invalid size');
        }
        if (size[1] > size[0]) {
            throw new Exception('Invalid size');
        }

        var matrixTranspose = math.transpose(matrix);
        var matrixMultiply = math.multiply(matrixTranspose, matrix);
        if (math.det(matrixMultiply) == 0) {
            throw new Exception('Invalid matrix');
        }
        return math.multiply(math.inv(matrixMultiply), matrixTranspose);   
    }
}
