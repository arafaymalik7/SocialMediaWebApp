import NotificationModel from '../Models/NotificationModel.js';

// Create notification
export const createNotification = async (req, res) => {
    const newNotification = new NotificationModel(req.body);

    try {
        await newNotification.save();
        res.status(200).json(newNotification);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Get user notifications
export const getUserNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json(error);
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        await NotificationModel.findByIdAndUpdate(id, { read: true });
        res.status(200).json("Notification marked as read");
    } catch (error) {
        res.status(500).json(error);
    }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
    const { userId } = req.params;

    try {
        await NotificationModel.updateMany({ userId, read: false },
                   { read: true });
       res.status(200).json("All notifications marked as read");
   } catch (error) {
       res.status(500).json(error);
   }
};

// Delete notification
export const deleteNotification = async (req, res) => {
   const { id } = req.params;

   try {
       await NotificationModel.findByIdAndDelete(id);
       res.status(200).json("Notification deleted");
   } catch (error) {
       res.status(500).json(error);
   }
};