var api_url = 'https://image-search-the-goog.herokuapp.com';

function Burnsify(transcript, imageID) {
	var lines = transcript.lines;
	var lineIndex = 0;
	var currentLine = lines[lineIndex];

	var transcriptTimestamps = transcript.lines.map(function(line) {
		return line.start_time;
	});

	var audioElt = document.getElementById('audio-elt');
	audioElt.addEventListener('timeupdate', checkTranscript, false);

	function checkTranscript(e) {
		var currentMillis = audioElt.currentTime * 1000;

		// if within currentLine, return
		if (currentMillis < currentLine.end_time && currentMillis > currentLine.start_time) {
			return;
		} else {
			var newLine = 0;

			lines.forEach(function(line, i) {
				if (currentMillis > line.start_time) {
					newLine = i;
				}
			});

			if (newLine === lineIndex) return;
			if (newLine >= lines.length-1) return;

			lineIndex = newLine;
			currentLine = lines[lineIndex];
			updateCaption(currentLine);
			updateImage(currentLine.noun_phrase);

			// if (currentMillis > currentLine.end_time) {
			// 	if (lineIndex < lines.length) {
			// 		lineIndex++;
			// 		currentLine = lines[lineIndex];

			// 		updateCaption(currentLine);

			// 		updateImage(currentLine.noun_phrase);
			// 	} else {
			// 		console.log('done playing');
			// 		lineIndex = 0;
			// 	}
			// }
		}
	}

	function updateImage(searchTerm) {

		$.get({
			url: api_url + '/api/images?q=' + searchTerm[0],
			crossDomain: true,
			success: function(data) {
				console.log(data);
				transitionImage(data);
			},
			error: function(err) {
				console.log(err);
			}
		});
	}

	function updateCaption(line) {
		$('.caption').text(line.best_text);
	}

	function startPlaying() {
		updateImage(currentLine.noun_phrase);
		updateCaption(currentLine);

		audioElt.play();
	}

	function transitionImage(data) {
		var animDuration = 1000;

		// pick random image
		var which = Math.floor(Math.random()*6);
		var imgUrl = data[which].url;

		var prevImage = imageID + '-' + ( (parseInt(lineIndex) - 1) % 2);
		var nextImage = imageID + '-' + (lineIndex % 2);

		// set src of next image and fade in / out
		$(nextImage).attr('src', imgUrl).fadeIn(animDuration);
		$(prevImage).fadeOut(animDuration);

		window.setTimeout(calcAnimation, animDuration);
	}

	startPlaying();
}


// CSS animation for ken burns effect
// via https://codepen.io/dudleystorey/pen/kaBiL

function randomizer(min,max) {
	randomresult = Math.random() * (max - min) + min;
	return randomresult; 
}


function calcAnimation(){
	var maxscale = 1.4;
	var minscale = 1.1;
	var minMov = 5;
	var maxMov = 10;
	var scalar = randomizer(minscale,maxscale).toFixed(2);
	var moveX = randomizer(minMov,maxMov).toFixed(2);
	moveX = Math.random() < 0.5 ? -Math.abs(moveX) : Math.abs(moveX);

	var moveY = randomizer(minMov,maxMov).toFixed(2);
	moveY = Math.random() < 0.5 ? -Math.abs(moveY) : Math.abs(moveY);

	var prefix = "";
	if (CSSRule.WEBKIT_KEYFRAMES_RULE) { prefix = "-webkit-"; }
	else if (CSSRule.MOZ_KEYFRAMES_RULE) { prefix = "-moz-"; }

	// remove sheet if it exists
	$('#animation').remove();

	var sheet = document.createElement('style');
	sheet.id="animation";
	document.head.appendChild(sheet);
	var anim = "@"+prefix+"keyframes burnseffect { 10% { " + prefix + "transform: scale(1); } 90% { " + prefix + "transform: scale(" + scalar +" ) translate(" + moveX +"%," +  moveY + "%); } 100% { " + prefix + "transform: scale(" + scalar + ") translate(" + moveX +"%," +  moveY +"%); } }";
	sheet.appendChild(document.createTextNode(anim));
	document.head.appendChild(sheet);
	monae = document.querySelectorAll(".slideshow img");
	monae[0].style.webkitAnimationName = 'burnseffect';
	monae[0].style.mozAnimationName = 'burnseffect';
	monae[0].style.animationName = 'burnseffect';
	monae[1].style.webkitAnimationName = 'burnseffect';
	monae[1].style.mozAnimationName = 'burnseffect';
	monae[1].style.animationName = 'burnseffect';
}

calcAnimation();