var gulp = require('gulp'),

  // Load gulp plugins
  autoprefixer = require('gulp-autoprefixer'),
  concat       = require('gulp-concat'),
  sass         = require('gulp-sass'),
  cleanCSS     = require('gulp-clean-css'),
  uglify       = require('gulp-uglify-es').default,
  browserSync  = require('browser-sync').create(),

  // Paths for source files
  paths = {
    html: [
      '*.html'
    ],
    scss: [
      // Include settings - order is important
      'assets/scss/settings/vars.scss',
      'assets/scss/settings/reset.scss',

      // Include all other styles
      'assets/scss/ui/*.scss',
      'assets/scss/ui/**/*.scss',
      'assets/scss/ui/**/**/*.scss'
    ],
    js: [
      'assets/js/*.js',
      'assets/js/**/*.js',
    ]
  };

/**
 * Concatinate and compress SCSS
 */
gulp.task('sass', function() {
  return gulp.src(paths.scss)
    .pipe(concat('main.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/'));
});

/**
 * Concatinate and uglify JS
 */
gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

/**
 * Auto-reload browser
 */
gulp.task('serve', function() {
    // Server path
    browserSync.init({ server: "./" });
    // Reload browser when a dist file is updated
    gulp.watch([paths.html, 'dist/main.css', 'dist/main.js']).on('change', browserSync.reload);
});

/**
 * Default task, watch changes
 */
gulp.task('default', ['sass', 'js', 'serve'], function() {
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.js, ['js']);
});