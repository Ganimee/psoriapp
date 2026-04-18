import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import {
  Activity,
  BarChart3,
  Calendar,
  History,
  Home,
  LayoutDashboard,
  Pill,
  Plus,
  User,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FototerapiScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('dashboard');

  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'Fototerapi Planı',
      startDate: '2026-04-18',
      sessionCount: 10,
     
      isActive: true,
    },
  ]);

  const [sessions, setSessions] = useState([
    {
      id: 1,
      planId: 1,
      sessionNo: 1,
      scheduledDate: '2026-04-18',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
    {
      id: 2,
      planId: 1,
      sessionNo: 2,
      scheduledDate: '2026-04-20',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
    {
      id: 3,
      planId: 1,
      sessionNo: 3,
      scheduledDate: '2026-04-22',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
    {
      id: 4,
      planId: 1,
      sessionNo: 4,
      scheduledDate: '2026-04-24',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
    {
      id: 5,
      planId: 1,
      sessionNo: 5,
      scheduledDate: '2026-04-26',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
    {
      id: 6,
      planId: 1,
      sessionNo: 6,
      scheduledDate: '2026-04-28',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
    {
      id: 7,
      planId: 1,
      sessionNo: 7,
      scheduledDate: '2026-04-30',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
    {
      id: 8,
      planId: 1,
      sessionNo: 8,
      scheduledDate: '2026-05-02',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
    {
      id: 9,
      planId: 1,
      sessionNo: 9,
      scheduledDate: '2026-05-04',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
    {
      id: 10,
      planId: 1,
      sessionNo: 10,
      scheduledDate: '2026-05-06',
      completedAt: null,
      duration: '',
      isCompleted: false,
    },
  ]);

  const [newPlanForm, setNewPlanForm] = useState({
    name: 'Fototerapi Planı',
    startDate: '2026-04-18',
    sessionCount: 10,
  });

  const [historyFilter, setHistoryFilter] = useState({
    startDate: '',
    endDate: '',
  });

  const [pickerState, setPickerState] = useState({
    visible: false,
    field: null, // 'startDate' | 'endDate'
    value: new Date(),
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const parseDateString = (dateString) => {
    if (!dateString) return new Date();
    const parsed = new Date(dateString);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const openDatePicker = (field) => {
    const currentValue =
      field === 'startDate' ? historyFilter.startDate : historyFilter.endDate;

    setPickerState({
      visible: true,
      field,
      value: parseDateString(currentValue),
    });
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS !== 'ios') {
      setPickerState((prev) => ({ ...prev, visible: false }));
    }

    if (!selectedDate || !pickerState.field) return;

    const formatted = formatDate(selectedDate);

    setHistoryFilter((prev) => ({
      ...prev,
      [pickerState.field]: formatted,
    }));
  };

  const activePlan = useMemo(() => {
    return plans.find((plan) => plan.isActive);
  }, [plans]);

  const activePlanSessions = useMemo(() => {
    if (!activePlan) return [];
    return sessions
      .filter((session) => session.planId === activePlan.id)
      .sort((a, b) => a.sessionNo - b.sessionNo);
  }, [sessions, activePlan]);

  const stats = useMemo(() => {
    const total = activePlan ? activePlan.sessionCount : 0;
    const completed = activePlanSessions.filter((s) => s.isCompleted).length;
    const pending = total - completed;
    const adherence =
      total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;

    return {
      total,
      completed,
      pending,
      adherence,
      progress: adherence,
    };
  }, [activePlan, activePlanSessions]);

  const historySessions = useMemo(() => {
    const completedSessions = sessions
      .filter((session) => session.isCompleted && session.completedAt)
      .sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

    return completedSessions.filter((session) => {
      const completedDate = session.completedAt;

      if (historyFilter.startDate && completedDate < historyFilter.startDate) {
        return false;
      }

      if (historyFilter.endDate && completedDate > historyFilter.endDate) {
        return false;
      }

      return true;
    });
  }, [sessions, historyFilter]);

  const todayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const completeSession = (sessionId) => {
    const target = sessions.find((s) => s.id === sessionId);

    if (!target) return;

    if (target.isCompleted) {
      Alert.alert('Bilgi', 'Bu seans zaten tamamlanmış.');
      return;
    }

    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              isCompleted: true,
              completedAt: todayString(),
            }
          : session
      )
    );
  };

  const undoSession = (sessionId) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              isCompleted: false,
              completedAt: null,
              duration: '',
            }
          : session
      )
    );
  };

  const updateSessionDuration = (sessionId, value) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              duration: value.replace(/[^0-9]/g, ''),
            }
          : session
      )
    );
  };

  const createPlan = () => {
    const name = newPlanForm.name.trim();
    const startDate = newPlanForm.startDate;
    const sessionCount = Number(newPlanForm.sessionCount);

    if (!name || !startDate || sessionCount <= 0) {
      Alert.alert('Hata', 'Lütfen tüm alanları doğru doldurun.');
      return;
    }

    const newPlanId = Date.now();

    const newPlan = {
      id: newPlanId,
      name,
      startDate,
      sessionCount,
     
      isActive: true,
    };

    const generatedSessions = [];

    for (let i = 0; i < sessionCount; i++) {
      const sessionDate = new Date(startDate);
      sessionDate.setDate(sessionDate.getDate() + i * 2);

      generatedSessions.push({
        id: newPlanId + i,
        planId: newPlanId,
        sessionNo: i + 1,
        scheduledDate: sessionDate.toISOString().split('T')[0],
        completedAt: null,
        duration: '',
        isCompleted: false,
      });
    }

    setPlans((prev) =>
      prev.map((plan) => ({ ...plan, isActive: false })).concat(newPlan)
    );

    setSessions((prev) => prev.concat(generatedSessions));

    Alert.alert('Başarılı', 'Yeni tedavi planı oluşturuldu.');
    setActiveTab('dashboard');
  };

  const renderDashboard = () => (
    <View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Aktif Tedavi</Text>
        <Text style={styles.mainTitle}>
          {activePlan ? activePlan.name : 'Aktif plan yok'}
        </Text>

        <Text style={styles.infoText}>
          Başlangıç: {activePlan ? activePlan.startDate : '-'}
        </Text>
        <Text style={styles.infoText}>Seans Sayısı: {stats.total}</Text>
        <Text style={styles.infoText}>Tamamlanan: {stats.completed}</Text>
        <Text style={styles.infoText}>Kalan: {stats.pending}</Text>
        <Text style={styles.infoText}>
   
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.cardTitle}>Katılım</Text>
            <Text style={styles.percentBadge}>%{stats.adherence}</Text>
          </View>

          <Text style={styles.progressText}>
            {stats.completed} / {stats.total} seans tamamlandı
          </Text>

          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBar, { width: `${stats.progress}%` }]}
            />
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Seanslar</Text>

        {activePlanSessions.length === 0 ? (
          <Text style={styles.emptyText}>Aktif tedaviye ait seans yok.</Text>
        ) : (
          activePlanSessions.map((session) => (
            <View key={session.id} style={styles.sessionRow}>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTitle}>{session.sessionNo}. Seans</Text>
                <Text style={styles.sessionSub}>
                  Planlanan Tarih: {session.scheduledDate}
                </Text>

                {session.isCompleted ? (
                  <>
                    <Text style={styles.completedDateText}>
                      Tamamlanma Tarihi: {session.completedAt}
                    </Text>

                    <Text style={styles.durationLabel}>Seans Süresi (sn)</Text>
                    <TextInput
                      style={styles.durationInput}
                      value={String(session.duration)}
                      onChangeText={(text) =>
                        updateSessionDuration(session.id, text)
                      }
                      keyboardType="numeric"
                      placeholder="Örn: 45"
                      placeholderTextColor="#b9a7ab"
                    />
                  </>
                ) : (
                  <Text style={styles.pendingText}>Durum: Bekliyor</Text>
                )}
              </View>

              {!session.isCompleted ? (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => completeSession(session.id)}
                >
                  <Text style={styles.completeButtonText}>Seans Tamamlandı</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.undoButton}
                  onPress={() => undoSession(session.id)}
                >
                  <Text style={styles.undoButtonText}>Geri Al</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );

  const renderHistory = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Geçmiş Seanslar</Text>

      <Text style={styles.filterLabel}>Başlangıç Tarihi</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => openDatePicker('startDate')}
      >
        <Calendar size={18} color="#8B2635" />
        <Text
          style={[
            styles.datePickerText,
            !historyFilter.startDate && styles.datePickerPlaceholder,
          ]}
        >
          {historyFilter.startDate || 'Tarih seç'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.filterLabel}>Bitiş Tarihi</Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => openDatePicker('endDate')}
      >
        <Calendar size={18} color="#8B2635" />
        <Text
          style={[
            styles.datePickerText,
            !historyFilter.endDate && styles.datePickerPlaceholder,
          ]}
        >
          {historyFilter.endDate || 'Tarih seç'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearFilterButton}
        onPress={() =>
          setHistoryFilter({
            startDate: '',
            endDate: '',
          })
        }
      >
        <Text style={styles.clearFilterButtonText}>Filtreyi Temizle</Text>
      </TouchableOpacity>

      {historySessions.length === 0 ? (
        <Text style={styles.emptyText}>Filtreye uygun geçmiş seans yok.</Text>
      ) : (
        historySessions.map((session) => (
          <View key={session.id} style={styles.historyItem}>
            <View>
              <Text style={styles.historyTitle}>{session.sessionNo}. Seans</Text>
              <Text style={styles.historySub}>
                Planlanan Tarih: {session.scheduledDate}
              </Text>
              <Text style={styles.historySub}>
                Tamamlanma Tarihi: {session.completedAt}
              </Text>
              <Text style={styles.historySub}>
                Süre: {session.duration ? `${session.duration} sn` : 'Girilmedi'}
              </Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Tamamlandı</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderNewPlan = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Yeni Plan Oluştur</Text>

      <Text style={styles.inputLabel}>Plan Adı</Text>
      <TextInput
        style={styles.inputBox}
        value={newPlanForm.name}
        onChangeText={(text) =>
          setNewPlanForm({ ...newPlanForm, name: text })
        }
        placeholder="Fototerapi Planı"
        placeholderTextColor="#b9a7ab"
      />

      <Text style={styles.inputLabel}>Başlangıç Tarihi</Text>
      <View style={styles.inputWrapper}>
        <Calendar size={18} color="#8B2635" />
        <TextInput
          style={styles.input}
          value={newPlanForm.startDate}
          onChangeText={(text) =>
            setNewPlanForm({ ...newPlanForm, startDate: text })
          }
          placeholder="2026-04-18"
          placeholderTextColor="#b9a7ab"
        />
      </View>

      <Text style={styles.inputLabel}>Seans Sayısı</Text>
      <TextInput
        style={styles.inputBox}
        value={String(newPlanForm.sessionCount)}
        onChangeText={(text) =>
          setNewPlanForm({
            ...newPlanForm,
            sessionCount: Number(text) || 0,
          })
        }
        keyboardType="numeric"
        placeholder="10"
        placeholderTextColor="#b9a7ab"
      />

      

      <TouchableOpacity style={styles.primaryButton} onPress={createPlan}>
        <Text style={styles.primaryButtonText}>Yeni Planı Kaydet</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Fototerapi Takibi</Text>
          <Text style={styles.subtitle}>
            Aktif tedavini ve seans geçmişini yönet
          </Text>
        </View>

        <View style={styles.topTabs}>
          <TouchableOpacity
            style={[
              styles.topTabButton,
              activeTab === 'dashboard' && styles.topTabButtonActive,
            ]}
            onPress={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard
              size={16}
              color={activeTab === 'dashboard' ? '#fff' : '#8B2635'}
            />
            <Text
              style={[
                styles.topTabText,
                activeTab === 'dashboard' && styles.topTabTextActive,
              ]}
            >
              Panel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topTabButton,
              activeTab === 'history' && styles.topTabButtonActive,
            ]}
            onPress={() => setActiveTab('history')}
          >
            <History
              size={16}
              color={activeTab === 'history' ? '#fff' : '#8B2635'}
            />
            <Text
              style={[
                styles.topTabText,
                activeTab === 'history' && styles.topTabTextActive,
              ]}
            >
              Geçmiş
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topTabButton,
              activeTab === 'new_plan' && styles.topTabButtonActive,
            ]}
            onPress={() => setActiveTab('new_plan')}
          >
            <Plus
              size={16}
              color={activeTab === 'new_plan' ? '#fff' : '#8B2635'}
            />
            <Text
              style={[
                styles.topTabText,
                activeTab === 'new_plan' && styles.topTabTextActive,
              ]}
            >
              Yeni Plan
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'new_plan' && renderNewPlan()}
      </ScrollView>

      {pickerState.visible && (
        <DateTimePicker
          value={pickerState.value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
        />
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/home')}
        >
          <Home size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Ana Sayfa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/symptoms')}
        >
          <Activity size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Semptom</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/treatment')}
        >
          <Pill size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Tedavi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <BarChart3 size={22} color="#8B2635" />
          <Text style={[styles.navText, { color: '#8B2635' }]}>
            Fototerapi Takibi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <User size={22} color="#b9a7ab" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
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
    paddingBottom: 110,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B2635',
  },

  subtitle: {
    fontSize: 13,
    color: '#9b8d91',
    marginTop: 4,
  },

  topTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  topTabButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
  },

  topTabButtonActive: {
    backgroundColor: '#8B2635',
  },

  topTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B2635',
    marginLeft: 6,
  },

  topTabTextActive: {
    color: '#fff',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
    borderRadius: 22,
  },

  cardLabel: {
    fontSize: 11,
    color: '#8B2635',
    marginBottom: 6,
    fontWeight: '600',
  },

  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },

  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },

  progressSection: {
    marginTop: 16,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B2635',
    marginBottom: 10,
  },

  percentBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B2635',
  },

  progressText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },

  progressBarBg: {
    height: 10,
    backgroundColor: '#f0e2e5',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressBar: {
    height: '100%',
    backgroundColor: '#8B2635',
    borderRadius: 10,
  },

  sessionRow: {
    backgroundColor: '#FFF5F6',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },

  sessionInfo: {
    marginBottom: 10,
  },

  sessionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },

  sessionSub: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },

  completedDateText: {
    fontSize: 13,
    color: '#1f9d55',
    marginTop: 4,
    fontWeight: '600',
  },

  pendingText: {
    fontSize: 13,
    color: '#c05674',
    marginTop: 4,
    fontWeight: '600',
  },

  durationLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
  },

  durationInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    color: '#333',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#ead7dc',
  },

  completeButton: {
    backgroundColor: '#8B2635',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },

  completeButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  undoButton: {
    backgroundColor: '#ececec',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },

  undoButtonText: {
    color: '#555',
    fontWeight: '700',
    fontSize: 13,
  },

  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3eaec',
  },

  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  historySub: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },

  statusBadge: {
    backgroundColor: '#e8f7ee',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1f9d55',
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },

  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 2,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F6',
    borderRadius: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
    height: 50,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
  },

  inputBox: {
    backgroundColor: '#FFF5F6',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 14,
    color: '#333',
    fontSize: 14,
  },

  datePickerButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: '#FFF5F6',
    paddingHorizontal: 12,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  datePickerText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },

  datePickerPlaceholder: {
    color: '#b9a7ab',
  },

  noteBox: {
    backgroundColor: '#fff1e6',
    padding: 12,
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 14,
  },

  noteText: {
    fontSize: 12,
    color: '#9a5b20',
  },

  clearFilterButton: {
    backgroundColor: '#f3e7ea',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },

  clearFilterButtonText: {
    color: '#8B2635',
    fontWeight: '700',
    fontSize: 13,
  },

  primaryButton: {
    backgroundColor: '#8B2635',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
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