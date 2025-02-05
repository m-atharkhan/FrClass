import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            maxlength: 100
        },
        description: {
            type: String,
            required: true,
            maxlength: 500
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        polls: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Poll"
            }
        ],
        chat: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                message: {
                    type: String,
                    required: true
                },
                image: {
                    type: String,
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Class = mongoose.model("Class", classSchema);

export default Class;
