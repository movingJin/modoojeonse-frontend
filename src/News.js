import React, {Component, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, Image} from 'react-native';
import { FlashList } from "@shopify/flash-list";

export default class News extends Component {

  constructor(props){
    super(props);
    this.state={
      datas: [
        {header: "제목1", body:"본문1", issueDate: '2024-02-04', publisher: '동아일보', author:'이동진', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        {header: "제목2", body:"본문2", issueDate: '2024-02-04', publisher: '조선일보', author:'박지연', img:'require(그림경로)'},
        
      ],
      isModalVisible: false,
      selectedItem: null
    };
  }

  toggleModal = (item) => {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
    this.setState({selectedItem: item});
  };

  render() {
    return (
      <View style={style.root}>
        <Text style={style.titleText}>{this.props.route.params.title}</Text>
        <FlashList
          data={this.state.datas}
          renderItem={this.renderItem}
          estimatedItemSize={200}
        />
        {this.state.isModalVisible && this.popupItem()}
      </View>
    );
  }

  renderItem=({item})=>{
    return(
      <TouchableOpacity style={style.listView} onPress={() => this.toggleModal(item)}>
          {/* <Image source={item.img} style={style.listImg}></Image> */}
          <View style={{flexDirection:'column'}}>
              <Text style={style.listHeader}>{item.header}</Text>
              <Text style={style.itemBody}>{item.body}</Text>
              <View style={style.footer}>
                <Text style={style.itemPublisher}>{item.publisher}</Text>
                <Text style={style.itemIssueDate}>{item.issueDate}</Text>
              </View>
          </View>
          
      </TouchableOpacity>
    );
  }

  popupItem=()=>{
    return(
      <Modal
      visible={this.state.isModalVisible}
      transparent={true}
      animationType='slide'
      onRequestClose={() => this.toggleModal(null)}
      >
        <TouchableOpacity style={style.modelStyle} onPress={() => this.setState({isModalVisible: false})}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={style.modelWrapperStyle}>
              <Text style={style.itemHeader}>{this.state.selectedItem.header}</Text>
              <Text style={style.itemBody}>{this.state.selectedItem.body}</Text>
              <View style={style.footer}>
                <Text style={style.itemPublisher}>{this.state.selectedItem.publisher}</Text>
                <Text style={style.itemIssueDate}>{this.state.selectedItem.issueDate}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const style= StyleSheet.create({
  root:{flexGrow:1, padding:16,},
  titleText:{
    fontSize:24,
    fontWeight:'bold',
    textAlign:'center',
    paddingBottom:16
  },
  listView:{
    flexDirection:'row',
    borderWidth:1,
    borderRadius:4,
    padding:8,
    marginBottom:12
  },
  listImg:{
    width:120,
    height:100,
    resizeMode:'cover',
    marginRight:8
  },
  listHeader:{
    fontSize:18,
    fontWeight:'bold'
  },
  itemBody:{
      fontSize:16
  },
  itemPublisher:{
    fontSize:14,
    marginRight: 8
  },
  itemIssueDate:{
    fontSize:14
  },
  modelStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modelWrapperStyle: {
    backgroundColor: '#ffffff',
    padding: 20,
    width: '80%'
  },
  itemHeader:{
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center'
  },
  footer: {
    flexDirection:'row',
    textAlign: 'left',
    marginTop: 8
  }
});
