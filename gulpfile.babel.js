import gulp from 'gulp';
import yargs from 'yargs';
import ejs from 'gulp-ejs';

gulp.task('default', () => {
  var name = yargs.argv.n || yargs.argv.name;

  if (!name) {
    throw new Error("invalid action name [" + name + "]");
  }

  let task = require(`./tasks/${name}.js`);
  task = task.default || task;

  return task.run()
    .then((data) => {
      return gulp.src(`./templates/${name}.ejs`)
            .pipe(ejs({data}, {
              ext: task.outputExt || '.json'
            }))
            .pipe(gulp.dest('dist'));
    });
});
