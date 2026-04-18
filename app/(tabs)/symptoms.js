import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Alert,
  Platform,
  

} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native';

import {
  Home,
  Activity,
  Pill,
  BarChart3,
  User,
  Camera,
  Image as ImageIcon,
  CalendarDays,
  Save,
  Trash2,
  
} from 'lucide-react-native';

const STORAGE_KEY = 'symptom_records_v1';

export default function SymptomsScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('form');

  const [selectedParts, setSelectedParts] = useState([]);
  const [painLevel, setPainLevel] = useState(0);
  const [itchLevel, setItchLevel] = useState(0);
  const [weather, setWeather] = useState('Yükleniyor...');
  const [bodyView, setBodyView] = useState('front');
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [savedSymptoms, setSavedSymptoms] = useState([]);

  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [showFilterStartPicker, setShowFilterStartPicker] = useState(false);
  const [showFilterEndPicker, setShowFilterEndPicker] = useState(false);
  const [filteredSymptoms, setFilteredSymptoms] = useState([]);
  const [note, setNote] = useState('');

  const frontParts = [
    { key: 'head-front', label: 'Baş (Ön)' },
    { key: 'chest', label: 'Göğüs' },
    { key: 'abdomen', label: 'Karın' },
    { key: 'left-arm-front', label: 'Sol Kol (Ön)' },
    { key: 'right-arm-front', label: 'Sağ Kol (Ön)' },
    { key: 'left-leg-front', label: 'Sol Bacak (Ön)' },
    { key: 'right-leg-front', label: 'Sağ Bacak (Ön)' },
  ];

  const backParts = [
    { key: 'head-back', label: 'Baş (Arka)' },
    { key: 'upper-back', label: 'Sırt Üst' },
    { key: 'lower-back', label: 'Bel / Sırt Alt' },
    { key: 'left-arm-back', label: 'Sol Kol (Arka)' },
    { key: 'right-arm-back', label: 'Sağ Kol (Arka)' },
    { key: 'left-leg-back', label: 'Sol Bacak (Arka)' },
    { key: 'right-leg-back', label: 'Sağ Bacak (Arka)' },
  ];

  const moodOptions = [
    'Mutluluk',
    'Üzüntü',
    'Stres',
    'Kaygı',
    'Huzur',
    'Öfke',
    'Yorgunluk',
  ];

  const allParts = [...frontParts, ...backParts];

  useEffect(() => {
    fetchWeather();
    loadSavedSymptoms();
  }, []);

  useEffect(() => {
    setFilteredSymptoms(savedSymptoms);
  }, [savedSymptoms]);

  const togglePart = (part) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter((p) => p !== part));
    } else {
      setSelectedParts([...selectedParts, part]);
    }
  };

  const toggleMood = (mood) => {
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(selectedMoods.filter((m) => m !== mood));
    } else {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const getColor = (part) =>
    selectedParts.includes(part) ? '#8B2635' : '#E2E8F0';

  const getPartLabel = (partKey) => {
    const found = allParts.find((item) => item.key === partKey);
    return found ? found.label : partKey;
  };

  const weatherCodeToText = (code) => {
    if (code === 0) return 'Güneşli';
    if ([1, 2, 3].includes(code)) return 'Bulutlu';
    if ([45, 48].includes(code)) return 'Sisli';
    if ([61, 63, 65, 80, 81, 82].includes(code)) return 'Yağmurlu';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Karlı';
    if ([95, 96, 99].includes(code)) return 'Fırtınalı';
    return 'Bilinmiyor';
  };

  const fetchWeather = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setWeather('Konum izni yok');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code`
      );

      const data = await res.json();
      const code = data?.current?.weather_code;
      setWeather(weatherCodeToText(code));
    } catch (e) {
      console.log(e);
      setWeather('Hata');
    }
  };

  const pickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('İzin Gerekli', 'Galeriden fotoğraf seçmek için izin vermelisiniz.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Hata', 'Galeriden fotoğraf seçilemedi.');
    }
  };

  const pickFromCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert('İzin Gerekli', 'Kamera kullanmak için izin vermelisiniz.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Hata', 'Kamera açılamadı.');
    }
  };

  const onChangeDate = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  };

  const onChangeFilterStartDate = (event, date) => {
    if (Platform.OS === 'android') {
      setShowFilterStartPicker(false);
    }

    if (date) {
      setFilterStartDate(date);
    }
  };

  const onChangeFilterEndDate = (event, date) => {
    if (Platform.OS === 'android') {
      setShowFilterEndPicker(false);
    }

    if (date) {
      setFilterEndDate(date);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Tarih Seç';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  };

  const loadSavedSymptoms = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedSymptoms(parsed);
        setFilteredSymptoms(parsed);
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Hata', 'Kayıtlı semptomlar yüklenemedi.');
    }
  };

  const saveSymptomsToStorage = async (records) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      setSavedSymptoms(records);
      setFilteredSymptoms(records);
    } catch (error) {
      console.log(error);
      Alert.alert('Hata', 'Semptomlar kaydedilemedi.');
    }
  };

  const resetForm = () => {
    setSelectedParts([]);
    setPainLevel(0);
    setItchLevel(0);
    setSelectedMoods([]);
    setSelectedImage(null);
    setSelectedDate(new Date());
    setBodyView('front');
  };

  const handleSave = async () => {
    const newRecord = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      selectedDate: selectedDate.toISOString(),
      weather,
      selectedParts,
      painLevel,
      itchLevel,
      selectedMoods,
      selectedImage,
      note,
    };

    const updatedRecords = [newRecord, ...savedSymptoms];
    await saveSymptomsToStorage(updatedRecords);

    Alert.alert('Başarılı', 'Semptom kaydı kaydedildi.');
    resetForm();
    setActiveTab('records');
  };

  const deleteSymptomRecord = async (id) => {
    const filtered = savedSymptoms.filter((item) => item.id !== id);
    await saveSymptomsToStorage(filtered);
  };

  const confirmDeleteRecord = (id) => {
    Alert.alert(
      'Kaydı Sil',
      'Bu semptom kaydını silmek istiyor musun?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: () => deleteSymptomRecord(id) },
      ]
    );
  };

  const clearAllRecords = () => {
    Alert.alert(
      'Tüm Kayıtları Sil',
      'Tüm kayıtlı semptomlar silinsin mi?',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Tümünü Sil',
          style: 'destructive',
          onPress: async () => {
            await saveSymptomsToStorage([]);
          },
        },
      ]
    );
  };

  const applyDateFilter = () => {
    let filtered = [...savedSymptoms];

    if (filterStartDate) {
      const start = new Date(filterStartDate);
      start.setHours(0, 0, 0, 0);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.selectedDate);
        return itemDate >= start;
      });
    }

    if (filterEndDate) {
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.selectedDate);
        return itemDate <= end;
      });
    }

    setFilteredSymptoms(filtered);
  };

  const clearDateFilter = () => {
    setFilterStartDate(null);
    setFilterEndDate(null);
    setFilteredSymptoms(savedSymptoms);
  };

  const renderFrontBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <TouchableOpacity
          style={[styles.head, { backgroundColor: getColor('head-front') }]}
          onPress={() => togglePart('head-front')}
        />

        <View style={styles.shoulderRow}>
          <TouchableOpacity
            style={[styles.armUpperLeft, { backgroundColor: getColor('left-arm-front') }]}
            onPress={() => togglePart('left-arm-front')}
          />
          <TouchableOpacity
            style={[styles.chest, { backgroundColor: getColor('chest') }]}
            onPress={() => togglePart('chest')}
          />
          <TouchableOpacity
            style={[styles.armUpperRight, { backgroundColor: getColor('right-arm-front') }]}
            onPress={() => togglePart('right-arm-front')}
          />
        </View>

        <View style={styles.middleRow}>
          <TouchableOpacity
            style={[styles.armLowerLeft, { backgroundColor: getColor('left-arm-front') }]}
            onPress={() => togglePart('left-arm-front')}
          />
          <TouchableOpacity
            style={[styles.abdomen, { backgroundColor: getColor('abdomen') }]}
            onPress={() => togglePart('abdomen')}
          />
          <TouchableOpacity
            style={[styles.armLowerRight, { backgroundColor: getColor('right-arm-front') }]}
            onPress={() => togglePart('right-arm-front')}
          />
        </View>

       

        <View style={styles.legsRow}>
          <TouchableOpacity
            style={[styles.legLeftNew, { backgroundColor: getColor('left-leg-front') }]}
            onPress={() => togglePart('left-leg-front')}
          />
          <TouchableOpacity
            style={[styles.legRightNew, { backgroundColor: getColor('right-leg-front') }]}
            onPress={() => togglePart('right-leg-front')}
          />
        </View>
      </View>
    );
  };

  const renderBackBody = () => {
    return (
      <View style={styles.bodyContainer}>
        <TouchableOpacity
          style={[styles.head, { backgroundColor: getColor('head-back') }]}
          onPress={() => togglePart('head-back')}
        />

        <View style={styles.shoulderRow}>
          <TouchableOpacity
            style={[styles.armUpperLeft, { backgroundColor: getColor('left-arm-back') }]}
            onPress={() => togglePart('left-arm-back')}
          />
          <TouchableOpacity
            style={[styles.upperBack, { backgroundColor: getColor('upper-back') }]}
            onPress={() => togglePart('upper-back')}
          />
          <TouchableOpacity
            style={[styles.armUpperRight, { backgroundColor: getColor('right-arm-back') }]}
            onPress={() => togglePart('right-arm-back')}
          />
        </View>

        <View style={styles.middleRow}>
          <TouchableOpacity
            style={[styles.armLowerLeft, { backgroundColor: getColor('left-arm-back') }]}
            onPress={() => togglePart('left-arm-back')}
          />
          <TouchableOpacity
            style={[styles.lowerBack, { backgroundColor: getColor('lower-back') }]}
            onPress={() => togglePart('lower-back')}
          />
          <TouchableOpacity
            style={[styles.armLowerRight, { backgroundColor: getColor('right-arm-back') }]}
            onPress={() => togglePart('right-arm-back')}
          />
        </View>


        <View style={styles.legsRow}>
          <TouchableOpacity
            style={[styles.legLeftNew, { backgroundColor: getColor('left-leg-back') }]}
            onPress={() => togglePart('left-leg-back')}
          />
          <TouchableOpacity
            style={[styles.legRightNew, { backgroundColor: getColor('right-leg-back') }]}
            onPress={() => togglePart('right-leg-back')}
          />
        </View>
      </View>
    );
  };

  const renderFormTab = () => {
    return (
      <>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Fotoğraf Ekle</Text>

        

          <View style={styles.uploadButtonsRow}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickFromCamera}>
              <Camera size={18} color="#fff" />
              <Text style={styles.uploadButtonText}>Kamera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadButton} onPress={pickFromGallery}>
              <ImageIcon size={18} color="#fff" />
              <Text style={styles.uploadButtonText}>Galeri</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Hava Durumu</Text>
          <Text style={styles.weatherText}>{weather}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Vücut Bölgesi Seçimi</Text>

          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                bodyView === 'front' && styles.toggleButtonActive,
              ]}
              onPress={() => setBodyView('front')}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  bodyView === 'front' && styles.toggleButtonTextActive,
                ]}
              >
                Ön Vücut
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.toggleButton,
                bodyView === 'back' && styles.toggleButtonActive,
              ]}
              onPress={() => setBodyView('back')}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  bodyView === 'back' && styles.toggleButtonTextActive,
                ]}
              >
                Arka Vücut
              </Text>
            </TouchableOpacity>
          </View>

          {bodyView === 'front' ? renderFrontBody() : renderBackBody()}

          <View style={styles.selectedBox}>
            <Text style={styles.selectedTitle}>Seçilen Bölgeler</Text>

            {selectedParts.length === 0 ? (
              <Text style={styles.emptyText}>Henüz vücut bölgesi seçilmedi.</Text>
            ) : (
              <View style={styles.tagsContainer}>
                {selectedParts.map((part) => (
                  <View key={part} style={styles.tag}>
                    <Text style={styles.tagText}>{getPartLabel(part)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ağrı Şiddeti: {painLevel}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={painLevel}
            onValueChange={setPainLevel}
            minimumTrackTintColor="#8B2635"
            maximumTrackTintColor="#E8DADF"
            thumbTintColor="#8B2635"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Kaşıntı Şiddeti: {itchLevel}</Text>
          <Slider
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={itchLevel}
            onValueChange={setItchLevel}
            minimumTrackTintColor="#D94F70"
            maximumTrackTintColor="#E8DADF"
            thumbTintColor="#D94F70"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Duygu Durumu</Text>
          <Text style={styles.helperText}>
            Semptomlarla ilişkisini görmek için ruh halini seçebilirsin.
          </Text>

          <View style={styles.tagsContainer}>
            {moodOptions.map((mood) => {
              const isSelected = selectedMoods.includes(mood);
              return (
                <TouchableOpacity
                  key={mood}
                  style={[styles.moodTag, isSelected && styles.moodTagActive]}
                  onPress={() => toggleMood(mood)}
                >
                  <Text
                    style={[
                      styles.moodTagText,
                      isSelected && styles.moodTagTextActive,
                    ]}
                  >
                    {mood}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tarih Seçimi</Text>

          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <CalendarDays size={18} color="#8B2635" />
            <Text style={styles.dateButtonText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDate}
            />
          )}
        </View>

            <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Not Ekle</Text>
                <TextInput
                  placeholder="Bugün nasıl hissettin? Eklemek istediğin bir şey var mı?"
                   value={note}
                  onChangeText={setNote}
                  multiline
                 style={styles.noteInput}
                />
                </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Semptom Özeti</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tarih:</Text>
            <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hava:</Text>
            <Text style={styles.summaryValue}>{weather}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ağrı:</Text>
            <Text style={styles.summaryValue}>{painLevel}/10</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Kaşıntı:</Text>
            <Text style={styles.summaryValue}>{itchLevel}/10</Text>
          </View>

          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Bölgeler:</Text>
            <Text style={styles.summaryMultiValue}>
              {selectedParts.length > 0
                ? selectedParts.map(getPartLabel).join(', ')
                : 'Seçilmedi'}
            </Text>
          </View>

          <View style={styles.summaryBlock}>
            <Text style={styles.summaryLabel}>Duygu Durumu:</Text>
            <Text style={styles.summaryMultiValue}>
              {selectedMoods.length > 0
                ? selectedMoods.join(', ')
                : 'Seçilmedi'}
            </Text>
          </View>
          <View style={styles.summaryBlock}>
    <Text style={styles.summaryLabel}>Not:</Text>
    <Text style={styles.summaryMultiValue}>
      {note ? note : 'Not eklenmedi'}
    </Text>
  </View>
          

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save size={18} color="#fff" />
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderRecordsTab = () => {
    return (
      <>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tarihsel Filtreleme</Text>

          <View style={styles.filterRow}>
            <TouchableOpacity
              style={styles.filterDateButton}
              onPress={() => setShowFilterStartPicker(true)}
            >
              <CalendarDays size={16} color="#8B2635" />
              <Text style={styles.filterDateText}>
                {filterStartDate ? formatDate(filterStartDate) : 'Başlangıç'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterDateButton}
              onPress={() => setShowFilterEndPicker(true)}
            >
              <CalendarDays size={16} color="#8B2635" />
              <Text style={styles.filterDateText}>
                {filterEndDate ? formatDate(filterEndDate) : 'Bitiş'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterActionRow}>
            <TouchableOpacity style={styles.filterButton} onPress={applyDateFilter}>
              <Text style={styles.filterButtonText}>Filtrele</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearFilterButton} onPress={clearDateFilter}>
              <Text style={styles.clearFilterButtonText}>Temizle</Text>
            </TouchableOpacity>
          </View>

          {showFilterStartPicker && (
            <DateTimePicker
              value={filterStartDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeFilterStartDate}
            />
          )}

          {showFilterEndPicker && (
            <DateTimePicker
              value={filterEndDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeFilterEndDate}
            />
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.savedHeader}>
            <Text style={styles.sectionTitle}>Kayıtlı Semptomlar</Text>

            {savedSymptoms.length > 0 && (
              <TouchableOpacity onPress={clearAllRecords}>
                <Text style={styles.clearAllText}>Tümünü Sil</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredSymptoms.length === 0 ? (
            <Text style={styles.emptyText}>Bu filtreye uygun kayıt bulunamadı.</Text>
          ) : (
            filteredSymptoms.map((item) => (
              <View key={item.id} style={styles.recordCard}>
                <View style={styles.recordTopRow}>
                  <View>
                    <Text style={styles.recordDate}>
                      {formatDate(item.selectedDate)} • {formatTime(item.createdAt)}
                    </Text>
                    <Text style={styles.recordWeather}>Hava: {item.weather}</Text>
                  </View>

                  <TouchableOpacity onPress={() => confirmDeleteRecord(item.id)}>
                    <Trash2 size={18} color="#B23A48" />
                  </TouchableOpacity>
                </View>

                <View style={styles.recordInfoBlock}>
                  <Text style={styles.recordLabel}>Bölgeler</Text>
                  <Text style={styles.recordValue}>
                    {item.selectedParts?.length > 0
                      ? item.selectedParts.map(getPartLabel).join(', ')
                      : 'Seçilmedi'}
                  </Text>
                </View>

                <View style={styles.recordRow}>
                  <Text style={styles.recordMini}>Ağrı: {item.painLevel}/10</Text>
                  <Text style={styles.recordMini}>Kaşıntı: {item.itchLevel}/10</Text>
                </View>

                <View style={styles.recordInfoBlock}>
                  <Text style={styles.recordLabel}>Duygu Durumu</Text>
                  <Text style={styles.recordValue}>
                    {item.selectedMoods?.length > 0
                      ? item.selectedMoods.join(', ')
                      : 'Seçilmedi'}
                  </Text>
                </View>
                <View style={styles.recordInfoBlock}>
  <Text style={styles.recordLabel}>Not</Text>
  <Text style={styles.recordValue}>
    {item.note ? item.note : 'Not yok'}
  </Text>
</View>
                

            



                {item.selectedImage ? (
                  <Image source={{ uri: item.selectedImage }} style={styles.recordImage} />
                ) : null}
              </View>
            ))
          )}
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        <Text style={styles.pageTitle}>Semptom Takibi</Text>

        <View style={styles.topTabContainer}>
          <TouchableOpacity
            style={[
              styles.topTabButton,
              activeTab === 'form' && styles.topTabButtonActive,
            ]}
            onPress={() => setActiveTab('form')}
          >
            <Text
              style={[
                styles.topTabButtonText,
                activeTab === 'form' && styles.topTabButtonTextActive,
              ]}
            >
              Semptom Ekle
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topTabButton,
              activeTab === 'records' && styles.topTabButtonActive,
            ]}
            onPress={() => setActiveTab('records')}
          >
            <Text
              style={[
                styles.topTabButtonText,
                activeTab === 'records' && styles.topTabButtonTextActive,
              ]}
            >
              Kayıtlı Semptomlar
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'form' ? renderFormTab() : renderRecordsTab()}
      </ScrollView>

     <View style={styles.bottomNav}>
  <TouchableOpacity onPress={() => router.push('/home')} style={styles.navItem}>
    <Home size={22} color="#b9a7ab" />
    <Text style={styles.navText}>Ana Sayfa</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.navItem}>
    <Activity size={22} color="#8B2635" />
    <Text style={[styles.navText, { color: '#8B2635' }]}>
      Semptom Takibi
    </Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.push('/treatment')} style={styles.navItem}>
    <Pill size={22} color="#b9a7ab" />
    <Text style={styles.navText}>Tedaviler</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.push('/analysis')} style={styles.navItem}>
    <BarChart3 size={22} color="#b9a7ab" />
    <Text style={styles.navText}>Analiz</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.push('/profile')} style={styles.navItem}>
    <User size={22} color="#b9a7ab" />
    <Text style={styles.navText}>Profil</Text>
  </TouchableOpacity>
</View>
</View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F6',
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B2635',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  topTabContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: '#f8e8eb',
    borderRadius: 16,
    padding: 4,
  },

  topTabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  topTabButtonActive: {
    backgroundColor: '#8B2635',
  },

  topTabButtonText: {
    color: '#8B2635',
    fontWeight: '700',
    fontSize: 14,
  },

  topTabButtonTextActive: {
    color: '#fff',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
  },

  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#630e0e',
    marginBottom: 12,
  },

  helperText: {
    color: '#7d6b70',
    fontSize: 13,
    marginBottom: 10,
  },

  weatherText: {
    fontSize: 18,
    color: '#8B2635',
    fontWeight: '600',
  },

  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f9',
    borderWidth: 1,
    borderColor: '#ebd4d9',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },

  dateButtonText: {
    marginLeft: 10,
    color: '#8B2635',
    fontSize: 15,
    fontWeight: '600',
  },

  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  filterDateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8f9',
    borderWidth: 1,
    borderColor: '#ebd4d9',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  filterDateText: {
    marginLeft: 8,
    color: '#8B2635',
    fontSize: 14,
    fontWeight: '600',
  },

  filterActionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  filterButton: {
    flex: 1,
    backgroundColor: '#8B2635',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  filterButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  clearFilterButton: {
    flex: 1,
    backgroundColor: '#f8e8eb',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ebd4d9',
  },

  clearFilterButtonText: {
    color: '#8B2635',
    fontWeight: '700',
  },

  uploadBox: {
    height: 180,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#d7b8bf',
    borderRadius: 16,
    backgroundColor: '#fff8f9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  uploadPlaceholder: {
    color: '#9b7f86',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  uploadButton: {
    flex: 1,
    backgroundColor: '#8B2635',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },

  toggleRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f8e8eb',
    borderRadius: 14,
    padding: 4,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  toggleButtonActive: {
    backgroundColor: '#8B2635',
  },

  toggleButtonText: {
    color: '#8B2635',
    fontWeight: '600',
  },

  toggleButtonTextActive: {
    color: '#fff',
  },

  bodyContainer: {
    width: 240,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },

  head: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
  },

  shoulderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  middleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: -2,
  },

  chest: {
    width: 86,
    height: 82,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  abdomen: {
    width: 72,
    height: 72,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  upperBack: {
    width: 88,
    height: 84,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  lowerBack: {
    width: 74,
    height: 70,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  armUpperLeft: {
    width: 24,
    height: 74,
    borderRadius: 14,
    marginRight: 6,
    marginTop: 6,
  },

  armUpperRight: {
    width: 24,
    height: 74,
    borderRadius: 14,
    marginLeft: 6,
    marginTop: 6,
  },

  armLowerLeft: {
    width: 22,
    height: 72,
    borderRadius: 14,
    marginRight: 10,
    marginTop: 2,
  },

  armLowerRight: {
    width: 22,
    height: 72,
    borderRadius: 14,
    marginLeft: 10,
    marginTop: 2,
  },

  hipRow: {
    marginTop: 2,
    marginBottom: 4,
    alignItems: 'center',
  },

  hip: {
    width: 62,
    height: 22,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
  },

  legsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },

  legLeftNew: {
    width: 30,
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  legRightNew: {
    width: 30,
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  selectedBox: {
    marginTop: 8,
    backgroundColor: '#fff8f9',
    borderRadius: 14,
    padding: 12,
  },

  selectedTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#8B2635',
    marginBottom: 10,
  },

  emptyText: {
    color: '#8a7a7f',
    fontSize: 14,
  },

  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  tag: {
    backgroundColor: '#8B2635',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  moodTag: {
    backgroundColor: '#f8e8eb',
    borderWidth: 1,
    borderColor: '#ead3d8',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  moodTagActive: {
    backgroundColor: '#8B2635',
    borderColor: '#8B2635',
  },

  moodTagText: {
    color: '#8B2635',
    fontSize: 13,
    fontWeight: '600',
  },

  moodTagTextActive: {
    color: '#fff',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  summaryBlock: {
    marginTop: 8,
    marginBottom: 4,
  },

  summaryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5c4a4f',
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 14,
    color: '#222',
  },

  summaryMultiValue: {
    fontSize: 14,
    color: '#222',
    lineHeight: 20,
  },

  saveButton: {
    marginTop: 16,
    backgroundColor: '#8B2635',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },

  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  clearAllText: {
    color: '#B23A48',
    fontWeight: '700',
    fontSize: 13,
  },

  recordCard: {
    backgroundColor: '#fff8f9',
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#f0dfe3',
  },

  recordTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },

  recordDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B2635',
  },

  recordWeather: {
    fontSize: 13,
    color: '#6e5d62',
    marginTop: 4,
  },

  recordInfoBlock: {
    marginBottom: 8,
  },

  recordLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5c4a4f',
    marginBottom: 2,
  },

  recordValue: {
    fontSize: 13,
    color: '#333',
    lineHeight: 19,
  },

  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  recordMini: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },

  recordImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginTop: 8,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1e5e8',
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
  },

  navText: {
    fontSize: 10,
    marginTop: 4,
    color: '#b9a7ab',
  },
  noteInput: {
  backgroundColor: '#fff8f9',
  borderRadius: 12,
  padding: 12,
  minHeight: 80,
  textAlignVertical: 'top',
  borderWidth: 1,
  borderColor: '#ebd4d9',
  color: '#333',
},
});