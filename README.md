# EWIPRO Installer Portal

Aplikacja webowa do wizualizacji i kalkulacji materiałów dla systemów ociepleń EWI Pro. Pozwala użytkownikom wybrać typ domu, przesłać zdjęcie własnego budynku, wybrać rodzaj materiału (tynk lub płytki klinkierowe), a następnie zobaczyć wizualizację wybranych kolorów na swoim domu.

## Funkcje

- **Wizualizacja domu**: Możliwość przesłania zdjęcia własnego domu i zaznaczenia jego obrysu.
- **Wybór typu domu**: Obsługa domów wolnostojących, bliźniaków i szeregowych.
- **Wybór materiału**: Przełącznik pomiędzy tynkiem a płytkami klinkierowymi.
- **Wybór trybu**: Tryb "strict" (realistyczny) i "creative" (bardziej swobodny).
- **Wybór koloru**: Szeroka paleta kolorów tynków i płytek.
- **Responsywny interfejs**: Działa zarówno na komputerach, jak i urządzeniach mobilnych.
- **Integracja z AI**: Automatyczna generacja wizualizacji kolorystycznej na podstawie przesłanego zdjęcia.

## Struktura projektu

- `src/` – kod źródłowy aplikacji (komponenty React, style, logika).
- `public/` – pliki statyczne, obrazy domów i kolorów.
- `vite.config.ts` – konfiguracja Vite.
- `tsconfig.json` – konfiguracja TypeScript.
- `package.json` – zależności i skrypty.

## Szybki start

1. **Instalacja zależności**

   ```sh
   npm install
   ```

2. **Uruchomienie w trybie deweloperskim**

   ```sh
   npm run dev
   ```

   Aplikacja będzie dostępna pod adresem [http://localhost:5173](http://localhost:5173).

3. **Budowanie produkcyjne**

   ```sh
   npm run build
   ```

   Wynikowy kod znajdziesz w katalogu `dist/`.

## Konfiguracja

W pliku `.env` możesz ustawić klucz API oraz wersję API:

```
VITE_API_KEY=
```

## Technologie

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Material UI](https://mui.com/)
- [react-to-webcomponent](https://github.com/bitovi/react-to-webcomponent)

## Struktura kodu

- Komponent główny: [`Render`](src/pages/Render.tsx)
- Wizualizacja domu: [`HousePreview`](src/components/form/HousePreview/HousePreview.tsx)
- Wybór kolorów: [`ColourStepInput`](src/components/form/colour/ColourStepInput.tsx)
- Wybór typu domu: [`HouseType`](src/components/houseType/HouseType.tsx)
- Przełączniki opcji: [`Options`](src/components/options/Options.tsx)