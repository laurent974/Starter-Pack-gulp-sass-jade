// Declaration Pour Faire du javascript STRICT
'use strict';

// Stock les librairies dans des objets
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var phpJade = require('gulp-jade-for-php');
var del = require('del');

// Browser Synchronisation
gulp.task('watch', ['sass'], function() {
  browserSync.init({
    proxy: "127.0.0.1/plows"
  });

  gulp.watch('app/templates/**/*.jade', ['jade-php']);
  gulp.watch("app/scss/**/*.scss", ['sass']);
  gulp.watch('app/js/**/*.js', ['js']);
  gulp.watch("*.html").on('change', browserSync.reload);
});

//Supprime les fichiers générés
gulp.task('clean', function() {
  return del(['app/css', '*.html']);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("app/scss/**/*.scss")
  .pipe(sass())
  .pipe(gulp.dest("./app/css"))
  .pipe(browserSync.stream());
});

// process JS files and return the stream.
gulp.task('js', function () {
  return gulp.src('app/js/*js')
  .pipe(browserify())
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});

// Jade Php Templating
gulp.task('jade-php', function() {
  gulp.src([
    './app/templates/**/*.jade',
    '!./app/templates/**/_*.jade'
  ])
  .on('error', console.log)
  .pipe(phpJade())
  .pipe(gulp.dest('./'))
  .pipe(browserSync.stream());
});

// La tache par default pour lancer le workflow
gulp.task('default', ['clean','watch'], function() {
  gulp.start('sass', 'jade-php');
});
