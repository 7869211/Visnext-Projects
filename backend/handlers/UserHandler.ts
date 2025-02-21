import User from "../models/User";

class UserHandler {
  static async createUser(user: User): Promise<User> {
    if (!user.name || !user.email || !user.password) {
      throw new Error("Username, email, and password are required.");
    }

    try {
      const newUser = await User.create(user);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  static async getAllUsers():Promise<User[]> {
   try{
     const users = await User.findAll();
     return users;
   }
   catch(error){
     console.error("Error getting all users:", error);
     throw new Error("Failed to get all users");
   }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    console.log("findUserByEmail called");
    return User.findOne({ where: { email } });
  }
}
export default UserHandler;
