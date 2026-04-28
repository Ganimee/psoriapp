import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  CalendarDays,
  ClipboardList,
  Droplet,
  LineChart,
  Sparkles,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: <Droplet size={72} color="#6e1a26" />,
      title: 'İyi Hisset,\nKontrol Senin Elinde',
      desc: 'Psoriasis takibin için her şey tek bir uygulamada.',
    },
    {
      icon: <Sparkles size={72} color="#6e1a26" />,
      title: 'Yapay Zeka Destekli\nKişiselleştirilmiş Öneriler',
      desc: 'AI analizleri ile tetikleyicilerini keşfet, sana özel öneriler al.',
    },
    {
      icon: <ClipboardList size={72} color="#6e1a26" />,
      title: 'Semptom ve\nFototerapi Takibi',
      desc: 'Semptomlarını not al, fototerapi seanslarını kolayca takip et.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide = (activeSlide + 1) % slides.length;
      setActiveSlide(nextSlide);

      scrollRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveSlide(slideIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((item, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.iconBox}>{item.icon}</View>

            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.description}>{item.desc}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeSlide === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.featureRow}>
          <View style={styles.featureItem}>
            <CalendarDays size={24} color="#fff" />
            <Text style={styles.featureText}>Takip Et</Text>
          </View>

          <View style={styles.featureItem}>
            <ClipboardList size={24} color="#fff" />
            <Text style={styles.featureText}>Kaydet</Text>
          </View>

          <View style={styles.featureItem}>
            <LineChart size={24} color="#fff" />
            <Text style={styles.featureText}>İlerle</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.registerText}>Kayıt Ol</Text>
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

  slide: {
    width,
    alignItems: 'center',
    paddingTop: 95,
    paddingHorizontal: 30,
  },

  iconBox: {
    width: 115,
    height: 115,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#6e1a26',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  title: {
    color: '#6e1a26',
    fontSize: 25,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },

  description: {
    color: '#777',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 18,
  },

  dotsContainer: {
    position: 'absolute',
    top: 410,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#D1D5DB',
  },

  activeDot: {
    width: 24,
    backgroundColor: '#6e1a26',
  },

  bottomArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#6e1a26',
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    paddingTop: 34,
    paddingHorizontal: 30,
    paddingBottom: 42,
  },

  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },

  featureItem: {
    alignItems: 'center',
  },

  featureText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },

  loginButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 18,
  },

  loginButtonText: {
    color: '#6e1a26',
    fontSize: 16,
    fontWeight: '800',
  },

  registerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    opacity: 0.9,
  },
});