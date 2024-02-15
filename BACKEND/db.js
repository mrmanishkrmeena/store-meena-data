const mongoose = require('mongoose');



// code for making connection this may help


function getconnection(){
    mongoose.connect("mongodb://127.0.0.1:27017/inotebook").then(
        (data)=>{
            console.log(`connected successfully `)
        }
    ).catch(
        (err)=>{
            console.log(err)

        }
    )
}
module.exports=getconnection