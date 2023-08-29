const gulp = require('gulp');

//tasks

require('./gulp/dev.js');
require('./gulp/docs.js');

//Task для билда(версии в разработке)

gulp.task('default',
  gulp.series('clean:dev',
    gulp.parallel('html:dev', 'sass:dev',
      'images:dev', 'fonts:dev', 'files:dev',
      'js:dev'),
    gulp.parallel('server:dev', 'watch:dev')
  ))

//Task для продакшн(итоговая версия)

gulp.task('docs',
  gulp.series('clean:docs',
    gulp.parallel('html:docs', 'sass:docs',
      'images:docs', 'fonts:docs', 'files:docs',
      'js:docs'),
    gulp.parallel('server:docs')
  ))

