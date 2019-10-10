const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PaginateSchema = new Schema({
    title: {type: String, required: true, max: 100},
    description: {type: String, required: true, max: 100},
    by: {type: String, required: true, max: 100},
    url: { type: String, required: false },
    tags: { type: String, required: false },
    likes: { type: String, required: false }
}, { collection: 'paginate' });

// Export the model
module.exports = mongoose.model('Paginate', PaginateSchema);
