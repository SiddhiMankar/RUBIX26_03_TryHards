// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HealthRecord {
    struct Record {
        string ipfsHash;
        string recordType; // e.g., "X-RAY", "LAB_REPORT"
        uint256 timestamp;
        address uploadedBy;
        string description;
    }

    // Patient Address => List of Records
    mapping(address => Record[]) public patientRecords;
    
    // Mapping to check if a doctor is authorized by a patient
    // Patient => Doctor => Authorized
    mapping(address => mapping(address => bool)) public authorizedDoctors;

    event RecordAdded(address indexed patient, string ipfsHash, string recordType);
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);

    // Modifier to check if caller is patient or authorized doctor
    modifier onlyAuthorized(address _patient) {
        require(
            msg.sender == _patient || authorizedDoctors[_patient][msg.sender],
            "Not authorized"
        );
        _;
    }

    function addRecord(
        string memory _ipfsHash,
        string memory _recordType,
        string memory _description
    ) public {
        patientRecords[msg.sender].push(Record({
            ipfsHash: _ipfsHash,
            recordType: _recordType,
            timestamp: block.timestamp,
            uploadedBy: msg.sender,
            description: _description
        }));

        emit RecordAdded(msg.sender, _ipfsHash, _recordType);
    }

    function grantAccess(address _doctor) public {
        authorizedDoctors[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }

    function revokeAccess(address _doctor) public {
        authorizedDoctors[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }

    function getRecords(address _patient) public view onlyAuthorized(_patient) returns (Record[] memory) {
        return patientRecords[_patient];
    }
}
