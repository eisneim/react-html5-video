import React from "react/addons";
import Video from "../../src/Video.js";

class App extends React.Component {
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
						<Video sources={sources} poster="./video/poster.png" />
					</div>
				</header>
				<section className="container clearfix">
					<p>here are some api you can call</p>

				</section>
			</div>
		)
	}
}


React.render( <App />, document.body );


