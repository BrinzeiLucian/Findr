//requires
const express = require('express');
const app = express();
const path = require('path');
//const { v4: uuid } = require('uuid');
//uuid();
//const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Findr = require('../models/dbFindrModel');
let axios = require('axios');
let LoremIpsum = require("lorem-ipsum").LoremIpsum;

//mongoose
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/FindrDB');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
};

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
    console.log('Mongo connected...');
});

//lorem function
let lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 4,
      min: 2
    },
    wordsPerSentence: {
      max: 12,
      min: 4
    }
  });

//const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Findr.deleteMany({});
    for (let i = 0; i < 20; i++) {
        
        const placeSeed = Math.floor(Math.random() * places.length);
        const descriptorsSeed = Math.floor(Math.random() * descriptors.length);
        const citySeed = Math.floor(Math.random() * cities.length);
        
      //let priceRatingRandomizer = Math.floor(Math.random() * 5) + 1;

        const db = new Findr({
            author: '63b4411e19be3385824ce127',
            title: `${descriptors[descriptorsSeed]} ${places[placeSeed]}`,
            location: `${cities[citySeed].city}, ${cities[citySeed].state}`,
            description: lorem.generateParagraphs(2),
            image: await seedImg(),
            phone: '0777 777 777',
            website: 'https://www.SeedTestData.com/',
            email: 'seedtestdata@mail.com'
        })
        await db.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
    console.log('Mongo database closed...');
});

// call unsplash and return small image
    async function seedImg() {
        try {
          const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
              client_id: 'Izj2Y1eT1fRXqdepNOq0-54fDl_hDNheTOHJihs_aRI',
              collections: 1114848,
            },
          })
          return resp.data.urls.regular;
        } catch (err) {
          console.error(err)
        }
    };