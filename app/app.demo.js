import React from "react";
import Video from "../../src/Video.js";

class Code extends React.Component{
	componentDidMount(){
		var node = React.findDOMNode(this);
		Prism.highlightElement( node,false,function(){});
	}
	render(){
		var lan = `language-${ this.props.lan || "markup" }`
		return(
			<pre>
				<code className={lan}>{this.props.children}</code>
			</pre>
		)
	}
}

class App extends React.Component {
	constructor(){
		super()
		this.api = null;
		this.getApi = this.getApi.bind( this );
	}
	getApi(api){
		console.log( this )
		this.api = api;
	}
	_togglePlay(){
		console.log(this.api)
		if(!this.api) return;
		this.api.togglePlay()
	}
	_volume( increment ){
		if(!this.api) return;
		this.api.volume( this.api.$video.volume + increment )
	}
	_fullscreen(){
		if(!this.api) return;
		this.api.fullscreen();
	}
	_setTime( second ){
		if(!this.api) return;
		this.api.setTime(second )
	}
	render(){
		var sources = ["./video/video.mp4","./video/video.webm","./video/video.ogv"]
		var subtitles = [
			{
				src:"video/captions_en.vtt",
				lang:"en",label:"English"
			},
			{
				src:"video/captions_zh.vtt",
				lang:"zh",label:"中文"
			},
		]

		return (
			<div>
				<header className="clearfix">
					<div className="container">
						<br/>
						<h1>React-html5-video</h1>
						<Video 
							sources={sources} 
							subtitles={subtitles}
							poster="./video/poster.png" 
							metaDataLoaded={this.getApi}
						>
							<h3 className="pull-right"><a href="http://glexe.com" target="_blank">LOGO</a></h3>
							<p>Any HTML content</p>
						</Video>
						<ul className="gh-btns">
							<li><iframe src="https://ghbtns.com/github-btn.html?user=eisneim&repo=react-html5-video&type=star&count=true" frameBorder="0" scrolling="0" height="20px"></iframe></li>
							<li><iframe src="https://ghbtns.com/github-btn.html?user=eisneim&repo=react-html5-video&type=fork&count=true" frameBorder="0" scrolling="0"  height="20px"></iframe></li>
							<li><iframe src="https://ghbtns.com/github-btn.html?user=eisneim&type=follow&count=true" frameBorder="0" scrolling="0" width="150px"  height="20px"></iframe></li>
						</ul>
					</div>
				</header>
				<section className="container clearfix main">
					<h3>external controls are also supported!</h3>
					<div>
						<button onClick={e=>this._togglePlay()}> play / pause </button>
						<button onClick={e=>this._volume(0.2)}> volume + </button>
						<button onClick={e=>this._volume(-0.2)}> volume - </button>
						<button onClick={e=>this._setTime(5)}> setTime to 5s </button>
						<button onClick={e=>this._fullscreen()}> fullScreen </button>
					</div>

					<h2>Quick start</h2>
					<Code lan="javascript">
						npm install --save react-html5-video
					</Code>
					<p>load in the stylesheet,(in order to make it easier for developers to customize video player's style, css is not written in js)</p>
					<Code lan="markup">
					{`<link rel="stylesheet" type="text/css" href="node_modules/react-html5-video/lib/react-html5-video.css">`}
					</Code>
					<Code lan="javascript">{
`import React from "react";
import Video from "react-html5-video";

class MyAewsomeApp extends React.Component{
	render(){
		var sources = [ "./video/video.mp4","./video/video.webm","./video/video.ogv" ]
		return(
			<Video sources={sources} poster="./video/poster.png" >
				<h3 className="video-logo pull-right"><a href="http://glexe.com" target="_blank">LOGO</a></h3>
				<p>Any HTML content</p>
			</Video>
		)
	}
}

`
					}</Code>
				</section>
			</div>
		)
	}
}


React.render( <App />, document.body );


