const UserService = require('../services/user.service');

describe('UserService', () => {
  let userService;
  let fakeRepository;

  beforeEach(() => {
    fakeRepository = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    userService = new UserService(fakeRepository);
  });

  it('delegates findAll to repository', async () => {
    fakeRepository.findAll.mockResolvedValue([]);

    const result = await userService.findAll();

    expect(fakeRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
