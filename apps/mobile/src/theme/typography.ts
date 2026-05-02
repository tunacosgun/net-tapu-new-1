import { Platform, TextStyle } from 'react-native';

const sans = Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' });
const sansMedium = Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' });

const w = (weight: TextStyle['fontWeight']): TextStyle =>
  Platform.OS === 'android'
    ? { fontFamily: weight === '700' || weight === '600' ? 'sans-serif-medium' : 'sans-serif', fontWeight: weight }
    : { fontFamily: sans, fontWeight: weight };

/**
 * NetTapu Typography — auction-house dignified, real-estate confident.
 * Five tracks: display (hero), headings, body, supporting, numeric (price).
 */
export const Typography = {
  // Display — hero moments
  displayLg: { fontSize: 40, lineHeight: 46, letterSpacing: -1.0, ...w('800') } as TextStyle,
  display:   { fontSize: 32, lineHeight: 38, letterSpacing: -0.6, ...w('800') } as TextStyle,

  // Headings
  h1: { fontSize: 26, lineHeight: 32, letterSpacing: -0.4, ...w('700') } as TextStyle,
  h2: { fontSize: 22, lineHeight: 28, letterSpacing: -0.3, ...w('700') } as TextStyle,
  h3: { fontSize: 18, lineHeight: 24, letterSpacing: -0.2, ...w('700') } as TextStyle,
  h4: { fontSize: 16, lineHeight: 22, letterSpacing: -0.1, ...w('600') } as TextStyle,

  // Body
  body:        { fontSize: 15, lineHeight: 22, ...w('400') } as TextStyle,
  bodyMedium:  { fontSize: 15, lineHeight: 22, ...w('500') } as TextStyle,
  bodySmall:   { fontSize: 13, lineHeight: 19, ...w('400') } as TextStyle,
  bodyLarge:   { fontSize: 17, lineHeight: 25, ...w('400') } as TextStyle,

  // Supporting
  caption:        { fontSize: 12, lineHeight: 16, ...w('400') } as TextStyle,
  captionMedium:  { fontSize: 12, lineHeight: 16, ...w('500') } as TextStyle,
  label:          { fontSize: 13, lineHeight: 18, ...w('600') } as TextStyle,
  overline:       { fontSize: 11, lineHeight: 14, letterSpacing: 1.2, textTransform: 'uppercase', ...w('600') } as TextStyle,

  // Interactive
  button:    { fontSize: 16, lineHeight: 20, letterSpacing: 0.1, ...w('700') } as TextStyle,
  buttonSm:  { fontSize: 14, lineHeight: 18, letterSpacing: 0.1, ...w('600') } as TextStyle,
  tabLabel:  { fontSize: 11, lineHeight: 14, letterSpacing: 0.2, ...w('600') } as TextStyle,

  // Numeric — price emphasis
  priceXL:    { fontSize: 36, lineHeight: 40, letterSpacing: -0.8, ...w('800') } as TextStyle,
  priceLarge: { fontSize: 28, lineHeight: 32, letterSpacing: -0.5, ...w('800') } as TextStyle,
  price:      { fontSize: 22, lineHeight: 26, letterSpacing: -0.3, ...w('700') } as TextStyle,
  priceSmall: { fontSize: 16, lineHeight: 20, letterSpacing: -0.1, ...w('700') } as TextStyle,

  // Aliases (back-compat)
  get fontFamily() { return sans; },
};
