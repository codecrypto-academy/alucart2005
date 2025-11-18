"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface LocalDocument {
  hash: string;
  timestamp: bigint;
  signer: string;
  signature: string;
  fileName?: string;
  fileSize?: number;
  txHash?: string;
  activo: boolean;
}

interface DocumentContextType {
  documents: LocalDocument[];
  addDocument: (document: Omit<LocalDocument, "activo">) => void;
  toggleDocumentActive: (hash: string) => void;
  clearDocuments: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<LocalDocument[]>([]);

  const addDocument = useCallback((document: Omit<LocalDocument, "activo">) => {
    setDocuments((prev) => {
      // Verificar si el documento ya existe
      const exists = prev.some(
        (doc) => doc.hash.toLowerCase() === document.hash.toLowerCase()
      );
      if (exists) {
        // Si existe, actualizar el documento pero mantener el estado activo
        return prev.map((doc) =>
          doc.hash.toLowerCase() === document.hash.toLowerCase()
            ? { ...document, activo: doc.activo }
            : doc
        );
      }
      // Si no existe, agregar con activo = true por defecto
      return [...prev, { ...document, activo: true }];
    });
  }, []);

  const toggleDocumentActive = useCallback((hash: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.hash.toLowerCase() === hash.toLowerCase()
          ? { ...doc, activo: !doc.activo }
          : doc
      )
    );
  }, []);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocument,
        toggleDocumentActive,
        clearDocuments,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
}
