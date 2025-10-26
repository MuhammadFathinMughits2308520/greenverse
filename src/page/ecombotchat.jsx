// ecombotchat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, useParams } from 'react-router-dom';
import Aquano from "../assets/aquano.png";
import Head from "../assets/head.png";
import User from "../assets/user.png";
import { ArrowRight } from "lucide-react";
import KimiaHijau from "./KimiaHijau";
import Kegiatan1 from "./Kegiatan1";
import Kegiatan2 from "./Kegiatan2";
import Kegiatan3 from "./Kegiatan3";
import Kegiatan4 from "./Kegiatan4";
import Kegiatan5 from "./Kegiatan5";
import Kegiatan6 from "./Kegiatan6";
import Kegiatan7 from "./Kegiatan7";
import { useChatFlow } from '../hooks/useChatFlow';

// Konstanta untuk base URL API
const API_BASE_URL = 'https://backendecombot-production.up.railway.app/api';

// Helper: ambil token JWT dengan error handling yang lebih baik
const getAuthHeader = () => {
  try {
    // Coba beberapa kemungkinan key token
    const token = localStorage.getItem("access") || 
                  localStorage.getItem("token") || 
                  localStorage.getItem("jwt") || 
                  localStorage.getItem("auth_token");
    
    if (!token) {
      console.warn('No JWT token found in localStorage');
      return {};
    }
    
    // Validasi format token dasar
    if (typeof token !== 'string' || token.trim() === '') {
      console.error('Invalid token format');
      return {};
    }
    
    return { Authorization: `Bearer ${token.trim()}` };
  } catch (error) {
    console.error('Error getting auth header:', error);
    return {};
  }
};

// Helper: cek apakah user sudah login
const isUserLoggedIn = () => {
  try {
    const token = localStorage.getItem("access") || 
                  localStorage.getItem("token") || 
                  localStorage.getItem("jwt");
    return !!token;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Helper: simpan token dengan konsisten
const saveAuthToken = (token) => {
  try {
    if (!token) {
      console.error('No token provided to save');
      return false;
    }
    
    // Simpan dengan key utama 'access' untuk konsistensi
    localStorage.setItem("access", token);
    localStorage.setItem("token", token); // Backup dengan key umum
    
    console.log('Token saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

// Helper: hapus token (untuk logout)
const clearAuthTokens = () => {
  try {
    const keysToRemove = ['access', 'token', 'jwt', 'auth_token', 'refresh'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('All auth tokens cleared');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// Fallback data jika loading gagal
const fallbackChatFlow = {
  chatbot_flow: {
    intro: {
      id: "intro",
      type: "bot_message",
      character: "Aquano",
      message: "Hai, sudah siap untuk eksplorasi hari ini?",
      next_keywords: ["siap"]
    },
    kimia_hijau: {
      id: "kimia_hijau",
      type: "bot_message",
      character: "Aquano",
      message: "Selamat datang di materi Kimia Hijau! Mari kita pelajari tentang prinsip-prinsip kimia hijau dan penerapannya dalam kehidupan sehari-hari.",
      next_keywords: ["sudah"]
    },
    pre_kegiatan: {
      id: "pre_kegiatan",
      type: "bot_message",
      character: "Aquano",
      message: "Baiklah! Sekarang kita akan memulai eksplorasi. Siap untuk memulai petualangan kimia hijau?",
      next_keywords: ["mulai eksplorasi 1"]
    },
    kegiatan_1: {
      id: "kegiatan_1",
      type: "bot_message",
      character: "Aquano",
      message: "Ini adalah Eksplorasi 1: Pengenalan Kimia Hijau. Mari kita pelajari dasar-dasar kimia hijau.",
      next_keywords: ["pertanyaan 1"]
    },
    kegiatan_2: {
      id: "kegiatan_2",
      type: "bot_message",
      character: "Aquano",
      message: "Ini adalah Eksplorasi 2: Prinsip-prinsip Kimia Hijau. Kita akan mempelajari 12 prinsip kimia hijau.",
      next_keywords: ["pertanyaan 2"]
    },
    kegiatan_3: {
      id: "kegiatan_3",
      type: "bot_message",
      character: "Aquano",
      message: "Ini adalah Eksplorasi 3: Aplikasi Kimia Hijau. Mari lihat bagaimana kimia hijau diterapkan dalam industri.",
      next_keywords: ["pertanyaan 3"]
    },
    kegiatan_4: {
      id: "kegiatan_4",
      type: "bot_message",
      character: "Aquano",
      message: "Ini adalah Eksplorasi 4: Teknologi Hijau. Kita akan eksplorasi teknologi ramah lingkungan.",
      next_keywords: ["pertanyaan 4"]
    },
    kegiatan_5: {
      id: "kegiatan_5",
      type: "bot_message",
      character: "Aquano",
      message: "Ini adalah Eksplorasi 5: Inovasi Berkelanjutan. Mari kita rancang solusi hijau.",
      next_keywords: ["mari merancang"]
    },
    kegiatan_6: {
      id: "kegiatan_6",
      type: "bot_message",
      character: "Aquano",
      message: "Ini adalah Eksplorasi 6: Kreativitas Hijau. Saatnya berkreasi dengan prinsip kimia hijau.",
      next_keywords: ["ayo berkreasi"]
    },
    kegiatan_7: {
      id: "kegiatan_7",
      type: "bot_message",
      character: "Aquano",
      message: "Ini adalah Eksplorasi 7: Refleksi Pembelajaran. Mari kita renungkan apa yang telah dipelajari.",
      next_keywords: ["pertanyaan reflektif"]
    },
    completion: {
      id: "completion",
      type: "bot_message",
      character: "Aquano",
      title: "Eksplorasi Selesai",
      message: "Selamat! kamu telah menyelesaikan seluruh eksplorasi ini.\n\nDengan menyelesaikan kegiatan ini, kamu telah belajar tentang tradisi Mapag Hujan, bagaimana tradisi ini membantu mitigasi banjir, mengelola sampah, dan menjaga keseimbangan lingkungan. Selain itu, kamu juga memahami keterkaitan tradisi lokal dengan prinsip kimia hijau, serta pentingnya literasi lingkungan dalam kehidupan sehari-hari. Gunakan pengetahuan ini untuk membuat keputusan yang lebih bijak terhadap lingkungan di rumah, sekolah, atau lingkungan sekitar.",
      next_keywords: ["tanya ecombot", "menu sebelumnya", "eksplorasi selesai"]
    },
    forum_diskusi: {
      id: "forum_diskusi",
      type: "bot_message",
      character: "Aquano",
      message: "Selamat datang di Tanya Ecombot! Silakan ajukan pertanyaan Anda tentang berbagai topik pembelajaran. Saya akan membantu menjawab pertanyaan Anda berdasarkan materi yang tersedia.\n\nAnda juga bisa kembali ke alur pembelajaran dengan mengetik 'menu sebelumnya'.",
      next_keywords: ["menu sebelumnya"]
    }
  },
  navigation: {
    intro: {
      "siap": "kimia_hijau"
    },
    kimia_hijau: {
      "tanya ecombot": "forum_diskusi",
      "sudah": "pre_kegiatan"
    },
    pre_kegiatan: {
      "mulai eksplorasi 1": "kegiatan_1",
      "tanya ecombot": "forum_diskusi",
      "Menu Sebelumnya": "kimia_hijau"
    },
    kegiatan_1: {
      "pertanyaan 1": "pertanyaan_1",
      "tanya ecombot": "forum_diskusi",
      "Menu Sebelumnya": "pre_kegiatan"
    },
    pertanyaan_1: {
      "mulai eksplorasi 2": "kegiatan_2",
      "Menu Sebelumnya": "kegiatan_1"
    },
    kegiatan_2: {
      "pertanyaan 2": "pertanyaan_2",
      "tanya ecombot": "forum_diskusi",
      "Menu Sebelumnya": "kegiatan_1"
    },
    pertanyaan_2: {
      "mulai eksplorasi 3": "kegiatan_3",
      "Menu Sebelumnya": "kegiatan_2"
    },
    kegiatan_3: {
      "pertanyaan 3": "pertanyaan_3",
      "tanya ecombot": "forum_diskusi",
      "Menu Sebelumnya": "kegiatan_2"
    },
    pertanyaan_3: {
      "mulai eksplorasi 4": "kegiatan_4",
      "Menu Sebelumnya": "kegiatan_3"
    },
    kegiatan_4: {
      "pertanyaan 4": "pertanyaan_4",
      "tanya ecombot": "forum_diskusi",
      "Menu Sebelumnya": "kegiatan_3"
    },
    pertanyaan_4: {
      "mulai eksplorasi 5": "kegiatan_5",
      "Menu Sebelumnya": "kegiatan_4"
    },
    kegiatan_5: {
      "mari merancang": "mari_merancang",
      "tanya ecombot": "forum_diskusi",
      "Menu Sebelumnya": "kegiatan_4"
    },
    mari_merancang: {
      "mulai eksplorasi 6": "kegiatan_6",
      "Menu Sebelumnya": "kegiatan_5"
    },
    kegiatan_6: {
      "ayo berkreasi": "ayo_berkreasi",
      "tanya ecombot": "forum_diskusi",
      "Menu Sebelumnya": "kegiatan_5"
    },
    ayo_berkreasi: {
      "mulai eksplorasi 7": "kegiatan_7",
      "Menu Sebelumnya": "kegiatan_6"
    },
    kegiatan_7: {
      "pertanyaan reflektif": "pertanyaan_reflektif",
      "Menu Sebelumnya": "kegiatan_6"
    },
    pertanyaan_reflektif: {
      "Eksplorasi Selesai": "completion",
      "Menu Sebelumnya": "kegiatan_7"
    },
    completion: {
      "tanya ecombot": "forum_diskusi",
      "Menu Sebelumnya": "kegiatan_7",
      "eksplorasi selesai": "redirect_ecomic"
    },
    forum_diskusi: {
      "Menu Sebelumnya": "previous_step"
    }
  }
};

// Context untuk state management
export const AppContext = React.createContext();

const EcombotChat = () => {
  const params = useParams();
  const comicParam = params.comic || params.comic_slug || params.comicSlug || null;
  const episodeParam = params.episode || params.episode_slug || params.episodeSlug || null;

  const comicSlug = comicParam || localStorage.getItem("last_comic_slug") || "my-comic";
  const episodeSlug = episodeParam || localStorage.getItem("last_episode_slug") || "e_001";

  const storageKey = `comic_last_${comicSlug}_${episodeSlug}`;
  const savedPage = Number(localStorage.getItem(storageKey) ?? 0);
  const [permission, setPermission] = useState({ finish: false, last_page: savedPage });
  const { chatFlow, loading, error } = useChatFlow();
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showKegiatan, setShowKegiatan] = useState(false);
  const [currentStep, setCurrentStep] = useState('intro');
  const [isInForum, setIsInForum] = useState(false);
  const [forumHistory, setForumHistory] = useState([]);
  const [waitingForAnswer, setWaitingForAnswer] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [reflectiveQuestions, setReflectiveQuestions] = useState([]);
  const [currentReflectiveQuestion, setCurrentReflectiveQuestion] = useState(0);
  const [currentSession, setCurrentSession] = useState(null);
  
  // STATE BARU: Menyimpan langkah sebelumnya untuk navigasi "menu sebelumnya"
  const [previousSteps, setPreviousSteps] = useState([]);
  
  // State untuk progres kegiatan dan jawaban
  const [progress, setProgress] = useState({
    completed: [],
    current: 'intro',
    answers: {},
    visited: []
  });
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Daftar halaman yang tersedia
  const kegiatanList = [
    { num: 0, path: '/kimia-hijau', name: 'Kimia Hijau', stepKey: 'kimia_hijau', materi: 'Pengenalan', alwaysAccessible: true },
    { num: 1, path: '/kegiatan-1', name: 'Masalah Sampah dan Banjir', stepKey: 'kegiatan_1', materi: 'Eksplorasi 1', alwaysAccessible: true },
    { num: 2, path: '/kegiatan-2', name: 'Prinsip Kimia Hijau', stepKey: 'kegiatan_2', materi: 'Eksplorasi 2' },
    { num: 3, path: '/kegiatan-3', name: 'Aspek Sains (<i>Science</i>)', stepKey: 'kegiatan_3', materi: 'Eksplorasi 3' },
    { num: 4, path: '/kegiatan-4', name: 'Aspek Teknologi (<i>Technology</i>)', stepKey: 'kegiatan_4', materi: 'Eksplorasi 4' },
    { num: 5, path: '/kegiatan-5', name: 'Aspek Rekayasa (<i>Engineering</i>)', stepKey: 'kegiatan_5', materi: 'Eksplorasi 5' },
    { num: 6, path: '/kegiatan-6', name: 'Aspek Seni (<i>Arts</i>)', stepKey: 'kegiatan_6', materi: 'Eksplorasi 6' },
    { num: 7, path: '/kegiatan-7', name: 'Aspek Matematika (<i>Mathematics</i>)', stepKey: 'kegiatan_7', materi: 'Eksplorasi 7' },
  ];

  // Gunakan chatFlow yang aman (fallback jika undefined)
  const currentChatFlow = chatFlow || fallbackChatFlow;

  // Fungsi untuk mendapatkan data step dengan fallback
  const getStepData = (stepKey) => {
    if (!currentChatFlow || !currentChatFlow.chatbot_flow) {
      return fallbackChatFlow.chatbot_flow[stepKey] || fallbackChatFlow.chatbot_flow.intro;
    }
    
    return currentChatFlow.chatbot_flow[stepKey] || fallbackChatFlow.chatbot_flow[stepKey] || fallbackChatFlow.chatbot_flow.intro;
  };

  // Fungsi untuk mendapatkan judul berdasarkan lokasi saat ini
  const getCurrentTitle = () => {
    const fullPath = location.pathname;
    
    const currentKegiatan = kegiatanList.find(kegiatan => 
      `/ecombot${kegiatan.path}` === fullPath || kegiatan.path === fullPath
    );
    
    if (currentKegiatan) {
      return {
        materi: currentKegiatan.materi,
        title: currentKegiatan.name
      };
    }
    
    if (fullPath === '/ecombot' || fullPath === '/ecombot/') {
      return {
        materi: 'Pengenalan',
        title: 'Kimia Hijau'
      };
    }
    
    return {
      materi: 'Eksplorasi',
      title: 'Kimia Hijau'
    };
  };

  const currentTitle = getCurrentTitle();

  // Initialize chat session dan load history - DIPERBAIKI
  useEffect(() => {
    const initializeChat = async () => {
      // Load history percakapan dari localStorage terlebih dahulu
      const savedMessages = localStorage.getItem('ecombot_chat_history');
      const savedProgress = localStorage.getItem('chatbot-progress');
      const savedPreviousSteps = localStorage.getItem('ecombot_previous_steps');
      const savedCurrentStep = localStorage.getItem('ecombot_current_step');

      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessages(parsedMessages);
        } catch (e) {
          console.error('Error parsing saved messages:', e);
        }
      }

      if (savedProgress) {
        try {
          const parsedProgress = JSON.parse(savedProgress);
          setProgress(parsedProgress);
        } catch (e) {
          console.error('Error parsing saved progress:', e);
        }
      }

      if (savedPreviousSteps) {
        try {
          const parsedSteps = JSON.parse(savedPreviousSteps);
          setPreviousSteps(parsedSteps);
        } catch (e) {
          console.error('Error parsing previous steps:', e);
        }
      }

      if (savedCurrentStep) {
        setCurrentStep(savedCurrentStep);
      }

      // Jika tidak ada pesan yang tersimpan, mulai dengan intro
      if (!savedMessages || JSON.parse(savedMessages).length === 0) {
        const introMessage = getStepData('intro');
        setMessages([{ 
          from: 'bot', 
          text: introMessage.message,
          data: introMessage
        }]);
        
        // Set progress awal
        setProgress(prev => ({
          ...prev,
          visited: ['intro'],
          current: 'intro'
        }));
        
        setPreviousSteps([]);
      }

      // Load data dari backend jika tersedia
      if (currentChatFlow && messages.length === 0) {
        await startOrLoadSession();
        loadReflectiveQuestions();
      }
    };
    
    initializeChat();
  }, [currentChatFlow]);

  // Simpan history percakapan ke localStorage setiap kali messages berubah - DIPERBAIKI
  useEffect(() => {
    localStorage.setItem('ecombot_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Simpan progress ke localStorage
  useEffect(() => {
    localStorage.setItem('chatbot-progress', JSON.stringify(progress));
  }, [progress]);

  // Simpan previous steps ke localStorage
  useEffect(() => {
    localStorage.setItem('ecombot_previous_steps', JSON.stringify(previousSteps));
  }, [previousSteps]);

  // Simpan current step ke localStorage
  useEffect(() => {
    localStorage.setItem('ecombot_current_step', currentStep);
  }, [currentStep]);

  // Effect untuk auto-start question session
  useEffect(() => {
    const stepData = getStepData(currentStep);
    if (stepData) {
      const hasQuestions = (stepData.questions && Array.isArray(stepData.questions) && stepData.questions.length > 0) || 
                          stepData.question;
      
      if (hasQuestions) {
        startQuestionSession();
      }
    }
  }, [currentStep, currentChatFlow]);

  // Fungsi untuk memulai atau memuat sesi chat - DIPERBAIKI DENGAN AUTH YANG KONSISTEN
  const startOrLoadSession = async () => {
    try {
      const isLoggedIn = isUserLoggedIn();
      
      // Cek apakah ada data lokal yang tersimpan
      const localMessages = JSON.parse(localStorage.getItem('local_chat_messages') || '[]');
      const localProgress = localStorage.getItem('chatbot-progress');
      
      if (!isLoggedIn) {
        console.warn('User not logged in, using local session only');
        
        // Jika ada data lokal, load dari localStorage
        if (localMessages.length > 0) {
          const loadedMessages = localMessages.map(msg => ({
            from: msg.message_type === 'bot' ? 'bot' : 'user',
            text: msg.message_text,
            data: msg.message_data || {}
          }));
          setMessages(loadedMessages);
          console.log('Loaded local messages:', loadedMessages.length);
        }
        
        // Load progress dari localStorage
        if (localProgress) {
          const parsedProgress = JSON.parse(localProgress);
          if (!parsedProgress.visited) {
            parsedProgress.visited = ['intro'];
          }
          setProgress(parsedProgress);
          console.log('Loaded local progress:', parsedProgress);
        }
        
        // Buat session ID lokal
        const localSessionId = `local_session_${Date.now()}`;
        setCurrentSession(localSessionId);
        localStorage.setItem('current_session_id', localSessionId);
        
        return;
      }

      // User sudah login, gunakan backend dengan auth header yang benar
      const sessionId = localStorage.getItem('current_session_id') || `session_${Date.now()}`;
      
      const response = await fetch(`${API_BASE_URL}/chat/session/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader() // Gunakan helper function yang sudah diperbaiki
        },
        body: JSON.stringify({
          session_id: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSession(data.session_id);
        localStorage.setItem('current_session_id', data.session_id);
        
        await loadActivityHistory(data.current_activity);
        
      } else if (response.status === 401) {
        console.warn('Token expired or invalid, clearing tokens and using local session');
        clearAuthTokens();
        // Fallback ke local session
        const introMessage = getStepData('intro');
        setMessages([{ 
          from: 'bot', 
          text: introMessage.message,
          data: introMessage
        }]);
      } else {
        throw new Error(`Failed to start session: ${response.status}`);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      // Fallback ke local session
      const introMessage = getStepData('intro');
      setMessages([{ 
        from: 'bot', 
        text: introMessage.message,
        data: introMessage
      }]);
      
      const localSessionId = `local_session_${Date.now()}`;
      setCurrentSession(localSessionId);
      localStorage.setItem('current_session_id', localSessionId);
    }
  };

  // Fungsi untuk memuat history activity - DIPERBAIKI DENGAN AUTH
  const loadActivityHistory = async (activityId) => {
    try {
      const isLoggedIn = isUserLoggedIn();
      const sessionId = localStorage.getItem('current_session_id');
      
      if (!isLoggedIn || !sessionId) return;

      const response = await fetch(`${API_BASE_URL}/chat/session/${sessionId}/activity/${activityId}/`, {
        method: 'GET',
        headers: {
          ...getAuthHeader()
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        const historyMessages = [];
        
        if (data.history.messages) {
          data.history.messages.forEach(msg => {
            if (msg.message_type === 'bot') {
              historyMessages.push({
                from: 'bot',
                text: msg.message_text,
                data: msg.message_data
              });
            } else if (msg.message_type === 'user') {
              historyMessages.push({
                from: 'user',
                text: msg.message_text
              });
            }
          });
        }
        
        setMessages(historyMessages);
        
        const progressResponse = await fetch(`${API_BASE_URL}/chat/session/${sessionId}/overview/`, {
          method: 'GET',
          headers: {
            ...getAuthHeader()
          }
        });
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          updateProgressFromServer(progressData.overview);
        }
      } else if (response.status === 401) {
        console.warn('Token expired while loading activity history');
        clearAuthTokens();
      }
    } catch (error) {
      console.error('Error loading activity history:', error);
    }
  };

  // Fungsi untuk update progress dari server
  const updateProgressFromServer = (overview) => {
    const completed = [];
    const visited = [];
    
    Object.entries(overview).forEach(([activityId, data]) => {
      if (data.status === 'completed') {
        completed.push(activityId);
      }
      if (data.messages_count > 0) {
        visited.push(activityId);
      }
    });
    
    setProgress(prev => ({
      ...prev,
      completed,
      visited: [...new Set([...prev.visited, ...visited])]
    }));
  };

  // Fungsi untuk load pertanyaan reflektif
  const loadReflectiveQuestions = async () => {
    try {
      const response = await fetch('/data/chat.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      const data = await response.json();
      
      if (data.reflective_questions) {
        setReflectiveQuestions(data.reflective_questions);
      } else {
        useFallbackReflectiveQuestions();
      }
    } catch (error) {
      console.error('Error loading reflective questions:', error);
      useFallbackReflectiveQuestions();
    }
  };

  // Fungsi fallback untuk pertanyaan reflektif
  const useFallbackReflectiveQuestions = () => {
    const fallbackQuestions = [
      "Apa hal paling berharga yang Anda pelajari dari materi kimia hijau dan tradisi Mapag Hujan?",
      "Bagaimana Anda akan menerapkan pengetahuan ini dalam kehidupan sehari-hari?",
      "Apa tantangan terbesar yang Anda rasakan dalam menerapkan prinsip kimia hijau?",
      "Bagaimana menurut Anda hubungan antara kearifan lokal dan ilmu pengetahuan modern?",
      "Apa rencana Anda untuk menyebarkan pengetahuan tentang kimia hijau kepada orang lain?"
    ];
    setReflectiveQuestions(fallbackQuestions);
  };

  // Effect untuk mengatur status forum
  useEffect(() => {
    const inForum = currentStep === 'forum_diskusi';
    setIsInForum(inForum);
    
    if (inForum && messages[messages.length - 1]?.from !== 'bot' || 
        (messages[messages.length - 1]?.text !== getStepData('forum_diskusi')?.message && inForum)) {
      const forumMessage = getStepData('forum_diskusi');
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: forumMessage.message,
        data: forumMessage
      }]);
    }
  }, [currentStep, currentChatFlow]);

  // Effect untuk reset state pertanyaan ketika berpindah kegiatan
  useEffect(() => {
    if (!currentStep.startsWith('pertanyaan_') && currentStep !== 'mari_merancang' && currentStep !== 'ayo_berkreasi') {
      setWaitingForAnswer(null);
      setCurrentQuestions([]);
      setCurrentQuestionIndex(0);
    }
  }, [currentStep]);

  // Fungsi untuk menandai kegiatan sebagai telah dikunjungi
  const markAsVisited = (activityId) => {
    setProgress(prev => {
      const visited = [...prev.visited];
      if (!visited.includes(activityId)) {
        visited.push(activityId);
      }
      return {
        ...prev,
        visited
      };
    });
  };

  // Effect untuk menandai halaman saat ini sebagai visited
  useEffect(() => {
    const currentKegiatan = kegiatanList.find(kegiatan => location.pathname.includes(kegiatan.path));
    if (currentKegiatan) {
      markAsVisited(currentKegiatan.stepKey);
    }
  }, [location.pathname]);

  const scrollChat = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Fungsi untuk menyimpan pesan ke database - DIPERBAIKI DENGAN AUTH YANG KONSISTEN
  const saveMessageToDatabase = async (messageType, character, messageText, stepId, messageData = {}) => {
    try {
      const isLoggedIn = isUserLoggedIn();
      const sessionId = localStorage.getItem('current_session_id');
      
      if (!isLoggedIn || !sessionId) {
        // FALLBACK: Simpan ke localStorage untuk user tidak login
        const localMessages = JSON.parse(localStorage.getItem('local_chat_messages') || '[]');
        localMessages.push({
          message_type: messageType,
          character,
          message_text: messageText,
          step_id: stepId,
          message_data: messageData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('local_chat_messages', JSON.stringify(localMessages));
        return { status: 'saved_locally' };
      }

      const response = await fetch(`${API_BASE_URL}/chat/session/send/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          session_id: sessionId,
          message_type: messageType,
          character,
          message_text: messageText,
          step_id: stepId,
          message_data: messageData,
          current_activity: stepId
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else if (response.status === 401) {
        console.warn('Token expired while saving message');
        clearAuthTokens();
        // Fallback ke localStorage
        const localMessages = JSON.parse(localStorage.getItem('local_chat_messages') || '[]');
        localMessages.push({
          message_type: messageType,
          character,
          message_text: messageText,
          step_id: stepId,
          message_data: messageData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('local_chat_messages', JSON.stringify(localMessages));
        return { status: 'saved_locally_fallback' };
      }
    } catch (error) {
      console.error('Error saving message to database:', error);
      // Fallback ke localStorage
      const localMessages = JSON.parse(localStorage.getItem('local_chat_messages') || '[]');
      localMessages.push({
        message_type: messageType,
        character,
        message_text: messageText,
        step_id: stepId,
        message_data: messageData,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('local_chat_messages', JSON.stringify(localMessages));
      return { status: 'saved_locally_fallback' };
    }
    return null;
  };

  // Fungsi untuk menyimpan jawaban ke database - DIPERBAIKI DENGAN AUTH
  const saveAnswerToDatabase = async (questionData, answer, answerType = 'essay') => {
    try {
      const isLoggedIn = isUserLoggedIn();
      const sessionId = localStorage.getItem('current_session_id');
      
      if (!isLoggedIn || !sessionId) {
        // FALLBACK: save to localStorage dengan struktur yang lebih baik
        const savedAnswers = JSON.parse(localStorage.getItem('user_answers') || '[]');
        const answerRecord = {
          question: questionData.text,
          answer,
          aspect: getAspectFromStep(currentStep),
          kegiatan: currentStep,
          question_id: questionData.id,
          storage_key: questionData.storage_key,
          answer_type: answerType,
          timestamp: new Date().toISOString(),
          question_data: questionData // Simpan data pertanyaan lengkap
        };
        savedAnswers.push(answerRecord);
        localStorage.setItem('user_answers', JSON.stringify(savedAnswers));
        
        // Juga simpan di progress lokal
        saveAnswer(questionData.storage_key, answer);
        
        return { status: 'saved_locally', data: answerRecord };
      }

      const response = await fetch(`${API_BASE_URL}/chat/answer/submit/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({
          session_id: sessionId,
          activity_id: currentStep,
          question_data: questionData,
          answer_text: answer,
          answer_type: answerType
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Juga simpan di progress lokal
        saveAnswer(questionData.storage_key, answer);
        return data;
      } else if (response.status === 401) {
        console.warn('Token expired while saving answer');
        clearAuthTokens();
        // Fallback to localStorage
        const savedAnswers = JSON.parse(localStorage.getItem('user_answers') || '[]');
        const answerRecord = {
          question: questionData.text,
          answer,
          aspect: getAspectFromStep(currentStep),
          kegiatan: currentStep,
          question_id: questionData.id,
          storage_key: questionData.storage_key,
          answer_type: answerType,
          timestamp: new Date().toISOString(),
          question_data: questionData
        };
        savedAnswers.push(answerRecord);
        localStorage.setItem('user_answers', JSON.stringify(savedAnswers));
        
        // Juga simpan di progress lokal
        saveAnswer(questionData.storage_key, answer);
        
        return { status: 'saved_locally_fallback', data: answerRecord };
      } else {
        throw new Error('Failed to save answer to database');
      }
    } catch (error) {
      console.error('Error saving answer to database:', error);
      // Fallback to localStorage
      const savedAnswers = JSON.parse(localStorage.getItem('user_answers') || '[]');
      const answerRecord = {
        question: questionData.text,
        answer,
        aspect: getAspectFromStep(currentStep),
        kegiatan: currentStep,
        question_id: questionData.id,
        storage_key: questionData.storage_key,
        answer_type: answerType,
        timestamp: new Date().toISOString(),
        question_data: questionData
      };
      savedAnswers.push(answerRecord);
      localStorage.setItem('user_answers', JSON.stringify(savedAnswers));
      
      // Juga simpan di progress lokal
      saveAnswer(questionData.storage_key, answer);
      
      return { status: 'saved_locally_fallback', data: answerRecord };
    }
  };

  // Fungsi untuk mendapatkan pertanyaan dari currentChatFlow berdasarkan kegiatan
  const getQuestionsForCurrentStep = () => {
    const stepData = getStepData(currentStep);
    if (!stepData) return [];
    
    const questions = [];
    
    if (stepData.questions && Array.isArray(stepData.questions)) {
      stepData.questions.forEach(question => {
        questions.push({
          ...question,
          aspect: getAspectFromStep(currentStep)
        });
      });
    } else if (stepData.question) {
      questions.push({
        ...stepData.question,
        aspect: getAspectFromStep(currentStep)
      });
    }
    
    return questions;
  };

  // Fungsi untuk mendapatkan aspek berdasarkan step
  const getAspectFromStep = (step) => {
    const aspectMap = {
      'kegiatan_1': 'Science',
      'kegiatan_2': 'Environment', 
      'kegiatan_3': 'Science',
      'kegiatan_4': 'Technology',
      'kegiatan_5': 'Engineering',
      'kegiatan_6': 'Arts',
      'kegiatan_7': 'Mathematic',
      'completion': 'Reflective',
      'mari_merancang': 'Engineering',
      'ayo_berkreasi': 'Arts'
    };
    
    return aspectMap[step] || 'General';
  };

  // PERBAIKAN: Fungsi untuk mendapatkan quick buttons - DIPERBAIKI UNTUK MENAMPILKAN BUTTON "SIAP"
  const getQuickButtons = (stepKey, messageText = '') => {
    if (waitingForAnswer) {
      return null;
    }
    
    const step = getStepData(stepKey);
    if (!step || !step.next_keywords) return null;
    
    const uniqueKeywords = [...new Set(step.next_keywords)];
    
    if (stepKey === 'forum_diskusi') {
      return uniqueKeywords
        .filter(keyword => keyword.toLowerCase().includes('menu sebelumnya'))
        .map(keyword => {
          const buttonClass = "px-4 py-2 bg-lime-500 !text-lime-700 rounded-full text-sm !font-bold shadow-md hover:shadow-lg hover:bg-lime-600 border border-lime-600 transition-all duration-200";
          return `<button class="${buttonClass}" data-text="Menu Sebelumnya">Menu Sebelumnya</button>`;
        })
        .join('');
    }
    
    // PERBAIKAN: Tampilkan semua button termasuk "siap" untuk step intro
    return uniqueKeywords.map(keyword => {
      const isQuestionButton = keyword.toLowerCase().includes('pertanyaan') || 
                              keyword.toLowerCase().includes('merancang') || 
                              keyword.toLowerCase().includes('kreasi') ||
                              keyword.toLowerCase().includes('siap') ||
                              keyword.toLowerCase().includes('sudah') ||
                              keyword.toLowerCase().includes('mulai');
      const buttonClass = isQuestionButton 
        ? "px-4 py-2 bg-lime-500 !text-lime-700 !font-bold rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:bg-lime-600 border border-lime-600 transition-all duration-200"
        : "px-4 py-2 bg-white !text-lime-700 !font-bold rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:bg-lime-50 hover:text-lime-600 border border-gray-200 transition-all duration-200";
      
      return `<button class="${buttonClass}" data-text="${keyword}">${keyword}</button>`;
    }).join('');
  };

  // Fungsi untuk menyimpan jawaban
  const saveAnswer = (storageKey, answer) => {
    setProgress(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [storageKey]: answer
      }
    }));
  };

  // Fungsi untuk menandai kegiatan sebagai selesai - DIPERBAIKI DENGAN AUTH
  const completeActivity = async (activityId) => {
    // Update state lokal
    setProgress(prev => {
      const completed = [...prev.completed];
      if (!completed.includes(activityId)) {
        completed.push(activityId);
      }
      return {
        ...prev,
        completed,
        current: activityId
      };
    });

    try {
      const isLoggedIn = isUserLoggedIn();
      const sessionId = localStorage.getItem('current_session_id');
      
      if (isLoggedIn && sessionId) {
        const response = await fetch(`${API_BASE_URL}/chat/activity/complete/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({
            session_id: sessionId,
            activity_id: activityId
          })
        });

        if (response.status === 401) {
          console.warn('Token expired while completing activity');
          clearAuthTokens();
        }
      } else {
        // Untuk user tidak login, simpan progress ke localStorage
        const localProgress = JSON.parse(localStorage.getItem('chatbot-progress') || '{}');
        if (!localProgress.completed) localProgress.completed = [];
        if (!localProgress.completed.includes(activityId)) {
          localProgress.completed.push(activityId);
        }
        localProgress.current = activityId;
        localStorage.setItem('chatbot-progress', JSON.stringify(localProgress));
        console.log('Progress saved locally:', localProgress);
      }
    } catch (error) {
      console.error('Error completing activity:', error);
    }
  };

  // Fungsi untuk memeriksa apakah kegiatan dapat diakses
  const canAccessKegiatan = (kegiatanNum) => {
    const targetKegiatan = kegiatanList.find(k => k.num === kegiatanNum);
    
    if (targetKegiatan?.alwaysAccessible) return true;
    
    if (kegiatanNum === 0 || kegiatanNum === 1) return true;
    
    const previousKegiatan = kegiatanList.find(k => k.num === kegiatanNum - 1);
    const isPreviousCompleted = previousKegiatan && progress.completed.includes(previousKegiatan.stepKey);
    
    return isPreviousCompleted;
  };

  // Fungsi untuk memeriksa apakah semua pertanyaan telah dijawab
  const checkAllQuestionsAnswered = () => {
    const questions = getQuestionsForCurrentStep();
    
    if (questions.length === 0) return true;
    
    const allAnswered = questions.every((question, index) => {
      const answerKey = question.storage_key || `question_${index}`;
      return progress.answers[answerKey] && progress.answers[answerKey].trim() !== '';
    });
    
    return allAnswered;
  };

  // Fungsi untuk mendapatkan kegiatan berdasarkan input text
  const getKegiatanFromText = (input) => {
    const normalizedInput = input.toLowerCase().trim();
    const currentKegiatan = kegiatanList.find(k => location.pathname.includes(k.path));
    
    // Deteksi tanya ecombot
    const tanyaEcombotPatterns = [
      /tanya ecombot/i,
      /tanya/i,
      /forum/i,
      /diskusi/i,
      /diskuzi/i,
      /diskus/i,
      /tanya jawab/i,
      /q&a/i,
    ];
    
    for (const pattern of tanyaEcombotPatterns) {
      if (pattern.test(normalizedInput)) {
        return { stepKey: 'forum_diskusi' };
      }
    }

    // Deteksi pertanyaan reflektif
    if (normalizedInput.includes('pertanyaan reflektif')) {
      return { stepKey: 'pertanyaan_reflektif' };
    }
    
    // Deteksi mari merancang
    if (normalizedInput.includes('mari merancang')) {
      return { stepKey: 'mari_merancang' };
    }
    
    // Deteksi ayo berkreasi
    if (normalizedInput.includes('ayo berkreasi')) {
      return { stepKey: 'ayo_berkreasi' };
    }
    
    // Deteksi eksplorasi selesai
    if (normalizedInput.includes('eksplorasi selesai')) {
      return { stepKey: 'redirect_ecomic' };
    }
    
    // Deteksi eksplorasi
    const eksplorasiMatch = normalizedInput.match(/(mulai\s+)?eksplorasi\s+(\d+)/i) || 
                           normalizedInput.match(/ke\s+eksplorasi\s+(\d+)/i) ||
                           normalizedInput.match(/eksplorasi\s+(\d+)/i) ||
                           normalizedInput.match(/eksplorasi\s+(\d+)/i) ||
                           normalizedInput.match(/eks(\d+)/i);
    
    if (eksplorasiMatch) {
      const kegiatanNum = parseInt(eksplorasiMatch[2] || eksplorasiMatch[1]);
      if (!isNaN(kegiatanNum) && kegiatanNum >= 1 && kegiatanNum <= 7) {
        return kegiatanList.find(k => k.num === kegiatanNum);
      }
    }
    
    // Deteksi completion
    if (normalizedInput.includes('Eksplorasi Selesai')) {
      return { stepKey: 'completion' };
    }
    
    // Deteksi menu sebelumnya
    const kembaliPatterns = [
      /menu sebelumnya/i,
      /kembali/i,
      /balik/i,
      /back/i,
      /sebelumnya/i,
      /previous/i,
      /keluar/i,
      /exit/i,
      /selesai/i,
      /tutup/i
    ];
    
    for (const pattern of kembaliPatterns) {
      if (pattern.test(normalizedInput)) {
        if (previousSteps.length > 0) {
          const previousStep = previousSteps[previousSteps.length - 1];
          return { stepKey: previousStep };
        } else if (currentKegiatan && currentKegiatan.num > 0) {
          for (let i = currentKegiatan.num - 1; i >= 0; i--) {
            const prevKegiatan = kegiatanList[i];
            if (progress.visited.includes(prevKegiatan.stepKey) || 
                progress.completed.includes(prevKegiatan.stepKey)) {
              return prevKegiatan;
            }
          }
        }
        break;
      }
    }
    
    return null;
  };

  // FUNGSI BARU: Memproses pertanyaan forum dengan LangChain
  const processForumQuestion = async (question) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ask/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.answer || "Maaf, saya belum bisa menjawab pertanyaan tersebut. Silakan coba tanyakan hal lain.";
    } catch (error) {
      console.error('Error fetching from Django API:', error);
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        return "Maaf, tidak dapat terhubung ke server forum. Pastikan backend Django sedang berjalan.";
      } else if (error.message.includes('500')) {
        return "Maaf, server mengalami masalah internal. Silakan coba lagi nati.";
      } else {
        return "Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi atau ketik 'menu sebelumnya' untuk kembali ke alur pembelajaran.";
      }
    }
  };

  // FUNGSI BARU: Redirect ke /ecomic - DIPERBAIKI DENGAN AUTH
  const redirectToEcomic = async () => {
    const currentPage = Number(localStorage.getItem(storageKey) ?? 0);

    try {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "🎉 Selamat! Anda telah menyelesaikan seluruh eksplorasi. Mengarahkan Anda ke halaman ecomic..."
      }]);
      setPermission(p => ({ ...p, finish: true, last_page: Math.max(p.last_page ?? 0, currentPage) }));
      
      // Cek apakah user login untuk menandai penyelesaian di backend
      const isLoggedIn = isUserLoggedIn();
      if (isLoggedIn) {
        const sessionId = localStorage.getItem('current_session_id');
        if (sessionId) {
          await fetch(`${API_BASE_URL}/chat/activity/complete/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            body: JSON.stringify({
              session_id: sessionId,
              activity_id: 'completion'
            })
          });
        }
      }
      
      setTimeout(() => navigate('/ecomic'), 3000);
      
    } catch (err) {
      console.error("markFinishApi error:", err);
      if (err.status === 401) {
        clearAuthTokens();
        navigate('/login');
      }
    }
  }

  // Fungsi untuk memulai sesi pertanyaan
  const startQuestionSession = () => {
    const questions = getQuestionsForCurrentStep();
    
    if (questions.length === 0) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "Tidak ada pertanyaan untuk kegiatan ini."
      }]);
      return;
    }
    
    setCurrentQuestions(questions);
    setCurrentQuestionIndex(0);
    
    const firstQuestion = questions[0];
    
    setMessages(prev => [...prev, { 
      from: 'bot', 
      text: `📝 **Pertanyaan:**\n\n${firstQuestion.text}\n\nSilakan ketik jawaban Anda:`,
      data: {}
    }]);
    
    setWaitingForAnswer('question_0');
    scrollChat();
  };

  // Fungsi untuk memproses jawaban pertanyaan - DIPERBAIKI
  const processQuestionAnswer = async (input) => {
    if (!input.trim()) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "❌ Jawaban tidak boleh kosong. Silakan ketik jawaban Anda untuk melanjutkan:",
        data: {
          id: currentStep,
          next_keywords: []
        }
      }]);
      return;
    }

    const currentIndex = currentQuestionIndex;
    const currentQuestion = currentQuestions[currentIndex];
    
    if (!currentQuestion) {
      console.error('No current question found at index:', currentIndex);
      return;
    }
    
    // Simpan pesan user ke state DAN database
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    await saveMessageToDatabase('user', 'User', input, currentStep);
    
    try {
      const result = await saveAnswerToDatabase(currentQuestion, input, currentQuestion.type || 'essay');
      console.log('Answer save result:', result);
      
      // Simpan juga di state lokal
      saveAnswer(currentQuestion.storage_key, input);
      
      if (currentIndex < currentQuestions.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextQuestion = currentQuestions[nextIndex];
        
        setCurrentQuestionIndex(nextIndex);
        const nextMessage = { 
          from: 'bot', 
          text: `✅ Terima kasih! Jawaban Anda telah disimpan.\n\n📝 **Pertanyaan berikutnya:**\n\n${nextQuestion.text}\n\nSilakan ketik jawaban Anda:`,
          data: {}
        };
        
        setMessages(prev => [...prev, nextMessage]);
        await saveMessageToDatabase('bot', 'Aquano', nextMessage.text, currentStep, nextMessage.data);
        
        setWaitingForAnswer(`question_${nextIndex}`);
        
      } else {
        // Selesai semua pertanyaan
        let nextKeywords = [];
        const stepData = getStepData(currentStep);
        
        if (stepData && stepData.next_keywords) {
          nextKeywords = [...stepData.next_keywords];
        } else {
          const navigationMap = {
            'pertanyaan_1': ["mulai eksplorasi 2", "menu sebelumnya"],
            'pertanyaan_2': ["mulai eksplorasi 3", "menu sebelumnya"],
            'pertanyaan_3': ["mulai eksplorasi 4", "menu sebelumnya"],
            'pertanyaan_4': ["mulai eksplorasi 5", "menu sebelumnya"],
            'mari_merancang': ["mulai eksplorasi 6", "menu sebelumnya"],
            'ayo_berkreasi': ["mulai eksplorasi 7", "menu sebelumnya"],
            'pertanyaan_reflektif': ["Eksplorasi Selesai", "menu sebelumnya"]
          };
          
          nextKeywords = navigationMap[currentStep] || ["menu sebelumnya"];
        }
        
        const completionMessage = { 
          from: 'bot', 
          text: "🎉 **Terima kasih!**\nAnda telah menyelesaikan semua pertanyaan untuk kegiatan ini. Jawaban Anda telah disimpan.\n\nSilakan pilih opsi berikut untuk melanjutkan:",
          data: {
            id: currentStep,
            next_keywords: nextKeywords
          }
        };
        
        setMessages(prev => [...prev, completionMessage]);
        await saveMessageToDatabase('bot', 'Aquano', completionMessage.text, currentStep, completionMessage.data);
        
        setWaitingForAnswer(null);
        setCurrentQuestions([]);
        setCurrentQuestionIndex(0);
        
        // Tandai kegiatan sebagai selesai
        let kegiatanStep = currentStep;
        if (currentStep.startsWith('pertanyaan_')) {
          kegiatanStep = currentStep.replace('pertanyaan_', 'kegiatan_');
        } else if (currentStep === 'mari_merancang') {
          kegiatanStep = 'kegiatan_5';
        } else if (currentStep === 'ayo_berkreasi') {
          kegiatanStep = 'kegiatan_6';
        }
        
        if (kegiatanStep !== currentStep) {
          completeActivity(kegiatanStep);
        }
      }
      
    } catch (error) {
      console.error('Error saving answer:', error);
      const errorMessage = { 
        from: 'bot', 
        text: "⚠️ Jawaban Anda telah dicatat secara lokal. Terima kasih!",
        data: {
          id: currentStep,
          next_keywords: []
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
      await saveMessageToDatabase('bot', 'Aquano', errorMessage.text, currentStep, errorMessage.data);
    }
    
    scrollChat();
  };

  // Fungsi untuk mendapatkan step berikutnya setelah selesai menjawab pertanyaan
  const getNextStepAfterQuestions = () => {
    const stepMap = {
      'kegiatan_1': 'kegiatan_2',
      'kegiatan_2': 'kegiatan_3', 
      'kegiatan_3': 'kegiatan_4',
      'kegiatan_4': 'kegiatan_5',
      'kegiatan_5': 'kegiatan_6',
      'kegiatan_6': 'kegiatan_7',
      'kegiatan_7': 'completion',
      'pertanyaan_1': 'kegiatan_2',
      'pertanyaan_2': 'kegiatan_3',
      'pertanyaan_3': 'kegiatan_4',
      'pertanyaan_4': 'kegiatan_5',
      'mari_merancang': 'kegiatan_6',
      'ayo_berkreasi': 'kegiatan_7'
    };
    
    return stepMap[currentStep];
  };

  // Fungsi untuk memulai sesi pertanyaan reflektif
  const startReflectiveQuestions = () => {
    if (reflectiveQuestions.length === 0) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "Maaf, pertanyaan reflektif belum tersedia saat ini.",
        data: {
          id: 'pertanyaan_reflektif',
          next_keywords: []
        }
      }]);
      return;
    }
    
    setCurrentReflectiveQuestion(0);
    setMessages(prev => [...prev, { 
      from: 'bot', 
      text: `Mari kita mulai sesi pertanyaan reflektif!\n\nPertanyaan 1: ${reflectiveQuestions[0]}\n\nSilahkan ketik jawaban Anda:`,
      data: {
        id: 'pertanyaan_reflektif',
        next_keywords: []
      }
    }]);
    setWaitingForAnswer('reflective_0');
  };

  // Fungsi untuk memproses pertanyaan reflektif
  const processReflectiveAnswer = async (input) => {
    if (!input.trim()) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "Jawaban tidak boleh kosong. Silakan ketik jawaban Anda untuk melanjutkan:",
        data: {
          id: 'pertanyaan_reflektif',
          next_keywords: []
        }
      }]);
      return;
    }

    const currentQuestionIndex = currentReflectiveQuestion;
    const question = reflectiveQuestions[currentQuestionIndex];
    
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    
    try {
      const result = await saveAnswerToDatabase(
        { id: `reflective_${currentQuestionIndex}`, text: question, storage_key: `reflective_${currentQuestionIndex}` }, 
        input, 
        'reflective'
      );
    } catch (error) {
      console.error('Error saving reflective answer:', error);
    }
    
    if (currentQuestionIndex < reflectiveQuestions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentReflectiveQuestion(nextQuestionIndex);
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: `Terima kasih! Jawaban Anda telah dicatat.\n\nPertanyaan ${nextQuestionIndex + 1}: ${reflectiveQuestions[nextQuestionIndex]}\n\nSilakan ketik jawaban Anda:`,
        data: {
          id: 'pertanyaan_reflektif',
          next_keywords: []
        }
      }]);
      setWaitingForAnswer(`reflective_${nextQuestionIndex}`);
    } else {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "Terima kasih! Anda telah menyelesaikan semua pertanyaan reflektif. Jawaban Anda telah disimpan untuk refleksi pembelajaran.\n\nSilakan pilih opsi berikut untuk melanjutkan:",
        data: {
          id: 'pertanyaan_reflektif',
          next_keywords: ["Eksplorasi Selesai", "menu sebelumnya"]
        }
      }]);
      setWaitingForAnswer(null);
    }
    
    scrollChat();
  };

  // Fungsi untuk navigasi otomatis ke kegiatan berikutnya
  const navigateToNextActivity = () => {
    const nextStep = getNextStepAfterQuestions();
    if (nextStep) {
      const nextKegiatan = kegiatanList.find(k => k.stepKey === nextStep);
      if (nextKegiatan) {
        navigate(`/ecombot${nextKegiatan.path}`);
        setCurrentStep(nextStep);
        markAsVisited(nextStep);
        completeActivity(nextStep);
        
        const kegiatanData = getStepData(nextStep);
        if (kegiatanData) {
          setMessages(prev => [...prev, { 
            from: 'bot', 
            text: kegiatanData.message,
            data: kegiatanData
          }]);
        }
      }
    }
  };

  // Fungsi untuk memproses teks dengan formatting
  const processMessageText = (text) => {
    if (!text) return '';
    
    if (text.includes('<') && text.includes('>')) {
      return text;
    }
    
    let processedText = text;
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processedText = processedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    processedText = processedText.replace(/\n/g, '<br />');
    
    return processedText;
  };

  // Fungsi untuk render teks dengan atau tanpa HTML
  const renderMessageText = (text) => {
    const processedText = processMessageText(text);
    
    if (processedText.includes('<') && processedText.includes('>')) {
      return (
        <div 
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: processedText }}
        />
      );
    }
    
    return (
      <div className="whitespace-pre-line">
        {text}
      </div>
    );
  };

  // Fungsi untuk memperbaiki path gambar
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('assets/')) {
      return `/${imagePath}`;
    }
    
    return `/${imagePath}`;
  };

  // Fungsi untuk memproses multiple images
  const processImages = (imagesData) => {
    if (!imagesData) return [];
    
    if (typeof imagesData === 'string') {
      return [{
        url: getImageUrl(imagesData),
        source: '',
        caption: ''
      }];
    }
    
    if (Array.isArray(imagesData)) {
      return imagesData.map(img => ({
        url: getImageUrl(img.url || img.image_url),
        source: img.source || img.image_source || '',
        caption: img.caption || ''
      }));
    }
    
    if (imagesData.url || imagesData.image_url) {
      return [{
        url: getImageUrl(imagesData.url || imagesData.image_url),
        source: imagesData.source || imagesData.image_source || '',
        caption: imagesData.caption || ''
      }];
    }
    
    return [];
  };

  // FUNGSI UTAMA: Memproses input user
  const processUserInput = async (input) => {
    if (!currentChatFlow) {
      console.error('currentChatFlow is undefined');
      return;
    }
    
    const normalizedInput = input.toLowerCase().trim();
    
    // **PRIORITAS 1: Jika sedang menunggu jawaban untuk pertanyaan**
    if (waitingForAnswer) {
      if (waitingForAnswer.startsWith('reflective_')) {
        await processReflectiveAnswer(input);
      } else if (waitingForAnswer.startsWith('question_')) {
        await processQuestionAnswer(input);
      } else {
        console.error('Unknown waitingForAnswer type:', waitingForAnswer);
      }
      
      scrollChat();
      return;
    }
    
    // **PRIORITAS 2: Cek untuk navigasi "eksplorasi selesai" - KE /ECOMIC**
    if (normalizedInput.includes('eksplorasi selesai')) {
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      setBotTyping(true);
      
      setTimeout(() => {
        setBotTyping(false);
        redirectToEcomic();
      }, 1000);
      
      return;
    }
    
    // **PRIORITAS 3: Cek untuk navigasi "menu sebelumnya"**
    const kembaliPatterns = [
      /menu sebelumnya/i,
      /kembali/i,
      /balik/i,
      /back/i,
      /sebelumnya/i,
      /previous/i,
      /keluar/i,
      /exit/i,
      /selesai/i,
      /tutup/i
    ];
    
    for (const pattern of kembaliPatterns) {
      if (pattern.test(normalizedInput)) {
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        setBotTyping(true);
        
        setTimeout(() => {
          setBotTyping(false);
          
          if (currentStep === 'forum_diskusi' && previousSteps.length > 0) {
            const previousStep = previousSteps[previousSteps.length - 1];
            const newPreviousSteps = previousSteps.slice(0, -1);
            
            setPreviousSteps(newPreviousSteps);
            setCurrentStep(previousStep);
            setIsInForum(false);
            
            handleStepNavigation(previousStep);
            
            const stepData = getStepData(previousStep);
            if (stepData) {
              setMessages(prev => [...prev, { 
                from: 'bot', 
                text: `Anda kembali ke kegiatan sebelumnya.\n\n${stepData.message}`,
                data: stepData
              }]);
            }
          } 
          else if (previousSteps.length > 1) {
            const previousStep = previousSteps[previousSteps.length - 2];
            const newPreviousSteps = previousSteps.slice(0, -1);
            
            setPreviousSteps(newPreviousSteps);
            setCurrentStep(previousStep);
            
            handleStepNavigation(previousStep);
            
            const stepData = getStepData(previousStep);
            if (stepData) {
              setMessages(prev => [...prev, { 
                from: 'bot', 
                text: `Anda kembali ke langkah sebelumnya.\n\n${stepData.message}`,
                data: stepData
              }]);
            }
          } else {
            setMessages(prev => [...prev, { 
              from: 'bot', 
              text: "Maaf, tidak ada langkah sebelumnya yang dapat ditampilkan. Silakan lanjutkan eksplorasi Anda."
            }]);
          }
          
          scrollChat();
        }, 1000);
        
        return;
      }
    }
    
    // **PRIORITAS 4: Cek untuk memulai sesi pertanyaan berdasarkan keyword**
    const questionKeywords = [
      'pertanyaan 1',
      'pertanyaan 2', 
      'pertanyaan 3',
      'pertanyaan 4',
      'pertanyaan reflektif',
      'mari merancang',
      'ayo berkreasi'
    ];
    
    for (const keyword of questionKeywords) {
      if (normalizedInput.includes(keyword)) {
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        
        if (keyword === 'pertanyaan 1') {
          setCurrentStep('pertanyaan_1');
        }
        else if (keyword === 'pertanyaan 2') {
          setCurrentStep('pertanyaan_2');
        }
        else if (keyword === 'pertanyaan 3') {
          setCurrentStep('pertanyaan_3');
        }
        else if (keyword === 'pertanyaan 4') {
          setCurrentStep('pertanyaan_4');
        }
        else if (keyword === 'pertanyaan reflektif') {
          setCurrentStep('pertanyaan_reflektif');
        }
        else if (keyword === 'mari merancang') {
          setCurrentStep('mari_merancang');
        }
        else if (keyword === 'ayo berkreasi') {
          setCurrentStep('ayo_berkreasi');
        }
        
        scrollChat();
        return;
      }
    }
    
    // **PRIORITAS 5: Cek untuk tanya ecombot/forum**
    const tanyaEcombotPatterns = [
      /tanya ecombot/i,
      /tanya/i,
      /forum/i,
      /diskusi/i,
      /diskuzi/i,
      /diskus/i,
      /tanya jawab/i,
      /q&a/i,
      /bantuan/i,
      /help/i
    ];
    
    for (const pattern of tanyaEcombotPatterns) {
      if (pattern.test(normalizedInput)) {
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        
        if (currentStep === 'forum_diskusi') {
          setMessages(prev => [...prev, { 
            from: 'bot', 
            text: "Silahkan ajukan pertanyaan Anda tentang berbagai topik pembelajaran. Saya akan membantu menjawabnya menggunakan sistem AI.\n\nKetik 'menu sebelumnya' untuk kembali ke alur pembelajaran."
          }]);
        } else {
          setPreviousSteps(prev => [...prev, currentStep]);
          setCurrentStep('forum_diskusi');
          setIsInForum(true);
        }
        
        scrollChat();
        return;
      }
    }
    
    // **PRIORITAS 6: Jika di forum diskusi, proses pertanyaan dengan LangChain**
    if (currentStep === 'forum_diskusi' && !waitingForAnswer) {
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      setBotTyping(true);
      
      try {
        const answer = await processForumQuestion(input);
        
        setBotTyping(false);
        
        const formattedAnswer = `${answer}\n\n---\n*Ketik 'menu sebelumnya' untuk kembali ke alur pembelajaran.*`;
        
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: formattedAnswer,
          data: {
            id: 'forum_diskusi',
            next_keywords: ["menu sebelumnya"]
          }
        }]);
        
        await saveMessageToDatabase('user', 'User', input, 'forum_diskusi');
        await saveMessageToDatabase('bot', 'Aquano', answer, 'forum_diskusi');
        
      } catch (error) {
        console.error('Error processing forum question:', error);
        setBotTyping(false);
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: "Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.\n\nKetik 'menu sebelumnya' untuk kembali ke alur pembelajaran.",
          data: {
            id: 'forum_diskusi',
            next_keywords: ["menu sebelumnya"]
          }
        }]);
      }
      
      scrollChat();
      return;
    }
    
    // **PRIORITAS 7: Cek untuk navigasi ke kegiatan berikutnya dengan keyword "pertanyaan"**
    if (normalizedInput.includes('pertanyaan') && !normalizedInput.includes('reflektif')) {
      const allAnswered = checkAllQuestionsAnswered();
      
      if (allAnswered) {
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        setBotTyping(true);
        
        setTimeout(() => {
          setBotTyping(false);
          navigateToNextActivity();
          scrollChat();
        }, 1000);
      } else {
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: "Maaf, Anda harus menjawab semua pertanyaan terlebih dahulu sebelum dapat melanjutkan ke kegiatan berikutnya. Silakan selesaikan semua pertanyaan yang tersedia.",
          data: {
            id: currentStep,
            next_keywords: []
          }
        }]);
        scrollChat();
      }
      return;
    }
    
    // **PRIORITAS 8: Proses navigasi seperti biasa**
    const targetKegiatan = getKegiatanFromText(input);
    if (targetKegiatan) {
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      setBotTyping(true);
      
      setTimeout(async () => {
        setBotTyping(false);
        
        if (targetKegiatan.stepKey === 'forum_diskusi' || targetKegiatan.stepKey === 'completion' || targetKegiatan.stepKey === 'redirect_ecomic') {
          
          if (targetKegiatan.stepKey === 'redirect_ecomic') {
            redirectToEcomic();
            return;
          }
          
          setPreviousSteps(prev => [...prev, currentStep]);
          setCurrentStep(targetKegiatan.stepKey);
          
          const stepData = getStepData(targetKegiatan.stepKey);
          if (stepData) {
            const botMessage = { 
              from: 'bot', 
              text: stepData.message,
              data: stepData
            };
            
            setMessages(prev => [...prev, botMessage]);
            
            await saveMessageToDatabase(
              'bot', 
              stepData.character || 'Aquano', 
              stepData.message, 
              targetKegiatan.stepKey,
              botMessage.data
            );
          }
          
          if (targetKegiatan.stepKey === 'forum_diskusi') {
            setIsInForum(true);
          } else {
            setIsInForum(false);
          }
          
          scrollChat();
          return;
        }
        
        if (canAccessKegiatan(targetKegiatan.num)) {
          setPreviousSteps(prev => [...prev, currentStep]);
          
          navigate(`/ecombot${targetKegiatan.path}`);
          setCurrentStep(targetKegiatan.stepKey);
          markAsVisited(targetKegiatan.stepKey);
          
          const kegiatanData = getStepData(targetKegiatan.stepKey);
          if (kegiatanData) {
            const processedImages = processImages(kegiatanData.images || kegiatanData.image_url);
            
            const botMessage = { 
              from: 'bot', 
              text: kegiatanData.message,
              data: {
                ...kegiatanData,
                images: processedImages.length > 0 ? processedImages : undefined,
                image_url: processedImages.length === 1 ? processedImages[0].url : undefined,
                image_source: processedImages.length === 1 ? processedImages[0].source : undefined
              }
            };
            
            setMessages(prev => [...prev, botMessage]);
            
            await saveMessageToDatabase(
              'bot', 
              kegiatanData.character || 'Aquano', 
              kegiatanData.message, 
              targetKegiatan.stepKey,
              botMessage.data
            );
            
            if (targetKegiatan.num !== 0) {
              completeActivity(targetKegiatan.stepKey);
            }
          }
          
          const currentKegiatan = kegiatanList.find(k => location.pathname.includes(k.path));
          if (currentKegiatan && targetKegiatan.num > currentKegiatan.num) {
            completeActivity(currentKegiatan.stepKey);
          }
        } else {
          const previousKegiatan = kegiatanList.find(k => k.num === targetKegiatan.num - 1);
          
          let errorMessage = `Maaf, Anda belum dapat mengakses ${targetKegiatan.name}. `;
          
          if (previousKegiatan && !progress.completed.includes(previousKegiatan.stepKey)) {
            errorMessage += `Silakan selesaikan ${previousKegiatan.name} terlebih dahulu.`;
          } else {
            errorMessage += `Silakan ikuti alur kegiatan secara berurutan.`;
          }
          
          setMessages(prev => [...prev, { 
            from: 'bot', 
            text: errorMessage,
            data: {
              id: currentStep,
              next_keywords: []
            }
          }]);
        }
        
        scrollChat();
      }, 1000);
      
      return;
    }
    
    // **PRIORITAS 9: Proses dengan currentChatFlow navigation yang sudah ada**
    const currentNavigation = currentChatFlow.navigation ? currentChatFlow.navigation[currentStep] : null;
    
    if (currentNavigation) {
      for (const [keyword, nextStep] of Object.entries(currentNavigation)) {
        if (normalizedInput.includes(keyword.toLowerCase())) {
          setMessages(prev => [...prev, { from: 'user', text: input }]);
          setBotTyping(true);
          
          setTimeout(async () => {
            setBotTyping(false);
            
            if (nextStep === 'previous_step') {
              if (previousSteps.length > 0) {
                const previousStep = previousSteps[previousSteps.length - 1];
                const newPreviousSteps = previousSteps.slice(0, -1);
                
                setPreviousSteps(newPreviousSteps);
                setCurrentStep(previousStep);
                
                if (currentStep === 'forum_diskusi') {
                  setIsInForum(false);
                }
                
                handleStepNavigation(previousStep);
                
                const stepData = getStepData(previousStep);
                if (stepData) {
                  const botMessage = { 
                    from: 'bot', 
                    text: `Anda kembali ke kegiatan sebelumnya.\n\n${stepData.message}`,
                    data: stepData
                  };
                  
                  setMessages(prev => [...prev, botMessage]);
                  
                  await saveMessageToDatabase(
                    'bot', 
                    stepData.character || 'Aquano', 
                    botMessage.text, 
                    previousStep,
                    botMessage.data
                  );
                }
              }
            } else if (nextStep === 'redirect_ecomic') {
              redirectToEcomic();
            } else {
              setPreviousSteps(prev => [...prev, currentStep]);
              setCurrentStep(nextStep);
              
              const nextStepData = getStepData(nextStep);
              if (nextStepData) {
                const botMessage = { 
                  from: 'bot', 
                  text: nextStepData.message,
                  data: {
                    ...nextStepData,
                    image_url: getImageUrl(nextStepData.image_url),
                    image_source: nextStepData.image_source
                  }
                };
                
                setMessages(prev => [...prev, botMessage]);
                
                await saveMessageToDatabase(
                  'bot', 
                  nextStepData.character || 'Aquano', 
                  nextStepData.message, 
                  nextStep,
                  botMessage.data
                );
                
                if (!['intro', 'kimia_hijau', 'forum_diskusi', 'completion'].includes(nextStep)) {
                  completeActivity(nextStep);
                }
              }
              
              markAsVisited(nextStep);
              
              if (currentStep !== nextStep && !['intro', 'kimia_hijau', 'forum_diskusi', 'completion'].includes(currentStep)) {
                completeActivity(currentStep);
              }
              
              handleStepNavigation(nextStep);
            }
          }, 1000);
          
          return;
        }
      }
    }
    
    // **PRIORITAS 10: Default response**
    let defaultMessage = "Maaf, saya tidak memahami perintah tersebut. ";
    
    if (currentStep === 'forum_diskusi') {
      defaultMessage += "Silakan ajukan pertanyaan tentang pembelajaran atau ketik 'menu sebelumnya' untuk kembali ke alur pembelajaran.";
    } else {
      defaultMessage += "Silakan pilih dari opsi yang tersedia atau ketik 'tanya ecombot' untuk bertanya tentang berbagai topik pembelajaran.";
    }
    
    addChat(input, defaultMessage);
  };

  const handleStepNavigation = (step) => {
    const stepMap = {
      'intro': '/ecombot',
      'kimia_hijau': '/ecombot/kimia-hijau',
      'pre_kegiatan': '/ecombot',
      'kegiatan_1': '/ecombot/kegiatan-1',
      'kegiatan_2': '/ecombot/kegiatan-2',
      'kegiatan_3': '/ecombot/kegiatan-3',
      'kegiatan_4': '/ecombot/kegiatan-4',
      'kegiatan_5': '/ecombot/kegiatan-5',
      'kegiatan_6': '/ecombot/kegiatan-6',
      'kegiatan_7': '/ecombot/kegiatan-7',
      'completion': '/ecombot',
      'forum_diskusi': '/ecombot',
      'pertanyaan_1': '/ecombot/kegiatan-1',
      'pertanyaan_2': '/ecombot/kegiatan-2',
      'pertanyaan_3': '/ecombot/kegiatan-3',
      'pertanyaan_4': '/ecombot/kegiatan-4',
      'mari_merancang': '/ecombot/kegiatan-5',
      'ayo_berkreasi': '/ecombot/kegiatan-6',
      'pertanyaan_reflektif': '/ecombot/kegiatan-7'
    };
    
    if (stepMap[step]) {
      if (step === 'forum_diskusi') {
        navigate('/ecombot');
        setIsInForum(true);
      } else if (step === 'completion') {
        navigate('/ecombot');
        setIsInForum(false);
      } else {
        navigate(stepMap[step]);
        setIsInForum(false);
      }
    }
  };

  const addChat = async (input, product) => {
  // Simpan pesan user
  setMessages(prev => [...prev, { from: 'user', text: input }]);
  await saveMessageToDatabase('user', 'User', input, currentStep);
  
  scrollChat();

  setTimeout(() => {
    setBotTyping(true);
    scrollChat();
  }, 500);

  setTimeout(async () => {
    setBotTyping(false);
    
    // Buat objek pesan bot dengan data yang lengkap
    const botMessage = { 
      from: 'bot', 
      text: product,
      data: {
        id: currentStep,
        // Tambahkan next_keywords jika ada
        next_keywords: getStepData(currentStep)?.next_keywords || []
      }
    };
    
    setMessages(prev => [...prev, botMessage]);
    
    // Simpan pesan bot ke database
    await saveMessageToDatabase('bot', 'Aquano', product, currentStep, botMessage.data);
    
    scrollChat();
  }, 1000);
};

  const updateChat = () => {
    if (inputValue.trim()) {
      processUserInput(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') updateChat();
  };

  useEffect(() => {
    const handleQuickClick = (e) => {
      if (e.target.matches('#quick-buttons button')) {
        const text = e.target.getAttribute('data-text');
        
        setInputValue(text);
        setTimeout(() => {
          processUserInput(text);
          setInputValue('');
        }, 300);
      }
    };
    
    document.addEventListener('click', handleQuickClick);
    return () => document.removeEventListener('click', handleQuickClick);
  }, [currentChatFlow, currentStep, progress, isInForum, waitingForAnswer, previousSteps]);

  // Tentukan kegiatan mana yang aktif
  const getActiveKegiatan = () => {
    return kegiatanList.map(kegiatan => {
      const isActive = canAccessKegiatan(kegiatan.num);
      const kegiatanData = getStepData(kegiatan.stepKey);
      const imageUrl = getImageUrl(kegiatanData?.image_url);
      
      return {
        ...kegiatan,
        active: isActive,
        imageUrl: imageUrl,
        imageSource: kegiatanData?.image_source
      };
    });
  };

  const activeKegiatanList = getActiveKegiatan();

  // Fungsi navigasi halaman
  const handleKegiatanChange = async (kegiatanNum) => {
    const kegiatan = activeKegiatanList[kegiatanNum];
    if (kegiatan && kegiatan.active) {
      setPreviousSteps(prev => [...prev, currentStep]);
      
      navigate(`/ecombot${kegiatan.path}`);
      setShowKegiatan(false);
      
      const stepMap = {
        '/ecombot': 'intro',
        '/ecombot/kimia-hijau': 'kimia_hijau',
        '/ecombot/kegiatan-1': 'kegiatan_1',
        '/ecombot/kegiatan-2': 'kegiatan_2',
        '/ecombot/kegiatan-3': 'kegiatan_3',
        '/ecombot/kegiatan-4': 'kegiatan_4',
        '/ecombot/kegiatan-5': 'kegiatan_5',
        '/ecombot/kegiatan-6': 'kegiatan_6',
        '/ecombot/kegiatan-7': 'kegiatan_7'
      };
      
      const newStep = stepMap[`/ecombot${kegiatan.path}`];
      if (newStep) {
        setCurrentStep(newStep);
        const stepData = getStepData(newStep);
        if (stepData) {
          const botMessage = { 
            from: 'bot', 
            text: stepData.message,
            data: {
              ...stepData,
              image_url: getImageUrl(stepData.image_url),
              image_source: stepData.image_source
            }
          };
          
          setMessages(prev => [...prev, botMessage]);
          
          await saveMessageToDatabase(
            'bot', 
            stepData.character || 'Aquano', 
            stepData.message, 
            newStep,
            botMessage.data
          );
          
          if (kegiatan.num !== 0) {
            completeActivity(kegiatan.stepKey);
          }
        }
      }
      
      markAsVisited(kegiatan.stepKey);
      await loadActivityHistory(kegiatan.stepKey);
    }
  };

  // Context value
  const contextValue = {
    progress,
    saveAnswer,
    completeActivity,
    markAsVisited,
    currentStep,
    setCurrentStep,
    canAccessKegiatan,
    kegiatanList,
    isInForum,
    forumHistory,
    saveAnswerToDatabase,
    waitingForAnswer,
    setWaitingForAnswer,
    currentSession,
    loadActivityHistory,
    previousSteps,
    setPreviousSteps,
    isUserLoggedIn, // Export fungsi baru
    getAuthHeader, // Export fungsi baru
    clearAuthTokens // Export fungsi baru
  };

  // Tampilkan loading atau error state
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data percakapan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-lime-500 text-white rounded-lg"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="w-full h-screen fixed inset-0 bg-white">
        <div className="flex flex-col md:flex-row h-full w-full">
          {/* KIRI - Avatar (Desktop) */}
          <div className="hidden md:relative md:flex md:w-1/3 bg-white-50 flex-col bg-yellow-50">
            <div className='text-center !mt-12'>
              <p className='text-lime-500 text-lg font-semibold'>{currentTitle.materi}</p>
              <h1 className='text-3xl text-lime-500 font-bold mt-2' dangerouslySetInnerHTML={{ __html: currentTitle.title }}></h1>
            </div>
            {/* AVATAR AQUANO */}
            <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
              <div className="w-72 h-32 flex items-center justify-center">
                <img
                  src={Aquano}
                  alt="Aquano"
                  className="w-96 h-auto transition-all duration-300"
                />
              </div>
              <span className="text-lime-700 font-semibold mt-1 z-20 relative bg-white !px-3 !py-0.5 rounded-full shadow-sm border border-gray-200 text-sm">
                Ecombot
              </span>
            </div>
          </div>

          {/* ========== KANAN: HALAMAN CHAT ========== */}
          <div className="w-full md:w-2/3 flex flex-col h-full border-l border-gray-300 bg-white relative">
            {/* Tombol Menu */}
            <button
              onClick={() => setShowKegiatan(true)}
              className="absolute top-4 right-4 !bg-lime-500 !hover:bg-lime-600 text-white !p-3 rounded-full shadow-lg z-20"
            >
              <i className="mdi mdi-menu text-xl"></i>
            </button>

            {/* AREA PESAN */}
            <div className="flex-1 overflow-y-auto !p-4 !pb-48 !pt-20 !space-y-4 bg-cover bg-center bg-no-repeat bg-[url('/assets/background.png')]" id="messages">
                {messages.map((message, index) => (
                <div key={index} className={`flex items-end ${message.from === 'bot' ? '' : 'justify-end'}`}>
                    <div className={`flex flex-col !space-y-2 text-md leading-tight max-w-xs !mx-2 ${message.from === 'bot' ? 'order-2 items-start' : 'order-1 items-end'}`}>
                    
                    <div className={`!px-4 !py-3 rounded-xl inline-block ${
                        message.from === 'bot'
                        ? 'rounded-bl-none bg-white text-gray-700 border border-gray-200 shadow-sm'
                        : 'rounded-br-none bg-lime-500 text-white'
                    } max-w-xs`}>
                        {message.data?.title && (
                          <h3 className="font-bold text-lime-700 text-lg" dangerouslySetInnerHTML={{__html: message.data.title}} />
                        )}
                        {renderMessageText(message.data?.message_html || message.text)}
                        
                        {message.data?.images && message.data.images.length > 0 && (
                        <div className="!my-2 !space-y-3">
                            {message.data.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="w-full">
                                <img 
                                src={image.url} 
                                alt={image.caption || "Ilustrasi kegiatan"}
                                className="w-full max-w-xs h-auto rounded-lg shadow-md border border-gray-200"
                                onError={(e) => {
                                    console.error('Gambar gagal dimuat:', image.url);
                                    e.target.style.display = 'none';
                                }}
                                />
                                {(image.caption || image.source) && (
                                <div className="text-xs text-gray-500 !mt-1 text-center">
                                    {image.caption && (
                                    <p className="font-medium">{image.caption}</p>
                                    )}
                                    {image.source && (
                                    <p>Sumber: <i>
                                        {image.source}
                                      </i>
                                    </p>
                                    )}
                                </div>
                                )}
                            </div>
                            ))}
                        </div>
                        )}
                        
                        {(!message.data?.images || message.data.images.length === 0) && 
                        message.data?.image_url && (
                        <div className="!my-2 w-full">
                            <img 
                            src={getImageUrl(message.data.image_url)} 
                            alt="Ilustrasi kegiatan"
                            className="w-full max-w-xs h-auto rounded-lg shadow-md border border-gray-200"
                            onError={(e) => {
                                console.error('Gambar gagal dimuat:', message.data.image_url);
                                e.target.style.display = 'none';
                            }}
                            />
                            {message.data?.image_source && (
                            <p className="text-xs text-gray-500 mt-1 text-center">
                                Sumber: 
                                <i>
                                  {message.data.image_source}
                                </i>
                            </p>
                            )}
                        </div>
                        )}
                        
                        {message.data?.source && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 italic">
                            {message.data.source}
                            </p>
                        </div>
                        )}
                    </div>
                    
                    {message.from === 'bot' && message.data?.next_keywords && !waitingForAnswer && (
                        <div 
                        id="quick-buttons" 
                        className="flex flex-wrap gap-2 mt-3"
                        dangerouslySetInnerHTML={{ 
                            __html: getQuickButtons(message.data.id, message.text) 
                        }}
                        />
                    )}
                    </div>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      message.from === 'bot' 
                        ? 'order-1 bg-yellow-200' 
                        : 'order-2 bg-lime-200'
                    }`}
                  >
                    {message.from === 'bot' ? (
                      <img
                        src={Head}
                        alt="Aquano Head"
                        className="w-32 md:w-80 sm:w-48 h-auto transition-all duration-300"
                      />
                    ) : (
                      <img
                        src={User}
                        alt="User"
                        className="w-32 md:w-80 sm:w-48 h-auto transition-all duration-300"
                      />
                    )}
                  </div>
                </div>
              ))}
              {botTyping && (
                <div className="flex items-end">
                  <div className="flex flex-col mx-2 order-2 items-start">
                    <div className="bg-white px-4 py-3 rounded-xl rounded-bl-none border border-gray-200 shadow-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Container - Mobile */}
            <div className="md:hidden absolute w-screen !bottom-0 !px-4 !pt-4 !pb-16 z-20">
              <div className="relative flex">
                <input 
                  type="text" 
                  placeholder={
                    waitingForAnswer ? 
                    "Ketik jawaban Anda di sini..." : 
                    (isInForum ? 
                      "Ajukan pertanyaan tentang berbagai topik pembelajaran..." : 
                      "Ketikan sesuatu...")
                  } 
                  autoComplete="off" 
                  autoFocus={true}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 !pl-5 !pr-16 bg-white border-2 border-gray-200 focus:border-lime-500 rounded-full !py-3"
                />
                <div className="absolute right-2 inset-y-0 flex items-center">
                  <button 
                    type="button" 
                    onClick={updateChat}
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 text-white !bg-lime-500 hover:!bg-lime-600 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none"
                  >
                    <i className="mdi mdi-arrow-right text-xl leading-none"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Avatar Mobile */}
            <div className="md:hidden relative z-10 flex flex-col items-center bottom-30 ">
              <div className="w-48 h-12 flex items-center justify-center">
                <img
                  src={Aquano}
                  alt="Aquano"
                  className="w-36 h-auto"
                />
              </div>
              <span className="text-lime-700 font-semibold !mt-4 z-20 relative bg-white !px-3 !py-0.5 rounded-full shadow-sm border border-gray-200 text-xs">
                Ecombot
              </span>
            </div>

            {/* Input Container - Desktop */}
            <div className="hidden md:block px-4 pt-4 pb-4 bg-yellow-50">
              <div className="relative flex">
                <input 
                  type="text" 
                  placeholder={
                    waitingForAnswer ? 
                    "Ketik jawaban Anda di sini..." : 
                    (isInForum ? 
                      "Ajukan pertanyaan tentang berbagai topik pembelajaran..." : 
                      "Ketikan sesuatu...")
                  } 
                  autoComplete="off" 
                  autoFocus={true}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 !pl-5 !pr-16 bg-yellow-50 focus:border-lime-500 rounded-full !py-3"
                />
                <div className="absolute right-2 inset-y-0 flex items-center">
                  <button 
                    type="button" 
                    onClick={updateChat}
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 text-white !bg-lime-500 hover:!bg-lime-600 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none"
                  >
                    <i className="mdi mdi-arrow-right text-xl leading-none"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* PANEL KEGIATAN*/}
            {showKegiatan && (
              <div className="absolute top-0 right-0 h-full w-80 bg-yellow-50 border-l-2 border-gray-200 shadow-2xl z-30 animate-slide-in overflow-y-auto">
                <div className="flex flex-col !p-4 border-b border-gray-200 items-center gap-2">
                  <button
                    onClick={() => setShowKegiatan(false)}
                    className="flex items-center justify-center gap-2 !bg-lime-500 !hover:bg-lime-600 text-white !px-4 !py-1.5 !mb-4 rounded-full text-sm shadow-md"
                  >
                    <span>Kembali</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <h2 className="text-4xl font-bold text-lime-700 text-center">Daftar Eksplorasi</h2>
                  
                </div>
                <div className="!p-4 flex flex-col gap-4">
                  {activeKegiatanList.map((kegiatan) => (
                    <button 
                      key={kegiatan.num}
                      onClick={() => handleKegiatanChange(kegiatan.num)}
                      className={`!p-3 rounded-lg font-medium transition-all duration-200 text-left ${
                        kegiatan.active 
                          ? location.pathname.includes(kegiatan.path)
                            ? '!bg-lime-600 text-white'
                            : '!bg-lime-500 text-white hover:!bg-lime-600'
                          : '!bg-white text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs">{kegiatan.materi}</p>
                          <p className="font-semibold" dangerouslySetInnerHTML={{__html: kegiatan.name}} />
                        </div>
                        {progress.completed.includes(kegiatan.stepKey) && (
                          <span className="!ml-2 text-xs bg-white text-lime-600 rounded-full text-center !px-2 !py-1">✓ Selesai</span>
                        )}
                      </div>
                      {kegiatan.imageUrl && (
                        <div className="!mt-2">
                          <img 
                            src={kegiatan.imageUrl} 
                            alt={kegiatan.name}
                            className="w-full h-24 object-cover rounded-md border border-gray-200"
                            onError={(e) => {
                              console.error('Gambar gagal dimuat:', kegiatan.imageUrl);
                              e.target.style.display = 'none';
                            }}
                          />
                          {kegiatan.imageSource && (
                            <p className="text-xs text-gray-200 !mt-1 text-center">
                              Sumber: 
                              <i>
                                {kegiatan.imageSource}
                              </i>
                            </p>
                          )}
                        </div>
                      )}
                      {!kegiatan.active && (
                        <p className="text-xs mt-1 italic">
                          Selesaikan eksplorasi sebelumnya untuk mengakses
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Routes>
          <Route path="/ecombot" element={<div className="hidden"></div>} />
          <Route path="/ecombot/kimia-hijau" element={<KimiaHijau />} />
          <Route path="/ecombot/kegiatan-1" element={<Kegiatan1 />} />
          <Route path="/ecombot/kegiatan-2" element={<Kegiatan2 />} />
          <Route path="/ecombot/kegiatan-3" element={<Kegiatan3 />} />
          <Route path="/ecombot/kegiatan-4" element={<Kegiatan4 />} />
          <Route path="/ecombot/kegiatan-5" element={<Kegiatan5 />} />
          <Route path="/ecombot/kegiatan-6" element={<Kegiatan6 />} />
          <Route path="/ecombot/kegiatan-7" element={<Kegiatan7 />} />
        </Routes>

         <style>
          {`
            @import url('https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css');
            #messages::-webkit-scrollbar { width: 6px; }
            #messages::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
            #messages::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }

            #quick-buttons button {
              background-color: white !important;
              color: #374151 !important;
              border: 1px solid #e5e7eb !important;
              border-radius: 12px !important;
              padding: 0.5rem 1rem !important;
              font-size: 1.6 rem !important;
              font-weight: 500 !important;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              transition: all 0.2s ease-in-out;
            }

            #quick-buttons button:hover {
              background-color: #f7fee7 !important;
              color: #65a30d !important;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
            }

            @keyframes slide-in {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
            .animate-slide-in {
              animation: slide-in 0.3s ease-out forwards;
            }
          `}
        </style>
      </div>
    </AppContext.Provider>
  );
};

export default EcombotChat;