// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/EuroToken.sol";

contract EuroTokenTest is Test {
    EuroToken public token;
    address public owner;
    address public user1;
    address public user2;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        token = new EuroToken();
    }

    function test_InitialState() public {
        assertEq(token.name(), "EuroToken");
        assertEq(token.symbol(), "EURT");
        assertEq(token.decimals(), 6);
        assertEq(token.owner(), owner);
    }

    function test_MintByOwner() public {
        uint256 amount = 1000 * 10**6;
        token.mint(user1, amount);
        assertEq(token.balanceOf(user1), amount);
    }

    function test_MintByNonOwner() public {
        uint256 amount = 1000 * 10**6;
        vm.prank(user1);
        vm.expectRevert(); // OwnableUnauthorizedAccount
        token.mint(user2, amount);
    }

    function test_Transfer() public {
        uint256 mintAmount = 1000 * 10**6;
        uint256 transferAmount = 500 * 10**6;
        
        token.mint(user1, mintAmount);
        
        vm.prank(user1);
        token.transfer(user2, transferAmount);
        
        assertEq(token.balanceOf(user1), mintAmount - transferAmount);
        assertEq(token.balanceOf(user2), transferAmount);
    }

    function test_Approve() public {
        uint256 amount = 1000 * 10**6;
        vm.prank(user1);
        token.approve(user2, amount);
        assertEq(token.allowance(user1, user2), amount);
    }

    function test_TransferFrom() public {
        uint256 mintAmount = 1000 * 10**6;
        uint256 allowanceAmount = 500 * 10**6;
        uint256 transferAmount = 300 * 10**6;

        token.mint(user1, mintAmount);

        vm.prank(user1);
        token.approve(user2, allowanceAmount);

        vm.prank(user2);
        token.transferFrom(user1, user2, transferAmount);

        assertEq(token.balanceOf(user1), mintAmount - transferAmount);
        assertEq(token.balanceOf(user2), transferAmount);
        assertEq(token.allowance(user1, user2), allowanceAmount - transferAmount);
    }

    function test_TransferFromInsufficientAllowance() public {
        uint256 mintAmount = 1000 * 10**6;
        uint256 allowanceAmount = 100 * 10**6;
        uint256 transferAmount = 200 * 10**6;

        token.mint(user1, mintAmount);

        vm.prank(user1);
        token.approve(user2, allowanceAmount);

        vm.prank(user2);
        vm.expectRevert();
        token.transferFrom(user1, user2, transferAmount);
    }

    function test_TransferInsufficientBalance() public {
        uint256 mintAmount = 100 * 10**6;
        uint256 transferAmount = 200 * 10**6;

        token.mint(user1, mintAmount);

        vm.prank(user1);
        vm.expectRevert();
        token.transfer(user2, transferAmount);
    }

    function test_MintToZeroAddress() public {
        uint256 amount = 1000 * 10**6;
        vm.expectRevert();
        token.mint(address(0), amount);
    }
}
