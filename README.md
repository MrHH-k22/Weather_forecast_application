# Weather forecast application

![image](https://github.com/user-attachments/assets/63a5f2e7-a192-467e-8305-a532fe503df5)

## 1. FEATURES

- **Global City Search**: Retrieve current weather conditions for any city worldwide including temperature
- **24/7 Forecast System**:
  - Hourly predictions for temperature, precipitation probability, and UV index
  - 7-day extended forecast with morning/afternoon/evening breakdowns
- **Favorites Management**: Long-press gestures to save/remove cities with local storage persistence
- **Unit Customization**: Switch between metric/imperial units for temperature (°C/°F), wind (km/h/mph), and precipitation (mm/in)
- **Interactive Charts**: Swipeable line graphs for temperature trends and bar charts for precipitation probability

## 2. TECHNOLOGY STACK

- **JavaScript/JSX**: Primary programming language
- **React Native**: Core framework for cross-platform mobile development
- **Expo**: Development framework and platform built on React Native that simplifies development with pre-built components and services
- **TailwindCSS**: Utility-first CSS framework adapted for React Native
- **React Context API**: Used for managing application state, particularly for unit preferences (temperature, wind, precipitation)
- **TanStack React Query**: Handles API data fetching, caching, and state management
- **Axios**: HTTP client for API requests to the weather service
- **WeatherAPI.com**: Primary data source for weather information, providing current conditions, forecasts, and air quality data
- **Expo Router**: Handles navigation between screens

### Development Tools

- **Babel**: JavaScript compiler with React Native presets
- **Metro**: React Native bundler
- **ESLint/Prettier**: Code formatting and linting

> This weather application is built as a comprehensive mobile solution leveraging modern JavaScript frameworks and React Native ecosystem tools to deliver real-time weather information with an intuitive, cross-platform user experience.

---

## 3. INSTALLATION AND SETUP GUIDE

To get started with the weather forecast application, you have two options for obtaining the source code:

- **Download the ZIP file**: You can download a compressed archive of the project directly from the GitHub repository.
- **Git Clone**: Alternatively, you can use Git to clone the repository to your local machine.

Both methods can be performed from the following GitHub URL:
https://github.com/MrHH-k22/Weather_forecast_application

Once you have the source code, navigate to the project directory in your terminal and install the necessary system dependencies by running:

```bash
npm i --force
```

Please note that this project was developed for academic purposes, and as such, the integrated API key may have a limited validity period. If the application stops fetching weather data due to an expired key, you can easily generate a new one:
https://www.weatherapi.com

Paste your newly generated key into the `services/weatherService.js` file, replacing the existing one.

After completing the setup and configuring your API key (if necessary), launch the application by executing the following command in your terminal:

```bash
npx expo start
```

This command will display a QR code in your command prompt. To access and use the application, simply scan this QR code using the Expo Go mobile application.
