// // /**
// //  * @param {string} s
// //  * @return {string}
// //  */
// //  var longestPalindrome = function(s) {
// //     console.log('s: ', s)
// //     console.log('s length: ', s.length)
// //     let arr = [];
// //     if(s.length == 1){
// //         return s;
// //     }else if(s.length < 3 && s[0] !== s[1]){
// //         return s[0];
// //     }else if(s.length < 3 && s[0] == s[1]){
// //         return s;
// //     }else{

// //     let k = 0;
// //     while(k < s.length){
// //         let z = 0;
// //         console.log('k: ', k)
// //         for(i = k; i < s.length - 1; i++){
            
// //         let subString = s.split('').splice(k, z+2);
// //         console.log('subString: ', subString)
// //         if(subString.join('') === subString.join('').split('').reverse().join('')){
// //             arr.push(subString);
// //         }
// //         z++;
// //     }
// //     k++;
// //     }

// //     let result = 0;
// //     let resultString;
// //     console.log('arr: ', arr)
// //     if(arr.length == 0){
// //         return s[0];
// //     }
// //     arr.forEach(value => {
// //         if(value.length > result){
// //             result = value.length
// //             resultString = value;
// //         }
// //     })
// //     console.log('resultString1', resultString)
// //     console.log('resultString2', resultString.join(""))
// //     return resultString.join('');
// //     }
    
// // };

// // let arr = [2,4,5,7,8];
// // console.log(Math.max(...arr))

// // let string = "gohome";
// // let subString = string.substring(0,2);
// // console.log(subString)
// // console.log(subString.split('').reverse().join(''))


// /**
//  * @param {string} s
//  * @return {string}
//  */
//  var longestPalindrome = function(s) {
//     // console.log('s: ', s)
//     console.log('s length: ', s.length)
//     let arr = [];
//     let num = [];
//     if(s.length == 1){
//         return s;
//     }else if(s.length < 3 && s[0] !== s[1]){
//         return s[0];
//     }else if(s.length < 3 && s[0] == s[1]){
//         return s;
//     }else{

//     let k = 0;
//     let z = 0;
//     while(k < s.length){
//          let p = z;
//         // console.log('k: ', k)
//         loop(k,s,p,arr,num);
//     z++;
//     k++;
//     }

//     let result = 0;
//     let resultString;
//     // console.log('arr: ', arr)
//     if(arr.length == 0){
//         return s[0];
//     }
//     // arr.forEach(value => {
//     //     if(value.length > result){
//     //         result = value.length
//     //         resultString = value;
//     //     }
//     // })
//     let max = Math.max(...num);
//     // console.log("max: ", max)
//     // console.log('resultString1', resultString)
//     // console.log('resultString2', resultString.join(""))
//     return arr[num.indexOf(max)];

//     function loop(k,s,p,arr,num){
//            for(i = k; i < s.length; i++){
            
//         let subString = s.substring(k, p+2);//problem
//         // console.log('subString: ', subString)
//         if(subString === subString.split('').reverse().join('')){
//             arr.push(subString);
//             num.push(subString.length);
//         }
//         p++;
//     }
//     }
//     }
    
// };

// let string = "anugnxshgonmqydttcvmtsoaprxnhpmpovdolbidqiyqubirkvhwppcdyeouvgedccipsvnobrccbndzjdbgxkzdbcjsjjovnhpnbkurxqfupiprpbiwqdnwaqvjbqoaqzkqgdxkfczdkznqxvupdmnyiidqpnbvgjraszbvvztpapxmomnghfaywkzlrupvjpcvascgvstqmvuveiiixjmdofdwyvhgkydrnfuojhzulhobyhtsxmcovwmamjwljioevhafdlpjpmqstguqhrhvsdvinphejfbdvrvabthpyyphyqharjvzriosrdnwmaxtgriivdqlmugtagvsoylqfwhjpmjxcysfujdvcqovxabjdbvyvembfpahvyoybdhweikcgnzrdqlzusgoobysfmlzifwjzlazuepimhbgkrfimmemhayxeqxynewcnynmgyjcwrpqnayvxoebgyjusppfpsfeonfwnbsdonucaipoafavmlrrlplnnbsaghbawooabsjndqnvruuwvllpvvhuepmqtprgktnwxmflmmbifbbsfthbeafseqrgwnwjxkkcqgbucwusjdipxuekanzwimuizqynaxrvicyzjhulqjshtsqswehnozehmbsdmacciflcgsrlyhjukpvosptmsjfteoimtewkrivdllqiotvtrubgkfcacvgqzxjmhmmqlikrtfrurltgtcreafcgisjpvasiwmhcofqkcteudgjoqqmtucnwcocsoiqtfuoazxdayricnmwcg"
// console.log(longestPalindrome(string))

let str = 'abc';
let c = "";
c += str[4] || "";
console.log(c)