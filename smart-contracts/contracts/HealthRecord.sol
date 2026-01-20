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

    event EmergencyAccessAccessed(address indexed doctor, address indexed patient, uint256 timestamp);

    function emergencyAccess(address _patient) public {
        // In a real system, we might require the caller to be a verified doctor via a registry.
        // Here, we allow it but log a CRITICAL event that cannot be deleted.
        emit EmergencyAccessAccessed(msg.sender, _patient, block.timestamp);
    }

    function getRecords(address _patient) public view returns (Record[] memory) {
         // Modified: We don't use the modifier here because we need to handle "Emergency" logic 
         // on the frontend or backend. Or, simpler:
         // The standard 'getRecords' stays strict.
         // 'emergencyGetRecords' allows access but logs it.
         
         require(
            msg.sender == _patient || authorizedDoctors[_patient][msg.sender],
            "Not authorized"
        );
        return patientRecords[_patient];
    }
    
    // Explicit Emergency Function
    function getRecordsEmergency(address _patient) public returns (Record[] memory) {
        // 1. Emit the critical log (this costs gas and is permanent)
        emit EmergencyAccessAccessed(msg.sender, _patient, block.timestamp);
        
        // 2. Return records (Bypassing the 'require' check of authorizedDoctors)
        return patientRecords[_patient];
    }
}
