//константы
const gulp = require('gulp');
//HTML
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const webpHTML = require('gulp-webp-html');
//sass
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
//sassGlob позволяет подключать множество файлов
//одной записью: @import "./blocks/*.scss";
const sassGlob = require('gulp-sass-glob');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');
//server
const server = require('gulp-server-livereload');

const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
//task groupMedia ломает sourceMap, модификации и оптимизации
//для других браузеров 
const groupMedia = require('gulp-group-css-media-queries');
//task plumber - обработка ошибок
const plumber = require('gulp-plumber');
//task notify - нотификация
const notify = require('gulp-notify');
//подключени webpack
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
//img
const webp = require('gulp-webp');
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
gulp.task('clean:docs', function (done) {
  if (fs.existsSync('./docs/')) {
    return gulp.src('./docs/', { read: false })
      .pipe(clean({ force: true }));
  }
  done();
})
//обьеденяет html фалы в один
gulp.task('html:docs', function () {
  return gulp
    .src(['./src/html/**/*.html',
      '!./src/html/blocks/*.html'])
    .pipe(changed('./docs/'))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(webpHTML())
    .pipe(htmlclean())
    .pipe(gulp.dest('./docs/'));
})
//переводит из формата scss to css, обьеденяет scss файлы в один
//так же добавлен таск sourcmap, который указывает нам в каких 
//файла scss нахордятся настройки которые мы ищем в диспейтчере кода

gulp.task('sass:docs', function () {
  return gulp.src('./src/scss/*.scss')
    .pipe(changed('.dist/css/'))
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    //модиффикатор и оптимизатор groupMedia запускается 
    //после sourceMaps, тогда они ломаться не будут. Если надо
    //максимально миниифицировать код тогда убераем sourсemap
    .pipe(webpCss())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./docs/css/'))
})
//копирует картинки из исходной папки в конечную
gulp.task('images:docs', function () {
  return gulp.src('./src/img/**/*')
    .pipe(changed('.dist/img/'))
    .pipe(webp())
    .pipe(gulp.dest('./docs/img/'))
    .pipe(gulp.src('./src/img/**/*'))
    .pipe(changed('./docs/img/'))
    //подключение imagemin с настройкой verbose
    //она указывает на сколько была сжата картинка
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./docs/img/'));
})
//копирует файлы шрифтов из исходной папки в папку
//с результатом
gulp.task('fonts:docs', function () {
  return gulp.src('./src/fonts/**/*')
    .pipe(changed('.dist/fonts/'))
    .pipe(gulp.dest('./docs/fonts/'))
})
//копирует другие файлы из исходлной папки
gulp.task('files:docs', function () {
  return gulp.src('./src/files/**/*')
    .pipe(changed('.dist/files/'))
    .pipe(gulp.dest('./docs/files/'))
})
//собирает js модули и webpack
gulp.task('js:docs', function () {
  return gulp.src('./src/js/*.js')
    .pipe(changed('.dist/js/'))
    .pipe(plumber(plumberNotify('JS')))
    //babel для тестирования на старых браузерах
    .pipe(babel())
    .pipe(webpack(require('./../webpack.config.js')))
    .pipe(gulp.dest('./docs/js/'))
})

//запускает лайв сервер с автообновлением страницы
gulp.task('server:docs', function () {
  return gulp.src('./docs/')
    .pipe(server({
      livereload: true,
      open: true
    }))
})
//такс наблюдателя за изменениями
// gulp.task('watch:docs', function () {
//   gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:docs'));
//   gulp.watch('./src/**/*.html', gulp.parallel('html:docs'));
//   gulp.watch('./src/img/**/*', gulp.parallel('images:docs'));
//   gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:docs'));
//   gulp.watch('./src/files/**/*', gulp.parallel('files:docs'));
//   gulp.watch('./src/js/**/*', gulp.parallel('js:docs'));
// })



