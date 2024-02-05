import passport from "passport";
import { Strategy as KakaoStrategy } from "passport-kakao";
import { prisma } from "../utils/prisma/index.js";

passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      callbackURL: "/auth/kakao/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("kakao profile", profile);

      try {
        const exUser = await prisma.users.findFirst({
          where: { snsId: profile.id, provider: "kakao" },
        });

        if (exUser) {
          done(null, exUser);
        } else {
          const newUser = await prisma.users.create({
            email: profile._json && profile._json.kakao_account_email,
            username: profile.displayName,
            snsId: profile.id,
            provider: "kakao",
          });
          done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    },
  ),
);

export default passport;
