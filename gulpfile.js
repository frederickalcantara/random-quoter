const gulp = require("gulp");
const uglify = require("gulp-uglify");
const liveReload = require("gulp-livereload");
const concat = require("gulp-concat");
// concat works for css and js files
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const del = require("del");
const nodemon = require('gulp-nodemon');

// File paths
// ** grabs javascript files from folders in the scripts folder
const distPath = "web-app/";
const scriptsPath = "app.js";
const cssPath = "styles.css";
const htmlPath = "index.html";

// When you are creating a gulp task, you are creating a unit of functionality

// HTML
gulp.task('html', () => {
	console.log('Starting html task');
	return gulp.src(htmlPath).pipe(liveReload());
})

// Styles
gulp.task("styles", () => {
  console.log("Starting styles task");
  return (gulp
      .src(cssPath)
      // You can customize the way you order css files using an array
      // Order is important when doing a general task
      .pipe(
        plumber((err) => {
          console.log("Styles Task Error");
          console.log(err);
          this.emit("end");
        })
      )
      // plumber keeps gulp watch running when debugging
      .pipe(sourcemaps.init())
      // Source maps has two steps to hone in on error by the specific file
      // 1/2 begin the process of sourcing. init for css
      .pipe(autoprefixer())
      // autoprefixer automatically adds support for all browsers
      .pipe(concat("styles.css"))
      .pipe(cleanCSS())
      .pipe(sourcemaps.write())
      // 2/2 write it to folder. write for css
	  .pipe(gulp.dest(distPath)))
	  .pipe(liveReload());
});

// Scripts
gulp.task("scripts", () => {
  console.log("Starting scripts task");

  return gulp
    .src(scriptsPath)
    .pipe(
      plumber((err) => {
        console.log("Scripts Task Error");
        console.log(err);
        this.emit("end");
      })
    )
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["es2015"]
      })
    )
    .pipe(uglify())
    .pipe(concat("app.js"))
    .pipe(sourcemaps.write())
	.pipe(gulp.dest(distPath))
	.pipe(liveReload());
});


gulp.task("clean", () => {
  return del.sync([distPath]);
});

// gulp default bootstraps other tasks, in which you want to run one task by itself first
gulp.task(
  "default",
  ["clean", "styles", "scripts", "html"],
  () => {
    // Second argument in default gulp tasks run all the tasks before the default task
    console.log("Starting default task");
  }
);

gulp.task("watch", ["default"], () => {
  // runs default first so that we can see the latest version
  console.log("Starting watch task");
  require('./server.js');
  liveReload.listen();
  gulp.watch(scriptsPath, ["scripts"]);
  gulp.watch(cssPath, ["styles"]);
  gulp.watch(htmlPath, ["html"]);
});

// Gulp live reload is a third party plugin that requires installation
// npm install gulp-livereload@latest --save-dev
// ^^ this is the command to install gulp live reload

// Order is not important in task watching
