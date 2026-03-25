import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hoşgeldiniz! PsoriApp Ana Sayfa</Text>
      {/* Burada home sayfası içeriklerini geliştirebilirsin */}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F6' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#8B2635', textAlign: 'center' },
});