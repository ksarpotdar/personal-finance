'use strict';
var gulp = require('gulp'),
  flatten = require('gulp-flatten'),
  bower = require('bower'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  minifyCss = require('gulp-minify-css'),
  rename = require('gulp-rename'),
  jshint = require('gulp-jshint'),
  ngTemplateCache = require('gulp-angular-templatecache'),
  karma = require('karma').server,
  useref = require('gulp-useref'),
  debug = require('gulp-debug'),
  paths = {
    sass: ['./scss/**/*.scss'],
    js: ['./www/js/*.js'],
  };

gulp.task('tests', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false,
  }, function() {
    done();
  });
});

gulp.task('tpl', function() {
  return gulp.src(['www/**/*.html', '!index.html', '!www/lib/'])
    .pipe(ngTemplateCache({module: 'pf'}))
    .pipe(gulp.dest('www/js'));
});

gulp.task('copy-images', function() {
  return gulp.src(['www/img/*'])
    .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-fonts', function() {
  return gulp.src(['www/lib/ionic/fonts/*'])
    .pipe(gulp.dest('dist/lib/ionic/fonts/'));
});

//gulp.task('tpl-dev', function() {
//  return gulp.src(['www/**/*.html', '!index.html'])
//    //.pipe(flatten())
//    .pipe(gulp.dest('dist'))
//    .pipe(debug({name:'tpl-dev'}));
//});

gulp.task('combine-scripts-css', ['tpl'], function() {
  return gulp.src('www/index.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function() {
  return gulp.src(['./www/js/*.js', '!templates.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true,
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0,
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, ['jshint']);
});

gulp.task('default', ['sass', 'jshint', 'tpl', 'combine-scripts-css']);
gulp.task('dev', ['sass', 'jshint', 'tpl', 'combine-scripts-css']);
gulp.task('prod', ['sass', 'jshint', 'combine-scripts-css', 'copy-images', 'copy-fonts']);
