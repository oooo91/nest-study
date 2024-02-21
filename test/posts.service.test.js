import { jest } from '@jest/globals';
import { PostsService } from '../src/services/posts.service.js';

let mockPostsRepository = {
  findAllPosts: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

let postsService = new PostsService(mockPostsRepository);

describe('PostsService', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getPosts', async () => {
    const samplePosts = [
      {
        postId: 1,
        title: 'Title_1',
        content: 'Content_1',
        status: 'active',
        updatedAt: new Date('2024-02-21'),
      },
      {
        postId: 2,
        title: 'Title_2',
        content: 'Content_2',
        status: 'inactive',
        updatedAt: new Date('2024-02-21'),
      },
    ];

    mockPostsRepository.findAllPosts.mockResolvedValue(samplePosts);

    const result = await postsService.getPosts();

    expect(result).toEqual(samplePosts);
    expect(mockPostsRepository.findAllPosts).toHaveBeenCalledTimes(1);
  });

  test('createPost', async () => {
    const userId = 'user123';
    const title = 'New Post';
    const content = 'This is a new post';

    const createdPost = {
      postId: 123,
      title,
      content,
      status: 'active',
      updatedAt: new Date(),
    };

    mockPostsRepository.createPost.mockResolvedValue(createdPost);

    const result = await postsService.createPost(userId, title, content);

    expect(result).toEqual(createdPost);
    expect(mockPostsRepository.createPost).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.createPost).toHaveBeenCalledWith(userId, title, content);
  });

  test('getPostById', async () => {
    const postId = 1;
    const samplePost = {
      postId: postId,
      title: 'Sample Title',
      content: 'Sample Content',
      status: 'active',
      updatedAt: new Date(),
    };
    mockPostsRepository.findPostById.mockResolvedValue(samplePost);

    const result = await postsService.getPostById(postId);

    expect(result).toEqual(samplePost);
    expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
    expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(postId);
  });
});
