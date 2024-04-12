import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET_KEY = process.env.KEY;

export class UsersService {

  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  signUp = async ({ email, password, confirmPassword, nickname }) => {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    if (password.length < 6) {
      throw new Error('비밀번호를 6자 이상 입력하세요.');
    }

    if (password !== confirmPassword) {
      throw new Error('비밀번호가 정확하지 않습니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.createUser({
      email,
      nickname,
      password: hashedPassword,
    });
  };

  signIn = async ({ email, password }) => {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new Error('존재하지 않는 이메일입니다.');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('비밀번호가 틀렸습니다.');
    }

    const token = jwt.sign({ userId: user.userId }, ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: '12h',
    });

    return token;
  };

  getUser =  async (userId) => {
    return await this.usersRepository.findById(userId);
  };
};
