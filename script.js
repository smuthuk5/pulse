// Replace entire script.js with this content

// Configuration: set warranty percentage here
const warrantyPercent = 40;

// Prices mapping - adjust if you want different base prices.
// If you already have price elements in the HTML, script will respect them (this mapping is a fallback).
const prices = {
  "fogging-machine": 18000,
  "brush-cutter": 9500,
  "garden-tools": 1200,
  "heavy-chainsaw": 15000,
  "hedge-trimmer": 4200,
  "lawn-mower": 25000,
  "sprayer": 3200,
  "tiller": 22000
};

(function () {
  'use strict';

  function formatINR(n) {
    return '₹' + Number(n).toLocaleString('en-IN');
  }

  // Read base price from DOM if present, else use prices map
  function basePriceFor(pid) {
    const el = document.getElementById('price-' + pid);
    if (el) {
      // Attempt to parse existing displayed price (strip non-digits)
      const text = el.textContent || '';
      const digits = text.replace(/[^\d]/g, '');
      if (digits) return parseInt(digits, 10);
    }
    return prices[pid] || 0;
  }

  function setPrice(pid, useWarranty) {
    const base = basePriceFor(pid);
    const add = Math.round(base * warrantyPercent / 100);
    const priceEl = document.getElementById('price-' + pid);
    const wCostEl = document.getElementById('warranty-cost-' + pid);
    const article = document.getElementById(pid);
    if (!priceEl || !article) return;
    if (useWarranty) {
      priceEl.textContent = formatINR(base + add);
      if (wCostEl) wCostEl.textContent = ' (includes +' + formatINR(add) + ')';
      article.dataset.warranty = 'with';
      article.dataset.finalPrice = base + add;
    } else {
      priceEl.textContent = formatINR(base);
      if (wCostEl) wCostEl.textContent = '';
      article.dataset.warranty = 'without';
      article.dataset.finalPrice = base;
    }
  }

  function initAllProducts() {
    // Find all product articles and ensure they have dataset entries set
    document.querySelectorAll('article.card.product').forEach(art => {
      const pid = art.id;
      if (!pid) return;
      // initialize dataset if missing
      if (!art.dataset.warranty) art.dataset.warranty = 'without';
      // initialize price (reads DOM or fallback)
      setPrice(pid, art.dataset.warranty === 'with');
    });
  }

  // Use event delegation for button clicks
  function listenForWarrantyButtons() {
    document.addEventListener('click', function (e) {
      const target = e.target;
      if (!target) return;

      // With warranty button: has class 'btn-with'
      if (target.classList && target.classList.contains('btn-with')) {
        const pid = target.dataset && target.dataset.pid;
        if (pid) setPrice(pid, true);
        return;
      }

      // Without warranty button: has class 'btn-without'
      if (target.classList && target.classList.contains('btn-without')) {
        const pid = target.dataset && target.dataset.pid;
        if (pid) setPrice(pid, false);
        return;
      }

      // If you used a toggle or other element, add more handlers here
    });
  }

  // Make Request Quote include current product/warranty/price
  function wireRequestQuoteLinks() {
    document.addEventListener('click', function (e) {
      const t = e.target;
      if (!t) return;
      if (t.tagName === 'A' && t.classList.contains('btn')) {
        // run this just-in-time before navigation
        const art = t.closest && t.closest('article.card.product');
        if (!art) return true; // not a product request link
        const pid = art.id;
        const warranty = art.dataset.warranty || 'without';
        const price = art.dataset.finalPrice || basePriceFor(pid);
        const params = new URLSearchParams();
        params.set('product', pid);
        params.set('warranty', warranty);
        params.set('price', price);
        t.href = 'contact.html?' + params.toString();
        // allow link to proceed
      }
    }, true);
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAllProducts();
      listenForWarrantyButtons();
      wireRequestQuoteLinks();
    });
  } else {
    initAllProducts();
    listenForWarrantyButtons();
    wireRequestQuoteLinks();
  }
})();
