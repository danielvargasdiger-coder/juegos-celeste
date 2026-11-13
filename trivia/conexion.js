import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import { config } from './config.js';

export const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getDatabase(app);

let desfase = 0;
onValue(ref(db, '.info/serverTimeOffset'), s => { desfase = s.val() || 0; });
export const ahora = () => Date.now() + desfase;
