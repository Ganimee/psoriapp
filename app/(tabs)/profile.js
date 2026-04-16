import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
//import * as Notifications from 'expo-notifications';
import { Camera } from 'expo-camera';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

// --------- OPTION BİLEŞENİ ---------
const Option = ({ icon, label, onPress, rightComponent, darkMode }) => (
  <TouchableOpacity
    style={[
      styles.option,
      {
        backgroundColor: darkMode ? '#1E1E1E' : '#FFF',
        borderWidth: 1,
        borderColor: darkMode ? '#333' : '#EEE', // eşit border
      },
    ]}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={styles.optionLeft}>
      <View
        style={[
          styles.iconBox,
          { backgroundColor: darkMode ? '#444' : '#FAD2D8' },
        ]}
      >
        <Feather name={icon} size={18} color={darkMode ? '#FFF' : '#8B2635'} />
      </View>
      <Text style={[styles.optionLabel, { color: darkMode ? '#FFF' : '#8B2635' }]}>
        {label}
      </Text>
    </View>
    {rightComponent ? rightComponent : <Feather name="chevron-right" size={18} color={darkMode ? '#AAA' : '#ccc'} />}
  </TouchableOpacity>
);

// --------- ANA COMPONENT ---------
export default function ProfileScreen() {
  const router = useRouter();
  const [view, setView] = useState('main');

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const [skinType, setSkinType] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const [currentPassword, setCurrentPassword] = useState('123456');
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  // ---------- İZİNLER ----------
  const handleCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === 'granted') setCameraPermission(true);
    else Alert.alert('Hata', 'Kamera izni verilmedi.');
  };

  const handleLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') setLocationPermission(true);
    else Alert.alert('Hata', 'Konum izni verilmedi.');
  };

  const handleNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') setNotifications(true);
    else setNotifications(false);
  };

  // ---------- ŞİFRE DEĞİŞTİR ----------
  const handleChangePassword = () => {
    if (oldPasswordInput !== currentPassword) {
      setPasswordMessage('❌ Mevcut şifre hatalı!');
      return;
    }
    if (newPasswordInput.length < 3) {
      setPasswordMessage('⚠️ Yeni şifre en az 3 karakter olmalı!');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordMessage('❌ Yeni şifreler eşleşmiyor!');
      return;
    }

    setCurrentPassword(newPasswordInput);
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordMessage('✅ Şifre başarıyla değiştirildi!');

    setTimeout(() => {
      setPasswordMessage('');
      setView('main');
    }, 2000);
  };

  // --------- VIEW RENDER ---------
  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#FFF5F6' }]}>
      {view === 'main' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ---------- PROFİL HEADER ---------- */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>G</Text>
              </View>
            </View>
            <Text style={[styles.profileName, { color: darkMode ? '#FFF' : '#8B2635' }]}>
              Ganime
            </Text>
            <Text style={[styles.profileEmail, { color: darkMode ? '#AAA' : '#A05555' }]}>
              ganime@gmail.com
            </Text>
          </View>

         {/* ---------- DARK MODE SWITCH (GÜNCELLENMİŞ) ---------- */}
<View style={[
  styles.option, // permissionBox yerine option stilini kullanıyoruz
  { 
    backgroundColor: darkMode ? '#1E1E1E' : '#FFF', 
    borderColor: darkMode ? '#333' : '#EEE', 
    borderWidth: 1 
  }
]}>
  <View style={styles.optionLeft}>
    <View style={[styles.iconBox, { backgroundColor: darkMode ? '#444' : '#FAD2D8' }]}>
      <Feather name="moon" size={18} color={darkMode ? '#FFF' : '#8B2635'} />
    </View>
    <Text style={[styles.optionLabel, { color: darkMode ? '#FFF' : '#8B2635' }]}>
      Koyu Mod
    </Text>
  </View>
  <Switch
    value={darkMode}
    onValueChange={setDarkMode}
    thumbColor={darkMode ? '#8B2635' : '#f4f3f4'}
    trackColor={{ false: '#ccc', true: '#FAD2D8' }}
  />
</View>

          {/* ---------- SEÇENEKLER ---------- */}
          <Option label="Kullanıcı Bilgilerim" icon="user" onPress={() => setView('user')} darkMode={darkMode} />
          <Option label="Şifre Değiştir" icon="lock" onPress={() => setView('password')} darkMode={darkMode} />

          <Option
            label="İzinler"
            icon="settings"
            onPress={() => setShowPermissions(!showPermissions)}
            darkMode={darkMode}
            rightComponent={
              <Feather
                name={showPermissions ? 'chevron-down' : 'chevron-right'}
                size={18}
                color={darkMode ? '#AAA' : '#ccc'}
              />
            }
          />

          {/* ---------- İZİNLER BOX ---------- */}
          {showPermissions && (
            <View style={[styles.permissionBox, { backgroundColor: darkMode ? '#1E1E1E' : '#FFF', borderColor: darkMode ? '#333' : '#EEE', borderWidth: 1 }]}>
              <View style={styles.permissionRow}>
                <Text style={[styles.permissionLabel, { color: darkMode ? '#FFF' : '#8B2635' }]}>
                  Bildirimler
                </Text>
                <Switch
                  value={notifications}
                  onValueChange={handleNotificationPermission}
                  thumbColor={notifications ? '#8B2635' : '#f4f3f4'}
                  trackColor={{ false: '#ccc', true: '#FAD2D8' }}
                />
              </View>
              <View style={styles.permissionRow}>
                <Text style={[styles.permissionLabel, { color: darkMode ? '#FFF' : '#8B2635' }]}>
                  Kamera
                </Text>
                <Switch
                  value={cameraPermission}
                  onValueChange={handleCameraPermission}
                  thumbColor={cameraPermission ? '#8B2635' : '#f4f3f4'}
                  trackColor={{ false: '#ccc', true: '#FAD2D8' }}
                />
              </View>
              <View style={styles.permissionRow}>
                <Text style={[styles.permissionLabel, { color: darkMode ? '#FFF' : '#8B2635' }]}>
                  Konum
                </Text>
                <Switch
                  value={locationPermission}
                  onValueChange={handleLocationPermission}
                  thumbColor={locationPermission ? '#8B2635' : '#f4f3f4'}
                  trackColor={{ false: '#ccc', true: '#FAD2D8' }}
                />
              </View>
            </View>
          )}

          {/* ---------- ÇIKIŞ BUTTON ---------- */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => router.replace('/login')}
          >
            <Feather name="log-out" size={20} color="#8B2635" />
            <Text style={styles.logoutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ---------- USER VIEW ---------- */}
      {view === 'user' && (
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: darkMode ? '#FFF' : '#8B2635' }]}>
            Kullanıcı Bilgilerim
          </Text>
          <Text style={[styles.label, { color: darkMode ? '#FFF' : '#8B2635' }]}>Cilt Tipi</Text>
          <View style={[styles.pickerContainer, { backgroundColor: darkMode ? '#333' : '#FFF', borderColor: darkMode ? '#333' : '#EEE', borderWidth: 1 }]}>
            <Picker
              selectedValue={skinType}
              onValueChange={setSkinType}
              style={{ color: darkMode ? '#FFF' : '#8B2635' }}
            >
              <Picker.Item label="Seçiniz" value="" />
              <Picker.Item label="Kuru" value="kuru" />
              <Picker.Item label="Yağlı" value="yagli" />
              <Picker.Item label="Karma" value="karma" />
            </Picker>
          </View>

          <Text style={[styles.label, { color: darkMode ? '#FFF' : '#8B2635' }]}>Boy (cm)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: darkMode ? '#333' : '#FFF', color: darkMode ? '#FFF' : '#333', borderColor: darkMode ? '#333' : '#EEE', borderWidth: 1 }]}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="Örn: 170"
            placeholderTextColor={darkMode ? '#AAA' : '#999'}
          />

          <Text style={[styles.label, { color: darkMode ? '#FFF' : '#8B2635' }]}>Kilo (kg)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: darkMode ? '#333' : '#FFF', color: darkMode ? '#FFF' : '#333', borderColor: darkMode ? '#333' : '#EEE', borderWidth: 1 }]}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Örn: 65"
            placeholderTextColor={darkMode ? '#AAA' : '#999'}
          />

          <TouchableOpacity style={styles.button} onPress={() => setView('main')}>
            <Text style={styles.buttonText}>Kaydet</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* ---------- PASSWORD VIEW ---------- */}
      {view === 'password' && (
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: darkMode ? '#FFF' : '#8B2635' }]}>Şifre Değiştir</Text>
          <TextInput
            placeholder="Mevcut Şifre"
            secureTextEntry
            style={[styles.input, { backgroundColor: darkMode ? '#333' : '#FFF', color: darkMode ? '#FFF' : '#333', borderColor: darkMode ? '#333' : '#EEE', borderWidth: 1 }]}
            value={oldPasswordInput}
            onChangeText={setOldPasswordInput}
            placeholderTextColor={darkMode ? '#AAA' : '#999'}
          />
          <TextInput
            placeholder="Yeni Şifre"
            secureTextEntry
            style={[styles.input, { backgroundColor: darkMode ? '#333' : '#FFF', color: darkMode ? '#FFF' : '#333', borderColor: darkMode ? '#333' : '#EEE', borderWidth: 1 }]}
            value={newPasswordInput}
            onChangeText={setNewPasswordInput}
            placeholderTextColor={darkMode ? '#AAA' : '#999'}
          />
          <TextInput
            placeholder="Yeni Şifre Tekrar"
            secureTextEntry
            style={[styles.input, { backgroundColor: darkMode ? '#333' : '#FFF', color: darkMode ? '#FFF' : '#333', borderColor: darkMode ? '#333' : '#EEE', borderWidth: 1 }]}
            value={confirmPasswordInput}
            onChangeText={setConfirmPasswordInput}
            placeholderTextColor={darkMode ? '#AAA' : '#999'}
          />

          {passwordMessage ? (
            <View
              style={[
                styles.messageBox,
                { backgroundColor: passwordMessage.includes('başarıyla') ? '#E8F5E9' : '#FFEBEE' },
              ]}
            >
              <Text
                style={{
                  color: passwordMessage.includes('başarıyla') ? '#2E7D32' : '#C62828',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {passwordMessage}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
            <Text style={styles.buttonText}>Şifreyi Değiştir</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#ccc', marginTop: 10 }]}
            onPress={() => setView('main')}
          >
            <Text style={[styles.buttonText, { color: '#555' }]}>Geri Dön</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

// --------- STİLLER ---------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 50 },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatarWrapper: { position: 'relative' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#8B2635',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  avatarText: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  profileName: { marginTop: 10, fontSize: 20, fontWeight: 'bold' },
  profileEmail: { fontSize: 14, marginBottom: 5 },

option: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 16,
  borderRadius: 18,
  marginBottom: 12, // HEPSİNDE AYNI OLMALI
  alignItems: 'center',
  elevation: 2,
  shadowColor: '#000', // Mobilde daha yumuşak gölge için
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
},
permissionBox: {
  padding: 16,
  borderRadius: 18,
  marginBottom: 12, // OPTION İLE AYNI YAPTIK
  elevation: 2, // Eşitledik
  borderWidth: 1,
},
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: { fontWeight: 'bold', fontSize: 15 },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FAD2D8',
    padding: 15,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: { marginLeft: 10, color: '#8B2635', fontWeight: 'bold', fontSize: 16 },

 
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionLabel: { fontWeight: 'bold', fontSize: 15 },

  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { padding: 14, borderRadius: 12, marginTop: 10, borderWidth: 1 }, // eşit border
  button: { backgroundColor: '#8B2635', padding: 15, borderRadius: 12, marginTop: 20, alignItems: 'center', elevation: 3 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  label: { marginTop: 15, fontWeight: 'bold', fontSize: 14 },
  pickerContainer: { borderRadius: 12, marginTop: 8, overflow: 'hidden', borderWidth: 1 }, // eşit border
  messageBox: { padding: 14, borderRadius: 12, marginTop: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
});