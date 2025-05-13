import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        senderId: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['like', 'comment', 'follow'],
            required: true
        },
        postId: {
            type: String,
            required: false
        },
        read: {
            type: Boolean,
            default: false
        },
        desc: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const NotificationModel = mongoose.model("Notifications", notificationSchema);
export default NotificationModel;