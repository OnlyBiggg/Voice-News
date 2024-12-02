import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import {  ArticleDetail } from '../commons/types/type';
import Sound from 'react-native-sound';
import apiService from '../config/api';

const ArticleDetailPage = ({ route }) => {
  const { id } = route.params;
  const [article, setArticle] = useState<ArticleDetail>({} as ArticleDetail)
  const navigation = useNavigation();
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // Khai báo player

  const fetchArticleDetail = async (id: string) => {
    try{
      const respone = await apiService.get(`/articles/${id}`)
      if (respone.status === 200){
        setArticle(respone.data.data)
      }
    }
    catch (err: any) {
      Alert.alert('Warning',err.message)
    }
    finally{

    }
  }
  

  useEffect(() => {
    if (id){
      fetchArticleDetail(id)
    }
  },[id])

  // Hàm xử lý play/pause
  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
      } else {
        sound.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      const newSound = new Sound(article.audio_content, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Lỗi tải âm thanh', error);
          return;
        }
        newSound.play();
        setSound(newSound);
        setIsPlaying(true);
      });
    }
  };
  const handleClearSound = () => {
    if (sound) {
      sound.stop(() => {
        sound.release(); // Giải phóng tài nguyên khi dừng âm thanh
        setSound(null);
        setIsPlaying(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView >
        <View style={styles.header}>
          {/* Nút quay lại */}
          <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {navigation.goBack(); 
                          handleClearSound()}}
          >
            <Image source={require('../images/back.png')} style={styles.backIcon}/>
          </TouchableOpacity>
          <Text style={styles.headerText}>Chi tiết</Text>
        </View>

        <Image source={article?.image_url ? { uri: article.image_url } : require('../images/default.jpg')}  
        style={styles.image} />
        <Text style={styles.title}>{article.title}</Text>
        {/* <Text style={styles.source}>{article.short_intro}</Text> */}
        <Text style={styles.time}>{article.date}</Text>
        <Text style={styles.content}>{article.content}</Text>
      </ScrollView>
      {/* Nút play cố định ở góc trên phải */}
      <TouchableOpacity style={styles.floatingButton} onPress={handlePlayPause}>
        <Image 
            source= {isPlaying ? require('../images/pause.png') : require('../images/play.png')} style={styles.playIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  backIcon: {
    width: 30, // Đặt kích thước cho icon quay lại
    height: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#202020',
  },
  backButton: {
    padding: 8, // Giữ nút quay lại cách biệt một chút
  },
  image: {
    marginTop: 20,
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  source: {
    color: '#ccc',
    fontSize: 14,
  },
  time: {
    color: '#888',
    fontSize: 12,
    marginVertical: 4,
  },
  content: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 8,
    marginBottom: 40,
    textAlign: 'justify', // Căn chỉnh đều 2 lề
    lineHeight: 22, // Tùy chỉnh khoảng cách giữa các dòng để nội dung dễ đọc hơn
  },
  
  floatingButton: {
    position: 'absolute', // Đặt vị trí tuyệt đối
    top: 20, // Cách trên màn hình 20 đơn vị
    right: 20, // Cách bên phải màn hình 20 đơn vị
    width: 60, // Kích thước của nút
    height: 60, // Kích thước của nút
    justifyContent: 'center', // Canh giữa icon trong nút
    alignItems: 'center', // Canh giữa icon trong nút
  },
  playIcon: {
    width: 40, // Đặt kích thước cho biểu tượng play
    height: 40,
  },
});

export default ArticleDetailPage;
