import { colord } from "colord";
import { ThemeProperty } from "./ThemeProperty";
import { ThemeValueFilterProps } from "./types";

/**
 * ColorProperty extends the base `ThemeProperty` class in order to customize how
 * Tailwind theme color property values get output to CSS variables; it converts
 * user-defined HEX codes to HSL values, with fall-back to the HEX codes.
 */
export class ColorProperty extends ThemeProperty {
  // inject "color" into the generated CSS variable names:
  protected getBasePrefix(): string {
    return "color";
  }

  // convert CSS variable values to HSL format:
  protected filterCssVariableValue({
    themePropertyValue,
  }: ThemeValueFilterProps) {
    const hslValue = colord(themePropertyValue)
      .alpha(1)
      .toHslString()
      // remove hsl()
      .replace(/hsl\((.*)\)/g, "$1")
      // remove commas
      .replace(/,/g, "");

    return hslValue;
  }

  // convert CSS property values to use the generated CSS variables AND to fallback to hex color (fallback is necessary for tailwind autocomplete to show colors)
  protected filterCssPropertyValue({
    themePropertyKey,
    themePropertyValue,
  }: ThemeValueFilterProps) {
    const hexValue = colord(themePropertyValue).alpha(1).toHex();
    return `hsl(var(${this.getCssVariableName(
      themePropertyKey
    )}, ${hexValue}) / <alpha-value>)`;
  }
}
