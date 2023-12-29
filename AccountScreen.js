import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AccountScreen = ({ navigation }) => {
  const [selectedContent, setSelectedContent] = useState('grammar');

  const renderContent = () => {
    switch (selectedContent) {
      case 'grammar':
        return (
          <View style={styles.contentBox}>
            <Text>這裡包含文法建議的內容
            </Text>
          </View>
        );
      case 'vocabulary':
        return (
          <View style={styles.contentBox}>
            <Text>这里是單字的内容</Text>
          </View>
        );
      case 'dialogue':
        return (
          <View style={styles.contentBox}>
            <Text>这里是對話語句的内容</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Icon name="person-circle-outline" size={120} color="#900" /> 
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.accountName}>帳戶名稱:</Text>
          </View>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.guideContainer}>
          <TouchableOpacity
            style={styles.guideButton}
            onPress={() => setSelectedContent('grammar')}
          >
            <Text style={styles.accountName}>文法建議</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.guideButtonMid}
            onPress={() => setSelectedContent('vocabulary')}
          >
            <Text style={styles.accountName}>單字</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.guideButtonMid}
            onPress={() => setSelectedContent('dialogue')}
          >
            <Text style={styles.accountName}>對話語句</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.contentContainer}>{renderContent()}</ScrollView>
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Icon name="home-outline" size={40} color="#900" />
          <Text style={styles.footerButtonText}>主頁</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectedFooterButton}>
          <Icon name="people-circle-outline" size={40} color="#900" />
          <Text style={styles.footerButtonText}>帳戶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#808080',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
    width: 360,
    height: 200,
    backgroundColor: '#fff',
  },
  headerLeft: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 1,
  },
  headerRight: {
    width: '60%',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  guideContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  guideButton: {
    backgroundColor: '#fff',
    width: 100,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideButtonMid: {
    backgroundColor: '#fff',
    width: 100,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 10, // 从20减小到10
    paddingVertical: 10, // 添加垂直内邊距
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginLeft: 20, // 添加左外邊距
    marginRight: 20, // 添加右外邊距
    flexGrow: 1,
    marginBottom: 60, // 為底部的導覽列留一點空間
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#808080',
  },
  footerButton: {
    backgroundColor: '#fff',
    width: '50%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  footerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedFooterButton: {
    backgroundColor: '#4169e1',
    width: '50%',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 5,
  },
  contentBox: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  bodyContainer: {
    flex: 1,
    width: '100%',
  },
});
export default AccountScreen;