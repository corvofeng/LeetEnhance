var gulp = require('gulp');
var webpack = require('webpack')
var gulpWebpack = require('gulp-webpack')
var livereload = require('gulp-livereload');

var entryPointsPathPrefix = './app/scripts/page/';

gulp.task('bundle', function () {
  gulp.src('app/scripts/page')
    .pipe(gulpWebpack({
        watch: true,
        entry : {   // 多出口打包, 针对不同的网站分别打包
          // nowcoder: entryPointsPathPrefix + 'nowcoder.js'
          leetcode: entryPointsPathPrefix + 'leetcode.js',
        },
        output: {
          filename: '[name].js',
        //  chunkFilename: "[id].js",
        //  path: path.resolve(__dirname, 'dist')
        },
        module: {
            loaders: [
                 {test: /\.css$/, loader: 'style-loader!css-loader'},
            ]
        },
      }, webpack
      )
    )
    .pipe(gulp.dest('./app/dest/'));
});

gulp.task('html', function () {
  livereload.reload();
});

// 只监听app/dest/main.js文件的变化
gulp.task('watch', function () {
  livereload.listen()
  gulp.watch([
    './app/dest/*'
  ], ['html']);
})

gulp.task('default', ['watch', 'bundle']);