var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    lost = require('lost'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    nib = require('nib'),
    rupture = require('rupture'),
    livereload = require('gulp-livereload');

gulp.task('stylus', function() {
  return gulp.src('src/index.styl')
    .pipe(stylus({
      linenos: true,
      use: [
        nib(),
        rupture()
      ],
    }))
    .pipe(sourcemaps.init())
    .pipe(postcss([
      lost(),
      autoprefixer()
    ]))
    .pipe(sourcemaps.write())
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('css/'));
});

gulp.task('build', ['stylus']);

gulp.task('watch', ['build'], function () {
  gulp.watch('src/**/*.styl', ['stylus']);
});

gulp.task('default', ['watch'], function (){
});
