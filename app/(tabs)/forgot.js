import { useRouter } from 'expo-router'; // 🔥 yönlendirme için
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ForgotPassword() {
  const router = useRouter(); // 🔥 router
  const [step, setStep] = useState(1); // 1: e-mail, 2: kod, 3: yeni şifre
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Kod simülasyonu
  const generatedCode = '1234'; 

  // 1️⃣ Kod gönder
  const handleSendCode = () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-mail girin');
      return;
    }
    Alert.alert('Kod Gönderildi', `E-mailinize bir kod gönderildi: ${generatedCode}`);
    setStep(2);
  };

  // 2️⃣ Kod doğrulama
  const handleVerifyCode = () => {
    if (code === generatedCode) {
      setStep(3);
    } else {
      Alert.alert('Hata', 'Kod yanlış!');
    }
  };

  // 3️⃣ Şifre değiştir
  const handleChangePassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen yeni şifreleri girin');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    // 🔥 Başarılı alert + Login yönlendirme
    Alert.alert(
      'Başarılı',
      'Şifreniz başarıyla değiştirildi',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/'), // Login ekranına yönlendir
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {step === 1 ? 'Şifremi Unuttum' : step === 2 ? 'Kod Doğrulama' : 'Şifre Değiştir'}
        </Text>
      </View>

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
            <Text style={styles.infoText}>E-mailinize gelen kodu girin</Text>
            <TextInput
              placeholder="Kod"
              style={styles.input}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#FFF5F6'
  },
  header: {
    backgroundColor:'#8B2635',
    paddingVertical:50,
    alignItems:'center',
    borderBottomLeftRadius:50,
    borderBottomRightRadius:50
  },
  title: {
    color:'white',
    fontSize:28,
    fontWeight:'bold'
  },
  form: {
    padding:20,
    marginTop:30,
    flex:1
  },
  input: {
    backgroundColor:'white',
    borderColor:'#8B2635',
    borderWidth:1.5,
    borderRadius:25,
    padding:12,
    marginBottom:15,
    textAlign:'center',
    color:'#8B2635'
  },
  button: {
    backgroundColor:'#8B2635',
    padding:15,
    borderRadius:25,
    alignItems:'center',
    marginTop:10
  },
  buttonText: {
    color:'white',
    fontWeight:'bold'
  },
  infoText: {
    textAlign:'center',
    marginBottom:10,
    color:'#8B2635'
  }
});