export class NameGenerator {
  private static firstNames = [
    'Alejandro', 'Daniel', 'Pablo', 'Sergio', 'Javier',
    'David', 'Adrián', 'Carlos', 'Miguel', 'Álvaro',
    'Lucía', 'Sofía', 'María', 'Paula', 'Carla',
    'Elena', 'Carmen', 'Laura', 'Sara', 'Marta'
  ];

  /**
   * Generates a Spanish-style name with timestamp surname:
   * Example: "Lucía 1705332456789"
   */
  static generate(): string {
    const firstName = this.getRandomFirstName();
    const timestamp = Date.now();

    return `${firstName} ${timestamp}`;
  }

  /**
   * Returns a random Spanish first name
   */
  static getRandomFirstName(): string {
    return this.firstNames[
      Math.floor(Math.random() * this.firstNames.length)
    ];
  }
}