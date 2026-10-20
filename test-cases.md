# Test Case Specification – MiniShop

## A. Business Logic

| TC | REQ | Priority | Input | Expected result | Automated test |
|---|---|---|---|---|---|
| TC-L-01 | REQ-L-01 | High | query = "mouse" | Wireless Mouse found | UT-02 |
| TC-L-02 | REQ-L-01 | High | query = "tablet" | Empty array | UT-03 |
| TC-L-03 | REQ-L-02 | High | mode = "price-asc" | Cheapest item first | UT-06 |
| TC-L-04 | REQ-L-02 | High | mode = "price-desc" | Most expensive item first | UT-07 |
| TC-L-05 | REQ-L-03 | High | price=39, qty=2 | Total = 78 | UT-09 |
| TC-L-06 | REQ-L-04 | High | rows=39+24.5, rate=0.10 | subtotal=63.5, discount=6.35, total=57.15 | UT-13 |
| TC-L-07 | REQ-L-05 | High | qty=0 | Result = 1 | UT-18 |
| TC-L-08 | REQ-L-05 | High | qty=2.7 | Result = 2 | UT-17 |
| TC-L-09 | REQ-L-06 | Medium | code=SAVE10 | Rate = 0.10 | UT-19 |
| TC-L-10 | REQ-L-07 | High | Valid checkout details | Empty error object | UT-23 |

## B. Inventory API

Precondition: server is running and POST /reset has been executed.

| TC | REQ | Priority | Request | Expected status | Expected body | Type |
|---|---|---|---|---|---|---|
| TC-01 | REQ-API-01 | High | GET /items | 200 | Array of 2 items | Positive |
| TC-02 | REQ-API-02 | High | GET /items/1 | 200 | Item with id 1 | Positive |
| TC-03 | REQ-API-02 | High | GET /items/999 | 404 | {"error":"not found"} | Negative |
| TC-04 | REQ-API-03 | High | POST /items, sku=C-3, qty=2 | 201 | Created item, new id | Positive |
| TC-05 | REQ-API-03 | High | POST /items, sku=C-3, qty=0 | 201 | Created item with qty 0 | Boundary |
| TC-06 | REQ-API-03 | High | POST /items, sku=C-3, qty=-1 | 400 | {"error":"invalid qty"} | Negative |
| TC-07 | REQ-API-04 | Medium | POST /items, sku="bad sku!", qty=1 | 400 | {"error":"invalid sku"} | Negative |
| TC-08 | REQ-API-05 | High | PUT /items/1 with valid body | 200 | Updated item | Positive |
| TC-09 | REQ-API-06, REQ-API-07 | High | DELETE /items/1, then GET /items/1 | 204, then 404 | Empty body, then not found | Boundary |
| TC-10 | REQ-API-06 | High | DELETE /items/999 | 404 | Error response | Negative |

## Not yet tested

REQ-API-08: JSON Content-Type for every response except 204.