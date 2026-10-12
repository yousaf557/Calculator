/**
 * AFZ PRESTIGE Corporate Services - Multipage Cost Calculator
 * Pure Vanilla JavaScript with LocalStorage & GBP (£) Calculation Engine
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'AFZ_CALCULATOR_STATE_V1';

  // Default state structure
  var defaultState = {
    step: 1,
    zoneCode: 'ANCFZ',
    licenceType: 'standard', // 'standard' or 'fawri'
    duration: 1, // 1, 2, or 3 years
    shareholders: 1, // 1 to 8
    selectedActivities: ['Software Design & Development', 'Web Design & Cloud Applications'],
    currentActivityCategory: 'tech',
    visas: {
      investor: 0,
      employee: 0,
      dependent: 0
    },
    addons: {
      bank: true,
      tax: false,
      vat: false,
      stamp: false,
      mail: false
    },
    customer: {
      name: '',
      email: '',
      phone: '',
      notes: ''
    },
    submitted: false,
    quoteRef: ''
  };

  // State instance
  var state = loadState();

  // Helper: Number Formatter
  function fmtGBP(num) {
    if (num == null || isNaN(num)) return '0';
    return Number(num).toLocaleString('en-GB');
  }

  // Load from LocalStorage
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        return Object.assign({}, defaultState, parsed);
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
    return Object.assign({}, defaultState);
  }

  // Save to LocalStorage
  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      updateSavedStateBanner();
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }

  // Reset LocalStorage
  function resetState() {
    if (confirm('Are you sure you want to clear your saved estimate and start fresh?')) {
      localStorage.removeItem(STORAGE_KEY);
      state = Object.assign({}, defaultState);
      state.quoteRef = generateQuoteRef();
      renderAll();
      goToStep(1);
    }
  }

  function generateQuoteRef() {
    var num = Math.floor(100000 + Math.random() * 900000);
    return 'AFZ-' + num;
  }

  if (!state.quoteRef) {
    state.quoteRef = generateQuoteRef();
  }

  // Find Zone by Code
  function getSelectedZone() {
    var zones = window.AFZ_ZONES || [];
    for (var i = 0; i < zones.length; i++) {
      if (zones[i].code === state.zoneCode) {
        return zones[i];
      }
    }
    return zones[0] || {};
  }

  // Calculation Engine
  function calculateQuote() {
    var zone = getSelectedZone();
    var duration = state.duration || 1;
    var totalVisas = (state.visas.investor || 0) + (state.visas.employee || 0) + (state.visas.dependent || 0);

    // 1. Zone & Visa Ladder Base Price
    var baseLicenceGBP = zone.baseGBP || 1099;
    var visaLadderPrice = baseLicenceGBP;

    if (zone.priceByVisaGBP && zone.priceByVisaGBP[totalVisas] != null) {
      visaLadderPrice = zone.priceByVisaGBP[totalVisas];
    } else {
      // Estimated per-visa if outside ladder
      var maxLadderKey = 0;
      if (zone.priceByVisaGBP) {
        var keys = Object.keys(zone.priceByVisaGBP).map(Number);
        maxLadderKey = Math.max.apply(null, keys);
      }
      var maxLadderPrice = (zone.priceByVisaGBP && zone.priceByVisaGBP[maxLadderKey]) || baseLicenceGBP;
      var extraVisas = Math.max(0, totalVisas - maxLadderKey);
      visaLadderPrice = maxLadderPrice + (extraVisas * 1450);
    }

    // Express licence surcharge if chosen
    var fawriSurcharge = (state.licenceType === 'fawri') ? 500 : 0;
    var singleYearLicence = visaLadderPrice + fawriSurcharge;

    // Multi-year calculation & discount
    var rawLicenceMultiYear = singleYearLicence * duration;
    var multiYearDiscount = 0;
    if (duration === 2) {
      multiYearDiscount = Math.round(rawLicenceMultiYear * 0.15); // 15% discount
    } else if (duration === 3) {
      multiYearDiscount = Math.round(rawLicenceMultiYear * 0.20); // 20% discount
    }
    var finalLicenceAmount = rawLicenceMultiYear - multiYearDiscount;

    // 2. Additional Shareholders (First 1 is included, £150 per extra)
    var extraShareholdersCount = Math.max(0, (state.shareholders || 1) - 1);
    var shareholdersFee = extraShareholdersCount * 150;

    // 3. Additional Business Activities (First 3 included, £95 per extra)
    var actCount = (state.selectedActivities || []).length;
    var extraActivitiesCount = Math.max(0, actCount - 3);
    var extraActivitiesFee = extraActivitiesCount * 95;

    // 4. Optional Addons
    var addonsTotal = 0;
    var activeAddonsList = [];
    var allAddons = window.AFZ_ADDONS || [];
    for (var i = 0; i < allAddons.length; i++) {
      var addon = allAddons[i];
      if (state.addons[addon.key]) {
        addonsTotal += addon.priceGBP;
        activeAddonsList.push(addon);
      }
    }

    // 5. MANDATORY ADDITIONAL £2,500 POUNDS
    // "jo additonal 2500 pounds ko bhi jama kre"
    var additionalFeeGBP = (window.AFZ_CONFIG && window.AFZ_CONFIG.additionalFeeGBP) || 2500;

    // Grand Total
    var grandTotal = finalLicenceAmount + shareholdersFee + extraActivitiesFee + addonsTotal + additionalFeeGBP;

    return {
      zone: zone,
      duration: duration,
      totalVisas: totalVisas,
      baseLicenceGBP: baseLicenceGBP,
      singleYearLicence: singleYearLicence,
      rawLicenceMultiYear: rawLicenceMultiYear,
      multiYearDiscount: multiYearDiscount,
      finalLicenceAmount: finalLicenceAmount,
      fawriSurcharge: fawriSurcharge,
      extraShareholdersCount: extraShareholdersCount,
      shareholdersFee: shareholdersFee,
      extraActivitiesCount: extraActivitiesCount,
      extraActivitiesFee: extraActivitiesFee,
      addonsTotal: addonsTotal,
      activeAddonsList: activeAddonsList,
      additionalFeeGBP: additionalFeeGBP,
      grandTotal: grandTotal,
      usdApprox: Math.round(grandTotal * 1.30),
      eurApprox: Math.round(grandTotal * 1.18)
    };
  }

  // Navigation Logic
  function goToStep(stepNumber) {
    if (stepNumber < 1) stepNumber = 1;
    if (stepNumber > 3) stepNumber = 3;

    state.step = stepNumber;
    saveState();

    // Update Step indicator nav
    var stepItems = document.querySelectorAll('.step-nav-item');
    stepItems.forEach(function (item) {
      var s = parseInt(item.getAttribute('data-step'), 10);
      item.classList.remove('active', 'completed');
      if (s === stepNumber) {
        item.classList.add('active');
      } else if (s < stepNumber) {
        item.classList.add('completed');
      }
    });

    // Toggle panels
    var p1 = document.getElementById('stepPanel1');
    var p2 = document.getElementById('stepPanel2');
    var p3 = document.getElementById('stepPanel3');

    if (p1) p1.style.display = (stepNumber === 1) ? 'block' : 'none';
    if (p2) p2.style.display = (stepNumber === 2) ? 'block' : 'none';
    if (p3) p3.style.display = (stepNumber === 3) ? 'block' : 'none';

    // Update URL hash without jumping
    try {
      history.replaceState(null, '', '#step' + stepNumber);
    } catch (e) {}

    // Scroll to top of calculator container
    var mount = document.getElementById('calculatorAnchor');
    if (mount) {
      var topPos = mount.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: Math.max(0, topPos), behavior: 'smooth' });
    }

    renderAll();
  }

  // Render Step 1: Zones Grid
  function renderStep1() {
    var container = document.getElementById('zonesGrid');
    if (!container) return;

    var zones = window.AFZ_ZONES || [];
    var html = '';

    zones.forEach(function (z) {
      var isSelected = (z.code === state.zoneCode);
      var popularBadge = z.popular ? '<span class="zone-popular-pill">★ Most Popular</span>' : '';
      var startingPriceWith2500 = z.baseGBP + 2500;

      html += '<div class="zone-card ' + (isSelected ? 'selected' : '') + '" data-code="' + z.code + '">';
      html += '  <div class="zone-card-top">';
      html += '    <span class="zone-badge-tag">' + z.badge + '</span>';
      html += '    ' + popularBadge;
      html += '  </div>';
      html += '  <h3 class="zone-card-name">' + z.name + '</h3>';
      html += '  <div class="zone-card-location">';
      html += '    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
      html += '    <span>' + z.location + ' · ' + z.emirate + '</span>';
      html += '  </div>';
      html += '  <p class="zone-card-desc">' + z.description + '</p>';
      html += '  <div class="zone-card-pricing-block">';
      html += '    <span class="zone-price-label">Starting from (Inc. Setup)</span>';
      html += '    <div class="zone-price-amount">';
      html += '      <b>£' + fmtGBP(startingPriceWith2500) + '</b> <small>(Licence £' + fmtGBP(z.baseGBP) + ' + £2,500 Fee)</small>';
      html += '    </div>';
      html += '    <span class="zone-card-add-note">✓ Includes £2,500 Professional & Legal Fee</span>';
      html += '  </div>';
      html += '  <button class="btn ' + (isSelected ? 'btn-navy' : 'btn-primary-gold') + ' zone-card-btn" data-action="select-zone" data-code="' + z.code + '">';
      html += '    ' + (isSelected ? 'Selected — Configure Setup →' : 'Choose ' + z.shortName + ' →');
      html += '  </button>';
      html += '</div>';
    });

    container.innerHTML = html;

    // Wire clicks
    container.querySelectorAll('.zone-card').forEach(function (card) {
      card.onclick = function (e) {
        var code = card.getAttribute('data-code');
        selectZone(code);
      };
    });
  }

  function selectZone(code) {
    state.zoneCode = code;
    saveState();
    goToStep(2);
  }

  // Render Step 2: Customizer Controls
  function renderStep2() {
    var zone = getSelectedZone();
    var bannerEl = document.getElementById('activeZoneBanner');
    if (bannerEl) {
      bannerEl.innerHTML = '<div class="zone-active-info">' +
        '  <div class="zone-active-icon">' + (zone.shortName ? zone.shortName.charAt(0) : 'A') + '</div>' +
        '  <div class="zone-active-meta">' +
        '    <b>' + zone.name + ' (' + zone.emirate + ')</b>' +
        '    <span>' + zone.location + ' · Turnaround: ' + zone.processingTime + '</span>' +
        '  </div>' +
        '</div>' +
        '<button class="btn btn-outline btn-sm" id="btnChangeZone">← Change Jurisdiction</button>';

      var changeBtn = document.getElementById('btnChangeZone');
      if (changeBtn) {
        changeBtn.onclick = function () {
          goToStep(1);
        };
      }
    }

    // Licence type buttons
    var licTiles = document.querySelectorAll('.licence-tile');
    licTiles.forEach(function (tile) {
      var l = tile.getAttribute('data-lic');
      tile.classList.toggle('active', state.licenceType === l);
      tile.onclick = function () {
        state.licenceType = l;
        saveState();
        renderStep2();
      };
    });

    // Duration buttons
    var durTiles = document.querySelectorAll('.duration-tile');
    durTiles.forEach(function (tile) {
      var d = parseInt(tile.getAttribute('data-duration'), 10);
      tile.classList.toggle('active', state.duration === d);
      tile.onclick = function () {
        state.duration = d;
        saveState();
        renderStep2();
      };
    });

    // Shareholders counter
    var shCountEl = document.getElementById('valShareholders');
    if (shCountEl) shCountEl.textContent = state.shareholders || 1;

    // Visa counters
    var vInv = document.getElementById('valVisaInv');
    var vEmp = document.getElementById('valVisaEmp');
    var vDep = document.getElementById('valVisaDep');
    if (vInv) vInv.textContent = state.visas.investor || 0;
    if (vEmp) vEmp.textContent = state.visas.employee || 0;
    if (vDep) vDep.textContent = state.visas.dependent || 0;

    // Activities UI
    renderActivitiesUI();

    // Addons UI
    renderAddonsUI();

    // Update Live Sidebar Quote
    renderSidebarQuote();
  }

  // Activities UI Rendering
  function renderActivitiesUI() {
    var groupsContainer = document.getElementById('actCategories');
    var subContainer = document.getElementById('actSubList');
    var chipsContainer = document.getElementById('actChipsTray');

    if (!groupsContainer || !subContainer || !chipsContainer) return;

    var categories = window.AFZ_ACTIVITIES || [];
    var searchInput = document.getElementById('activitySearchInput');
    var query = (searchInput ? searchInput.value : '').trim().toLowerCase();

    // 1. Render Chips
    var selected = state.selectedActivities || [];
    if (selected.length === 0) {
      chipsContainer.innerHTML = '<span style="font-size:12px; color:var(--ink-muted);">No specific activities selected yet (First 3 included free).</span>';
    } else {
      var chipsHtml = '<div style="width:100%; font-size:11px; font-weight:700; color:var(--gold-dark); margin-bottom:4px;">SELECTED ACTIVITIES (' + selected.length + ') · ' + (selected.length <= 3 ? 'ALL INCLUDED' : (selected.length - 3) + ' EXTRA AT £95 EACH') + ':</div>';
      selected.forEach(function (act) {
        chipsHtml += '<span class="activity-chip-tag">' + act + ' <button type="button" data-act="' + act + '">×</button></span>';
      });
      chipsContainer.innerHTML = chipsHtml;

      chipsContainer.querySelectorAll('button').forEach(function (btn) {
        btn.onclick = function (e) {
          e.stopPropagation();
          var actToRemove = btn.getAttribute('data-act');
          state.selectedActivities = state.selectedActivities.filter(function (x) { return x !== actToRemove; });
          saveState();
          renderActivitiesUI();
          renderSidebarQuote();
        };
      });
    }

    // 2. Render Categories
    var catHtml = '';
    categories.forEach(function (cat) {
      var count = 0;
      selected.forEach(function (s) {
        if (cat.activities.indexOf(s) >= 0) count++;
      });
      var isActive = (state.currentActivityCategory === cat.key && !query);
      catHtml += '<button type="button" class="act-group-card ' + (isActive ? 'active' : '') + '" data-cat="' + cat.key + '">';
      catHtml += '  <span class="act-group-icon">' + cat.icon + '</span>';
      catHtml += '  <span class="act-group-name">' + cat.name + '</span>';
      catHtml += '  <span class="act-group-count">' + (count > 0 ? count + ' selected' : cat.activities.length + ' available') + '</span>';
      catHtml += '</button>';
    });
    groupsContainer.innerHTML = catHtml;

    groupsContainer.querySelectorAll('.act-group-card').forEach(function (btn) {
      btn.onclick = function () {
        state.currentActivityCategory = btn.getAttribute('data-cat');
        if (searchInput) searchInput.value = '';
        renderActivitiesUI();
      };
    });

    // 3. Render Sub-activities
    var subHtml = '<div class="sub-activities-grid">';
    var toShow = [];

    if (query) {
      categories.forEach(function (c) {
        c.activities.forEach(function (a) {
          if (a.toLowerCase().indexOf(query) >= 0 || c.name.toLowerCase().indexOf(query) >= 0) {
            toShow.push({ name: a, category: c.name });
          }
        });
      });
    } else {
      var currentCat = categories.find(function (c) { return c.key === state.currentActivityCategory; }) || categories[0];
      if (currentCat) {
        currentCat.activities.forEach(function (a) {
          toShow.push({ name: a, category: currentCat.name });
        });
      }
    }

    if (toShow.length === 0) {
      subHtml += '<div style="grid-column: 1/-1; padding: 16px; text-align: center; color: var(--ink-muted); font-size: 13px;">No activities matched "' + query + '". Custom activities can be included during review!</div>';
    } else {
      toShow.forEach(function (item) {
        var isChecked = (state.selectedActivities.indexOf(item.name) >= 0);
        subHtml += '<div class="sub-activity-item ' + (isChecked ? 'selected' : '') + '" data-name="' + item.name + '">';
        subHtml += '  <span class="sub-activity-checkbox">' + (isChecked ? '✓' : '') + '</span>';
        subHtml += '  <span style="flex:1;">' + item.name + '</span>';
        subHtml += '</div>';
      });
    }
    subHtml += '</div>';
    subContainer.innerHTML = subHtml;

    subContainer.querySelectorAll('.sub-activity-item').forEach(function (item) {
      item.onclick = function () {
        var actName = item.getAttribute('data-name');
        var idx = state.selectedActivities.indexOf(actName);
        if (idx >= 0) {
          state.selectedActivities.splice(idx, 1);
        } else {
          state.selectedActivities.push(actName);
        }
        saveState();
        renderActivitiesUI();
        renderSidebarQuote();
      };
    });
  }

  // Addons UI
  function renderAddonsUI() {
    var container = document.getElementById('addonsList');
    if (!container) return;

    var addons = window.AFZ_ADDONS || [];
    var html = '';

    addons.forEach(function (a) {
      var isChecked = !!state.addons[a.key];
      html += '<div class="addon-row ' + (isChecked ? 'active' : '') + '" data-key="' + a.key + '">';
      html += '  <span class="addon-checkbox">' + (isChecked ? '✓' : '') + '</span>';
      html += '  <div class="addon-info">';
      html += '    <span class="addon-name">' + a.title + ' ' + (a.recommended ? '<span style="font-size:10px; background:#FBF6E9; border:1px solid #EBDBB0; color:#8A6D1E; padding:2px 6px; border-radius:4px; font-weight:700;">RECOMMENDED</span>' : '') + '</span>';
      html += '    <span class="addon-desc">' + a.desc + '</span>';
      html += '  </div>';
      html += '  <span class="addon-price">+£' + fmtGBP(a.priceGBP) + '</span>';
      html += '</div>';
    });

    container.innerHTML = html;

    container.querySelectorAll('.addon-row').forEach(function (row) {
      row.onclick = function () {
        var key = row.getAttribute('data-key');
        state.addons[key] = !state.addons[key];
        saveState();
        renderAddonsUI();
        renderSidebarQuote();
      };
    });
  }

  // Render Sidebar Live Quotation
  function renderSidebarQuote() {
    var q = calculateQuote();

    var zoneNameEl = document.getElementById('quoteZoneName');
    if (zoneNameEl) {
      zoneNameEl.textContent = q.zone.name + ' · ' + q.zone.emirate;
    }

    var rowsContainer = document.getElementById('quoteRows');
    if (!rowsContainer) return;

    var html = '';

    // Licence line item
    var licLabel = (state.licenceType === 'fawri' ? 'Fawri Instant Express Licence' : 'Standard Trade Licence & Formation');
    if (q.duration > 1) {
      licLabel += ' (' + q.duration + ' Years)';
    }
    html += '<div class="quote-line-item">';
    html += '  <span>' + licLabel + '</span>';
    html += '  <b>£' + fmtGBP(q.rawLicenceMultiYear) + '</b>';
    html += '</div>';

    // Multi-year discount
    if (q.multiYearDiscount > 0) {
      var discPercent = (q.duration === 2 ? '15%' : '20%');
      html += '<div class="quote-line-item discount-row">';
      html += '  <span>Multi-Year Incentive Discount (' + discPercent + ')</span>';
      html += '  <b>−£' + fmtGBP(q.multiYearDiscount) + '</b>';
      html += '</div>';
    }

    // Visas breakdown
    if (q.totalVisas > 0) {
      html += '<div class="quote-line-item">';
      html += '  <span>Residence Visa Allocation (' + q.totalVisas + ' Person' + (q.totalVisas > 1 ? 's' : '') + ')</span>';
      html += '  <b>Included in package ladder</b>';
      html += '</div>';
    }

    // Additional Shareholders
    if (q.extraShareholdersCount > 0) {
      html += '<div class="quote-line-item">';
      html += '  <span>Additional Shareholders (' + q.extraShareholdersCount + ' × £150)</span>';
      html += '  <b>+£' + fmtGBP(q.shareholdersFee) + '</b>';
      html += '</div>';
    }

    // Additional Activities
    if (q.extraActivitiesCount > 0) {
      html += '<div class="quote-line-item">';
      html += '  <span>Additional Activities (' + q.extraActivitiesCount + ' × £95)</span>';
      html += '  <b>+£' + fmtGBP(q.extraActivitiesFee) + '</b>';
      html += '</div>';
    }

    // Active Addons
    q.activeAddonsList.forEach(function (add) {
      html += '<div class="quote-line-item">';
      html += '  <span>' + add.title + '</span>';
      html += '  <b>+£' + fmtGBP(add.priceGBP) + '</b>';
      html += '</div>';
    });

    // ----------------------------------------------------
    // EXPLICIT ADDITIONAL £2,500 POUNDS LINE ITEM
    // ----------------------------------------------------
    html += '<div class="quote-line-item special-fee">';
    html += '  <span>★ Professional Setup & Legal Compliance Management</span>';
    html += '  <b>+£' + fmtGBP(q.additionalFeeGBP) + '</b>';
    html += '</div>';

    rowsContainer.innerHTML = html;

    // Total Amount
    var totalAmountEl = document.getElementById('quoteGrandTotal');
    if (totalAmountEl) {
      totalAmountEl.innerHTML = '<span class="quote-currency-tag">£</span> ' + fmtGBP(q.grandTotal);
      totalAmountEl.classList.remove('pulse');
      void totalAmountEl.offsetWidth; // trigger reflow
      totalAmountEl.classList.add('pulse');
    }

    // Indicative conversions
    var indEl = document.getElementById('quoteIndicative');
    if (indEl) {
      indEl.textContent = '≈ $' + fmtGBP(q.usdApprox) + ' USD · €' + fmtGBP(q.eurApprox) + ' EUR (Priced in Pounds Sterling)';
    }

    // Summary configuration pill
    var summaryPillEl = document.getElementById('quoteSummaryPill');
    if (summaryPillEl) {
      var vText = q.totalVisas > 0 ? q.totalVisas + ' Residence Visa' + (q.totalVisas > 1 ? 's' : '') : '0 Visas (Licence-only)';
      summaryPillEl.textContent = q.zone.shortName + ' · ' + q.duration + ' Year' + (q.duration > 1 ? 's' : '') + ' · ' +
        state.shareholders + ' Owner' + (state.shareholders > 1 ? 's' : '') + ' · ' + vText + ' · ' +
        state.selectedActivities.length + ' Activity' + (state.selectedActivities.length > 1 ? 'ies' : '');
    }

    // Mobile sticky bar update
    var barAmt = document.getElementById('mobileBarAmount');
    var barMeta = document.getElementById('mobileBarMeta');
    if (barAmt) {
      barAmt.innerHTML = '<span>£</span>' + fmtGBP(q.grandTotal);
    }
    if (barMeta) {
      barMeta.textContent = q.zone.shortName + ' · ' + q.duration + 'yr · ' + q.totalVisas + ' visa(s) · Incl. £2.5k fee';
    }
  }

  // Render Step 3: Formal Review & Lead Intake Portal
  function renderStep3() {
    var q = calculateQuote();

    var refEl = document.getElementById('reviewQuoteRef');
    if (refEl) refEl.textContent = 'Ref: ' + state.quoteRef;

    var zoneMetaEl = document.getElementById('reviewZoneMeta');
    if (zoneMetaEl) {
      zoneMetaEl.textContent = q.zone.name + ' (' + q.zone.emirate + ') · ' + q.duration + ' Year Licence';
    }

    var tableBody = document.getElementById('reviewTableBody');
    if (!tableBody) return;

    var rows = '';

    // Licence row
    rows += '<tr>';
    rows += '  <td><b>Trade Licence & Official Formation</b><br><small style="color:var(--ink-muted);">' + (state.licenceType === 'fawri' ? 'Express Instant 60-Min Issuance' : 'Standard Formation 3-5 Days') + ' · ' + q.duration + ' Year(s)</small></td>';
    rows += '  <td class="amount-col">£' + fmtGBP(q.rawLicenceMultiYear) + '</td>';
    rows += '</tr>';

    // Discount row
    if (q.multiYearDiscount > 0) {
      rows += '<tr>';
      rows += '  <td><span style="color:var(--green-accent); font-weight:700;">Multi-Year Agreement Discount (' + (q.duration === 2 ? '15%' : '20%') + ')</span></td>';
      rows += '  <td class="amount-col" style="color:var(--green-accent);">−£' + fmtGBP(q.multiYearDiscount) + '</td>';
      rows += '</tr>';
    }

    // Visas
    rows += '<tr>';
    rows += '  <td><b>Residence Visas (' + q.totalVisas + ' Allocated)</b><br><small style="color:var(--ink-muted);">Investor: ' + state.visas.investor + ' | Employee: ' + state.visas.employee + ' | Dependent: ' + state.visas.dependent + '</small></td>';
    rows += '  <td class="amount-col">Included in Tier Ladder</td>';
    rows += '</tr>';

    // Shareholders
    if (q.extraShareholdersCount > 0) {
      rows += '<tr>';
      rows += '  <td>Extra Shareholders (' + q.extraShareholdersCount + ' person(s))</td>';
      rows += '  <td class="amount-col">+£' + fmtGBP(q.shareholdersFee) + '</td>';
      rows += '</tr>';
    }

    // Extra activities
    if (q.extraActivitiesCount > 0) {
      rows += '<tr>';
      rows += '  <td>Additional Activities Quota (' + q.extraActivitiesCount + ' activities)</td>';
      rows += '  <td class="amount-col">+£' + fmtGBP(q.extraActivitiesFee) + '</td>';
      rows += '</tr>';
    }

    // Addons
    q.activeAddonsList.forEach(function (add) {
      rows += '<tr>';
      rows += '  <td>' + add.title + '</td>';
      rows += '  <td class="amount-col">+£' + fmtGBP(add.priceGBP) + '</td>';
      rows += '</tr>';
    });

    // Mandatory £2,500
    rows += '<tr class="fee-2500-highlight">';
    rows += '  <td><b>★ ' + window.AFZ_CONFIG.additionalFeeLabel + '</b><br><small>Mandatory executive onboarding, dedicated case manager, legal attestation review & documentation</small></td>';
    rows += '  <td class="amount-col" style="font-size:15px; color:var(--gold-dark);">+£' + fmtGBP(q.additionalFeeGBP) + '</td>';
    rows += '</tr>';

    // Grand Total
    rows += '<tr class="total-row-item">';
    rows += '  <td><b>GRAND TOTAL (GBP £)</b><br><small style="font-size:12px; font-weight:normal; color:var(--ink-muted);">All formation and legal compliance fees included</small></td>';
    rows += '  <td class="amount-col" style="font-size:22px; color:var(--navy);">£' + fmtGBP(q.grandTotal) + '</td>';
    rows += '</tr>';

    tableBody.innerHTML = rows;

    // Fill customer form inputs from state
    var nameIn = document.getElementById('inputCustName');
    var emailIn = document.getElementById('inputCustEmail');
    var phoneIn = document.getElementById('inputCustPhone');
    var notesIn = document.getElementById('inputCustNotes');

    if (nameIn && state.customer.name) nameIn.value = state.customer.name;
    if (emailIn && state.customer.email) emailIn.value = state.customer.email;
    if (phoneIn && state.customer.phone) phoneIn.value = state.customer.phone;
    if (notesIn && state.customer.notes) notesIn.value = state.customer.notes;

    // Prepare Printable Quote
    renderPrintableQuote(q);
  }

  // Generate HTML for window.print()
  function renderPrintableQuote(q) {
    var container = document.getElementById('printQuoteContainer');
    if (!container) return;

    var dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    var html = '';
    html += '<div class="print-head">';
    html += '  <div class="print-logo-box">';
    html += '    <b>AFZ PRESTIGE CORPORATE SERVICES</b>';
    html += '    <span style="font-size:12px; color:#586172;">Executive Business Formation & Legal Advisory</span><br>';
    html += '    <span style="font-size:11px; color:#858D9A;">London · Dubai · Ajman</span>';
    html += '  </div>';
    html += '  <div style="text-align:right;">';
    html += '    <span style="display:inline-block; background:#FBF6E9; border:1px solid #EBDBB0; color:#8A6D1E; font-weight:bold; font-size:12px; padding:4px 8px; border-radius:4px;">' + state.quoteRef + '</span><br>';
    html += '    <span style="font-size:12px; color:#586172; margin-top:4px; display:block;">Date: ' + dateStr + '</span>';
    html += '    <span style="font-size:11px; color:#1B8354; font-weight:bold;">Quote Validity: 30 Days</span>';
    html += '  </div>';
    html += '</div>';

    html += '<h2 style="font-size:16px; margin-bottom:6px; color:#0B162B;">ESTIMATED FORMATION SCHEDULE: ' + q.zone.name + '</h2>';
    html += '<p style="font-size:13px; color:#586172; margin-bottom:16px;">Jurisdiction: ' + q.zone.emirate + ' | Duration: ' + q.duration + ' Year(s) | Visas: ' + q.totalVisas + ' | Shareholders: ' + state.shareholders + '</p>';

    html += '<table class="print-table">';
    html += '  <thead>';
    html += '    <tr><th>Item Description</th><th style="text-align:right;">Amount (GBP £)</th></tr>';
    html += '  </thead>';
    html += '  <tbody>';
    html += '    <tr><td>Trade Licence & Formation (' + q.zone.shortName + ', ' + q.duration + ' Year)</td><td style="text-align:right;">£' + fmtGBP(q.rawLicenceMultiYear) + '</td></tr>';
    if (q.multiYearDiscount > 0) {
      html += '    <tr><td>Multi-Year Incentive Discount (' + (q.duration === 2 ? '15%' : '20%') + ')</td><td style="text-align:right; color:#1B8354;">−£' + fmtGBP(q.multiYearDiscount) + '</td></tr>';
    }
    html += '    <tr><td>Residence Visas Quota (' + q.totalVisas + ' Persons Allocated)</td><td style="text-align:right;">Included</td></tr>';
    if (q.extraShareholdersCount > 0) {
      html += '    <tr><td>Additional Shareholders (' + q.extraShareholdersCount + ')</td><td style="text-align:right;">+£' + fmtGBP(q.shareholdersFee) + '</td></tr>';
    }
    if (q.extraActivitiesCount > 0) {
      html += '    <tr><td>Additional Activities (' + q.extraActivitiesCount + ')</td><td style="text-align:right;">+£' + fmtGBP(q.extraActivitiesFee) + '</td></tr>';
    }
    q.activeAddonsList.forEach(function (add) {
      html += '    <tr><td>' + add.title + '</td><td style="text-align:right;">+£' + fmtGBP(add.priceGBP) + '</td></tr>';
    });
    html += '    <tr style="background:#FBF6E9; font-weight:bold;"><td>★ ' + window.AFZ_CONFIG.additionalFeeLabel + '</td><td style="text-align:right;">+£' + fmtGBP(q.additionalFeeGBP) + '</td></tr>';
    html += '  </tbody>';
    html += '</table>';

    html += '<div class="print-total-box">';
    html += '  <span>TOTAL ESTIMATED INVESTMENT:</span>';
    html += '  <span>£' + fmtGBP(q.grandTotal) + ' GBP</span>';
    html += '</div>';

    html += '<div style="margin-top:24px; font-size:11px; color:#586172; border-top:1px solid #E5E8EC; padding-top:14px;">';
    html += '  <b>Notes & Compliance:</b> This official written estimate includes government published scenarios plus executive legal management. Bank transfer payment instructions and final authority approvals will be confirmed prior to payment. No sales calls policy guaranteed.<br>';
    html += '  <b>Contact:</b> WhatsApp ' + window.AFZ_CONFIG.supportWhatsAppDisplay + ' | Email: ' + window.AFZ_CONFIG.supportEmail;
    html += '</div>';

    container.innerHTML = html;
  }

  // Update Saved State banner at top of calculator
  function updateSavedStateBanner() {
    var banner = document.getElementById('savedStateBanner');
    if (!banner) return;

    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  }

  // Master Render
  function renderAll() {
    updateSavedStateBanner();
    if (state.step === 1) {
      renderStep1();
    } else if (state.step === 2) {
      renderStep2();
    } else if (state.step === 3) {
      renderStep3();
    }
  }

  // WhatsApp Quotation Launcher
  function sendWhatsAppQuote() {
    var q = calculateQuote();
    var text = 'Hello AFZ PRESTIGE Corporate Services,\n\n' +
      'I would like to confirm my company formation estimate:\n' +
      '• Reference: ' + state.quoteRef + '\n' +
      '• Free Zone: ' + q.zone.name + ' (' + q.zone.emirate + ')\n' +
      '• Licence Duration: ' + q.duration + ' Year(s)\n' +
      '• Shareholders: ' + state.shareholders + '\n' +
      '• Visas: ' + q.totalVisas + ' (' + state.visas.investor + ' Inv, ' + state.visas.employee + ' Emp, ' + state.visas.dependent + ' Dep)\n' +
      '• Activities: ' + state.selectedActivities.length + ' selected\n' +
      '• Additional Fee: +£' + fmtGBP(q.additionalFeeGBP) + ' included\n' +
      '• Grand Total: £' + fmtGBP(q.grandTotal) + ' GBP\n\n' +
      'Client Name: ' + (state.customer.name || 'Not provided') + '\n' +
      'Email: ' + (state.customer.email || 'Not provided') + '\n\n' +
      'Please send me the written authority verification and portal access.';

    var url = 'https://wa.me/' + window.AFZ_CONFIG.supportWhatsApp + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank');
  }

  // Event Listeners & Binding
  function initListeners() {
    // Step navigation tabs
    document.querySelectorAll('.step-nav-item').forEach(function (item) {
      item.onclick = function () {
        var s = parseInt(item.getAttribute('data-step'), 10);
        goToStep(s);
      };
    });

    // Reset button
    var resetBtn = document.getElementById('btnResetState');
    if (resetBtn) {
      resetBtn.onclick = resetState;
    }

    // Step 1: Filter pills
    var filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(function (pill) {
      pill.onclick = function () {
        filterPills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var filter = pill.getAttribute('data-filter');
        filterZones(filter);
      };
    });

    // Step 1: Search zones
    var zoneSearch = document.getElementById('zoneSearchInput');
    if (zoneSearch) {
      zoneSearch.oninput = function () {
        var q = zoneSearch.value.trim().toLowerCase();
        document.querySelectorAll('.zone-card').forEach(function (card) {
          var text = card.textContent.toLowerCase();
          card.style.display = (text.indexOf(q) >= 0) ? 'flex' : 'none';
        });
      };
    }

    // Steppers: Shareholders
    var btnShMinus = document.getElementById('btnShMinus');
    var btnShPlus = document.getElementById('btnShPlus');
    if (btnShMinus) {
      btnShMinus.onclick = function () {
        if (state.shareholders > 1) {
          state.shareholders--;
          saveState();
          renderStep2();
        }
      };
    }
    if (btnShPlus) {
      btnShPlus.onclick = function () {
        if (state.shareholders < 8) {
          state.shareholders++;
          saveState();
          renderStep2();
        }
      };
    }

    // Steppers: Visas (Investor, Employee, Dependent)
    ['Inv', 'Emp', 'Dep'].forEach(function (type) {
      var key = (type === 'Inv' ? 'investor' : type === 'Emp' ? 'employee' : 'dependent');
      var minus = document.getElementById('btn' + type + 'Minus');
      var plus = document.getElementById('btn' + type + 'Plus');

      if (minus) {
        minus.onclick = function () {
          if (state.visas[key] > 0) {
            state.visas[key]--;
            saveState();
            renderStep2();
          }
        };
      }
      if (plus) {
        plus.onclick = function () {
          if (state.visas[key] < 8) {
            state.visas[key]++;
            saveState();
            renderStep2();
          }
        };
      }
    });

    // Activity search input
    var actSearch = document.getElementById('activitySearchInput');
    if (actSearch) {
      actSearch.oninput = function () {
        renderActivitiesUI();
      };
    }

    // Proceed to Step 3 from Step 2 Sidebar
    var btnToStep3 = document.getElementById('btnToStep3');
    if (btnToStep3) {
      btnToStep3.onclick = function () {
        goToStep(3);
      };
    }

    // Back to Step 2 from Step 3
    var btnBackToStep2 = document.getElementById('btnBackToStep2');
    if (btnBackToStep2) {
      btnBackToStep2.onclick = function () {
        goToStep(2);
      };
    }

    // Mobile sticky bar Proceed
    var btnMobileProceed = document.getElementById('mobileBarBtn');
    if (btnMobileProceed) {
      btnMobileProceed.onclick = function () {
        if (state.step === 1) goToStep(2);
        else if (state.step === 2) goToStep(3);
        else goToStep(3);
      };
    }

    // Customer Form Inputs in Step 3
    ['inputCustName', 'inputCustEmail', 'inputCustPhone', 'inputCustNotes'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.oninput = function () {
          if (id === 'inputCustName') state.customer.name = el.value;
          if (id === 'inputCustEmail') state.customer.email = el.value;
          if (id === 'inputCustPhone') state.customer.phone = el.value;
          if (id === 'inputCustNotes') state.customer.notes = el.value;
          saveState();
        };
      }
    });

    // Lead Portal Form Submission
    var clientForm = document.getElementById('clientIntakeForm');
    if (clientForm) {
      clientForm.onsubmit = function (e) {
        e.preventDefault();
        var email = (document.getElementById('inputCustEmail').value || '').trim();
        if (!email) {
          alert('Please enter a valid business email address.');
          return;
        }

        state.submitted = true;
        saveState();

        var succ = document.getElementById('submissionSuccess');
        if (succ) {
          succ.style.display = 'block';
          succ.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
    }

    // Print / PDF Button
    var btnPrintPdf = document.getElementById('btnPrintPdf');
    if (btnPrintPdf) {
      btnPrintPdf.onclick = function () {
        window.print();
      };
    }

    // WhatsApp Action Buttons
    var btnWaQuote = document.getElementById('btnWhatsAppQuote');
    if (btnWaQuote) {
      btnWaQuote.onclick = sendWhatsAppQuote;
    }
    var btnWaDirect = document.getElementById('btnWhatsAppDirect');
    if (btnWaDirect) {
      btnWaDirect.onclick = sendWhatsAppQuote;
    }
  }

  function filterZones(filter) {
    var cards = document.querySelectorAll('.zone-card');
    cards.forEach(function (card) {
      var code = card.getAttribute('data-code');
      var zone = (window.AFZ_ZONES || []).find(function (z) { return z.code === code; });
      if (!zone) return;

      var match = false;
      if (filter === 'all') match = true;
      else if (filter === 'dubai' && zone.emirate.toLowerCase().indexOf('dubai') >= 0) match = true;
      else if (filter === 'northern' && (zone.emirate.toLowerCase().indexOf('ajman') >= 0 || zone.emirate.toLowerCase().indexOf('sharjah') >= 0 || zone.emirate.toLowerCase().indexOf('fujairah') >= 0 || zone.emirate.toLowerCase().indexOf('ras al khaimah') >= 0)) match = true;
      else if (filter === 'popular' && zone.popular) match = true;

      card.style.display = match ? 'flex' : 'none';
    });
  }

  // Handle URL hash on initial load
  function checkUrlHash() {
    var hash = window.location.hash;
    if (hash === '#step1') state.step = 1;
    else if (hash === '#step2') state.step = 2;
    else if (hash === '#step3') state.step = 3;
  }

  // Initialize on DOM Ready
  function init() {
    checkUrlHash();
    initListeners();
    renderAll();
    goToStep(state.step || 1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
