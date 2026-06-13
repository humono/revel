export type CountryCode = 'ES' | 'US' | 'GB' | 'FR' | 'DE';

interface CountryPhoneConfig {
  prefix: string;
  length: number;
  customGenerator?: () => string;
}

export class PhoneGenerator {
  private static countryConfig: Record<CountryCode, CountryPhoneConfig> = {
    ES: {
      prefix: '+34',
      length: 9,
      customGenerator: () => {
        // Spanish mobile numbers start with 6 or 7
        const firstDigit = Math.random() < 0.9 ? '6' : '7';
        const rest = PhoneGenerator.generateRandomNumber(8);
        return firstDigit + rest;
      }
    },

    US: {
      prefix: '+1',
      length: 10
    },

    GB: {
      prefix: '+44',
      length: 10
    },

    FR: {
      prefix: '+33',
      length: 9
    },

    DE: {
      prefix: '+49',
      length: 10
    }
  };

  static generate(country: CountryCode = 'ES'): string {
    const config = this.countryConfig[country];

    const number = config.customGenerator
      ? config.customGenerator()
      : this.generateRandomNumber(config.length);

    return `${config.prefix}${number}`;
  }

  private static generateRandomNumber(length: number): string {
    let result = '';

    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10);
    }

    return result;
  }
}