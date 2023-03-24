// const fs = require('fs')
// const path = require('path');
// const pathToDb = path.join(__dirname, path.sep, "../", "model/usersDB.json");
// const bcrypt = require('bcrypt');


// const writeToFile = (path, content) =>{
//     try {   
//         fs.writeFileSync(path, JSON.stringify(content), "utf-8");
//         return true;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }

// const getAllUsers = (pathToRead) =>{
//     try {   
//         const data = fs.readFileSync(path, "utf-8");
//         return data;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// }

// const getUserById = (id) =>{
//     try {
//         const users = getAllUsers();
//         const user = users.find(value => value.id == id);
//         return user;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// } 
// const getUserByEmail = (email) =>{
//     try {
//         const users = getAllUsers();
//         const user = users.find(value => value.email == email);
//         return user;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// } 

// const generateId = () =>{
//     const users = getAllUsers();
//     const idList = users.map(value => value.id);
//     if(!idList) return 1;
//     return (Math.max(...[idList]) + 1);
// }

// const userExist = (email) =>{
//     const data = getAllUsers();
//     const isExist = data.find(user => user.email == email);

//     if(isExist) return true;
//     return false;
// }

// module.exports = {
//     writeToFile, 
//     getAllUsers,
//     getUserById,
//     getUserByEmail,
//     generateId,
//     userExist
// }