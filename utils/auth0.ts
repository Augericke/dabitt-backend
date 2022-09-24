import { auth } from "express-oauth2-jwt-bearer";
import { requiredScopes } from "express-oauth2-jwt-bearer";

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
export const checkJwt = auth({
  audience: "API/dabitt",
  issuerBaseURL: "https://dev-rhws1iu8.us.auth0.com/",
});

export const checkReadMessage = requiredScopes("read:messages");
