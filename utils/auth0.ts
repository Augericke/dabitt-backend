import { auth } from "express-oauth2-jwt-bearer";
import { Request } from "express";
import config from "./config";
import { requiredScopes } from "express-oauth2-jwt-bearer";

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
export const checkJwt = auth({
  audience: config.auth.audience,
  issuerBaseURL: config.auth.issuerBaseUrl,
});

export const checkReadMessage = requiredScopes("read:messages");

export const getAuthId = (req: Request) => {
  if (req.auth) {
    return req.auth.payload.sub!;
  }

  return "";
};
