# Account Setup Mobile App

A React Native mobile application with TypeScript that provides a complete account registration, login, and profile management experience with secure credential storage and form validation.

## Project Structure

The application follows a well-organized structure:

- `src/` - Main application code
  - `actions/` - Redux actions
  - `assets/` - Images, fonts, and other static assets
  - `data/` - Common data
  - `components/` - Reusable UI components
  - `constant/` - Application constants and configuration
  - `navigation/` - Navigation configuration and screens
  - `store/` - Zustand store
  - `screens/` - Main application screens
      - `LoginScreen/` - User login screen
      - `RegisterScreen/` - User registration screen
      - `HomeScreen/` - Home screen
  - `types/` - TypeScript type definitions
  - `utils/` - Utility functions and helpers


## 🎯 Features

- **Registration Flow**: Complete multi-field registration form with validation
- **Login System**: Secure authentication with lockout after 5 failed attempts
- **Session Management**: Persistent sessions across app restarts
- **Form Draft Persistence**: Save registration progress automatically
- **Secure Storage**: Credentials stored using React Native Keychain/Keystore
- **Responsive UI**: Built with react-native-size-matters for consistent sizing across devices
- **Accessibility**: Proper labels, hints, and screen reader support
- **Form Validation**: Comprehensive validation for all fields with inline error messages
- **TypeScript**: Full type safety throughout the application

## 📱 Screens

1. **Registration Screen**: Multi-field form with all required user information
2. **Login Screen**: Email/username + password with attempt tracking
3. **Home/Profile Screen**: Display user information with logout functionality

## 🛠️ Tech Stack

- **React Native CLI** with TypeScript
- **Zustand**: State management
- **React Hook Form**: Form handling and validation
- **React Native Keychain**: Secure credential storage
- **React Native Size Matters**: Responsive scaling
- **React Navigation**: Navigation between screens
- **Jest & React Testing Library**: Unit testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd AccountSetupApp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install iOS dependencies (iOS only):
```bash
cd ios && pod install && cd ..
```

4. Create required directories:
```bash
mkdir -p src/{screens,components,store,utils,data,navigation,types,styles} __tests__
```

5. Add all the source files as provided in the implementation guide

### Running the App

#### iOS
```bash
npm run ios
# or
yarn ios
```

#### Android
```bash
npm run android
# or
yarn android
```

### Development

Start Metro bundler:
```bash
npm start
# or
yarn start
```

## 🧪 Testing

Run unit tests:
```bash
npm test
# or
yarn test
```

Run tests with coverage:
```bash
npm test -- --coverage
# or
yarn test --coverage
```

## 🔍 Code Quality

### Linting
```bash
npm run lint
# or
yarn lint
```

### Type Checking
```bash
npm run type-check
# or
yarn type-check
```

### Formatting
```bash
npm run format
# or
yarn format
```

## 🏗️ Architecture

### Project Structure