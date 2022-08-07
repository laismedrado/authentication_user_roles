import { UserDatabase } from "../data/UserDatabase";
import {
  CustomError,
  InvalidPassword,
  UnAuthorizedUser,
} from "../error/customError";
import { v4 } from "uuid";
import { generateHash, compareHash } from "../services/hashManager";
import { generateToken, getTokenData } from "../services/authenticator";
import { AuthenticationData } from "../model/types";
import {
  UserInputDTO,
  user,
  EditUserInputDTO,
  LoginInputDTO,
} from "../model/user";

const userDatabase = new UserDatabase();
export class UserBusiness {
  public createUser = async (input: UserInputDTO): Promise<string> => {
    try {
      let { name, nickname, email, password, role } = input;
      if (!name || !nickname || !email || !password || !role) {
        throw new CustomError(400, "Preencha todos os campos");
      }
      if (role !== "ADMIN" && role !== "NORMAL") {
        role = "NORMAL";
      }

      const id = v4();
      const passwordHash = await generateHash(password);
      const user: user = {
        id,
        email,
        password: passwordHash,
        name,
        nickname,
        role,
      };
      await userDatabase.insertUser(user);
      const token = generateToken({ id, role });
      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public login = async (input: LoginInputDTO): Promise<string> => {
    try {
      let { email, password } = input;

      if (!email || !password) {
        throw new CustomError(400, "Preencha todos os campos");
      }
      const user = await userDatabase.findUserByEmail(email);
      const hashComparison = await compareHash(password, user.password);
      if (!hashComparison) {
        throw new InvalidPassword();
      }
      const payload: AuthenticationData = {
        id: user.id,
        role: user.role,
      };
      const token = generateToken(payload);
      return token;
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };

  public editUser = async (input: EditUserInputDTO): Promise<void> => {
    try {
      let { name, nickname, id, token } = input;

      if (!name || !nickname || !id || !token) {
        throw new CustomError(400, "Preencha todos os campos");
      }
      const { role } = getTokenData(token);
      if (role !== "ADMIN") {
        throw new UnAuthorizedUser();
      }
      const EditUser = {
        name,
        nickname,
        id,
      };
      await userDatabase.editUser(EditUser);
    } catch (error: any) {
      throw new CustomError(400, error.message);
    }
  };
}
