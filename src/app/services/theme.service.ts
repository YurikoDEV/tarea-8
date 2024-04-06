import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() { }

  setTheme(themeName: string) {
    // Aquí establecemos las variables CSS según el tema seleccionado
    switch (themeName) {
      case 'prm':
        document.documentElement.style.setProperty('--ion-color-primary', '#3880ff');
        document.documentElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
        break;
      case 'pld':
        document.documentElement.style.setProperty('--ion-color-primary', '#800080');
        document.documentElement.style.setProperty('--ion-color-primary-contrast', '#FFFF00');
        break;
      case 'fuerza-del-pueblo':
        document.documentElement.style.setProperty('--ion-color-primary', '#006400');
        document.documentElement.style.setProperty('--ion-color-primary-contrast', '#ffffff');
        break;
      // Puedes agregar más casos según sea necesario
      default:
        // Si el tema no se encuentra, se restauran las variables a los valores predeterminados
        document.documentElement.style.removeProperty('--ion-color-primary');
        document.documentElement.style.removeProperty('--ion-color-primary-contrast');
        break;
    }
  }
}
