export class EmailGenerator {
  /**
   * Generates a unique email address using the current timestamp. Email format: test.automation.1781272985@driverevel.com
   */
  static generate(): string {
    const timestamp = Date.now();
    return `test.automation.${timestamp}@driverevel.com`;
  }
}
