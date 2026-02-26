/* =============================================
   IWT NOTE SITE — Authentication Guard
   Requires sign-in before accessing content
   ============================================= */

(function () {
    'use strict';

    // ─── Configuration ───────────────────────────────────
    const AUTH_GUARD_ID = 'auth-guard-screen';

    // Secret bypass for development/testing
    // Usage: ?bypass=dev123
    const BYPASS_KEY = 'dev123';

    // ─── AuthGuard Class ─────────────────────────────────
    class AuthGuard {
        constructor() {
            this.isAuthenticated = false;
            this.wasAuthenticated = false; // Track if user WAS signed in (for detecting real sign-outs)
            this.guardScreen = null;
            this.initialized = false;

            console.log('[Auth Guard] 🛡️ Initializing...');

            // Check for bypass parameter
            if (this._checkBypass()) {
                console.log('[Auth Guard] ⚡ Bypass mode active');
                this._showContent();
                return;
            }

            // Inject the login screen HTML into the page
            this._injectLoginScreen();

            // Immediately hide content to prevent flash
            this._hideContent();

            // Start listening for auth state
            this._checkAuthState();
        }

        /**
         * Check if bypass parameter is present in URL
         * @returns {boolean}
         */
        _checkBypass() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                return urlParams.get('bypass') === BYPASS_KEY;
            } catch (e) {
                return false;
            }
        }

        /**
         * Inject the login screen HTML into the DOM
         */
        _injectLoginScreen() {
            // Don't inject if already exists
            if (document.getElementById(AUTH_GUARD_ID)) {
                this.guardScreen = document.getElementById(AUTH_GUARD_ID);
                return;
            }

            const guardHTML = `
                <div id="${AUTH_GUARD_ID}" class="auth-guard-screen" style="display: none;">
                    <div class="auth-guard-container">
                        <div class="auth-guard-content">
                            <div class="auth-guard-logo">
                                <div class="auth-guard-logo-icon">&lt;/&gt;</div>
                            </div>
                            <h1 class="auth-guard-title">IWT Note Site</h1>
                            <p class="auth-guard-subtitle">Educational Web Development Course</p>

                            <div class="auth-guard-message">
                                <div class="auth-guard-lock-icon">🔒</div>
                                <h2>Sign In Required</h2>
                                <p>Please sign in with Google to access course materials and track your progress.</p>
                            </div>

                            <div id="auth-guard-button" class="auth-guard-btn-wrapper"></div>

                            <div id="auth-guard-error" class="auth-guard-error-msg" style="display: none;"></div>

                            <div class="auth-guard-features">
                                <h3>What you'll get access to:</h3>
                                <ul>
                                    <li><span class="feature-icon">📖</span> All lectures — HTML, CSS, JavaScript, PHP</li>
                                    <li><span class="feature-icon">📊</span> Track your learning progress</li>
                                    <li><span class="feature-icon">💻</span> Interactive code examples & live editor</li>
                                    <li><span class="feature-icon">💾</span> Save your work across devices</li>
                                </ul>
                            </div>

                            <div class="auth-guard-footer">
                                <p>University of Colombo School of Computing</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('afterbegin', guardHTML);
            this.guardScreen = document.getElementById(AUTH_GUARD_ID);
        }

        /**
         * Hide all main page content immediately
         */
        _hideContent() {
            // Hide sidebar, main content, overlays, TTS panels
            const selectors = [
                '.page-wrapper',
                '.sidebar',
                '.sidebar-overlay',
                '.main-content',
                'main',
                'nav',
                'header',
                '.tts-panel',
                '.error-page'
            ];

            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.classList.add('auth-guard-hidden');
                });
            });

            console.log('[Auth Guard] 🙈 Content hidden');
        }

        /**
         * Show all page content
         */
        _showContent() {
            // Hide the guard screen
            if (this.guardScreen) {
                this.guardScreen.style.display = 'none';
                this.guardScreen.classList.add('auth-guard-dismissed');
            }

            // Remove hidden class from all elements
            document.querySelectorAll('.auth-guard-hidden').forEach(el => {
                el.classList.remove('auth-guard-hidden');
            });

            console.log('[Auth Guard] ✅ Content shown');
        }

        /**
         * Show the login screen
         */
        _showLoginScreen() {
            if (!this.guardScreen) return;

            // Show the guard screen
            this.guardScreen.style.display = 'flex';

            // Render the sign-in button using Firebase Auth API
            this._renderSignInButton();

            console.log('[Auth Guard] 🔒 Login screen displayed');
        }

        /**
         * Render the Google Sign-In button in the guard screen
         */
        _renderSignInButton() {
            const btnContainer = document.getElementById('auth-guard-button');
            if (!btnContainer) return;

            // Use the Firebase Auth API if available
            if (window.firebaseAuth && window.firebaseAuth.renderSignInButtonIn) {
                window.firebaseAuth.renderSignInButtonIn('auth-guard-button');

                // Style the button larger for the login screen
                const btn = btnContainer.querySelector('.firebase-signin-btn');
                if (btn) {
                    btn.classList.add('auth-guard-signin-btn-large');
                }
            } else {
                // Fallback: render a basic button that retries
                btnContainer.innerHTML = `
                    <button class="firebase-signin-btn auth-guard-signin-btn-large" onclick="location.reload()">
                        <span class="btn-text">⟳ Loading... Click to retry</span>
                    </button>
                `;
                console.warn('[Auth Guard] ⚠️ Firebase Auth API not available yet');
            }
        }

        /**
         * Show an error message on the login screen
         * @param {string} message
         */
        _showError(message) {
            const errorEl = document.getElementById('auth-guard-error');
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.style.display = 'block';

                setTimeout(() => {
                    errorEl.style.display = 'none';
                }, 6000);
            }
        }

        /**
         * Listen for Firebase Auth state changes
         */
        _checkAuthState() {
            // Wait for Firebase to be available
            if (typeof firebase === 'undefined' || !firebase.auth) {
                console.error('[Auth Guard] ❌ Firebase not loaded');
                this._showLoginScreen();
                this._showError('Firebase failed to load. Please refresh the page.');
                return;
            }

            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    // ✅ User is signed in
                    console.log('[Auth Guard] 🟢 User authenticated:', user.email);
                    this.isAuthenticated = true;
                    this.wasAuthenticated = true;
                    this._showContent();
                } else {
                    // ❌ User is NOT signed in
                    console.log('[Auth Guard] 🔴 User not authenticated');

                    // If user WAS authenticated and now isn't, this is a real sign-out
                    if (this.wasAuthenticated) {
                        console.log('[Auth Guard] 🔄 Sign-out detected, reloading...');
                        this.wasAuthenticated = false;
                        window.location.reload();
                        return;
                    }

                    this.isAuthenticated = false;
                    this._hideContent();
                    this._showLoginScreen();
                }

                this.initialized = true;
            });
        }
    }

    // ─── Initialize ──────────────────────────────────────
    // Start as early as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new AuthGuard();
        });
    } else {
        new AuthGuard();
    }

    // Sign-out is now handled inside _checkAuthState via onAuthStateChanged
    // No need for a separate event listener that causes reload loops

})();
