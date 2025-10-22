const warrantyPercent = 40;
const prices = {"fogging-machine": 18000, "brush-cutter": 9500, "garden-tools": 1200, "heavy-chainsaw": 15000, "hedge-trimmer": 4200, "lawn-mower": 25000, "sprayer": 3200, "tiller": 22000};

document.getElementById('year')?.textContent = new Date().getFullYear();const form = document.getElementById('contactForm');if(form){form.addEventListener('submit', function(e){const btn = form.querySelector('button[type="submit"]');if(btn){btn.disabled = true;btn.textContent = 'Sending...';}setTimeout(()=>{ if(btn){ btn.disabled=false; btn.textContent='Send' } }, 3000);});}

// Warranty buttons behavior: explicit With / Without buttons (40% warranty)
(function(){
  function formatINR(n){ return '₹' + Number(n).toLocaleString('en-IN'); }

  function setPrice(pid, withWarranty){
    const base = prices[pid];
    const add = Math.round(base * warrantyPercent / 100);
    const priceSpan = document.getElementById('price-' + pid);
    const wCost = document.getElementById('warranty-cost-' + pid);
    const art = document.getElementById(pid);
    if (!priceSpan || !art) return;
    if (withWarranty){ 
      priceSpan.textContent = formatINR(base + add);
      if (wCost) wCost.textContent = ' (includes +' + formatINR(add) + ')';
      art.dataset.finalPrice = base + add;
      art.dataset.warranty = 'with';
    } else { 
      priceSpan.textContent = formatINR(base);
      if (wCost) wCost.textContent = '';
      art.dataset.finalPrice = base;
      art.dataset.warranty = 'without';
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    // initialize prices
    Object.keys(prices).forEach(pid => setPrice(pid, false));

    // wire buttons
    document.querySelectorAll('.btn-warranty').forEach(btn => {
      btn.addEventListener('click', function(e){
        const pid = btn.dataset.pid;
        if (!pid) return;
        if (btn.classList.contains('btn-with')) setPrice(pid, true);
        else setPrice(pid, false);
      });
    });

    // Request Quote links include current selection
    document.querySelectorAll('a.btn').forEach(a => {
      a.addEventListener('click', function(ev){
        const art = a.closest('article.product');
        if (!art) return;
        const pid = art.id;
        const warranty = art.dataset.warranty || 'without';
        const price = art.dataset.finalPrice || prices[pid];
        const params = new URLSearchParams();
        params.set('product', pid);
        params.set('warranty', warranty);
        params.set('price', price);
        a.href = 'contact.html?' + params.toString();
      });
    });
  });
})();
