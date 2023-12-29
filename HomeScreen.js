import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [initialMessage, setInitialMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInitialConversation = async (topic) => {
    setLoading(true);
    try {
      // 替換為您的 API 端點
      const response = await fetch(`http://192.168.56.1:4000/api/start-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'user123', topic }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error:', error);
      setInitialMessage('Error fetching initial conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicPress = async (topic, title) => {
    const initialMessage = await fetchInitialConversation(topic);
    navigation.navigate('ChatScreen', { title: title, titleMessage: initialMessage });
  };

 
  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.contentContainer}>
        {/* Free Chat Button */}

        <TouchableOpacity
          style={styles.freeChatButton}
          onPress={() => handleTopicPress('FreeTalk', '自由對話')}
        > 
          <View style={styles.leftSide}>
            <Icon name="chatbubbles-outline" size={60} color="#900" />
          </View>
          <View style={styles.rightSide}>
            <Text style={styles.freeChatButtonText}>自由對話</Text>
          </View>
        </TouchableOpacity>

        {/* Sections */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>基本溝通</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonRow}
          >
            <TouchableOpacity style={styles.buttonHorizontal} onPress={() => handleTopicPress('Self-introduction', '自我介紹')}>
              <View style={styles.leftSide}>
                <Icon name="person-add-outline" size={20} color="#900" />
              </View>
              <View style={styles.rightSide}>
                <Text style={styles.buttonText}>自我介紹</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonHorizontal} onPress={() => handleTopicPress('Daily Greetings', '日常問候')}>
              <View style={styles.leftSide}>
                <Icon name="people-outline" size={25} color="#900" />
              </View>
              <View style={styles.rightSide}>
                <Text style={styles.buttonText}>基本問候</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonHorizontal} onPress={() => handleTopicPress('Self-introduction', '自我介紹')}>
              <View style={styles.leftSide}>
                <Icon name="chatbubbles-outline" size={20} color="#900" />
              </View>
              <View style={styles.rightSide}>
                <Text style={styles.buttonText}>按鈕 1</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>旅遊</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buttonRow}
          >
            <TouchableOpacity style={styles.buttonHorizontal} onPress={() => handleTopicPress('Asking for Directions Scenario', '問路')}>
              <View style={styles.leftSide}>
                <Icon name="chatbubbles-outline" size={20} color="#900" />
              </View>
              <View style={styles.rightSide}>
                <Text style={styles.buttonText}>問      路</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonHorizontal} onPress={() => handleTopicPress('Tourism and Travel Scenario', '觀光')}>
              <View style={styles.leftSide}>
              <Icon name="leaf-outline" size={20} color="#900" />
          </View>
          <View style={styles.rightSide}>
            <Text style={styles.buttonText}>觀      光</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>愛好</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonRow}
      >
        <TouchableOpacity style={styles.buttonHorizontal} onPress={() => handleTopicPress('Book Recommendations', '閱讀')}>
          <View style={styles.leftSide}>
            <Icon name="book-outline" size={20} color="#900" />
          </View>
          <View style={styles.rightSide}>
            <Text style={styles.buttonText}>閱      讀</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonHorizontal} onPress={() => handleTopicPress('Cooking Related', '烹飪')}>
          <View style={styles.leftSide}>
            <Icon name="fast-food-outline" size={20} color="#900" />
          </View>
          <View style={styles.rightSide}>
            <Text style={styles.buttonText}>煮      飯</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>基本溝通 4</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.buttonRow}
      >
        
      </ScrollView>
    </View>
    <View style={styles.footerSpacer} />
  </ScrollView>
  <View style={styles.footerContainer}>
    <TouchableOpacity style={styles.selectedFooterButton}>
      <Icon name="home-outline" size={40} color="#900" />
      <Text style={styles.footerButtonText}>主頁</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.footerButton}
      onPress={() => navigation.navigate('Account')}
    >
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
  contentContainer: {
  paddingHorizontal: 40,
  },
  freeChatButton: {
  backgroundColor: '#fff',
  paddingHorizontal: 40,
  paddingVertical: 20,
  borderRadius: 5,
  marginTop: 20,
  alignSelf: 'center',
  flexDirection: 'row',
  alignItems: 'center',
  width: 300,
  },
  freeChatButtonText: {
  fontSize: 30,
  fontWeight: 'bold',
  },
  sectionContainer: {
  marginTop: 40,
  },
  sectionTitle: {
  fontSize: 30,
  fontWeight: 'bold',
  marginBottom: 20,
  },
  buttonRow: {
  flexDirection: 'row',
  },
  buttonHorizontal: {
  backgroundColor: '#fff',
  borderRadius: 5,
  paddingHorizontal: 5,
  paddingVertical: 20,
  marginRight: 10,
  flexDirection: 'row',
  alignItems: 'center',
  width: 150,
  },
  buttonText: {
  fontSize: 20,
  fontWeight: 'bold',
  },
  footerSpacer: {
  height: 200,
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
  leftSide: {
  width: '30%',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: 1,
  },
  rightSide: {
  width: '70%',
  backgroundColor: '#fff',
  justifyContent: 'center',
  },
});

export default HomeScreen;