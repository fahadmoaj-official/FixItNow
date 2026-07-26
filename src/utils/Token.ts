import jwt, { Secret, SignOptions } from "jsonwebtoken";


interface TJwtPayload {
      userId: string;
      name?: string;
      email: string;
      role: string;
}


export const generateToken = (
  payload: TJwtPayload,
  secret: Secret,
  expiresIn: SignOptions["expiresIn"]
): string => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (
    token: string,
    secret: Secret
): TJwtPayload => {
  return jwt.verify(token, secret) as TJwtPayload;
};