export class TextUtiltiies {
  static normalize(text: string): string {
    return text.replace(/\s+/g, " ").trim().toLowerCase();
  }
}
