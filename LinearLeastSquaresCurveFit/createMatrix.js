var math = require('mathjs');

module.exports = {
    // Create matrix from vector data
    createMatrix: function (vectors) {
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
    },
    createVector: function (array) {
        var vec = math.matrix(array);
        vec.resize([array.length, 1]); // change size from [n] -> [n, 1] for matrix calculations  
        return vec;  
    }, 
    cloneMatrix: function (matrix) {
        var size = matrix.size();
        var A = math.zeros(size[0], size[1]);
        for (var i = 0; i < size[0]; i++) {
            for (var j = 0; j < size[1]; j++) {
                A.subset(math.index(i, j), math.subset(matrix, math.index(i, j)));
            }
        }
        return A;
    }
}
