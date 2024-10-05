import React, {Component, useState, useEffect} from 'react';
import {Pressable, View, Text, StyleSheet, Platform} from 'react-native';
//import { WebView } from 'react-native-webview';

class Map extends Component {
  render(){
    return Platform.OS === "web" ? (
      <iframe src="https://movingjin.tistory.com/" height={'100%'} width={'100%'} />
    ) : (
      <View style={styles.container}>

      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  webview: {
    flex: 1,
    width: 300,
    height: 300,
  },
});


export default Map;