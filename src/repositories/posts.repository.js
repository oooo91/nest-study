import dataSource from '../typeorm/entity/post.entity.js';

export class PostsRepository {
  
  findAllPosts = async () => {
    return await dataSource.getRepository('Posts').find({
      select: {
        postId: true,
        title: true,
        content: true,
        status: true,
        updatedAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
      orderBy: {
        postId: 'desc',
      },
    });
  };

  findPostById = async (postId) => {
    return await dataSource.getRepository('Posts').findOne({
      where: {
        postId: +postId
      },
      select: {
        postId: true,
        userId: true,
        title: true,
        content: true,
        status: true,
        updatedAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  };

  createPost = async (userId, title, content) => {
    return await dataSource.getRepository('Posts').insert({
      data: {
        userId: +userId,
        title,
        content,
      },
      select: {
        postId: true,
        title: true,
        content: true,
        status: true,
        updatedAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  };

  updatePost = async (postId, title, content, status) => {
    return await dataSource.getRepository('Posts').update({
      where: {
        postId: +postId,
      },
      data: {
        title,
        content,
        status,
      },
      select: {
        postId: true,
        title: true,
        content: true,
        status: true,
        updatedAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    });
  };

  deletePost = async (postId) => {
    return await dataSource.getRepository('Posts').delete({
      where: {
        postId: +postId,
      },
    });
  };
}
