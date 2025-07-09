# API Test Summary - QA Challenge
### Nicolás Sira
## 📋 Test Definitions

| Test ID | Endpoint | Description | Request Body | Expected Result |
|--------|----------|-------------|---------------|------------------|
| API01 | POST /api/User/login | Login with valid credentials | `{ "username": "testuser", "password": "password" }` | 200 OK with JWT token |
| API02 | POST /api/User/login | Login with invalid password | `{ "username": "testuser", "password": "wrongpass" }` | 401/403 Unauthorized |
| API03 | POST /api/User/login | Login with invalid username | `{ "username": "wronguser", "password": "password" }` | 401/403 Unauthorized |
| API04 | POST /api/User/login | Login with missing fields | `{}` | 400 Bad Request |
| API05 | GET /api/Product/1 | Get non-existent product | None | 404 Not Found |
| API06 | POST /api/Product | Create valid product ID 1 | `{ "id": 1, "name": "New Product", "price": 9.99 }` | 201 Created |
| API07 | POST /api/Product | Duplicate product ID 1 | `{ "id": 1, "name": "New Product", "price": 9.99 }` | 400 Error |
| API08 | POST /api/Product | Negative ID | `{ "id": -1, "name": "Invalid", "price": 9.99 }` | 400/422 Client Error |
| API09 | POST /api/Product | Zero ID | `{ "id": 0, "name": "Invalid", "price": 9.99 }` | 400/422 Client Error |
| API10 | POST /api/Product | Price as string | `{ "id": 3, "name": "String price", "price": "text" }` | 400/422 Error |
| ... | ... | ... | ... | ... |

(*Partial list shown. Full table includes login, product, and order endpoints*)

---

## ✅ Test Execution Results

| Test ID | Name | Status Code | Passed | Failed |
|--------|------|-------------|--------|--------|
| API01 | Login - Valid | 200 | ✅ 2 | ❌ 1 |
| API02 | Login - Invalid Password | 401 | ✅ 1 | ❌ 0 |
| API03 | Login - Invalid Username | 401 | ✅ 1 | ❌ 0 |
| API04 | Login - Missing Fields | 400 | ✅ 1 | ❌ 0 |
| API05 | Get Product by ID - Before Create | 200 | ❌ 0 | ❌ 1 |
| API06 | Create Product - Valid ID 1 | 201 | ✅ 1 | ❌ 0 |
| API07 | Create Product - Duplicate ID 1 | 201 | ❌ 0 | ❌ 1 |
| API08 | Create Product - Invalid Negative ID | 201 | ❌ 0 | ❌ 2 |
| ... | ... | ... | ... | ... |

---

## ❗ Defects / Failed Tests

| Test ID | Description | Expected | Actual | Notes |
|--------|-------------|----------|--------|-------|
| API01 | Token does not look like valid JWT | 3-part JWT | malformed | Needs backend fix or mock validator |
| API05 | Getting non-existent product returns 200 | 404 Not Found | 200 OK | Product ID might have been created beforehand |
| API07 | Duplicate product accepted | 400 Error | 201 Created | Missing duplicate validation |
| API08 | Negative ID accepted | 400 Error | 201 Created | No server-side validation on ID |
| ... | ... | ... | ... | ... |

---

## 📌 Summary

- **Total Tests:** 50 (approx)
- ✅ **Passed:** 29  
- ❌ **Failed:** 21  
- Most failed tests are related to lack of input validation in backend (e.g. ID constraints, duplicates).
- Login and basic CRUD operations are mostly functional.
- Test cases cover happy paths and negative/edge cases.

