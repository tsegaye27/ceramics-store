"use client";
import React from "react";
import store from "./_store/store";
import { Provider } from "react-redux";

const ReactProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
};

export default ReactProvider;
