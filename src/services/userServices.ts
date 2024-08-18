import { prisma } from "../libs/prisma";
import { login, user } from "../schemas/userSchemas";
import bcrypt from "bcrypt";
export class UserService {
  async create(data: user) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      const user = await prisma.user.create({
        data: {
          name: data.name.toLowerCase(),
          email: data.email.toLowerCase(),
          password: hashedPassword,
          cpf: data.cpf,
          phone: data.phone,
        },
      });
      return user;
    } catch (e) {
      return e;
    }
  }
  async login(data: login) {
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
      select: {
        name: true,
        email: true,
        cpf: true,
        phone: true,
      },
    });
    const result = {
      ...user,
      token: data.token,
    };
    return result;
  }
}
