const counterSpan = document.getElementById('counter');
const helpfulBtn = document.getElementById('helpfulBtn');
let lastCount = 0;

async function fetchCounter() {
    try {
        const res = await fetch('http://localhost:3000/counter');
        const data = await res.json();
        if (data.count !== lastCount) {
            counterSpan.textContent = data.count;
            counterSpan.classList.add('pulse');
            setTimeout(() => counterSpan.classList.remove('pulse'), 300);
            lastCount = data.count;
        }
    } catch (err) {
        console.error('Error fetching counter:', err);
        counterSpan.textContent = '0';
    }
}

async function incrementCounter() {
    try {
        const res = await fetch('http://localhost:3000/counter', { method: 'POST' });
        const data = await res.json();
        counterSpan.textContent = data.count;

        counterSpan.classList.add('pulse');
        setTimeout(() => counterSpan.classList.remove('pulse'), 300);
        lastCount = data.count;
    } catch (err) {
        console.error('Error updating counter:', err);
    }
}

fetchCounter();
setInterval(fetchCounter, 2000);
helpfulBtn.addEventListener('click', incrementCounter);
