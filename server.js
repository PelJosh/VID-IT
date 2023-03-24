const express = require("express");
const path = require('path');
const app = express();
const session = require("express-session");
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const controllerPath = path.join(__dirname, "/controller/controller.js");
const controller = require(controllerPath);

const pathToWrite = path.join(__dirname, "./model/usersDB.json")
const pathToRead = path.join(__dirname, "./model/usersDB.json");
const usersDatabase = require(pathToRead)
const meetingIdPath = path.join(__dirname, "./model/meetingid.json")
const meetingIDs = require(meetingIdPath)


app.use(session({
    secret: "SECRET",
    resave: true,
    saveUninitialized: true
}))
app.use(morgan('short'));
const writeToFile = (content) =>{
  try {   
      fs.writeFileSync(pathToWrite, JSON.stringify(content), "utf-8");
      return true;
  } catch (error) {
      console.log(error);
      return false;
  }
}

const getAllUsers = () =>{
  try {   
      const data = fs.readFileSync(pathToRead, "utf-8");
      // console.log('da', data)
      return JSON.parse(data);
  } catch (error) {
      console.log(error);
      return [];
  }
}

const getUserById = (id) =>{
  try {
      const users = getAllUsers();
      const user = users.find(value => value.id == id);
      return JSON.parse(user);
  } catch (error) {
      console.log(error);
      return [];
  }
} 
const getUserByEmail = (email) =>{
  try {
      const users = getAllUsers();
      const user = users.find(value => value.email == email);
      console.log('users: ', user)
      if(!user){
        return []
      }else{
        return user;
      }
      // console.log('user: ', user)
      // return user;
  } catch (error) {
      console.log(error);
      return [];
  }
} 

const generateId = () =>{
  const users = getAllUsers();
  console.log('userss: ', users)
  const idList = users.map(value => value.id);
  if(!idList) return 1;
  return (Math.max(...[idList]) + 1);
}

const userExist = (email) =>{
  const data = getAllUsers();
  // console.log('dataUsers: ', data)
  // console.log('dataUsers Type: ', typeof data)
  // console.log('length: ', data.length)
  if(data.length > 0){
      const isExist = data.find(user => user.email == email);
      if(isExist) return true;
      return false;
  }
  return false;

}


//controller ends



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const pathToController = path.join(__dirname, "./controller/controller.js");
const pathToUsersDB = path.join(__dirname, "./model/usersDB.json");
// const { userExist } = require(pathToController)

app.use(express.json())
app.use(express.urlencoded())
app.set("view engine", "ejs");

//set up socket.io
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});

//set up peer
const { ExpressPeerServer } = require("peer");

const opinions = {
  debug: true,
}

//use peerjs
app.use("/peerjs", ExpressPeerServer(server, opinions));
app.use(express.static("public"));




//logout

app.get('/logout', (req, res)=>{
  console.log('logout1');
    if(req.session.user){
      console.log('logout2')
        req.session.destroy();
        req.session = null;
        res.render("login");
    }else{
      console.log('logout3');
      res.render("login");
    }
})


//form handler

//signup
app.post("/signup", (req, res)=>{
  const { firstName, lastName, email, password } = req.body;
  const userExists = userExist(email);

  if(userExists){
    res.render("signup", {error: "User exists. Please login to access your dashboard"});
  }else{
    bcrypt.hash(password, saltRounds, (err, hash)=>{
      const myId = uuidv4();
      const usersData = {
        id: generateId(),
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash,
        meetingId: myId
      }
      // console.log('usersData: ', usersData)
      usersDatabase.push(usersData)
      writeToFile(usersDatabase);
      req.session.user = usersData;
      meetingIDs.push(myId);
      fs.writeFileSync(meetingIdPath, JSON.stringify(meetingIDs), "utf-8");
      res.render("room", {email: email, firstName, lastName, roomId: myId});
    })
  }

})

app.get('/signup', (req, res)=>{
  if(!req.session.user){
    res.render("signup", {error: "Please create an account"});
  }else{
    const user = req.session.user;
    res.render("room", {email: user.email, firstName: user.firstName, lastName: user.lastName, roomId: user.meetingId});
  }
})

//login

app.post('/login', (req, res)=>{
  console.log(req.body)
  const { email, password } = req.body;
  console.log('email: ',req.body.email)
  console.log('password',req.body.password)
  const accountExists = userExist(email);
  console.log('accountExists: ', accountExists)
  console.log('NOT accountExists: ', !accountExists)
  console.log('req.session.user: ', req.session.user)

  if(req.session.user){
    const user = req.session.user;
    res.render("room", {email: user.email, firstName: user.firstName, lastName: user.lastName, roomId: user.meetingId});
  }else{
    if(!accountExists){
      res.render("login", {error: "Account does not exist"});
    }else{
        //fetch user and compare
      const user = getUserByEmail(email);
      console.log('user: ', user)
        // const myId = uuidv4();
        // meetingIDs.push(myId);
        // console.log('I got here0')
        // console.log('I got here1')
      bcrypt.compare(password, user.password, (err, result)=>{
        console.log('I got here2')
        if(!result) res.render("login", {error: "Invalid email or password"});
        console.log('I got here3');
        req.session.user = user;
        console.log('req.session.user: ', req.session.user)
        res.render("room", {email: user.email, firstName: user.firstName, roomId: user.meetingId})
        console.log('error: ', err)
      })
    }
  
  }
  
  
})

app.get('/login', (req, res)=>{
  console.log('session: ', req.session.user)
  if(!req.session.user){
    console.log('req.session.user: ', req.session.user)
    res.render("login", {error: "Please login your account"});
  }else{
    console.log('req.session.user: ', req.session.user)
    const user = req.session.user;
    res.render("room", {email: user.email, firstName: user.firstName, lastName: user.lastName, roomId: user.meetingId});
  }
})
//form handler


//redirect to link with uuid generated roomId

// app.get("/", (req, res) => {
//   res.redirect(`/${uuidv4()}`);
// });

//things to implement

//redirect to login page
//send all data to view and pick in script.js
app.get("/", (req, res) => {
    res.redirect(`login`);
});
app.get("/room", (req, res) => {
    res.redirect(`login`);
});
app.get("/signup", (req, res) => {
    res.redirect(`signup`);
});

app.get("/joinroom", (req, res) => {
  res.render(`joinroom`);
});


//on click of join room, redirect to room with id
//on login and sign up, take to room and pass id along, no prompt
//on click of join, take to room with prompt
//prompt should be for id not name

//check if there's a link with roomId and handle it
//check am

app.get("/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  if(meetingIDs.includes(roomId)){
    res.render("room2", { roomId: roomId});
  }else{
    res.render("login");
  }
});




//miscellaneous handling

// app.get('/:room/:id', (req, res)=>{
//     console.log('Logout')
//     res.render('login')
// })

//when socket.io connects, run this block of code
io.on("connection", (socket) => {
  //when a room is joined, run the code below
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId); //connecting room members
    //wait for a sec before broadcasting videos
    setTimeout(()=>{
      socket.to(roomId).broadcast.emit("user-connected", userId);
    }, 1000)
    //on message, emit createMessage and send in the message 
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});

server.listen(process.env.PORT || 3030);
