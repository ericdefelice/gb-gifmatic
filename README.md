# GiantBomb Gifmatic Tool

A tool to create gif's from GiantBomb videos.

The frontend page takes a Giantbomb.com url, sends a call to the backend api to then grab the raw video file from the giantbomb API.  Once this process is complete, the configuration options are shown to create the gif.

# Demo
 


# Setup

 1. git clone this repo: git clone https://github.com/ericdefelice/gb-gifmatic.git
 2. Install Node.js
 3. Install all local dependencies: npm install
 4. Start up the included node.js server: node server.js
 5. Go to localhost:8001 to try it out

 Note - You need a valid GiantBomb API key to be able to retrieve videos from their API.

# Credits

  GIF creation is done using gifshot: https://github.com/yahoo/gifshot
  
  GiantBomb videos are retrieved using their API: http://www.giantbomb.com/api/
 
# License

 MIT license - Feel free to use this as you wish.

