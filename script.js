// Menu Data
const menuData = [
    { id: 1, name: "Honey Cinnamon Latte", price: 5.50 },
    { id: 2, name: "Butter Croissant", price: 4.25 },
    { id: 3, name: "Caramel Cold Brew", price: 5.25 },
    { id: 4, name: "Avocado Toast", price: 8.50 },
    { id: 5, name: "Matcha Green Tea Latte", price: 5.75 },
    { id: 6, name: "Blueberry Almond Muffin", price: 3.75 }
];

let cart = {};

// Tab Switching Logic
function switchTab(tabId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.getElementById('nav-' + tabId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Order Form Items
function renderOrderItems() {
    const container = document.getElementById('order-items-list');
    if (!container) return;
    container.innerHTML = '';

    menuData.forEach(item => {
        const qty = cart[item.id] || 0;
        const div = document.createElement('div');
        div.className = 'order-item-select';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <div style="color: var(--text-muted); font-size: 0.9rem;">$${item.price.toFixed(2)}</div>
            </div>
            <div class="qty-controls">
                <button class="btn-qty" onclick="updateQty(${item.id}, -1)">-</button>
                <span style="font-weight: 600; min-width: 20px; text-align: center;">${qty}</span>
                <button class="btn-qty" onclick="updateQty(${item.id}, 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    });
    updateSummary();
}

function updateQty(id, change) {
    const current = cart[id] || 0;
    const updated = Math.max(0, current + change);
    if (updated === 0) {
        delete cart[id];
    } else {
        cart[id] = updated;
    }
    renderOrderItems();
}

function quickAddToOrder(name, price) {
    const item = menuData.find(m => m.name === name);
    if (item) {
        cart[item.id] = (cart[item.id] || 0) + 1;
        switchTab('order');
        renderOrderItems();
    }
}

function updateSummary() {
    const summaryContainer = document.getElementById('summary-items');
    if (!summaryContainer) return;
    summaryContainer.innerHTML = '';
    
    let subtotal = 0;
    let hasItems = false;

    menuData.forEach(item => {
        const qty = cart[item.id];
        if (qty > 0) {
            hasItems = true;
            const lineTotal = item.price * qty;
            subtotal += lineTotal;

            const row = document.createElement('div');
            row.className = 'summary-row';
            row.innerHTML = `<span>${item.name} x${qty}</span><span>$${lineTotal.toFixed(2)}</span>`;
            summaryContainer.appendChild(row);
        }
    });

    if (!hasItems) {
        summaryContainer.innerHTML = '<p style="color: var(--text-muted);">No items selected yet.</p>';
    }

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.getElementById('subtotal-val').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('tax-val').textContent = '$' + tax.toFixed(2);
    document.getElementById('total-val').textContent = '$' + total.toFixed(2);
}

function processOrder() {
    const name = document.getElementById('order-name').value.trim();
    const phone = document.getElementById('order-phone').value.trim();
    const toast = document.getElementById('order-toast');

    if (Object.keys(cart).length === 0) {
        alert('Please add at least one item to your order.');
        return;
    }
    if (!name || !phone) {
        alert('Please enter your name and phone number to complete the order.');
        return;
    }

    toast.style.display = 'block';
    toast.textContent = `Thank you, ${name}! Your order has been placed successfully and will be ready soon.`;
    cart = {};
    document.getElementById('order-name').value = '';
    document.getElementById('order-phone').value = '';
    renderOrderItems();

    setTimeout(() => { toast.style.display = 'none'; }, 6000);
}

function handleReservation(event) {
    event.preventDefault();
    const name = document.getElementById('res-name').value;
    const people = document.getElementById('res-people').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const toast = document.getElementById('res-toast');

    toast.style.display = 'block';
    toast.textContent = `Reservation Confirmed for ${name} (${people} guests) on ${date} at ${time}. We look forward to seeing you!`;
    
    document.getElementById('reservation-form').reset();

    setTimeout(() => { toast.style.display = 'none'; }, 6000);
}

// Store Coordinates (Latitude, Longitude)
const STORES = {
    buford: {
        name: "Mall of Georgia Location (Buford)",
        lat: 34.0655,
        lng: -83.9850,
        elementId: "card-buford"
    },
    suwanee: {
        name: "Suwanee Town Center Location",
        lat: 34.0515,
        lng: -84.0713,
        elementId: "card-suwanee"
    }
};

// North GA / Local ZIP Code Database (Lat/Lng coordinates)
const ZIP_DATABASE = {
    "30519": { lat: 34.0655, lng: -83.9850 }, // Buford (Mall of GA area)
    "30518": { lat: 34.1165, lng: -84.0033 }, // Buford / Sugar Hill
    "30515": { lat: 34.1332, lng: -83.9982 }, // Buford
    "30024": { lat: 34.0515, lng: -84.0713 }, // Suwanee
    "30043": { lat: 34.0012, lng: -83.9921 }, // Lawrenceville (North)
    "30044": { lat: 33.9482, lng: -84.0242 }, // Lawrenceville (South)
    "30045": { lat: 33.9511, lng: -83.9612 }, // Lawrenceville
    "30046": { lat: 33.9542, lng: -83.9875 }, // Lawrenceville
    "30097": { lat: 34.0152, lng: -84.1412 }, // Duluth / Johns Creek
    "30096": { lat: 33.9621, lng: -84.1402 }, // Duluth
    "30040": { lat: 34.2071, lng: -84.1401 }, // Cumming
    "30041": { lat: 34.1685, lng: -84.0931 }, // Cumming (South)
    "30542": { lat: 34.1521, lng: -83.9212 }, // Flowery Branch
    "30501": { lat: 34.2975, lng: -83.8242 }, // Gainesville
    "30005": { lat: 34.0721, lng: -84.2152 }, // Alpharetta
    "30004": { lat: 34.1202, lng: -84.2812 }, // Alpharetta
    "30022": { lat: 34.0321, lng: -84.2312 }  // Alpharetta / Johns Creek
};

// Calculate actual distance in miles using the Haversine formula
function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function findClosestLocation() {
    const zipInput = document.getElementById('zip-input').value.trim();
    const resultDiv = document.getElementById('zip-result');
    const bufordCard = document.getElementById('card-buford');
    const suwaneeCard = document.getElementById('card-suwanee');

    // Reset card highlights
    if (bufordCard) bufordCard.style.border = 'none';
    if (suwaneeCard) suwaneeCard.style.border = 'none';

    if (!zipInput || zipInput.length !== 5 || isNaN(zipInput)) {
        resultDiv.style.color = 'var(--accent-bold)';
        resultDiv.textContent = '⚠️ Please enter a valid 5-digit ZIP code.';
        return;
    }

    let coords = ZIP_DATABASE[zipInput];

    // Fallback logic for unlisted GA / US ZIP codes based on numeric proximity
    if (!coords) {
        const zipNum = parseInt(zipInput, 10);
        if (zipNum >= 30500 && zipNum <= 30599) {
            coords = { lat: 34.1000, lng: -83.9800 }; 
        } else if (zipNum >= 30000 && zipNum <= 30399) {
            coords = { lat: 33.9500, lng: -84.1000 }; 
        } else {
            coords = { lat: 34.0500, lng: -84.0000 }; 
        }
    }

    // Calculate distance to both stores
    const distBuford = calculateDistanceMiles(coords.lat, coords.lng, STORES.buford.lat, STORES.buford.lng);
    const distSuwanee = calculateDistanceMiles(coords.lat, coords.lng, STORES.suwanee.lat, STORES.suwanee.lng);

    resultDiv.style.color = 'var(--secondary)';

    if (distBuford <= distSuwanee) {
        resultDiv.textContent = `📍 Nearest store to ${zipInput}: ${STORES.buford.name} (~${distBuford.toFixed(1)} miles away)`;
        if (bufordCard) bufordCard.style.border = '2px solid var(--accent-bold)';
    } else {
        resultDiv.textContent = `📍 Nearest store to ${zipInput}: ${STORES.suwanee.name} (~${distSuwanee.toFixed(1)} miles away)`;
        if (suwaneeCard) suwaneeCard.style.border = '2px solid var(--accent-bold)';
    }
}

// ... [other functions like handleReservation, processOrder, etc.]

// PASTE THE ZIP CALCULATOR CODE RIGHT HERE

// DOM Initialization (This stays at the very bottom)
document.addEventListener('DOMContentLoaded', () => {
    const resDateElem = document.getElementById('res-date');
    if (resDateElem) {
        resDateElem.valueAsDate = new Date();
    }
    renderOrderItems();
});