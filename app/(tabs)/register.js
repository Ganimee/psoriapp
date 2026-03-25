import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Kayit() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    isim: '',
    soyisim: '',
    cinsiyet: '',
    dogumTarihi: new Date(),
    email: '',
    sifre: '',
    termsAccepted: false, // Onay kutusu
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleKaydol = () => {
    if (!formData.termsAccepted) {
      Alert.alert('Hata', 'Kayıt olmak için kullanım koşullarını kabul etmelisiniz.');
      return;
    }

    // Burada kayıt işlemi yapılabilir (backend vs.)
    Alert.alert('Başarılı', 'Kayıt işlemi tamamlandı!', [
      {
        text: 'Tamam',
        onPress: () => router.push('/login'), // ✅ Kayıt sonrası giriş sayfasına yönlendir
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Kaydol</Text>
        <Text style={styles.subtitle}>PsoriApp Dünyasına Katıl</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>

        <TextInput
          placeholder="İsim"
          style={styles.input}
          value={formData.isim}
          onChangeText={(text) => setFormData({...formData, isim: text})}
        />

        <TextInput
          placeholder="Soyisim"
          style={styles.input}
          value={formData.soyisim}
          onChangeText={(text) => setFormData({...formData, soyisim: text})}
        />

        {/* Cinsiyet ve Doğum Tarihi */}
        <View style={styles.row}>
          {/* Cinsiyet Picker */}
          <View style={[styles.input, {flex:1, justifyContent:'center', padding:0}]}>
            <Picker
              selectedValue={formData.cinsiyet}
              onValueChange={(itemValue) => setFormData({...formData, cinsiyet: itemValue})}
              style={{width: '100%', color: '#8B2635'}}
              itemStyle={{textAlign:'center', height:50}}
            >
              <Picker.Item label="Cinsiyet" value="" />
              <Picker.Item label="Kadın" value="kadın" />
              <Picker.Item label="Erkek" value="erkek" />
            </Picker>
          </View>

          {/* Doğum Tarihi */}
          <TouchableOpacity
            style={[styles.input, {flex:1, justifyContent:'center'}]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{color:'#8B2635', textAlign:'center'}}>
              {formData.dogumTarihi.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={formData.dogumTarihi}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setFormData({...formData, dogumTarihi: selectedDate});
            }}
          />
        )}

        <TextInput
          placeholder="E-mail"
          style={styles.input}
          onChangeText={(text) => setFormData({...formData, email: text})}
        />

        <TextInput
          placeholder="Şifre"
          secureTextEntry
          style={styles.input}
          onChangeText={(text) => setFormData({...formData, sifre: text})}
        />

        <View style={styles.termsContainer}>
          {/* Switch */}
          <Switch
            value={formData.termsAccepted}
            onValueChange={(value) => setFormData({...formData, termsAccepted: value})}
            trackColor={{ false: "#ccc", true: "#8B2635" }}
            thumbColor="white"
          />

          {/* Yazı Alanı */}
          <View style={styles.textWrapper}>
            <Text style={styles.termsText}>
              Kayıt olarak{' '}
              <Text style={styles.linkText} onPress={() => router.push('/terms')}>
                Kullanım Koşulları
              </Text>{' '}
              ve{' '}
              <Text style={styles.linkText} onPress={() => router.push('/privacy')}>
                Gizlilik Politikası
              </Text>{' '}
              kabul etmiş olursunuz.
            </Text>
          </View>
        </View>

        {/* Kaydol Butonu */}
        <TouchableOpacity style={styles.button} onPress={handleKaydol}>
          <Text style={styles.buttonText}>KAYDOL</Text>
        </TouchableOpacity>

        {/* Girişe yönlendirme */}
        <Text style={styles.signupText}>
          Zaten hesabın var mı?{' '}
          <Text style={styles.signupLink} onPress={() => router.push('/login')}>
            Giriş Yap
          </Text>
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#FFF5F6' },
  header: {
    backgroundColor:'#8B2635',
    padding:40,
    alignItems:'center',
    borderBottomLeftRadius:100,
    borderBottomRightRadius:100
  },
  title: { color:'white', fontSize:28, fontWeight:'bold' },
  subtitle: { color:'#FAD2D8', marginTop:5 },
  form: { padding:20, marginTop: 40 },
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
  row: { flexDirection:'row', gap:10 },
  button: {
    backgroundColor:'#8B2635',
    padding:15,
    borderRadius:15,
    alignItems:'center',
    marginTop:10
  },
  buttonText: { color:'white', fontWeight:'bold' },
  signupText: {
    textAlign:'center',
    marginTop:20,
    color:'#8B2635',
    fontSize:12
  },
  signupLink: {
    fontWeight:'bold',
    color:'#8B2635',
    textDecorationLine:'underline'
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  textWrapper: {
    flex: 1,        
    marginLeft: 8,
  },
  termsText: {
    color: '#8B2635',
    fontSize: 12,
    lineHeight: 18,
  },
  linkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#8B2635',
  },
});