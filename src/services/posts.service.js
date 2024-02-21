export class PostsService {
  constructor(postsRepository) {
    this.postsRepository = postsRepository;
  }

  getPosts = async () => {
    const posts = await this.postsRepository.findAllPosts();

    posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return posts.map((post) => {
      return {
        postId: post.postId,
        title: post.title,
        content: post.content,
        status: post.status,
        updatedAt: post.updatedAt,
      };
    });
  };

  getPostById = async (postId) => {
    const post = await this.postsRepository.findPostById(postId);

    if (!post) throw new Error('게시글을 찾을 수 없습니다.');

    return {
      postId: post.postId,
      title: post.title,
      content: post.content,
      status: post.status,
      updatedAt: post.updatedAt,
    };
  };

  createPost = async (userId, title, content) => {
    const createdPost = await this.postsRepository.createPost(userId, title, content);

    return {
      postId: createdPost.postId,
      title: createdPost.title,
      content: createdPost.content,
      status: createdPost.status,
      updatedAt: createdPost.updatedAt,
    };
  };

  updatePost = async (postId, userId, title, content, status) => {
    const post = await this.postsRepository.findPostById(postId, userId);
    if (!post) throw new Error('게시글을 찾을 수 없습니다.');
    
    if (post.userId !== userId) throw new Error('잘못된 접근입니다.');

    await this.postsRepository.updatePost(postId, title, content, status);

    const updatedPost = await this.postsRepository.findPostById(postId);

    return {
      postId: updatedPost.postId,
      title: updatedPost.title,
      content: updatedPost.content,
      status: updatedPost.status,
      updatedAt: updatedPost.updatedAt,
    };
  };

  deletePost = async (postId, userId) => {
    const post = await this.postsRepository.findPostById(postId, userId);
    if (!post) throw new Error('게시글을 찾을 수 없습니다.');
    if (post.userId !== userId) throw new Error('잘못된 접근입니다.');

    await this.postsRepository.deletePost(postId);

    return {
      postId: post.postId,
      title: post.title,
      content: post.content,
      status: post.status,
      updatedAt: post.updatedAt,
    };
  };
}
