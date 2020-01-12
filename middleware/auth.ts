
import { Request, Response, NextFunction } from "express";
import * as passport from "passport";
import * as jwt from "jsonwebtoken";
import { config } from "../config/app";

/**
 * extracting authorization token.
 */
const extractTokenFromHeader = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
    return req.headers.authorization;
};

/**
 *
 * @param req
 * @param res
 * @param next
 * check if user is authorized;
 */
export const isValidUser = (req: Request, res: Response, next: NextFunction) => {
    if (passport.authenticate("jwt", { session: false })) {
        return res.status(401).json({ success: false, message: "UnAuthorized Request! " });
    } else { return res.status(401).json({msg: "UnAuthorized Request!" }); }
};

/**
 * check request token.
 */
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Get the jwt token from the head
    const token = extractTokenFromHeader(req);
    let jwtPayload: any;

    // Try to validate the token and get data
    try {
      jwtPayload = jwt.verify(token as string, config.app.JWT_SECRET);
      res.locals.jwtPayload = jwtPayload;
    } catch (error) {
      // If token is not valid, respond with 401 (unauthorized)
      return res.status(401).json({ success: false, msg: "UnAuthorized Request!" });
    }

    // The token is valid for 1 hour
    // We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.app.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.setHeader("token", newToken);

    // Call the next middleware or controller
    next();
};
