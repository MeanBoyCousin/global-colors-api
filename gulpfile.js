const gulp = require('gulp')
const eslint = require('gulp-eslint')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const prefix = require('autoprefixer')
const sort = require('postcss-sorting')

gulp.task('lint-self', () => {
    return gulp.src('gulpfile.js')
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(gulp.dest('./'))
})

gulp.task('lint', () => {
    const helpers = gulp.src('app/helpers/*.js')
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(gulp.dest('app/helpers'))

    const routes = gulp.src('app/routes/*.js')
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(gulp.dest('app/routes'))

    const gcapi = gulp.src('app/gcapi.js')
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(gulp.dest('app'))

    return (helpers, routes, gcapi)
})

const sortTemplate = require('./css-sort-template.json')

gulp.task('styles', function () {
    const index = gulp.src('app/assets/index.css')
        .pipe(plumber())
        .pipe(postcss([sort(sortTemplate), prefix()]))
        .pipe(gulp.dest('app/assets'))

    const fourZeroFour = gulp.src('app/assets/404.css')
        .pipe(plumber())
        .pipe(postcss([sort(sortTemplate), prefix()]))
        .pipe(gulp.dest('app/assets'))

    return (index, fourZeroFour)
})

gulp.task('default', gulp.series('lint-self', 'lint', 'styles'))
