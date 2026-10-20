# MiniShop Defect Report

## D-A-01 — GET /items/:id returns 200 for unknown ID
- Requirement: REQ-API-02
- Found by: TC-03
- Severity: High
- Location: server.js, GET /items/:id handler
- Reproduce: `GET /items/999`
- Expected: HTTP 404, `{ "error": "not found" }`
- Actual: HTTP 200
- Status: Open

## D-A-02 — POST /items accepts negative quantity
- Requirement: REQ-API-03
- Found by: TC-06
- Severity: High
- Location: server.js, POST /items handler
- Reproduce: POST `/items` with body `{"sku":"C-3","qty":-1}`
- Expected: HTTP 400, `{ "error": "invalid qty" }`
- Actual: HTTP 201
- Status: Open

## D-A-03 — DELETE /items/:id returns wrong status
- Requirement: REQ-API-06
- Found by: TC-09
- Severity: High
- Location: server.js, DELETE /items/:id handler
- Reproduce: `DELETE /items/1`
- Expected: HTTP 204 with empty body
- Actual: HTTP 200
- Status: Open

## Logic defects
- D-L-01: sortProducts sorts prices incorrectly in descending order. Found by UT-07.
- D-L-02: cartTotals applies discount to only the first row. Found by UT-13.
- D-L-03: normalizeQuantity accepts invalid zero quantities. Found by UT-18.
- D-L-04: validateCheckout accepts email without a top-level domain. Found by UT-26 and UT-34.