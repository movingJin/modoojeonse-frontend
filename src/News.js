import React, {Component, createRef} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Modal, ScrollView, Platform} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { FlashList } from "@shopify/flash-list";
import axios from "axios";
import Config from "react-native-config";

const URL = Platform.OS === "web" ? process.env.API_SERVER_URL: Config.API_SERVER_URL;

export default class News extends Component {

  constructor(props){
    super(props);
    this.state={
      datas: [],
      filteredData: [], // Stores filtered results
      searchQuery: '',
      isModalVisible: false,
      selectedItem: null
    };
    this.flashListRef = createRef();
  }

  componentDidMount(){
    axios.get(`${URL}/news/search-native`, {}).then((response)=>{
      this.setState({datas: response.data});
    });
  }

  // Filter function
  handleSearch = (event) => {
    if(event.nativeEvent.text === ''){
      axios.get(`${URL}/news/search-native`, {}).then((response)=>{
        this.setState({datas: response.data});
      });
    } else {
      const param = {"body": event.nativeEvent.text.toLowerCase()};
      axios.get(`${URL}/news/search-native`, {params: param}).then((response)=>{
        this.setState({datas: response.data});
      });
    }
    if (this.flashListRef.current) {
      this.flashListRef.current.scrollToIndex({ animated: false, index: 0 });
    }
    this.setState({ searchQuery: event.nativeEvent.text});
  };

  toggleModal = (item) => {
    this.setState({
      isModalVisible: !this.state.isModalVisible
    });
    this.setState({selectedItem: item});
  };

  appendData = () => {
    if(this.state.datas.length > 0){
      const param = {"searchAfter": this.state.datas[this.state.datas.length-1].sort};
      if(this.state.searchQuery.trim() !== ''){
        param["body"] = this.state.searchQuery;
      }
      axios.get(`${URL}/news/search-native`, {params: param}).then((response)=>{
        const d = [...this.state.datas, ...response.data];
        this.setState({datas: d});
      })
      .catch(error => console.log(error));
    }
  }

  render() {
    return (
      <View style={style.root}>
        {/* 🔹 Search Input Field */}
        <TextInput
          style={style.searchInput}
          placeholder="내용검색"
          //value={this.state.searchQuery}
          onSubmitEditing={this.handleSearch}
        />
        <FlashList
          ref={this.flashListRef}
          data={this.state.datas}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.5}
          onEndReached={() => { this.appendData()}}
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
              <Text style={style.listTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
              <Text style={style.listBody} numberOfLines={2} ellipsizeMode="tail" >{item.summary}</Text>
              <View style={style.footer}>
                <Text style={style.itemPublisher}>{item.publisher}</Text>
                <Text style={style.itemTimestamp}>{item.timestamp}</Text>
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
              <Text style={style.itemTitle}>{this.state.selectedItem.title}</Text>
              <ScrollView>
                <Text style={style.itemBody}>{this.state.selectedItem.body}</Text>
                <View style={style.footer}>
                  <Text style={style.itemPublisher}>{this.state.selectedItem.publisher}</Text>
                  <Text style={style.itemTimestamp}>{this.state.selectedItem.timestamp}</Text>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    )
  }
}

const style= StyleSheet.create({
  root:{
    flexGrow:1,
    padding:16,
    height: (Platform.OS === 'web')? hp('80%'): undefined,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  listView:{
    flexDirection:'row',
    borderWidth:1,
    borderRadius:4,
    padding:8,
    marginBottom:12,
    height: 160,
    width: (Platform.OS === 'web')? '96%': undefined
  },
  listImg:{
    width:120,
    height: 100,
    resizeMode:'cover',
    marginRight:8
  },
  listTitle:{
    fontSize:18,
    fontWeight:'bold',
    height: 40,
    width: (Platform.OS === 'web')? wp('94%'): undefined
  },
  listBody:{
    fontSize:16,
    height: 80,
    width: (Platform.OS === 'web')? wp('94%'): undefined
  },
  itemPublisher:{
    fontSize:14,
    marginRight: 8
  },
  itemTimestamp:{
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
  itemTitle:{
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center',
    height: 40
  },
  itemBody:{
    fontSize:16
  },
  footer: {
    flexDirection:'row',
    textAlign: 'left',
    marginTop: 8
  }
});
