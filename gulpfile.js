const gulp = require("gulp");
const uglify = require("gulp-uglify");
const pipeline = require("readable-stream").pipeline;
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const htmlmin = require("gulp-htmlmin");
const autoprefixer = require("gulp-autoprefixer");
const cache = require("gulp-cache");
const del = require("del");

gulp.task("clean", function (cb) {
  return del("dist", cb);
});

gulp.task("compress", function () {
  return pipeline(gulp.src("src/lib/*.js"), uglify(), gulp.dest("dist/lib"));
});

gulp.task("minify-css", () => {
  return pipeline(
    gulp.src("src/styles/*.css"),
    autoprefixer({ cascade: false }),
    cleanCSS({ compatibility: "ie8" }),
    gulp.dest("dist/styles")
  );
});

gulp.task("minify-img", () => {
  return pipeline(
    gulp.src("src/assets/*"),
    cache(imagemin()),
    gulp.dest("dist/assets")
  );
});

// 监听js和css的改动
gulp.task("auto", function () {
  gulp.watch("src/lib/*.js", gulp.series("compress"));
  gulp.watch("src/styles/*.css", gulp.series("minify-css"));
});

gulp.task("minify", () => {
  return pipeline(
    gulp.src("src/**/*.html", "static/**/*.html"),
    htmlmin({ collapseWhitespace: true }),
    gulp.dest("dist")
  );
});

gulp.task("directoryPub", () => {
  return pipeline(gulp.src("src/fonts/*"), gulp.dest("dist/fonts"));
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel(
      "compress",
      "minify-css",
      "minify-img",
      "minify",
      "directoryPub"
    )
  )
);
