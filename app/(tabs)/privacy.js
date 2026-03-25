import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Privacy() {
  const router = useRouter();

  return (
    <View style={{flex:1}}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Gizlilik Politikası</Text>

        <Text style={styles.content}>
          1. Kullanıcı verileri sadece uygulama içinde kullanılır.{"\n\n"}
          2. Üçüncü kişilerle paylaşılmaz.{"\n\n"}
          3. Kullanıcı istediğinde verilerini silebilir.{"\n\n"}
          4. Bu uygulama eğitim amaçlıdır.
        </Text>
      </ScrollView>

      {/* TAMAM BUTONU */}
      <TouchableOpacity 
        style={styles.button}
       onPress={() => router.replace('/register')}
      >
        <Text style={styles.buttonText}>Tamam</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    padding:20,
    backgroundColor:'#FFF5F6'
  },
  title: {
    fontSize:24,
    fontWeight:'bold',
    color:'#8B2635',
    marginBottom:20,
    textAlign:'center'
  },
  content: {
    fontSize:14,
    color:'#8B2635',
    lineHeight:22
  },
  button: {
    backgroundColor:'#8B2635',
    padding:15,
    margin:20,
    borderRadius:15,
    alignItems:'center'
  },
  buttonText: {
    color:'white',
    fontWeight:'bold'
  }
});