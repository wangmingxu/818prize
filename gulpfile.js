var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rename=require('gulp-rename'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create();

//清空文件夹，避免资源冗余
gulp.task('clean',function(){
    return gulp.src('dist',{read:false}).pipe(clean());
});

//css文件压缩
gulp.task('css',['sass'],function(){
    return gulp.src('css/*.css')
    .pipe(minifyCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('dist/css/'));
});

//js文件压缩
gulp.task('js',function(){
    return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('rename', function () {
    return;
});

gulp.task('sass', function() {
  gulp.src('sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css/'));
});

gulp.task('watch',function(){
  gulp.watch('sass/*.scss',function(){
      gulp.run('css');
  });
  gulp.watch('css/*.css',function(){
      gulp.run('css');
  });
  gulp.watch('js/*.js',function(){
      gulp.run('js');
  });
});


// Static server
gulp.task('browser-sync', function() {
    var files = [
    '*.html',
    'dist/css/*.css',
    'dist/js/*.js'
    ];
    browserSync.init(files,{
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default',['watch'],function(){
  gulp.run('browser-sync');
});
