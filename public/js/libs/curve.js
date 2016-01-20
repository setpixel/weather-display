/*!	Curve extension for canvas 2.2
 *	Epistemex (c) 2013-2014
 *	License: MIT
*/

/**
 * Draws a cardinal spline through given point array. Points must be arranged
 * as: [x1, y1, x2, y2, ..., xn, yn]. It adds the points to the current path.
 *
 * The method continues previous path of the context. If you don't want that
 * then you need to use moveTo() with the first point from the input array.
 *
 * The points for the cardinal spline are returned as a new array.
 *
 * @param {Array} points - point array
 * @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
 * @param {Number} [numOfSeg=20] - number of segments between two points (line resolution)
 * @param {Boolean} [close=false] - Close the ends making the line continuous
 * @returns {Array} New array with the calculated points that was added to the path
 */
CanvasRenderingContext2D.prototype.curve = function(points, tension, numOfSeg, close) {

	'use strict';

	// options or defaults
	tension = (typeof tension === 'number') ? tension : 0.5;
	numOfSeg = numOfSeg ? numOfSeg : 20;

	var pts,					// clone point array
		res = [],
		l = points.length, i,
		cache = new Float32Array((numOfSeg+2)*4),
		cachePtr = 4;

	pts = points.slice(0);

	if (close) {
		pts.unshift(points[l - 1]); // insert end point as first point
		pts.unshift(points[l - 2]);
		pts.push(points[0], points[1]); // first point as last point
	}
	else {
		pts.unshift(points[1]);	// copy 1. point and insert at beginning
		pts.unshift(points[0]);
		pts.push(points[l - 2], points[l - 1]);	// duplicate end-points
	}

	// cache inner-loop calculations as they are based on t alone
	cache[0] = 1;

	for (i = 1; i < numOfSeg; i++) {

		var st = i / numOfSeg,
			st2 = st * st,
			st3 = st2 * st,
			st23 = st3 * 2,
			st32 = st2 * 3;

		cache[cachePtr++] =	st23 - st32 + 1;	// c1
		cache[cachePtr++] =	st32 - st23;		// c2
		cache[cachePtr++] =	st3 - 2 * st2 + st;	// c3
		cache[cachePtr++] =	st3 - st2;			// c4
	}

	cache[++cachePtr] = 1;

	// calc. points
	parse(pts, cache, l);

	if (close) {
		//l = points.length;
		pts = [];
		pts.push(points[l - 4], points[l - 3], points[l - 2], points[l - 1]); // second last and last
		pts.push(points[0], points[1], points[2], points[3]); // first and second
		parse(pts, cache, 4);
	}

	function parse(pts, cache, l) {

		for (var i = 2; i < l; i += 2) {

			var pt1 = pts[i],
				pt2 = pts[i+1],
				pt3 = pts[i+2],
				pt4 = pts[i+3],

				t1x = (pt3 - pts[i-2]) * tension,
				t1y = (pt4 - pts[i-1]) * tension,
				t2x = (pts[i+4] - pt1) * tension,
				t2y = (pts[i+5] - pt2) * tension;

			for (var t = 0; t <= numOfSeg; t++) {

				var c = t * 4;

				res.push(cache[c] * pt1 + cache[c+1] * pt3 + cache[c+2] * t1x + cache[c+3] * t2x,
						 cache[c] * pt2 + cache[c+1] * pt4 + cache[c+2] * t1y + cache[c+3] * t2y);
			}
		}
	}

	// add lines to path
	for(i = 0, l = res.length; i < l; i += 2)
		this.lineTo(res[i], res[i+1]);

	return res;
};
