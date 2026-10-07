/* Campus Store POS Kiosk
 * Flow: Select Items -> Review Order -> Payment Method -> Pay -> Success -> Receipt -> New Transaction
 * All money is stored in centavos (integers) to avoid floating-point errors.
 */
'use strict';

// ---------- Data ----------
const PRODUCTS = [
    { id: 1, name: 'Coffee', price: 4500, emoji: '☕', stock: 30 },
    { id: 2, name: 'Sandwich', price: 5000, emoji: '🥪', stock: 25 },
    { id: 3, name: 'Soft Drink', price: 3500, emoji: '🥤', stock: 40 },
    { id: 4, name: 'Cookies', price: 2500, emoji: '🍪', stock: 35 },
    { id: 5, name: 'Bottled Water', price: 2000, emoji: '💧', stock: 50 },
    { id: 6, name: 'Chocolate', price: 2500, emoji: '🍫', stock: 30 },
    { id: 7, name: 'Notebook', price: 6000, emoji: '📓', stock: 15 },
    { id: 8, name: 'Ballpen', price: 1500, emoji: '🖊️', stock: 60 },
];

const STORE_NAME = 'CAMPUS STORE POS';
const COUNTER_KEY = 'pos_txn_counter';
const STOCK_KEY = 'pos_stock';

// ---------- State ----------
const state = {
    cart: {},          // { productId: qty }
    stock: {},         // { productId: remaining }
    method: null,
    receipt: null,     // snapshot of the completed transaction
    busy: false,       // blocks double-submits while "processing"
};

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const peso = (c) => '₱' + (c / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const safeGet = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } };

let toastTimer;
function toast(msg, type) {
    const t = $('toast');
    t.textContent = msg;
    t.className = 'toast show ' + (type || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.className = 'toast'; }, 2200);
}

function loadStock() {
    let saved = null;
    try { saved = JSON.parse(safeGet(STOCK_KEY)); } catch (e) { saved = null; }
    PRODUCTS.forEach((p) => {
        state.stock[p.id] = saved && Number.isInteger(saved[p.id]) ? saved[p.id] : p.stock;
    });
}
const saveStock = () => safeSet(STOCK_KEY, JSON.stringify(state.stock));

// ---------- Cart logic ----------
function cartLines() {
    return Object.keys(state.cart).map((k) => {
        const p = byId(Number(k));
        const qty = state.cart[k];
        return { id: p.id, name: p.name, qty, unit: p.price, subtotal: p.price * qty };
    });
}
const cartTotal = () => cartLines().reduce((s, l) => s + l.subtotal, 0);
const cartCount = () => cartLines().reduce((s, l) => s + l.qty, 0);

function addItem(id) {
    const p = byId(id);
    const cur = state.cart[id] || 0;
    if (cur + 1 > state.stock[id]) {
        toast(`Insufficient stock: only ${state.stock[id]} ${p.name} available`, 'error');
        return;
    }
    state.cart[id] = cur + 1;
    toast(`${p.name} added`, 'ok');
    renderSelect();
}

function changeQty(id, delta) {
    const cur = state.cart[id] || 0;
    const next = cur + delta;
    if (delta > 0 && next > state.stock[id]) {
        toast(`Insufficient stock: only ${state.stock[id]} available`, 'error');
        return;
    }
    if (next <= 0) { removeItem(id); return; }   // quantity never goes negative
    state.cart[id] = next;
    renderSelect();
}

function removeItem(id) {
    delete state.cart[id];
    toast(`${byId(id).name} removed`);
    renderSelect();
}

// ---------- Rendering ----------
function renderSelect() {
    const grid = $('products');
    grid.innerHTML = '';
    PRODUCTS.forEach((p) => {
        const inCart = state.cart[p.id] || 0;
        const out = state.stock[p.id] <= 0;
        const b = document.createElement('button');
        b.className = 'product' + (out ? ' soldout' : '');
        b.setAttribute('aria-label', `${p.name} ${peso(p.price)}`);
        b.innerHTML =
            (inCart ? `<span class="badge">${inCart}</span>` : '') +
            `<span class="emoji">${p.emoji}</span><span class="name">${p.name}</span>` +
            `<span class="price">${peso(p.price)}</span>` +
            `<span class="stock">${out ? 'Sold out' : state.stock[p.id] + ' left'}</span>`;
        b.addEventListener('click', () => (out ? toast(`${p.name} is sold out`, 'error') : addItem(p.id)));
        grid.appendChild(b);
    });

    const lines = cartLines();
    const box = $('cartLines');
    if (!lines.length) {
        box.innerHTML = '<div class="empty">Your order is empty.<br>Tap an item to begin.</div>';
    } else {
        box.innerHTML = '';
        lines.forEach((l) => {
            const row = document.createElement('div');
            row.className = 'cart-line';
            row.innerHTML =
                `<div><div class="ln-name">${l.name}</div><div class="ln-unit">${peso(l.unit)} each</div></div>` +
                `<div class="ln-sub">${peso(l.subtotal)}</div>` +
                `<div class="qty-controls" style="grid-column:1 / -1"></div>`;
            const ctl = row.querySelector('.qty-controls');
            ctl.appendChild(mkBtn('🗑', 'qty-btn remove', `Remove ${l.name}`, () => removeItem(l.id)));
            ctl.appendChild(mkBtn('−', 'qty-btn', `Decrease ${l.name}`, () => changeQty(l.id, -1)));
            const q = document.createElement('span'); q.className = 'qty-val'; q.textContent = l.qty; ctl.appendChild(q);
            ctl.appendChild(mkBtn('+', 'qty-btn', `Increase ${l.name}`, () => changeQty(l.id, +1)));
            box.appendChild(row);
        });
    }
    $('cartTotal').textContent = peso(cartTotal());
    $('btnContinue').disabled = !lines.length;
    $('btnClear').disabled = !lines.length;
}

function mkBtn(text, cls, label, fn) {
    const b = document.createElement('button');
    b.className = cls; b.textContent = text; b.setAttribute('aria-label', label);
    b.addEventListener('click', fn);
    return b;
}

function orderTableHTML(lines, total) {
    return '<table><thead><tr><th>Product</th><th class="r">Qty</th><th class="r">Unit price</th><th class="r">Subtotal</th></tr></thead><tbody>' +
        lines.map((l) => `<tr><td>${l.name}</td><td class="r">${l.qty}</td><td class="r">${peso(l.unit)}</td><td class="r">${peso(l.subtotal)}</td></tr>`).join('') +
        `<tr class="total"><td>TOTAL</td><td></td><td></td><td class="r">${peso(total)}</td></tr></tbody></table>`;
}

// ---------- Navigation ----------
const STEP_OF = { select: 0, summary: 1, method: 2, cash: 2, qr: 2, card: 2, success: 3, receipt: 4 };
const STEP_KEYS = ['select', 'summary', 'method', 'success', 'receipt'];

function show(name) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    $('screen-' + name).classList.add('active');
    const cur = STEP_OF[name];
    document.querySelectorAll('#steps li').forEach((li) => {
        const i = STEP_KEYS.indexOf(li.dataset.step);
        li.classList.toggle('active', i === cur);
        li.classList.toggle('done', i < cur);
    });
    document.querySelectorAll('.dueText').forEach((e) => { e.textContent = peso(cartTotal()); });
    window.scrollTo(0, 0);
}

// ---------- Screen 2: summary ----------
function goSummary() {
    if (!cartLines().length) { toast('Please add at least one item', 'error'); return; }
    $('summaryTable').innerHTML = orderTableHTML(cartLines(), cartTotal());
    show('summary');
}

// ---------- Cash ----------
function buildCashUI() {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '⌫'];
    const pad = $('keypad');
    pad.innerHTML = '';
    keys.forEach((k) => pad.appendChild(mkBtn(k, '', 'Key ' + k, () => keyPress(k))));
}

function buildQuickAmounts() {
    const q = $('quickAmounts');
    q.innerHTML = '';
    const total = cartTotal();
    q.appendChild(mkBtn('Exact', '', 'Exact amount', () => setCash((total / 100).toFixed(2))));
    [50, 100, 200, 500, 1000].forEach((v) => {
        q.appendChild(mkBtn('₱' + v, '', `Pay ${v} pesos`, () => setCash(String(v))));
    });
    q.appendChild(mkBtn('Clear', '', 'Clear amount', () => setCash('')));
}

function setCash(v) { $('cashInput').value = v; $('cashError').textContent = ''; updateChangePreview(); }

function keyPress(k) {
    const inp = $('cashInput');
    if (k === '⌫') inp.value = inp.value.slice(0, -1);
    else if (k === '.' && inp.value.includes('.')) return;
    else inp.value += k;
    $('cashError').textContent = '';
    updateChangePreview();
}

// Returns { ok, cents, message }
function parseAmount(raw) {
    const s = String(raw).trim().replace(/^₱/, '').replace(/,/g, '');
    if (s === '') return { ok: false, message: 'Please enter the amount paid.' };
    if (!/^\d+(\.\d{1,2})?$/.test(s)) return { ok: false, message: 'Invalid amount. Please enter a positive number (e.g. 200.00).' };
    const cents = Math.round(parseFloat(s) * 100);
    if (cents <= 0) return { ok: false, message: 'Invalid amount. Amount must be greater than ₱0.00.' };
    return { ok: true, cents };
}

function updateChangePreview() {
    const r = parseAmount($('cashInput').value);
    const total = cartTotal();
    $('cashChange').textContent = r.ok && r.cents >= total ? 'Change: ' + peso(r.cents - total) : '';
}

function payCash() {
    if (state.busy) return;
    const total = cartTotal();
    const r = parseAmount($('cashInput').value);
    if (!r.ok) { $('cashError').textContent = r.message; toast(r.message, 'error'); return; }
    if (r.cents < total) {
        const msg = `Insufficient payment. Please enter at least ${peso(total)}.`;
        $('cashError').textContent = msg; toast(msg, 'error');
        return;                                   // stays on payment screen, no receipt, no stock change
    }
    completeTransaction('Cash', r.cents);
}

// ---------- QR ----------
function qrSVG(seed) {
    const N = 25, cell = 8;
    let s = (seed % 2147483646) + 1;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const finder = (x, y) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
    let rects = '';
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        let on;
        if (finder(x, y)) {
            const fx = x < 8 ? x : x - (N - 7);
            const fy = y < 8 ? y : y - (N - 7);
            const ax = Math.abs(fx - 3), ay = Math.abs(fy - 3);
            const d = Math.max(ax, ay);
            on = fx >= 0 && fx <= 6 && fy >= 0 && fy <= 6 && d !== 2;
        } else on = rnd() > 0.5;
        if (on) rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}"/>`;
    }
    const size = N * cell;
    return `<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Simulated QR code" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><g fill="#000">${rects}</g></svg>`;
}

// ---------- Card ----------
function processCard() {
    if (state.busy) return;
    state.busy = true;
    $('cardMsg').textContent = 'Processing payment…';
    $('processing').classList.remove('hidden');
    setTimeout(() => {
        $('processing').classList.add('hidden');
        state.busy = false;
        completeTransaction('Credit/Debit Card', cartTotal());
    }, 2000);
}

// ---------- Complete transaction ----------
function nextTxnNumber() {
    const n = (parseInt(safeGet(COUNTER_KEY), 10) || 0) + 1;
    safeSet(COUNTER_KEY, String(n));
    return `TXN-${new Date().getFullYear()}-${String(n).padStart(5, '0')}`;
}

function completeTransaction(method, paidCents) {
    const lines = cartLines();
    const total = cartTotal();
    // Last safety checks - an invalid payment must never create a receipt
    if (!lines.length || paidCents < total) { toast('Payment could not be completed', 'error'); return; }
    for (const l of lines) {
        if (l.qty > state.stock[l.id]) { toast(`Insufficient stock for ${l.name}`, 'error'); return; }
    }
    lines.forEach((l) => { state.stock[l.id] -= l.qty; });   // deduct stock only after success
    saveStock();

    state.receipt = {
        txn: nextTxnNumber(),
        date: new Date(),
        lines, total, method,
        paid: paidCents,
        change: paidCents - total,
    };
    renderSuccess();
    show('success');
    toast('Transaction completed successfully', 'ok');
}

function renderSuccess() {
    const r = state.receipt;
    $('successDetails').innerHTML = [
        ['Transaction No.', r.txn],
        ['Transaction amount', peso(r.total)],
        ['Payment method', r.method],
        ['Amount paid', peso(r.paid)],
        ['Change', peso(r.change)],
    ].map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`).join('');
}

function renderReceipt() {
    const r = state.receipt;
    const d = r.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const t = r.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    $('receipt').innerHTML =
        `<h2>${STORE_NAME}</h2><div class="meta">Transaction No.: ${r.txn}<br>Date: ${d} ${t}</div><hr>` +
        r.lines.map((l) =>
            `<div class="row"><span>${l.name}</span><span>${peso(l.subtotal)}</span></div>` +
            `<div class="row" style="color:#666"><span>&nbsp;&nbsp;${l.qty} × ${peso(l.unit)}</span><span></span></div>`).join('') +
        `<hr><div class="row strong"><span>TOTAL</span><span>${peso(r.total)}</span></div>` +
        `<div class="row"><span>Payment method</span><span>${r.method}</span></div>` +
        `<div class="row"><span>Amount paid</span><span>${peso(r.paid)}</span></div>` +
        `<div class="row"><span>Change</span><span>${peso(r.change)}</span></div>` +
        `<div class="status">Payment Successful</div>`;
    show('receipt');
}

// ---------- New transaction ----------
function newTransaction() {
    state.cart = {};
    state.method = null;
    state.receipt = null;
    state.busy = false;
    $('cashInput').value = '';
    $('cashError').textContent = '';
    $('cashChange').textContent = '';
    $('summaryTable').innerHTML = '';
    $('receipt').innerHTML = '';
    $('successDetails').innerHTML = '';
    $('cardMsg').textContent = 'Please tap, insert, or swipe your card.';
    renderSelect();
    show('select');
}

// ---------- Wire up ----------
function chooseMethod(m) {
    state.method = m;
    const total = cartTotal();
    if (m === 'Cash') {
        $('cashInput').value = ''; $('cashError').textContent = ''; $('cashChange').textContent = '';
        buildQuickAmounts();
        show('cash');
    } else if (m === 'QR Payment') {
        $('qrBox').innerHTML = qrSVG(total + Date.now() % 9973);
        show('qr');
    } else {
        $('cardMsg').textContent = 'Please tap, insert, or swipe your card.';
        show('card');
    }
}

function init() {
    loadStock();
    buildCashUI();
    renderSelect();

    $('btnContinue').addEventListener('click', goSummary);
    $('btnClear').addEventListener('click', () => { state.cart = {}; toast('Order cleared'); renderSelect(); });
    $('btnSummaryBack').addEventListener('click', () => { renderSelect(); show('select'); });   // cart is preserved
    $('btnSummaryContinue').addEventListener('click', () => show('method'));
    $('btnMethodBack').addEventListener('click', goSummary);
    document.querySelectorAll('.method-btn').forEach((b) => b.addEventListener('click', () => chooseMethod(b.dataset.method)));
    ['btnCashBack', 'btnQrBack', 'btnCardBack'].forEach((id) => $(id).addEventListener('click', () => { if (!state.busy) show('method'); }));
    $('btnPayNow').addEventListener('click', payCash);
    $('cashInput').addEventListener('input', () => { $('cashError').textContent = ''; updateChangePreview(); });
    $('cashInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') payCash(); });
    $('btnQrConfirm').addEventListener('click', () => completeTransaction('QR Payment', cartTotal()));
    $('btnCardProcess').addEventListener('click', processCard);
    $('btnViewReceipt').addEventListener('click', renderReceipt);
    $('btnPrint').addEventListener('click', () => window.print());
    $('btnNew').addEventListener('click', newTransaction);
    show('select');
}

document.addEventListener('DOMContentLoaded', init);
