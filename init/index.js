const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../Models/listing.js');

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(res=>{
    console.log("Connected to DB");
}).catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

async function initDB(){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner:"653e1f0ce9ed0d11855a8444"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was saved");
}

initDB();

// Listing.findByIdAndUpdate("6513190bd69a878523c43885",{location:"Bhiali",country:"Bharat"},{new:true}).then(res =>{
//     console.log(res);
// }).catch(err =>{
//     console.log(err);
// })