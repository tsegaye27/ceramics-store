declare global {
  interface Request {
    user?: {
      name: string;
      email: string;
      hashedPassword: string;
      role: "admin" | "user";
      createdAt: Date;
    };
  }
}

export {};
