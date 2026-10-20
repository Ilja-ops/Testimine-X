import { test, expect } from '@playwright/test';

// Reset inventory before every test.
test.beforeEach(async ({ request }) => {
  await request.post('/reset');
});

// TC-01 · REQ-API-01
test('TC-01 GET /items returns 200 and two items', async ({ request }) => {
  const res = await request.get('/items');
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(Array.isArray(body)).toBe(true);
  expect(body).toHaveLength(2);
});

// TC-02 · REQ-API-02
test('TC-02 GET /items/1 returns an item', async ({ request }) => {
  const res = await request.get('/items/1');
  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.id).toBe(1);
  expect(body.sku).toBe('A-1');
  expect(body.qty).toBe(5);
});

// TC-03 · REQ-API-02
test('TC-03 GET /items/999 returns 404 with error body', async ({ request }) => {
  const res = await request.get('/items/999');
  expect(res.status()).toBe(404);
  expect(await res.json()).toEqual({ error: 'not found' });
});

// TC-04 · REQ-API-03
test('TC-04 POST /items creates a valid item', async ({ request }) => {
  const res = await request.post('/items', {
    data: { sku: 'C-3', qty: 2 },
  });

  expect(res.status()).toBe(201);
  const body = await res.json();
  expect(body.id).toBeDefined();
  expect(body.sku).toBe('C-3');
  expect(body.qty).toBe(2);
});

// TC-05 · REQ-API-03
test('TC-05 POST /items accepts quantity zero', async ({ request }) => {
  const res = await request.post('/items', {
    data: { sku: 'C-3', qty: 0 },
  });

  expect(res.status()).toBe(201);
  expect((await res.json()).qty).toBe(0);
});

// TC-06 · REQ-API-03
test('TC-06 POST /items rejects negative quantity', async ({ request }) => {
  const res = await request.post('/items', {
    data: { sku: 'C-3', qty: -1 },
  });

  expect(res.status()).toBe(400);
  expect(await res.json()).toEqual({ error: 'invalid qty' });
});

// TC-07 · REQ-API-04
test('TC-07 POST /items rejects invalid SKU', async ({ request }) => {
  const res = await request.post('/items', {
    data: { sku: 'bad sku!', qty: 1 },
  });

  expect(res.status()).toBe(400);
  expect(await res.json()).toEqual({ error: 'invalid sku' });
});

// TC-08 · REQ-API-05
test('TC-08 PUT /items/1 updates the item', async ({ request }) => {
  const res = await request.put('/items/1', {
    data: { sku: 'A-1', qty: 7 },
  });

  expect(res.status()).toBe(200);
  const body = await res.json();
  expect(body.id).toBe(1);
  expect(body.qty).toBe(7);
});

// TC-09 · REQ-API-06 and REQ-API-07
test('TC-09 DELETE /items/1 returns 204 and item is gone', async ({ request }) => {
  const res = await request.delete('/items/1');

  expect(res.status()).toBe(204);
  expect(await res.text()).toBe('');

  const getRes = await request.get('/items/1');
  expect(getRes.status()).toBe(404);
});

// TC-10 · REQ-API-06
test('TC-10 DELETE /items/999 returns 404', async ({ request }) => {
  const res = await request.delete('/items/999');
  expect(res.status()).toBe(404);
});