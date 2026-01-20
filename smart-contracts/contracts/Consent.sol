// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Consent {
    struct ConsentRule {
        bool isActive;
        string purpose; // e.g., "GENERAL_CHECKUP", "SURGERY"
        uint256 expiryTimestamp;
        string[] allowedRecordTypes; // Empty array means all types
    }

    // Patient => Doctor => ConsentRule
    mapping(address => mapping(address => ConsentRule)) public consents;

    event ConsentGiven(address indexed patient, address indexed doctor, string purpose, uint256 expiry);
    event ConsentRevoked(address indexed patient, address indexed doctor);

    function giveConsent(
        address _doctor,
        string memory _purpose,
        uint256 _durationSeconds,
        string[] memory _allowedRecordTypes
    ) public {
        consents[msg.sender][_doctor] = ConsentRule({
            isActive: true,
            purpose: _purpose,
            expiryTimestamp: block.timestamp + _durationSeconds,
            allowedRecordTypes: _allowedRecordTypes
        });

        emit ConsentGiven(msg.sender, _doctor, _purpose, block.timestamp + _durationSeconds);
    }

    function revokeConsent(address _doctor) public {
        delete consents[msg.sender][_doctor];
        emit ConsentRevoked(msg.sender, _doctor);
    }

    function checkConsent(address _patient, address _doctor, string memory _recordType) public view returns (bool) {
        ConsentRule memory rule = consents[_patient][_doctor];

        if (!rule.isActive) return false;
        if (block.timestamp > rule.expiryTimestamp) return false;

        // Check record type restrictions
        if (rule.allowedRecordTypes.length > 0) {
            bool typeAllowed = false;
            for (uint i = 0; i < rule.allowedRecordTypes.length; i++) {
                if (keccak256(bytes(rule.allowedRecordTypes[i])) == keccak256(bytes(_recordType))) {
                    typeAllowed = true;
                    break;
                }
            }
            if (!typeAllowed) return false;
        }

        return true;
    }
}
