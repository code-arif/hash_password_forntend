<template>
    <div class="app-wrapper">
        <!-- Animated background -->
        <div class="bg-orbs">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
        </div>

        <!-- Toast -->
        <transition name="toast-fade">
            <div v-if="toast.show" class="toast-notification">
                <span class="toast-icon">✓</span>
                {{ toast.message }}
            </div>
        </transition>

        <!-- Main Card -->
        <div class="hash-card">
            <!-- Header -->
            <div class="card-header-section">
                <div class="logo-mark">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                        <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="#B027F5" stroke-width="2" fill="none" />
                        <path d="M14 7L21 10.5V17.5L14 21L7 17.5V10.5L14 7Z" fill="#B027F5" opacity="0.3" />
                        <circle cx="14" cy="14" r="3" fill="#B027F5" />
                    </svg>
                </div>
                <div>
                    <h1 class="card-title">Laravel Hash Generator</h1>
                    <p class="card-subtitle">Generate secure password hashes for Laravel</p>
                </div>
            </div>

            <!-- Form Body -->
            <div class="card-body-section">

                <!-- Password Field -->
                <div class="field-group">
                    <label class="field-label">Password</label>
                    <div class="input-wrapper">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'" class="field-input"
                            :class="{ 'input-error': errors.password }" placeholder="Enter your password..."
                            @input="errors.password = ''" />
                        <button class="eye-btn" @click="showPassword = !showPassword" type="button">
                            <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        </button>
                    </div>
                    <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
                </div>

                <!-- Algorithm Dropdown -->
                <div class="field-group">
                    <label class="field-label">Algorithm</label>
                    <div class="select-wrapper">
                        <select v-model="algorithm" class="field-select">
                            <option value="bcrypt">bcrypt — Default Laravel driver</option>
                            <option value="argon2id">argon2id — Recommended Argon2</option>
                            <option value="argon2i">argon2i — Argon2 variant i</option>
                        </select>
                        <div class="select-arrow">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>
                    <div class="algo-badge">
                        <span v-if="algorithm === 'bcrypt'" class="badge-chip badge-blue">Cost factor: 10</span>
                        <span v-if="algorithm === 'argon2id'" class="badge-chip badge-green">Memory: 65536 KB · Best
                            security</span>
                        <span v-if="algorithm === 'argon2i'" class="badge-chip badge-orange">Side-channel
                            resistant</span>
                    </div>
                </div>

                <!-- Generate Button -->
                <button class="generate-btn" :class="{ loading: isLoading }" @click="generateHash"
                    :disabled="isLoading">
                    <span v-if="!isLoading" class="btn-content">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        Generate Hash
                    </span>
                    <span v-else class="btn-content">
                        <div class="spinner"></div>
                        Generating...
                    </span>
                    <div class="btn-shimmer"></div>
                </button>

                <!-- Output Section -->
                <transition name="slide-up">
                    <div v-if="hash || errors.api" class="output-section">
                        <div class="output-header">
                            <label class="field-label">Generated Hash</label>
                            <div class="output-meta" v-if="hash">
                                <span class="meta-chip">{{ algorithm }}</span>
                                <span class="meta-chip">{{ hash.length }} chars</span>
                            </div>
                        </div>

                        <div v-if="errors.api" class="error-box">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {{ errors.api }}
                        </div>

                        <div v-if="hash" class="hash-output-wrapper">
                            <textarea class="hash-output" :value="hash" readonly rows="3" ref="hashTextarea"></textarea>
                            <div class="hash-glow"></div>
                        </div>

                        <!-- Action Buttons -->
                        <div v-if="hash" class="action-row">
                            <button class="action-btn copy-btn" @click="copyHash">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                </svg>
                                Copy Hash
                            </button>
                            <button class="action-btn clear-btn" @click="clearAll">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                </svg>
                                Clear All
                            </button>
                        </div>
                    </div>
                </transition>

            </div>

            <!-- Footer -->
            <div class="card-footer-section">
                <span>Laravel 13 · PHP 8.4 · Bcrypt & Argon2 Support</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

const password = ref('')
const algorithm = ref('bcrypt')
const hash = ref('')
const isLoading = ref(false)
const showPassword = ref(false)
const hashTextarea = ref(null)

const errors = reactive({
    password: '',
    api: ''
})

const toast = reactive({
    show: false,
    message: ''
})

function showToast(message) {
    toast.message = message
    toast.show = true
    setTimeout(() => { toast.show = false }, 2800)
}

async function generateHash() {
    errors.password = ''
    errors.api = ''

    if (!password.value.trim()) {
        errors.password = 'Password is required to generate a hash.'
        return
    }

    isLoading.value = true
    hash.value = ''

    try {
        const response = await axios.post('/api/hash', {
            password: password.value,
            type: algorithm.value
        })
        hash.value = response.data.hash
        showToast('Hash generated successfully!')
    } catch (err) {
        if (err.response?.data?.message) {
            errors.api = err.response.data.message
        } else if (err.response?.status === 422) {
            errors.api = 'Validation failed. Please check your input.'
        } else if (err.code === 'ERR_NETWORK') {
            errors.api = 'Cannot reach the Laravel API. Make sure your backend is running on port 8000.'
        } else {
            errors.api = 'Something went wrong. Please try again.'
        }
    } finally {
        isLoading.value = false
    }
}

async function copyHash() {
    if (!hash.value) return
    try {
        await navigator.clipboard.writeText(hash.value)
        showToast('Copied to clipboard!')
    } catch {
        // Fallback
        if (hashTextarea.value) {
            hashTextarea.value.select()
            document.execCommand('copy')
            showToast('Copied to clipboard!')
        }
    }
}

function clearAll() {
    password.value = ''
    hash.value = ''
    errors.password = ''
    errors.api = ''
    algorithm.value = 'bcrypt'
    showPassword.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');


/* ── Layout ── */
.app-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    background: #fafafa;
    position: relative;
    overflow: hidden;
    font-family: "Roboto", sans-serif;
}

/* ── Animated background orbs ── */
.bg-orbs {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
}

.orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.12;
    animation: drift 18s ease-in-out infinite;
}

.orb-1 {
    width: 500px;
    height: 500px;
    background: #B027F5;
    top: -120px;
    left: -100px;
    animation-delay: 0s;
}

.orb-2 {
    width: 400px;
    height: 400px;
    background: #7c3aed;
    bottom: -80px;
    right: -100px;
    animation-delay: -6s;
}

.orb-3 {
    width: 300px;
    height: 300px;
    background: #ec4899;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: -12s;
}

@keyframes drift {

    0%,
    100% {
        transform: translate(0, 0) scale(1);
    }

    33% {
        transform: translate(30px, -20px) scale(1.05);
    }

    66% {
        transform: translate(-20px, 30px) scale(0.95);
    }
}

/* ── Card ── */
.hash-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 600px;
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 20px 60px -10px rgba(176, 39, 245, 0.12), 0 0 0 1px rgba(176, 39, 245, 0.08);
    overflow: hidden;
}

/* ── Card Header ── */
.card-header-section {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 28px 32px 24px;
    border-bottom: 1px solid #f3e8ff;
    background: linear-gradient(135deg, #fdf4ff 0%, #fafafa 100%);
}

.logo-mark {
    width: 52px;
    height: 52px;
    background: #fdf4ff;
    border: 2px solid #e9d5ff;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.card-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: #1a1a2e;
    margin: 0 0 2px;
    letter-spacing: -0.3px;
}

.card-subtitle {
    font-size: 13px;
    color: #9ca3af;
    margin: 0;
    font-weight: 400;
}

/* ── Card Body ── */
.card-body-section {
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* ── Fields ── */
.field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #6b7280;
}

.input-wrapper {
    position: relative;
}

.field-input {
    width: 100%;
    padding: 13px 46px 13px 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    color: #1f2937;
    background: #fafafa;
    transition: all 0.2s;
    outline: none;
    box-sizing: border-box;
}

.field-input:focus {
    border-color: #B027F5;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(176, 39, 245, 0.1);
}

.field-input.input-error {
    border-color: #f87171;
}

.field-input::placeholder {
    color: #d1d5db;
}

.eye-btn {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
}

.eye-btn:hover {
    color: #B027F5;
}

/* Select */
.select-wrapper {
    position: relative;
}

.field-select {
    width: 100%;
    padding: 13px 44px 13px 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    font-size: 14.5px;
    font-family: 'DM Sans', sans-serif;
    color: #1f2937;
    background: #fafafa;
    appearance: none;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;
}

.field-select:focus {
    border-color: #B027F5;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(176, 39, 245, 0.1);
}

.select-arrow {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #9ca3af;
}

/* Algo badges */
.algo-badge {
    margin-top: -2px;
}

.badge-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 20px;
}

.badge-blue {
    background: #eff6ff;
    color: #3b82f6;
}

.badge-green {
    background: #f0fdf4;
    color: #16a34a;
}

.badge-orange {
    background: #fff7ed;
    color: #ea580c;
}

/* Error text */
.error-text {
    font-size: 12.5px;
    color: #ef4444;
    font-weight: 500;
}

/* ── Generate Button ── */
.generate-btn {
    position: relative;
    width: 100%;
    padding: 15px;
    background: #B027F5;
    color: #fff;
    border: none;
    border-radius: 14px;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.25s;
    letter-spacing: 0.2px;
}

.generate-btn:hover:not(:disabled) {
    background: #9d22dc;
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(176, 39, 245, 0.35);
}

.generate-btn:active:not(:disabled) {
    transform: translateY(0);
}

.generate-btn:disabled {
    opacity: 0.75;
    cursor: not-allowed;
    transform: none;
}

.btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    z-index: 1;
}

.btn-shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.15) 50%, transparent 60%);
    transform: translateX(-100%);
    transition: transform 0.6s;
}

.generate-btn:hover .btn-shimmer {
    transform: translateX(100%);
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Output Section ── */
.output-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.output-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.output-meta {
    display: flex;
    gap: 6px;
}

.meta-chip {
    font-size: 10.5px;
    font-weight: 600;
    background: #f3e8ff;
    color: #B027F5;
    padding: 3px 9px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.error-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    color: #dc2626;
    font-size: 13.5px;
}

.hash-output-wrapper {
    position: relative;
}

.hash-output {
    width: 100%;
    padding: 14px 16px;
    border: 1.5px solid #e9d5ff;
    border-radius: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    line-height: 1.65;
    color: #6d28d9;
    background: #fdf4ff;
    resize: none;
    outline: none;
    box-sizing: border-box;
    word-break: break-all;
}

/* ── Action Buttons ── */
.action-row {
    display: flex;
    gap: 10px;
}

.action-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 11px;
    border-radius: 11px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    border: 1.5px solid transparent;
    transition: all 0.2s;
}

.copy-btn {
    background: #B027F5;
    color: #fff;
    border-color: #B027F5;
}

.copy-btn:hover {
    background: #9d22dc;
    border-color: #9d22dc;
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(176, 39, 245, 0.3);
}

.clear-btn {
    background: #fff;
    color: #6b7280;
    border-color: #e5e7eb;
}

.clear-btn:hover {
    border-color: #ef4444;
    color: #ef4444;
    background: #fef2f2;
    transform: translateY(-1px);
}

/* ── Footer ── */
.card-footer-section {
    padding: 14px 32px;
    border-top: 1px solid #f3f4f6;
    background: #fafafa;
    text-align: center;
    font-size: 11.5px;
    color: #d1d5db;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.3px;
}

/* ── Toast ── */
.toast-notification {
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    background: #1a1a2e;
    color: #fff;
    padding: 11px 20px;
    border-radius: 100px;
    font-size: 13.5px;
    font-weight: 500;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
}

.toast-icon {
    width: 20px;
    height: 20px;
    background: #B027F5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: all 0.3s;
}

.toast-fade-enter-from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
}

.toast-fade-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
}

/* ── Slide up animation ── */
.slide-up-enter-active {
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(12px);
}

/* ── Responsive ── */
@media (max-width: 480px) {
    .card-header-section {
        padding: 22px 20px 18px;
        gap: 12px;
    }

    .card-body-section {
        padding: 22px 20px;
        gap: 16px;
    }

    .card-footer-section {
        padding: 12px 20px;
    }

    .card-title {
        font-size: 18px;
    }

    .logo-mark {
        width: 44px;
        height: 44px;
    }

    .action-row {
        flex-direction: column;
    }
}
</style>