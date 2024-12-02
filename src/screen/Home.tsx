import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiService from '../config/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { APIResponse, Article } from '../commons/types/type';
import Sound from 'react-native-sound';


type RootStackParamList = {
  Home: undefined;
  ArticleDetailPage: { id: string };
};
const Home = () => {

  const [articles, setArticles] = useState<Article[] | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [hasFinishedPlaying, setHasFinishedPlaying] = useState<boolean>(false);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  

  const fetchArticles = async () => {
    try {
      const response = await apiService.get("/articles");
      if (response.status === 200) {
        setArticles(response.data.data);
      } 
      // else {
      //   // Kiểm tra lỗi nếu response không thành công
      //   setError(response || "An error occurred");
      // }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchArticles();
  }, []);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handlePress = async (id: string, titleAudio: string, shortIntroAudio: string) => {
    try {
  
      const soundTitle = await new Promise<Sound>((resolve, reject) => {
        const sound1 = new Sound(titleAudio, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            reject('Lỗi tải âm thanh: ' + error);
          } else {
            resolve(sound1);
          }
        });
      });
  
      const soundIntro = await new Promise<Sound>((resolve, reject) => {
        const sound2 = new Sound(shortIntroAudio, Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            reject('Lỗi tải âm thanh: ' + error);
          } else {
            resolve(sound2);
          }
        });
      });
      // soundTitle.play();
  
      // // Kiểm tra nếu đang phát âm thanh cùng một ID và đã hoàn thành việc phát
      if (currentPlayingId === id && hasFinishedPlaying) {
        setHasFinishedPlaying(false);
        setIsPlaying(false);
        setCurrentPlayingId(null)
        setCurrentSound(null)
        navigation.navigate('ArticleDetailPage', { id });
        return;
      }
  
      // Kiểm tra nếu đang phát âm thanh nhưng chưa xong
      if (currentPlayingId === id && !hasFinishedPlaying) {
        if (isPlaying) {
          Alert.alert('dayy')
            currentSound?.pause(() => {
              setIsPlaying(false);
              setHasFinishedPlaying(false);
            });
          
        }
      }
  
      // Cập nhật ID và trạng thái âm thanh hiện tại
      setCurrentPlayingId(id);
      setHasFinishedPlaying(false);
  
      // Dừng và giải phóng âm thanh hiện tại nếu có
      if (currentSound) {
        currentSound.stop(() => {
          currentSound.release();
          setCurrentSound(null);
          setIsPlaying(false);
        });
      }
  
      // Bắt đầu phát âm thanh title
      if (soundTitle) {
        setCurrentSound(soundTitle);
        soundTitle.play(() => {
          // Sau khi phát âm thanh title xong, phát âm thanh intro
          if (soundIntro) {
            setCurrentSound(soundIntro);
            soundIntro.play(() => {
              // Khi âm thanh intro phát xong
              setIsPlaying(false);
              setHasFinishedPlaying(true);
            });
          }
        });
  
        setIsPlaying(true); // Đánh dấu là đang phát
      }
    } catch (e) {
      console.error("Error:", e);
    }
  };
  
  
    //   // Sau khi âm thanh đã tải thành công, bạn có thể phát
  


  // const handlePress = (id: string, titleAudio: string, shortIntroAudio: string) => {
  //   navigation.navigate('ArticleDetailPage', { id });
  // };

  const renderItem = ({ item }: { item: Article }) => (
    <TouchableOpacity onPress={() => handlePress(item.id, item.audio_title, item.audio_shortintro)}>
      <View style={styles.card}>
      <Image 
        source={item.image_url ? { uri: item.image_url } : require('../images/default.jpg')}
        style={styles.image} 
      />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.short_intro} numberOfLines={1}>{item.short_intro}</Text>
          <Text style={styles.time}>{item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
    
  );
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Tin Mới Nhất</Text>
        <Image source={require('../images/setting.png')} style={styles.settingIcon}/>
      </View>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#202020',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  settingIcon: {
    width: 30, // Đặt kích thước cho icon quay lại
    height: 30,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 8, // Khoảng cách giữa các ô
    backgroundColor: '#1e1e1e',
    borderRadius: 12, // Bo góc ô bài báo
    overflow: 'hidden',
    padding: 16, // Thêm padding cho card
    height: 150, // Chiều cao cố định
  },
  image: {
    width: 100, // Tăng kích thước hình ảnh
    height: 100, // Tăng kích thước hình ảnh
    borderRadius: 8, // Bo góc hình ảnh
  },
  textContainer: {
    flex: 1,
    paddingLeft: 16, // Thêm khoảng cách giữa hình ảnh và text
  },
  short_intro: {
    color: '#ccc',
    fontSize: 12, // Tăng kích thước font của nguồn
  },
  title: {
    color: '#fff',
    fontSize: 20, // Tăng kích thước font của tiêu đề
    fontWeight: 'bold',
    marginVertical: 2, // Khoảng cách giữa tiêu đề và thời gian
    textAlign: 'justify',
  },
  time: {
    color: '#888',
    fontSize: 10, // Tăng kích thước font của thời gian
  },
});


export default Home;
