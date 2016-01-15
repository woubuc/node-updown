var gulp = require('gulp');
var coffee = require('gulp-coffee');
var plumber = require('gulp-plumber');

gulp.task('compile', function() {
	gulp.src('src/*.coffee')
		.pipe(plumber())
		.pipe(coffee({bare: true}))
		.pipe(gulp.dest('lib'));
})

gulp.task('default', ['compile'], function() {
	gulp.watch(['src/*.coffee'], ['compile']);
})