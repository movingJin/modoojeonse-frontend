import { Alert, Platform } from 'react-native'

const alertPolyfill = (title, description, options, extra) => {
    if(!options || options === null){
        alert(description);
    }else{
        const result = window.confirm([title, description].filter(Boolean).join('\n'));
        if (result) {
            const confirmOption = options.find(({ style }) => style !== 'cancel')
            confirmOption && confirmOption.onPress()
        } else {
            const cancelOption = options.find(({ style }) => style === 'cancel')
            cancelOption && cancelOption.onPress()
        }
    }
}

const customAlert = Platform.OS === 'web' ? alertPolyfill : Alert.alert

export default customAlert