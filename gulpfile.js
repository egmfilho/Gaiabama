'use strict';

const gulp 	       = require('gulp');
const gutil 	   = require('gulp-util');
const connect      = require('gulp-connect');
const rename       = require('gulp-rename');
const pug 	       = require('gulp-pug');
const sass         = require('gulp-sass');
const uglify       = require('gulp-uglify');
const sourcemaps   = require('gulp-sourcemaps');
const concat       = require('gulp-concat');
const bower        = require('gulp-bower');
const bowerFiles   = require('main-bower-files');
const cssnano      = require('gulp-cssnano');
const rev          = require('gulp-rev');
const collector    = require('gulp-rev-collector');
const through      = require('through2');
const gulpSequence = require('gulp-sequence');
const fs           = require('fs');
const path         = require('path');

var source = 'app'; // removed ./ due the undetection of new/deleted files
var dest   = 'www';

function error_handler(error) {
	// Output an error message
	gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
	// emit the end event, to properly end the task
	this.emit('end');
}

gulp.task('connect', function() {
	connect.server({
		root: dest,
		port: 9000,
		livereload: 'true'
	});
});

gulp.task('index', function() {
	return gulp.src(path.join(source, 'index.pug'))
		.pipe(pug({ }).on('error', error_handler))
		.pipe(rename('index.php'))
		.pipe(gulp.dest(dest))
		.pipe(connect.reload());
});

gulp.task('compile-views', function() {
	return gulp.src(path.join(source, 'views/*.pug'))
		.pipe(pug({ }).on('error', error_handler))
		.pipe(gulp.dest(path.join(dest, 'views')))
		.pipe(connect.reload());
});

gulp.task('compile-partials', function() {
	return gulp.src(path.join(source, 'partials/**/*.pug'))
		.pipe(pug({ }).on('error', error_handler))
		.pipe(gulp.dest(path.join(dest, 'partials')))
		.pipe(connect.reload());
});

gulp.task('compile-sass', function() {
	return gulp.src(path.join(source, 'styles/*.scss'))
		.pipe(sass().on('error', error_handler))
		.pipe(gulp.dest(path.join(dest, 'styles')))
		.pipe(connect.reload());
});

gulp.task('bower-restore', function() {
	return bower();
});

gulp.task('vendor-bundle', ['bower-restore'], function() {
	return gulp.src(bowerFiles({ filter: '**/*.js' }))
		.pipe(sourcemaps.init())
		.pipe(concat('vendors.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('maps/'))
		.pipe(gulp.dest(path.join(dest, 'scripts')))
		.pipe(connect.reload());
});

gulp.task('app-bundle', function(cb) {
	return gulp.src([
			path.join(source, 'scripts/app.js'),
			path.join(source, 'scripts/**/*.js')
		])
		.pipe(sourcemaps.init())
		.pipe(concat('app.min.js'))
		.pipe(uglify().on('error', error_handler))
		.pipe(sourcemaps.write('maps/'))
		.pipe(gulp.dest(path.join(dest, 'scripts')))
		.pipe(connect.reload());
});

gulp.task("css", ["bower-restore"], function() {
	return gulp.src(bowerFiles({ filter: '**/*.css' }))
		.pipe(sourcemaps.init())
		.pipe(concat('vendor.min.css'))
		.pipe(cssnano())
		.pipe(sourcemaps.write('maps/'))
		.pipe(gulp.dest(path.join(dest, 'styles')))
		.pipe(connect.reload());
});

gulp.task('copy-images', function() {
	return gulp.src(path.join(source, 'images/**/*.{png,gif,jpg,jpeg}'))
		.pipe(gulp.dest(path.join(dest, 'images')))
		.pipe(connect.reload());
});

gulp.task('copy-fonts', function() {	
	return gulp.src([
			'./bower_components/bootstrap-sass/assets/fonts/**/*.*',
			'./bower_components/font-awesome/fonts/**/*.*',
			path.join(source, 'fonts/**/*.*')
		])
		.pipe(gulp.dest(path.join(dest, 'fonts')))
		.pipe(connect.reload());
});

gulp.task('copy-videos', function() {	
	return gulp.src(path.join(source, 'videos/**/*.{mp4,ogg,webm}'))
		.pipe(gulp.dest(path.join(dest, 'videos')))
		.pipe(connect.reload());
});

gulp.task('rev:rename', function() {
	gulp.src([path.join(dest, 'partials/**/*.html'),
			  path.join(dest, 'views/**/*.html'),
			  path.join(dest, 'styles/**/*.css'),
			  path.join(dest, 'scripts/**/*.js'),
			  path.join(dest, 'images/**/*.{jpg,png,jpeg,gif,svg}')], { base: dest })
		.pipe(rev())
		.pipe(gulp.dest(dest))
		.pipe(rev.manifest())
		.pipe(gulp.dest(dest))
		.pipe(through.obj(function(file, enc, callback) {
			const manifest = JSON.parse(file.contents.toString());

			for (var key in manifest) {
				var filePath = path.join(__dirname, dest, key);
				gutil.log(gutil.colors.red('DELETING'), filePath);
				fs.unlinkSync(filePath, function(err) {
					// TODO: emit an error if err
				});
			}
			
			this.push(file);
			callback();
		}));
});

gulp.task('rev:updateRefs', function() {
	gulp.src([path.join(dest, '**/*.json'), path.join(dest, '**/*.{php,html,json,css,js}')])
		.pipe(collector({
			replaceReved: true
		}))
		.pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
	gulp.watch([path.join(source, '*.pug')], ['index']);
	gulp.watch([path.join(source, 'views/*.pug')], ['compile-views']);
	gulp.watch([path.join(source, 'partials/**/*.pug')], ['compile-partials']);
	gulp.watch([path.join(source, 'templates/*.pug')], ['index', 'compile-views']);
	gulp.watch([path.join(source, 'styles/*.scss')], ['compile-sass']);
	gulp.watch([path.join(source, 'scripts/**/*.js')], ['app-bundle']);
	gulp.watch(bowerFiles({ filter: '**/*.css' }), ['css']);
	gulp.watch(bowerFiles({ filter: '**/*.js' }), ['vendor-bundle']);
	gulp.watch(bowerFiles(), ['copy-fonts']);
	gulp.watch([path.join(source, 'images/**/*.*')], ['copy-images']);
	gulp.watch([path.join(source, 'fonts/**/*.*')], ['copy-fonts']);
	gulp.watch([path.join(source, 'videos/**/*.*')], ['copy-videos']);
});

gulp.task('default', ['connect', 'watch']);

gulp.task('build', ['index', 'compile-views', 'compile-partials', 'compile-sass', 'app-bundle', 'copy-images', 'vendor-bundle', 'css', 'copy-fonts', 'copy-videos']);