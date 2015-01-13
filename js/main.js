
var creating = false;
var slider = null;
var yid;
var controlsShown = false;
var duration;
var dur = 5.0;

// -------------------------
// Functions
// -------------------------

// Enable the create gif button and the url input box
function enableInput() {
		$(".urlbox").removeAttr("disabled");
		$(".createbutton").removeAttr("disabled");
		$(".createbutton").html("LOAD VIDEO");
}

// Disable the create gif button and the url input box
function disableInput() {
		$(".urlbox").attr("disabled",true);
		$(".createbutton").attr("disabled",true);
		$(".createbutton").html("LOADING...");
}

// Show and error message
// inputs:
//    msg - the message to show for the error
function showError(msg) {
		bootbox.alert(msg);
		enableInput();
}

// Update the html in an element
// inputs:
//    elmId - the id for the element to be updated
//    param - the parameter to be updated
//    value - the html value to insert into the element
function updateHTML(elmId, param, value) {
  if (document.getElementById(elmId)) {
    document.getElementById(elmId).param = value;
  }
}

// Fetch the GiantBomb video
// inputs: 
//    vid_id  - the video_id to the video
//    vid_loc - the website to get the video from (to allow GIFs to be created from youtube, twitch, etc. in the future)
function getVideo(vid_id, vid_loc) {
  // send request to server
  $.ajax({
    url: "/api/gb_videos/" + vid_id,
    dataType: "json",
    // if successful, load the video player with the video and show configuration options
    success : function(data) {
      var json_vid_id = data.results.id;
      var json_vid_length = data.results.length_seconds;
      var json_vid_url = data.results.low_url;
      var json_vid_img = data.results.image.medium_url;

      var curr_video = document.getElementById("video");
	  curr_video.addEventListener("timeupdate", "video_time_update", false);
      
      // update the current time display
	  curr_video.addEventListener("timeupdate", function () {
        document.getElementById("gifStarttime").value = this.currentTime;

      }, false);

      curr_video.src = json_vid_url;
      curr_video.poster = json_vid_img;
      document.getElementById("video_container").style.display = 'block';
      document.getElementById("gif_config_container").style.display = 'block';
      enableInput();
    },
    // if there is an error, show error message
    error: function(data) {
      if (data.responseText == "PREMIUM_VIDEO") {
      	showError("This is a premium video. Please select another video.");
      } else {
      //var data_string = JSON.stringify(data,'','\t');
        showError("There was an unknown error getting the video from GiantBomb!");
      }
    }
  });
}

// -------------------------
// DOM elements
// -------------------------

// Parse the URL string when the create gif button is clicked
$(".createbutton").click(function(ev) {
	ev.stopPropagation();
	disableInput();

	// Test the URL string
	var url = $(".urlbox").val();
	var re = /www\.giantbomb\.com\/videos\/.+\/(.+)\//i; 
    var res;
 
    res = re.exec(url);
    // check to see if the url is valid
    if (res) {
      // get the video from GiantBomb API
      getVideo(res[1]);
    } else {
      showError("Invalid video url!");
      document.getElementById("video_container").style.display = 'none';
      document.getElementById("gif_config_container").style.display = 'none';
    }
});

//-----------------------
// CREATE GIF
//-----------------------
(function(window, document) {
  var createGIFButton = document.querySelector('#create-gif'),
    gifSource = document.getElementById("video"),
    gifType = document.querySelector('#GIFType'),
    interval = document.querySelector("#interval"),
    numFrames = document.querySelector("#numFrames"),
    gifHeight = document.querySelector("#gifHeight"),
    gifWidth = document.querySelector("#gifWidth"),
    progressBar = document.querySelector("progress"),
    text = document.querySelector('#gifText'),
    fontWeight = document.querySelector('#fontWeight'),
    fontSize = document.querySelector('#fontSize'),
    fontFamily = document.querySelector('#fontFamily'),
    fontColor = document.querySelector('#fontColor'),
    textAlign = document.querySelector('#textAlign'),
    textBaseline = document.querySelector('#textBaseline'),
    sampleInterval = document.querySelector('#sampleInterval'),
    numWorkers = document.querySelector('#numWorkers'),
    gifshotImagePreview = document.querySelector('.gifshot-image-preview-section'),
    placeholderDiv = document.querySelector('.placeholder-div'),
    placeholderDivDimensions = document.querySelector('.placeholder-div-dimensions'),
    gifshotCode = document.querySelector('.gifshot-code'),
    gifshotCodeTemplate = document.querySelector('.gifshot-code-template'),
    getSelectedOptions = function() {
      
      //showError("gifSource = " + gifSource.src);
      return {
        'gifWidth': +gifWidth.value,
        'gifHeight': +gifHeight.value,
        'images': false,
        //'video': ['gifSource.src'],
        //'video':  ['gif_vid.mp4'],
        'video': ['example.mp4'],
        'interval': +interval.value,
        'numFrames': +numFrames.value,
        'text': text.value,
        'fontWeight': fontWeight.value,
        'fontSize': fontSize.value + 'px',
        'fontFamily': fontFamily.value,
        'fontColor': fontColor.value,
        'textAlign': textAlign.value,
        'textBaseline': textBaseline.value,
        'sampleInterval': +sampleInterval.value,
        'numWorkers': 2
      }
    },
    passedOptions,
    bindEvents = function() {
      createGIFButton.addEventListener('click', function(e) {
        passedOptions = _.merge(_.clone(getSelectedOptions()), {
          'progressCallback': function(captureProgress) {
            gifshotImagePreview.innerHTML = '';
            placeholderDiv.classList.add('hidden');
            progressBar.classList.remove('hidden');
            progressBar.value = captureProgress;
          }
        });

        var method = gifType.value === 'snapshot' ? 'takeSnapShot' : 'createGIF';

        gifshot[method](passedOptions, function(obj) {
          if (!obj.error) {
            var image = obj.image,
            
            animatedImage = document.createElement('img');
            animatedImage.src = image;

            progressBar.classList.add('hidden');
            progressBar.value = 0;

            placeholderDiv.classList.add('hidden');
            gifshotImagePreview.innerHTML = '';
            gifshotImagePreview.appendChild(animatedImage);
          } else {
            console.log('obj.error', obj.error);
            console.log('obj.errorCode', obj.errorCode);
            console.log('obj.errorMsg', obj.errorMsg);
          }
        });
      }, false);
    };

  bindEvents();
}(window, document));
