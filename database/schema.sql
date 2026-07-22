-- ============================================================
-- ReliefMesh Database Schema
-- MongoDB (Mongoose) → SQL Equivalent Documentation
-- Generated from Mongoose model definitions
-- ============================================================

-- ============================================================
-- Table: geographicareas
-- MongoDB Collection: geographicareas
-- Mongoose Model: GeographicArea (areaModel.js)
-- ============================================================
CREATE TABLE geographicareas (
    _id              VARCHAR(24) PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    level            VARCHAR(20) NOT NULL CHECK (level IN ('DIVISION','DISTRICT','UPAZILA','UNION','WARD')),
    parentId         VARCHAR(24) REFERENCES geographicareas(_id),
    lat              DECIMAL(10,7),
    lng              DECIMAL(10,7),
    population       INTEGER DEFAULT 0,
    isActive         BOOLEAN DEFAULT TRUE,
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_geographicareas_level_parent ON geographicareas(level, parentId);
CREATE UNIQUE INDEX idx_geographicareas_name_level ON geographicareas(name, level);

-- ============================================================
-- Table: users
-- MongoDB Collection: users
-- Mongoose Model: User (authModel.js)
-- ============================================================
CREATE TABLE users (
    _id              VARCHAR(24) PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    email            VARCHAR(255) NOT NULL UNIQUE,
    passwordHash     VARCHAR(255) NOT NULL,
    role             VARCHAR(20) NOT NULL CHECK (role IN ('UP_OFFICIAL','UPAZILA_OFFICER','NGO_WORKER','CITIZEN')),
    organization     VARCHAR(255),
    jurisdictionId   VARCHAR(24) REFERENCES geographicareas(_id),
    address          VARCHAR(500),
    phone            VARCHAR(20),
    isActive         BOOLEAN DEFAULT TRUE,
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: households
-- MongoDB Collection: households
-- Mongoose Model: Household (householdModel.js)
-- Contains embedded: familyMembers[]
-- ============================================================
CREATE TABLE households (
    _id              VARCHAR(24) PRIMARY KEY,
    headName         VARCHAR(255) NOT NULL,
    nid              VARCHAR(20) NOT NULL UNIQUE,
    gps_lat          DECIMAL(10,7) NOT NULL,
    gps_lng          DECIMAL(10,7) NOT NULL,
    familySize       INTEGER CHECK (familySize >= 1),
    children_0_5     INTEGER DEFAULT 0 CHECK (children_0_5 >= 0),
    over_60          INTEGER DEFAULT 0 CHECK (over_60 >= 0),
    adults_18_59     INTEGER DEFAULT 0 CHECK (adults_18_59 >= 0),
    elderly          BOOLEAN DEFAULT FALSE,
    disabled         BOOLEAN DEFAULT FALSE,
    pregnant         BOOLEAN DEFAULT FALSE,
    photoUrl         VARCHAR(500),
    jurisdictionId   VARCHAR(24) NOT NULL REFERENCES geographicareas(_id),
    registeredBy     VARCHAR(24) NOT NULL REFERENCES users(_id),
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: household_members (embedded in MongoDB, separate in SQL)
-- MongoDB: households.familyMembers[]
-- ============================================================
CREATE TABLE household_members (
    household_id     VARCHAR(24) NOT NULL REFERENCES households(_id) ON DELETE CASCADE,
    name             VARCHAR(255) NOT NULL,
    age              INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
    idType           VARCHAR(10) NOT NULL CHECK (idType IN ('NID','BIRTH')),
    idNumber         VARCHAR(30) NOT NULL,
    PRIMARY KEY (household_id, idNumber)
);

-- ============================================================
-- Table: itemcategories
-- MongoDB Collection: itemcategories
-- Mongoose Model: ItemCategory (publicModel.js)
-- ============================================================
CREATE TABLE itemcategories (
    _id                      VARCHAR(24) PRIMARY KEY,
    name                     VARCHAR(255) NOT NULL,
    parentCategoryId         VARCHAR(24) REFERENCES itemcategories(_id),
    unit                     VARCHAR(20) DEFAULT 'pcs',
    per_person_per_day_qty   DECIMAL(10,3) DEFAULT 1 CHECK (per_person_per_day_qty >= 0),
    isActive                 BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- Table: distributions (distributionlogs)
-- MongoDB Collection: distributionlogs
-- Mongoose Model: DistributionLog (distributionModel.js)
-- ============================================================
CREATE TABLE distributionlogs (
    _id              VARCHAR(24) PRIMARY KEY,
    householdId      VARCHAR(24) NOT NULL REFERENCES households(_id),
    officerId        VARCHAR(24) NOT NULL REFERENCES users(_id),
    itemCategoryId   VARCHAR(24) NOT NULL REFERENCES itemcategories(_id),
    quantity         DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    unit             VARCHAR(20) NOT NULL,
    gps_lat          DECIMAL(10,7) NOT NULL,
    gps_lng          DECIMAL(10,7) NOT NULL,
    photoUrl         VARCHAR(500),
    distributedAt    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    syncStatus       VARCHAR(10) DEFAULT 'SYNCED' CHECK (syncStatus IN ('PENDING','SYNCED','CONFLICT')),
    isOverride       BOOLEAN DEFAULT FALSE,
    overrideReason   TEXT,
    pledgeId         VARCHAR(24) REFERENCES reliefpledges(_id),
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: duplicatealerts
-- MongoDB Collection: duplicatealerts
-- Mongoose Model: DuplicateAlert (alertModel.js)
-- ============================================================
CREATE TABLE duplicatealerts (
    _id              VARCHAR(24) PRIMARY KEY,
    householdId      VARCHAR(24) NOT NULL REFERENCES households(_id),
    priorLogId       VARCHAR(24) NOT NULL REFERENCES distributionlogs(_id),
    triggeredLogId   VARCHAR(24) REFERENCES distributionlogs(_id),
    itemCategoryId   VARCHAR(24) NOT NULL REFERENCES itemcategories(_id),
    isResolved       BOOLEAN DEFAULT FALSE,
    resolvedBy       VARCHAR(24) REFERENCES users(_id),
    overrideReason   TEXT,
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: syncconflicts
-- MongoDB Collection: syncconflicts
-- Mongoose Model: SyncConflict (publicModel.js)
-- ============================================================
CREATE TABLE syncconflicts (
    _id              VARCHAR(24) PRIMARY KEY,
    documentId       VARCHAR(24) NOT NULL,
    localVersion     JSON,
    serverVersion    JSON,
    resolutionStatus VARCHAR(10) DEFAULT 'PENDING' CHECK (resolutionStatus IN ('PENDING','RESOLVED','AUTO')),
    reviewedBy       VARCHAR(24) REFERENCES users(_id),
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: feedbacks
-- MongoDB Collection: feedbacks
-- Mongoose Model: Feedback (feedbackModel.js)
-- ============================================================
CREATE TABLE feedbacks (
    _id              VARCHAR(24) PRIMARY KEY,
    householdId      VARCHAR(24) REFERENCES households(_id),
    submittedBy      VARCHAR(24) REFERENCES users(_id),
    name             VARCHAR(255) NOT NULL,
    contact          VARCHAR(50),
    category         VARCHAR(20) DEFAULT 'OTHER' CHECK (category IN ('COMPLAINT','SUGGESTION','INQUIRY','APPRECIATION','OTHER')),
    message          VARCHAR(1000) NOT NULL,
    isRead           BOOLEAN DEFAULT FALSE,
    response         TEXT,
    respondedBy      VARCHAR(24) REFERENCES users(_id),
    respondedAt      TIMESTAMP,
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: inventories
-- MongoDB Collection: inventories
-- Mongoose Model: Inventory (inventoryModel.js)
-- ============================================================
CREATE TABLE inventories (
    _id                  VARCHAR(24) PRIMARY KEY,
    itemCategoryId       VARCHAR(24) NOT NULL UNIQUE REFERENCES itemcategories(_id),
    totalQuantity        DECIMAL(12,2) NOT NULL DEFAULT 0 CHECK (totalQuantity >= 0),
    unit                 VARCHAR(20) NOT NULL,
    distributedQuantity  DECIMAL(12,2) DEFAULT 0 CHECK (distributedQuantity >= 0),
    lastRestockedAt      TIMESTAMP,
    notes                TEXT,
    createdAt            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: needassessments
-- MongoDB Collection: needassessments
-- Mongoose Model: NeedAssessment (needModel.js)
-- ============================================================
CREATE TABLE needassessments (
    _id              VARCHAR(24) PRIMARY KEY,
    areaId           VARCHAR(24) NOT NULL REFERENCES geographicareas(_id),
    itemCategoryId   VARCHAR(24) NOT NULL REFERENCES itemcategories(_id),
    calculated_qty   DECIMAL(12,2) NOT NULL CHECK (calculated_qty >= 0),
    override_qty     DECIMAL(12,2) CHECK (override_qty >= 0),
    override_reason  TEXT,
    overriddenBy     VARCHAR(24) REFERENCES users(_id),
    calculated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    calculated_by    VARCHAR(24) REFERENCES users(_id),
    coverageDays     INTEGER DEFAULT 7 CHECK (coverageDays >= 1 AND coverageDays <= 90),
    demo_totalPop    INTEGER DEFAULT 0,
    demo_children05  INTEGER DEFAULT 0,
    demo_over60      INTEGER DEFAULT 0,
    demo_adults1859  INTEGER DEFAULT 0,
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_needassessments_area_item ON needassessments(areaId, itemCategoryId);
CREATE INDEX idx_needassessments_area ON needassessments(areaId);

-- ============================================================
-- Table: reliefpledges
-- MongoDB Collection: reliefpledges
-- Mongoose Model: ReliefPledge (pledgeModel.js)
-- ============================================================
CREATE TABLE reliefpledges (
    _id                      VARCHAR(24) PRIMARY KEY,
    source_type              VARCHAR(20) NOT NULL CHECK (source_type IN ('GOVERNMENT','NGO','INDIVIDUAL','CORPORATE')),
    source_name              VARCHAR(255) NOT NULL,
    source_contact           VARCHAR(255),
    areaId                   VARCHAR(24) REFERENCES geographicareas(_id),
    customArea               VARCHAR(255),
    itemCategoryId           VARCHAR(24) NOT NULL REFERENCES itemcategories(_id),
    total_qty                DECIMAL(12,2) NOT NULL CHECK (total_qty > 0),
    distributed_qty          DECIMAL(12,2) DEFAULT 0 CHECK (distributed_qty >= 0),
    status                   VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','IN_FULFILLMENT','COMPLETED','CANCELLED')),
    pledge_date              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_delivery_date   TIMESTAMP,
    fulfilled_date           TIMESTAMP,
    notes                    TEXT,
    pledgedBy                VARCHAR(24) NOT NULL REFERENCES users(_id),
    createdAt                TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt                TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reliefpledges_area_status ON reliefpledges(areaId, status);
CREATE INDEX idx_reliefpledges_pledgedBy ON reliefpledges(pledgedBy);

-- ============================================================
-- Table: reliefrequests
-- MongoDB Collection: reliefrequests
-- Mongoose Model: ReliefRequest (reliefRequestModel.js)
-- Contains embedded: items[]
-- ============================================================
CREATE TABLE reliefrequests (
    _id              VARCHAR(24) PRIMARY KEY,
    citizenId        VARCHAR(24) NOT NULL REFERENCES users(_id),
    householdId      VARCHAR(24) REFERENCES households(_id),
    description      TEXT,
    status           VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED','FULFILLED')),
    priority         VARCHAR(10) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW','MEDIUM','HIGH','URGENT')),
    location_lat     DECIMAL(10,7),
    location_lng     DECIMAL(10,7),
    location_address VARCHAR(500),
    jurisdictionId   VARCHAR(24) REFERENCES geographicareas(_id),
    reviewedBy       VARCHAR(24) REFERENCES users(_id),
    reviewedAt       TIMESTAMP,
    reviewNotes      TEXT,
    createdAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reliefrequests_citizen_date ON reliefrequests(citizenId, createdAt DESC);
CREATE INDEX idx_reliefrequests_status_jurisdiction ON reliefrequests(status, jurisdictionId);

-- ============================================================
-- Table: reliefrequest_items (embedded in MongoDB, separate in SQL)
-- MongoDB: reliefrequests.items[]
-- ============================================================
CREATE TABLE reliefrequest_items (
    request_id       VARCHAR(24) NOT NULL REFERENCES reliefrequests(_id) ON DELETE CASCADE,
    itemCategoryId   VARCHAR(24) NOT NULL REFERENCES itemcategories(_id),
    quantity         DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
    unit             VARCHAR(20) NOT NULL,
    PRIMARY KEY (request_id, itemCategoryId)
);
