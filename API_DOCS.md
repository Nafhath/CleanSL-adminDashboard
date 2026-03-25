# CleanSL Admin API - Complete Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently using mock tokens. Token format: `mock-token-{userId}`

---

## 👥 Users Endpoints

### Login
```http
POST /users/auth/login
Content-Type: application/json

{
  "email": "aravind@cleansl.com",
  "password": "driver123"
}
```

**Response (200):**
```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Aravind",
    "lastName": "Silva",
    "email": "aravind@cleansl.com",
    "phone": "+94701111111",
    "role": "driver",
    "licenseNumber": "DL-2024-001",
    "status": "active"
  },
  "token": "mock-token-507f1f77bcf86cd799439011"
}
```

### Get All Users
```http
GET /users
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Aravind",
    "lastName": "Silva",
    "email": "aravind@cleansl.com",
    "phone": "+94701111111",
    "role": "driver",
    "status": "active",
    "assignedTruck": "...truck._id"
  }
]
```

### Get User by ID
```http
GET /users/:id
```

### Create User
```http
POST /users
Content-Type: application/json

{
  "firstName": "Lakshan",
  "lastName": "Mendis",
  "email": "lakshan@cleansl.com",
  "password": "secure123",
  "phone": "+94705555555",
  "role": "driver"
}
```

### Update User
```http
PUT /users/:id
Content-Type: application/json

{
  "firstName": "Lakshan",
  "phone": "+94705555555",
  "status": "active"
}
```

### Delete User
```http
DELETE /users/:id
```

---

## 🚚 Trucks Endpoints

### Get All Trucks
```http
GET /trucks
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "truckId": "T-001",
    "registrationNumber": "WP NA-4589",
    "model": "Isuzu Giga Compactor",
    "capacity": 5000,
    "currentLoad": 3250,
    "status": "in-service",
    "driver": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "Aravind",
      "lastName": "Silva"
    },
    "currentLocation": {
      "latitude": 6.9145,
      "longitude": 79.8650,
      "address": "No. 45, Rosmead Place"
    },
    "fuelLevel": 75,
    "mileage": 45230
  }
]
```

### Get Truck by ID
```http
GET /trucks/:id
```

### Get Trucks by Status
```http
GET /trucks/status/in-service
GET /trucks/status/idle
GET /trucks/status/maintenance
```

### Create Truck
```http
POST /trucks
Content-Type: application/json

{
  "truckId": "T-005",
  "registrationNumber": "WP NA-4593",
  "model": "Isuzu Giga Compactor",
  "capacity": 5000,
  "driver": "507f1f77bcf86cd799439011"
}
```

### Update Truck
```http
PUT /trucks/:id
Content-Type: application/json

{
  "status": "in-service",
  "currentLoad": 2500,
  "fuelLevel": 60,
  "mileage": 45300
}
```

### Update Truck Location
```http
PATCH /trucks/:id/location
Content-Type: application/json

{
  "latitude": 6.9200,
  "longitude": 79.8700,
  "address": "Galle Road, Colombo 3"
}
```

### Add Route Point
```http
PATCH /trucks/:id/add-route-point
Content-Type: application/json

{
  "latitude": 6.9250,
  "longitude": 79.8750
}
```

---

## 📋 Complaints Endpoints

### Get All Complaints
```http
GET /complaints
GET /complaints?status=new&page=1&limit=10
GET /complaints?category=missed-collection&priority=high
```

**Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "complaintId": "CMP-001",
      "title": "Missed Collection",
      "description": "Waste bin not collected from Ward 7",
      "category": "missed-collection",
      "priority": "high",
      "status": "new",
      "location": {
        "address": "Cinnamon Gardens",
        "latitude": 6.9145,
        "longitude": 79.8650,
        "ward": "Ward 07"
      },
      "reportedBy": {
        "name": "John Smith",
        "email": "john@example.com",
        "phone": "+94701234567"
      },
      "createdAt": "2024-03-20T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

### Create Complaint
```http
POST /complaints
Content-Type: application/json

{
  "title": "Overflowing Bin",
  "description": "Waste bin is overflowing and needs immediate attention",
  "category": "overflowing-bin",
  "priority": "urgent",
  "location": {
    "address": "Colombo 4",
    "latitude": 6.9100,
    "longitude": 79.8600,
    "ward": "Ward 09"
  },
  "reportedBy": {
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "phone": "+94702345678",
    "citizenId": "IC-123457"
  }
}
```

### Update Complaint
```http
PUT /complaints/:id
Content-Type: application/json

{
  "status": "in-progress",
  "assignedTruck": "507f1f77bcf86cd799439012",
  "assignedDriver": "507f1f77bcf86cd799439011"
}
```

### Resolve Complaint
```http
PUT /complaints/:id
Content-Type: application/json

{
  "status": "resolved",
  "resolution": {
    "description": "Bin emptied and street cleaned",
    "resolutionNote": "Completed by truck T-001"
  },
  "rating": 5,
  "feedback": "Very satisfied with service"
}
```

### Get Complaint Statistics
```http
GET /complaints/stats/overview
```

**Response (200):**
```json
{
  "statusStats": {
    "total": 25,
    "new": 8,
    "inProgress": 5,
    "resolved": 10,
    "rejected": 2
  },
  "categoryStats": [
    { "_id": "missed-collection", "count": 12 },
    { "_id": "damaged-bin", "count": 8 },
    { "_id": "dirty-street", "count": 5 }
  ]
}
```

---

## ⚠️ Violations Endpoints

### Get All Violations
```http
GET /violations
GET /violations?status=reported&severity=critical
GET /violations?type=speeding&page=1&limit=10
```

**Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "violationId": "VIO-001",
      "truck": {
        "_id": "507f1f77bcf86cd799439012",
        "registrationNumber": "WP NA-4589"
      },
      "driver": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "Aravind",
        "lastName": "Silva"
      },
      "type": "speeding",
      "severity": "high",
      "status": "resolved",
      "timestamp": "2024-03-20T10:30:00Z",
      "penalty": {
        "type": "fine",
        "amount": 1000
      }
    }
  ],
  "pagination": { "total": 15, "page": 1, "limit": 10 }
}
```

### Create Violation
```http
POST /violations
Content-Type: application/json

{
  "truck": "507f1f77bcf86cd799439012",
  "driver": "507f1f77bcf86cd799439011",
  "type": "harsh-acceleration",
  "severity": "medium",
  "location": {
    "address": "Colombo 5",
    "latitude": 6.9300,
    "longitude": 79.8800
  },
  "description": "Harsh acceleration detected near school zone"
}
```

### Apply Penalty
```http
PUT /violations/:id
Content-Type: application/json

{
  "status": "under-review",
  "penalty": {
    "type": "fine",
    "amount": 1500,
    "reason": "Speeding in residential area"
  }
}
```

### Get Violation Statistics
```http
GET /violations/stats/overview
```

---

## 📊 Analytics Endpoints

### Get Analytics Records
```http
GET /analytics?page=1&limit=10
GET /analytics?truck=507f1f77bcf86cd799439012
GET /analytics?driver=507f1f77bcf86cd799439011
GET /analytics?startDate=2024-03-01&endDate=2024-03-31
```

**Response (200):**
```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439015",
      "date": "2024-03-20T00:00:00Z",
      "truck": { "_id": "...", "registrationNumber": "WP NA-4589" },
      "driver": { "_id": "...", "firstName": "Aravind" },
      "metrics": {
        "distanceTraveled": 45.2,
        "fuelConsumed": 12.5,
        "fuelEfficiency": 3.62,
        "wasteCollected": 3250,
        "collectionsCompleted": 28,
        "violations": 1,
        "completionRate": 95
      },
      "efficiency": {
        "routeOptimization": 92,
        "timeOnTask": 88,
        "fuelUsageRating": 85,
        "safetyScore": 78
      },
      "status": "completed"
    }
  ],
  "pagination": { "total": 45, "page": 1, "limit": 10 }
}
```

### Create Analytics Record
```http
POST /analytics
Content-Type: application/json

{
  "date": "2024-03-20",
  "truck": "507f1f77bcf86cd799439012",
  "driver": "507f1f77bcf86cd799439011",
  "metrics": {
    "distanceTraveled": 52.3,
    "fuelConsumed": 14.2,
    "fuelEfficiency": 3.68,
    "wasteCollected": 4500,
    "collectionsCompleted": 32,
    "violations": 0,
    "completionRate": 98
  },
  "efficiency": {
    "routeOptimization": 96,
    "timeOnTask": 94,
    "safetyScore": 92
  },
  "status": "completed"
}
```

### Get District Summary
```http
GET /analytics/summary/district
GET /analytics/summary/district?startDate=2024-03-01&endDate=2024-03-31
```

### Get Performance Summary
```http
GET /analytics/summary/performance
```

---

## 🗺️ Maps Endpoints

### Geocode Address
```http
POST /maps/geocode
Content-Type: application/json

{
  "address": "Cinnamon Gardens, Colombo"
}
```

**Response (200):**
```json
{
  "lat": 6.9145,
  "lng": 79.8650,
  "success": true
}
```

### Reverse Geocode
```http
POST /maps/reverse-geocode
Content-Type: application/json

{
  "lat": 6.9145,
  "lng": 79.8650
}
```

**Response (200):**
```json
{
  "address": "No. 45, Rosmead Place, Cinnamon Gardens",
  "success": true
}
```

### Calculate Distance
```http
POST /maps/distance
Content-Type: application/json

{
  "origin": { "lat": 6.9145, "lng": 79.8650 },
  "destination": { "lat": 6.9200, "lng": 79.8700 }
}
```

**Response (200):**
```json
{
  "distance": "3.2 km",
  "distanceValue": 3200,
  "duration": "8 mins",
  "durationValue": 480,
  "success": true
}
```

### Get Directions
```http
POST /maps/directions
Content-Type: application/json

{
  "origin": { "lat": 6.9145, "lng": 79.8650 },
  "destination": { "lat": 6.9300, "lng": 79.8800 }
}
```

### Check Geofence
```http
POST /maps/check-geofence
Content-Type: application/json

{
  "point": { "lat": 6.9150, "lng": 79.8655 },
  "center": { "lat": 6.9145, "lng": 79.8650 },
  "radiusKm": 1
}
```

**Response (200):**
```json
{
  "isInside": true,
  "radiusKm": 1
}
```

---

## ✅ Health Check

```http
GET /health
```

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-03-20T10:30:00Z",
  "version": "1.0.0"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Latitude and longitude are required"
}
```

### 404 Not Found
```json
{
  "error": "Truck not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Rate Limiting
Currently no rate limiting implemented. Recommended for production:
- 100 requests per minute for authenticated users
- 20 requests per minute for public endpoints

## CORS
Enabled for: `http://localhost:3000`

## Content Type
All requests expect: `Content-Type: application/json`
