import { jest } from '@jest/globals';
import { PostsController } from '../src/controllers/posts.controller.js';

const mockPostsService = { 
  getPosts: jest.fn(),
  getPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
};

const mockRequest = {
  query: jest.fn(),
  params: jest.fn(),
  user: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();
const postsController = new PostsController(mockPostsService);

const RequestUser = {
  id: "1",
};
mockRequest.user = RequestUser;

describe('PostsController', () => {

  beforeEach(() => {
    jest.resetAllMocks(); 
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('getPosts', async () => {
    
    const samplePosts = [
      {
        postId: 4,
        title: 'title',
        content : 'content',
        createdAt: new Date('2024-02-21'),
        updatedAt: new Date('2024-02-21'),
      },
      {
        postId: 3,
        title: 'title',
        content : 'content',
        createdAt: new Date('2024-02-21'),
        updatedAt: new Date('2024-02-21'),
      },
    ];
    mockPostsService.getPosts.mockResolvedValue(samplePosts);

    await postsController.getPosts(mockRequest, mockResponse, mockNext);

    expect(mockPostsService.getPosts).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    expect(mockResponse.json).toHaveBeenCalledWith({
      data: samplePosts,
    });
  });

  test('createPost', async () => {

    const createPostRequestBodyParams = {
      title: 'title',
      content: 'content',
      userId: 'userId'
    };

    mockRequest.body = createPostRequestBodyParams;

    const createPostReturnValue = {
      postId: 90,
      ...createPostRequestBodyParams,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    mockPostsService.createPost.mockReturnValue(createPostReturnValue);

    await postsController.createPost(mockRequest, mockResponse, mockNext);

    expect(mockPostsService.createPost).toHaveBeenCalledTimes(1); 
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);

    expect(mockResponse.json).toHaveBeenCalledWith({
      data: createPostReturnValue,
    });
  });

  test('getPostById', async () => {
    const postId = 1;
    const samplePost = {
      postId: postId,
      title: 'title',
      content: 'content',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockPostsService.getPostById.mockResolvedValue(samplePost);
    mockRequest.params.postId = postId;

    await postsController.getPostById(mockRequest, mockResponse, mockNext);

    expect(mockPostsService.getPostById).toHaveBeenCalledTimes(1);
    expect(mockPostsService.getPostById).toHaveBeenCalledWith(postId);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: samplePost });
  });

  test('updatePost', async () => {
    const postId = 1;
    const updatePostRequestBody = {
      title: 'title',
      content: 'content',
      password: 'password123',
    };
    const updatedPost = {
      postId: postId,
      ...updatePostRequestBody,
      updatedAt: new Date(),
    };
    mockRequest.params.postId = postId;
    mockRequest.body = updatePostRequestBody;
    mockPostsService.updatePost.mockResolvedValue(updatedPost);

    await postsController.updatePost(mockRequest, mockResponse, mockNext);

    expect(mockPostsService.updatePost).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: updatedPost });

  });

  test('deletePost', async () => {
    const postId = 1;
    const deletePostRequestBody = {
      password: 'password123',
    };
    const deletedPost = {
      postId: postId,
      deleted: true,
    };
    mockRequest.params.postId = postId;
    mockRequest.body = deletePostRequestBody;
    mockPostsService.deletePost.mockResolvedValue(deletedPost);

    await postsController.deletePost(mockRequest, mockResponse, mockNext);

    expect(mockPostsService.deletePost).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: deletedPost });

  });
});
