"use client";

import { store } from "@/redux/store";
// React Imports
import type { ReactNode } from "react";

// Third-party Imports
import { Provider } from "react-redux";


const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
        {children}
    </Provider>
  );
};

export default ReduxProvider;
