'use strict';  	
			
const { src, dest, series } = require('gulp');					
													
const concat = require('gulp-concat');					
const uglify = require('gulp-uglify');										 					
const babel = require('gulp-babel');								
										
	
function jsTask(){					
	return src([	
		'polyfill/polyfill.js',				
		'src/data-table-light.js'
		])
		.pipe(concat('data-table-light.min.js'))				
		.pipe(babel({
			"presets": ["@babel/preset-env"]
		}))					
		.pipe(uglify())					
		.pipe(dest('dist')					
	);					
}										

function jsTaskDemo(){					
	return src([	
		'js/promise-polyfill.js',				
		'js/demo.js'
		])
		.pipe(concat('demo.min.js'))				
		.pipe(babel({
			"presets": ["@babel/preset-env"]
		}))					
		.pipe(uglify())					
		.pipe(dest('js')					
	);					
}

exports.buildJs = series(					
	jsTask,jsTaskDemo					
);				
