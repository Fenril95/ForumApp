var gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

var jsDir = ['Client/javascripts/app.js', 'Client/javascripts/directives/*.js', 'Client/javascripts/services/*.js', 'Client/javascripts/factories/*.js', 'Client/javascripts/controllers/*.js'];

//Compile al scss files and place one css file into server/public
gulp.task('sass', function () {
    return gulp.src('Client/stylesheets/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('Server/public/css/'));
});

//Concats all js files to server/public folder
gulp.task('concatJS', function () {
   return gulp.src(jsDir)
       .pipe(concat('main.js'))
       .pipe(gulp.dest('Server/public/js/'));
});

gulp.task('moveLibs', function () {
   return gulp.src('Client/libs/**/*')
       .pipe(gulp.dest('Server/public/libs'))
});

gulp.task('moveImg', function () {
   return gulp.src('Client/assets/**/*')
       .pipe(gulp.dest('Server/public/img'))
});

gulp.task('moveHtml', function () {
    return gulp.src('Client/templates/*.html')
        .pipe(gulp.dest('Server/public/html'));
});

gulp.task('moveIndex', function () {
   return gulp.src('Client/index.html')
       .pipe(gulp.dest('Server/public'));
});

gulp.task('build', ['sass', 'concatJS', 'moveLibs', 'moveImg', 'moveIndex', 'moveHtml']);

//For production purposes
gulp.task('uglify', function () {
    return gulp.src('Server/js/main.js')
        .pipe(uglify())
        .pipe(gulp.dest('Server/js'));
});

gulp.task('watch', function () {
    gulp.watch('Client/stylesheets/*.scss', ['sass']);
    gulp.watch(jsDir, ['concatJS']);
    gulp.watch('Client/index.html', ['moveIndex']);
    gulp.watch('Client/templates/*.html', ['moveHtml']);
});