import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthNavbar from '../components/AuthNavbar';

// ===== CYBER SECURITY QUESTION BANK (15 questions) =====
const cyberSecurityBank = [
  {
    question: 'What is the primary purpose of a firewall in network security?',
    options: ['To encrypt data at rest', 'To monitor and control incoming and outgoing network traffic', 'To store backup copies of data', 'To speed up internet connections'],
    answer: 1,
  },
  {
    question: 'Which type of firewall inspects the content of network packets?',
    options: ['Packet-filtering firewall', 'Stateful firewall', 'Application-layer firewall', 'Circuit-level gateway'],
    answer: 2,
  },
  {
    question: 'What does a VPN primarily provide?',
    options: ['Faster download speeds', 'A secure and encrypted connection over a public network', 'Automatic software updates', 'Free internet access'],
    answer: 1,
  },
  {
    question: 'Which of the following is an example of symmetric encryption?',
    options: ['RSA', 'AES', 'ECC', 'Diffie-Hellman'],
    answer: 1,
  },
  {
    question: 'What is the key difference between symmetric and asymmetric encryption?',
    options: ['Symmetric is slower', 'Symmetric uses one key, asymmetric uses a public/private key pair', 'Asymmetric cannot encrypt data', 'There is no difference'],
    answer: 1,
  },
  {
    question: 'What is a digital certificate used for?',
    options: ['Storing passwords', 'Verifying the identity of a website or entity', 'Scanning for viruses', 'Compressing files'],
    answer: 1,
  },
  {
    question: 'What is two-factor authentication (2FA)?',
    options: ['Using two different passwords', 'Verifying identity with two different methods', 'Logging in from two devices', 'Having two user accounts'],
    answer: 1,
  },
  {
    question: 'Which of the following is the strongest password?',
    options: ['password123', 'MyDog2024', 'Tr0ub4dor&3xP!', '12345678'],
    answer: 2,
  },
  {
    question: 'What is a brute-force attack?',
    options: ['Sending phishing emails', 'Systematically trying every possible password combination', 'Exploiting a software vulnerability', 'Intercepting network traffic'],
    answer: 1,
  },
  {
    question: 'What type of attack involves overwhelming a server with traffic?',
    options: ['Phishing', 'SQL Injection', 'DDoS', 'Man-in-the-Middle'],
    answer: 2,
  },
  {
    question: 'What is ransomware?',
    options: ['Software that encrypts files and demands payment for decryption', 'A type of firewall', 'A password manager', 'A network monitoring tool'],
    answer: 0,
  },
  {
    question: 'What is a Trojan horse in cybersecurity?',
    options: ['A type of encryption', 'Malware disguised as legitimate software', 'A secure login method', 'A network protocol'],
    answer: 1,
  },
  {
    question: 'What does GDPR stand for?',
    options: ['General Data Protection Regulation', 'Global Digital Privacy Rules', 'Government Data Privacy Requirement', 'General Document Processing Rules'],
    answer: 0,
  },
  {
    question: 'What is data masking?',
    options: ['Deleting all data permanently', 'Replacing sensitive data with fictional but realistic values', 'Encrypting the entire database', 'Backing up data to the cloud'],
    answer: 1,
  },
  {
    question: 'Which of the following is considered personally identifiable information (PII)?',
    options: ['A public blog post', "A person's name and date of birth", 'A weather forecast', 'An open-source software library'],
    answer: 1,
  },
];

// ===== VIBE CODING QUESTION BANK (15 questions) =====
const vibeCodingBank = [
  {
    question: 'What is a React component?',
    options: ['A database table', 'A reusable piece of UI that returns JSX', 'A CSS stylesheet', 'A server endpoint'],
    answer: 1,
  },
  {
    question: 'Which hook is used to manage state in a functional React component?',
    options: ['useEffect', 'useState', 'useRef', 'useReducer'],
    answer: 1,
  },
  {
    question: 'What does useEffect do in React?',
    options: ['Creates a new component', 'Performs side effects after render, like fetching data', 'Styles the component', 'Renders HTML directly'],
    answer: 1,
  },
  {
    question: 'What does a Python function return by default if no return statement is provided?',
    options: ['0', 'null', 'None', 'An empty string'],
    answer: 2,
  },
  {
    question: 'Which Python data type is immutable?',
    options: ['List', 'Dictionary', 'Set', 'Tuple'],
    answer: 3,
  },
  {
    question: 'How do you define a function in Python?',
    options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'],
    answer: 1,
  },
  {
    question: 'What is the purpose of an API in web development?',
    options: ['To style web pages', 'To allow different software applications to communicate with each other', 'To store data in a database', 'To render HTML templates'],
    answer: 1,
  },
  {
    question: 'Which HTTP method is typically used to create a new resource via a REST API?',
    options: ['GET', 'PUT', 'POST', 'DELETE'],
    answer: 2,
  },
  {
    question: 'What does REST stand for in web development?',
    options: ['Remote Execution Standard Technology', 'Representational State Transfer', 'Resource Encoding State Technique', 'Real-time Event Streaming Technology'],
    answer: 1,
  },
  {
    question: 'What is the output of typeof null in JavaScript?',
    options: ['"null"', '"undefined"', '"object"', '"boolean"'],
    answer: 2,
  },
  {
    question: 'What does the === operator check in JavaScript?',
    options: ['Value only', 'Type only', 'Both value and type', 'Neither value nor type'],
    answer: 2,
  },
  {
    question: 'Which keyword declares a block-scoped variable in JavaScript?',
    options: ['var', 'let', 'global', 'static'],
    answer: 1,
  },
  {
    question: 'What does git clone do?',
    options: ['Creates a new branch', 'Creates a full copy of a remote repository on your local machine', 'Deletes a repository', 'Merges two branches'],
    answer: 1,
  },
  {
    question: 'What is a Git branch?',
    options: ['A copy of the entire repository', 'A lightweight, movable pointer to a commit', 'A type of merge conflict', 'A remote server'],
    answer: 1,
  },
  {
    question: 'Which Git command stages changes for the next commit?',
    options: ['git commit', 'git push', 'git add', 'git pull'],
    answer: 2,
  },
];

const questionBank = {
  'Cyber Security': cyberSecurityBank,
  'Vibe Coding': vibeCodingBank,
};

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const TIMER_SECONDS = 30;

export default function Quiz() {
  const navigate = useNavigate();
  const { user } = useUser();

  const subject = user?.subject || 'Vibe Coding';

  const [questions] = useState(() => {
    const bank = questionBank[subject] || vibeCodingBank;
    const shuffled = shuffleArray(bank);
    return shuffled.slice(0, 5);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [locked, setLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  const timerRef = useRef(null);
  const current = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Timer logic
  useEffect(() => {
    if (locked) {
      clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-lock as wrong when timer runs out
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, locked]);

  const handleTimeout = useCallback(() => {
    setLocked(true);
    setWrongQuestions((prev) => [...prev, {
      question: questions[currentIndex].question,
      correctAnswer: questions[currentIndex].options[questions[currentIndex].answer],
    }]);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setLocked(false);
      }
    }, 1000);
  }, [currentIndex, questions]);

  const handleSelect = (index) => {
    if (locked) return;
    setSelectedOption(index);
  };

  const handleConfirm = useCallback(() => {
    if (selectedOption === null || locked) return;

    clearInterval(timerRef.current);
    setLocked(true);

    const isCorrect = selectedOption === current.answer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, {
        question: current.question,
        correctAnswer: current.options[current.answer],
      }]);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setLocked(false);
      }
    }, 1500);
  }, [selectedOption, locked, current, currentIndex, questions.length]);

  const handleSubmit = () => {
    const wrongCount = questions.length - correctCount;
    navigate('/results', {
      state: {
        correct: correctCount,
        wrong: wrongCount,
        total: questions.length,
        subject: subject,
        wrongQuestions: wrongQuestions,
      },
    });
  };

  const timerPercent = (timeLeft / TIMER_SECONDS) * 100;

  return (
    <div className="screen">
      {/* Header */}
      <div className="header-band">
        <div className="logo-icon">A</div>
        <div className="app-name">ADAPTIQ</div>
        <div className="tagline">Study Smart. Not Harder.</div>
      </div>

      {/* Auth Navbar */}
      <AuthNavbar />

      {/* Content */}
      <div className="content-area">
        {/* Timer */}
        <div className="timer-text">{timeLeft}s</div>
        <div className="timer-bar-container">
          <div className="timer-bar" style={{ width: `${timerPercent}%` }}></div>
        </div>

        <div className="question-counter">
          Question {currentIndex + 1} of {questions.length}
        </div>

        <p className="question-text">{current.question}</p>

        {current.options.map((option, index) => {
          let optionClass = 'quiz-option';

          if (locked) {
            if (index === current.answer) {
              optionClass += ' correct';
            } else if (index === selectedOption && index !== current.answer) {
              optionClass += ' wrong';
            }
          } else if (index === selectedOption) {
            optionClass += ' selected';
          }

          return (
            <button
              key={index}
              className={optionClass}
              onClick={() => handleSelect(index)}
              style={{ display: 'block', textAlign: 'left' }}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          );
        })}

        {!locked && selectedOption !== null && (
          <div style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={handleConfirm}>
              Confirm Answer
            </button>
          </div>
        )}

        {locked && isLastQuestion && (
          <div style={{ marginTop: 16 }}>
            <button className="btn-primary" onClick={handleSubmit}>
              Submit Quiz
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer-band">
        <span className="footer-text">
          {subject} — Answer all questions to continue
        </span>
      </div>
    </div>
  );
}