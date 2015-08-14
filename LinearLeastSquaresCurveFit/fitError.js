var math = require('mathjs');

module.exports = {
    fitError: function (matrix, x, target, count) {
        var res = math.multiply(matrix, x);
        var err = 0;
        for (var i = 0; i < count; i++) {
            err += Math.pow(math.subset(target, math.index(i, 0)) - math.subset(res, math.index(i, 0)), 2);
        }
        return Math.sqrt(err);
    }
}
