const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const color = require('gulp-color');
const rev = require('gulp-rev');
const extend = require('gulp-extend');
const rename = require("gulp-rename");
const environments = require('gulp-environments');

if (fs.existsSync('gulp-tasks')) {
    require('gulp-require-tasks')();
}

var development = environments.development;
var production = environments.production;

const revManifestPath = 'public/build/';
const tmpPath = 'public/build/tmp/';
const revManifestTmpPath = tmpPath + 'manifest/';

// Generate config for Gulp
execSync('./iris iris:generate-gulp-config');
var config = require('./build/gulp-config.js');
console.log(color('Gulp config:', 'YELLOW'));
console.log(config);
console.log();

// Generate JS files with translations
del.sync('build/language');
execSync('./iris iris:generate-js-translations');

del.sync('build/migrations');

var coreDir = 'vendor/iriscrm/source-core/src/Iris/';

var themes = fs.readdirSync(coreDir + 'core/templates')
    .filter(function (file) {
        return fs.statSync(path.join(coreDir + 'core/templates', file)).isDirectory()
    });
console.log(color('Themes:', 'YELLOW'));
console.log(themes);
console.log();

var paths = {};

paths.styles = [
    'node_modules/select2/dist/css/select2.min.css',
    coreDir + 'core/engine/css/default.css',
    coreDir + 'core/engine/css/debug.css',
    coreDir + 'core/engine/js/jquery-ui/css/jquery-ui-1.10.4.css',
    coreDir + 'core/engine/js/fullcalendar/fullcalendar.min.css',
    coreDir + 'core/engine/js/jsxgraph/jsxgraph.css',
];

paths.vendorScripts = [
    coreDir + 'core/engine/js/prototypejs/prototype.js',
    'node_modules/underscore/underscore.js',
    'node_modules/backbone/backbone-min.js',

    // lookup с автозавершением
    coreDir + 'core/engine/js/window/debug.js',
    coreDir + 'core/engine/js/window/window.js',

    coreDir + 'core/engine/js/json2/json2.js',
    coreDir + 'core/engine/js/growler/growler.js',
    coreDir + 'core/engine/js/md5.js',
    coreDir + 'core/engine/js/calendar/*.js',
    'node_modules/select2/dist/js/select2.min.js',
    'node_modules/moment/min/moment.min.js',
    coreDir + 'core/engine/js/fullcalendar/fullcalendar.min.js',
    coreDir + 'core/engine/js/fullcalendar/lang/all.js',
    coreDir + 'core/engine/js/jsxgraph/jsxgraphcore-edited.js',
];
paths.coreScripts = [
    coreDir + 'core/engine/js/loader.js',
    coreDir + 'core/engine/js/transport.js',
    coreDir + 'core/engine/js/controllers.js',
    coreDir + 'core/engine/js/controller.js',
    coreDir + 'core/engine/js/cardcontroller.js',
    coreDir + 'core/engine/js/gridcontroller.js',
    coreDir + 'core/engine/js/filtercontroller.js',
    coreDir + 'core/engine/js/common.js',
    coreDir + 'core/engine/js/index.js',
    coreDir + 'core/engine/js/language.js',
    coreDir + 'core/engine/js/menu/menu-cache.js',
    coreDir + 'core/engine/js/menu/menu-hf.js',
    coreDir + 'core/engine/js/menu/protofish.js',
    coreDir + 'core/engine/js/controls/*.js',
    coreDir + 'core/engine/js/start.js',
];
paths.languageScripts = [ 'build/language/**/*.js' ];
paths.oktellScripts = [ coreDir + 'core/engine/js/oktell.js-1.7.1/*.min.*' ];
paths.ckeditorScripts = [ coreDir + 'core/engine/js/ckeditor/**/*' ];
paths.bootstrapScripts = [ coreDir + 'core/bootstrap/**/*' ];
paths.ie9Scripts = [ coreDir + 'core/html5shiv.js', 'core/respond.min.js' ];
paths.jqueryScripts = [ 'node_modules/jquery/dist/jquery.min.js' ];
paths.jqueryUiScripts = [ coreDir + 'core/engine/js/jquery-ui/jquery-ui-1.10.4.min.js' ];
paths.select2LangScripts = [ 'node_modules/select2/dist/js/i18n/*.js' ];
paths.loginStyles = [ coreDir + 'core/login/css/*.css' ];
paths.loginScripts = [
    coreDir + 'core/engine/js/md5.js',
    coreDir + 'core/login/**/*.js'
];
paths.loginImages = [ coreDir + 'core/login/images/login/*' ];

paths.scripts = [];
paths.configStyles = [];
paths.reportStyles = [];
paths.configImages = [];
paths.migrations = [ config.coreDirectory + 'migrations/Version*.php' ];
var allHierarchy = [ coreDir + 'core/' ];

config.configDirectories.reverse().forEach(function (item) {
    paths.scripts.push(item + '**/*.js');
    paths.loginScripts.push(item + 'login/**/*.js');

    paths.migrations.push(item + 'migrations/Version*.php');

    paths.configStyles.push(item + 'styles/*.css');
    paths.reportStyles.push(item + 'sections/Report/**/*.css');
    paths.loginStyles.push(item + 'login/**/*.css');

    paths.configImages.push(item + 'styles/images/*');
    paths.loginImages.push(item + 'login/images/login/*');

    allHierarchy.push(item);
});


gulp.task('clean', function() {
    return del(['public/build']);
});

gulp.task('images', ['clean'], function() {
    return gulp.src(coreDir + 'core/engine/css/default/*')
        .pipe(gulp.dest('public/build/css/default'))
    ;
});
gulp.task('loginImages', ['clean'], function() {
    return gulp.src(paths.loginImages)
        .pipe(gulp.dest('public/build/images/login'))
    ;
});

gulp.task('configImages', ['clean'], function() {
    return gulp.src(paths.configImages)
        .pipe(gulp.dest('public/build/css/images'))
    ;
});

gulp.task('styles', ['clean'], function() {
    return gulp.src(paths.styles)
        .pipe(development(sourcemaps.init()))
        .pipe(concat('css/all.min.css'))
        .pipe(production(cleanCSS()))
        .pipe(development(sourcemaps.write()))
        .pipe(rev())
        .pipe(gulp.dest('public/build/'))
        .pipe(rev.manifest(revManifestTmpPath + 'styles.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('configStyles', ['clean'], function() {
    return gulp.src(paths.configStyles)
        .pipe(development(sourcemaps.init()))
        .pipe(concat('css/config.min.css'))
        .pipe(production(cleanCSS()))
        .pipe(development(sourcemaps.write()))
        .pipe(rev())
        .pipe(gulp.dest('public/build/'))
        .pipe(rev.manifest(revManifestTmpPath + 'configStyles.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('reportStyles', ['clean', 'configStyles'], function() {
    return gulp.src(paths.reportStyles)
        .pipe(development(sourcemaps.init()))
        .pipe(concat('css/report.min.css'))
        .pipe(production(cleanCSS()))
        .pipe(development(sourcemaps.write()))
        .pipe(rev())
        .pipe(gulp.dest('public/build/'))
        .pipe(rev.manifest(revManifestTmpPath + 'reportStyles.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('loginStyles', ['clean'], function() {
    return gulp.src(paths.loginStyles)
        .pipe(development(sourcemaps.init()))
        .pipe(concat('css/login.min.css'))
        .pipe(production(cleanCSS()))
        .pipe(development(sourcemaps.write()))
        .pipe(rev())
        .pipe(gulp.dest('public/build/'))
        .pipe(rev.manifest(revManifestTmpPath + 'loginStyles.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
        ;
});

themes.forEach(function (theme) {
    gulp.task('theme-' + theme + '-styles', ['clean'], function() {
        var themeStyles = [];
        allHierarchy.forEach(function (item) {
            themeStyles.push(item + 'templates/' + theme + '/css/*.css');
        });
        return gulp.src(themeStyles)
            .pipe(development(sourcemaps.init()))
            .pipe(concat('themes/' + theme + '/css/' + theme + '.min.css'))
            .pipe(production(cleanCSS()))
            .pipe(development(sourcemaps.write()))
            .pipe(rev())
            .pipe(gulp.dest('public/build/'))
            .pipe(rev.manifest(revManifestTmpPath + 'theme-' + theme + '-styles.json', {
                base: revManifestPath
            }))
            .pipe(gulp.dest(revManifestPath))
        ;
    });

    gulp.task('theme-' + theme + '-images', ['clean'], function() {
        var themeImages = [];
        allHierarchy.forEach(function (item) {
            themeImages.push(item + 'templates/' + theme + '/**/*');
            themeImages.push('!' + item + 'templates/' + theme + '/**/*.css');
        });
        return gulp.src(themeImages)
            .pipe(gulp.dest('public/build/themes/' + theme))
        ;
    });

    gulp.task('theme-' + theme + '-scripts', ['clean'], function() {
        var themeScripts = [];
        allHierarchy.forEach(function (item) {
            themeScripts.push(item + 'templates/' + theme + '/**/*.js');
        });
        return gulp.src(themeScripts)
            .pipe(development(sourcemaps.init()))
            .pipe(concat('themes/' + theme + '/js/' + theme + '.min.js'))
            .pipe(production(uglify()))
            .pipe(development(sourcemaps.write()))
            .pipe(rev())
            .pipe(gulp.dest('public/build/'))
            .pipe(rev.manifest(revManifestTmpPath + 'theme-' + theme + '-scripts.json', {
                base: revManifestPath
            }))
            .pipe(gulp.dest(revManifestPath))
        ;
    });
});

gulp.task('vendorScripts', ['clean'], function() {
    return gulp.src(paths.vendorScripts)
        .pipe(development(sourcemaps.init()))
        .pipe(concat('js/vendor.min.js'))
        //.pipe(production(uglify()))
        .pipe(development(sourcemaps.write()))
        .pipe(rev())
        .pipe(gulp.dest('public/build/'))
        .pipe(rev.manifest(revManifestTmpPath + 'vendorScripts.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('coreScripts', ['clean'], function() {
    return gulp.src(paths.coreScripts)
        .pipe(development(sourcemaps.init()))
        .pipe(concat('js/core.min.js'))
        .pipe(production(uglify()))
        .pipe(development(sourcemaps.write()))
        .pipe(rev())
        .pipe(gulp.dest('public/build/'))
        .pipe(rev.manifest(revManifestTmpPath + 'coreScripts.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('languageScripts', ['clean'], function() {
    return gulp.src(paths.languageScripts)
        .pipe(development(sourcemaps.init()))
        .pipe(production(uglify()))
        .pipe(development(sourcemaps.write()))
        .pipe(rev())
        .pipe(gulp.dest('public/build/js/language'))
        .pipe(rename(function(p) {
            p.dirname = "js/language/" + p.dirname
        }))
        .pipe(rev.manifest(revManifestTmpPath + 'languageScripts.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('oktellScripts', ['clean'], function() {
    return gulp.src(paths.oktellScripts)
        .pipe(gulp.dest('public/build/oktell/'))
        .pipe(rev())
        .pipe(rename({
            dirname: "oktell"
        }))
        .pipe(rev.manifest(revManifestTmpPath + 'oktellScripts.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('bootstrapScripts', ['clean'], function() {
    return gulp.src(paths.bootstrapScripts)
        .pipe(gulp.dest('public/build/bootstrap/'))
    ;
});
gulp.task('ie9Scripts', ['clean'], function() {
    return gulp.src(paths.ie9Scripts)
        .pipe(concat('js/ie9.min.js'))
        .pipe(gulp.dest('public/build/'))
    ;
});
gulp.task('ckeditorScripts', ['clean'], function() {
    return gulp.src(paths.ckeditorScripts)
        .pipe(gulp.dest('public/build/ckeditor/'))
    ;
});
gulp.task('jquery', ['clean'], function() {
    return gulp.src(paths.jqueryScripts)
        .pipe(rev())
        .pipe(gulp.dest('public/build/js/'))
        .pipe(rename({
            dirname: "js"
        }))
        .pipe(rev.manifest(revManifestTmpPath + 'jquery.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('jqueryUiScripts', ['clean'], function() {
    return gulp.src(paths.jqueryUiScripts)
        .pipe(rev())
        .pipe(gulp.dest('public/build/js/'))
        .pipe(rename({
            dirname: "js"
        }))
        .pipe(rev.manifest(revManifestTmpPath + 'jqueryUiScripts.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('select2LangScripts', ['clean'], function() {
    return gulp.src(paths.select2LangScripts)
        .pipe(gulp.dest('public/build/js/select2'))
    ;
});
gulp.task('scripts', ['clean'], function() {
    return gulp.src(paths.scripts)
        .pipe(development(sourcemaps.init()))
        .pipe(concat('js/all.min.js'))
        .pipe(production(uglify()))
        .pipe(development(sourcemaps.write()))
        .pipe(rev())
        .pipe(gulp.dest('public/build/'))
        .pipe(rev.manifest(revManifestTmpPath + 'scripts.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});
gulp.task('loginScripts', ['clean'], function() {
    return gulp.src(paths.loginScripts)
        .pipe(development(sourcemaps.init()))
        .pipe(concat('js/login.min.js'))
        .pipe(production(uglify()))
        .pipe(development(sourcemaps.write()))
        .pipe(rev())
        .pipe(gulp.dest('public/build/'))
        .pipe(rev.manifest(revManifestTmpPath + 'loginScripts.json', {
            base: revManifestPath
        }))
        .pipe(gulp.dest(revManifestPath))
    ;
});

gulp.task('migrations', function() {
    return gulp.src(paths.migrations)
        .pipe(gulp.dest('build/migrations/'))
    ;
});

var tasks = [
    'scripts',
    'jquery',
    'coreScripts',
    'vendorScripts',
    'languageScripts',
    'oktellScripts',
    'ckeditorScripts',
    'bootstrapScripts',
    'ie9Scripts',
    'jqueryUiScripts',
    'select2LangScripts',
    'loginScripts',

    'styles',
    'configStyles',
    'reportStyles',
    'loginStyles',

    'images',
    'loginImages',
    'configImages',

    'migrations',
];
themes.forEach(function (theme) {
    tasks.push('theme-' + theme + '-styles');
    tasks.push('theme-' + theme + '-images');
    tasks.push('theme-' + theme + '-scripts');
});

gulp.task('manifest', tasks, function() {
    return gulp.src([revManifestTmpPath + '*.json'])
        .pipe(extend(revManifestPath + 'rev-manifest.json', true, 2))
        .pipe(gulp.dest('.'))
    ;
});

gulp.task('build', tasks.concat(['manifest']), function() {
    del([tmpPath]);
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['build']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'build']);