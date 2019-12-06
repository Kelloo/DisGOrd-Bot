const mongoose = require('mongoose');

const FavouriteSchema = mongoose.Schema({
 
  _id:{
    type:String,
    require:true
  },
  songs: {
    type: Array,
    url: {
      type: String,
      require: true
    },
    name:{
      type: String,
      require:true
    }
  },
  panda: String
});

module.exports = mongoose.model('Favourite', FavouriteSchema);
