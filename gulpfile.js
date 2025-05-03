'use strict';

const path = require('path')
const build = require('@microsoft/sp-build-web');
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

build.addSuppression(/Warning - \[sass\] The local CSS class/gi);

// tailwindcss buldling task
const configurePostCSS = build.subTask('configure-postcss', function (gulp, buildOptions, done) {
  return gulp.src('lib/**/*.css')
    .pipe(postcss([
      tailwindcss('./tailwind.config.js'),
      autoprefixer()
    ]))
    .pipe(gulp.dest('lib/'));
});

build.rig.addPostBuildTask(configurePostCSS);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

/* fast-serve */
const { addFastServe } = require("spfx-fast-serve-helpers");
addFastServe(build);
/* end of fast-serve */

// Configuring path aliases
build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    if (!generatedConfiguration.resolve.alias) {
      generatedConfiguration.resolve.alias = {};
    }

    //root src folder
    generatedConfiguration.resolve.alias['@src'] = path.resolve(
      __dirname,
      'lib'
    );

    //root nebula folder
    generatedConfiguration.resolve.alias['@nebula'] = path.resolve(
      __dirname,
      'lib/nebula'
    );

    return generatedConfiguration;
  }
});

build.initialize(require('gulp'));