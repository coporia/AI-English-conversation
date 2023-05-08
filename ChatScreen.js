import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native'
import { Audio } from 'expo-av';
import ProgressBar from 'react-native-progress/Bar';
//import { ErrorSuggestionContext } from './contexts/ErrorSuggestionContext';
import React, { useState, useContext } from 'react'; // <- 添加 useContext

const ChatScreen = ({ navigation, route }) => {
  const { title } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState(null); // 新增的狀態
  const [playbackProgress, setPlaybackProgress] = useState({});
  //const { errorSuggestions, setErrorSuggestions } = useContext(ErrorSuggestionContext);

  
  
  
  const startRecording = async () => {
    try {
      if (recordingInstance) {
        console.warn('An active recording is in progress. Skipping startRecording.');
        return;
      }
  
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);
      await recording.startAsync();
      setIsRecording(true);
      setRecordingInstance(recording);
    } catch (error) {
      console.error('Error while starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recordingInstance) {
        console.warn('No active recording to stop.');
        return;
      }
      await recordingInstance.stopAndUnloadAsync(); // 修改：直接使用 recordingInstance
      setIsRecording(false);
      const uri = recordingInstance.getURI();
      console.log('Recording stopped and saved to:', uri);

      // 将录音文件作为消息添加到消息列表
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: `錄音：${uri}`, sender: 'user', type: 'audio', uri },
      ]);

      // 在此处处理录音文件，例如将其发送到服务器或转换为文本
      setRecordingInstance(null); // 修改：在此处将 recordingInstance 设置为 null
    } catch (error) {
      console.error('Error while stopping recording:', error);
    }
  };

  const generateBotReply = (userInput) => {
    // 在這裡根據用戶輸入生成機器人的回覆
    const botReply = "您好，我是機器人。";
    return botReply;
  };

  const playAudio = async (uri) => {
    try {
      const sound = new Audio.Sound();
  
      // 监听播放进度的回调
      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (playbackStatus.isLoaded) {
          setPlaybackProgress((prevState) => ({
            ...prevState,
            [uri]: playbackStatus.positionMillis / playbackStatus.durationMillis,
          }));
        }
      });
  
      await sound.loadAsync({ uri });
      await sound.playAsync();
    } catch (error) {
      console.error('Error while playing audio:', error);
    }
  };
  
  const renderMessages = () =>
    messages.map((message, index) => (
      <View
        key={index}
        style={[
          styles.messageContainer,
          message.sender === 'bot' ? styles.botMessage : styles.userMessage,
        ]}
      >
        {message.type === 'audio' ? (
          <TouchableOpacity onPress={() => playAudio(message.uri)}>
            <Text style={styles.messageText}>點擊播放錄音</Text>
            <ProgressBar
              progress={playbackProgress[message.uri] || 0}
              width={200}
              height={10}
              color={'#0084ff'}
              borderWidth={1}
              borderColor={'#000'}
              borderRadius={5}
              unfilledColor={'#e5e5e5'}
            />
          </TouchableOpacity>
        ) : (
          <Text style={styles.messageText}>
            {message.sender === 'user' ? '用戶：' : '機器人：'}
            {message.content}
          </Text>
        )}
      </View>
    ));

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {renderMessages()}
      </ScrollView>
      <View style={styles.footerContainer}>
      <TouchableOpacity
          style={styles.recordButton}
          onPressIn={startRecording} // 修改：直接使用 startRecording 函数
          onPressOut={stopRecording} // 修改：直接使用 stopRecording 函数
      >
          <Text style={styles.recordButtonText}>{isRecording ? '停止录音' : '开始录音'}</Text>
      </TouchableOpacity>
        <TextInput
            style={styles.input}
            onChangeText={text => setInputValue(text)}
            value={inputValue}
            placeholder="請輸入您的消息"
        />
        <TouchableOpacity
            style={styles.sendButton}
            onPress={() => {
              setMessages([...messages, { content: inputValue, sender: 'user' }]);
              setInputValue('');

              // 生成機器人的回覆並添加到消息列表
              const botReply = generateBotReply(inputValue);
              setMessages((prevMessages) => [...prevMessages, { content: botReply, sender: 'bot' }]);
            }}
          >
          <Text style={styles.sendButtonText}>發送</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.footerButton}
            onPress={() => {
              const errors = [
                { message: '錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤', suggestion: '建議建議建議建議建議建議建議建議建議建議建議建議建議建議建議建議建議' },
                { message: '錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤錯誤', suggestion: '建議建議建議建議建議建議建議建議建議建議建議建議建議建議建議建議建議' },
                // 更多錯誤和建議
              ];
              navigation.navigate('SuggestionScreen', { errors });
            }}
        >
            <Text style={styles.footerButtonText}>結束對話</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    alignSelf: 'center',
  },
  chatContainer: {
    flex: 1,
    marginTop: 20,
  },
  chatContent: {
    padding: 20,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    backgroundColor: '#fff',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  footerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    minHeight: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    fontSize: 18,
  },
  sendButton: {
    backgroundColor: '#0084ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  messageContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#0084ff',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#e5e5e5',
  },
  messageText: {
    fontSize: 16,
  },
  recordButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ChatScreen;