import { Schema, models} from "mongoose"

const imageSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
})

export default models('Image', imageSchema)