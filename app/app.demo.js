import React from "react/addons";
import Video from "../../src/Video.js";

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
		var sources = [
			"./video/video.mp4","./video/video.webm","./video/video.ogv"
		]

		return (
			<div>
				<header className="clearfix">
					<div className="container">
						<br/>
						<h1>React-html5-video</h1>
						<Video 
							sources={sources} 
							poster="./video/poster.png" 
							metaDataLoaded={this.getApi}
						>
							<h3 className="pull-right"><a href="http://glexe.com" target="_blank">LOGO</a></h3>
							<p>Any HTML content</p>
						</Video>
					</div>
				</header>
				<section className="container clearfix">
					<p>external controls are also supported!</p>
					<div>
						<button onClick={e=>this._togglePlay()}> play / pause </button>
						<button onClick={e=>this._volume(0.2)}> volume + </button>
						<button onClick={e=>this._volume(-0.2)}> volume - </button>
						<button onClick={e=>this._setTime(5)}> setTime to 5s </button>
						<button onClick={e=>this._fullscreen()}> fullScreen </button>
					</div>

				</section>
			</div>
		)
	}
}


React.render( <App />, document.body );


