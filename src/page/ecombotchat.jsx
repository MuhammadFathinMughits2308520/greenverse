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
  const params = useParams(); // expects route like /comics/:comic/:episode/ecombot (optional)
  // try params.comic or params.comic_slug or fallback later
  const comicParam = params.comic || params.comic_slug || params.comicSlug || null;
  const episodeParam = params.episode || params.episode_slug || params.episodeSlug || null;

  // determine comic/episode slugs (fallback to sensible defaults or localStorage)
  const comicSlug = comicParam || localStorage.getItem("last_comic_slug") || "my-comic";
  const episodeSlug = episodeParam || localStorage.getItem("last_episode_slug") || "e_001";

  // determine currentPage from localStorage (saved by ComicReader)
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
  const [previousSteps, setPreviousSteps] = useState(['intro']);
  
  // State untuk progres kegiatan dan jawaban
  const [progress, setProgress] = useState({
    completed: ['intro'],
    current: 'intro',
    answers: {},
    visited: ['intro']
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

  // Fungsi untuk mendapatkan judul berdasarkan lokasi saat ini - DIPERBAIKI
const getCurrentTitle = () => {
  // Cek path lengkap termasuk /ecombot
  const fullPath = location.pathname;
  console.log('Current path:', fullPath);
  
  // Cari kegiatan yang sesuai dengan path lengkap
  const currentKegiatan = kegiatanList.find(kegiatan => 
    `/ecombot${kegiatan.path}` === fullPath || kegiatan.path === fullPath
  );
  
  if (currentKegiatan) {
    console.log('Found kegiatan:', currentKegiatan);
    return {
      materi: currentKegiatan.materi,
      title: currentKegiatan.name
    };
  }
  
  // Handle route khusus
  if (fullPath === '/ecombot' || fullPath === '/ecombot/') {
    return {
      materi: 'Pengenalan',
      title: 'Kimia Hijau'
    };
  }
  
  // Fallback untuk path yang tidak dikenali
  console.log('No matching kegiatan found for path:', fullPath);
  return {
    materi: 'Eksplorasi',
    title: 'Kimia Hijau'
  };
};

  const currentTitle = getCurrentTitle();

  // Initialize chat session dan load history
  useEffect(() => {
    const initializeChat = async () => {
      if (currentChatFlow && messages.length === 0) {
        // Start new session atau load existing session
        await startOrLoadSession();
        
        // Load pertanyaan reflektif
        loadReflectiveQuestions();
      }
    };
    
    initializeChat();
  }, [currentChatFlow, messages.length]);

  // Effect untuk auto-start question session ketika currentStep berubah ke step yang memiliki pertanyaan
  useEffect(() => {
    console.log('=== CHECKING FOR QUESTION SESSION ===');
    console.log('Current step:', currentStep);
    
    // Cek apakah step saat ini memiliki pertanyaan
    const stepData = getStepData(currentStep);
    if (stepData) {
      const hasQuestions = (stepData.questions && Array.isArray(stepData.questions) && stepData.questions.length > 0) || 
                          stepData.question;
      
      if (hasQuestions) {
        console.log('Step has questions, starting question session:', currentStep);
        startQuestionSession();
      } else {
        console.log('Step has no questions:', currentStep);
      }
    }
  }, [currentStep, currentChatFlow]);

  // Debug useEffect untuk memantau perubahan state
  useEffect(() => {
    console.log('=== STATE UPDATE ===');
    console.log('Current step:', currentStep);
    console.log('Previous steps:', previousSteps);
    console.log('Waiting for answer:', waitingForAnswer);
    console.log('Current questions:', currentQuestions.length);
    console.log('Current question index:', currentQuestionIndex);
  }, [currentStep, previousSteps, waitingForAnswer, currentQuestions, currentQuestionIndex]);

  // Fungsi untuk memulai atau memuat sesi chat
  const startOrLoadSession = async () => {
    try {
      // Cek apakah user sudah login
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('User not logged in, using local session only');
        // Gunakan fallback untuk user tidak login
        const introMessage = getStepData('intro');
        setMessages([{ 
          from: 'bot', 
          text: introMessage.message,
          data: introMessage
        }]);
        
        const savedProgress = localStorage.getItem('chatbot-progress');
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          if (!parsedProgress.visited) {
            parsedProgress.visited = ['intro'];
          }
          setProgress(parsedProgress);
        }
        return;
      }

      // Jika user sudah login, coba load atau buat session
      const sessionId = localStorage.getItem('current_session_id') || `session_${Date.now()}`;
      
      const response = await fetch('http://localhost:8000/api/chat/session/start/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: sessionId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSession(data.session_id);
        localStorage.setItem('current_session_id', data.session_id);
        
        // Load chat history untuk activity saat ini
        await loadActivityHistory(data.current_activity);
        
      } else {
        throw new Error('Failed to start session');
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
    }
  };

  // Fungsi untuk memuat history activity
  const loadActivityHistory = async (activityId) => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('current_session_id');
      
      if (!token || !sessionId) return;

      const response = await fetch(`http://localhost:8000/api/chat/session/${sessionId}/activity/${activityId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Reconstruct messages from history
        const historyMessages = [];
        
        // Add bot messages
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
        
        // Load progress
        const progressResponse = await fetch(`http://localhost:8000/api/chat/session/${sessionId}/overview/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          // Update local progress state based on server data
          updateProgressFromServer(progressData.overview);
        }
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
        // Jika tidak ada reflective_questions, gunakan fallback
        useFallbackReflectiveQuestions();
      }
    } catch (error) {
      console.error('Error loading reflective questions:', error);
      // Gunakan fallback questions
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

  // Save progress ke localStorage (fallback)
  useEffect(() => {
    localStorage.setItem('chatbot-progress', JSON.stringify(progress));
  }, [progress]);

  // Effect untuk mengatur status forum
  useEffect(() => {
    const inForum = currentStep === 'forum_diskusi';
    setIsInForum(inForum);
    
    // Jika baru masuk forum, tampilkan pesan selamat datang
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

  // Fungsi untuk menyimpan pesan ke database
  const saveMessageToDatabase = async (messageType, character, messageText, stepId, messageData = {}) => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('current_session_id');
      
      if (!token || !sessionId) return null;

      const response = await fetch('http://localhost:8000/api/chat/session/send/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      }
    } catch (error) {
      console.error('Error saving message to database:', error);
    }
    return null;
  };

  // Fungsi untuk menyimpan jawaban ke database
  const saveAnswerToDatabase = async (questionData, answer, answerType = 'essay') => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('current_session_id');
      
      if (!token || !sessionId) {
        // Fallback: save to localStorage
        const savedAnswers = JSON.parse(localStorage.getItem('user_answers') || '[]');
        savedAnswers.push({
          question: questionData.text,
          answer,
          aspect: getAspectFromStep(currentStep),
          kegiatan: currentStep,
          question_id: questionData.id,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('user_answers', JSON.stringify(savedAnswers));
        return { status: 'saved_locally' };
      }

      const response = await fetch('http://localhost:8000/api/chat/answer/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
        return data;
      } else {
        throw new Error('Failed to save answer to database');
      }
    } catch (error) {
      console.error('Error saving answer to database:', error);
      // Fallback to localStorage
      const savedAnswers = JSON.parse(localStorage.getItem('user_answers') || '[]');
      savedAnswers.push({
        question: questionData.text,
        answer,
        aspect: getAspectFromStep(currentStep),
        kegiatan: currentStep,
        question_id: questionData.id,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('user_answers', JSON.stringify(savedAnswers));
      return { status: 'saved_locally' };
    }
  };

  // Fungsi untuk mendapatkan pertanyaan dari currentChatFlow berdasarkan kegiatan
  const getQuestionsForCurrentStep = () => {
    const stepData = getStepData(currentStep);
    if (!stepData) {
      console.log('No data for currentStep:', currentStep);
      return [];
    }
    
    console.log('Current step data:', stepData);
    
    const questions = [];
    
    // Cek apakah ada multiple questions (format array)
    if (stepData.questions && Array.isArray(stepData.questions)) {
      console.log('Found multiple questions:', stepData.questions);
      stepData.questions.forEach(question => {
        questions.push({
          ...question,
          aspect: getAspectFromStep(currentStep)
        });
      });
    }
    
    // Cek apakah ada pertanyaan tunggal (format object)
    else if (stepData.question) {
      console.log('Found single question:', stepData.question);
      questions.push({
        ...stepData.question,
        aspect: getAspectFromStep(currentStep)
      });
    }
    
    console.log(`Total questions for ${currentStep}: ${questions.length}`, questions);
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

  // Fungsi untuk mendapatkan quick buttons - DIPERBAIKI: TIDAK TAMPIL SAAT PERTANYAAN
  const getQuickButtons = (stepKey, messageText = '') => {
    // JIKA SEDANG DALAM SESI PERTANYAAN, JANGAN TAMPILKAN QUICK BUTTONS
    if (waitingForAnswer) {
      console.log('Not showing quick buttons - waiting for answer:', waitingForAnswer);
      return null;
    }
    
    const step = getStepData(stepKey);
    if (!step || !step.next_keywords) return null;
    
    console.log('Getting quick buttons for step:', stepKey, 'Keywords:', step.next_keywords);
    
    // Filter untuk menghilangkan duplikasi dan urutkan
    const uniqueKeywords = [...new Set(step.next_keywords)];
    
    // KHUSUS UNTUK FORUM: Hanya tampilkan "menu sebelumnya"
    if (stepKey === 'forum_diskusi') {
      return uniqueKeywords
        .filter(keyword => keyword.toLowerCase().includes('menu sebelumnya'))
        .map(keyword => {
          const buttonClass = "px-4 py-2 bg-lime-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:bg-lime-600 border border-lime-600 transition-all duration-200";
          return `<button class="${buttonClass}" data-text="${keyword}">${keyword}</button>`;
        })
        .join('');
    }
    
    return uniqueKeywords.map(keyword => {
      // Berikan styling yang berbeda untuk tombol pertanyaan
      const isQuestionButton = keyword.toLowerCase().includes('pertanyaan') || 
                              keyword.toLowerCase().includes('merancang') || 
                              keyword.toLowerCase().includes('kreasi');
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

  // Fungsi untuk menandai kegiatan sebagai selesai
  const completeActivity = async (activityId) => {
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

    // Simpan ke database jika user login
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('current_session_id');
      
      if (token && sessionId) {
        await fetch('http://localhost:8000/api/chat/activity/complete/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            session_id: sessionId,
            activity_id: activityId
          })
        });
      }
    } catch (error) {
      console.error('Error completing activity in database:', error);
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
    
    // Jika tidak ada pertanyaan, langsung return true
    if (questions.length === 0) return true;
    
    // Periksa apakah semua pertanyaan telah dijawab
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
    
    // Deteksi tanya ecombot - PRIORITAS TINGGI
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
    
    // Deteksi eksplorasi selesai - PRIORITAS BARU
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
        // Kembali ke langkah sebelumnya dari history
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
      console.log('Processing forum question with LangChain:', question);
      
      const response = await fetch('http://localhost:8000/api/ask/', {
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
        return "Maaf, tidak dapat terhubung ke server forum. Pastikan backend Django sedang berjalan di http://localhost:8000";
      } else if (error.message.includes('500')) {
        return "Maaf, server mengalami masalah internal. Silakan coba lagi nati.";
      } else {
        return "Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi atau ketik 'menu sebelumnya' untuk kembali ke alur pembelajaran.";
      }
    }
  };

  // FUNGSI BARU: Redirect ke /ecomic
  const redirectToEcomic = async () => {
    const currentPage = Number(localStorage.getItem(storageKey) ?? 0);
    const token = localStorage.getItem("access");
    console.debug("handleMarkFinish called", { comic: comicSlug, episode: episodeSlug, currentPage, tokenPresent: !!token });

    try {
      const result = await markFinishApi(comicSlug, episodeSlug, currentPage, { complete: true });
      console.log("markFinish result:", result);
      if (result.finish) {
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: "🎉 Selamat! Anda telah menyelesaikan seluruh eksplorasi. Mengarahkan Anda ke halaman ecomic..."
        }]);
        setPermission(p => ({ ...p, finish: true, last_page: Math.max(p.last_page ?? 0, currentPage) }));
        setTimeout(() => navigate('/ecomic'), 3000);
      } else {
        alert(result.message || "Gagal menandai selesai");
      }
    } catch (err) {
      console.error("markFinishApi error:", err);
      if (err.status === 401) {
        // token invalid / user harus login ulang
        navigate('/login');
      }
    }
  }

  // Fungsi untuk memulai sesi pertanyaan - DIPERBAIKI: TANPA QUICK BUTTONS
  const startQuestionSession = () => {
    console.log('=== STARTING QUESTION SESSION ===');
    console.log('Current step:', currentStep);
    
    const questions = getQuestionsForCurrentStep();
    
    console.log('Questions found:', questions);
    
    if (questions.length === 0) {
      console.warn('No questions found for step:', currentStep);
      console.log('Available data:', getStepData(currentStep));
      
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "Tidak ada pertanyaan untuk kegiatan ini."
      }]);
      return;
    }
    
    setCurrentQuestions(questions);
    setCurrentQuestionIndex(0);
    
    // Tampilkan pertanyaan pertama
    const firstQuestion = questions[0];
    console.log('Displaying first question:', firstQuestion);
    
    setMessages(prev => [...prev, { 
      from: 'bot', 
      text: `📝 **Pertanyaan:**\n\n${firstQuestion.text}\n\nSilakan ketik jawaban Anda:`,
      data: {}
    }]);
    
    // SET WAITING FOR ANSWER STATE
    setWaitingForAnswer('question_0');
    console.log('Set waitingForAnswer to: question_0');
    
    scrollChat();
  };

  // Fungsi untuk memproses jawaban pertanyaan - DIPERBAIKI: TANPA QUICK BUTTONS SELAMA PERTANYAAN
  const processQuestionAnswer = async (input) => {
    // Validasi: jika jawaban kosong, beri peringatan
    if (!input.trim()) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "❌ Jawaban tidak boleh kosong. Silakan ketik jawaban Anda untuk melanjutkan:",
        data: {
          id: currentStep,
          next_keywords: [] // TIDAK ADA QUICK BUTTONS
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
    
    console.log('Processing answer for question:', currentQuestion, 'Answer:', input);
    
    // Simpan jawaban user ke state
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    
    // Simpan jawaban ke database
    try {
      const result = await saveAnswerToDatabase(currentQuestion, input, currentQuestion.type || 'essay');
      console.log('Answer saved:', result);
      
      // Simpan juga di state lokal
      saveAnswer(currentQuestion.storage_key, input);
      
      // Cek apakah masih ada pertanyaan berikutnya
      if (currentIndex < currentQuestions.length - 1) {
        const nextIndex = currentIndex + 1;
        const nextQuestion = currentQuestions[nextIndex];
        
        setCurrentQuestionIndex(nextIndex);
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: `✅ Terima kasih! Jawaban Anda telah disimpan.\n\n📝 **Pertanyaan berikutnya:**\n\n${nextQuestion.text}\n\nSilakan ketik jawaban Anda:`,
          data: {}
        }]);
        
        // SET WAITING FOR ANSWER UNTUK PERTANYAAN BERIKUTNYA
        setWaitingForAnswer(`question_${nextIndex}`);
        console.log('Set waitingForAnswer to next question:', `question_${nextIndex}`);
        
      } else {
        // Selesai semua pertanyaan - tampilkan pesan konfirmasi dan pilihan navigasi
        console.log('All questions completed for step:', currentStep);
        
        let nextKeywords = [];
        const stepData = getStepData(currentStep);
        
        if (stepData && stepData.next_keywords) {
          nextKeywords = [...stepData.next_keywords];
        } else {
          // Fallback navigation berdasarkan step
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
        
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: "🎉 **Terima kasih!**\nAnda telah menyelesaikan semua pertanyaan untuk kegiatan ini. Jawaban Anda telah disimpan.\n\nSilakan pilih opsi berikut untuk melanjutkan:",
          data: {
            id: currentStep,
            next_keywords: nextKeywords // HANYA TAMPILKAN QUICK BUTTONS DI SINI
          }
        }]);
        
        // RESET STATE PERTANYAAN - PENTING!
        setWaitingForAnswer(null);
        setCurrentQuestions([]);
        setCurrentQuestionIndex(0);
        console.log('Reset question state - waitingForAnswer set to null');
        
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
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "⚠️ Jawaban Anda telah dicatat secara lokal. Terima kasih!",
        data: {
          id: currentStep,
          next_keywords: [] // TIDAK ADA QUICK BUTTONS PADA ERROR
        }
      }]);
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

  // Fungsi untuk memulai sesi pertanyaan reflektif - DIPERBAIKI: TANPA QUICK BUTTONS
  const startReflectiveQuestions = () => {
    if (reflectiveQuestions.length === 0) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "Maaf, pertanyaan reflektif belum tersedia saat ini.",
        data: {
          id: 'pertanyaan_reflektif',
          next_keywords: [] // TIDAK ADA QUICK BUTTONS
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
        next_keywords: [] // TIDAK ADA QUICK BUTTONS SELAMA PERTANYAAN
      }
    }]);
    setWaitingForAnswer('reflective_0');
  };

  // Fungsi untuk memproses pertanyaan reflektif - DIPERBAIKI: TANPA QUICK BUTTONS SELAMA PERTANYAAN
  const processReflectiveAnswer = async (input) => {
    // Validasi: jika jawaban kosong, beri peringatan
    if (!input.trim()) {
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "Jawaban tidak boleh kosong. Silakan ketik jawaban Anda untuk melanjutkan:",
        data: {
          id: 'pertanyaan_reflektif',
          next_keywords: [] // TIDAK ADA QUICK BUTTONS
        }
      }]);
      return;
    }

    const currentQuestionIndex = currentReflectiveQuestion;
    const question = reflectiveQuestions[currentQuestionIndex];
    
    // Simpan jawaban user ke state
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    
    // Simpan jawaban reflektif
    try {
      const result = await saveAnswerToDatabase(
        { id: `reflective_${currentQuestionIndex}`, text: question, storage_key: `reflective_${currentQuestionIndex}` }, 
        input, 
        'reflective'
      );
      console.log('Reflective answer saved:', result);
    } catch (error) {
      console.error('Error saving reflective answer:', error);
    }
    
    // Cek apakah masih ada pertanyaan berikutnya
    if (currentQuestionIndex < reflectiveQuestions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentReflectiveQuestion(nextQuestionIndex);
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: `Terima kasih! Jawaban Anda telah dicatat.\n\nPertanyaan ${nextQuestionIndex + 1}: ${reflectiveQuestions[nextQuestionIndex]}\n\nSilakan ketik jawaban Anda:`,
        data: {
          id: 'pertanyaan_reflektif',
          next_keywords: [] // TIDAK ADA QUICK BUTTONS SELAMA PERTANYAAN
        }
      }]);
      setWaitingForAnswer(`reflective_${nextQuestionIndex}`);
    } else {
      // Selesai semua pertanyaan reflektif - TAMPILKAN QUICK BUTTONS DI SINI
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: "Terima kasih! Anda telah menyelesaikan semua pertanyaan reflektif. Jawaban Anda telah disimpan untuk refleksi pembelajaran.\n\nSilakan pilih opsi berikut untuk melanjutkan:",
        data: {
          id: 'pertanyaan_reflektif',
          next_keywords: ["Eksplorasi Selesai", "menu sebelumnya"] // HANYA DI SINI QUICK BUTTONS TAMPIL
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
    
    // Jika teks mengandung HTML tags, gunakan dangerouslySetInnerHTML nanti
    if (text.includes('<') && text.includes('>')) {
      return text;
    }
    
    // Process simple markdown-like syntax
    let processedText = text;
    
    // Convert **text** to <strong>text</strong>
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *text* to <em>text</em>
    processedText = processedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert \n to <br />
    processedText = processedText.replace(/\n/g, '<br />');
    
    return processedText;
  };

  // Fungsi untuk render teks dengan atau tanpa HTML
  const renderMessageText = (text) => {
    const processedText = processMessageText(text);
    
    // Jika mengandung HTML tags, render dengan dangerouslySetInnerHTML
    if (processedText.includes('<') && processedText.includes('>')) {
      return (
        <div 
          className="whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: processedText }}
        />
      );
    }
    
    // Jika plain text, render biasa
    return (
      <div className="whitespace-pre-line">
        {text}
      </div>
    );
  };

  // Fungsi untuk memperbaiki path gambar
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Jika path sudah absolute atau dari public folder
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    // Jika path relatif dari assets di public folder
    if (imagePath.startsWith('assets/')) {
      return `/${imagePath}`;
    }
    
    // Default: anggap dari public folder
    return `/${imagePath}`;
  };

  // Fungsi untuk memproses multiple images
  const processImages = (imagesData) => {
    if (!imagesData) return [];
    
    // Handle legacy single image format
    if (typeof imagesData === 'string') {
      return [{
        url: getImageUrl(imagesData),
        source: '',
        caption: ''
      }];
    }
    
    // Handle array of images
    if (Array.isArray(imagesData)) {
      return imagesData.map(img => ({
        url: getImageUrl(img.url || img.image_url),
        source: img.source || img.image_source || '',
        caption: img.caption || ''
      }));
    }
    
    // Handle object with url/source
    if (imagesData.url || imagesData.image_url) {
      return [{
        url: getImageUrl(imagesData.url || imagesData.image_url),
        source: imagesData.source || imagesData.image_source || '',
        caption: imagesData.caption || ''
      }];
    }
    
    return [];
  };

  // FUNGSI UTAMA: Memproses input user - DIPERBAIKI UNTUK FORUM DAN MENU SEBELUMNYA
  const processUserInput = async (input) => {
    if (!currentChatFlow) {
      console.error('currentChatFlow is undefined');
      return;
    }
    
    const normalizedInput = input.toLowerCase().trim();
    
    console.log('=== PROCESSING USER INPUT ===');
    console.log('Input:', input);
    console.log('Current step:', currentStep);
    console.log('Previous steps:', previousSteps);
    console.log('Waiting for answer:', waitingForAnswer);
    
    // **PRIORITAS 1: Jika sedang menunggu jawaban untuk pertanyaan**
    if (waitingForAnswer) {
      console.log('Processing answer for waiting question:', waitingForAnswer);
      
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
      console.log('Eksplorasi selesai detected, redirecting to /ecomic');
      
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      setBotTyping(true);
      
      setTimeout(() => {
        setBotTyping(false);
        redirectToEcomic();
      }, 1000);
      
      return;
    }
    
    // **PRIORITAS 3: Cek untuk navigasi "menu sebelumnya" - TERLEBIH DAHULU!**
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
        console.log('Menu sebelumnya detected:', input);
        
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        setBotTyping(true);
        
        setTimeout(() => {
          setBotTyping(false);
          
          // Jika di forum diskusi dan ada langkah sebelumnya
          if (currentStep === 'forum_diskusi' && previousSteps.length > 0) {
            const previousStep = previousSteps[previousSteps.length - 1];
            const newPreviousSteps = previousSteps.slice(0, -1);
            
            console.log('Keluar dari forum, kembali ke:', previousStep);
            console.log('New previous steps:', newPreviousSteps);
            
            setPreviousSteps(newPreviousSteps);
            setCurrentStep(previousStep);
            setIsInForum(false);
            
            // Handle navigation berdasarkan step
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
          // Jika ada langkah sebelumnya dalam history
          else if (previousSteps.length > 1) {
            const previousStep = previousSteps[previousSteps.length - 2];
            const newPreviousSteps = previousSteps.slice(0, -1);
            
            console.log('Navigating back to previous step:', previousStep);
            console.log('New previous steps:', newPreviousSteps);
            
            setPreviousSteps(newPreviousSteps);
            setCurrentStep(previousStep);
            
            // Handle navigation berdasarkan step
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
            // Jika tidak ada history, beri pesan error
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
        console.log('Question keyword detected:', keyword);
        console.log('Current step before question:', currentStep);
        
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        
        // SET STATE BERDASARKAN KEYWORD
        if (keyword === 'pertanyaan 1') {
          setCurrentStep('pertanyaan_1');
          console.log('Set current step to: pertanyaan_1');
        }
        else if (keyword === 'pertanyaan 2') {
          setCurrentStep('pertanyaan_2');
          console.log('Set current step to: pertanyaan_2');
        }
        else if (keyword === 'pertanyaan 3') {
          setCurrentStep('pertanyaan_3');
          console.log('Set current step to: pertanyaan_3');
        }
        else if (keyword === 'pertanyaan 4') {
          setCurrentStep('pertanyaan_4');
          console.log('Set current step to: pertanyaan_4');
        }
        else if (keyword === 'pertanyaan reflektif') {
          setCurrentStep('pertanyaan_reflektif');
          console.log('Set current step to: pertanyaan_reflektif');
        }
        else if (keyword === 'mari merancang') {
          setCurrentStep('mari_merancang');
          console.log('Set current step to: mari_merancang');
        }
        else if (keyword === 'ayo berkreasi') {
          setCurrentStep('ayo_berkreasi');
          console.log('Set current step to: ayo_berkreasi');
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
        console.log('Tanya Ecombot detected:', input);
        
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        
        // Jika sudah di forum, tunggu pertanyaan user
        if (currentStep === 'forum_diskusi') {
          setMessages(prev => [...prev, { 
            from: 'bot', 
            text: "Silahkan ajukan pertanyaan Anda tentang berbagai topik pembelajaran. Saya akan membantu menjawabnya menggunakan sistem AI.\n\nKetik 'menu sebelumnya' untuk kembali ke alur pembelajaran."
          }]);
        } else {
          // Pindah ke forum - simpan langkah saat ini ke history
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
      console.log('Processing forum question with LangChain:', input);
      
      setMessages(prev => [...prev, { from: 'user', text: input }]);
      setBotTyping(true);
      
      try {
        const answer = await processForumQuestion(input);
        
        setBotTyping(false);
        
        // FORMAT JAWABAN YANG LEBIH BAIK DENGAN PETUNJUK KELUAR
        const formattedAnswer = `${answer}\n\n---\n*Ketik 'menu sebelumnya' untuk kembali ke alur pembelajaran.*`;
        
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: formattedAnswer,
          data: {
            id: 'forum_diskusi',
            next_keywords: ["menu sebelumnya"]
          }
        }]);
        
        // Simpan ke database
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
      // Periksa apakah semua pertanyaan telah dijawab
      const allAnswered = checkAllQuestionsAnswered();
      
      if (allAnswered) {
        // Jika sudah menjawab semua pertanyaan, lanjut ke kegiatan berikutnya
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        setBotTyping(true);
        
        setTimeout(() => {
          setBotTyping(false);
          navigateToNextActivity();
          scrollChat();
        }, 1000);
      } else {
        // Jika belum menjawab semua pertanyaan, tampilkan pesan error
        setMessages(prev => [...prev, { from: 'user', text: input }]);
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: "Maaf, Anda harus menjawab semua pertanyaan terlebih dahulu sebelum dapat melanjutkan ke kegiatan berikutnya. Silakan selesaikan semua pertanyaan yang tersedia.",
          data: {
            id: currentStep,
            next_keywords: [] // TIDAK ADA QUICK BUTTONS PADA ERROR
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
        
        // Handle khusus untuk navigasi ke forum_diskusi atau completion atau redirect_ecomic
        if (targetKegiatan.stepKey === 'forum_diskusi' || targetKegiatan.stepKey === 'completion' || targetKegiatan.stepKey === 'redirect_ecomic') {
          
          if (targetKegiatan.stepKey === 'redirect_ecomic') {
            redirectToEcomic();
            return;
          }
          
          // Simpan langkah saat ini ke history sebelum pindah
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
          // Simpan langkah saat ini ke history sebelum navigasi
          setPreviousSteps(prev => [...prev, currentStep]);
          
          navigate(`/ecombot${targetKegiatan.path}`);
          setCurrentStep(targetKegiatan.stepKey);
          markAsVisited(targetKegiatan.stepKey);
          
          const kegiatanData = getStepData(targetKegiatan.stepKey);
          if (kegiatanData) {
            // Process images untuk format baru (array) dan legacy (single)
            const processedImages = processImages(kegiatanData.images || kegiatanData.image_url);
            
            const botMessage = { 
              from: 'bot', 
              text: kegiatanData.message,
              data: {
                ...kegiatanData,
                // Gunakan images array untuk format baru
                images: processedImages.length > 0 ? processedImages : undefined,
                // Tetap sertakan legacy fields untuk kompatibilitas
                image_url: processedImages.length === 1 ? processedImages[0].url : undefined,
                image_source: processedImages.length === 1 ? processedImages[0].source : undefined
              }
            };
            
            setMessages(prev => [...prev, botMessage]);
            
            // Simpan pesan bot ke database
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
              next_keywords: [] // TIDAK ADA QUICK BUTTONS PADA ERROR
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
            
            // Handle khusus untuk menu sebelumnya di forum diskusi
            if (nextStep === 'previous_step') {
              // Kembali ke step sebelumnya dari history
              if (previousSteps.length > 0) {
                const previousStep = previousSteps[previousSteps.length - 1];
                const newPreviousSteps = previousSteps.slice(0, -1);
                
                console.log('Navigating back to previous step:', previousStep);
                
                setPreviousSteps(newPreviousSteps);
                setCurrentStep(previousStep);
                
                // Jika keluar dari forum, set isInForum ke false
                if (currentStep === 'forum_diskusi') {
                  setIsInForum(false);
                }
                
                // Handle navigation berdasarkan step
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
              // Handle redirect ke /ecomic
              redirectToEcomic();
            } else {
              // Simpan langkah saat ini ke history sebelum navigasi
              setPreviousSteps(prev => [...prev, currentStep]);
              setCurrentStep(nextStep);
              
              const nextStepData = getStepData(nextStep);
              if (nextStepData) {
                const botMessage = { 
                  from: 'bot', 
                  text: nextStepData.message,
                  data: {
                    ...nextStepData,
                    // Perbaiki path gambar
                    image_url: getImageUrl(nextStepData.image_url),
                    // Sertakan image_source jika ada
                    image_source: nextStepData.image_source
                  }
                };
                
                setMessages(prev => [...prev, botMessage]);
                
                // Simpan pesan bot ke database
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
    
    // **PRIORITAS 10: Default response - HANYA JIKA TIDAK ADA YANG COCOK DI ATAS**
    console.log('No matching command found, showing default response');
    
    // PESAN DEFAULT YANG LEBIH INFORMATIF
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
    setMessages(prev => [...prev, { from: 'user', text: input }]);
    
    // Simpan pesan user ke database
    await saveMessageToDatabase('user', 'User', input, currentStep);
    
    scrollChat();

    setTimeout(() => {
      setBotTyping(true);
      scrollChat();
    }, 500);

    setTimeout(async () => {
      setBotTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: product }]);
      
      // Simpan pesan bot ke database
      await saveMessageToDatabase('bot', 'Aquano', product, currentStep);
      
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
        console.log('Quick button clicked:', text);
        
        setInputValue(text);
        setTimeout(() => {
          processUserInput(text); // Biarkan processUserInput yang handle state change
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
      // Simpan langkah saat ini ke history sebelum navigasi
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
              // Perbaiki path gambar
              image_url: getImageUrl(stepData.image_url),
              // Sertakan image_source jika ada
              image_source: stepData.image_source
            }
          };
          
          setMessages(prev => [...prev, botMessage]);
          
          // Simpan pesan bot ke database
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
      
      // Load history untuk kegiatan yang dipilih
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
    setPreviousSteps
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
                        {/* Gunakan message_html jika ada, fallback ke message */}
                        {message.data?.title && (
                          <h3 className="font-bold text-lime-700 text-lg" dangerouslySetInnerHTML={{__html: message.data.title}} />
                        )}
                        {renderMessageText(message.data?.message_html || message.text)}
                        
                        {/* Tampilkan multiple images */}
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
                        
                        {/* Fallback untuk legacy single image format */}
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
                        
                        {/* Tampilkan source jika ada */}
                        {message.data?.source && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-xs text-gray-500 italic">
                            {message.data.source}
                            </p>
                        </div>
                        )}
                    </div>
                    
                    {/* HANYA TAMPILKAN QUICK BUTTONS JIKA TIDAK SEDANG MENUNGGU JAWABAN */}
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
                  {currentSession && (
                    <p className="text-xs text-gray-500">Session: {currentSession}</p>
                  )}
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
                      {/* Tampilkan gambar jika ada */}
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
                          {/* Tampilkan sumber gambar jika ada */}
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

