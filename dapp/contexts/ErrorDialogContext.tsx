"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface ErrorDialogState {
  isOpen: boolean;
  errorMessage: string;
  rpcUrl: string;
  isContractNotDeployed?: boolean;
  contractAddress?: string;
}

interface ErrorDialogContextType {
  showError: (
    errorMessage: string,
    rpcUrl: string,
    isContractNotDeployed?: boolean,
    contractAddress?: string
  ) => void;
  hideError: () => void;
  errorState: ErrorDialogState;
}

const ErrorDialogContext = createContext<ErrorDialogContextType | undefined>(
  undefined
);

export function ErrorDialogProvider({ children }: { children: ReactNode }) {
  const [errorState, setErrorState] = useState<ErrorDialogState>({
    isOpen: false,
    errorMessage: "",
    rpcUrl: "",
    isContractNotDeployed: false,
    contractAddress: "",
  });

  const showError = useCallback(
    (
      errorMessage: string,
      rpcUrl: string,
      isContractNotDeployed: boolean = false,
      contractAddress: string = ""
    ) => {
      setErrorState({
        isOpen: true,
        errorMessage,
        rpcUrl,
        isContractNotDeployed,
        contractAddress,
      });
    },
    []
  );

  const hideError = useCallback(() => {
    setErrorState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  return (
    <ErrorDialogContext.Provider
      value={{
        showError,
        hideError,
        errorState,
      }}
    >
      {children}
    </ErrorDialogContext.Provider>
  );
}

export function useErrorDialog() {
  const context = useContext(ErrorDialogContext);
  if (context === undefined) {
    throw new Error(
      "useErrorDialog must be used within an ErrorDialogProvider"
    );
  }
  return context;
}
