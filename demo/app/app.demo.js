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
		this._setContent = this._setContent.bind(this);
		this._toggleControls = this._toggleControls.bind(this);

		this.state = {
			content:"<p>Any HTML content (demo only)</p>",
			showControls: true,
			controlPanelStyle:"overlay",
		}
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
	_setContent(e){
		this.setState({
			content: e.target.value
		})
	}
	_toggleControls(e){
		console.log("toggle controls")
		this.setState({
			showControls: !this.state.showControls
		})
	}
	_changeStyle(style){
		console.log("set panel style to:",  style)
		this.setState({controlPanelStyle: style });
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
							controls={this.state.showControls}
							controlPanelStyle={this.state.controlPanelStyle}
						>
							<h3 className="pull-right"><a href="http://glexe.com" target="_blank">LOGO</a></h3>
							<div dangerouslySetInnerHTML={{__html: this.state.content }}></div>
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
						<button onClick={this._toggleControls}> toggleControls </button>
						<label>
							controlPanelStyle: 
							<select value={this.state.controlPanelStyle} onChange={e=>this._changeStyle(e.target.value)}>
								<option value="overlay">overlay</option>
								<option value="fixed">fixed</option>
							</select>
						</label>
					</div>
					<textarea value={this.state.content} onChange={this._setContent} />
					<h2>Quick start</h2>
					<Code lan="javascript">
						npm install --save react-h5-video
					</Code>
					<p>load in the stylesheet,(in order to make it easier for developers to customize video player's style, css is not written in js)</p>
					<Code lan="markup">
					{`<link rel="stylesheet" type="text/css" href="node_modules/react-h5-video/lib/react-html5-video.css">`}
					</Code>
					<Code lan="javascript">{
`import React from "react";
import Video from "react-h5-video";

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
					<h2>API</h2>
					<p>please go to <a href="https://github.com/eisneim/react-html5-video">github repo</a> to see full api</p>
				</section>
			</div>
		)
	}
}


React.render( <App />, document.body );


