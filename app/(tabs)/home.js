import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';

export default function HomeScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#FFF5F6' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: darkMode ? '#FFF' : '#8B2635' }]}>Ana Sayfa</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          thumbColor={darkMode ? '#8B2635' : '#f4f3f4'}
          trackColor={{ false: '#ccc', true: '#FAD2D8' }}
        />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={[styles.card, { backgroundColor: darkMode ? '#1E1E1E' : '#FFF' }]}>
          <Text style={{ color: darkMode ? '#FFF' : '#333', fontWeight: 'bold' }}>Hoşgeldiniz Ganime!</Text>
          <Text style={{ color: darkMode ? '#AAA' : '#555', marginTop: 4 }}>Bugün hava çok güzel ☀️</Text>
        </View>
        <View style={[styles.card, { backgroundColor: darkMode ? '#1E1E1E' : '#FFF' }]}>
          <Text style={{ color: darkMode ? '#FFF' : '#333', fontWeight: 'bold' }}>Bildirimler</Text>
          <Text style={{ color: darkMode ? '#AAA' : '#555', marginTop: 4 }}>3 yeni mesajınız var</Text>
        </View>
        <View style={[styles.card, { backgroundColor: darkMode ? '#1E1E1E' : '#FFF' }]}>
          <Text style={{ color: darkMode ? '#FFF' : '#333', fontWeight: 'bold' }}>Raporlar</Text>
          <Text style={{ color: darkMode ? '#AAA' : '#555', marginTop: 4 }}>Yeni analiz raporları hazır</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 'bold' },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
}); 