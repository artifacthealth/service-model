var gulp = require('gulp');
var ts = require('gulp-typescript');
var del = require('del')
var Baseline = require("baseline");
var merge = require("merge2");
var runSequence = require("run-sequence");

var tsProject = ts.createProject('./tsconfig.json');

gulp.task('default', function(done) {

    runSequence('build', 'lib', done);
});

// Performs build without sourcemaps but includes dts files to need to dts-concat in 'lib' task.
gulp.task('build', ['clean'], function(done) {

    var tsResult = gulp.src(['typings/**/*.ts', 'src/**/*.ts', 'tests/**/*.ts', 'benchmarks/**/*.ts'])
        .pipe(ts(tsProject));

    return merge([
        tsResult.dts.pipe(gulp.dest('build')),
        tsResult.js.pipe(gulp.dest('build'))
    ]);
});

gulp.task('clean', function() {
    return del(['build', 'lib']);
});

gulp.task('lib', function(done) {

    return gulp.src(['build/src/**/*.js', "build/src/**/*.d.ts", "src/**/*.d.ts", "package.json" ])
        .pipe(gulp.dest('lib'));
});

gulp.task('bench', function(done) {

    var baseline = new Baseline();
    baseline.reporter = new Baseline.DefaultReporter();
    baseline.useColors = true;
    baseline.baselinePath = "baseline.json";
    baseline.files = [ "build/benchmarks/requestDispatcher.bench.js" ];
    baseline.run(function(err, slower) {
        done(err);
        process.exit(slower);
    });
});
