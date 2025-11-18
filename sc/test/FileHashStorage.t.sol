// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {FileHashStorage} from "../src/FileHashStorage.sol";

contract FileHashStorageTest is Test {
    FileHashStorage public fileHashStorage;

    address public signer1;
    address public signer2;
    uint256 private signer1Key;
    uint256 private signer2Key;

    bytes32 public constant TEST_HASH_1 = keccak256("test_file_1.pdf");
    bytes32 public constant TEST_HASH_2 = keccak256("test_file_2.pdf");
    bytes32 public constant TEST_HASH_3 = keccak256("test_file_3.pdf");

    function setUp() public {
        fileHashStorage = new FileHashStorage();

        // Crear signers para pruebas
        signer1Key = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef;
        signer2Key = 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890;
        signer1 = vm.addr(signer1Key);
        signer2 = vm.addr(signer2Key);
    }

    function test_StoreDocumentHash() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature = createSignature(TEST_HASH_1, signer1Key);

        bool success = fileHashStorage.storeDocumentHash(
            TEST_HASH_1,
            timestamp,
            signature
        );

        assertTrue(success);
        assertTrue(fileHashStorage.isDocumentStored(TEST_HASH_1));

        (
            bytes32 docHash,
            uint256 docTimestamp,
            address docSigner,
            bytes memory docSignature
        ) = fileHashStorage.getDocumentInfo(TEST_HASH_1);

        assertEq(docHash, TEST_HASH_1);
        assertEq(docTimestamp, timestamp);
        assertEq(docSigner, signer1);
        assertEq(docSignature, signature);
    }

    function test_StoreDocumentHash_RevertIf_ZeroHash() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature = createSignature(bytes32(0), signer1Key);

        vm.expectRevert("FileHashStorage: hash cannot be zero");
        fileHashStorage.storeDocumentHash(bytes32(0), timestamp, signature);
    }

    function test_StoreDocumentHash_RevertIf_DuplicateHash() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature = createSignature(TEST_HASH_1, signer1Key);

        fileHashStorage.storeDocumentHash(TEST_HASH_1, timestamp, signature);

        vm.expectRevert("FileHashStorage: document already stored");
        fileHashStorage.storeDocumentHash(TEST_HASH_1, timestamp, signature);
    }

    function test_StoreDocumentHash_RevertIf_InvalidSignature() public {
        uint256 timestamp = block.timestamp;
        bytes memory invalidSignature = "0x1234567890abcdef";

        vm.expectRevert("FileHashStorage: signature length must be 65 bytes");
        fileHashStorage.storeDocumentHash(
            TEST_HASH_1,
            timestamp,
            invalidSignature
        );
    }

    function test_VerifyDocument() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature = createSignature(TEST_HASH_1, signer1Key);

        fileHashStorage.storeDocumentHash(TEST_HASH_1, timestamp, signature);

        bool isValid = fileHashStorage.verifyDocument(
            TEST_HASH_1,
            signer1,
            signature
        );

        assertTrue(isValid);
    }

    function test_VerifyDocument_InvalidSigner() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature = createSignature(TEST_HASH_1, signer1Key);

        fileHashStorage.storeDocumentHash(TEST_HASH_1, timestamp, signature);

        bool isValid = fileHashStorage.verifyDocument(
            TEST_HASH_1,
            signer2,
            signature
        );

        assertFalse(isValid);
    }

    function test_VerifyDocument_InvalidSignature() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature1 = createSignature(TEST_HASH_1, signer1Key);
        bytes memory signature2 = createSignature(TEST_HASH_1, signer2Key);

        fileHashStorage.storeDocumentHash(TEST_HASH_1, timestamp, signature1);

        bool isValid = fileHashStorage.verifyDocument(
            TEST_HASH_1,
            signer1,
            signature2
        );

        assertFalse(isValid);
    }

    function test_VerifyDocument_RevertIf_NotExists() public {
        bytes memory signature = createSignature(TEST_HASH_1, signer1Key);

        vm.expectRevert("FileHashStorage: document does not exist");
        fileHashStorage.verifyDocument(TEST_HASH_1, signer1, signature);
    }

    function test_GetDocumentInfo() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature = createSignature(TEST_HASH_1, signer1Key);

        fileHashStorage.storeDocumentHash(TEST_HASH_1, timestamp, signature);

        (
            bytes32 docHash,
            uint256 docTimestamp,
            address docSigner,
            bytes memory docSignature
        ) = fileHashStorage.getDocumentInfo(TEST_HASH_1);

        assertEq(docHash, TEST_HASH_1);
        assertEq(docTimestamp, timestamp);
        assertEq(docSigner, signer1);
        assertEq(docSignature, signature);
    }

    function test_GetDocumentInfo_RevertIf_NotExists() public {
        vm.expectRevert("FileHashStorage: document does not exist");
        fileHashStorage.getDocumentInfo(TEST_HASH_1);
    }

    function test_IsDocumentStored() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature = createSignature(TEST_HASH_1, signer1Key);

        assertFalse(fileHashStorage.isDocumentStored(TEST_HASH_1));

        fileHashStorage.storeDocumentHash(TEST_HASH_1, timestamp, signature);

        assertTrue(fileHashStorage.isDocumentStored(TEST_HASH_1));
    }

    function test_GetDocumentSignature() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature = createSignature(TEST_HASH_1, signer1Key);

        fileHashStorage.storeDocumentHash(TEST_HASH_1, timestamp, signature);

        bytes memory retrievedSignature = fileHashStorage.getDocumentSignature(
            TEST_HASH_1
        );

        assertEq(retrievedSignature, signature);
    }

    function test_GetDocumentSignature_RevertIf_NotExists() public {
        vm.expectRevert("FileHashStorage: document does not exist");
        fileHashStorage.getDocumentSignature(TEST_HASH_1);
    }

    function test_Events_DocumentStored() public {
        uint256 timestamp = block.timestamp;
        bytes memory signature = createSignature(TEST_HASH_1, signer1Key);

        vm.expectEmit(true, true, false, true);
        emit FileHashStorage.DocumentStored(TEST_HASH_1, signer1, timestamp);

        fileHashStorage.storeDocumentHash(TEST_HASH_1, timestamp, signature);
    }

    // Función auxiliar para crear firmas ECDSA
    function createSignature(
        bytes32 hash,
        uint256 privateKey
    ) internal pure returns (bytes memory) {
        // Crear el hash del mensaje con prefijo Ethereum
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );

        // Firmar usando la clave privada
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, ethSignedMessageHash);

        // Concatenar r, s, v en un array de bytes
        return abi.encodePacked(r, s, v);
    }
}
