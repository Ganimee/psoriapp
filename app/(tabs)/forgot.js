import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

const GENERATED_CODE = '1234'; // Kod simülasyonu

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Kod gönder
  const handleSendCode = () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-mail girin');
      return;
    }
    Alert.alert('Kod Gönderildi', `Kod: ${GENERATED_CODE}`);
    setStep(2);
  };

  // Kod doğrulama
  const handleVerifyCode = () => {
    if (code === GENERATED_CODE) {
      setStep(3);
    } else {
      Alert.alert('Hata', 'Kod yanlış!');
    }
  };

  // Şifre değiştir
  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen yeni şifreleri girin');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    Alert.alert('Başarılı', 'Şifreniz değiştirildi', [
      { text: 'OK', onPress: () => router.replace('/') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
       <View style={styles.header}>
            <View style={styles.logoOuter}>
              <Image
                source={require('../../assets/images/logo.jpeg')}
                style={styles.logoInner}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>PSORIAPP</Text>
          </View>

        {/* Step Başlığı */}
        <Text style={styles.stepTitle}>
          {step === 1
            ? 'Şifremi Unuttum'
            : step === 2
            ? 'Kod Doğrulama'
            : 'Şifre Değiştir'}
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {step === 1 && (
            <>
              <TextInput
                placeholder="E-mail"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.button} onPress={handleSendCode}>
                <Text style={styles.buttonText}>KOD GÖNDER</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.infoText}>Kodu girin</Text>
              <TextInput
                placeholder="Kod"
                style={styles.input}
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
                <Text style={styles.buttonText}>DOĞRULA</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <TextInput
                placeholder="Yeni Şifre"
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                placeholder="Yeni Şifre Tekrar"
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>ŞİFRE DEĞİŞTİR</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F6'
  },

  header: {
    height: 250,
    backgroundColor: '#8B2635',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },


  content: {
    paddingBottom: 40,
    justifyContent: 'center'
  },
  
title: { color: 'white', fontSize: 32, fontWeight: 'bold', letterSpacing: 2 },
  

logoOuter: { 
  width: 96,
  height: 96,
  borderRadius: 48,      // tam daire
  overflow: 'hidden',     // bu çok önemli!
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 12,
  backgroundColor: 'white', // istersen arka plan
},

logoInner: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',    // contain yerine cover
},

  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B2635',
    textAlign: 'center',
    marginTop: 10
  },

  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B2635',
    textAlign: 'center',
    marginVertical: 20
  },

  form: {
    padding: 20,
    marginTop: 10
  },

  input: {
    backgroundColor: 'white',
    borderColor: '#8B2635',
    borderWidth: 1.5,
    borderRadius: 25,
    padding: 12,
    marginBottom: 15,
    textAlign: 'center',
    color: '#8B2635'
  },

  button: {
    backgroundColor: '#8B2635',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },

  infoText: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#8B2635'
  }
});