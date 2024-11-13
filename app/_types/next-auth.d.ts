declare global {
  interface Request {
    user?: {
      name: string;
      email: string;
      hashedPassword: string;
      role: "chis" | "user";
      createdAt: Date;
    };
  }
}

export {};
