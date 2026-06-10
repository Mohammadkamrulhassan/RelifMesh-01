# Test Credentials — ReliefMesh v2
**Project:** ReliefMesh — Disaster Response & Relief Management System
**Team:** Team_Skipper | **Course:** CSE-3208 System Analysis & Design Lab
**Last Updated:** 2026-06-10

---

## Test Accounts (for Development & QA)

| Role | Phone Number | OTP | Name | Notes |
|------|-------------|-----|------|-------|
| **Super Admin** | +8801700000001 | 123456 | Super Admin | Full system access |
| **Admin** | +8801700000002 | 123456 | Admin User | User management, audit |
| **NGO Admin** | +8801700000003 | 123456 | Brac Relief Team | Campaigns, inventory |
| **Govt Official** | +8801700000004 | 123456 | UNO Dhaka | Relief verification |
| **Volunteer** | +8801700000005 | 123456 | Volunteer Rafiq | Rescue missions |
| **Volunteer 2** | +8801700000006 | 123456 | Volunteer Karim | Rescue missions |
| **Donor** | +8801700000007 | 123456 | Donor Salma | Campaign donations |
| **Victim** | +8801700000008 | 123456 | Victim Ayesha | SOS, relief requests |
| **Victim 2** | +8801700000009 | 123456 | Victim Hossain | SOS, relief requests |

---

## API Test Users (for Backend Testing)

```json
[
  { "phone": "+8801700000001", "role": "super_admin" },
  { "phone": "+8801700000002", "role": "admin" },
  { "phone": "+8801700000003", "role": "ngo" },
  { "phone": "+8801700000004", "role": "govt" },
  { "phone": "+8801700000005", "role": "volunteer" },
  { "phone": "+8801700000006", "role": "volunteer" },
  { "phone": "+8801700000007", "role": "donor" },
  { "phone": "+8801700000008", "role": "victim" },
  { "phone": "+8801700000009", "role": "victim" }
]
```

---

## Test OTP Config (Development)

- **OTP bypass:** All test accounts use OTP `123456` in development
- **OTP expiry:** 5 minutes
- **Resend limit:** 3 requests per 10 minutes
- **Max attempts:** 5 before phone is blocked for 30 minutes

---

## Payment Gateway Test Cards

| Gateway | Test Number | Amount | Status |
|---------|-------------|--------|--------|
| bKash | 017XXXXXXXX | ৳1–50,000 | Successful |
| Nagad | 017XXXXXXXX | ৳1–50,000 | Successful |
| Rocket | 017XXXXXXXX | ৳1–50,000 | Successful |

*Note: Test card details to be configured in the payment gateway sandbox dashboard.*

---

## Environment Variables (Development)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/reliefmesh_dev
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=dev-secret-do-not-use-in-production
JWT_REFRESH_SECRET=dev-refresh-secret
OTP_BYPASS=123456

# SMS (Twilio / local mock)
SMS_PROVIDER=mock
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Payment (Sandbox)
BKASH_MERCHANT_NUMBER=
NAGAD_MERCHANT_NUMBER=
ROCKET_MERCHANT_NUMBER=

# App
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

*End — For production deployment, replace with real credentials and secure secrets.*
