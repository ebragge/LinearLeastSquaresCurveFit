### LinearLeastSquaresCurveFit
Calculate bounded or unbounded linear least squares curve fit using Moore-Penrose pseudoinverse.

[Moore-Penrose pseudoinverse](https://en.wikipedia.org/wiki/Moore%E2%80%93Penrose_pseudoinverse)

[Linear least squares](https://en.wikipedia.org/wiki/Linear_least_squares_(mathematics))

### Usage

	var fit = require('linearleastsquarescurvefit');

####createFittingCurveUsingDataFromArrays:

	// createFittingCurveUsingDataFromArrays(vectors, target, bounded, minValues, maxValues)
	//	by default bounded = false

	console.log(fit.createFittingCurveUsingDataFromArrays(
		[
			[1, 1, 1, 1, 1, 1, 1],
			[0, 1, 2, 3, 4, 5, 6],
			[0, 1, 4, 9, 16, 25, 36],
			[0, 1, 8, 27, 64, 125, 216]
		],
		[0, 1, 10, 100, 10, 1, 0]
	));

*Output:* [-9.952380952380958,32.85714285714285,-5.476190476190406,-1.6653345369377348e-16]

####createFittingCurveUsingFunctions

	// createFittingCurveUsingFunctions(functions, x, y, bounded, minValues, maxValues)
	//	by default bounded = false

	console.log(fit.createFittingCurveUsingFunctions(
	
		[
      		function (x) { return 1; }, 
	    	function (x) { return x; }, 
			function (x) { return x * x; }, 
			function (x) { return x * x * x; }
		],
		
		[0, 1, 2, 3, 4, 5, 6], 
		
		[0, 1, 10, 100, 10, 1, 0]
		
	)); 

*Output:* [-9.952380952380958,32.85714285714285,-5.476190476190406,-1.6653345369377348e-16]


	console.log(fit.createFittingCurveUsingFunctions(
	[
		function (x) { return 1; }, 
		
		function (x) { return x; }, 
		
		function (x) { return x * x; }, 
		
		function (x) { return Math.log(x) }
	],
	
		[1, 2, 3, 4, 5, 6, 7, 8, 9], 
		
		[0, 1, 4, 10, 100, 118, 125, 129, 131]
	)); 

*Output:* [-142.23863430119385,155.2255477329857,-7.834175796848122,-222.95737398530258]

####createFittingCurveUsingDataFromCSVFile

	// example_data.csv
	// 0.00386592;0.006645011;0.011108997;0.018063013;0.028565501;0.043936934;0.065728529; ...
	// 3.73E-06;8.46E-06;1.87E-05;4.01E-05;8.36E-05;0.000169857;0.000335463;0.00064438; ...
	// 2.23E-10;6.69E-10;1.95E-09;5.53E-09;1.52E-08;4.08E-08;1.06E-07;2.70E-07;6.66E-07; ...
	// 8.32E-16;3.29E-15;1.27E-14;4.74E-14;1.72E-13;6.10E-13;2.10E-12;7.03E-12;2.29E-11; ...
	// 0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2; ...	

	// xxx; xxx; xxx; xxx; ... xxx      <-
	// yyy; yyy; yyy; yyy; ... yyy      <-
	// ...								<-	component data	
	// zzz; zzz; zzz; zzz; ... zzz		<- 
	// ttt; ttt; ttt; ttt; ... ttt		<-	target vector	

	// createFittingCurveUsingDataFromCSVFile(
	//		dataPath, 
	//		callback, 
	//		bounded, 
	//		minValue, 
	//		maxValue, 
	//		delimiterChar)
	//	by default bounded = false,  delimiterChar = ';' 

	fit.createFittingCurveUsingDataFromCSVFile("example_data.csv", 
    		function (result) { 
				console.log(result); 
		}, true, 0, 1, ';'
	);

*Output:* [0,1,1,0]
