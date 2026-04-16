import { useMemo, useState } from 'react';
import {
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';


import DateTimePicker from '@react-native-community/datetimepicker';
import { CalendarDays, Plus, Trash2, X } from 'lucide-react-native';


export default function App() {

  const [activeTab, setActiveTab] = useState('current');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // 🆕 EDIT STATE
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [treatments, setTreatments] = useState([
    {
      id: 1,
      name: 'Kortizonlu Merhem',
      type: 'Krem',
      frequency: 'Günde 2 kez',
      startDate: '2024-03-01',
      endDate: '2026-05-15'
    }
  ]);

  const [form, setForm] = useState({
    name: '',
    type: '',
    frequency: '',
    startDate: '',
    endDate: ''
  });

  const today = new Date().toISOString().split('T')[0];

  const { currentList, pastList } = useMemo(() => {
    return {
      currentList: treatments.filter(t => t.endDate >= today),
      pastList: treatments.filter(t => t.endDate < today)
    };
  }, [treatments]);

  const list = activeTab === 'current' ? currentList : pastList;

  // ✔ ADD + UPDATE
  const addTreatment = () => {

    if (!form.name || !form.startDate || !form.endDate) return;

    if (isEditMode) {
      // UPDATE
      setTreatments(prev =>
        prev.map(t =>
          t.id === selectedTreatment.id ? { ...t, ...form } : t
        )
      );
    } else {
      // CREATE
      setTreatments(prev => [
        ...prev,
        { id: Date.now(), ...form }
      ]);
    }

    // RESET
    setForm({
      name: '',
      type: '',
      frequency: '',
      startDate: '',
      endDate: ''
    });

    setIsEditMode(false);
    setSelectedTreatment(null);
    setIsModalOpen(false);
  };

  const deleteTreatment = (id) => {
    setTreatments(prev => prev.filter(t => t.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Tedavilerim</Text>
      </View>

      {/* TAB */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
          onPress={() => setActiveTab('current')}
        >
          <Text style={styles.tabText}>Güncel</Text>
        </Pressable>

        <Pressable
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={styles.tabText}>Geçmiş</Text>
        </Pressable>
      </View>

      {/* LIST */}
      <ScrollView>
        {list.map(item => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => {
              if (activeTab === 'current') {
                setSelectedTreatment(item);
                setForm(item);
                setIsEditMode(true);
                setIsModalOpen(true);
              }
            }}
          >

            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.sub}>{item.type} • {item.frequency}</Text>
            <Text style={styles.sub}>{item.startDate} → {item.endDate}</Text>

            {activeTab === 'current' && (
              <Pressable onPress={() => deleteTreatment(item.id)}>
                <Trash2 color="red" />
              </Pressable>
            )}

          </Pressable>
        ))}
      </ScrollView>

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => {
          setIsEditMode(false);
          setForm({
            name: '',
            type: '',
            frequency: '',
            startDate: '',
            endDate: ''
          });
          setIsModalOpen(true);
        }}
      >
        <Plus color="white" />
      </Pressable>

      {/* MODAL */}
      <Modal visible={isModalOpen} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>

            {/* HEADER */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                {isEditMode ? "Tedaviyi Düzenle" : "Yeni Tedavi Ekle"}
              </Text>

              <Pressable onPress={() => {
                setIsModalOpen(false);
                setIsEditMode(false);
                setSelectedTreatment(null);
              }}>
                <X />
              </Pressable>
            </View>

            {/* NAME */}
            <TextInput
              placeholder="Tedavi adı"
              style={styles.input}
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />

            {/* TYPE */}
            <TextInput
              placeholder="Tür (Krem / İlaç / Fototerapi)"
              style={styles.input}
              value={form.type}
              onChangeText={(t) => setForm({ ...form, type: t })}
            />

            {/* FREQUENCY */}
            <TextInput
              placeholder="Sıklık"
              style={styles.input}
              value={form.frequency}
              onChangeText={(t) => setForm({ ...form, frequency: t })}
            />

            {/* DATES */}
            <View style={styles.row}>

              <Pressable
                style={styles.dateBox}
                onPress={() => setShowStartPicker(true)}
              >
                <CalendarDays size={18} />
                <Text style={{ marginLeft: 8 }}>
                  {form.startDate || "Başlangıç"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.dateBox}
                onPress={() => setShowEndPicker(true)}
              >
                <CalendarDays size={18} />
                <Text style={{ marginLeft: 8 }}>
                  {form.endDate || "Bitiş"}
                </Text>
              </Pressable>

            </View>

            {/* PICKERS */}
            {showStartPicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                onChange={(e, date) => {
                  setShowStartPicker(false);
                  if (date) {
                    setForm({
                      ...form,
                      startDate: date.toISOString().split('T')[0]
                    });
                  }
                }}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                onChange={(e, date) => {
                  setShowEndPicker(false);
                  if (date) {
                    setForm({
                      ...form,
                      endDate: date.toISOString().split('T')[0]
                    });
                  }
                }}
              />
            )}

            {/* SAVE */}
            <Pressable style={styles.saveBtn} onPress={addTreatment}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Kaydet
              </Text>
            </Pressable>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

/* STYLE */
const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: '#f6e9eb' },

  header: { padding: 28 },

  title: { fontSize: 22, fontWeight: 'bold', color: '#8B2635' },

  tabs: { flexDirection: 'row', padding: 10 },

  tab: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: '#f0b1bb',
    borderRadius: 10,
    alignItems: 'center'
  },

  activeTab: { backgroundColor: '#8B2635' },

  tabText: { color: 'white' },

  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 15
  },

  name: { fontSize: 16, fontWeight: 'bold' },

  sub: { fontSize: 12, color: '#54151f' },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#8B2635',
    padding: 15,
    borderRadius: 50
  },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(14, 11, 11, 0.4)'
  },

  sheet: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B2635'
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5
  },

  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10
  },

  dateBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10
  },

  saveBtn: {
    backgroundColor: '#8B2635',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15
  }
});