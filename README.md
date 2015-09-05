![preview](snapshot.jpg)
used by zexeo.com

###under development


##features:
 - simple & easy
 - custom video overlay content( any html content on top of video )

##TODO
 - UI for Fullscreen mode
 - ~~subtitle tracks~~
 - network error notification
 - loading spinner
 - custom menu for mouse right click 
 - register any event listener on parent component
 - playback rate change
 - select defferient resulution
 - use without browserify

##install
```
npm install --save react-html5-video
```
load in the stylesheet,(in order to make it easier for developers to customize video player's style, css is not written in js)
```
<link rel="stylesheet" type="text/css" href="node_modules/react-html5-video/lib/react-html5-video.css">
```
basic usage
```
import React from "react";
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
```
##props
```
Video.propTypes = {
	metaDataLoaded: 		React.PropTypes.func,// video's meta data loaded callback
	
	// properties
	sources: 						React.PropTypes.array,
	subtitles: 					React.PropTypes.array, // [{src:"foo.vtt", label:"English",srclan:"en" }]
	autoPlay: 					React.PropTypes.bool,
	controls: 					React.PropTypes.bool,
	autoHideControls: 	React.PropTypes.bool,
	controlPanelStyle: 	React.PropTypes.oneOf(["overlay","fixed"]),
	preload: 						React.PropTypes.oneOf(["auto","none","metadata"]), 
	loop: 							React.PropTypes.bool,
	mute: 							React.PropTypes.bool,
	poster: 						React.PropTypes.string,
	width: 							React.PropTypes.string,
	height: 						React.PropTypes.string,
	volume: 						React.PropTypes.number,
}
Video.defaultProps = {
	autoPlay:  			false,
	loop: 					false,
	controls: 			true,
	autoHideControls:true,
	volume: 				1.0,
	mute: 					false,
	controlPanelStyle: "overlay",
	preload: 				"auto",
}

```