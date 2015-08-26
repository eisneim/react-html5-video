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
console.log("build app: ", argv.app )

var paths = {
	html: ['./views/**/*.html',"./public/**/*.html"],
	img: 	'public/img/**/*',
	scssEditor: 'scss/app.editor.scss',
	scssClient: 'scss/app.client.scss',
	
	jsEditorMain:"src/editor/app.editor.js",

	jsClientMain:"src/client/app.client.js",
	dest: 				"./public/build",
	jsServer: 		"./src/server/**/*.js",
	jsShared: 		"./src/_shared/**/*.js",
}
// ---------------------------------------
gulp.task('scss', function() {
    // console.log('-----build main.scss');
  gulp.src( argv.app =="client"? paths.scssClient  : paths.scssEditor )
    .pipe(sass())
    .on( "error", handleError)
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest( paths.dest ))
});


// ---------------------------------------
gulp.task('react',function(){
	console.log(argv.app == "client"? paths.jsClientMain : paths.jsEditorMain)
	gulp.src( argv.app == "client"? paths.jsClientMain : paths.jsEditorMain )
	.pipe(gbrowserify({
		debug: argv.env !== 'production',
		insertGlobals : true,
		transform: [
			babelify.configure({
			  optional: ["es7.asyncFunctions","runtime"]
			})
		],
	}))
	.pipe( // only minify in production
		gulpif(argv.env === 'production', uglify({ compress:true, mangle:true}))
	) 
	.on( "error", handleError)
	.pipe(gulp.dest(paths.dest))
})

// gulp.task('react', function() {
//     browserify({
//    		entries: paths.jsEditorMain,
//    		insertGlobals : true,
//     	debug: true
//     })
//     .transform(	babelify.configure({
// 			  optional: ["es7.asyncFunctions","runtime"]
// 			}))
//     .bundle()
//     .pipe(source('build.js'))
//     .on( "error", handleError)
//     .pipe(gulp.dest(paths.dest));
// });
// 
// watch files for live reload
gulp.task('watch',["watchify"],function(){
	livereload.listen();

	gulp.watch('./public/build/**/*.js').on('change', livereload.changed);
	gulp.watch('./public/build/**/*.css').on('change', livereload.changed);
	gulp.watch( paths.html ).on('change', livereload.changed);
	gulp.watch( 'scss/**/*.scss' ,['scss']);	

	// gulp.watch( paths.jsEditor ,['react']);
	// gulp.watch( paths.jsEditorShared ,['react']);//,"js-server"
	// gulp.watch( paths.jsServer ,["js-server"] );

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
	   		entries: argv.app == "client"? paths.jsClientMain : paths.jsEditorMain,
	   		insertGlobals : true,
	    	// debug: true,
	    	cache: {}, packageCache: {},
	    })
		.transform(	babelify.configure({
			optional: ["es7.asyncFunctions","runtime"]
		}))
 	)

 	function rebundle(){
  	w.bundle()
  	.on( "error", handleError)
   .pipe(source(  argv.app == "client"? "app.client.js" :'app.editor.js'))
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

gulp.task("js-server",function(){
	gulp.src([paths.jsServer])
	.pipe( babel({
		blacklist: ['regenerator','bluebirdCoroutines'],
		optional: ["es7.asyncFunctions"],
		only: __dirname+'/src/**/*.js',
	}) )
	.on( "error", handleError)
	.pipe(gulp.dest("./dist/server/"))
	.on('end', function() {
     fs.createWriteStream("./dist/.trigger");
  });
})
gulp.task("js-shared",function(){
	gulp.src([paths.jsShared])
	.pipe( babel({
		blacklist: ['regenerator','bluebirdCoroutines'],
		optional: ["es7.asyncFunctions"],
		only: __dirname+'/src/**/*.js',
	}) )
	.on( "error", handleError)
	.pipe(gulp.dest("./dist/_shared/"))
	.on('end', function() {
     fs.createWriteStream("./dist/.trigger");
  });
})
/**
 * compile server side code
 */
gulp.task("watch-server",function(){
	gulp.watch([paths.jsServer,paths.jsShared], function ( event ) {
		console.log("server file changed >> "+ event.path.replace(__dirname,""))
		var destPath ="./dist/" + event.path.replace(__dirname+"/src/","").replace(/[^\/]+$/,"");
		console.log(destPath)
		
		return gulp.src( event.path )
      .pipe( babel({
      	blacklist: ['regenerator','bluebirdCoroutines'],
      	optional: ["es7.asyncFunctions"], // ,"runtime"
      	only: __dirname+'/src/server/**/*.js',
      }) )
      .on( "error", handleError)
      .pipe(gulp.dest( destPath))
    	.on('end', function() {
         fs.createWriteStream("./dist/.trigger");
      });
	});

})



// ------------------------------ build ------------------
gulp.task('default',['react']);

gulp.task('build',['react',"js-server",'scss']);

gulp.task('serve',["js-server","js-shared","watch-server",'watch']);



gulp.task("play",function(){
	console.log("the argv options")
	console.log( argv )
	console.log("process.argv.slice(2):  ")
	console.log( process.argv.slice(2) )

})

// --------- utils ------------
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}