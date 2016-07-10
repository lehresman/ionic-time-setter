var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngTemplates = require('gulp-ng-templates');
var htmlmin = require('gulp-htmlmin');


var src = [
  './src/time-setter.js',
  './dist/templates.js'
];

var output = {
  min: 'ionic-time-setter.min.js',
  unmin: 'ionic-time-setter.js',
  dist: './dist/'
};

gulp.task('buildmin', ['templates'], function() {
  gulp.src(src)
    .pipe(concat( output.min ))
    .pipe(uglify({preserveComments: 'license'}))
    .pipe(gulp.dest( output.dist ));
});


gulp.task('build', ['templates'], function() {
  gulp.src(src)
    .pipe(concat( output.unmin ))
    .pipe(gulp.dest( output.dist ));
});

gulp.task('templates', function () {
  return gulp.src('./src/time-setter.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(ngTemplates({
      standalone: false,
      filename: 'templates.js',
      module: 'ionic-time-setter'
    }))
    .pipe(gulp.dest( output.dist ));
});

gulp.task('watch', function() {
  gulp.watch('./src/*', ['build', 'buildmin']);
});

gulp.task('default', ['build','buildmin']);
