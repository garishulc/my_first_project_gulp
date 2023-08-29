//константы
const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
//sassGlob позволяет подключать множество файлов
//одной записью: @import "./blocks/*.scss";
const sassGlob = require('gulp-sass-glob');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
//task plumber - обработка ошибок
const plumber = require('gulp-plumber');
//task notify - нотификация
const notify = require('gulp-notify');
//подключени webpack
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
//changed ускоряет работу,отключает повторное
//оптимизирорование или сборку
const changed = require('gulp-changed');



//переменные
const fileIncludeSetting = {
  prefix: '@@',
  basepath: '@file',
};

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      massege: 'Error <%= error.massege %>',
      sound: false
    })
  }
}
//таски**********

//чистильчик, удаляет фалы из папки с результатами которых 
//нет в исходной папке
gulp.task('clean:dev', function (done) {
  if (fs.existsSync('./build/')) {
    return gulp.src('./build/', { read: false })
      .pipe(clean({ force: true }));
  }
  done();
})
//обьеденяет html фалы в один
gulp.task('html:dev', function () {
  return gulp
    .src(['./src/html/**/*.html',
      '!./src/html/blocks/*.html'])
    .pipe(changed('./build/', { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(gulp.dest('./build/'));
})
//переводит из формата scss to css, обьеденяет scss файлы в один
//так же добавлен таск sourcmap, который указывает нам в каких 
//файла scss нахордятся настройки которые мы ищем в диспейтчере кода

gulp.task('sass:dev', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(changed('.dist/css/'))
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./build/css/'))
})
//копирует картинки из исходной папки в конечную
gulp.task('images:dev', function () {
  return gulp.src('./src/img/**/*')
    .pipe(changed('.dist/img/'))
    //подключение imagemin с настройкой verbose
    //она указывает на сколько была сжата картинка
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./build/img/'))
})
//копирует файлы шрифтов из исходной папки в папку
//с результатом
gulp.task('fonts:dev', function () {
  return gulp.src('./src/fonts/**/*')
    .pipe(changed('.dist/fonts/'))
    .pipe(gulp.dest('./build/fonts/'))
})
//копирует другие файлы из исходлной папки
gulp.task('files:dev', function () {
  return gulp.src('./src/files/**/*')
    .pipe(changed('.dist/files/'))
    .pipe(gulp.dest('./build/files/'))
})
//собирает js модули и webpack
gulp.task('js:dev', function () {
  return gulp.src('./src/js/*.js')
    .pipe(changed('.build/js/'))
    .pipe(plumber(plumberNotify('JS')))
    //включаем babel только в момент тестирования
    //на очень старых браузерах
    //.pipe(babel())
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./build/js/'))
})

//запускает лайв сервер с автообновлением страницы
gulp.task('server:dev', function () {
  return gulp.src('./build/')
    .pipe(server({
      livereload: true,
      open: true
    }))
})
//такс наблюдателя за изменениями
gulp.task('watch:dev', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
  gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
  gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
  gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
})


