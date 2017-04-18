[WIP] don't use in production
===========
![preview](snapshot.jpg)
[demo](https://github.com/eisneim/react-html5-video)

## features:
 - simple & easy
 - custom video overlay content( any html content on top of video )

## TODO
 - UI for Fullscreen mode
 - ~~subtitle tracks~~
 - network error notification
 - loading spinner
 - custom menu for mouse right click 
 - register any event listener on parent component
 - playback rate change
 - select defferient resulution
 - use without browserify
 - complete tests

## install
```
npm install --save react-h5-video
```
load in the stylesheet,(in order to make it easier for developers to customize video player's style, css is not written in js)
```html
<link rel="stylesheet" type="text/css" href="node_modules/react-h5-video/lib/react-h5-video.css">
```
basic usage
```javascript
import React from "react";
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
```
## props
```javascript
Video.propTypes = {
	metaDataLoaded: 		React.PropTypes.func,// video's meta data loaded callback
	

	// properties
	sources:		React.PropTypes.array,
	subtitles:		React.PropTypes.array, // [{src:"foo.vtt", label:"English",lang:"en" }]
	autoPlay: 		React.PropTypes.bool,
	controls:		React.PropTypes.bool,
	autoHideControls:		React.PropTypes.bool,
	controlPanelStyle:		React.PropTypes.oneOf(["overlay","fixed"]),
	preload:		React.PropTypes.oneOf(["auto","none","metadata"]), 
	loop:		React.PropTypes.bool,
	mute:		React.PropTypes.bool,
	poster:		React.PropTypes.string,
	width:		React.PropTypes.string,
	height:		React.PropTypes.string,
	volume:		React.PropTypes.number,
	seekDisabled: React.PropTypes.bool,
}
// here are all some default props
Video.defaultProps = {
	autoPlay:		false,
	loop:		false,
	controls:		true,
	autoHideControls:		true,
	volume:		1.0,
	mute:		false,
	controlPanelStyle:		"overlay",
	preload:		"auto",
	seekDisabled: false,
}

```
### video meta data loaded callback
onece the meta data is loaded, you can get the info of this video(width,height,duration...etc), then you can use the returnd api to perform basic actions

The returned api has these properties:
<table><thead>
<tr>
<th align="left">Property</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead><tbody>
<tr>
<td align="left">$video</td>
<td align="left">DOM Node</td>
<td align="left">the HTML5 video DOM node, you can attatch event listeners to $video</td>
</tr>
<tr>
<td align="left">fullscreen</td>
<td align="left">function</td>
<td align="left">make video enter fullscreen mode</td>
</tr>
<tr>
<td align="left">setTime</td>
<td align="left">function</td>
<td align="left">setTime(number) to change seekbar time</td>
</tr>
<tr>
<td align="left">togglePlay</td>
<td align="left">function</td>
<td align="left">play or pause video</td>
</tr>
<tr>
<td align="left">volume</td>
<td align="left">function</td>
<td align="left">change volumn between 0 to 1.0</td>
</tr>
<tr>
	<td>align="left">registerProgressEventListener</td>
	<td>align="left">function</td>
	<td>align="left">You can call this function get updates on how much the video has played.</td>
</tr>
</tbody></table>

```javascript
class App extends React.Component{
	loaded(api){
		this.videoApi = api;
		// console.log( api.$video.duration ) 
		// to toggle play state, just call this.videoApi.togglePlay()
	}
	render(){
		return(
			<Video sources={sources}  metaDataLoaded={this.loaded}/>
		)
	}
}
```

#### registerProgressEventListener

```javascript
class App extends React.Component{
	loaded(api){
		api.registerProgressEventListener((percent) => {
			console.log("Video has now played ", percent, " percent")
		})
	}
	render(){
		return(
			<Video sources={sources}  metaDataLoaded={this.loaded}/>
		)
	}
}
```

