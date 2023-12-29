import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const RatingScreen = ({ navigation, route }) => {
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState('');

  const userId = route.params.userId; // 獲取 userId

  useEffect(() => {
    const fetchScoreAndComment = async () => {
      try {
        const response = await fetch(`http://192.168.56.1:4000/api/evaluate-conversation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setScore(data.score);
        setComment(data.comment); // 設置評語
      } catch (error) {
        console.error('Error fetching score and comment:', error);
      }
    };

    fetchScoreAndComment();
  }, [userId]);

  return (
    <View style={styles.container}>
      <View style={styles.panelTitle}>
        <Text style={styles.scoreText}>AI 評分: {score} 分</Text>
      </View>
      <ScrollView style={styles.whitePanel}>
        <Text style={styles.feedbackText}>{comment}</Text> 
      </ScrollView>
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
    padding: 30,
    marginHorizontal: 20, // 新增左右邊距
    marginTop: 20, // 新增上邊距
    maxHeight: '70%', // 新增最大高度限制
    flex: 1, // 新增彈性以填滿容器
  },
  panelTitle: {
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20, // 調整內邊距使其更均勻
    width: '90%', // 調整寬度與白色面板一致
  },
  feedbackText: {
    fontSize: 18, // 調整字體大小
    textAlign: 'left', // 改為左對齊
    flexWrap: 'wrap', // 確保文本可以包裹
  },
  footerContainer: {
    width: '100%', // 確保滿寬
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    backgroundColor: '#4A90E2', // 改變按鈕顏色
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 5, // 修改為上圓角
    borderTopRightRadius: 5, // 修改為上圓角
  },
  footerButtonText: {
    fontSize: 20, // 調整字體大小
    fontWeight: 'bold',
    color: '#fff', // 字體顏色改為白色
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // 其他樣式保持不變
});

export default RatingScreen;

