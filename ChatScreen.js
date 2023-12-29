import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native'
import { Audio } from 'expo-av';
import ProgressBar from 'react-native-progress/Bar';
import React, { useState, useEffect } from 'react'; 
import * as FileSystem from "expo-file-system";
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
  Recording,
} from 'expo-av/build/Audio';

const ChatScreen = ({ navigation, route }) => {
  const { title } = route.params;
  const { titleMessage } = route.params; 
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingInstance, setRecordingInstance] = useState(null); // 新增的狀態
  const [playbackProgress, setPlaybackProgress] = useState({});

  const handleSendMessage = async (userMessage = inputValue) => {
    // 添加用户消息到消息列表
    setMessages(prevMessages => {
      const newUserMessage = {
        content: userMessage,
        sender: 'user',
      };
      return [...prevMessages, newUserMessage];
    });
    
  
    try {
      // 向后端发送请求并获取回复
      const response = await fetch(`http://192.168.56.1:4000/api/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'user123', message: userMessage }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      const grammarCorrection = data.grammarCorrection;
      const botReply = data.nextMessage; // 假设这是后端回复的字段
  
      // 如果有语法纠正信息，添加到消息列表
      if (grammarCorrection) {
        setMessages(prevMessages => [...prevMessages, { content: grammarCorrection, sender: 'common' }]);
      }
  
      // 添加机器人回复到消息列表
      setMessages(prevMessages => [...prevMessages, { content: botReply, sender: 'bot' }]);
  
    } catch (error) {
      console.error('Error sending message:', error);
      // 可以选择在聊天中显示错误消息
      setMessages(prevMessages => [...prevMessages, { content: 'Error fetching reply', sender: 'bot' }]);
    }
  
    // 清空输入
    setInputValue('');
  };
  

  useEffect(() => {
    if (titleMessage) {
      setMessages([{ content: titleMessage, sender: 'bot' }]);
    }
  }, [titleMessage]); 
 
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
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync({
        isMeteringEnabled: true,
        android: {
          extension: '.wav',
          outputFormat: AndroidOutputFormat.MPEG_4,
          audioEncoder: AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          outputFormat: IOSOutputFormat.MPEG4AAC,
          audioQuality: IOSAudioQuality.MAX,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });
      console.log('Recording started');
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
      const info = await FileSystem.getInfoAsync( uri || "");
      console.log(`FILE INFO: ${JSON.stringify(info)}`);
      console.log('錄音完成，檔案路徑:', uri);
      uploadAudioFile(uri);

      // 將錄音文件作為消息添加到消息列表
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: `錄音：${uri}`, sender: 'user', type: 'audio', uri },
      ]);

      // 在此處理錄音文件
      setRecordingInstance(null); 
    } catch (error) {
      console.error('Error while stopping recording:', error);
    }
  };

  const uploadAudioFile = async (filePath) => {
    try {
      const result = await FileSystem.uploadAsync('http://192.168.56.1:4000/api/speech-to-text', filePath, {
        fieldName: 'file',
        httpMethod: 'PATCH',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      });
      console.log('檔案上傳結果:', result);
      const responseData = JSON.parse(result.body);
      console.log('轉換後的文字:', responseData.text);

      if (responseData.text) {
        handleSendMessage(responseData.text);
      } else {
        // 如果轉寫文本為空，提示用戶使用英文錄音
        setMessages(prevMessages => [...prevMessages, { content: '請使用英文進行錄音。', sender:  'system' }]);
      }
      

        // TODO: 在此处将转换后的文本显示在应用中
    } catch (error) {
      console.error('檔案上傳出錯:', error);
    }
  };

  const playAudio = async (uri) => {
    try {
      const sound = new Audio.Sound();
  
      //監聽播放進度條
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
    <View key={index} style={styles.messageBlock}>
      <View
        style={[
          styles.messageContainer,
          message.sender === 'bot' ? styles.botMessage : styles.userMessage,
          message.sender === 'common' ? styles.correctionMessageContainer : {},
          message.sender === 'system' ? styles.correctionMessageContainer : {},
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
          <>
            <Text style={styles.messageText}>
              {message.sender === 'user' && '用戶：'}
              {message.sender === 'bot' && '機器人：'}
              {message.sender === 'common' && '建議：'}
              {message.sender === 'system' && '系統：'}
              {message.content}
            </Text>
          </>
        )}
      </View>
    </View>
  ));

  const userId = 'user123'; // 举例，实际情况可能不同

  const handleEndConversation = () => {
    navigation.navigate('RatingScreen', { userId });
  };

  const onSendPress = () => {
    // 只有當 input 有值時才調用 handleSendMessage
    if (inputValue) {
      handleSendMessage(inputValue);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {renderMessages()}
      </ScrollView>
      <View style={styles.footerContainer}>
      <TouchableOpacity
          style={styles.recordButton}
          onPressIn={startRecording} 
          onPressOut={stopRecording} 
      >
          <Text style={styles.recordButtonText}>{isRecording ? '停止錄音' : '開始錄音'}</Text>
      </TouchableOpacity>
        <TextInput
            style={styles.input}
            onChangeText={text => setInputValue(text)}
            value={inputValue}
            placeholder="請輸入您的消息"
            editable={!isRecording} // 当录音时禁用输入框
        />
        <TouchableOpacity
            style={styles.sendButton}
            onPress={onSendPress}
            disabled={isRecording}
        >
            <Text style={styles.sendButtonText}>發送</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.footerButton}
            onPress={handleEndConversation}
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
  correctionMessageContainer: {
    backgroundColor: '#ff6347',
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
   correctionText: {
    marginTop: 4,
    fontSize: 14,
    color: 'grey', 
  },
  messageBlock: {
    marginBottom: 10,
  },
});
export default ChatScreen;