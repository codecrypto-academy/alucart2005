"use client";

import { WalletProvider } from "@/contexts/WalletContext";
import { DocumentProvider } from "@/contexts/DocumentContext";
import { ErrorDialogProvider } from "@/contexts/ErrorDialogContext";
import AnvilErrorDialog from "@/components/AnvilErrorDialog";
import { useErrorDialog } from "@/contexts/ErrorDialogContext";
import { useWallet } from "@/contexts/WalletContext";

function ErrorDialogWrapper() {
  const { errorState, hideError } = useErrorDialog();
  const { connect } = useWallet();

  const handleRetry = async () => {
    await connect();
    // If connection succeeds, the dialog will be closed by WalletContext
    // If it fails, a new error will be shown
  };

  return (
    <AnvilErrorDialog
      isOpen={errorState.isOpen}
      onClose={hideError}
      errorMessage={errorState.errorMessage}
      rpcUrl={errorState.rpcUrl}
      onRetry={handleRetry}
      isContractNotDeployed={errorState.isContractNotDeployed}
      contractAddress={errorState.contractAddress}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorDialogProvider>
      <WalletProvider>
        <DocumentProvider>
          {children}
          <ErrorDialogWrapper />
        </DocumentProvider>
      </WalletProvider>
    </ErrorDialogProvider>
  );
}
