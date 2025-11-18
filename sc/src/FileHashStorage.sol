// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title FileHashStorage
 * @notice Smart contract para almacenar y verificar hashes de ficheros
 * @dev Permite almacenar hashes de documentos con timestamp y firma, y verificar firmas usando ECDSA
 */
contract FileHashStorage {
    /**
     * @notice Estructura que almacena la información de un documento
     * @param hash Hash del fichero (SHA-256, Keccak-256, etc.)
     * @param timestamp Fecha de registro del documento (Unix timestamp)
     * @param signer Dirección del usuario que firmó el documento
     * @param signature Firma del hash realizada por el signer
     * @param exists Bandera que indica si el documento existe en el sistema
     */
    struct Document {
        bytes32 hash;
        uint256 timestamp;
        address signer;
        bytes signature;
        bool exists;
    }

    // Mapping de hash a Document
    mapping(bytes32 => Document) private documents;

    // Eventos
    event DocumentStored(
        bytes32 indexed hash,
        address indexed signer,
        uint256 timestamp
    );

    /**
     * @notice Almacena hash con timestamp y firma
     * @param hash Hash del fichero a almacenar
     * @param timestamp Fecha de registro del documento
     * @param signature Firma del hash
     * @return success Indica si el almacenamiento fue exitoso
     */
    function storeDocumentHash(
        bytes32 hash,
        uint256 timestamp,
        bytes calldata signature
    ) public returns (bool success) {
        require(hash != bytes32(0), "FileHashStorage: hash cannot be zero");
        require(
            !documents[hash].exists,
            "FileHashStorage: document already stored"
        );

        // Recuperar el signer de la firma para almacenarlo
        address recoveredSigner = recoverSigner(hash, signature);
        require(
            recoveredSigner != address(0),
            "FileHashStorage: invalid signature"
        );

        documents[hash] = Document({
            hash: hash,
            timestamp: timestamp,
            signer: recoveredSigner,
            signature: signature,
            exists: true
        });

        emit DocumentStored(hash, recoveredSigner, timestamp);

        return true;
    }

    /**
     * @notice Verifica firma usando ECDSA
     * @param hash Hash del documento a verificar
     * @param signer Dirección del signer esperado
     * @param signature Firma a verificar
     * @return isValid true si la firma es válida y corresponde al signer, false en caso contrario
     */
    function verifyDocument(
        bytes32 hash,
        address signer,
        bytes calldata signature
    ) public view returns (bool isValid) {
        require(
            documents[hash].exists,
            "FileHashStorage: document does not exist"
        );
        require(signer != address(0), "FileHashStorage: signer cannot be zero");

        address recoveredSigner = recoverSigner(hash, signature);

        return recoveredSigner == signer && recoveredSigner != address(0);
    }

    /**
     * @notice Consulta información completa del documento
     * @param hash Hash del documento a consultar
     * @return documentHash Hash del documento
     * @return timestamp Timestamp del documento
     * @return signer Dirección del signer
     * @return signature Firma del documento
     */
    function getDocumentInfo(
        bytes32 hash
    )
        public
        view
        returns (
            bytes32 documentHash,
            uint256 timestamp,
            address signer,
            bytes memory signature
        )
    {
        require(
            documents[hash].exists,
            "FileHashStorage: document does not exist"
        );

        Document memory doc = documents[hash];
        return (doc.hash, doc.timestamp, doc.signer, doc.signature);
    }

    /**
     * @notice Verifica si un hash existe
     * @param hash Hash del documento a verificar
     * @return exists true si el documento existe, false en caso contrario
     */
    function isDocumentStored(bytes32 hash) public view returns (bool exists) {
        return documents[hash].exists;
    }

    /**
     * @notice Obtiene la firma de un documento específico
     * @param hash Hash del documento
     * @return signature Firma del documento
     */
    function getDocumentSignature(
        bytes32 hash
    ) public view returns (bytes memory signature) {
        require(
            documents[hash].exists,
            "FileHashStorage: document does not exist"
        );

        return documents[hash].signature;
    }

    /**
     * @notice Recupera la dirección del signer a partir del hash y la firma usando ECDSA
     * @param hash Hash del mensaje
     * @param signature Firma ECDSA (65 bytes: r, s, v)
     * @return signer Dirección recuperada del signer
     */
    function recoverSigner(
        bytes32 hash,
        bytes calldata signature
    ) internal pure returns (address signer) {
        require(
            signature.length == 65,
            "FileHashStorage: signature length must be 65 bytes"
        );

        bytes32 r;
        bytes32 s;
        uint8 v;

        // Dividir la firma en r, s, v
        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 0x20))
            v := byte(0, calldataload(add(signature.offset, 0x40)))
        }

        // Ajustar v si es necesario (27 o 28)
        if (v < 27) {
            v += 27;
        }

        require(
            v == 27 || v == 28,
            "FileHashStorage: invalid signature v value"
        );

        // Crear el hash del mensaje con prefijo Ethereum
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );

        // Recuperar la dirección del signer
        signer = ecrecover(ethSignedMessageHash, v, r, s);

        require(
            signer != address(0),
            "FileHashStorage: invalid signature recovery"
        );
    }
}
