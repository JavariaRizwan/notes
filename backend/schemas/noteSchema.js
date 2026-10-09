const mongoose = require("mongoose");

const notes = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    category: {
  type: mongoose.Schema.Types.ObjectId,
//  default: null,
  ref:'Category'
},
    isPinned: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
},
{ timestamps: true }
);

module.exports = mongoose.model('Note', notes);