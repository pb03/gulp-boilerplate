var gulp = require('gulp'),

  // Load gulp plugins
  autoprefixer = require('gulp-autoprefixer'),
  concat       = require('gulp-concat'),
  sass         = require('gulp-sass'),
  cleanCSS     = require('gulp-clean-css'),
  uglify       = require('gulp-uglify'),
  svgmin       = require('gulp-svgmin'),
  svgSprite    = require('gulp-svg-sprites'),
  browserSync  = require('browser-sync').create(),

  // Define paths
  paths = {
    html: [
      '*.html'
    ],
    scss: [
      // Include settings - order is important
      'assets/scss/settings/vars.scss',
      'assets/scss/settings/mixins.scss',
      'assets/scss/settings/sprite.scss',
      // Include all other styles
      'assets/scss/ui/*.scss',
      'assets/scss/ui/**/*.scss',
      'assets/scss/ui/**/**/*.scss'
    ],
    js: [
      'assets/js/*.js',
      'assets/js/**/*.js',
    ],
    icons: [
      'assets/icons/*.svg'
    ]
  };

/**
 * Concatinate and compress SCSS
 */
gulp.task('sass', ['sprite'], function() {
  return gulp.src(paths.scss)
    .pipe(concat('app.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css/'));
});

/**
 * Concatinate and uglify JS
 */
gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

/**
 * Create sprite of SVG icons
 */
gulp.task('sprite', function() {
  return gulp.src(paths.icons)
    // minify svg files
    .pipe(svgmin())
    // create sprite
    .pipe(svgSprite({
      cssFile: "../../assets/scss/settings/sprite.scss",
      padding: 0,
      preview: false,
      selector: "icon-%f",
      svg: {
        sprite: "sprite.svg"
      },
      svgPath: "../img/%f"
    }))
    .pipe(gulp.dest("dist/img/"));
});

/**
 * Auto-reload browser
 */
gulp.task('serve', function() {
    // Server path
    browserSync.init({ server: "./" });
    // Reload browser when a dist file is updated
    gulp.watch([paths.html, 'dist/css/app.css', 'dist/js/app.js']).on('change', browserSync.reload);
});

/**
 * Default task, watch changes
 */
gulp.task('default', ['sass', 'js', 'serve'], function() {
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.icons, ['sass']);
});