[Moore-Penrose pseudoinverse](http://en.wikipedia.org/wiki/Moore-Penrose_pseudoinverse)

[Linear least squares](http://en.wikipedia.org/wiki/Linear_least_squares)

	var curvefit = require('./fitCurveUsingFunctions');
	var csv = require('./fromCSVFile');

	function test1() {
		var x = fitCurveExample([1, 2, 3, 4, 5, 6, 7, 8, 9], 
								[0, 1, 4, 10, 100, 118, 125, 129, 131]);
		console.log(x);
        
		x = fitCurveExample([1, 2, 3, 4, 5, 6, 7, 8, 9], 
							[0, 1, 4, 10, 100, 118, 125, 129, 131], true, 
							0, 1000);
		console.log(x);
        
		x = fitCurveExample([1, 2, 3, 4, 5, 6, 7, 8, 9], 
							[1, 2, 3, 4, 5, 6, 7, 8, 9]);
		console.log(x);
        
		x = fitCurveExample([1, 2, 3, 4, 5, 6, 7, 8, 9], 
							[1, 2, 3, 4, 5, 6, 7, 8, 9], true, 
							0, 1000);
		console.log(x);
	}

	function test2() {
	// xxx; xxx; xxx; xxx; ... xxx      <-
	// yyy; yyy; yyy; yyy; ... yyy      <-
	// ...								<-	component data	
	// zzz; zzz; zzz; zzz; ... zzz		<- 
	// ttt; ttt; ttt; ttt; ... ttt		<-	target vector

		csv.fromCSVFile('example_data.csv', 
			function (result) {
				console.log(result);
			}, 
			true,	// bounded values
			0, 1    // min / max scaling factor
		);
	}

	function fitCurveExample(x, y, bounded) {
		//y = A + B*x + C*x*x + D*exp(x) + E*ln(x)
    
			return curvefit.fitCurveUsingFunctions([
				function (x) { return 1; }, 
				function (x) { return x; }, 
				function (x) { return x * x; }, 
				function (x) { return Math.exp(x); },
				function (x) { return Math.log(x) }], 
				x, y, bounded, 
				[minValue, minValue, minValue, minValue, minValue], 
				[maxValue, maxValue, maxValue, maxValue, maxValue]);   
	}
