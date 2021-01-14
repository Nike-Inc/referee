import { safeGet, safeGetAsync, trimToEmpty } from '../OptionalUtils';

describe('OptionalUtils safeGet', () => {
  it('should safely get value', () => {
    const inputObject = 'foo';
    const expectedValue = 'foo';
    const actualValue = safeGet(() => inputObject);
    expect(actualValue.get()).toEqual(expectedValue);
  });

  it('should safely get value of null and return empty', () => {
    const inputObject = null;
    const actualValue = safeGet(() => inputObject);
    expect(actualValue.isPresent()).toEqual(false);
  });

  it('should safely get value of undefined and return empty', () => {
    const inputObject = undefined;
    const actualValue = safeGet(() => inputObject);
    expect(actualValue.isPresent()).toEqual(false);
  });

  it('should safely get value of nested object', () => {
    const inputObject = {
      foo: {
        bar: 'baz'
      }
    };
    const expectedValue = 'baz';
    const actualValue = safeGet(() => inputObject.foo.bar);
    expect(actualValue.get()).toEqual(expectedValue);
  });

  it('should safely get value of null in nested object and return empty', () => {
    const inputObject = {
      foo: {
        bar: null
      }
    };
    const actualValue = safeGet(() => inputObject.foo.bar);
    expect(actualValue.isPresent()).toEqual(false);
  });

  it('should safely get value of undefined in nested object and return empty', () => {
    const inputObject = {
      foo: {
        bar: undefined
      }
    };
    const actualValue = safeGet(() => inputObject.foo.bar);
    expect(actualValue.isPresent()).toEqual(false);
  });
});

describe('OptionalUtils safeGetAsync', () => {
  it('should safely get value', async () => {
    const inputObject = Promise.resolve('foo');
    const expectedValue = 'foo';
    const actualValue = await safeGetAsync(() => inputObject);
    expect(actualValue.get()).toEqual(expectedValue);
  });

  it('should safely get value of null and return empty', async () => {
    const inputObject = Promise.resolve(null);
    const actualValue = await safeGetAsync(() => inputObject);
    expect(actualValue.isPresent()).toEqual(false);
  });

  it('should safely get value of undefined and return empty', async () => {
    const inputObject = Promise.resolve(undefined);
    const actualValue = await safeGetAsync(() => inputObject);
    expect(actualValue.isPresent()).toEqual(false);
  });
});

describe('OptionalUtils trimToEmpty', () => {
  it('should trim string and return string', () => {
    const inputString = ' test      ';
    const expectedString = 'test';
    const actualString = trimToEmpty(inputString);
    expect(actualString.get()).toEqual(expectedString);
  });

  it('should trim already trimmed string and return string', () => {
    const inputString = 'test';
    const expectedString = 'test';
    const actualString = trimToEmpty(inputString);
    expect(actualString.get()).toEqual(expectedString);
  });

  it('should trim empty string and return empty', () => {
    const inputString = '';
    const actualString = trimToEmpty(inputString);
    expect(actualString.isPresent()).toEqual(false);
  });

  it('should trim undefined string and return empty', () => {
    const inputString = undefined;
    const actualString = trimToEmpty(inputString);
    expect(actualString.isPresent()).toEqual(false);
  });
});
