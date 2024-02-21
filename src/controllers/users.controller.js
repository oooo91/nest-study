
export class UsersController {

  constructor(usersService) {
    this.usersService = usersService;
  }
  
  signUp = async (req, res, next) => {
    try {
      const { email, password, confirmPassword, nickname } = req.body;
      const user = await this.usersService.signUp({
        email,
        password,
        confirmPassword,
        nickname,
      });

      res.status(201).json({
        message: '회원가입이 완료되었습니다.',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const token = await this.usersService.signIn({ email, password });

      res.cookie('authorization', `Bearer ${token}`);
      res.status(200).json({ message: '로그인 되었습니다.' });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const user = await this.usersService.getUser(req.user.userId);
      res.status(200).json({ data: user });
    } catch (error) {
      next(error);
    }
  };
}