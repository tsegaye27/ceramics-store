import React from "react";

type ModalProp = {
  children: React.ReactNode;
};

const Modal: React.FC<ModalProp> = ({ children }) => {
  return <div>{children}</div>;
};

export default Modal;
