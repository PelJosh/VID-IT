const socket = io("/"); //using socket.io
const videoGrid = document.getElementById("video-grid"); //target element with id
const myVideo = document.createElement("video"); //create video element
const showChat = document.querySelector("#showChat"); //target element with id
const backBtn = document.querySelector(".header__back"); //target element with class
myVideo.muted = true; //mutes the video element

//add event listener for style

backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

//add event listener for style

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});

//receives the user's name

//things to implement
//change the user value here and set to value from the backend
//change the id

//set up peerjs for frontend/client

var peer = new Peer({
  host: '127.0.0.1',
  port: 3030,
  path: '/peerjs',
  config: {
    'iceServers': [
      { url: 'stun:stun01.sipphone.com' },
      { url: 'stun:stun.ekiga.net' },
      { url: 'stun:stunserver.org' },
      { url: 'stun:stun.softjoys.com' },
      { url: 'stun:stun.voiparound.com' },
      { url: 'stun:stun.voipbuster.com' },
      { url: 'stun:stun.voipstunt.com' },
      { url: 'stun:stun.voxgratia.org' },
      { url: 'stun:stun.xten.com' },
      {
        url: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      },
      {
        url: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808'
      }
    ]
  },

  debug: 3
});

//initialise a variable that takes in the stream from the client's end
let myVideoStream;

//start of navigator media devices

//handles video and audio input

navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

//peer listens for a call and answers the call
//peer works with the stream taken

    peer.on("call", (call) => { //listens for a call
      console.log('someone call me');
      call.answer(stream); //answers the call
      const video = document.createElement("video"); //creates a new video block
      call.on("stream", (userVideoStream) => { //peer listens for a stream event
        //addVideoStream takes in the video block and the video stream
        //sends in the video to the block
        //listens for a loadmetadata event 
        //and plays and append the video to the page
        addVideoStream(video, userVideoStream);
      });
    });

    //listens for a user-connected event
    //runs the block of code when a user connects
    socket.on("user-connected", (userId) => {
      //connectToNewUser takes in the user's id and the video stream
      //calls the user using peer.js and sends the video stream along
      //creates a video element
      //listens for a stream event and calls addVideoStrem function

      //addVideoStream takes in the video block and the video stream
      //sends in the video to the block
      //listens for a loadmetadata event 
      // plays and append the video to the page
      connectToNewUser(userId, stream);
    });
  });

  //end of navigator media devices



//connectToNewUser takes in the user's id and the video stream
//calls the user using peer.js and sends the video stream along
//creates a video element
//listens for a stream event and calls addVideoStrem function

//addVideoStream takes in the video block and the video stream
//sends in the video to the block
//listens for a loadmetadata event 
// plays and append the video to the page

const connectToNewUser = (userId, stream) => {
  console.log('I call someone' + userId);
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

//peer listens for an open event and emits join-room
//on emitting join-room, it sends the roomId, the id passed and the user

peer.on("open", (id) => {
  console.log('my id is' + id);
  socket.emit("join-room", ROOM_ID, id, user);
});


//addVideoStream takes in the video block and the video stream
//sends in the video to the block
//listens for a loadmetadata event 
// plays and append the video to the page

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
    videoGrid.append(video);
  });
};

//selecting some elements on the page

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

//element send listens for a click event
//if there's a message, it emits message
//and sends the message

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

//element text listens for a keydown event
//if the key is enter key and there's a message
//it emits message and sends the message along

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});


//creates some blocks

const inviteButton = document.querySelector("#inviteButton");
// const joinButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");

//toggles the sound on click event

muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

//toggles video on click event

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

//makes the complete link available for users

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy the meeting id",
    ROOM_ID
  );
});

//listens for a createMessage event 
//and sends the message to the chat box

socket.on("createMessage", (message, userName) => {
  if(userName == user){
    messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> me </span> </b>
        <span>${message}</span>
    </div>`;
  }else{
    messages.innerHTML =
    messages.innerHTML +
    `<div class="message right">
        <b><i class="far fa-user-circle"></i> <span class=""> ${ userName }</span> </b>
        <span class="">${message}</span>
    </div>`;
  }
});
