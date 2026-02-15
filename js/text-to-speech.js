/* =============================================
   IWT NOTE SITE — Text-to-Speech Engine
   ============================================= */

class TextToSpeech {
    constructor() {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.currentSpeed = 1;
        this.currentVoice = null;
        this.sections = [];
        this.currentSectionIndex = 0;
        this.englishVoices = [];

        this.loadPreferences();
        this.init();
    }

    /* ---------- Initialisation ---------- */

    init() {
        this.sections = this.getContentSections();
        this.populateVoices();
        this.attachEventListeners();

        // Voices load asynchronously in most browsers
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.populateVoices();
        }
    }

    /* ---------- Content extraction ---------- */

    getContentSections() {
        const mainContent = document.querySelector('.content-area');
        if (!mainContent) return [];

        const elements = mainContent.querySelectorAll(
            'p, h1, h2, h3, h4, li, td, th'
        );

        return Array.from(elements)
            .filter(el => {
                const text = el.textContent.trim();
                // Skip empty, single-char decorations, code blocks, and buttons
                if (text.length < 2) return false;
                if (el.closest('pre, code, .code-block, .code-header')) return false;
                if (el.closest('button, .copy-btn')) return false;
                return true;
            })
            .map(el => ({ element: el, text: el.textContent.trim() }));
    }

    /* ---------- Voice management ---------- */

    populateVoices() {
        const voices = this.synth.getVoices();
        const voiceSelect = document.getElementById('voice-select');
        if (!voiceSelect || voices.length === 0) return;

        this.englishVoices = voices.filter(v => v.lang.startsWith('en'));

        // Fallback: if no English voices, show all voices
        if (this.englishVoices.length === 0) {
            this.englishVoices = voices;
        }

        voiceSelect.innerHTML = '';

        this.englishVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = voice.name + ' (' + voice.lang + ')';
            if (voice.default) option.textContent += ' — Default';
            voiceSelect.appendChild(option);
        });

        // Restore saved voice preference
        const savedVoiceIndex = localStorage.getItem('tts-voice');
        if (savedVoiceIndex !== null && savedVoiceIndex < this.englishVoices.length) {
            voiceSelect.value = savedVoiceIndex;
            this.currentVoice = this.englishVoices[savedVoiceIndex];
        } else {
            this.currentVoice = this.englishVoices[0] || null;
        }
    }

    /* ---------- Event listeners ---------- */

    attachEventListeners() {
        const $ = id => document.getElementById(id);

        // Toggle panel
        $('tts-toggle').addEventListener('click', () => {
            $('tts-controls').classList.toggle('hidden');
        });

        // Close panel
        $('tts-close').addEventListener('click', () => {
            $('tts-controls').classList.add('hidden');
        });

        // Play
        $('tts-play').addEventListener('click', () => {
            this.isPaused ? this.resume() : this.play();
        });

        // Pause
        $('tts-pause').addEventListener('click', () => this.pause());

        // Stop
        $('tts-stop').addEventListener('click', () => this.stop());

        // Skip prev / next
        $('tts-prev').addEventListener('click', () => this.skipSection(-1));
        $('tts-next').addEventListener('click', () => this.skipSection(1));

        // Speed buttons
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.speed-btn').forEach(b =>
                    b.classList.remove('active')
                );
                btn.classList.add('active');
                this.currentSpeed = parseFloat(btn.dataset.speed);
                localStorage.setItem('tts-speed', this.currentSpeed);

                // If already speaking, restart current section with new speed
                if (this.isPlaying) {
                    this.synth.cancel();
                    this.speakSection(this.currentSectionIndex);
                }
            });
        });

        // Voice selection
        $('voice-select').addEventListener('change', e => {
            this.currentVoice = this.englishVoices[e.target.value] || null;
            localStorage.setItem('tts-voice', e.target.value);
        });

        // Read selected text
        $('tts-read-selection').addEventListener('click', () =>
            this.readSelection()
        );

        // Keyboard shortcuts (only when panel is open)
        document.addEventListener('keydown', e => {
            const panelHidden = $('tts-controls').classList.contains('hidden');
            if (panelHidden) return;

            if (
                e.code === 'Space' &&
                e.target.tagName !== 'INPUT' &&
                e.target.tagName !== 'TEXTAREA' &&
                e.target.tagName !== 'SELECT'
            ) {
                e.preventDefault();
                if (this.isPlaying) this.pause();
                else if (this.isPaused) this.resume();
                else this.play();
            }

            if (e.code === 'Escape') {
                this.stop();
            }
        });
    }

    /* ---------- Playback ---------- */

    play() {
        if (this.sections.length === 0) {
            this.updateProgress('No readable content found.');
            return;
        }
        this.stop();
        this.currentSectionIndex = 0;
        this.speakSection(this.currentSectionIndex);
    }

    speakSection(index) {
        if (index < 0 || index >= this.sections.length) {
            this.stop();
            this.updateProgress('Finished reading.');
            return;
        }

        const section = this.sections[index];
        this.utterance = new SpeechSynthesisUtterance(section.text);
        this.utterance.rate = this.currentSpeed;
        if (this.currentVoice) this.utterance.voice = this.currentVoice;

        // Highlight
        this.highlightSection(section.element);

        // Progress
        this.updateProgress(
            'Reading ' + (index + 1) + ' of ' + this.sections.length
        );

        // Next section on end
        this.utterance.onend = () => {
            this.currentSectionIndex++;
            if (this.currentSectionIndex < this.sections.length) {
                this.speakSection(this.currentSectionIndex);
            } else {
                this.stop();
                this.updateProgress('Finished reading.');
            }
        };

        this.utterance.onerror = () => this.stop();

        this.synth.speak(this.utterance);
        this.isPlaying = true;
        this.isPaused = false;

        document.getElementById('tts-play').classList.add('hidden');
        document.getElementById('tts-pause').classList.remove('hidden');
    }

    pause() {
        if (!this.isPlaying) return;
        this.synth.pause();
        this.isPaused = true;
        this.isPlaying = false;

        document.getElementById('tts-play').classList.remove('hidden');
        document.getElementById('tts-pause').classList.add('hidden');
        this.updateProgress('Paused — section ' + (this.currentSectionIndex + 1));
    }

    resume() {
        if (!this.isPaused) return;
        this.synth.resume();
        this.isPaused = false;
        this.isPlaying = true;

        document.getElementById('tts-play').classList.add('hidden');
        document.getElementById('tts-pause').classList.remove('hidden');
        this.updateProgress(
            'Reading ' +
            (this.currentSectionIndex + 1) +
            ' of ' +
            this.sections.length
        );
    }

    stop() {
        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.currentSectionIndex = 0;

        // Clear highlights
        document.querySelectorAll('.tts-highlight').forEach(el =>
            el.classList.remove('tts-highlight')
        );

        document.getElementById('tts-play').classList.remove('hidden');
        document.getElementById('tts-pause').classList.add('hidden');
        this.updateProgress('Ready to play…');
    }

    skipSection(direction) {
        this.synth.cancel();
        this.currentSectionIndex += direction;
        if (this.currentSectionIndex < 0) this.currentSectionIndex = 0;
        if (this.currentSectionIndex >= this.sections.length) {
            this.stop();
            this.updateProgress('Finished reading.');
            return;
        }
        this.speakSection(this.currentSectionIndex);
    }

    readSelection() {
        const text = window.getSelection().toString().trim();
        if (!text) {
            this.updateProgress('Select some text first.');
            return;
        }
        this.stop();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = this.currentSpeed;
        if (this.currentVoice) utt.voice = this.currentVoice;
        utt.onend = () => this.updateProgress('Finished selected text.');
        this.synth.speak(utt);
        this.isPlaying = true;
        document.getElementById('tts-play').classList.add('hidden');
        document.getElementById('tts-pause').classList.remove('hidden');
        this.updateProgress('Reading selected text…');
    }

    /* ---------- UI helpers ---------- */

    highlightSection(element) {
        document.querySelectorAll('.tts-highlight').forEach(el =>
            el.classList.remove('tts-highlight')
        );
        element.classList.add('tts-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    updateProgress(text) {
        const el = document.querySelector('.progress-text');
        if (el) el.textContent = text;
    }

    /* ---------- Persistent preferences ---------- */

    loadPreferences() {
        const savedSpeed = localStorage.getItem('tts-speed');
        if (savedSpeed) {
            this.currentSpeed = parseFloat(savedSpeed);
            // UI update happens after DOM is ready via a micro-task
            setTimeout(() => {
                document.querySelectorAll('.speed-btn').forEach(btn => {
                    if (parseFloat(btn.dataset.speed) === this.currentSpeed) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }, 0);
        }
    }
}

/* ---------- Bootstrap ---------- */
document.addEventListener('DOMContentLoaded', () => {
    if ('speechSynthesis' in window) {
        new TextToSpeech();
    } else {
        const toggle = document.getElementById('tts-toggle');
        if (toggle) toggle.style.display = 'none';
    }
});
