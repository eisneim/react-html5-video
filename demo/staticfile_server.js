var http = require('http'),
	url = require('url'),
	path = require('path'),
	fs = require('fs');

// url :  /static/file.html
/*
	将获取的二进制数据写入另一个文件
	curl -o outpu.jpg http://localhost:8888/static/test.jpg
 */
var port = 8888;
http.createServer(function(req,res){

	req.parsed_url = url.parse(req.url,true);
	var core_url = req.parsed_url.pathname;

	// if(core_url.substr(0,8) == '/static/'){
		serveStatic(req,res);
	// }else{
	// 	res.writeHead(404,{'Content-Type':'text/plain'});
	// 	res.end('not found');
	// }
	console.log('server listen at ', port)


}).listen(port);

function serveStatic(req,res){

	var fn = req.parsed_url.pathname;
	if(fn[0] == "/" ) fn = fn.substr(1);
	if(!fn || fn=="/") fn= "index.html";

	var rs = fs.createReadStream(fn);
	var ct = getContentType(fn);

	console.log(fn)
	rs.on('error',function(){
		res.writeHead(404,{'Content-Type':'text/plain'});
		res.end('not found');
	})

	res.writeHead(200,{'Content-Type':ct});

	// pipe的作用就是简化 readable 和 end stream！
	rs.pipe(res);

}

function getContentType(filename){
	var ext = path.extname(filename).toLowerCase();

	switch(ext){
		case '.mp4':
			return 'video/mp4'
		case '.webm':
			return 'video/webm'
		case '.ogv':
			return 'video/ogv'
		case '.jpg': case '.jpeg':
			return 'image/jpeg'
		case '.png':
			return 'image/png';
		case '.gif':
			return 'image/gif';
		case '.html':
			return 'text/html';
		case '.js':
			return 'text/javascript';
		case '.css' :
			return 'text/css';
		default:
			return 'text/plain';

	}

}
