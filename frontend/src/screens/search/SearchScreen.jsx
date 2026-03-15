import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// 인기 가게 
const popularStores = [
  { id: 1, name: '메가커피', image: require('../../../assets/logo/megalogo.png') },
  { id: 2, name: '청년다방', image: require('../../../assets/logo/chunglogo.png') },
  { id: 3, name: '요아정', image: require('../../../assets/logo/yoajunglogo.png') },
  { id: 4, name: 'CU', image: require('../../../assets/logo/culogo.png') },
  { id: 5, name: '스타벅스', image: require('../../../assets/logo/starlogo.png') },
];

// 추천 가게
const recommendCards = [
  { id: 1, name: '본죽', image: require('../../../assets/event/bonjukevent.png') },
  { id: 2, name: '이디야커피', image: require('../../../assets/event/idiyaevent.png') },
  { id: 3, name: '설빙', image: require('../../../assets/event/sulbingevent.png') },
];

export default function SearchHomeScreen() {
  const [keyword, setKeyword] = useState('');
  const [recentKeywords, setRecentKeywords] = useState([]);
  const inputRef = useRef(null);

  const addRecentKeyword = (newKeyword) => {
    const trimmed = newKeyword.trim();
    if (!trimmed) return;

    setRecentKeywords((prev) => {
      const filtered = prev.filter((item) => item !== trimmed);
      return [trimmed, ...filtered].slice(0, 10); 
    });
  };

  const removeKeyword = (targetKeyword) => {
    setRecentKeywords((prev) =>
      prev.filter((item) => item !== targetKeyword)
    );
  };

  const handleSearch = () => {
    const trimmed = keyword.trim();

    if (!trimmed) {
      Alert.alert('알림', '검색어를 입력해주세요.');
      return;
    }

    addRecentKeyword(trimmed);

    console.log('검색어:', trimmed);
  };

  const handleKeywordPress = (item) => {
    setKeyword(item);
    addRecentKeyword(item);
    console.log('최근 검색어 선택:', item);
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topBlankArea} />

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          style={styles.searchBox}
        >
          <Ionicons name="search-outline" size={20} color="#8D8D8D" />

          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="나에게 딱맞는 혜택 정보 검색"
            placeholderTextColor="#9A9A9A"
            value={keyword}
            onChangeText={setKeyword}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />

          {!!keyword && (
            <TouchableOpacity onPress={() => setKeyword('')}>
              <Ionicons name="close-circle" size={18} color="#9A9A9A" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View style={styles.banner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerSmall}>기왕 먹는 도넛 싸게 먹자</Text>
            <Text style={styles.bannerTitle}>
              5,000원 이상 구매 시, 글레이즈드 도넛 1,000원
            </Text>
            <Text style={styles.bannerSub}>던킨도너츠 인하대후문점</Text>
          </View>
          <Image
            source={require('../../../assets/dount.png')}
            style={styles.bannerImage}
          />
        </View>

        <Text style={styles.sectionTitle}>최근 검색어</Text>

        <View style={styles.keywordWrap}>
          {recentKeywords.map((item) => (
            <View key={item} style={styles.keywordChip}>
              <TouchableOpacity onPress={() => handleKeywordPress(item)}>
                <Text style={styles.keywordText}>{item}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => removeKeyword(item)}
                style={styles.keywordDelete}
              >
                <Ionicons name="close" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>인기 가게</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storeRow}
        >
          {popularStores.map((store) => (
            <TouchableOpacity key={store.id} style={styles.storeItem}>
              <Image source={store.image} style={styles.storeImage} />
              <Text style={styles.storeName} numberOfLines={1}>
                {store.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>
          김인하님 이 가게는 어때요?
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardRow}
        >
          {recommendCards.map((card) => (
            <TouchableOpacity key={card.id} style={styles.recommendCard}>
              <Image source={card.image} style={styles.recommendImage} />
              <Text style={styles.recommendName}>{card.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  topBlankArea: {
    height: 80,
    backgroundColor: '#EDEDED',
  },

  searchBox: {
    marginHorizontal: 18,
    marginTop: -18,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    height: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#222',
    paddingVertical: 0,
  },

  banner: {
    marginTop: 18,
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  bannerSmall: {
    fontSize: 11,
    color: '#333',
    marginBottom: 2,
  },

  bannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
    lineHeight: 21,
  },

  bannerSub: {
    fontSize: 10,
    color: '#777',
    marginTop: 4,
  },

  bannerImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
    marginLeft: 10,
  },





  sectionTitle: {
    marginTop: 28,
    marginHorizontal: 18,
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
  },







  keywordWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 18,
    marginTop: 10,
    gap: 6,
  },

  keywordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5A17FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  keywordText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  keywordDelete: {
    marginLeft: 6,
  },






  storeRow: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },

  storeItem: {
    width: 72,
    alignItems: 'center',
    marginRight: 14,
  },
  
  storeImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  
  storeName: {
    fontSize: 12,
    color: '#333',
  },






  cardRow: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },



  
  recommendCard: {
    width: 165,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
  },

  recommendImage: {
    width: '100%',
    height: 108,
    borderRadius: 12,
 },
  recommendName: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 4,
  },

});