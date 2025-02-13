import mangoose from 'mongoose';
const categorySchema = new mangoose.Schema({
    name: {
        type: String,
        required: true,
            unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
});
export default mangoose.model('Category', categorySchema);