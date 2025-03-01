import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name: string, value: string, days = 7) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  cookies.set(name, value, { path: "/", expires: date });
};

export const removeCookie = (name: string) => {
  cookies.remove(name, { path: "/" });
};
