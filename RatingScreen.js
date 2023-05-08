import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Rating } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const RatingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.whitePanel}>
        <Text style={styles.panelTitle}>此次評分</Text>
        <View style={styles.ratingItem}>
          <Icon name="microphone" size={24} color="#808080" />
          <Text style={styles.ratingItemText}>發音</Text>
          <Rating imageSize={20} readonly startingValue={4} />
        </View>
        <View style={styles.ratingItem}>
          <Icon name="book" size={24} color="#808080" />
          <Text style={styles.ratingItemText}>單字</Text>
          <Rating imageSize={20} readonly startingValue={3} />
        </View>
        <View style={styles.ratingItem}>
          <Icon name="pencil" size={24} color="#808080" />
          <Text style={styles.ratingItemText}>文法</Text>
          <Rating imageSize={20} readonly startingValue={4} />
        </View>
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.footerButtonText}>回到主畫面</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#808080',
  },
  whitePanel: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingTop: 60,
    paddingBottom: 60,
    paddingLeft: 60,
    paddingRight: 60,
    minWidth: 300, // 指定最小寬度
    maxWidth: 500, // 指定最大寬度
    minHeight: 400, // 指定最小高度
    maxHeight: 600, // 指定最大高度
  },
  panelTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingItemText: {
    marginTop:60,
    fontSize: 30,
  },
  backButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 18,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
  backgroundColor: '#fff',
  width: '100%',
  paddingVertical: 15,
  alignItems: 'center',
  justifyContent: 'center',
  borderBottomLeftRadius: 5,
  borderBottomRightRadius: 5,
  },
  footerButtonText: {
  fontSize: 30,
  fontWeight: 'bold',
  },
  });
  
  export default RatingScreen;
