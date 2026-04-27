import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeCustom } from '../../context/ThemeContext';
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  Brain,
  Camera,
  CheckCircle2,
  ChevronRight,
  Circle,
  Droplets,
  Flame,
  Home,
  Info,
  Pill,
  Plus,
  Sparkles,
  Sun,
  Target,
  Trash2,
  Pencil,
  Trophy,
  User,
  X,
} from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useThemeCustom(); //darkmode
  const [greeting, setGreeting] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [streak] = useState(5);

  const [showStreakModal, setShowStreakModal] = useState(false);
  const [dayGoal, setDayGoal] = useState(7);
  const [goalInput, setGoalInput] = useState('7');

  const [aiOpen, setAiOpen] = useState(false);

  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskText, setTaskText] = useState('');

  

  const [tasks, setTasks] = useState([
    { id: 1, text: 'Nemlendirici sür', completed: false },
    { id: 2, text: 'Fototerapi seansına git', completed: true },
    { id: 3, text: '2 Litre su tüket', completed: false },
    { id: 4, text: 'D vitamini takviyesi al', completed: false },
  ]);

  const moods = [
    { id: 'Harika', icon: '✨', label: 'Harika' },
    { id: 'İyi', icon: '😊', label: 'İyi' },
    { id: 'Hassas', icon: '😟', label: 'Hassas' },
    { id: 'Kaşıntılı', icon: '😖', label: 'Kaşıntılı' },
  ];

  const moodTips = {
    Harika: 'Harika! Rutinine devam et, cildin bugün dengeli görünüyor.',
    İyi: 'Bugün iyi gidiyor. Bol su içmeyi ve nemlendirmeyi unutma.',
    Hassas: 'Bugün cildini tahriş edebilecek kıyafet ve ürünlerden uzak dur.',
    Kaşıntılı: 'Kaşıntı varsa soğuk kompres ve nemlendirici iyi gelebilir.',
  };

  useEffect(() => {
    const hour = new Date().getHours();

    if (hour < 12) setGreeting('Günaydın');
    else if (hour < 18) setGreeting('İyi Günler');
    else setGreeting('İyi Akşamlar');
  }, []);

  const completedCount = tasks.filter((task) => task.completed).length;
  const progress =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const openAddTask = () => {
    setEditingTask(null);
    setTaskText('');
    setTaskModalVisible(true);
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setTaskText(task.text);
    setTaskModalVisible(true);
  };

  const saveTask = () => {
    const cleanText = taskText.trim();

    if (!cleanText) {
      Alert.alert('Hata', 'Görev adı boş bırakılamaz.');
      return;
    }

    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? { ...task, text: cleanText } : task
        )
      );
    } else {
      setTasks((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: cleanText,
          completed: false,
        },
      ]);
    }

    setTaskText('');
    setEditingTask(null);
    setTaskModalVisible(false);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const saveDayGoal = () => {
    const value = Number(goalInput);

    if (!value || value <= 0) {
      Alert.alert('Hata', 'Lütfen geçerli bir gün hedefi gir.');
      return;
    }

    setDayGoal(value);
  };

  return (
  <View style={[
    styles.container,
    { backgroundColor: isDark ? '#121212' : '#FFF5F6' }
  ]}>
      <ScrollView
  contentContainerStyle={[
    styles.scrollContent,
    { backgroundColor: isDark ? '#121212' : '#FFF5F6' }
  ]}
>
       <View style={styles.header}>
  <View>
    <Text
      style={[
        styles.greeting,
        { color: isDark ? '#AAA' : '#8B2635' },
      ]}
    >
      {greeting}, Ganime
    </Text>

    <Text
      style={[
        styles.title,
        { color: isDark ? '#FFF' : '#8B2635' },
      ]}
    >
      Cildin nasıl? ✨
    </Text>
  </View>
</View>

        <View style={[
  styles.weatherRow,
  { backgroundColor: isDark ? '#1E1E1E' : 'transparent' }
]}>
          <View style={styles.uvCard}>
            <Sun size={30} color="#fff" />
            <Text style={styles.uvLabel}>UV İndeksi</Text>
            <Text style={styles.uvTitle}>7.4 Yüksek</Text>
            <Text style={styles.uvText}>Güneş koruyucu tazele.</Text>
          </View>

          <View
  style={[
    styles.humidityCard,
    { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
  ]}
>
            <Droplets size={28} color="#60a5fa" />
            <Text style={styles.humidityTitle}>%65</Text>
            <Text style={styles.humidityText}>Nem</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.streakCard}
          activeOpacity={0.9}
          onPress={() => setShowStreakModal(true)}
        >
          <View style={styles.streakLeft}>
            <View style={styles.flameBox}>
              <Flame size={20} color="#fff" fill="#fff" />
            </View>

            <View>
              <Text style={styles.streakSmall}>SERÜVEN DEVAM EDİYOR</Text>
              <Text style={styles.streakTitle}>{streak} Gündür Takiptesin!</Text>
            </View>
          </View>

          <ChevronRight size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        <View style={styles.moodRow}>
          {moods.map((m) => {
            const isSelected = selectedMood === m.id;

            return (
              <TouchableOpacity
                key={m.id}
                style={[
  styles.moodCard,
  { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
  isSelected && styles.moodCardActive,
]}
                onPress={() => {
                  setSelectedMood(m.id);
                  setAiOpen(true);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.moodEmoji}>{m.icon}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    isSelected && styles.moodLabelActive,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {aiOpen && (
          <View
  style={[
    styles.aiCard,
    { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
  ]}
>
            <View style={styles.aiHeader}>
              <View style={styles.aiIconBox}>
                <Brain size={22} color="#fff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.aiTitle}>AI Destek</Text>
                <Text style={styles.aiSub}>
                  Backend bağlanınca öneriler API’den gelecek
                </Text>
              </View>

              <TouchableOpacity onPress={() => setAiOpen(false)}>
                <X size={18} color="#8B2635" />
              </TouchableOpacity>
            </View>

            <Text style={styles.aiText}>
              {selectedMood
                ? moodTips[selectedMood]
                : 'Bugün nasıl hissettiğini seç, sana özel öneri göstereyim.'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[
  styles.analysisCard,
  { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
]}
          activeOpacity={0.9}
          onPress={() =>
            Alert.alert(
              'Son Analiz',
              'AI analiz detayı backend bağlanınca gösterilecek.'
            )
          }
        >
          <View style={styles.analysisIconBox}>
            <Brain size={28} color="#8B2635" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.analysisLabel}>Son Fotoğraf Analizi</Text>
            <Text style={styles.analysisTitle}>Hafif Egzama ✨</Text>
          </View>

          <ChevronRight size={22} color="#8B2635" />
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Günlük Görevler</Text>
            <Text style={styles.sectionSub}>
              {completedCount} / {tasks.length} görev tamamlandı • %{progress}
            </Text>
          </View>

          <TouchableOpacity style={styles.addTaskButton} onPress={openAddTask}>
            <Plus size={16} color="#fff" />
            <Text style={styles.addTaskText}>Ekle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarBg}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={[
  styles.taskCard,
  { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }
]}>
          {tasks.length === 0 ? (
            <Text style={styles.emptyText}>Henüz görev eklenmedi.</Text>
          ) : (
            tasks.map((task) => (
              <View key={task.id} style={styles.taskRow}>
                <TouchableOpacity
                  onPress={() => toggleTask(task.id)}
                  activeOpacity={0.8}
                  style={styles.taskLeft}
                >
                  {task.completed ? (
                    <CheckCircle2 size={22} color="#8B2635" />
                  ) : (
                    <Circle size={22} color="#b9a7ab" />
                  )}

                  <Text
                    style={[
                     styles.taskText,
{ color: isDark ? '#FFF' : '#444' },
task.completed && styles.taskTextCompleted,
                    ]}
                  >
                    {task.text}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smallIconButton}
                  onPress={() => openEditTask(task)}
                >
                  <Pencil size={16} color="#8B2635" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.smallIconButton}
                  onPress={() => deleteTask(task.id)}
                >
                  <Trash2 size={16} color="#c05674" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View
  style={[
    styles.infoCard,
    { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
  ]}
>
          <View style={styles.infoIconBox}>
            <Info size={18} color="#8B2635" />
          </View>

          <View style={styles.infoTextBox}>
            <Text style={styles.infoTitle}>Biliyor muydun?</Text>
            <Text style={styles.infoText}>
              Omega-3 takviyesi cilt bariyerini güçlendirebilir. Bugün
              beslenmene ceviz ekleyebilirsin.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal transparent visible={showStreakModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.streakModalCard}>
            <View style={styles.streakModalHeader}>
              <View style={styles.streakModalTitleRow}>
                <Trophy size={24} color="#8B2635" />
                <Text style={styles.streakModalTitle}>Senin Serüvenin</Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowStreakModal(false)}
              >
                <X size={18} color="#8B2635" />
              </TouchableOpacity>
            </View>

            <View style={styles.circleProgressBox}>
              <View style={styles.circleOuter}>
                <View style={styles.circleInner}>
                  <Text style={styles.circleNumber}>
                    {streak}/{dayGoal}
                  </Text>
                  <Text style={styles.circleLabel}>GÜN HEDEFİ</Text>
                </View>
              </View>
            </View>

            <View style={styles.goalEditBox}>
              <Text style={styles.goalEditLabel}>Gün hedefi belirle</Text>

              <View style={styles.goalInputRow}>
                <TextInput
                  style={styles.goalInput}
                  value={goalInput}
                  onChangeText={(text) =>
                    setGoalInput(text.replace(/[^0-9]/g, ''))
                  }
                  keyboardType="numeric"
                  placeholder="7"
                  placeholderTextColor="#b9a7ab"
                />

                <TouchableOpacity
                  style={styles.goalSaveButton}
                  onPress={saveDayGoal}
                >
                  <Text style={styles.goalSaveText}>Kaydet</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.streakStatsGrid}>
              <View style={styles.streakStatBox}>
                <Camera size={20} color="#8B2635" />
                <Text style={styles.streakStatLabel}>Analiz</Text>
                <Text style={styles.streakStatValue}>3 Kez</Text>
              </View>

              <View style={styles.streakStatBox}>
                <Pill size={20} color="#8B2635" />
                <Text style={styles.streakStatLabel}>İlaç Takibi</Text>
                <Text style={styles.streakStatValue}>%100</Text>
              </View>
            </View>

            <View style={styles.badgeBox}>
              <View style={styles.badgeIconBox}>
                <Award size={24} color="#fff" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.badgeTitle}>YENİ ROZET KAZANDIN!</Text>
                <Text style={styles.badgeText}>
                  İstikrarlı Takipçi • 5. Seviye
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalMainButton}
              onPress={() => setShowStreakModal(false)}
            >
              <Text style={styles.modalMainButtonText}>
                Harika, Devam Et!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={taskModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.taskModalCard}>
            <Text style={styles.modalTitle}>
              {editingTask ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
            </Text>

            <TextInput
              style={styles.modalInput}
              value={taskText}
              onChangeText={setTaskText}
              placeholderTextColor="#b9a7ab"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setTaskModalVisible(false);
                  setEditingTask(null);
                  setTaskText('');
                }}
              >
                <Text style={styles.cancelButtonText}>Vazgeç</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View
  style={[
    styles.bottomNav,
    {
      backgroundColor: isDark ? '#1E1E1E' : '#FFF',
      borderTopColor: isDark ? '#333' : '#f1e5e8',
    },
  ]}
>
        <Pressable style={styles.navItem} onPress={() => router.push('/home')}>
          <Home size={22} color="#8B2635" />
          <Text style={[styles.navText, { color: '#8B2635' }]}>Ana Sayfa</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push('/symptoms')}
        >
          <Activity size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Semptom Takibi</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push('/treatment')}
        >
          <Pill size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Tedaviler</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push('/fototerapi')}
        >
          <BarChart3 size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Fototerapi Takibi</Text>
        </Pressable>

        <Pressable
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <User size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Profil</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F6',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 120,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  greeting: {
    color: '#8B2635',
    fontSize: 12,
    marginBottom: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B2635',
  },

  iconButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 999,
    elevation: 2,
  },

  weatherRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  uvCard: {
    flex: 1,
    backgroundColor: '#f97316',
    borderRadius: 26,
    padding: 18,
    marginRight: 12,
  },

  uvLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 10,
  },

  uvTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },

  uvText: {
    color: '#fff',
    fontSize: 11,
    marginTop: 8,
  },

  humidityCard: {
    width: 105,
    backgroundColor: '#fff',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#fdecef',
  },

  humidityTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#8B2635',
    marginTop: 8,
  },

  humidityText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '700',
  },

  streakCard: {
    backgroundColor: '#8B2635',
    borderRadius: 26,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },

  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  flameBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 14,
    marginRight: 12,
  },

  streakSmall: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    marginBottom: 4,
  },

  streakTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  moodCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginHorizontal: 4,
  },

  moodCardActive: {
    backgroundColor: '#8B2635',
  },

  moodEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },

  moodLabel: {
    fontSize: 10,
    color: '#b9a7ab',
  },

  moodLabelActive: {
    color: '#fff',
  },

  aiCard: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fdecef',
  },

  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  aiIconBox: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: '#8B2635',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  aiTitle: {
    color: '#8B2635',
    fontSize: 15,
    fontWeight: '800',
  },

  aiSub: {
    color: '#aaa',
    fontSize: 10,
    marginTop: 2,
  },

  aiText: {
    color: '#666',
    fontSize: 13,
    lineHeight: 19,
    backgroundColor: '#FFF5F6',
    padding: 12,
    borderRadius: 16,
  },

  analysisCard: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#d9aeb8',
  },

  analysisIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#FFF5F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  analysisLabel: {
    fontSize: 10,
    color: '#aaa',
    fontWeight: '800',
  },

  analysisTitle: {
    fontSize: 16,
    color: '#8B2635',
    fontWeight: '800',
    marginTop: 3,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f1f1f',
  },

  sectionSub: {
    color: '#999',
    fontSize: 11,
    marginTop: 3,
  },

  addTaskButton: {
    backgroundColor: '#8B2635',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  addTaskText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 5,
  },

  progressBarBg: {
    height: 8,
    backgroundColor: '#ead7dc',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#8B2635',
    borderRadius: 10,
  },

  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#fdecef',
  },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
  },

  taskLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  taskText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#444',
    flex: 1,
  },

  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#b9a7ab',
    fontStyle: 'italic',
  },

  smallIconButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#FFF5F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  emptyText: {
    color: '#999',
    fontSize: 13,
    padding: 12,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 26,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B2635',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  infoIconBox: {
    backgroundColor: '#FFF5F6',
    padding: 10,
    borderRadius: 14,
    marginRight: 12,
  },

  infoTextBox: {
    flex: 1,
  },

  infoTitle: {
    color: '#8B2635',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  infoText: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  streakModalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 34,
    padding: 26,
  },

  streakModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
  },

  streakModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  streakModalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#8B2635',
    marginLeft: 10,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f7f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleProgressBox: {
    alignItems: 'center',
    marginBottom: 20,
  },

  circleOuter: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 7,
    borderColor: '#9B2738',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  circleInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#9B2738',
  },

  circleLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#b6adb0',
    marginTop: -2,
  },

  goalEditBox: {
    backgroundColor: '#FFF5F6',
    borderRadius: 22,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#f7dce6',
  },

  goalEditLabel: {
    fontSize: 11,
    color: '#8B2635',
    fontWeight: '900',
    marginBottom: 8,
  },

  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  goalInput: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    color: '#333',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ead7dc',
    marginRight: 10,
  },

  goalSaveButton: {
    backgroundColor: '#8B2635',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  goalSaveText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },

  streakStatsGrid: {
    flexDirection: 'row',
    marginBottom: 24,
  },

  streakStatBox: {
    flex: 1,
    height: 104,
    backgroundColor: '#FFF2F7',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f7dce6',
    marginHorizontal: 6,
  },

  streakStatLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#aeb0ba',
    marginTop: 10,
    textTransform: 'uppercase',
  },

  streakStatValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#8B2635',
    marginTop: 6,
  },

  badgeBox: {
    backgroundColor: '#AD3A4E',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },

  badgeIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  badgeTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.9,
    marginTop: 2,
  },

  modalMainButton: {
    backgroundColor: '#9B2738',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#9B2738',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  modalMainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },

  taskModalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#8B2635',
    marginBottom: 14,
  },

  modalInput: {
    backgroundColor: '#FFF5F6',
    borderRadius: 16,
    height: 50,
    paddingHorizontal: 14,
    color: '#333',
    fontSize: 14,
    marginBottom: 16,
  },

  modalButtons: {
    flexDirection: 'row',
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#f3e7ea',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 6,
  },

  cancelButtonText: {
    color: '#8B2635',
    fontWeight: '700',
  },

  saveButton: {
    flex: 1,
    backgroundColor: '#8B2635',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    marginLeft: 6,
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1e5e8',
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