import React, { useState, useEffect } from 'react';
import Editor from './Editor';
import useLocalStorage from '../hooks/useLocalStorage'; 
// --- NEW FIREBASE IMPORTS ---
import { auth, provider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

function App() {
  const [html, setHtml] = useLocalStorage('html', '');
  const [css, setCss] = useLocalStorage('css', '');
  const [js, setJs] = useLocalStorage('js', '');
  const [srcDoc, setSrcDoc] = useState('');
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [activeTab, setActiveTab] = useState('html'); 

  // --- NEW AUTHENTICATION STATE ---
  const [user, setUser] = useState(null);

  // Listen for user login/logout automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchFromCloud(currentUser.uid);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html><body>${html}</body><style>${css}</style><script>${js}</script></html>
      `);
    }, 250);
    return () => clearTimeout(timeout);
  }, [html, css, js]);

  // --- NEW FIREBASE FUNCTIONS ---
  const login = () => signInWithPopup(auth, provider);
  const logout = () => signOut(auth);

  const saveToCloud = async () => {
    if (!user) return alert("Please log in to save to the cloud.");
    try {
      // Save their code to a document named after their unique User ID
      await setDoc(doc(db, "projects", user.uid), { html, css, js });
      alert("✅ Code saved to the cloud successfully!");
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const fetchFromCloud = async (uid) => {
    try {
      const docSnap = await getDoc(doc(db, "projects", uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHtml(data.html); setCss(data.css); setJs(data.js);
      }
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="toolbar">
        <div className="branding">
          <h2>🚀 CodeFlow IDE</h2>
        </div>
        
        {/* --- UPGRADED ACTION BAR --- */}
        <div className="actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️ Mode' : '🌙 Mode'}
          </button>
          
          {user ? (
            <>
              <button className="btn btn-primary" onClick={saveToCloud}>☁️ Save to Cloud</button>
              <img src={user.photoURL} alt="Profile" style={{ width: '32px', borderRadius: '50%' }} />
              <button className="btn btn-clear" onClick={logout}>Logout</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={login}>🔑 Sign in with Google</button>
          )}
        </div>
      </div>

      {/* Main Workspace (Unchanged) */}
      <div className="workspace">
        <div className="left-pane">
          <div className="tabs">
            <button className={`tab ${activeTab === 'html' ? 'active' : ''}`} onClick={() => setActiveTab('html')}>
              <span className="file-icon html-icon">{"<>"}</span> index.html
            </button>
            <button className={`tab ${activeTab === 'css' ? 'active' : ''}`} onClick={() => setActiveTab('css')}>
              <span className="file-icon css-icon">#</span> style.css
            </button>
            <button className={`tab ${activeTab === 'js' ? 'active' : ''}`} onClick={() => setActiveTab('js')}>
              <span className="file-icon js-icon">JS</span> script.js
            </button>
          </div>

          <div className="editor-wrapper">
            {activeTab === 'html' && <Editor language="xml" value={html} onChange={setHtml} theme={theme} />}
            {activeTab === 'css' && <Editor language="css" value={css} onChange={setCss} theme={theme} />}
            {activeTab === 'js' && <Editor language="javascript" value={js} onChange={setJs} theme={theme} />}
          </div>
        </div>

        <div className="right-pane">
          <div className="preview-header">Live Preview</div>
          <iframe srcDoc={srcDoc} title="output" sandbox="allow-scripts" frameBorder="0" width="100%" height="100%" className="preview-iframe" />
        </div>
      </div>
    </div>
  );
}

export default App;