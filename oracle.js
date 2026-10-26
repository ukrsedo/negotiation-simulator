/* Fictional teaching case. All money is GBP; no vendor policy or market benchmark is asserted. */
const oracleOriginalSelectGame = selectGame;
const oracleOriginalReplay = replay;
selectGame = function(key) {
  if (key !== 'Oracle_Audit') return oracleOriginalSelectGame(key);
  set('<h2>Oracle Audit: settlement or package?</h2><p>Choose a business situation. Both use the same audit claim and opening offers. All figures and supplier behaviour are fictional teaching assumptions.</p>');
  for (const variant of ['approved_need','no_need']) app.appendChild(btn(variant === 'approved_need' ? 'A. Approved requirement — new products are needed' : 'B. No requirement — new products are not needed',()=>oracleProfiles(variant)));
};
function oracleProfiles(variant) {
  st={key:'Oracle_Audit',g:S.Oracle_Audit,variant,history:[],submissionAttempted:false};
  set(`<h2>Choose supplier profile</h2><p>The priority weights remain hidden until Results. The profile label is visible, as in the existing game.</p>`);
  Object.entries(st.g.profiles).sort((a,b)=>a[1].display_order-b[1].display_order).forEach(([key,p])=>app.appendChild(btn(`${label(key)} — ${p.description}`,()=>{st.profile=key;oracleStart()})));
}
const gbp=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n);
function oracleStart() {
  Object.assign(st,{round:1,history:[],validated:false,compared:false,standalone:250000,packageCost:700000,packageClosure:false,submissionAttempted:false});
  oracleRound();
}
function oracleFacts() {
  return `<div class="notice"><b>Fictional case • three-year comparison • undiscounted GBP</b><p>Supplier claim: ${gbp(1000000)}. An internal preliminary review identifies ${gbp(200000)} supported by records and ${gbp(800000)} disputed. These are teaching facts, not a legal determination.</p><p>${st.variant==='approved_need'?'An approved requirement for the offered products exists. An equivalent standalone purchase costs £600,000 over three years. Scope, service, payment timing and delivery are assumed equivalent.':'There is no approved or forecast requirement for the offered products. Their attributed business value in this case is zero.'}</p><p>No operational emergency requires immediate purchase. Existing operations remain funded. No tax, financing, implementation or switching differences are assumed.</p></div>`;
}
function oracleOffers() {
  const need=st.variant==='approved_need'?600000:0;
  return `<div class="table-scroll"><table class="history"><thead><tr><th>Route</th><th>Audit payment</th><th>New purchase</th><th>Three-year total</th><th>Audit closure</th></tr></thead><tbody><tr><td>Separate settlement${need?' + required purchase':''}</td><td>${gbp(st.standalone)}</td><td>${gbp(need)}</td><td>${gbp(st.standalone+need)}</td><td>Explicit release for the specified products, entities and audit period</td></tr><tr><td>Combined package</td><td>Included; no separate allocation supplied</td><td>Fixed, non-cancellable package</td><td>${gbp(st.packageCost)}</td><td>${st.packageClosure?'Explicit release for the same specified scope':'Not yet explicit — offer says “commercial resolution”'}</td></tr></tbody></table></div><p>Package payment cannot be reduced for unused products. No cash saving is counted merely because the supplier withdraws its £1 million headline claim.</p>`;
}
function oracleRecord(actor,action){st.history.push({round:st.round,actor,action})}
function oracleRound() {
  set(`<h2>Oracle Audit — ${st.variant==='approved_need'?'A: approved requirement':'B: no requirement'}</h2><h3>Round ${st.round} of 5</h3>${oracleFacts()}`);
  if(st.round===1){
    app.insertAdjacentHTML('beforeend','<p>How will you prepare the customer position?</p>');
    [['validate','Reconcile rights and deployment; validate the supported amount and preserve the dispute.'],['commercial','Start commercial discussions using the preliminary review, without validation.'],['admit','Accept the £1 million claim as the negotiation baseline without validating it.']].forEach(([a,t])=>app.appendChild(btn(t,()=>{st.validated=a==='validate';oracleRecord('Customer',t);st.round=2;oracleRound()})));
  }else if(st.round===2){
    const text=st.validated?'Validation confirms the case evidence: £200,000 supported; £800,000 remains disputed. The supplier has not conceded the disputed part.':'No evidence validation has been completed. The £1 million claim remains a supplier assertion; the preliminary internal review is still available.';
    oracleRecord('Supplier',`Opening offers: separate settlement £250,000; package £700,000; package release unclear.`);
    app.insertAdjacentHTML('beforeend',`<p>${text}</p>${oracleOffers()}`);app.appendChild(btn('Review response options',()=>{st.round=3;oracleRound()}));
  }else if(st.round===3){
    app.insertAdjacentHTML('beforeend',oracleOffers());
    [['unbundle','Request separate prices, compare both routes and require explicit audit release.'],['improve','Negotiate both offers against the evidence and business need; require explicit audit release.'],['accept','Take the opening package forward without further clarification or price negotiation.']].forEach(([a,t])=>app.appendChild(btn(t,()=>{st.request=a;st.compared=a!=='accept';oracleRecord('Customer',t);st.round=4;oracleRound()})));
  }else if(st.round===4){
    const favourable=['expansion','account_protection'].includes(st.profile);
    if(st.request!=='accept'){
      st.packageClosure=true;
      if(st.validated)st.standalone=200000;
      if(st.request==='improve'&&favourable)st.packageCost=650000;
    }
    const text=st.request==='accept'?'Supplier retains the opening terms. No clarification of package release has been obtained.':`Supplier supplies separate prices and explicit release wording for both routes. ${st.validated?'The standalone settlement falls to £200,000 after the evidence challenge.':'The standalone settlement remains £250,000 because the preliminary review was not validated.'} ${st.packageCost===650000?'The package falls to £650,000.':'The package remains £700,000.'}`;
    oracleRecord('Supplier',text);app.insertAdjacentHTML('beforeend',`<p>${text}</p>${oracleOffers()}`);app.appendChild(btn('Make final decision',()=>{st.round=5;oracleRound()}));
  }else{
    app.insertAdjacentHTML('beforeend',oracleOffers());
    [['separate','Choose separate settlement and purchase only what the business needs.'],['package','Choose the combined package and accept its fixed three-year commitment.'],['dispute','Decline both offers and continue a controlled evidence-based dispute.']].forEach(([a,t])=>app.appendChild(btn(t,()=>{oracleRecord('Customer',t);st.finalOutcome=a;oracleResults()})));
    app.insertAdjacentHTML('beforeend','<p>A continued dispute has no reliable final cost or resolution in this case. It will be recorded as an unresolved result, not scored as a completed deal.</p>');
  }
}
function oracleEvaluate(route) {
  const needed=st.variant==='approved_need';
  if(route==='dispute')return {unresolved:true};
  const cost=route==='separate'?st.standalone+(needed?600000:0):st.packageCost;
  const closure=route==='separate'||st.packageClosure;
  const relevant=route==='separate'||needed;
  const baseline=Math.min(st.standalone+(needed?600000:0),...(st.packageClosure?[st.packageCost]:[]));
  const economic=Math.round(30*Math.min(1,baseline/cost));
  const components={ 'Validated audit evidence':st.validated?15:0,'Explicit audit closure':closure?20:0,'Purchase justified by business need':relevant?20:0,'Compared separate and combined routes':st.compared?15:0 };
  const strategic=Object.values(components).reduce((a,b)=>a+b,0);
  return {cost,closure,relevant,economic,strategic,total:economic+strategic,components,baseline};
}
function oracleSupplierScore(route) {
  const weights=st.g.profiles[st.profile].hidden_distribution;
  const objectives=route==='package'?['profitability','new_business','customer_dependency','relationship_management']:['profitability','relationship_management'];
  const strategic=objectives.reduce((n,k)=>n+weights[k],0);
  const economic=route==='package'?Math.round(30*st.packageCost/700000):Math.round(30*st.standalone/250000);
  return {strategic,economic,total:strategic+economic};
}
function oracleResults() {
  const q=oracleEvaluate(st.finalOutcome);st.oracleResult=q;
  const selected=st.finalOutcome==='separate'?'Separate settlement':'Combined package';
  set(`<h2>Oracle Audit — Results</h2><p>Case ${st.variant==='approved_need'?'A: approved requirement':'B: no requirement'} • Supplier profile: <b>${label(st.profile)}</b></p>`);
  if(q.unresolved){
    app.insertAdjacentHTML('beforeend','<div class="notice"><b>Unresolved dispute — no completed-deal score</b><p>Challenging unsupported claims can be justified. This case does not establish the eventual liability, dispute costs or outcome, so it cannot assign a defensible economic score. No course score will be submitted for this run.</p></div>');
  }else{
    st.q={cf:q.total};const supplier=oracleSupplierScore(st.finalOutcome);
    const alternative=oracleEvaluate(st.finalOutcome==='package'?'separate':'package');
    const delta=q.cost-alternative.cost;
    app.insertAdjacentHTML('beforeend',`<p><b>Final decision:</b> ${selected}</p><div class="two"><div class="card"><h3>Customer</h3><p>Strategic: ${q.strategic}/70<br>Economic: ${q.economic}/30</p><p class="score">${q.total}/100</p></div><div class="card"><h3>Supplier</h3><p>Strategic: ${supplier.strategic}/70<br>Economic: ${supplier.economic}/30</p><p class="score">${supplier.total}/100</p></div></div><p>These are teaching utility scores, not cash values. Supplier and customer points measure different priorities; their difference does not establish a winner.</p><h3>Commercial result</h3><p>Selected three-year outlay: <b>${gbp(q.cost)}</b>. Alternative: <b>${gbp(alternative.cost)}</b>. ${delta===0?'Cash outlay is equal.':delta<0?`Selected route costs ${gbp(-delta)} less.`:`Selected route costs ${gbp(delta)} more.`}</p><p>${q.closure?'The selected agreement explicitly closes the specified audit scope.':'The selected package does not explicitly close the audit scope. Its cost cannot be treated as the full cost of a resolved audit.'} ${!alternative.closure?'The alternative package also has unresolved closure wording; its lower quoted price alone would not establish a better completed deal.':''}</p><p>${st.variant==='no_need'&&st.finalOutcome==='package'?'The package buys products with no established need. Withdrawing the headline claim does not make that commitment a saving.':st.finalOutcome==='package'?'The package covers an approved requirement. Compare its full price and release terms with separate settlement plus an equivalent purchase.':'Separate settlement preserves the ability to buy only what is required. Separation has value here only to the extent supported by the actual terms and costs.'}</p><h3>Score explained</h3><table class="history"><tr><th>Criterion</th><th>Points</th></tr>${Object.entries(q.components).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}<tr><td>Economic: 30 × lowest current explicitly closed route cost ÷ selected route cost, capped at 30 and rounded</td><td>${q.economic}</td></tr></table><p>Economic reference: ${gbp(q.baseline)}. Scores use only offers available at the final decision; they do not use hypothetical concessions from another path. Missing closure is separately penalised under strategic criteria.</p><h3>Supplier profile revealed</h3><p>${Object.entries(st.g.profiles[st.profile].hidden_distribution).map(([k,v])=>`${label(k)}: ${v}`).join(' · ')}</p><p>Supplier strategic points follow achieved objectives: separate settlement earns profitability and relationship points; a package also earns new-business and dependency points. Economic points: 30 × agreed settlement / £250,000, or 30 × package / £700,000.</p>`);
  }
  app.insertAdjacentHTML('beforeend',`<h3>Decision trail</h3><table class="history"><tr><th>Round</th><th>Actor</th><th>Decision / response</th></tr>${st.history.map(h=>`<tr><td>${h.round}</td><td>${h.actor}</td><td>${h.action}</td></tr>`).join('')}</table><h3>Lesson</h3><p>Resolve the evidence question and the purchase decision separately in your analysis, even if you ultimately sign one agreement. A package is defensible when it buys a real requirement on better overall terms and explicitly closes the agreed audit scope.</p>`);
  if(!q.unresolved){app.insertAdjacentHTML('beforeend','<h3>Record score</h3><p>Record this result for GAME-02?</p>');app.appendChild(btn('YES — record score',showSubmit));}
  app.appendChild(btn(q.unresolved?'Replay options':'NO — replay options',replay,'secondary'));
}
replay=function(){
  if(st.key!=='Oracle_Audit')return oracleOriginalReplay();
  set('<h2>Replay options</h2>');app.appendChild(btn('Replay same case and supplier profile',oracleStart));app.appendChild(btn('Choose another business case or profile',()=>selectGame('Oracle_Audit')));app.appendChild(btn('Return to game selection',home));
};

// Keep the current shared submission screen and return to this case's results.
const oracleBaseResults = results;
results = function(){
  if(st.key === 'Oracle_Audit' && st.variant) return oracleResults();
  return oracleBaseResults();
};
