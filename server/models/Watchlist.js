import mongoose from "mongoose";

const WatchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'Default'
  },
  stocks: [{
    symbol: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    addedOn: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Watchlist', WatchlistSchema);