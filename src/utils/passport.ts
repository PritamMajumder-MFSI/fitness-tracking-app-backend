import passport from "passport";
import PassportGoogle from "passport-google-oauth20";
import { credentials } from "../constants";

const GoogleStrategy = PassportGoogle.Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: credentials.GOOGLE_CLIENT_ID!,
      clientSecret: credentials.GOOGLE_CLIENT_SECRET!,
      callbackURL: credentials.CALLBACK_URI,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(credentials.CALLBACK_URI);
      return done(null, profile);
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  try {
    done(null, user as any);
  } catch (error) {
    done(error);
  }
});
