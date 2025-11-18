// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {FileHashStorage} from "../src/FileHashStorage.sol";

contract FileHashStorageScript is Script {
    FileHashStorage public fileHashStorage;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        fileHashStorage = new FileHashStorage();

        vm.stopBroadcast();
    }
}

