const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: "Title is required"
        },
        body: {
            type: String,
            trim: true,
            require: "Body is required"
        },
        authorId: {
            type: ObjectId,
            required: " AuthorId is required",
            trim: true,
            ref: "Author"

        },
        tags: {
            trim: true,
            type: [String],
        },

        category: {
            type: String,
            trim: true,
            required: "Category is required"
        },
        subcategory:
        {
            type: [String]

        },
        isPublished: {
            type: Boolean,
            default: false,
        },

        publishedAt: {
            type: Date,
            default: Date.now()
        },

        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: Date.now()
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("blogDataBase", blogSchema);