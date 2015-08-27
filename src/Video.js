import React from "react"
import path from "path"
import { formatTime } from "./utils/dateTime.js"

window.r5Debug = require("debug");
var dd = window.r5Debug("r5");

var videoEvents = ["play","pause","playing","abort","progress","ratechange","canplay","canplaythrough","durationchange","emptied","ended","loadeddata","loadedmetadata","loadstart","seeked","seeking","stalled","suspend","timeupdate","volumechange","waiting","error","encrypted","mozaudioavailable","interruptbegin","interruptend"];

class Video extends React.Component {
	constructor(){
		super()
		// store all public handler here, and return this api object to parent component;
		this.api = {}; 
		var pubHandlers = ["togglePlay","setTime","fullscreen","volume"];
		// save public handlers to api object
		pubHandlers.forEach( name => {
			this["_"+name] = this.api[name] = this["_"+name].bind(this)
		});
		// manually bind all handlers
		var handlers = ["metaDataLoaded","timeupdate","durationchange","progress"];
		handlers.forEach( name => this["_"+name] = this["_"+name].bind(this) )
		
	}
	componentDidMount(){
		/**
		 * register some video event listener here;
		 */
		this.$wraper = React.findDOMNode(this);
		var $video = this.$video = React.findDOMNode( this.refs.video )
window.$video = $video;
		// set $wrapers width equal to video width, if width props is not set;
		this.$setWraperDimension(this.$video);
		$video.addEventListener("loadedmetadata", this._metaDataLoaded )
		// this update interval gap is too big make progressbar not snapy
		// $video.addEventListener("timeupdate", this._timeupdate )
		$video.addEventListener("progress", this._progress )
		

		if( this.props.autoPlay && !this.seekbarUpdateTimer ) this.seekbarUpdateInterval();
	}
	_setTime( percent ){
		if(percent>100) return;
		var time = percent * this.$video.duration / 100
		dd("change time", time )
		if(this.$video.fastSeek ){
			this.$video.fastSeek(time)
		}else{
			this.$video.currentTime = time;
		}
		this.setState({seekProgress: percent });
	}
	// update seek bar width;
	_timeupdate(e){
		var percent = this.$video.currentTime / this.$video.duration * 100;
		var newState = {
			seekProgress: percent, 
			currentTime: formatTime(this.$video.currentTime) 
		}
		if(this.$video.currentTime >= this.$video.duration ) {
			newState.isPlaying = false;
		}
		this.setState(newState);
	}
	_durationchange(){

	}
	// loading progress bar
	_progress(e){
		var buf = this.$video.buffered;
		var total = 0;
		for( let ii = 0; ii<buf.length; ii++ ){
			total += buf.end(ii) - buf.start(ii);
		}
		this.setState({loadedProgress: total / this.$video.duration * 100 })
	}
	/**
	 * after metaData Loaded we can get video dimentions and set width,height of video wraper;
	 */
	_metaDataLoaded(e){
		dd("metadata loaded")
		if(this.props.metaDataLoaded && typeof this.props.metaDataLoaded == "function" ){
			this.props.metaDataLoaded( this.api );
		}
		this.$setWraperDimension(this.$video);
		// calculate width of seek bar and progress;
		this.$seekbarWraper = React.findDOMNode( this.refs.seekbarWraper );
		this.setState({duration: formatTime(this.$video.duration) })
	}
	seekbarUpdateInterval(){
		this.seekbarUpdateTimer = setInterval( this._timeupdate, 80);
	}
	_togglePlay(){
		dd("toggle play")
		if( !this.seekbarUpdateTimer ) this.seekbarUpdateInterval();

		if(!this.state.isPlaying){
			if(this.$video.currentTime >= this.$video.duration ) this.$video.currentTime = 0;
			this.$video.play();
			this.setState({isPlaying: true})
		}else{
			this.$video.pause();
			this.setState({isPlaying: false})
		}
	}
	_fullscreen(e){
		var apis = ["requestFullScreen","mozRequestFullScreen","webkitRequestFullscreen","msRequestFullscreen"];
		for(var ii=0; ii<apis.length; ii++){
			if(this.$video[apis[ii]]) return this.$video[apis[ii]]();
		}
	}
	_volume( val ){
		if( val <= 0) val = 0;
		this.$video.volume = val;
		var state = {
			volume: val,
			isMuted: val<= 0.05? true: false, 
		};
		this.setState(state);
	}
	$setWraperDimension( $video ){
		if( this.props.width ) return;
		dd("should set setWraperDimension");
		if( !this.props.width ){
			this.$wraper.style.width = ( $video.videoWidth || $video.clientWidth) +"px"
			this.$wraper.style.height = ($video.videoHeight || $video.clientHeight) +"px"
		}
	}
	// generate subtitle tracks: <track >
	$getSubtitleTracks( subtitles ){
		return []
	}
	$getSource( sources ){
		var $sources = [];
		for(var ii =0 ;ii<sources.length; ii++){
			let ss = sources[ii]
			let extName = path.extname( ss ).substr(1);
			$sources.push(
				<source src={ss} type={"video/"+extName} key={ii}/>
			)
		}
		return $sources;
	}
	render(){
		const { subtitles, loop, autoPlay, poster,preload, sources, controlPanelStyle, autoHideControls } = this.props
		//html5 video options
		var options = { loop, autoPlay, poster,preload };
		var wraperStyle = {};
		if( this.props.width ){
			options.width = this.props.width 
			options.height= this.props.height
			wraperStyle.width = this.props.width+"px";
			wraperStyle.height = this.props.height+"px";
		}

		var controlsClass = `r5-controls r5-controls--${controlPanelStyle} ${autoHideControls?"r5-auto-hide":""}`
		

		return (
			<div className="r5-wraper" style={wraperStyle}>
				<video ref="video" {...options} >
					{  this.$getSource( sources) }
					{ subtitles && subtitles.length>0? this.$getSubtitleTracks(subtitles) : "" }
				</video>
				<div className="r5-overlay" onClick={this._togglePlay}>
					{!this.$video? this.icons.playCircle:""}
				</div>
				<div className="r5-content">{this.props.children}</div>
				<div className={controlsClass}>
					<div className="r5-seekbar-wraper" ref="seekbarWraper">
						<div className="r5-seekbar-loaded" ref="seekbar" style={{width:this.state.loadedProgress+"%"}}></div>
						<div className="r5-seekbar" ref="loadedbar" style={{width:this.state.seekProgress+"%"}}></div>
						<input type="range" min="0.0" max="100.0" step="0.5" 
							value={this.state.seekProgress}
							onChange={e=>this._setTime(e.target.value)} />
					</div>
					<div className="r5-panel">
						<button className="r5-play" onClick={this._togglePlay}>
							{ this.state.isPlaying ? this.icons.pause : this.icons.play }
						</button>
						<div className="r5-volume">
							<button>{ this.state.isMuted? this.icons.mute : (this.state.volume>0.7?this.icons.volumeUp: this.icons.volumeDown) }</button>
							<div className="r5-volume-inner" style={{width:"80px"}}>
								<div className="r5-volume-bar" style={{width: (this.state.volume*100)+"%"}}></div>
								<input type="range" min="0" max="1" step="0.05" value={this.state.volume} onChange={e=>this._volume(e.target.value)}/>
							</div>
						</div>
						<span	className="r5-timecode">{this.state.currentTime+" / "+this.state.duration}</span>
						<div className="r5-pull-right">
							<button className="r5-subtitle">{this.icons.subtitles}</button>
							<button className="r5-fullscreen" onClick={this._fullscreen}>{this.icons.fullscreen}</button>
						</div>
					</div>
				</div>
			</div>
		)	
	}
	componentWillMount(){
		this.state = {
			isPlaying: this.props.autoPlay?true: false,
			isMuted: false,
			currentTime: "00:00", 
			duration: "00:00",
			loadedProgress: 0, 
			seekProgress: 0,// how much has played
			volume: this.props.volume,
		}
		var fill = this.props.controlPanelStyle == "overlay"?"#ffffff":"#3FBA97";
		this.icons = {}
		this.icons.play = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		    <path d="M8 5v14l11-7z" fill={fill}/>
		    <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.pause = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			 	<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill={fill}/>
			  <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.playCircle = (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
		    <path d="M0 0h24v24H0z" fill="none"/>
		    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill={fill}/>
			</svg>
		)
		this.icons.volumeUp=(
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill={fill}/>
			  <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.volumeDown=(
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" fill={fill}/>
			 	<path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.mute = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M7 9v6h4l5 5V4l-5 5H7z" fill={fill}/>
			  <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.subtitles = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M0 0h24v24H0z" fill="none"/>
			    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" fill={fill}/>
			</svg>
		)
		this.icons.fullscreen = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M0 0h24v24H0z" fill="none"/>
			  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill={fill}/>
			</svg>
		)
	}
	componentWillUnmount(){
		if(this.seekbarUpdateTimer) clearInterval( this.seekbarUpdateTimer );
	}
}

Video.propTypes = {
	// callbacks
	metaDataLoaded: 					React.PropTypes.func,// video's meta data loaded, return video element
	
	// properties
	sources: 						React.PropTypes.array,
	subtitles: 					React.PropTypes.array, // [{src:"foo.vtt", label:"English",srclan:"en" }]
	autoPlay: 					React.PropTypes.bool,
	controls: 					React.PropTypes.bool,
	autoHideControls: 	React.PropTypes.bool,
	controlPanelStyle: 	React.PropTypes.oneOf(["overlay","fixed"]), // overlay, fixed
	preload: 						React.PropTypes.oneOf(["auto","none","metadata"]), 
	loop: 							React.PropTypes.bool,
	mute: 							React.PropTypes.bool,
	poster: 						React.PropTypes.string,
	width: 							React.PropTypes.string,
	height: 						React.PropTypes.string,
	volume: 						React.PropTypes.number,

	// overlayStyle: 			React.PropTypes.object,
}

Video.defaultProps = {
	autoPlay:  			false,
	loop: 					false,
	controls: 			true,
	autoHideControls:false,
	volume: 				1.0,
	mute: 					false,
	controlPanelStyle: "overlay",
	preload: 				"auto",
}

export default Video

