import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/Signup.css'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from "../Firebase"
import { doc, setDoc } from "firebase/firestore"

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const addToFirestore = async (u) => {
    const userRef = doc(db, 'users', u.uid)
    await setDoc(userRef, {
      uid: u.uid,
      name: displayName || u.displayName || 'Guest',
      email: u.email
    }, { merge: true })
  }

  const createUser = () => {
    if (!email || !password || !displayName) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        addToFirestore(user);
        alert("Registered successfully! You can now login.");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Signup error:", error.code, error.message);
        
        // Better error messages
        if (error.code === 'auth/email-already-in-use') {
          alert("This email is already registered. Please login instead.");
        } else if (error.code === 'auth/invalid-email') {
          alert("Invalid email format.");
        } else if (error.code === 'auth/weak-password') {
          alert("Password is too weak. Use at least 6 characters.");
        } else {
          alert("Registration failed: " + error.message);
        }
        
        setEmail('');
        setPassword('');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    createUser();
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await addToFirestore(user);
      alert("Registered successfully with Google");
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
      await addToFirestore(user);
      alert("Registered successfully with GitHub");
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

            {/* SIGNUP */}
            <div className="form-section signup">
              <h2>Sign Up</h2>
              <form onSubmit={handleSignupSubmit}>
                <input 
                  className='sig-inp'
                  type="text"
                  placeholder="User Name" 
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  disabled={loading}
                  required 
                />

                <input 
                  className='sig-inp'
                  type="email" 
                  placeholder="Email"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value) }}
                  disabled={loading}
                  required 
                />

                <input 
                  className='sig-inp'
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(event) => { setPassword(event.target.value) }}
                  disabled={loading}
                  required 
                />

                <button  id='sig-btn' type="submit" disabled={loading}>
                  {loading ? 'Signing up...' : 'Sign Up'}
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

              <Link to="/login" className='login-link'>
                Already have account? Login
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Signup