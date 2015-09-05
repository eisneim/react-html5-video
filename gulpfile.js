var gulp = require('gulp'),
	fs = require("fs"),
	rename = require("gulp-rename"),
	gulpif = require('gulp-if');
	gbrowserify = require('gulp-browserify'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	livereload = require('gulp-livereload');

var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');

// es6 related things
var babel = require('gulp-babel');
var babelify = require("babelify");

// for sass compile and live reload:
var sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css');

/**
 * parse cli options: 
 * --app=editor or client
 * --env=development or production
 */
var argv = require('minimist')(process.argv.slice(2));

var paths = {
	scss: 'scss/react-html5-video.scss',
	jsDemoMain:"demo/app/app.demo.js",

	dest: 		"./demo/build",
	jsLib: 		"./src/**/*.js",
}
// ---------------------------------------
gulp.task('scss', function() {
    // console.log('-----build main.scss');
  gulp.src( paths.scss )
    .pipe(sass())
    .on( "error", handleError)
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(argv.env === 'production'?"./lib": paths.dest ))
    .pipe(
    	gulpif(argv.env!='production',livereload())	
    );
});


// ---------------------------------------
gulp.task('demoApp',function(){
	gulp.src( paths.jsDemoMain )
	.pipe(gbrowserify({
		debug: argv.env !== 'production',
		insertGlobals : true,
		transform: [
			babelify.configure({
			  // optional: ["es7.asyncFunctions","runtime"]
			})
		],
	}))
	.pipe( // only minify in production
		gulpif(argv.env === 'production', uglify({ compress:true, mangle:true}))
	) 
	.on( "error", handleError)
	.pipe(gulp.dest(paths.dest))
})

// watch files for live reload
gulp.task('watch',["watchify"],function(){
	livereload.listen();

	gulp.watch('./demo/build/**/*').on('change', livereload.changed);
	gulp.watch('./demo/**/*.css').on('change', livereload.changed);
	// gulp.watch( paths.html ).on('change', livereload.changed);
	gulp.watch( 'scss/**/*.scss' ,['scss']);	
});



/**
 * ============= watchify to make it faster to compile
 */
gulp.task('watchify', function(){
	return compile();
});

function compile(){
 	var w = watchify(
		browserify({
	   		entries: paths.jsDemoMain,
	   		insertGlobals : true,
	    	// debug: true,
	    	cache: {}, packageCache: {},
	    })
		.transform(	babelify.configure({
			// optional: ["es7.asyncFunctions","runtime"]
		}))
 	)

 	function rebundle(){
  	w.bundle()
  	.on( "error", handleError)
   .pipe(source(   "app.demo.js"))
   .pipe(gulp.dest(paths.dest));
   // .pipe( livereload() );
 	}
 	w.on('update', function(args){
 		console.log('-> bundling...');
 		rebundle()
 	});
 	rebundle()
}

// ------------------------------server ------------------

gulp.task("js-es6",function(){
	gulp.src([paths.jsLib])
	.pipe( babel({
		blacklist: ['regenerator','bluebirdCoroutines'],
		// optional: ["es7.asyncFunctions"],
		// only: __dirname+'/src/**/*.js',
	}) )
	.on( "error", handleError)
	.pipe(gulp.dest("./lib"))
	// .on('end', function() {
 //     fs.createWriteStream("./dist/.trigger");
 //  });
})

/**
 * compile es6 code
 */
// gulp.task("watch-server",function(){
// 	gulp.watch([paths.jsLib,paths.jsShared], function ( event ) {
// 		console.log("server file changed >> "+ event.path.replace(__dirname,""))
// 		var destPath ="./dist/" + event.path.replace(__dirname+"/src/","").replace(/[^\/]+$/,"");
// 		console.log(destPath)
		
// 		return gulp.src( event.path )
//       .pipe( babel({
//       	blacklist: ['regenerator','bluebirdCoroutines'],
//       	optional: ["es7.asyncFunctions"], // ,"runtime"
//       	only: __dirname+'/src/server/**/*.js',
//       }) )
//       .on( "error", handleError)
//       .pipe(gulp.dest( destPath))
//     	.on('end', function() {
//          fs.createWriteStream("./dist/.trigger");
//       });
// 	});

// })



// ------------------------------ build ------------------
gulp.task('default',["js-es6"]);

gulp.task('build',['demoApp',"js-es6",'scss']);

gulp.task('serve',["js-es6",'watch']);

gulp.task("try",function(){
	argv.env = "production";
	gulp.run(["js-es6"])
})

// --------- utils ------------
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}