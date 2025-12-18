// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EuroToken.sol";

contract DeployEuroToken is Script {
    function run() external returns (EuroToken) {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80));
        
        vm.startBroadcast(deployerPrivateKey);

        EuroToken token = new EuroToken();
        
        // Initial mint of 1,000,000 tokens to the deployer
        token.mint(vm.addr(deployerPrivateKey), 1_000_000 * 10**6);

        vm.stopBroadcast();
        return token;
    }
}
