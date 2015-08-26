import React from "react"
import path from "path";

var videoEvents = ["play","pause","playing","abort","progress","ratechange","canplay","canplaythrough","durationchange","emptied","ended","loadeddata","loadedmetadata","loadstart","seeked","seeking","stalled","suspend","timeupdate","volumechange","waiting","error","encrypted","mozaudioavailable","interruptbegin","interruptend"];

class Video extends React.Component {
	constructor(){
		super()
	}
	componentDidMount(){
		/**
		 * register some video event listener here;
		 */
		this.$node = React.findDOMNode(this);
		var $video = this.$video = React.findDOMNode( this.refs.video )
		console.log(this.$video)

	}
	_metaDataLoaded(e){
		if(this.props.metaDataLoaded && typeof this.props.metaDataLoaded == "function" ){
			this.props.metaDataLoaded( this.$video );
		}
	}
	_togglePlay(e){

	}
	getSubtitleTracks( subtitles ){
		return []
	}
	getSource( sources ){
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
		console.log("render is called ")
		const { subtitles, loop, autoPlay, poster, sources, controlPanelStyle } = this.props
		//html5 video options
		var options = { loop, autoPlay, poster };
		if( this.props.width ){
			options.width = this.props.width 
			options.height= this.props.height
		}

		var controlsClass = `r5-controls r5-controls--${controlPanelStyle}`

		return (
			<div className="r5-wraper">
				<div className="r5-overlay"></div>
				<video ref="video" {...options} >
					{  this.getSource( sources) }
					{ subtitles && subtitles.length>0? this.getSubtitleTracks(subtitles) : "" }
				</video>
				<div className={controlsClass}>
					<div className="r5-seekbar-wraper">
						<div className="r5-seekbar"></div>
					</div>
					<div>
						<button className="r5-play" onClick={this._togglePlay}>
							{ this.state.isPlaying ? this.icons.pause : this.icons.play }
						</button>
						<div className="r5-volume">
							{ this.state.isMuted? this.icons.mute : this.icons.volume }
						</div>
						<span	className="r5-timecode"></span>
						<div className="r5-pull-right">
							<button className="r5-subtitle">{this.icons.subtitles}</button>
							<button className="r5-fullscreen">{this.icons.fullscreen}</button>
						</div>
					</div>
				</div>
				
				<div className=""></div>
				<div className=""></div>
			</div>
		)	
	}
	componentWillMount(){
		this.state = {
			isPlaying: this.props.autoPlay?true: false,
			isMuted: false,
			loadedProgress: 0, 
			seekProgress: 0,// how much has played
			volume: this.props.volume,
		}

		this.icons = {}
		this.icons.play = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		    <path d="M8 5v14l11-7z"/>
		    <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.pause = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			 	<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
			  <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.playCircle = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
		    <path d="M0 0h24v24H0z" fill="none"/>
		    <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
			</svg>
		)
		this.icons.volume=(
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
			  <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.mute = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
			  <path d="M0 0h24v24H0z" fill="none"/>
			</svg>
		)
		this.icons.subtitles = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			    <path d="M0 0h24v24H0z" fill="none"/>
			    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z"/>
			</svg>
		)
		this.icons.fullscreen = (
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			  <path d="M0 0h24v24H0z" fill="none"/>
			  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
			</svg>
		)
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
	controlPanelStyle: 	React.PropTypes.oneOf(["overlay","fixed"]), // overlay, fixed
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
	volume: 				1.0,
	mute: 					false,
	controlPanelStyle: "overlay",

}

export default Video

