/* =============================================
   IWT NOTE SITE — Firebase Authentication
   Google Sign-In with Realtime Database
   ============================================= */

(function () {
    'use strict';

    // ─── Firebase Configuration ──────────────────────────
    // Replace these placeholder values with your actual Firebase project config.
    // You can find these in: Firebase Console > Project Settings > General > Your apps
    const firebaseConfig = {
        apiKey: "AIzaSyDvdNNhmq7sTX6N9bosx2evef8ljM5iHrk",
        authDomain: "iwt-note-site-99dd9.firebaseapp.com",
        projectId: "iwt-note-site-99dd9",
        storageBucket: "iwt-note-site-99dd9.firebasestorage.app",
        messagingSenderId: "512040159653",
        appId: "1:512040159653:web:11e9324302888a1037404c",
        measurementId: "G-57RJSQ0XR2"
    };

    // ─── Initialize Firebase ──────────────────────────────
    let app, auth, database, provider;

    try {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        provider = new firebase.auth.GoogleAuthProvider();

        // Request email scope
        provider.addScope('email');
        provider.addScope('profile');

        console.log('[Firebase Auth] ✅ Firebase initialized successfully');
    } catch (error) {
        console.error('[Firebase Auth] ❌ Failed to initialize Firebase:', error);
        return; // Stop execution if Firebase fails to initialize
    }

    // Database is optional — don't let it kill auth
    try {
        database = firebase.database();
        console.log('[Firebase Auth] ✅ Realtime Database connected');
    } catch (error) {
        console.warn('[Firebase Auth] ⚠️ Realtime Database not available (missing databaseURL?):', error.message);
        database = null;
    }

    // ─── Auth Container Reference ─────────────────────────
    let authContainer = null;

    // ─── Google SVG Icon ──────────────────────────────────
    const GOOGLE_ICON_SVG = `<svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>`;

    // ─── Render Auth UI ───────────────────────────────────

    /**
     * Renders the sign-in button (signed-out state)
     */
    function renderSignInButton() {
        if (!authContainer) return;

        authContainer.innerHTML = `
      <button class="firebase-signin-btn firebase-fade-in" id="firebase-signin-btn" aria-label="Sign in with Google">
        ${GOOGLE_ICON_SVG}
        <span class="btn-text">Sign in with Google</span>
      </button>
    `;

        // Attach click handler
        const btn = document.getElementById('firebase-signin-btn');
        if (btn) {
            btn.addEventListener('click', handleSignIn);
        }
    }

    /**
     * Renders the user profile card (signed-in state)
     * @param {Object} user - Firebase User object
     */
    function renderUserProfile(user) {
        if (!authContainer) return;

        const displayName = user.displayName || 'User';
        const email = user.email || '';
        const photoURL = user.photoURL;
        const initial = displayName.charAt(0).toUpperCase();

        // Build avatar HTML (photo or default with initial)
        const avatarHTML = photoURL
            ? `<img class="firebase-user-avatar" src="${photoURL}" alt="${displayName}" referrerpolicy="no-referrer">`
            : `<div class="firebase-user-avatar-default">${initial}</div>`;

        authContainer.innerHTML = `
      <div class="firebase-user-card firebase-fade-in">
        <div class="firebase-user-info">
          ${avatarHTML}
          <div class="firebase-user-details">
            <div class="firebase-user-name" title="${displayName}">${displayName}</div>
            <div class="firebase-user-email" title="${email}">${email}</div>
          </div>
        </div>
        <div class="firebase-auth-status">
          <span class="status-dot"></span>
          <span>Signed in</span>
        </div>
        <button class="firebase-signout-btn" id="firebase-signout-btn" aria-label="Sign out">
          <span class="signout-icon">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    `;

        // Attach sign-out handler
        const signOutBtn = document.getElementById('firebase-signout-btn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', handleSignOut);
        }
    }

    /**
     * Renders a loading spinner while auth state resolves
     */
    function renderLoading() {
        if (!authContainer) return;

        authContainer.innerHTML = `
      <div class="firebase-auth-loading">
        <div class="firebase-auth-spinner"></div>
      </div>
    `;
    }

    /**
     * Renders an error message
     * @param {string} message - Error message to display
     */
    function renderError(message) {
        if (!authContainer) return;

        // Show error temporarily, then restore sign-in button
        const errorDiv = document.createElement('div');
        errorDiv.className = 'firebase-auth-error';
        errorDiv.textContent = message;
        authContainer.prepend(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // ─── Auth Handlers ────────────────────────────────────

    /**
     * Handles Google Sign-In via popup
     */
    async function handleSignIn() {
        console.log('[Firebase Auth] 🔄 Starting Google Sign-In...');

        const btn = document.getElementById('firebase-signin-btn');
        if (btn) {
            btn.disabled = true;
            btn.querySelector('.btn-text').textContent = 'Signing in...';
        }

        try {
            const result = await auth.signInWithPopup(provider);
            const user = result.user;
            console.log('[Firebase Auth] ✅ Signed in as:', user.displayName, user.email);

            // Save user data to database
            await saveUserData(user);

            // Track login event
            await trackLoginEvent(user, 'login');

        } catch (error) {
            console.error('[Firebase Auth] ❌ Sign-in error:', error);

            // Handle specific error codes
            let errorMessage = 'Sign-in failed. Please try again.';

            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Sign-in cancelled.';
                    console.log('[Firebase Auth] ℹ️ User closed the sign-in popup');
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Pop-up blocked. Please allow pop-ups for this site.';
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage = 'Only one sign-in window allowed at a time.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Check your connection.';
                    break;
                case 'auth/unauthorized-domain':
                    errorMessage = 'This domain is not authorized in Firebase.';
                    break;
            }

            // Re-render sign-in button
            renderSignInButton();
            renderError(errorMessage);
        }
    }

    /**
     * Handles sign-out
     */
    async function handleSignOut() {
        console.log('[Firebase Auth] 🔄 Signing out...');

        try {
            const user = auth.currentUser;

            // Track logout event before signing out
            if (user) {
                await trackLoginEvent(user, 'logout');
            }

            await auth.signOut();
            console.log('[Firebase Auth] ✅ Signed out successfully');

        } catch (error) {
            console.error('[Firebase Auth] ❌ Sign-out error:', error);
            renderError('Sign-out failed. Please try again.');
        }
    }

    // ─── Database Functions ───────────────────────────────

    /**
     * Saves/updates user profile data in Realtime Database
     * Path: /users/{uid}
     * @param {Object} user - Firebase User object
     */
    async function saveUserData(user) {
        if (!database) {
            console.warn('[Firebase Auth] ⚠️ Database not available, skipping user data save');
            return;
        }
        try {
            const userRef = database.ref('users/' + user.uid);
            const snapshot = await userRef.once('value');
            const existingData = snapshot.val();

            const userData = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                lastLogin: firebase.database.ServerValue.TIMESTAMP
            };

            // Only set createdAt on first login
            if (!existingData || !existingData.createdAt) {
                userData.createdAt = firebase.database.ServerValue.TIMESTAMP;
            }

            await userRef.update(userData);
            console.log('[Firebase Auth] 💾 User data saved to /users/' + user.uid);

        } catch (error) {
            console.error('[Firebase Auth] ❌ Failed to save user data:', error);
        }
    }

    /**
     * Tracks login/logout events in Realtime Database
     * Path: /login-history/{uid}/{pushId}
     * @param {Object} user - Firebase User object
     * @param {string} action - 'login' or 'logout'
     */
    async function trackLoginEvent(user, action) {
        if (!database) {
            console.warn('[Firebase Auth] ⚠️ Database not available, skipping event tracking');
            return;
        }
        try {
            const historyRef = database.ref('login-history/' + user.uid);
            const newEventRef = historyRef.push();

            await newEventRef.set({
                uid: user.uid,
                email: user.email || '',
                action: action,
                timestamp: new Date().toISOString(),
                page: window.location.pathname
            });

            console.log(`[Firebase Auth] 📝 Tracked ${action} event for ${user.email}`);

        } catch (error) {
            console.error(`[Firebase Auth] ❌ Failed to track ${action} event:`, error);
        }
    }

    // ─── Auth State Observer ──────────────────────────────

    /**
     * Listen for auth state changes.
     * This is the primary method for detecting user state — NOT currentUser.
     */
    function initAuthStateListener() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // ✅ User is signed in
                console.log('[Firebase Auth] 👤 Auth state: SIGNED IN', user.email);

                // Update global user reference
                window.currentUser = user;

                // Render profile UI
                renderUserProfile(user);

                // Dispatch custom event for other scripts
                window.dispatchEvent(new CustomEvent('userSignedIn', {
                    detail: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    }
                }));

            } else {
                // ❌ User is signed out
                console.log('[Firebase Auth] 👤 Auth state: SIGNED OUT');

                // Clear global user reference
                window.currentUser = null;

                // Render sign-in button
                renderSignInButton();

                // Dispatch custom event for other scripts
                window.dispatchEvent(new CustomEvent('userSignedOut'));
            }
        });
    }

    // ─── Initialization ───────────────────────────────────

    /**
     * Initialize the Firebase Auth UI when DOM is ready
     */
    function init() {
        // Find the auth container
        authContainer = document.getElementById('firebase-auth-container');

        if (!authContainer) {
            console.warn('[Firebase Auth] ⚠️ #firebase-auth-container not found in DOM');
            return;
        }

        console.log('[Firebase Auth] 🚀 Initializing auth UI...');

        // Show loading state while auth resolves
        renderLoading();

        // Start listening for auth state changes
        initAuthStateListener();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ─── Global API ───────────────────────────────────────
    // Export for use by other scripts
    window.firebaseAuth = {
        /** Trigger Google Sign-In popup */
        signIn: handleSignIn,
        /** Sign out the current user */
        signOut: handleSignOut,
        /** Get the currently signed-in user (or null) */
        getCurrentUser: () => auth.currentUser,
        /** Get Firebase Auth instance */
        getAuth: () => auth,
        /** Get Firebase Database instance */
        getDatabase: () => database,
        /** Render a Google Sign-In button inside any container by ID */
        renderSignInButtonIn: (containerId) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = `
                <button class="firebase-signin-btn firebase-fade-in" id="firebase-guard-signin-btn" aria-label="Sign in with Google">
                    ${GOOGLE_ICON_SVG}
                    <span class="btn-text">Sign in with Google</span>
                </button>
            `;
            const btn = document.getElementById('firebase-guard-signin-btn');
            if (btn) btn.addEventListener('click', handleSignIn);
        },
        /** Get the Google icon SVG markup */
        getGoogleIconSVG: () => GOOGLE_ICON_SVG
    };

    console.log('[Firebase Auth] 📦 window.firebaseAuth API exported');

})();
