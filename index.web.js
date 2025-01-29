import { AppRegistry } from 'react-native';
import App from './App.web';
import { name as appName } from './app.json';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  import('react-native-vector-icons/Fonts/MaterialIcons.ttf')
    .then((MaterialIcons) => {
      const style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(`
        @font-face {
          src: url(${MaterialIcons.default});
          font-family: MaterialIcons;
        }
      `));
      document.head.appendChild(style);
    })
    .catch((error) => console.error('Error loading fonts:', error));
}

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('app'),
  });
}
