
export class PostsController {
  constructor(postsService) {
    this.postsService = postsService;
  }
  
  createPost = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      const post = await this.postsService.createPost(req.user.userId, title, content);
      return res.status(201).json({ data: post });
    } catch (error) {
      next(error);
    }
  };

  getPosts = async (req, res, next) => {
    try {
      const { orderKey, orderValue } = req.query;
      const userId = req.user.userId;
      const posts = await this.postsService.getPosts(userId, orderKey, orderValue);
      return res.status(200).json({ data: posts });
    } catch (error) {
      next(error);
    }
  };

  getPostById = async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const post = await this.postsService.getPostById(postId);
      if (!post) {
        return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
      }
      return res.status(200).json({ data: post });
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const userId = req.user.userId;
      const { title, content, status } = req.body;
      const message = await this.postsService.updatePost(postId, userId, title, content, status);
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const postId = req.params.postId;
      const userId = req.user.userId;
      const message = await this.postsService.deletePost(postId, userId);
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  }
}