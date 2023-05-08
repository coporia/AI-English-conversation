import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Dimensions } from 'react-native';
import React from 'react';

const screenWidth = Dimensions.get('window').width;

const SuggestionScreen = ({ navigation, route }) => {
  const { errors } = route.params;

  const renderItem = ({ item, index }) => (
    <View style={styles.contentContainer}>
      <View style={styles.whiteBox}>
        <View style={styles.errorSection}>
          <Text style={styles.errorTitle}>錯誤 {index + 1}</Text>
          <Text
            style={styles.errorContent}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.message}
          </Text>
        </View>
        <View style={styles.suggestionSection}>
          <Text style={styles.suggestionTitle}>建議 {index + 1}</Text>
          <Text
            style={styles.suggestionContent}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.suggestion}
          </Text>
        </View>
      </View>
    </View>
  );
  

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={errors}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth / 100} // 每次滑動螢幕寬度的1/100
      />
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => {
          navigation.navigate('RatingScreen');
        }}
      >
        <Text style={styles.footerButtonText}>進行評分</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#808080',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  whiteBox: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 40,
    minWidth: 300,
    maxWidth: 350,
    minHeight: 400,
    maxHeight: 700,
  },
  errorSection: {
    marginBottom: 30,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  errorContent: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    width: '100%',
  },
  suggestionSection: {
    marginTop: 30,
  },
  suggestionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginRight: 10,
  },
  suggestionContent: {
    fontSize: 18,
    marginTop: 10,
    flexWrap: 'wrap',
    width: '100%',
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

export default SuggestionScreen;