import { AppRegistry } from 'react-native';
import App from './App.web';
import { name as appName } from './app.json';
import { Platform } from 'react-native';


const loadFont = async (fontName) => {
  try {
    const font = await import(`react-native-vector-icons/Fonts/${fontName}.ttf`);
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(
      document.createTextNode(`
        @font-face {
          src: url(${font.default});
          font-family: ${fontName};
        }
      `)
    );
    document.head.appendChild(style);
  } catch (error) {
    console.error(`Error loading ${fontName} font:`, error);
  }
};

// 필요한 폰트들을 배열로 관리
const fonts = ['MaterialIcons', 'AntDesign'];
fonts.forEach(loadFont);


AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('app'),
  });
}
