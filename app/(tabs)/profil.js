import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

// --- 1. YARDIMCI BİLEŞENLER (KLAVYE SORUNUNU ÇÖZMEK İÇİN DIŞARIDA TANIMLANDI) ---

const Option = ({ icon, label, onPress, rightComponent }) => (
  <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
    <View style={styles.optionLeft}>
      <View style={styles.iconBox}>
        <Feather name={icon} size={18} color="#8B2635" />
      </View>
      <Text style={styles.optionLabel}>{label}</Text>
    </View>
    {rightComponent ? rightComponent : <Feather name="chevron-right" size={18} color="#ccc" />}
  </TouchableOpacity>
);

const MainView = ({ setView, notifications, setNotifications, darkMode, setDarkMode, router }) => (
  <ScrollView showsVerticalScrollIndicator={false}>
    <View style={styles.profileHeader}>
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>G</Text>
        </View>
        <TouchableOpacity style={styles.cameraButton}>
          <Feather name="camera" size={16} color="#8B2635" />
        </TouchableOpacity>
      </View>
      <Text style={styles.profileName}>Ganime</Text>
      <Text style={styles.profileEmail}>ganime@email.com</Text>
      <View style={styles.premiumBadge}>
        <Text style={styles.premiumText}>Premium Üye</Text>
      </View>
    </View>

    <Option label="Kullanıcı Bilgilerim" icon="user" onPress={() => setView('user')} />
    <Option label="Şifre Değiştir" icon="lock" onPress={() => setView('password')} />
{/* BİLDİRİMLER AYARI */}
<Option
  label="Bildirimler"
  icon="bell"
  rightComponent={
    <Switch 
      value={notifications} 
      onValueChange={setNotifications} 
      thumbColor={notifications ? "#8B2635" : "#f4f3f4"} // Yuvarlak Bordo oldu
      trackColor={{ false: "#ccc", true: "#FAD2D8" }} // Ray Pudra Pembe oldu
    />
  }
/>

{/* KARANLIK MOD AYARI */}
<Option
  label="Karanlık Mod"
  icon="moon"
  rightComponent={
    <Switch 
      value={darkMode} 
      onValueChange={setDarkMode} 
      thumbColor={darkMode ? "#8B2635" : "#f4f3f4"} // Yuvarlak Bordo oldu
      trackColor={{ false: "#ccc", true: "#FAD2D8" }} // Ray Pudra Pembe oldu
    />
  }
/>
    <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/login')}>
      <Feather name="log-out" size={20} color="#8B2635" />
      <Text style={styles.logoutText}>Çıkış Yap</Text>
    </TouchableOpacity>
  </ScrollView>
);

const UserView = ({ setView, skinType, setSkinType, height, setHeight, weight, setWeight }) => (
  <ScrollView keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Kullanıcı Bilgilerim</Text>
    <Text style={styles.label}>Cilt Tipi</Text>
    <View style={styles.pickerContainer}>
      <Picker selectedValue={skinType} onValueChange={setSkinType} style={{ color: '#8B2635' }}>
        <Picker.Item label="Seçiniz" value="" />
        <Picker.Item label="Kuru" value="kuru" />
        <Picker.Item label="Yağlı" value="yagli" />
        <Picker.Item label="Karma" value="karma" />
      </Picker>
    </View>

    <Text style={styles.label}>Boy (cm)</Text>
    <TextInput style={styles.input} value={height} onChangeText={setHeight} keyboardType="numeric" placeholder="Örn: 170" />

    <Text style={styles.label}>Kilo (kg)</Text>
    <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="numeric" placeholder="Örn: 65" />

    <TouchableOpacity style={styles.button} onPress={() => setView('main')}>
      <Text style={styles.buttonText}>Kaydet</Text>
    </TouchableOpacity>
  </ScrollView>
);

const PasswordView = ({ 
  setView, 
  oldPasswordInput, setOldPasswordInput, 
  newPasswordInput, setNewPasswordInput, 
  confirmPasswordInput, setConfirmPasswordInput, 
  passwordMessage, handleChangePassword 
}) => (
  <ScrollView keyboardShouldPersistTaps="handled">
    <Text style={styles.title}>Şifre Değiştir</Text>

    <TextInput
      placeholder="Mevcut Şifre"
      secureTextEntry
      style={styles.input}
      value={oldPasswordInput}
      onChangeText={setOldPasswordInput}
    />
    <TextInput
      placeholder="Yeni Şifre"
      secureTextEntry
      style={styles.input}
      value={newPasswordInput}
      onChangeText={setNewPasswordInput}
    />
    <TextInput
      placeholder="Yeni Şifre Tekrar"
      secureTextEntry
      style={styles.input}
      value={confirmPasswordInput}
      onChangeText={setConfirmPasswordInput}
    />

    {passwordMessage ? (
      <View style={[
        styles.messageBox, 
        { backgroundColor: passwordMessage.includes('başarıyla') ? '#E8F5E9' : '#FFEBEE' }
      ]}>
        <Text style={{ 
          color: passwordMessage.includes('başarıyla') ? '#2E7D32' : '#C62828',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
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
);

// --- 2. ANA BİLEŞEN (LOGIC BURADA) ---

export default function ProfileScreen() {
  const router = useRouter();
  const [view, setView] = useState('main');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const [skinType, setSkinType] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const [currentPassword, setCurrentPassword] = useState('123456');
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleChangePassword = () => {
    if (oldPasswordInput !== currentPassword) {
      setPasswordMessage('❌ Mevcut şifre hatalı!');
      return;
    }
    if (newPasswordInput === '' || newPasswordInput.length < 3) {
      setPasswordMessage('⚠️ Yeni şifre en az 3 karakter olmalı!');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordMessage('❌ Yeni şifreler eşleşmiyor!');
      return;
    }

    // BAŞARILI DURUM
    setCurrentPassword(newPasswordInput);
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setPasswordMessage('✅ Şifre başarıyla değiştirildi!');

    // 2 saniye sonra otomatik ana sayfaya dön
    setTimeout(() => {
      setPasswordMessage('');
      setView('main');
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#FFF5F6' }]}>
      {view === 'main' && (
        <MainView 
          setView={setView} notifications={notifications} setNotifications={setNotifications} 
          darkMode={darkMode} setDarkMode={setDarkMode} router={router} 
        />
      )}
      {view === 'user' && (
        <UserView 
          setView={setView} skinType={skinType} setSkinType={setSkinType} 
          height={height} setHeight={setHeight} weight={weight} setWeight={setWeight} 
        />
      )}
      {view === 'password' && (
        <PasswordView 
          setView={setView} oldPasswordInput={oldPasswordInput} setOldPasswordInput={setOldPasswordInput}
          newPasswordInput={newPasswordInput} setNewPasswordInput={setNewPasswordInput}
          confirmPasswordInput={confirmPasswordInput} setConfirmPasswordInput={setConfirmPasswordInput}
          passwordMessage={passwordMessage} handleChangePassword={handleChangePassword}
        />
      )}
    </View>
  );
}

// --- 3. STİLLER ---

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
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    elevation: 3,
  },
  profileName: { marginTop: 10, fontSize: 20, fontWeight: 'bold', color: '#8B2635' },
  profileEmail: { fontSize: 14, color: '#A05555', marginBottom: 5 },
  premiumBadge: {
    marginTop: 6,
    backgroundColor: '#8B2635',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  premiumText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 38,
    height: 38,
    backgroundColor: '#FAD2D8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLabel: { fontWeight: 'bold', color: '#8B2635', fontSize: 15 },
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
  title: { fontSize: 22, fontWeight: 'bold', color: '#8B2635', marginBottom: 20 },
  input: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee',
    color: '#333',
  },
  button: {
    backgroundColor: '#8B2635',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  label: { marginTop: 15, color: '#8B2635', fontWeight: 'bold', fontSize: 14 },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#eee',
    overflow: 'hidden',
  },
  messageBox: {
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
});