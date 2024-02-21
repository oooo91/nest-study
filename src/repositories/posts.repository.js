export class PostsRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllPosts = async () => {
    return this.prisma.posts.findMany({
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
    return this.prisma.posts.findFirst({
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
    return this.prisma.posts.create({
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
    return this.prisma.posts.update({
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
    return this.prisma.posts.delete({
      where: {
        postId: +postId,
      },
    });
  };
}
