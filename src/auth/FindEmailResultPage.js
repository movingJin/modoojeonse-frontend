import React, { Component, useState, useEffect } from 'react';
import { Button, Text, TextInput, View, StyleSheet } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class FindEmailResultPage extends Component {
  constructor(props){
    super(props);
  }
//const FindEmailResultPage = ({ navigation }) => {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.body}>가입하신 Email(Id): {this.props.route.params.email}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  body:{
    fontSize:16,
    fontWeight: "bold"
  }
})

//export default FindEmailResultPage;