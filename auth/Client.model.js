const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const ClientSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    refUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    },
    street: {
        type: String,
    },
    governorate: {
        type: String,
    },
    delegation: {
        type: String,
    },
    locality: {
        type: String,
    },
    postalcode: {
        type: Number,
    },

    city: {
        type: String,
    },
    country: {
        type: String,
    },
    image: {
        type: String,
    },
})

ClientSchema.pre('save', async function (next) {
    try {
        /* 
    Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
    */
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(this.password, salt)
            this.password = hashedPassword
            console.log(this.isNew)
        }
        next()
    } catch (error) {
        next(error)
    }
})

ClientSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}



const Client = mongoose.model('Client', ClientSchema)
module.exports = Client 
