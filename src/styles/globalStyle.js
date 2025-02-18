import { StyleSheet } from 'react-native';

export const colors = {
  fab: '#6200ee',
  modalFocusOut: 'rgba(0, 0, 0, 0.5)',
  modalBackground: '#ffffff'
};

export default StyleSheet.create({
    container:{
        flex: 1,
        padding: 16
    },
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
    modalStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.modalFocusOut
    },
    modalWrapperStyle: {
      padding: 20,
      width: '80%',
      height: '90%',
      backgroundColor: colors.modalBackground
    },
    flashListWrapper: {
        height: '100%',
    },
    itemHeader:{
      fontSize:18,
      marginVertical: 8,
      fontWeight:'bold',
      textAlign:'center'
    },
    footer: {
      flexDirection:'row',
      textAlign: 'left',
      marginTop: 8
    },
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 500,
        backgroundColor: colors.fab,
    },
    textInput:{
        marginVertical: 8,
        marginHorizontal: 4
    },
    commonButton:{
      alignSelf: 'center',
      marginVertical: 8,
      marginHorizontal: 4
    },
    button:{
        bottom: 16,
        right: 16,
        backgroundColor: colors.fab,
    },
    label:{
        fontSize: 16,
        color: '#000'
    },
    horizontalRadioGroup: {
        flexDirection: 'row', // Arrange items in a row
        alignItems: 'center',
        justifyContent: 'space-around', // Optional: space them evenly
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
      },
    radioLabel: {
        fontSize: 12,
        marginLeft: 8,
    },
    formValidation: {
      flex: 0.3,
      justifyContent: 'center'
    },
    textValidation: {
      fontSize:16,
      fontWeight:'bold',
      textAlign:'center',
      paddingBottom:40
    },
    formContainer: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    formArea: {
      width: '100%',
      flex: 1
    },
  });