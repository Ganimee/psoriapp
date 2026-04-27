import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

import {
  Activity,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Crown,
  Flame,
  Home,
  Lock,
  Moon,
  Pill,
  Settings,
  Trophy,
  User,
  Zap,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const [view, setView] = useState('main');
  const [darkMode, setDarkMode] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [showMissions, setShowMissions] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const [skinType, setSkinType] = useState('karma');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');

  const [currentPassword, setCurrentPassword] = useState('123456');
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({
    text: '',
    type: '',
  });

  const [stats, setStats] = useState({
    loginStreak: 4,
    totalSymptomCount: 2,
    totalPhotoCount: 1,
    lastLoginDate: '2026-04-27',
    dailyLoginDone: true,
  });

  const [xp, setXp] = useState(185);
  const [completedMissionIds, setCompletedMissionIds] = useState([
    'streak_3',
    'photo_1',
  ]);

  const missionPool = [
    {
      id: 'streak_3',
      title: '3 Günlük Seri',
      xp: 50,
      type: 'streak',
      target: 3,
      dependsOn: null,
    },
    {
      id: 'streak_7',
      title: '7 Günlük Seri',
      xp: 150,
      type: 'streak',
      target: 7,
      dependsOn: 'streak_3',
    },
    {
      id: 'streak_30',
      title: '30 Günlük Efsane',
      xp: 1000,
      type: 'streak',
      target: 30,
      dependsOn: 'streak_7',
    },
    {
      id: 'photo_1',
      title: 'İlk Fotoğraf',
      xp: 40,
      type: 'photo',
      target: 1,
      dependsOn: null,
    },
    {
      id: 'photo_10',
      title: '10 Fotoğraf Arşivi',
      xp: 300,
      type: 'photo',
      target: 10,
      dependsOn: 'photo_1',
    },
    {
      id: 'symptom_5',
      title: '5 Semptom Girişi',
      xp: 100,
      type: 'symptom',
      target: 5,
      dependsOn: null,
    },
    {
      id: 'symptom_20',
      title: 'Düzenli Takipçi',
      xp: 400,
      type: 'symptom',
      target: 20,
      dependsOn: 'symptom_5',
    },
  ];

  const [activeMissions, setActiveMissions] = useState([]);

  useEffect(() => {
    const processed = missionPool.map((mission) => {
      let isCompleted = false;

      if (mission.type === 'streak' && stats.loginStreak >= mission.target) {
        isCompleted = true;
      }

      if (mission.type === 'photo' && stats.totalPhotoCount >= mission.target) {
        isCompleted = true;
      }

      if (
        mission.type === 'symptom' &&
        stats.totalSymptomCount >= mission.target
      ) {
        isCompleted = true;
      }

      return {
        ...mission,
        isCompleted,
      };
    });

    const newCompletedIds = [...completedMissionIds];
    let xpGain = 0;

    processed.forEach((mission) => {
      if (mission.isCompleted && !newCompletedIds.includes(mission.id)) {
        newCompletedIds.push(mission.id);
        xpGain += isPremium ? Math.floor(mission.xp * 1.5) : mission.xp;
      }
    });

    if (xpGain > 0) {
      setXp((prev) => prev + xpGain);
      setCompletedMissionIds(newCompletedIds);
    }

    const visibleMissions = processed.filter((mission) => {
      const successorCompleted = processed.some(
        (next) => next.dependsOn === mission.id && next.isCompleted
      );

      if (successorCompleted) return false;
      if (!mission.dependsOn) return true;

      const parent = processed.find((item) => item.id === mission.dependsOn);
      return parent && parent.isCompleted;
    });

    setActiveMissions(visibleMissions);
  }, [stats, isPremium]);

  const level = Math.floor(xp / 100) + 1;
  const progressPercentage = xp % 100;

  const handleNotificationPermission = () => {
    Alert.alert(
      'Bilgi',
      'Bildirim özelliği Expo Go içinde push olarak çalışmayabilir.'
    );

    setNotifications((prev) => !prev);
  };

  const handleCameraPermission = () => {
    setCameraPermission((prev) => !prev);
  };

  const handleLocationPermission = () => {
    setLocationPermission((prev) => !prev);
  };

  const handlePasswordChange = () => {
    if (oldPasswordInput !== currentPassword) {
      setPasswordMessage({
        text: 'Mevcut şifre hatalı!',
        type: 'error',
      });
      return;
    }

    if (newPasswordInput.length < 6) {
      setPasswordMessage({
        text: 'Yeni şifre en az 6 karakter olmalı!',
        type: 'error',
      });
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordMessage({
        text: 'Yeni şifreler eşleşmiyor!',
        type: 'error',
      });
      return;
    }

    setCurrentPassword(newPasswordInput);
    setOldPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');

    setPasswordMessage({
      text: 'Şifre başarıyla değiştirildi!',
      type: 'success',
    });

    setTimeout(() => {
      setPasswordMessage({ text: '', type: '' });
      setView('main');
    }, 1000);
  };

  const handlePurchase = () => {
    setIsPremium(true);
    Alert.alert('Başarılı', 'Premium üyelik aktif edildi.');
    setView('main');
  };

  const Option = ({ icon, label, onPress, rightComponent }) => (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: darkMode ? '#1E1E1E' : '#FFF',
          borderColor: darkMode ? '#333' : '#EEE',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.optionLeft}>
        <View
          style={[
            styles.iconBox,
            { backgroundColor: darkMode ? '#444' : '#FAD2D8' },
          ]}
        >
          {icon}
        </View>

        <Text
          style={[
            styles.optionLabel,
            { color: darkMode ? '#FFF' : '#8B2635' },
          ]}
        >
          {label}
        </Text>
      </View>

      {rightComponent || (
        <ChevronRight size={18} color={darkMode ? '#AAA' : '#CCC'} />
      )}
    </TouchableOpacity>
  );

  const renderMainView = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>G</Text>
          </View>

          {isPremium && (
            <View style={styles.premiumBadge}>
              <Crown size={14} color="#fff" />
            </View>
          )}

          <View
            style={[
              styles.streakBadge,
              { backgroundColor: stats.loginStreak > 1 ? '#F97316' : '#999' },
            ]}
          >
            <Flame size={13} color="#fff" />
            <Text style={styles.streakText}>{stats.loginStreak}</Text>
          </View>
        </View>

        <Text
          style={[
            styles.profileName,
            { color: darkMode ? '#FFF' : '#8B2635' },
          ]}
        >
          Ganime
        </Text>

        <Text
          style={[
            styles.profileEmail,
            { color: darkMode ? '#AAA' : '#A05555' },
          ]}
        >
          ganime@gmail.com
        </Text>
      </View>

      <View
        style={[
          styles.levelCard,
          {
            backgroundColor: darkMode ? '#1E1E1E' : '#FFF',
            borderColor: darkMode ? '#333' : '#FCE8EC',
          },
        ]}
      >
        <View style={styles.levelTop}>
          <View style={styles.levelLeft}>
            <View style={styles.trophyBox}>
              <Trophy size={18} color="#FFF" />
            </View>

            <View>
              <Text
                style={[
                  styles.levelSmallText,
                  { color: darkMode ? '#AAA' : '#A05555' },
                ]}
              >
                GELİŞİM
              </Text>
              <Text
                style={[
                  styles.levelText,
                  { color: darkMode ? '#FFF' : '#8B2635' },
                ]}
              >
                SEVİYE {level}
              </Text>
            </View>
          </View>

          <View style={styles.xpBox}>
            <Text style={styles.xpLabel}>XP</Text>
            <Text
              style={[
                styles.xpText,
                { color: darkMode ? '#FFF' : '#8B2635' },
              ]}
            >
              {xp}
            </Text>
          </View>
        </View>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
              },
            ]}
          />
        </View>
      </View>

      <View
        style={[
          styles.premiumCard,
          {
            backgroundColor: isPremium ? '#1F2937' : '#F59E0B',
          },
        ]}
      >
        <View style={styles.premiumCardTop}>
          <View>
            <Text style={styles.premiumTitle}>PREMIUM ÜYELİK</Text>
            <Text style={styles.premiumDesc}>
              {isPremium
                ? 'Tüm ayrıcalıklar aktif.'
                : 'Görevlerden %50 fazla XP kazan.'}
            </Text>
          </View>

          <Crown size={24} color="#FFF" />
        </View>

        <TouchableOpacity
          style={styles.premiumButton}
          onPress={() => setView('subscription')}
        >
          <Text style={styles.premiumButtonText}>
            {isPremium ? 'Yönet' : 'Hemen Yükselt'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.missionHeader}>
        <View style={styles.missionTitleLeft}>
          <Zap size={17} color="#F59E0B" />
          <Text
            style={[
              styles.missionTitle,
              { color: darkMode ? '#FFF' : '#8B2635' },
            ]}
          >
            Görevler
          </Text>
        </View>

        <TouchableOpacity
          style={styles.missionToggle}
          onPress={() => setShowMissions((prev) => !prev)}
        >
          <Text style={styles.missionToggleText}>
            {showMissions ? 'Gizle' : 'Göster'}
          </Text>

          {showMissions ? (
            <ChevronDown size={16} color="#A05555" />
          ) : (
            <ChevronRight size={16} color="#A05555" />
          )}
        </TouchableOpacity>
      </View>

      {showMissions &&
        activeMissions.map((mission) => (
          <View
            key={mission.id}
            style={[
              styles.missionCard,
              {
                backgroundColor: mission.isCompleted
                  ? '#E8F5E9'
                  : darkMode
                  ? '#1E1E1E'
                  : '#FFF',
                borderColor: mission.isCompleted
                  ? '#BDE5C1'
                  : darkMode
                  ? '#333'
                  : '#FFF',
              },
            ]}
          >
            <View style={styles.missionLeft}>
              <View
                style={[
                  styles.missionIconBox,
                  {
                    backgroundColor: mission.isCompleted ? '#C8E6C9' : '#F1F1F1',
                  },
                ]}
              >
                {mission.isCompleted ? (
                  <CheckCircle2 size={18} color="#2E7D32" />
                ) : (
                  <Circle size={18} color="#BBB" />
                )}
              </View>

              <View>
                <Text
                  style={[
                    styles.missionName,
                    {
                      color: mission.isCompleted
                        ? '#2E7D32'
                        : darkMode
                        ? '#FFF'
                        : '#8B2635',
                    },
                  ]}
                >
                  {mission.title}
                </Text>

                <Text style={styles.missionSubText}>
                  +{isPremium ? Math.floor(mission.xp * 1.5) : mission.xp} XP
                  {'  |  '}
                  {mission.type === 'streak'
                    ? `${stats.loginStreak}/${mission.target} Gün`
                    : mission.isCompleted
                    ? 'Tamamlandı'
                    : 'Sistem takipte'}
                </Text>
              </View>
            </View>
          </View>
        ))}

      <Option
        label="Kullanıcı Bilgilerim"
        icon={<User size={18} color={darkMode ? '#FFF' : '#8B2635'} />}
        onPress={() => setView('user')}
      />

      <Option
        label="Şifre Değiştir"
        icon={<Lock size={18} color={darkMode ? '#FFF' : '#8B2635'} />}
        onPress={() => setView('password')}
      />

      <Option
        label="Koyu Mod"
        icon={<Moon size={18} color={darkMode ? '#FFF' : '#8B2635'} />}
        rightComponent={
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? '#8B2635' : '#f4f3f4'}
            trackColor={{ false: '#CCC', true: '#FAD2D8' }}
          />
        }
      />

      <Option
        label="İzinler"
        icon={<Settings size={18} color={darkMode ? '#FFF' : '#8B2635'} />}
        onPress={() => setShowPermissions((prev) => !prev)}
        rightComponent={
          showPermissions ? (
            <ChevronDown size={18} color={darkMode ? '#AAA' : '#CCC'} />
          ) : (
            <ChevronRight size={18} color={darkMode ? '#AAA' : '#CCC'} />
          )
        }
      />

      {showPermissions && (
        <View
          style={[
            styles.permissionBox,
            {
              backgroundColor: darkMode ? '#1E1E1E' : '#FFF',
              borderColor: darkMode ? '#333' : '#EEE',
            },
          ]}
        >
          <View style={styles.permissionRow}>
            <Text
              style={[
                styles.permissionLabel,
                { color: darkMode ? '#FFF' : '#8B2635' },
              ]}
            >
              Bildirimler
            </Text>

            <Switch
              value={notifications}
              onValueChange={handleNotificationPermission}
              thumbColor={notifications ? '#8B2635' : '#f4f3f4'}
              trackColor={{ false: '#CCC', true: '#FAD2D8' }}
            />
          </View>

          <View style={styles.permissionRow}>
            <Text
              style={[
                styles.permissionLabel,
                { color: darkMode ? '#FFF' : '#8B2635' },
              ]}
            >
              Kamera
            </Text>

            <Switch
              value={cameraPermission}
              onValueChange={handleCameraPermission}
              thumbColor={cameraPermission ? '#8B2635' : '#f4f3f4'}
              trackColor={{ false: '#CCC', true: '#FAD2D8' }}
            />
          </View>

          <View style={styles.permissionRow}>
            <Text
              style={[
                styles.permissionLabel,
                { color: darkMode ? '#FFF' : '#8B2635' },
              ]}
            >
              Konum
            </Text>

            <Switch
              value={locationPermission}
              onValueChange={handleLocationPermission}
              thumbColor={locationPermission ? '#8B2635' : '#f4f3f4'}
              trackColor={{ false: '#CCC', true: '#FAD2D8' }}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace('/login')}
      >
        <Feather name="log-out" size={20} color="#8B2635" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderUserView = () => (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity style={styles.backButton} onPress={() => setView('main')}>
        <Feather name="chevron-left" size={20} color="#8B2635" />
        <Text style={styles.backButtonText}>Geri Dön</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: darkMode ? '#FFF' : '#8B2635' }]}>
        Kullanıcı Bilgilerim
      </Text>

      <Text style={[styles.label, { color: darkMode ? '#FFF' : '#8B2635' }]}>
        Cilt Tipi
      </Text>

      <View
        style={[
          styles.pickerContainer,
          {
            backgroundColor: darkMode ? '#333' : '#FFF',
            borderColor: darkMode ? '#333' : '#EEE',
          },
        ]}
      >
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

      <Text style={[styles.label, { color: darkMode ? '#FFF' : '#8B2635' }]}>
        Boy (cm)
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: darkMode ? '#333' : '#FFF',
            color: darkMode ? '#FFF' : '#333',
            borderColor: darkMode ? '#333' : '#EEE',
          },
        ]}
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
        placeholder="Örn: 170"
        placeholderTextColor={darkMode ? '#AAA' : '#999'}
      />

      <Text style={[styles.label, { color: darkMode ? '#FFF' : '#8B2635' }]}>
        Kilo (kg)
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: darkMode ? '#333' : '#FFF',
            color: darkMode ? '#FFF' : '#333',
            borderColor: darkMode ? '#333' : '#EEE',
          },
        ]}
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
  );

  const renderPasswordView = () => (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
      <Text style={[styles.title, { color: darkMode ? '#FFF' : '#8B2635' }]}>
        Şifre Değiştir
      </Text>

      <View
        style={[
          styles.passwordCard,
          {
            backgroundColor: darkMode ? '#1E1E1E' : '#FFF',
            borderColor: darkMode ? '#333' : '#EEE',
          },
        ]}
      >
        <TextInput
          placeholder="Mevcut Şifre"
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: darkMode ? '#333' : '#FFF5F6',
              color: darkMode ? '#FFF' : '#333',
              borderColor: darkMode ? '#333' : '#EEE',
            },
          ]}
          value={oldPasswordInput}
          onChangeText={setOldPasswordInput}
          placeholderTextColor={darkMode ? '#AAA' : '#999'}
        />

        <TextInput
          placeholder="Yeni Şifre"
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: darkMode ? '#333' : '#FFF5F6',
              color: darkMode ? '#FFF' : '#333',
              borderColor: darkMode ? '#333' : '#EEE',
            },
          ]}
          value={newPasswordInput}
          onChangeText={setNewPasswordInput}
          placeholderTextColor={darkMode ? '#AAA' : '#999'}
        />

        <TextInput
          placeholder="Yeni Şifre Tekrar"
          secureTextEntry
          style={[
            styles.input,
            {
              backgroundColor: darkMode ? '#333' : '#FFF5F6',
              color: darkMode ? '#FFF' : '#333',
              borderColor: darkMode ? '#333' : '#EEE',
            },
          ]}
          value={confirmPasswordInput}
          onChangeText={setConfirmPasswordInput}
          placeholderTextColor={darkMode ? '#AAA' : '#999'}
        />

        {passwordMessage.text ? (
          <View
            style={[
              styles.messageBox,
              {
                backgroundColor:
                  passwordMessage.type === 'success' ? '#E8F5E9' : '#FFEBEE',
              },
            ]}
          >
            <Text
              style={{
                color:
                  passwordMessage.type === 'success' ? '#2E7D32' : '#C62828',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {passwordMessage.text}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
          <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSubscriptionView = () => (
  <ScrollView contentContainerStyle={styles.scrollContent}>
    <TouchableOpacity style={styles.backButton} onPress={() => setView('main')}>
      <Feather name="chevron-left" size={20} color="#8B2635" />
      <Text style={styles.backButtonText}>Geri Dön</Text>
    </TouchableOpacity>

    <View
      style={[
        styles.subscriptionCard,
        {
          backgroundColor: darkMode ? '#1E1E1E' : '#FFF',
          borderColor: darkMode ? '#333' : '#EEE',
        },
      ]}
    >
      <View style={styles.subscriptionIcon}>
        <Crown size={34} color="#F59E0B" />
      </View>

      <Text
        style={[
          styles.subscriptionTitle,
          { color: darkMode ? '#FFF' : '#8B2635' },
        ]}
      >
        Premium Ayrıcalıkları
      </Text>

      <Text style={styles.subscriptionItem}>✓ %50 Fazla XP Bonusu</Text>
      <Text style={styles.subscriptionItem}>✓ Sınırsız Fotoğraf Arşivi</Text>
      <Text style={styles.subscriptionItem}>✓ Reklamsız Deneyim</Text>

      {isPremium ? (
        <>
          <View style={styles.activePremiumBox}>
            <Text style={styles.activePremiumText}>Premium üyeliğin aktif</Text>
          </View>

          <TouchableOpacity
            style={styles.cancelPremiumButton}
            onPress={() => {
              Alert.alert(
                'Premium İptali',
                'Premium aboneliğini iptal etmek istiyor musun?',
                [
                  {
                    text: 'Vazgeç',
                    style: 'cancel',
                  },
                  {
                    text: 'İptal Et',
                    style: 'destructive',
                    onPress: () => {
                      setIsPremium(false);
                      Alert.alert('İptal Edildi', 'Premium aboneliğin iptal edildi.');
                      setView('main');
                    },
                  },
                ]
              );
            }}
          >
            <Text style={styles.cancelPremiumButtonText}>
              Premium Aboneliği İptal Et
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handlePurchase}>
          <Text style={styles.buttonText}>Abone Ol</Text>
        </TouchableOpacity>
      )}
    </View>
  </ScrollView>
);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? '#121212' : '#FFF5F6' },
      ]}
    >
      {view === 'main' && renderMainView()}
      {view === 'user' && renderUserView()}
      {view === 'password' && renderPasswordView()}
      {view === 'subscription' && renderSubscriptionView()}

      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: darkMode ? '#1E1E1E' : '#FFF',
            borderTopColor: darkMode ? '#333' : '#f1e5e8',
          },
        ]}
      >
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <Home size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Ana Sayfa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/symptoms')}>
          <Activity size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Semptom Takibi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/treatment')}>
          <Pill size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Tedaviler</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/fototerapi')}>
          <BarChart3 size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Fototerapi Takibi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <User size={22} color="#8B2635" />
          <Text style={[styles.navText, { color: '#8B2635' }]}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 115,
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#8B2635',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    borderWidth: 4,
    borderColor: '#FFF',
  },

  avatarText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },

  premiumBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#F59E0B',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  streakBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    borderRadius: 14,
    paddingHorizontal: 7,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  streakText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },

  profileName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: 'bold',
  },

  profileEmail: {
    fontSize: 12,
    marginTop: 3,
  },

  levelCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },

  levelTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  trophyBox: {
    backgroundColor: '#8B2635',
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  levelSmallText: {
    fontSize: 10,
    fontWeight: '800',
  },

  levelText: {
    fontSize: 18,
    fontWeight: '900',
  },

  xpBox: {
    alignItems: 'flex-end',
  },

  xpLabel: {
    fontSize: 9,
    color: '#AAA',
    fontWeight: 'bold',
  },

  xpText: {
    fontSize: 18,
    fontWeight: '900',
  },

  progressBg: {
    height: 8,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 14,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#8B2635',
    borderRadius: 10,
  },

  premiumCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 22,
    elevation: 3,
  },

  premiumCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  premiumTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '900',
  },

  premiumDesc: {
    color: '#FFF',
    fontSize: 11,
    marginTop: 4,
    opacity: 0.9,
  },

  premiumButton: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 12,
    marginTop: 15,
  },

  premiumButtonText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '900',
  },

  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },

  missionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  missionTitle: {
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 7,
  },

  missionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  missionToggleText: {
    fontSize: 10,
    color: '#A05555',
    fontWeight: 'bold',
    marginRight: 4,
  },

  missionCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    marginBottom: 9,
  },

  missionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  missionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  missionName: {
    fontSize: 13,
    fontWeight: '900',
  },

  missionSubText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: 'bold',
    marginTop: 3,
  },

  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
  },

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  optionLabel: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  permissionBox: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 1,
  },

  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  permissionLabel: {
    fontWeight: 'bold',
    fontSize: 15,
  },

  logoutButton: {
    marginTop: 16,
    backgroundColor: '#FAD2D8',
    padding: 15,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    marginLeft: 10,
    color: '#8B2635',
    fontWeight: 'bold',
    fontSize: 16,
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  backButtonText: {
    color: '#8B2635',
    fontWeight: 'bold',
    fontSize: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  label: {
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 14,
  },

  pickerContainer: {
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
    borderWidth: 1,
  },

  input: {
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
  },

  passwordCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 16,
  },

  button: {
    backgroundColor: '#8B2635',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
    elevation: 3,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  messageBox: {
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  subscriptionCard: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 22,
    alignItems: 'center',
  },

  subscriptionIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  subscriptionTitle: {
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 22,
  },

  subscriptionItem: {
    color: '#8B2635',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  activePremiumBox: {
  backgroundColor: '#E8F5E9',
  padding: 14,
  borderRadius: 14,
  marginTop: 10,
  width: '100%',
  alignItems: 'center',
},

activePremiumText: {
  color: '#2E7D32',
  fontWeight: 'bold',
  fontSize: 14,
},

cancelPremiumButton: {
  backgroundColor: '#FFEBEE',
  padding: 15,
  borderRadius: 12,
  marginTop: 14,
  alignItems: 'center',
  width: '100%',
  borderWidth: 1,
  borderColor: '#FFCDD2',
},

cancelPremiumButtonText: {
  color: '#C62828',
  fontWeight: 'bold',
  fontSize: 15,
},

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navText: {
    fontSize: 10,
    marginTop: 4,
    color: '#b9a7ab',
    textAlign: 'center',
  },
});