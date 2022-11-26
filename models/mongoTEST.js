//require
let mongoose = require('mongoose');
let { Schema } = mongoose;

//mongoose
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/mongoTEST');
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
};

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function(){
    console.log('Mongo connected...');
});

//schema
const userSchema = new Schema({
    first: {
        type: String
    },
    last:{
        type: String
    },
    address: [
        {
            city:{
                type: String
            },
            street:{
                type: String
            },
            country:{
                type: String
            }
        }
    ]
});

const User = mongoose.model('User', userSchema);

const makeNewUser = async () => {
    const New = new User({
        first: 'Adam',
        last: 'Smith',
    })
    New.address.push({
        city:'random city',
        street: 'main street',
        country: 'UK'
    })
    const res = await New.save();
    console.log(res);
}

const addAddress = async (id) => {
    const user = await User.findById(id);
    user.address.push(
        {
        city:'another city',
        street: 'second street',
        country: 'USA'
        }
    )
    const res = await user.save();
    console.log(res);
}

//makeNewUser();
//addAddress('6380c2d472d52566c77036d5');

let productSchema = new Schema({
    name:{
        tyoe: String  
    },
    price:{
        type: Number
    },
    quantity:{
        type: Number
    },
    onSeason:{
        type: String,
        enum: ['Spring', 'Summer', 'Fall', 'Winter']
    },
    inStock:{
        type: Boolean
    }
});

let Product = mongoose.model('Product', productSchema);

Product.insertMany([
    {
        name:'Apples',
        price: 10,
        quantity: 500,
        onSeason: 'Summer',
        inStock: true  
    },
    {
        name:'Oranges',
        price: 15,
        quantity: 300,
        onSeason: 'Spring',
        inStock: false  
    },
    {
        name:'Bananas',
        price: 25,
        quantity: 1000,
        onSeason: 'Fall',
        inStock: true  
    },
]);

let productSourceSchema = new Schema({
    companyName:{
        type: String
    },
    location:{
        type: String
    },
    produce:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

let Source = mongoose.model('Source', productSourceSchema);

let makeSource = async () => {
    let Algro = new Source({companyName: 'Alegro', location: 'Main Wines'})
    let product = await Product.findOne( { name: 'Apples' } );
    Algro.produce.push(product);
    Algro.save();
    console.log(Algro);    
};

//makeSource();