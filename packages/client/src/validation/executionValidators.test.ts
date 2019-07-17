import {
  ALL_KVS_MUST_BE_NON_EMPTY_STRINGS,
  DUPLICATE_SCOPE_KEYS_ERROR_MESSAGE,
  validateExtendedScopeParams
} from './executionValidators';

test('test that validateExtendedScopeParams() returns errors as expected when there are duplicate keys', () => {
  const expectedErrorKey = 'control-extended-scope-params';
  const validationResults = validateExtendedScopeParams('control', [
    { key: 'key1', value: 'foo' },
    { key: 'key1', value: 'bar' },
    { key: 'key2', value: 'bam' }
  ]);

  expect(validationResults.isValid).toBe(false);
  expect(Object.keys(validationResults.errors).length).toBe(1);
  expect(validationResults.errors).toEqual({
    [expectedErrorKey]: DUPLICATE_SCOPE_KEYS_ERROR_MESSAGE
  });
});

test('test that validateExtendedScopeParams() returns no errors when the data is as expected', () => {
  const validationResults = validateExtendedScopeParams('control', [
    { key: 'key1', value: 'foo' },
    { key: 'key2', value: 'bam' }
  ]);

  expect(validationResults.isValid).toBe(true);
  expect(Object.keys(validationResults.errors).length).toBe(0);
});

test('test that validateExtendedScopeParams() returns an error when a key is empty', () => {
  const expectedErrorKey = 'control-extended-scope-params';
  const validationResults = validateExtendedScopeParams('control', [
    { key: ' ', value: 'foo' },
    { key: 'key2', value: 'bam' }
  ]);

  expect(validationResults.isValid).toBe(false);
  expect(Object.keys(validationResults.errors).length).toBe(1);
  expect(validationResults.errors).toEqual({
    [expectedErrorKey]: ALL_KVS_MUST_BE_NON_EMPTY_STRINGS
  });
});

test('test that validateExtendedScopeParams() returns an error when a value is empty', () => {
  const expectedErrorKey = 'control-extended-scope-params';
  const validationResults = validateExtendedScopeParams('control', [
    { key: 'key1', value: ' ' },
    { key: 'key2', value: 'bam' }
  ]);

  expect(validationResults.isValid).toBe(false);
  expect(Object.keys(validationResults.errors).length).toBe(1);
  expect(validationResults.errors).toEqual({
    [expectedErrorKey]: ALL_KVS_MUST_BE_NON_EMPTY_STRINGS
  });
});

test('test that validateExtendedScopeParams() returns an error as expected when there are multiple errors', () => {
  const expectedErrorKey = 'control-extended-scope-params';
  const validationResults = validateExtendedScopeParams('control', [
    { key: 'key1', value: ' ' },
    { key: 'key2', value: 'bam' },
    { key: 'key2', value: 'foo' }
  ]);
  expect(validationResults.isValid).toBe(false);
  expect(Object.keys(validationResults.errors).length).toBe(1);
  expect(validationResults.errors[expectedErrorKey]).toMatch(DUPLICATE_SCOPE_KEYS_ERROR_MESSAGE);
  expect(validationResults.errors[expectedErrorKey]).toMatch(ALL_KVS_MUST_BE_NON_EMPTY_STRINGS);
});

test('test that validateExtendedScopeParams() returns an error with the scope type in the key', () => {
  const keyPrefix = 'foo-bar-baz';
  const validationResults = validateExtendedScopeParams(keyPrefix, [{ obviously: 'broken' } as any]);
  expect(validationResults.isValid).toBe(false);
  expect(Object.keys(validationResults.errors).length).toBe(1);
  expect(Object.keys(validationResults.errors)[0]).toMatch(keyPrefix);
});
