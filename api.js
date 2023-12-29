// 假設後端伺服器運行在 http://localhost:4000
const BASE_URL = 'http://localhost:4000';

// 獲取話題開頭訊息的 API 呼叫範例
const startConversation = async (userId, topic) => {
  try {
    const response = await fetch(`${BASE_URL}/api/start-conversation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, topic }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.message;

    // 在這裡處理助手的回應
    console.log('Assistant Message:', assistantMessage);
  } catch (error) {
    console.error('Error:', error);
  }
};

// 呼叫開始對話 API
startConversation('user123', 'English learning');

export default api;