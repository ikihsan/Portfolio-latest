const { useState, useEffect, useRef } = React;

// Main App Component
function App() {
  const [currentPage, setCurrentPage] = useState('game');
  const [gameCompleted, setGameCompleted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGameComplete = () => {
    setGameCompleted(true);
    setTimeout(() => {
      setCurrentPage('dashboard');
    }, 2000);
  };

  const skipGame = () => {
    setCurrentPage('dashboard');
  };

  return (
    <div className="app">
      {currentPage === 'game' ? (
        <GamePage onComplete={handleGameComplete} onSkip={skipGame} />
      ) : (
        <>
          <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
          <div className="main-container">
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'projects' && <ProjectsPage />}
            {currentPage === 'chatroom' && <ChatroomPage />}
            {currentPage === 'passion' && <PassionPage />}
          </div>
        </>
      )}
    </div>
  );
}

// Navigation Component
function Navbar({ currentPage, setCurrentPage, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">IHSAN.ME</div>
        <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><a href="#" className={currentPage === 'dashboard' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentPage('dashboard'); setMobileMenuOpen(false); }}>Dashboard</a></li>
          <li><a href="#" className={currentPage === 'projects' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentPage('projects'); setMobileMenuOpen(false); }}>Projects</a></li>
          <li><a href="#" className={currentPage === 'chatroom' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentPage('chatroom'); setMobileMenuOpen(false); }}>Chatroom</a></li>
          <li><a href="#" className={currentPage === 'passion' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setCurrentPage('passion'); setMobileMenuOpen(false); }}>My Passion</a></li>
        </ul>
      </div>
    </nav>
  );
}

// Game Page Component
function GamePage({ onComplete, onSkip }) {
  const canvasRef = useRef(null);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x6b2d9e, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x1a7a8a, 1, 100);
    pointLight2.position.set(-10, 10, -10);
    scene.add(pointLight2);

    // Character (player)
    const characterGeometry = new THREE.CapsuleGeometry(0.3, 0.7, 4, 8);
    const characterMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x6b2d9e,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x6b2d9e,
      emissiveIntensity: 0.3
    });
    const character = new THREE.Mesh(characterGeometry, characterMaterial);
    character.position.set(0, 1, 0);
    character.castShadow = true;
    scene.add(character);

    // Platforms
    const platforms = [];
    const platformMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.1
    });

    // Starting platform
    const platform1 = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), platformMaterial);
    platform1.position.set(0, 0, 0);
    platform1.receiveShadow = true;
    scene.add(platform1);
    platforms.push(platform1);

    // Second platform
    const platform2 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 3), platformMaterial);
    platform2.position.set(5, 1, 2);
    platform2.receiveShadow = true;
    scene.add(platform2);
    platforms.push(platform2);

    // Third platform
    const platform3 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 3), platformMaterial);
    platform3.position.set(10, 2, -1);
    platform3.receiveShadow = true;
    scene.add(platform3);
    platforms.push(platform3);

    // Fourth platform
    const platform4 = new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 3), platformMaterial);
    platform4.position.set(15, 3, 3);
    platform4.receiveShadow = true;
    scene.add(platform4);
    platforms.push(platform4);

    // Finish platform
    const finishPlatform = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), new THREE.MeshStandardMaterial({ 
      color: 0x1a7a8a,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x1a7a8a,
      emissiveIntensity: 0.5
    }));
    finishPlatform.position.set(20, 4, 0);
    finishPlatform.receiveShadow = true;
    scene.add(finishPlatform);
    platforms.push(finishPlatform);

    // Collectibles
    const collectibles = [];
    for (let i = 0; i < 4; i++) {
      const collectible = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0x8b3a62,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x8b3a62,
          emissiveIntensity: 0.5
        })
      );
      collectible.position.set(5 * (i + 1), 2 + i, i % 2 === 0 ? 2 : -1);
      scene.add(collectible);
      collectibles.push(collectible);
    }

    // Camera setup
    camera.position.set(0, 5, 10);
    camera.lookAt(character.position);

    // Player movement
    const keys = {};
    let velocity = { x: 0, y: 0, z: 0 };
    let onGround = true;
    const moveSpeed = 0.1;
    const jumpSpeed = 0.3;
    const gravity = 0.015;

    window.addEventListener('keydown', (e) => {
      keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      keys[e.code] = false;
    });

    // Game loop
    let completed = false;
    function animate() {
      requestAnimationFrame(animate);

      if (!completed) {
        // Movement
        if (keys['KeyW'] || keys['ArrowUp']) {
          velocity.z = -moveSpeed;
        } else if (keys['KeyS'] || keys['ArrowDown']) {
          velocity.z = moveSpeed;
        } else {
          velocity.z *= 0.9;
        }

        if (keys['KeyA'] || keys['ArrowLeft']) {
          velocity.x = -moveSpeed;
        } else if (keys['KeyD'] || keys['ArrowRight']) {
          velocity.x = moveSpeed;
        } else {
          velocity.x *= 0.9;
        }

        // Jumping
        if (keys['Space'] && onGround) {
          velocity.y = jumpSpeed;
          onGround = false;
        }

        // Apply gravity
        velocity.y -= gravity;

        // Update position
        character.position.x += velocity.x;
        character.position.y += velocity.y;
        character.position.z += velocity.z;

        // Check platform collisions
        onGround = false;
        platforms.forEach(platform => {
          const platformTop = platform.position.y + 0.25;
          const platformBottom = platform.position.y - 0.25;
          const platformLeft = platform.position.x - platform.geometry.parameters.width / 2;
          const platformRight = platform.position.x + platform.geometry.parameters.width / 2;
          const platformFront = platform.position.z - platform.geometry.parameters.depth / 2;
          const platformBack = platform.position.z + platform.geometry.parameters.depth / 2;

          if (
            character.position.x > platformLeft &&
            character.position.x < platformRight &&
            character.position.z > platformFront &&
            character.position.z < platformBack &&
            character.position.y <= platformTop + 0.5 &&
            character.position.y >= platformBottom
          ) {
            character.position.y = platformTop + 0.5;
            velocity.y = 0;
            onGround = true;
          }
        });

        // Collect items
        collectibles.forEach((collectible, index) => {
          if (collectible.visible) {
            const distance = character.position.distanceTo(collectible.position);
            if (distance < 0.8) {
              collectible.visible = false;
            }
          }
        });

        // Rotate collectibles
        collectibles.forEach(collectible => {
          collectible.rotation.y += 0.05;
          collectible.position.y += Math.sin(Date.now() * 0.003) * 0.01;
        });

        // Check finish line
        const distanceToFinish = character.position.distanceTo(finishPlatform.position);
        if (distanceToFinish < 2 && !completed) {
          completed = true;
          setShowCompletion(true);
          setTimeout(() => {
            onComplete();
          }, 2000);
        }

        // Camera follow
        camera.position.x = character.position.x;
        camera.position.y = character.position.y + 5;
        camera.position.z = character.position.z + 10;
        camera.lookAt(character.position);
      }

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [onComplete]);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} className="game-canvas"></canvas>
      <div className="game-overlay crt-effect">
        <button className="skip-game-btn" onClick={onSkip}>Skip Game</button>
        {!showCompletion && (
          <div className="game-controls">
            <p><strong>Controls:</strong></p>
            <p>WASD / Arrow Keys: Move</p>
            <p>SPACE: Jump</p>
            <p>Reach the glowing platform to continue!</p>
          </div>
        )}
        {showCompletion && (
          <div className="game-completion">
            <h2>🎮 Level Complete!</h2>
            <p>Loading Portfolio...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Dashboard Page Component
function DashboardPage() {
  return (
    <div className="page dashboard-page">
      <div className="profile-section">
        <img
          src="assets/IMG_0362.jpg"
          alt="Ihsan"
          className="profile-image"
          onError={(e) => { e.target.onerror = null; e.target.src = 'IMG_0362.jpg'; }}
        />
        <h1 className="profile-name">Ihsan</h1>
        <h2 className="profile-title">Fullstack Developer</h2>
        <p className="profile-bio">
          Node.js (Express, NestJS) | React.js | Next.js | PostgreSQL | GraphQL | REST APIs | WebSockets | Firebase | Supabase | Server Deployment &amp; Hosting
        </p>

        <div className="social-links">
          <div className="social-card">
            <a href="https://linkedin.com/in/ikihsan" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin social-icon"></i>
              <p className="social-name">LinkedIn</p>
            </a>
          </div>
          <div className="social-card">
            <a href="https://github.com/ikihsan" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github social-icon"></i>
              <p className="social-name">GitHub</p>
            </a>
          </div>
          <div className="social-card">
            <a href="https://wa.me/9037312356" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp social-icon"></i>
              <p className="social-name">WhatsApp</p>
            </a>
          </div>
          <div className="social-card">
            <a href="mailto:ikihsaan@gmail.com">
              <i className="fas fa-envelope social-icon"></i>
              <p className="social-name">Email</p>
            </a>
          </div>
        </div>

        <MusicPlayer />
      </div>
    </div>
  );
}

// Music Player Component
function MusicPlayer() {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const playlist = [
    { title: "Tokyo Drift Various", file: "Tokyo-Drift-Various.mp3" },
    { title: "Govinda - A Modern Mantra", file: "Govinda_-_A_Modern_Mantra_-mp3.pm.mp3" },
    { title: "Kadi Te Has Bol Ve", file: "Kadi_Te_Has_Bol_Ve.mp3" }
  ];

  // Track whether we've already tried the fallback (root) URL for the current audio
  const attemptedFallbackRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    };

    const handleError = () => {
      // If loading from assets/ failed, try the root filename as a fallback once
      if (!attemptedFallbackRef.current) {
        attemptedFallbackRef.current = true;
        try {
          audio.src = playlist[currentTrack].file;
          audio.load();
          if (isPlaying) audio.play().catch(() => setIsPlaying(false));
        } catch (err) {
          console.warn('Fallback audio load failed', err);
        }
      } else {
        console.warn('Audio failed to load for', playlist[currentTrack].file);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [volume, playlist.length, currentTrack, isPlaying]);

  useEffect(() => {
    // When the track changes, try to use the assets/ path first, reset fallback flag
    const audio = audioRef.current;
    if (!audio) return;

    attemptedFallbackRef.current = false;
    audio.src = `assets/${playlist[currentTrack].file}`;
    try { audio.load(); } catch (e) {}

    if (isPlaying) {
      const p = audio.play();
      if (p && p.then) p.catch((err) => { console.warn('Playback prevented or failed on track change:', err); setIsPlaying(false); });
    }
  }, [currentTrack]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Play failed (user gesture may be required):', err);
        setIsPlaying(false);
      }
    }
  };

  const skipTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  const previousTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = percent * duration;
  };

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(percent);
    audioRef.current.volume = percent;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-player-container">
      <div className="music-player-header">
        <h3>🎵 Now Playing</h3>
      </div>
      <p className="track-title">{playlist[currentTrack].title}</p>
      <audio
        ref={audioRef}
        src={`assets/${playlist[currentTrack].file}`}
        preload="metadata"
      />
      <div className="audio-player">
        <div className="player-controls">
          <button className="control-btn" onClick={previousTrack}>
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="control-btn play-btn" onClick={togglePlay}>
            <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
          </button>
          <button className="control-btn" onClick={skipTrack}>
            <i className="fas fa-step-forward"></i>
          </button>
          <div className="progress-container" onClick={handleProgressClick}>
            <div className="progress-bar" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}></div>
          </div>
        </div>
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="volume-control">
          <i className="fas fa-volume-up"></i>
          <div className="volume-slider" onClick={handleVolumeClick}>
            <div className="volume-bar" style={{ width: `${volume * 100}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Projects Page Component
function ProjectsPage() {
  const projects = [
    {
      title: "AI Mock Interview Platform",
      description: "Intelligent interview preparation system with real-time feedback",
      tech: ["Express.js", "Gemini AI", "React.js", "MongoDB"],
      features: [
        "AI-powered question generation based on job role",
        "Real-time speech recognition and analysis",
        "Performance scoring with detailed feedback",
        "Mock interview session recording and playback"
      ],
      highlight: "Leverages Google's Gemini AI for natural conversation flow"
    },
    {
      title: "Vehicle Auction & Bidding Platform",
      description: "Real-time bidding system for vehicle auctions",
      tech: ["NestJS", "Node.js", "Next.js", "PostgreSQL", "Prisma ORM", "Firebase"],
      features: [
        "Live bidding with WebSocket real-time updates",
        "Automated auction scheduling and notifications",
        "Image upload and management via Firebase Storage",
        "User authentication and role-based access",
        "Transaction history and invoice generation"
      ],
      highlight: "Handles concurrent bidding with optimistic locking"
    },
    {
      title: "SaaS Company Management System",
      description: "Enterprise-grade management platform with full deployment",
      tech: ["Next.js", "NestJS", "Supabase", "Ubuntu Server", "Monitoring Tools"],
      features: [
        "Multi-tenant architecture with role hierarchies",
        "Real-time dashboard with analytics",
        "Automated deployment pipeline",
        "Server monitoring and health checks",
        "API rate limiting and security layers"
      ],
      highlight: "Production-ready with CI/CD and server monitoring"
    },
    {
      title: "User Vlogging System",
      description: "Video content management platform for creators",
      tech: ["NestJS", "Node.js", "Next.js", "PostgreSQL", "Prisma ORM"],
      features: [
        "Video upload with compression and transcoding",
        "Social features: likes, comments, subscriptions",
        "Content recommendation algorithm",
        "Creator analytics dashboard",
        "Search and filtering system"
      ],
      highlight: "Optimized video delivery with CDN integration"
    }
  ];

  return (
    <div className="page projects-page">
      <h1 style={{ textAlign: 'center', fontSize: '42px', color: 'var(--neon-purple)', textShadow: '0 0 20px var(--neon-glow)', marginBottom: '40px' }}>My Projects</h1>
      <div className="projects-grid">
        {projects.map((project, idx) => (
          <div key={idx} className="project-card" style={{ animationDelay: `${idx * 0.1}s` }}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="tech-stack">
              {project.tech.map((tech, i) => (
                <span key={i} className="tech-badge">{tech}</span>
              ))}
            </div>
            <ul className="features-list">
              {project.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <div className="highlight-box">
              <strong>Key Innovation:</strong> {project.highlight}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chatroom Page Component
function ChatroomPage() {
  const [username, setUsername] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [messages, setMessages] = useState([
    { username: 'System', message: 'Welcome to the global chatroom!', timestamp: new Date().toISOString() },
    { username: 'John', message: 'Hey everyone! 👋', timestamp: new Date(Date.now() - 300000).toISOString() },
    { username: 'Sarah', message: 'Nice portfolio Ihsan!', timestamp: new Date(Date.now() - 240000).toISOString() },
    { username: 'Dev123', message: 'The 3D game is awesome!', timestamp: new Date(Date.now() - 180000).toISOString() }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const joinChat = () => {
    if (username.trim()) {
      setHasJoined(true);
      const joinMessage = {
        username: 'System',
        message: `${username} has joined the chat!`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, joinMessage]);
    }
  };

  const sendMessage = () => {
    if (input.trim() && username) {
      const newMessage = {
        username,
        message: input,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (!hasJoined) {
    return (
      <div className="page chatroom-page">
        <div className="join-screen">
          <h2>Enter the Global Chat</h2>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && joinChat()}
          />
          <button className="join-btn" onClick={joinChat}>Join Chat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page chatroom-page">
      <div className="chatroom-container">
        <div className="chat-header">
          <h3>Global Chatroom</h3>
          <p className="online-count">💬 {messages.length} messages • You are {username}</p>
        </div>
        <div className="messages-container">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.username === username ? 'own-message' : ''}`}>
              <div className="message-header">
                <span className="message-username">{msg.username}</span>
                <span className="message-timestamp">{formatTimestamp(msg.timestamp)}</span>
              </div>
              <div className="message-text">{msg.message}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
          />
          <button className="send-btn" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

// Passion Page Component
function PassionPage() {
  const footballBanner = "data:image/svg+xml,%3Csvg width='1200' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231a7a8a;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%236b2d9e;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='400' fill='url(%23grad)'/%3E%3Ctext x='50%25' y='50%25' font-size='48' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif' font-weight='bold'%3EMIDFIELD MAESTRO%3C/text%3E%3C/svg%3E";
  const carsBanner = "data:image/svg+xml,%3Csvg width='1200' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff4500;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%238b3a62;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='400' fill='url(%23grad2)'/%3E%3Ctext x='50%25' y='40%25' font-size='56' fill='white' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif' font-weight='bold'%3ETOKYO DRIFT%3C/text%3E%3C/svg%3E";
  const hackingBanner = "data:image/svg+xml,%3Csvg width='1200' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1200' height='400' fill='%23000000'/%3E%3Ctext x='50%25' y='30%25' font-size='64' fill='%230f0' text-anchor='middle' dominant-baseline='middle' font-family='Courier New, monospace' font-weight='bold'%3Esudo su%3C/text%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%2300ff00' text-anchor='middle' dominant-baseline='middle' font-family='Courier New, monospace'%3EAccess Granted%3C/text%3E%3C/svg%3E";

  return (
    <div className="page passion-page">
      <h1 style={{ textAlign: 'center', fontSize: '42px', color: 'var(--neon-purple)', textShadow: '0 0 20px var(--neon-glow)', marginBottom: '40px' }}>My Passions</h1>
      
      <div className="passion-card">
        <div className="banner-image">
          <img src={footballBanner} alt="Football" />
        </div>
        <div className="passion-content">
          <h2>The Architect, Not The Finisher</h2>
          <p className="philosophy-text">
            In football, I find my truest self in the midfield - not hunting glory in the spotlight, but orchestrating it from the shadows. While strikers chase headlines with goals, I chase perfection in the through-ball that splits the defense.
          </p>
          <div className="highlight-box">
            <h3>My Playing Philosophy</h3>
            <ul className="features-list">
              <li><strong>Vision Over Vanity:</strong> I see passes others do not, creating chances for glory</li>
              <li><strong>Control the Tempo:</strong> The heartbeat of the team flows through my positioning</li>
              <li><strong>Sacrifice for Success:</strong> Running miles to win the ball back</li>
              <li><strong>The Real Skill Wears a Mask:</strong> Let them celebrate the goal - I know who created it</li>
            </ul>
          </div>
          <div className="quote-box">
            I want to be the one who creates heroes. The true skill lies in making others shine while mastering the art that no one sees.
          </div>
          <div className="stats-display">
            <div className="stat">
              <span className="stat-label">Favorite Position</span>
              <span className="stat-value">Central/Attacking Midfielder</span>
            </div>
            <div className="stat">
              <span className="stat-label">Play Style</span>
              <span className="stat-value">Playmaker / Deep-Lying Creator</span>
            </div>
            <div className="stat">
              <span className="stat-label">Inspiration</span>
              <span className="stat-value">Luka Modric, Kevin De Bruyne</span>
            </div>
          </div>
        </div>
      </div>

      <div className="passion-card">
        <div className="banner-image">
          <img src={carsBanner} alt="Tokyo Drift" />
        </div>
        <div className="passion-content">
          <h2>Rear-Wheel Drive Philosophy</h2>
          <p className="intro-text">
            There is something raw and honest about rear-wheel drive. No electronic nannies holding your hand. Just you, the throttle, and the physics of controlled chaos. Drifting is about mastering the edge where control meets surrender.
          </p>
          <h3>Why Drifting Resonates</h3>
          <div className="philosophy-grid">
            <div className="philosophy-point">
              <h4>The Purist Choice</h4>
              <p>Rear-wheel drive demands skill. Every input matters. No hiding behind technology - just raw driver ability.</p>
            </div>
            <div className="philosophy-point">
              <h4>Controlled Chaos</h4>
              <p>The beauty of a perfect drift: the car dancing on the edge of grip, yet completely under control.</p>
            </div>
            <div className="philosophy-point">
              <h4>Tokyo Spirit</h4>
              <p>Inspired by the Tokyo drift scene - where mountain passes become canvases for tire smoke masterpieces.</p>
            </div>
            <div className="philosophy-point">
              <h4>The Connection</h4>
              <p>The connection between man and machine. Feeling the weight transfer, anticipating traction, steering with throttle.</p>
            </div>
          </div>
          <div className="quote-box">
            In drifting, perfection is about dancing with chaos and making it look intentional. Every drift is a conversation between rubber and asphalt.
          </div>
          <div className="dream-garage">
            <h3>Dream Machines</h3>
            <ul>
              <li><strong>Mazda RX-7 FD:</strong> Rotary soul, perfect balance</li>
              <li><strong>Nissan Silvia S15:</strong> The drift king weapon</li>
              <li><strong>Toyota AE86:</strong> Where the legend began</li>
              <li><strong>BMW E46 M3:</strong> European precision with sideways attitude</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="passion-card">
        <div className="banner-image">
          <img src={hackingBanner} alt="Hacking Terminal" />
        </div>
        <div className="passion-content">
          <h2 className="terminal-font">$ sudo su -</h2>
          <h3 className="subtitle">Living in the Terminal</h3>
          <div className="terminal-window">
            <div className="terminal-header">
              <span>ihsan@localhost:~$</span>
            </div>
            <div className="terminal-content">
              <p>&gt; Initializing mindset...</p>
              <p>&gt; Loading curiosity.dll</p>
              <p>&gt; Mounting /dev/persistence</p>
              <p className="success-text">&gt; System compromised. Access granted.</p>
            </div>
          </div>
          <p className="philosophy-text">
            There is a unique thrill in understanding systems at their core. Hacking is about seeing beyond the interface, understanding the logic that powers digital life.
          </p>
          <h3>The Hacker Mindset</h3>
          <div className="ethos-grid">
            <div className="ethos-card">
              <div className="icon">&#128269;</div>
              <h4>Insatiable Curiosity</h4>
              <p>Every system is a puzzle. I dissect technology, understand it, and make it bend to my will.</p>
            </div>
            <div className="ethos-card">
              <div className="icon">&#128737;</div>
              <h4>Security Obsession</h4>
              <p>I study vulnerabilities not to exploit, but to fortify. The best defense is understanding the offense.</p>
            </div>
            <div className="ethos-card">
              <div className="icon">&#9889;</div>
              <h4>Terminal Mastery</h4>
              <p>The terminal is home. Bash scripts, Python automation - this is where real power lives.</p>
            </div>
            <div className="ethos-card">
              <div className="icon">&#127919;</div>
              <h4>Problem Solver</h4>
              <p>Every bug is a challenge. I hunt errors down, dissect their causes, and emerge with solutions.</p>
            </div>
          </div>
          <div className="skills-terminal">
            <h3>$ cat skills.txt</h3>
            <div className="terminal-output">
              <div className="skill-line">
                <span className="prompt">&gt;</span>
                <span className="skill">Network Penetration Testing</span>
                <span className="level">[████████░░] 80%</span>
              </div>
              <div className="skill-line">
                <span className="prompt">&gt;</span>
                <span className="skill">Linux System Administration</span>
                <span className="level">[█████████░] 90%</span>
              </div>
              <div className="skill-line">
                <span className="prompt">&gt;</span>
                <span className="skill">Python Automation &amp; Scripting</span>
                <span className="level">[████████░░] 85%</span>
              </div>
              <div className="skill-line">
                <span className="prompt">&gt;</span>
                <span className="skill">Cybersecurity Fundamentals</span>
                <span className="level">[███████░░░] 75%</span>
              </div>
              <div className="skill-line">
                <span className="prompt">&gt;</span>
                <span className="skill">Reverse Engineering</span>
                <span className="level">[██████░░░░] 60%</span>
              </div>
            </div>
          </div>
          <div className="quote-box terminal-quote">
            <span className="prompt-symbol">root@mindset:~# </span>
            In the terminal, I am a conductor orchestrating digital symphonies. I speak the system language and make it dance.
          </div>
          <div className="learning-path">
            <h3>Current Focus Areas</h3>
            <ul className="focus-list">
              <li>&#128274; OWASP Top 10 vulnerabilities and mitigation</li>
              <li>&#128051; Container security and Docker hardening</li>
              <li>&#127760; Web application penetration testing</li>
              <li>&#128225; Wireless network security and packet analysis</li>
              <li>&#129504; Ethical hacking certifications (CEH, OSCP track)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));