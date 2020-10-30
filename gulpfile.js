const gulp = require('gulp'); // Подключаем Gulp
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');


//Таск для сборки GULP файлов
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


// Таск для компиляции SCSS в CSS
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

// Слежение за HTML и CSS и обновление браузера
gulp.task('watch', function() {
	// Слежение за HTML и CSS и обновление браузера
	watch(['./build/*.html', './build/css/**/*.css'], gulp.parallel( browserSync.reload ));

	// Запуск слежения и компиляции SCSS с задержкой
	watch('./src/scss/**/*.scss', function(){
		setTimeout( gulp.parallel('scss'), 1000 )
	})

	// Слежение за PUG и сборка 
	watch('./src/pug/**/*.pug', gulp.parallel('pug'))

});

// Задача для старта сервера из папки app
gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./build/"
		}
	})
});

// Дефолтный таск (задача по умолчанию)
// Запускаем одновременно задачи server и watch
gulp.task('default', gulp.parallel('server', 'watch', 'scss', 'pug'));
