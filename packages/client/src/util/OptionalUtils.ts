import Optional from 'optional-js';

export default class OptionalUtils {
  private constructor() {}

  /**
   * Allows for fetching nested properties in an object that may normally through NPE's.
   *
   * @param supplier A function that should resolve the desired value.
   * @return an optional of the supplied type that maybe contains the value that the provider was supposed to resolve.
   */
  static safeGet<T>(supplier: () => T | null | undefined): Optional<T> {
    let value = null;

    try {
      value = supplier();
    } catch (e) {
      return Optional.empty();
    }
    return Optional.ofNullable(value);
  }

  static async safeGetAsync<T>(supplier: () => Promise<T | null | undefined>): Promise<Optional<T>> {
    let value = null;

    try {
      value = await supplier();
    } catch (e) {
      return Optional.empty();
    }
    return Optional.ofNullable(value);
  }

  static mapIfPresentOrElse<T>(
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

  static trimToNull(value: string): Optional<string> {
    const trimmed = value.trim();
    if (trimmed === '') {
      return Optional.empty();
    }
    return Optional.of(trimmed);
  }
}
