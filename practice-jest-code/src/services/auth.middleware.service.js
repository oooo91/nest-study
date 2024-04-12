import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET_KEY = process.env.KEY;

class AuthService {
  decodeTokenAndFindUser = async (token) => {
    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await dataSource.getRepository('Users').findOne({
      where: { userId: +userId },
    });

    if (!user) {
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    return user;
  }
}

const authService = new AuthService();
export default authService;
