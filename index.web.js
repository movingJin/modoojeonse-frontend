import { AppRegistry } from 'react-native';
import App from './App.web'
import { name as appName } from './app.json';
import { Platform } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

const MaterialIconsStyles = `@font-face {
  src: url(${MaterialIcons});
  font-family: MaterialIcons;
}`;

const style = document.createElement('style');
style.type = 'text/css';

if (style.styleSheet) {
  style.styleSheet.cssText = MaterialIconsStyles;
} else {
  style.appendChild(document.createTextNode(MaterialIconsStyles));
}

document.head.appendChild(style);

AppRegistry.registerComponent(appName, () => App);
if (Platform.OS === 'web') {
    AppRegistry.runApplication(appName, {
        initialProps: {},
        rootTag: document.getElementById('app'),
    });
}