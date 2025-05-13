import express from 'express';
import { createPost, deletePost, getPost, like_dislike_Post, timeline, updatePost } from '../Controllers/PostController.js';
import { createComment, getComments, deleteComment } from '../Controllers/PostController.js';

const router = express.Router();

router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.put('/:id/like_dislike', like_dislike_Post);
router.get('/:id/timeline', timeline);
router.post('/:id/comment', createComment);
router.get('/:id/comments', getComments);
router.delete('/comment/:id', deleteComment);

export default router;