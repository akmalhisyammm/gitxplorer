import { describe, expect, test } from 'vitest';

import { generateURLQuery } from '../src/utils/url';

describe('[utils] generateURLQuery', () => {
  test('should return empty string when query is empty', () => {
    expect(generateURLQuery({})).toBe('');
  });

  test('should return query string with single key when query contains single key', () => {
    expect(generateURLQuery({ key: 'value' })).toBe('key=value');
  });

  test('should return query string with multiple keys when query contains multiple keys', () => {
    expect(generateURLQuery({ key: 'value', key2: 'value2' })).toBe(
      'key=value&key2=value2',
    );
  });
});
