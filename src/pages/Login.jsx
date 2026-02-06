import React from 'react'
import '../css/Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { auth, db } from '../Firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, setDoc } from "firebase/firestore"

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const userLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Logged in successfully");
        navigate("/chat");
      })
      .catch((error) => {
        console.error("Login error:", error.code, error.message);
        
        // Better error messages
        if (error.code === 'auth/user-not-found') {
          alert("No account found with this email. Please sign up first.");
        } else if (error.code === 'auth/wrong-password') {
          alert("Incorrect password. Please try again.");
        } else if (error.code === 'auth/invalid-email') {
          alert("Invalid email format.");
        } else if (error.code === 'auth/invalid-credential') {
          alert("Invalid credentials. Please check your email and password.");
        } else {
          alert("Login failed: " + error.message);
        }
        
        setEmail('');
        setPassword('');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    userLogin();
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Add user to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || 'Guest',
        email: user.email,
        photoURL: user.photoURL || null
      }, { merge: true });
      
      alert("Logged in successfully with Google");
      navigate("/chat");
    } catch (error) {
      console.error("Google auth error:", error);
      alert(`Google authentication failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubAuth = async () => {
    const provider = new GithubAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Add user to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'Guest',
        email: user.email,
        photoURL: user.photoURL || null
      }, { merge: true });
      
      alert("Logged in successfully with GitHub");
      navigate("/chat");
    } catch (error) {
      console.error("GitHub auth error:", error);
      
      // Handle specific GitHub auth errors
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert("An account already exists with the same email. Try logging in with Google or email/password.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        alert("Sign-in popup was closed. Please try again.");
      } else {
        alert(`GitHub authentication failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="log_container">
        <div className="glass-wrapper">
          <div className="glass-card">

            {/* LOGIN */}
            <div className="form-section login">
              <h2>Login</h2>

              <form onSubmit={handleLoginSubmit}>
                <input 
                  className='log-inp'
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value) }}
                  disabled={loading}
                  required 
                />

                <input 
                  className='log-inp'
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => { setPassword(event.target.value) }}
                  disabled={loading}
                  required 
                />

                <button id='log-btn' type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="social">
                <div className="social-btn google" onClick={handleGoogleAuth}>
                  <i className="fab fa-google"></i> Google
                </div>
                <div className="social-btn github" onClick={handleGithubAuth}>
                  <i className="fab fa-github"></i> GitHub
                </div>
              </div>
             
              <Link to="/signup" className='signup-link'> Create new account</Link>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Login