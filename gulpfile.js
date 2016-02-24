var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var jsFiles =
    ['app/js/config.js',
        'app/js/directive.js',
        'app/js/factory.js',
        'app/js/filter.js',
        'app/js/mainCtrl.js',
        'app/js/controllers/**/**/*Ctrl.js'
    ];
var jsBil = ['app/framework/angular.min.js',
    'app/framework/angular-resource.min.js',
    'app/framework/angular-messages.min.js',
    'app/framework/angular-ui-router.min.js',
    'app/framework/ui-bootstrap-tpls-0.14.3.min.js'];
var buildJsPath = 'app/js/jsBuild';

gulp.task('cleanJs', function(cb) {
    return del(['app/js/jsBuild/app.js'], cb);
});

gulp.task('cleanLib', function(cb) {
    return del(['app/js/jsBuild/lib.js'], cb);
});

gulp.task('build',['cleanJs'],function () {
    return gulp.src(jsFiles)
        .pipe(uglify({mangle: false}))// 执行 JavaScript 压缩
        .pipe(concat('app.js')) // 合并 JavaScript ，并设置合并后的文件名
        .pipe(gulp.dest(buildJsPath));
});

gulp.task('lib',['cleanLib'], function () {
    return gulp.src(jsBil)
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(buildJsPath));
});

gulp.task('dev', function() {
    gulp.watch(jsFiles, ['build']);
});