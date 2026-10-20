
const {
  filterProducts,
  sortProducts,
  lineTotal,
  cartTotals,
  normalizeQuantity,
  discountRateFor,
  validateCheckout,
} = require('./shop-logic');

const PRODUCTS = [
  { id: 1, name: 'Laptop Stand', price: 29.90 },
  { id: 2, name: 'USB-C Hub', price: 39.00 },
  { id: 3, name: 'Monitor 27"', price: 249.00 },
  { id: 4, name: 'Wireless Mouse', price: 24.50 },
];

describe('filterProducts', () => {
  test('UT-01 empty query returns all products', () => {
    expect(filterProducts(PRODUCTS, '')).toHaveLength(4);
  });

  test('UT-02 lowercase query finds product', () => {
    expect(filterProducts(PRODUCTS, 'mouse')).toEqual([PRODUCTS[3]]);
  });

  test('UT-03 unmatched query returns empty array', () => {
    expect(filterProducts(PRODUCTS, 'tablet')).toEqual([]);
  });

  test('UT-04 undefined query returns all products', () => {
    expect(filterProducts(PRODUCTS, undefined)).toHaveLength(4);
  });
});

describe('sortProducts', () => {
  test('UT-05 sorts names alphabetically', () => {
    expect(sortProducts(PRODUCTS, 'name').map(p => p.name)).toEqual([
      'Laptop Stand',
      'Monitor 27"',
      'USB-C Hub',
      'Wireless Mouse',
    ]);
  });

  test('UT-06 sorts prices ascending', () => {
    expect(sortProducts(PRODUCTS, 'price-asc')[0].price).toBe(24.50);
  });

  test('UT-07 sorts prices descending', () => {
    expect(sortProducts(PRODUCTS, 'price-desc')[0].price).toBe(249.00);
  });

  test('UT-08 does not mutate input array', () => {
    const original = [...PRODUCTS];
    sortProducts(PRODUCTS, 'price-asc');
    expect(PRODUCTS).toEqual(original);
  });
});

describe('lineTotal', () => {
  test('UT-09 calculates price times quantity', () => {
    expect(lineTotal(39, 2)).toBe(78);
  });

  test('UT-10 calculates fractional prices', () => {
    expect(lineTotal(24.5, 3)).toBe(73.5);
  });

  test('UT-11 rounds result to two decimals', () => {
    expect(lineTotal(0.1, 3)).toBe(0.3);
  });

  test('UT-12 zero price returns zero', () => {
    expect(lineTotal(0, 5)).toBe(0);
  });
});

describe('cartTotals', () => {
  const rows = [
    { price: 39, qty: 1 },
    { price: 24.5, qty: 1 },
  ];

  test('UT-13 applies discount to the whole basket', () => {
    expect(cartTotals(rows, 0.10)).toEqual({
      subtotal: 63.5,
      discount: 6.35,
      total: 57.15,
    });
  });

  test('UT-14 zero discount leaves subtotal unchanged', () => {
    expect(cartTotals(rows, 0)).toEqual({
      subtotal: 63.5,
      discount: 0,
      total: 63.5,
    });
  });

  test('UT-15 empty basket returns zero totals', () => {
    expect(cartTotals([], 0.10)).toEqual({
      subtotal: 0,
      discount: 0,
      total: 0,
    });
  });

  test('UT-16 quantity is included in subtotal', () => {
    expect(cartTotals([{ price: 39, qty: 3 }], 0)).toEqual({
      subtotal: 117,
      discount: 0,
      total: 117,
    });
  });
});

describe('normalizeQuantity', () => {
  test.each([
    [3, 3],
    ['3', 3],
    [2.7, 2],
    [1, 1],
  ])('UT-17 valid quantity %p becomes %p', (input, expected) => {
    expect(normalizeQuantity(input)).toBe(expected);
  });

  test.each([
    [0, 1],
    [-5, 1],
    ['abc', 1],
    ['', 1],
    [null, 1],
    [NaN, 1],
  ])('UT-18 invalid quantity %p becomes %p', (input, expected) => {
    expect(normalizeQuantity(input)).toBe(expected);
  });
});

describe('discountRateFor', () => {
  test('UT-19 SAVE10 gives 10 percent discount', () => {
    expect(discountRateFor('SAVE10')).toBe(0.10);
  });

  test('UT-20 SAVE20 ignores case and spaces', () => {
    expect(discountRateFor(' save20 ')).toBe(0.20);
  });

  test('UT-21 unknown code gives zero discount', () => {
    expect(discountRateFor('UNKNOWN')).toBe(0);
  });

  test('UT-22 empty code gives zero discount', () => {
    expect(discountRateFor('')).toBe(0);
  });
});

describe('validateCheckout', () => {
  test('UT-23 valid checkout returns empty object', () => {
    expect(validateCheckout({
      name: 'Mari Maasikas',
      email: 'mari@example.com',
      address: 'Tallinn, Estonia',
    })).toEqual({});
  });

  test('UT-24 empty checkout returns three errors', () => {
    expect(Object.keys(validateCheckout({}))).toHaveLength(3);
  });

  test.each([
    ['M', true],
    ['Ma', false],
  ])('UT-25 name %p invalid status is %p', (name, invalid) => {
    const errors = validateCheckout({
      name,
      email: 'mari@example.com',
      address: 'Tallinn',
    });
    expect(Boolean(errors.name)).toBe(invalid);
  });

  test.each([
    ['mari', true],
    ['mari@', true],
    ['mari@example', true],
    ['mari maasikas@example.com', true],
    ['mari@example.com', false],
  ])('UT-26 email %p invalid status is %p', (email, invalid) => {
    const errors = validateCheckout({
      name: 'Mari',
      email,
      address: 'Tallinn',
    });
    expect(Boolean(errors.email)).toBe(invalid);
  });

  test('UT-27 whitespace address is invalid', () => {
    expect(Boolean(validateCheckout({
      name: 'Mari',
      email: 'mari@example.com',
      address: '   ',
    }).address)).toBe(true);
  });

  test('UT-28 missing name is invalid', () => {
    expect(Boolean(validateCheckout({
      email: 'mari@example.com',
      address: 'Tallinn',
    }).name)).toBe(true);
  });

  test('UT-29 missing email is invalid', () => {
    expect(Boolean(validateCheckout({
      name: 'Mari',
      address: 'Tallinn',
    }).email)).toBe(true);
  });

  test('UT-30 missing address is invalid', () => {
    expect(Boolean(validateCheckout({
      name: 'Mari',
      email: 'mari@example.com',
    }).address)).toBe(true);
  });

  test('UT-31 whitespace name is invalid', () => {
    expect(Boolean(validateCheckout({
      name: '   ',
      email: 'mari@example.com',
      address: 'Tallinn',
    }).name)).toBe(true);
  });

  test('UT-32 whitespace email is invalid', () => {
    expect(Boolean(validateCheckout({
      name: 'Mari',
      email: '   ',
      address: 'Tallinn',
    }).email)).toBe(true);
  });

  test('UT-33 email without domain is invalid', () => {
    expect(Boolean(validateCheckout({
      name: 'Mari',
      email: 'mari@',
      address: 'Tallinn',
    }).email)).toBe(true);
  });

  test('UT-34 email without top-level domain is invalid', () => {
    expect(Boolean(validateCheckout({
      name: 'Mari',
      email: 'mari@example',
      address: 'Tallinn',
    }).email)).toBe(true);
  });

  test('UT-35 valid checkout accepts trimmed name', () => {
    expect(validateCheckout({
      name: ' Mari ',
      email: 'mari@example.com',
      address: 'Tallinn',
    })).toEqual({});
  });
});