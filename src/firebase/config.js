import { getAnalytics, isSupported as isAnalyticsSupported } from 'firebase/analytics'
import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// 🔥 Use ENV FIRST, fallback to hardcoded (para di ka mag-white screen)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD1xpElM8KwjQmduBz-qa1Uyoz_D3pn1ps",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "medconnectph-12721.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "medconnectph-12721",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "medconnectph-12721.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "793708519033",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:793708519033:web:13aef8fa9dcab6bc09bea8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-GDVHSY6Z2H"
}

// Debug (safe to remove later)
console.log("Firebase ENV loaded:", {
  apiKey: firebaseConfig.apiKey ? "OK" : "MISSING",
  authDomain: firebaseConfig.authDomain ? "OK" : "MISSING",
})

// Validate config
const requiredConfig = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',  
  'messagingSenderId',
  'appId',
]

const missingConfig = requiredConfig.filter((key) => !firebaseConfig[key])

if (missingConfig.length > 0) {
  throw new Error(`Missing Firebase config value(s): ${missingConfig.join(', ')}`)
}

// Init Firebase safely
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

// Services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Analytics (safe check for browser)
export const analyticsPromise =
  typeof window !== 'undefined' && firebaseConfig.measurementId
    ? isAnalyticsSupported().then((supported) =>
        supported ? getAnalytics(app) : null
      )
    : Promise.resolve(null)

export default app