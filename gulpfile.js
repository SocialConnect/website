var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    minifyHTML = require('gulp-minify-html'),
    templateCache = require('gulp-angular-templatecache'),
    minifyCSS = require('gulp-minify-css'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    open = require('gulp-open');

var distPath = './public/dist/';

var jsPath = [
    './src/vendor/angular/angular.js',
    './src/vendor/angular-route/angular-route.js',
    './src/vendor/angular-resource/angular-resource.js',
    './public/dist/templates.js',
    './src/app.js'
];

gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(serveStatic('./public', {'index': ['index.html']}))
        .listen('9595');

    var options = {
        url: 'http://localhost:9595',
        app: 'firefox'
    };
    open('', options);

    console.log('Server listening on http://localhost:9595');
});

gulp.task('js', function() {
    gulp.src(jsPath)
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(distPath))
});

gulp.task('html-index-min', function() {
    var htmlSrc = './src/index.html',
        htmlDst = './public/';

    gulp.src(htmlSrc)
        .pipe(minifyHTML({empty: true}))
        .pipe(gulp.dest(htmlDst));
});

gulp.task('html-pages-min', function() {
    var htmlSrc = './src/pages/*.html',
        htmlDst = './public/pages/';

    gulp.src(htmlSrc)
        .pipe(minifyHTML({empty: true}))
        .pipe(gulp.dest(htmlDst))
        .pipe(templateCache({
            root: "./pages/",
            standalone: true,
            module: "templatescache"
        }))
        .pipe(gulp.dest(distPath));
});

var cssPath = [
    './src/vendor/bootswatch-dist/css/bootstrap.css',
    './src/css/template.css'
];

gulp.task('css', function () {
    gulp.src(cssPath)
        .pipe(minifyCSS({keepBreaks:true, keepSpecialComments:false}))
        .pipe(concat('app.css'))
        .pipe(gulp.dest(distPath))
});

gulp.task('watch', function() {
    gulp.watch(cssPath, ['css']);
    gulp.watch('./src/index.html', ['html-index-min']);
    gulp.watch('./src/pages/*.html', ['html-pages-min']);
    gulp.watch(jsPath, ['js']);
});


gulp.task('default', ['js', 'html-index-min', 'html-pages-min', 'css']);
gulp.task('dev', ['default', 'http-server', 'watch']);
