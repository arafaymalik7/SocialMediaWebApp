import express from 'express';
import { 
    createNotification, 
    getUserNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification 
} from '../Controllers/NotificationController.js';

const router = express.Router();

router.post('/', createNotification);
router.get('/:userId', getUserNotifications);
router.put('/read/:id', markAsRead);
router.put('/readAll/:userId', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;