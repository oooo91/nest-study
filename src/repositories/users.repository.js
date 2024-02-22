import dataSource from '../typeorm/entity/user.entity.js';

export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findByEmail =  async (email) => {
    return await dataSource.getRepository('Users').findOne({ where: { email } });
  };

  createUser =  async ({ email, nickname, password }) => {
    return await dataSource.getRepository('Users').insert({
      data: {
        email,
        nickname,
        password,
      },
    });
  };

  findById = async (userId) => {
    return await dataSource.getRepository('Users').findOne({
      where: {
        userId,
      },
      select: {
        nickname: true,
        email: true,
      },
    });
  };
};
