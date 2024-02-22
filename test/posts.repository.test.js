import { jest } from '@jest/globals';
import { PostsRepository } from '../src/repositories/posts.repository.js';

const prismaMock = {
  posts: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const postsRepository = new PostsRepository(prismaMock);

describe('PostsRepository', () => {

  beforeEach(() => {
    jest.resetAllMocks(); 
  });

  test('getPosts', async () => {
    const mockPosts = [
      { postId: 1, title: 'Title 1', content: 'Content 1', status: 'apply', updatedAt: new Date(), user: { nickname: 'User 1' } },
      { postId: 2, title: 'Title 2', content: 'Content 2', status: 'apply', updatedAt: new Date(), user: { nickname: 'User 2' } },
    ];
    prismaMock.posts.findMany.mockResolvedValue(mockPosts);
    const result = await postsRepository.findAllPosts();

    expect(result).toEqual(mockPosts);
    expect(prismaMock.posts.findMany).toHaveBeenCalledTimes(1);
  });


  test('getPostById', async () => {

    const postId = 1;
    const mockPost = { postId, title: 'Title 1', content: 'Content 1', status: 'apply', updatedAt: new Date(), user: { nickname: 'User 1' } };
    
    prismaMock.posts.findFirst.mockResolvedValue(mockPost);

    const result = await postsRepository.findPostById(postId);

    expect(result).toEqual(mockPost);
    expect(prismaMock.posts.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.posts.findFirst).toHaveBeenCalledWith({
      where: { postId: postId },
      select: { postId: true, userId: true, title: true, content: true, status: true, updatedAt: true, user: { select: { nickname: true } } },
    });
  });


  test('createPost', async () => {

    const userId = 1;
    const title = 'post';
    const content = 'content';
    const mockCreatedPost = { postId: 3, userId, title, content, status: 'apply', updatedAt: new Date(), user: { nickname: 'User 1' } };

    prismaMock.posts.create.mockResolvedValue(mockCreatedPost);

    const result = await postsRepository.createPost(userId, title, content);

    expect(result).toEqual(mockCreatedPost);
    expect(prismaMock.posts.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.posts.create).toHaveBeenCalledWith({
      data: { userId, title, content },
      select: { postId: true, title: true, content: true, status: true, updatedAt: true, user: { select: { nickname: true } } },
    });
  });

  test('updatePost', async () => {

    const postId = 1;
    const title = 'title';
    const content = 'content';
    const status = 'apply';
    const mockUpdatedPost = { postId, title, content, status, updatedAt: new Date(), user: { nickname: 'User 1' } };

    prismaMock.posts.update.mockResolvedValue(mockUpdatedPost);

    const result = await postsRepository.updatePost(postId, title, content, status);

    expect(result).toEqual(mockUpdatedPost);
    expect(prismaMock.posts.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.posts.update).toHaveBeenCalledWith({
      where: { postId: postId },
      data: { title, content, status },
      select: { postId: true, title: true, content: true, status: true, updatedAt: true, user: { select: { nickname: true } } },
    });
  });


  test('deletePost', async () => {
    const postId = 1;

    prismaMock.posts.delete.mockResolvedValue({ postId });

    const result = await postsRepository.deletePost(postId);

    expect(result).toEqual({ postId });
    expect(prismaMock.posts.delete).toHaveBeenCalledTimes(1);
    expect(prismaMock.posts.delete).toHaveBeenCalledWith({
      where: { postId: postId },
    });
  });
});
