const gulp = require("gulp");
const { src, dest, watch, parallel, series } = require("gulp")
var globs ={
  html:"project/*.html",
  css:"project/css/**/*.css",
  js:"project/js/**/*.js",
  img:"project/pics/*",
  sass:"project/sass/**/*.scss"

}

///////////////////img
const imagemin = require('gulp-imagemin');
function imgMinify() {
    return gulp.src(globs.img)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'));
}
exports.img = imgMinify

///////////////////html
const htmlmin = require('gulp-htmlmin');
function minifyHTML() {
    return src('project/*.html')
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('dist'))
}
exports.html = minifyHTML


////////////////////java script 
const concat = require('gulp-concat');
const terser = require('gulp-terser');

function jsMinify() {
    return src(globs.js,{sourcemaps:true}).pipe(concat('all.min.js'))
        .pipe(terser())
        .pipe(dest('dist/assets/js',{sourcemaps:'.'}))
}
exports.js = jsMinify


////////////////////minify css
var cleanCss = require('gulp-clean-css');
function cssMinify() {
    return src(globs.css).pipe(concat('style.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css'))
}
exports.css = cssMinify
/////////////////////minify sass
const sass = require('gulp-sass')(require('sass'));
function sassMinify() {
    return src([globs.sass, globs.css ],{sourcemaps:true}).pipe(sass())
        .pipe(concat('style.sass.min.css'))
        .pipe(cleanCss())
        .pipe(dest('dist/assets/css',{sourcemaps:'.'}))
}



var browserSync = require('browser-sync');
function serve (cb){
  browserSync({
    server: {
      baseDir: 'dist/'
    }
  });
  cb()
}

function reloadTask(done) {
  browserSync.reload()
  done()
}

//watch task
function watchTask() {
    watch('project/*.html',series(minifyHTML, reloadTask))
    watch('project/js/**/*.js',series(jsMinify, reloadTask))
    watch(["project/css/**/*.css","project/sass/**/*.scss"], series(sassMinify,reloadTask));
}
exports.default = series( parallel(imgMinify, jsMinify, sassMinify, minifyHTML), serve,watchTask)




