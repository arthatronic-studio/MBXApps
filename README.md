# MBXAPPS Installation

## Instalation

Recommended using **Node version >= 16 (preferable LTS version)**

### Android

To install the module

```sh
npm install
```

After finish the installation, apply some patch for deprecated package using

```sh
npm run postinstall
```

For running the app, run command

```sh
npm run android
```

### iOS

To install the module

```sh
npm install
```

After finish the installation, apply some patch for deprecated package using

```sh
npm run postinstall
```

Go to folder ios, remove `Podfile.lock` file, then run command

```sh
pod deintegrate && pod install
```

After finish the installation, remove build folder inside ios folder then back to root project folder and run command

```sh
npm run ios
```

## Error References:

1. Deprecated react native prop types

   https://stackoverflow.com/questions/71702392/viewproptypes-will-be-removed-from-react-native-migrate-to-viewproptypes-export

2. verifyReleaseResources FAILED (when build apk)

   https://stackoverflow.com/questions/52613089/getting-verifyreleaseresources-error-after-upgrading-react-native

3. React/RCTBridgeDelegate.h' file not found

   https://stackoverflow.com/questions/56916798/react-rctbridgedelegate-h-file-not-found

4. 'value' is unavailable: introduced in iOS 12.0

   https://github.com/facebook/react-native/issues/34106
