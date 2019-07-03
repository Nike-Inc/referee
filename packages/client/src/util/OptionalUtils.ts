import Optional from 'optional-js';

/**
 * Allows for fetching nested properties in an object that may normally throw a NPE.
 *
 * @param supplier A function that should resolve the desired value.
 * @return an optional of the supplied type that maybe contains the value that the provider was supposed to resolve.
 */
export function safeGet<T>(supplier: () => T | null | undefined): Optional<T> {
  let value = null;

  try {
    value = supplier();
  } catch (e) {
    return Optional.empty();
  }
  return Optional.ofNullable(value);
}

export async function safeGetAsync<T>(supplier: () => Promise<T | null | undefined>): Promise<Optional<T>> {
  let value = null;

  try {
    value = await supplier();
  } catch (e) {
    return Optional.empty();
  }
  return Optional.ofNullable(value);
}

export function mapIfPresentOrElse<T>(
  optional: Optional<T>,
  presentAction: (value: T) => any,
  notPresentAction: () => any
): any {
  if (optional.isPresent()) {
    return presentAction(optional.get());
  } else {
    return notPresentAction();
  }
}

export function trimToNull(value: string): Optional<string> {
  const trimmed = value.trim();
  if (trimmed === '') {
    return Optional.empty();
  }
  return Optional.of(trimmed);
}

export const ofNullable = Optional.ofNullable;

export default {
  safeGet,
  safeGetAsync,
  mapIfPresentOrElse,
  trimToNull
};
