const gulp = require('gulp'); 
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');


gulp.task('pug', function() {
	return gulp.src('./src/pug/pages/**/*.pug')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Pug',
						sound: false,
						message: err.message
				}
			})
		}))
		.pipe( pug({
			pretty: true
		}) )
		.pipe( gulp.dest('./build/') )
});


gulp.task('scss', function(callback) {
	return gulp.src('./src/scss/style.scss')
		.pipe( plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
		}))
		.pipe( sourcemaps.init() )
		.pipe( sass() )
		.pipe( autoprefixer({
			overrideBrowserslist: ['last 4 versions']
		}) )
		.pipe( sourcemaps.write() )
		.pipe( gulp.dest('./build/css/') )
	callback();
});

gulp.task('watch', function() {
	watch(['./build/*.html', './build/css/**/*.css'], gulp.parallel( browserSync.reload ));

	watch('./src/scss/**/*.scss', function(){
		setTimeout( gulp.parallel('scss'), 1000 )
	})

	watch('./src/pug/**/*.pug', gulp.parallel('pug'))

});

gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	})
});

gulp.task('default', gulp.parallel('server', 'watch', 'scss', 'pug'));
