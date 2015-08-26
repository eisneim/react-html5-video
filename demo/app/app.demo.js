import React from "react/addons";
import Video from "../../src/Video.js";

class App extends React.Component {
	render(){
		var sources = [
			"./video/video.mp4","./video/video.webm","./video/video.ogv"
		]

		return (
			<div className="container">
				<header>
					<h3>React-html5-video</h3>
					<Video sources={sources} poster="./video/poster.png" />
				</header>
			</div>
		)
	}
}


React.render( <App />, document.body );


