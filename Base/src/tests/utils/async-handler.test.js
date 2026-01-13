const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler', () => {
  it('catches async errors and forwards them', async () => {
    const error = new Error('Boom');
    const req = {};
    const res = {};
    const next = jest.fn();

    const handler = asyncHandler(async () => {
      throw error;
    });

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
