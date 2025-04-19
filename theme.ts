// theme.ts
import { MD3LightTheme as DefaultTheme, MD3DarkTheme } from 'react-native-paper';

export const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498DB',           // botões, links ativos
    onPrimary: '#FFFFFF',         // texto sobre o botão
    background: '#212121',        // fundo principal
    surface: '#212121',           // containers/card fundo
    onSurface: '#FFFFFF',         // textos principais
    outline: '#6C7278',           // bordas, linhas
    surfaceVariant: '#2C2C2C',    // inputs e campos
    onSurfaceVariant: '#C0C0C0',  // texto em campos
    error: '#FF4C4C',             // cor de erro se necessário
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    // se quiser aplicar uma fonte customizada, adicione aqui
  },
};
