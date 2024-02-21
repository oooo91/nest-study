export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findByEmail =  async (email) => {
    return await this.prisma.users.findFirst({ where: { email } });
  };

  createUser =  async ({ email, nickname, password }) => {
    return await this.prisma.users.create({
      data: {
        email,
        nickname,
        password,
      },
    });
  };

  findById = async (userId) => {
    return await this.prisma.users.findFirst({
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
