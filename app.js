const app=document.getElementById('app');
const S=window.NEGOTIATION_SCENARIOS;
let st={};

document.getElementById('restart').onclick=()=>home();
const label=s=>String(s||'').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()).replace(/\bTco\b/g,'TCO').replace(/\bEol\b/g,'EOL');
function btn(text,fn,cls='option'){const b=document.createElement('button');b.className=cls;b.textContent=text;b.onclick=fn;return b}
function set(html){app.innerHTML=html}
function roundProgress(round){
  return `<div class="round-progress" aria-label="Round ${round} of 6">${[1,2,3,4,5,6].map(n=>`<span class="round-step ${n<round?'done':n===round?'current':''}"><b>${n}</b><small>${n===round?'Current':''}</small></span>`).join('')}</div>`;
}
function priorityLabel(value,points){
  const values=Object.values(points||{}).map(Number).filter(Number.isFinite);
  const max=Math.max(...values,0),min=Math.min(...values,0);
  if(value===max)return'Highest priority';
  if(value===min)return'Secondary';
  return'Important';
}
function ratingClass(r){return `rating-${String(r||'').toLowerCase().replace(/\s+/g,'-')}`}
function home(){
  st={history:[],effects:[],decisions:[],supplierDecisions:[],submissionAttempted:false};
  set(`<div class="screen-head"><div><p class="section-kicker">Choose a scenario</p><h2>Negotiation simulations</h2><p>Select a case and negotiate through six rounds. Your customer result can contribute up to 10 course points.</p></div></div><div id="scenario-grid" class="scenario-grid"></div>`);
  const grid=document.getElementById('scenario-grid');
  Object.entries(S).forEach(([k,g],i)=>{
    const card=document.createElement('button');
    card.className='scenario-card';
    card.innerHTML=`<span class="scenario-no">${String(i+1).padStart(2,'0')}</span><span class="scenario-type">6-round simulation · up to 10 course points</span><strong>${g.game.name}</strong><span class="scenario-desc">${g.brief}</span><span class="scenario-cta">Start simulation <b>→</b></span>`;
    card.onclick=()=>selectGame(k);grid.appendChild(card);
  });
}
function selectGame(k){
  st={...st,key:k,g:S[k],round:1,history:[],effects:[],decisions:[],supplierDecisions:[],submissionAttempted:false};
  const g=st.g;
  const priorities=Object.entries(g.customer_objective_points).map(([key,val])=>`<span class="priority-chip"><b>${label(key)}</b><small>${priorityLabel(val,g.customer_objective_points)}</small></span>`).join('');
  set(`<div class="screen-head"><div><p class="section-kicker">Scenario briefing</p><h2>${g.game.name}</h2><p>${g.brief}</p></div></div>
    <div class="brief-grid">
      <section class="brief-card customer-brief"><span class="brief-label">Your position</span><h3>Customer</h3><ul>${g.context.customer_position.map(x=>`<li>${x}</li>`).join('')}</ul></section>
      <section class="brief-card supplier-brief"><span class="brief-label">Counterparty</span><h3>Supplier</h3><ul>${g.context.supplier_position.map(x=>`<li>${x}</li>`).join('')}</ul></section>
    </div>
    <div class="challenge"><span>Negotiation challenge</span><strong>${g.context.key_question}</strong></div>
    <h3 class="subhead">Your negotiation priorities</h3>
    <div class="priority-list">${priorities}</div>
    <p class="muted-note">Exact scoring weights are revealed after the simulation so decisions are based on judgement rather than point optimisation.</p>
    <div class="profile-intro"><p class="section-kicker">Supplier behaviour scenario</p><h3>Choose the supplier behaviour scenario</h3><p>The simulator will use a hidden supplier priority structure throughout the negotiation. Its exact weighting is revealed only in Results.</p></div>
    <div id="profile-grid" class="profile-grid"></div>`);
  const grid=document.getElementById('profile-grid');
  Object.entries(g.profiles).sort((a,b)=>a[1].display_order-b[1].display_order).forEach(([key,p])=>{
    const b=document.createElement('button');b.className='profile-option';
    b.innerHTML=`<span>${String(p.display_order).padStart(2,'0')}</span><strong>${label(key)}</strong><small>${p.description}</small>`;
    b.onclick=()=>{st.profile=key;playRound()};grid.appendChild(b);
  });
}
function has(req){return req.every(x=>st.history.some(h=>h.action===x)||st.effects.includes(x))}
function validity(action){const req=st.g.path_rules[action]||[];return {ok:has(req),reason:req.length?`Requires: ${req.map(label).join(', ')}`:''}}
function availableActionsForRound(round){const r=st.g.rounds[`round_${round}`];return Object.keys(r.actions).filter(a=>validity(a).ok)}
function playRound(){
  if(st.round===2||st.round===5){supplierTurn();return}
  if(st.key==='SAP_Transformation'&&st.round===4){sapConcessionRound();return}
  const r=st.g.rounds[`round_${st.round}`];
  const isConcessionRound=st.round===4;
  const sectionTitle=isConcessionRound?'Concession exchange':'Available actions';
  const sectionPrompt=isConcessionRound?'Choose what value you are prepared to trade for an improved supplier position.':'Choose the action you would take at this point in the negotiation.';
  set(`<div class="round-head"><div><p class="section-kicker">${st.g.game.name}</p><h2>Round ${st.round} of 6 · ${isConcessionRound?'Concession exchange':'Your decision'}</h2></div></div>${roundProgress(st.round)}
    <section class="action-section"><h3>${sectionTitle}</h3><p>${sectionPrompt}</p><div id="available" class="action-grid"></div></section>
    <details id="blocked" class="blocked-panel"><summary>Unavailable options <span id="blocked-count"></span></summary><div id="blocked-list"></div></details>`);
  const av=document.getElementById('available'),bl=document.getElementById('blocked-list');let blockedCount=0;
  Object.entries(r.actions).forEach(([a,d])=>{
    const v=validity(a);
    if(v.ok){
      const b=document.createElement('button');b.className='action-card';
      b.innerHTML=`<strong>${label(a)}</strong><span>${d}</span><em>Select →</em>`;
      b.onclick=()=>customerAction(a);av.appendChild(b);
    }else{
      blockedCount++;
      bl.insertAdjacentHTML('beforeend',`<div class="blocked-row"><strong>${label(a)}</strong><span>${d}</span><small>${v.reason}</small></div>`);
    }
  });
  document.getElementById('blocked-count').textContent=blockedCount?`(${blockedCount})`:'(0)';
  if(!blockedCount)bl.innerHTML='<p class="muted-note">No options are currently blocked.</p>';
}
function sapConcessionRound(){
  const r=st.g.rounds.round_4;
  if(!st.sapSupplierOffer){
    const prefs=st.g.round4_supplier_preferences?.[st.profile]||[],offer=prefs[0]||Object.keys(st.g.round4_supplier_offers||{})[0];
    if(!offer){set('<p class="notice error">No SAP concession offer is configured.</p>');return}
    st.sapSupplierOffer=offer;
    st.supplierDecisions.push({round:4,action:offer,preferenceKey:'round4_supplier_offer',rank:1,validActions:[...prefs],effects:[]});
    st.history.push({round:4,actor:'Supplier',action:offer});
  }
  const offer=st.sapSupplierOffer,offerText=st.g.round4_supplier_offers?.[offer]||label(offer);
  set(`<div class="round-head"><div><p class="section-kicker">${st.g.game.name}</p><h2>Round 4 of 6 · Concession exchange</h2></div></div>${roundProgress(4)}
    <div class="supplier-response"><span class="response-label">SAP is prepared to offer</span><h3>${label(offer)}</h3><p>${offerText}</p></div>
    <section class="action-section"><h3>What are you prepared to trade in return?</h3><p>Choose the reciprocal customer concession. The value of the exchange depends on both sides of the trade.</p><div id="available" class="action-grid"></div></section>`);
  const av=document.getElementById('available'),available=Object.keys(r.actions).filter(a=>validity(a).ok);
  available.forEach(a=>{const b=document.createElement('button');b.className='action-card';b.innerHTML=`<strong>${label(a)}</strong><span>${r.actions[a]}</span><em>Select →</em>`;b.onclick=()=>customerAction(a);av.appendChild(b)});
}
function concessionPairValue(action){
  if(st.key!=='SAP_Transformation'||!st.sapSupplierOffer)return Number(st.g.concession_modifiers?.[st.profile]?.[action]??0);
  return Number(st.g.concession_pair_modifiers?.[st.profile]?.[st.sapSupplierOffer]?.[action]??0);
}
function recordDecision(action,available,extra={}){st.decisions.push({round:st.round,action,available:[...available],effectsBefore:[...st.effects],historyBefore:st.history.map(x=>({...x})),...extra})}
function customerAction(a){const available=availableActionsForRound(st.round);recordDecision(a,available);if(st.round===6&&a==='change_direction')return chooseReplacement();st.history.push({round:st.round,actor:'Customer',action:a});const effects=st.g.action_effects[a]||[];effects.forEach(e=>{if(!st.effects.includes(e))st.effects.push(e)});if(st.g.terminal&&st.g.terminal[a]){st.finalOutcome=st.g.terminal[a];return results()}if(st.round===3)st.round3=a;if(st.round===4)st.concessionExchange=a;if(st.round===6){if(a==='commit') return finalizeCurrent();if(a==='withdraw'){st.finalOutcome=st.key==='SAP_Transformation'?'continue_delay':'dispute';return results()}}st.round++;playRound()}
function supplierTurn(){
  const rn=`round_${st.round}`,r=st.g.rounds[rn];let prefKey=rn;
  if(st.round===5&&st.round3==='negotiate_concession')prefKey='round_5_after_negotiate_concession';
  const prefs=st.g.preferences[st.profile][prefKey]||[],valid=prefs.filter(a=>r.actions[a]&&validity(a).ok),a=valid[0];
  if(!a){set('<p class="notice error">The scenario contains no valid supplier action for this state.</p>');return}
  const effects=st.g.action_effects[a]||[];
  st.supplierDecisions.push({round:st.round,action:a,preferenceKey:prefKey,rank:prefs.indexOf(a)+1,validActions:[...valid],effects:[...effects]});
  st.history.push({round:st.round,actor:'Supplier',action:a});effects.forEach(e=>{if(!st.effects.includes(e))st.effects.push(e)});
  set(`<div class="round-head"><div><p class="section-kicker">${st.g.game.name}</p><h2>Round ${st.round} of 6 · Supplier response</h2></div></div>${roundProgress(st.round)}
    <div class="supplier-response"><span class="response-label">Supplier response</span><h3>${label(a)}</h3><p>${r.actions[a]}</p>${effects.length?`<div class="what-changed"><strong>What changed</strong><p>${effects.map(effectExplanation).join(' ')}</p></div>`:''}</div><div class="primary-row" id="continue-row"></div>`);
  document.getElementById('continue-row').appendChild(btn('Continue to next round',()=>{st.round++;playRound()},'primary'));
}
function resolveCurrentOutcome(){let o=st.round3;if((st.g.intermediate_actions||[]).includes(o)){const supplier5=st.history.find(h=>h.round===5)?.action;o=st.g.outcome_resolution?.[o]?.[supplier5]}return o||null}
function finalizeCurrent(){st.finalOutcome=resolveCurrentOutcome();results()}
function chooseReplacement(){
  const r3=st.g.rounds.round_3.actions,current=resolveCurrentOutcome(),available=[],blocked=[];
  set(`<div class="round-head"><div><p class="section-kicker">${st.g.game.name}</p><h2>Round 6 of 6 · Change direction</h2></div></div>${roundProgress(6)}<section class="action-section"><h3>Available outcomes</h3><div id="replacement-grid" class="action-grid"></div></section><details class="blocked-panel"><summary>Unavailable outcomes <span id="replacement-blocked-count"></span></summary><div id="replacement-blocked"></div></details>`);
  const grid=document.getElementById('replacement-grid'),bl=document.getElementById('replacement-blocked');
  Object.entries(r3).forEach(([a,d])=>{
    if((st.g.intermediate_actions||[]).includes(a))return;
    if(a===current){blocked.push({a,d,reason:'Current outcome cannot be selected as a change of direction.'});return}
    const v=validity(a);
    if(v.ok){
      available.push(a);const b=document.createElement('button');b.className='action-card';b.innerHTML=`<strong>${label(a)}</strong><span>${d}</span><em>Select →</em>`;
      b.onclick=()=>{const drec=st.decisions[st.decisions.length-1];drec.replacement=a;drec.replacementAvailable=[...availableActionsForReplacement()];st.history.push({round:6,actor:'Customer',action:`change_direction → ${a}`});st.finalOutcome=a;results()};grid.appendChild(b);
    }else blocked.push({a,d,reason:v.reason});
  });
  if(!available.length)grid.innerHTML='<p class="notice error">No alternative valid outcome is available.</p>';
  blocked.forEach(x=>bl.insertAdjacentHTML('beforeend',`<div class="blocked-row"><strong>${label(x.a)}</strong><span>${x.d}</span><small>${x.reason}</small></div>`));
  document.getElementById('replacement-blocked-count').textContent=`(${blocked.length})`;
}
function availableActionsForReplacement(){const current=resolveCurrentOutcome();return Object.keys(st.g.rounds.round_3.actions).filter(a=>a!==current&&!(st.g.intermediate_actions||[]).includes(a)&&validity(a).ok)}
function outcomeScore(outcome,party='customer'){const ach=st.g.objective_achievement[outcome]||{customer:[],supplier:[]};if(party==='customer'){const strategic=(ach.customer||[]).reduce((n,x)=>n+(st.g.customer_objective_points[x]||0),0);return strategic+(st.g.customer_economic_scores[outcome]??0)}const strategic=(ach.supplier||[]).reduce((n,x)=>n+(st.g.profiles[st.profile].hidden_distribution[x]||0),0);return strategic+(st.g.supplier_economic_scores[outcome]??0)}
function concessionModifier(){const action=st.concessionExchange;if(!action)return 0;return concessionPairValue(action)}
function score(){const o=st.finalOutcome,ach=st.g.objective_achievement[o]||{customer:[],supplier:[]};const cs=(ach.customer||[]).reduce((n,x)=>n+(st.g.customer_objective_points[x]||0),0);const ss=(ach.supplier||[]).reduce((n,x)=>n+(st.g.profiles[st.profile].hidden_distribution[x]||0),0);const ce=st.g.customer_economic_scores[o]??0,se=st.g.supplier_economic_scores[o]??0,cm=concessionModifier();const cf=Math.max(0,Math.min(100,cs+ce+cm));return {ach,cs,ss,ce,se,cm,cf,sf:ss+se}}
function missedOpportunityGap(){const r3=st.decisions.find(d=>d.round===3);const r6=st.decisions.find(d=>d.round===6);if(!r3||!r6)return 0;const preserved=resolveCurrentOutcome();const final=st.finalOutcome;if(!preserved||!final)return 0;return Math.max(0,outcomeScore(preserved)-outcomeScore(final))}
function classify(cf,sf){const gap=missedOpportunityGap();if(gap>=15)return'Missed Opportunity';if(cf>=60&&sf>=60)return'Mutual Gain';if(cf<=44&&sf<=44)return'Deadlock';if(cf>=60&&cf>sf)return'Strong Customer Result';if(sf>=60&&sf>cf)return'Strong Supplier Result';if(cf>sf)return'Limited Customer Advantage';if(sf>cf)return'Limited Supplier Advantage';return'Balanced Result'}
function classificationNote(classification,cf,sf){const gap=missedOpportunityGap();if(classification==='Missed Opportunity')return `The final decision reduced the customer result by ${gap} points compared with the outcome that Commit would have preserved.`;if(classification==='Strong Customer Result')return `The customer achieved a high absolute score (${cf}/100) and outperformed the supplier.`;if(classification==='Strong Supplier Result')return `The supplier achieved a high absolute score (${sf}/100) and outperformed the customer.`;if(classification==='Limited Customer Advantage')return `The customer outscored the supplier, but the absolute customer result remained below 60/100.`;if(classification==='Limited Supplier Advantage')return `The supplier outscored the customer, but the absolute supplier result remained below 60/100.`;if(classification==='Mutual Gain')return 'Both parties achieved at least 60/100.';if(classification==='Deadlock')return 'Both parties achieved 44/100 or less.';return 'Both parties finished with the same score.'}
function objectivesForOutcome(o,party='customer'){return (st.g.objective_achievement[o]?.[party]||[]).map(label)}
function effectExplanation(e){const map={concession_available:'Partial transition became available.',increased_delay_cost:'The cost of delay increased.',eol_risk_active:'End-of-life risk became active.',relationship_stabilized:'The relationship was stabilised.',formal_notice_active:'Rejection of notice became available.',commercial_pressure_active:'Escalated pressure became available.',improved_concession_active:'An improved negotiated offer became available.'};return map[e]||label(e)}
function actionAnalysis(action,actor='customer'){return st.g.analysis_rules?.[actor+'_actions']?.[action]||null}
function renderSupplierAnalysis(){return st.supplierDecisions.map(d=>{const alternatives=d.validActions.filter(x=>x!==d.action),a=actionAnalysis(d.action,'supplier');return `<div class="analysis-card"><strong>Round ${d.round}: ${label(d.action)}</strong><p><b>Commercial signal:</b> ${a?.signal||'No action-specific signal is defined.'}</p><p><b>Supplier objective:</b> ${a?.objective||'No action-specific objective is defined.'}</p><p><b>Why selected:</b> It was the highest-ranked valid action in the locked ${label(st.profile)} preference list.</p><p><b>Recommended customer response:</b> ${a?.response||'Assess the action against the customer objectives and available alternatives.'}</p><p><b>Other valid supplier actions:</b> ${alternatives.length?alternatives.map(label).join(', '):'None'}</p><p><b>State effect:</b> ${d.effects.length?d.effects.map(effectExplanation).join(' '):'No state effect was defined.'}</p></div>`}).join('')||'<p>No supplier decisions were recorded.</p>'}
function decisionOutcome(d){if(d.round===1&&st.g.terminal?.[d.action])return st.g.terminal[d.action];if(d.round===3&&!(st.g.intermediate_actions||[]).includes(d.action))return d.action;if(d.round===6)return d.action==='commit'?resolveCurrentOutcome():d.action==='withdraw'?(st.key==='SAP_Transformation'?'continue_delay':'dispute'):d.replacement;return null}
function ratingForDecision(d){if(d.round===1)return d.action==='accept_migration'?'Moderate':'Strong';const selected=decisionOutcome(d);if(!selected)return'Moderate';let alternatives=[];if(d.round===3)alternatives=d.available.filter(a=>a!==d.action&&!(st.g.intermediate_actions||[]).includes(a));else if(d.round===6){const preserved=resolveCurrentOutcome();alternatives=[preserved,...(d.replacementAvailable||[])].filter((a,i,arr)=>a&&a!==selected&&arr.indexOf(a)===i)}if(!alternatives.length)return'Strong';const best=Math.max(...alternatives.map(a=>outcomeScore(a)));const gap=best-outcomeScore(selected);const r=st.g.analysis_rules?.rating_rubric||{excellent:0,strong:10,moderate:20,weak:30};if(gap<=r.excellent)return'Excellent';if(gap<=r.strong)return'Strong';if(gap<=r.moderate)return'Moderate';if(gap<=r.weak)return'Weak';return'Poor'}
function renderDecisionReview(){return st.decisions.map(d=>{const shown=d.replacement?`${label(d.action)} → ${label(d.replacement)}`:label(d.action),a=actionAnalysis(d.action,'customer'),out=decisionOutcome(d);let consequence='The negotiation continued.';let options='';if(d.round===1&&st.g.terminal?.[d.action]){consequence=`The negotiation ended immediately with ${label(st.g.terminal[d.action])}.`;options='All later negotiation options were closed.'}else if(d.round===1){options='The student retained access to later negotiation rounds.'}else if(d.round===3){consequence=out?`If preserved, this action would produce ${label(out)} with a customer score of ${outcomeScore(out)}.`:'The action created an intermediate state and preserved further negotiation.';options=`Other valid choices at the time: ${d.available.filter(x=>x!==d.action).map(label).join(', ')||'None'}.`}else if(d.round===4){consequence=st.key==='SAP_Transformation'?`SAP offered ${label(st.sapSupplierOffer)}; you offered ${label(d.action)} in return.`:`You offered ${label(d.action)} as the value exchange before the supplier's next response.`;options=`Other concession choices available: ${d.available.filter(x=>x!==d.action).map(label).join(', ')||'None'}.`; }else if(d.round===6){consequence=`The decision made ${label(out)} the final outcome.`;options=d.action==='commit'?'The current outcome was preserved.':`Commit would have preserved ${label(resolveCurrentOutcome())}.`}const rating=ratingForDecision(d);return `<div class="analysis-card"><div class="analysis-card-head"><strong>Round ${d.round}: ${shown}</strong><span class="rating-badge ${ratingClass(rating)}">${rating}</span></div><p><b>Benefit:</b> ${a?.benefit||'The decision changed the available negotiation path.'}</p><p><b>Risk:</b> ${a?.risk||'The decision may reduce later options.'}</p><p><b>Decision consequence:</b> ${consequence}</p><p><b>Options affected:</b> ${options}</p><p><b>Advice:</b> ${a?.advice||'Compare the decision with the strongest valid alternative using the same information available at the time.'}</p></div>`}).join('')}
function opportunityCost(d){let selected,alternatives;if(d.round===3){selected=d.action;if((st.g.intermediate_actions||[]).includes(selected))return null;alternatives=d.available.filter(a=>a!==selected&&!(st.g.intermediate_actions||[]).includes(a))}else if(d.round===6){const preserved=resolveCurrentOutcome();selected=d.action==='commit'?preserved:d.action==='withdraw'?(st.key==='SAP_Transformation'?'continue_delay':'dispute'):d.replacement;alternatives=[preserved,...(d.replacementAvailable||[])].filter((a,i,arr)=>a&&a!==selected&&arr.indexOf(a)===i)}else return null;if(!selected||!alternatives.length)return null;const best=[...alternatives].sort((a,b)=>outcomeScore(b)-outcomeScore(a))[0];const diff=outcomeScore(selected)-outcomeScore(best);return {alternative:label(best),gained:`Selected ${label(selected)} produced ${outcomeScore(selected)} customer points and achieved: ${objectivesForOutcome(selected).join(', ')||'None'}.`,sacrificed:`The strongest comparable valid alternative produced ${outcomeScore(best)} customer points and achieved: ${objectivesForOutcome(best).join(', ')||'None'}.`,net:diff>0?`The selected action outperformed the strongest valid alternative by ${diff} customer points.`:diff===0?'The selected action and strongest valid alternative produced the same customer score.':`The selected action underperformed the strongest valid alternative by ${Math.abs(diff)} customer points.`}}
function renderOpportunityCost(){const rows=st.decisions.map(d=>({d,a:opportunityCost(d)})).filter(x=>x.a);if(!rows.length)return'<p>No comparable final-outcome alternatives were available for the recorded decisions.</p>';return rows.map(({d,a})=>{const shown=d.replacement?`${label(d.action)} → ${label(d.replacement)}`:label(d.action);return `<div class="analysis-card"><strong>Round ${d.round}: ${shown}</strong><p><b>Alternative Action:</b> ${a.alternative}</p><p><b>What Was Gained:</b> ${a.gained}</p><p><b>What Was Sacrificed:</b> ${a.sacrificed}</p><p><b>Net Assessment:</b> ${a.net}</p></div>`}).join('')}
function renderBestAnswers(){
  if(st.key!=='SAP_Transformation')return'';
  const rows=[];
  const add=(round,chosen,best,reason)=>rows.push(`<div class="analysis-card"><strong>Round ${round}</strong><p><b>Your choice:</b> ${chosen}</p><p><b>Best available answer:</b> ${best}</p><p>${reason}</p></div>`);
  const d1=st.decisions.find(d=>d.round===1);
  if(d1)add(1,label(d1.action),label('negotiate'),'Keeps options open and tests SAP’s willingness to trade without making a premature transformation commitment.');
  const d3=st.decisions.find(d=>d.round===3);
  if(d3){const candidates=d3.available.filter(a=>!(st.g.intermediate_actions||[]).includes(a));const best=[...candidates].sort((a,b)=>outcomeScore(b)-outcomeScore(a))[0];if(best)add(3,label(d3.action),label(best),actionAnalysis(best,'customer')?.advice||'This was the strongest available customer outcome at this stage.');}
  const d4=st.decisions.find(d=>d.round===4);
  if(d4){const best=[...d4.available].sort((a,b)=>concessionPairValue(b)-concessionPairValue(a))[0];if(best)add(4,`${label(st.sapSupplierOffer)} ↔ ${label(d4.action)}`,`${label(st.sapSupplierOffer)} ↔ ${label(best)}`,`This pairing gives the strongest value balance against SAP’s ${label(st.sapSupplierOffer)} offer under the selected supplier profile.`);}
  const d6=st.decisions.find(d=>d.round===6);
  if(d6){
    const preserved=resolveCurrentOutcome(),candidates=[];
    if(preserved)candidates.push({answer:'Commit',outcome:preserved});
    if(d6.available.includes('withdraw'))candidates.push({answer:'Withdraw',outcome:'continue_delay'});
    if(d6.available.includes('change_direction'))availableActionsForReplacement().forEach(o=>candidates.push({answer:`Change Direction → ${label(o)}`,outcome:o}));
    const best=[...candidates].sort((a,b)=>outcomeScore(b.outcome)-outcomeScore(a.outcome))[0];
    const chosen=d6.replacement?`${label(d6.action)} → ${label(d6.replacement)}`:label(d6.action);
    if(best)add(6,chosen,best.answer,'Produces the strongest available customer outcome at the final decision point.');
  }
  return rows.join('')||'<p>No customer decisions were recorded.</p>';
}
function renderConceptApplications(){const actions=st.history.map(x=>x.action);const outcome=st.finalOutcome;const cards=[];const add=(title,text)=>cards.push(`<div class="concept-card"><strong>${title}</strong><p>${text}</p></div>`);add('Information Asymmetry',`The supplier profile remained hidden until Results. The customer therefore had to act without knowing that the supplier was ${label(st.profile)}.`);if(st.key==='SAP_Transformation'){if(['full_migration','partial_transition'].includes(outcome))add('Vendor Lock-In',`${label(outcome)} changed the customer's future dependency on SAP and reduced the ease of switching direction.`);if(['continue_delay','competitive_leverage'].includes(outcome))add('Supply Risk Management',`${label(outcome)} preserved flexibility but left continuity, legacy-platform or switching risks to be managed.`);if(actions.some(a=>['commercial_concession','relationship_preservation'].includes(a)))add('Relationship Management','Supplier concessions or relationship-preservation actions required the customer to distinguish measurable value from general relationship intent.');if(actions.includes('competitive_leverage'))add('Negotiation Leverage','Competitive alternatives strengthened the customer position only to the extent that those alternatives were credible and executable.');}
else {if(actions.some(a=>['audit_expansion','formal_notice','litigation_arbitration'].includes(a))||['dispute','rejection_of_notice'].includes(outcome))add('Software Licensing Risk',`${label(outcome)} required the customer to manage evidence, contractual exposure and potential enforcement consequences.`);if(actions.some(a=>['settlement_offer','concession_offer','improved_concession'].includes(a))||['settlement','concession','improved_concession'].includes(outcome))add('Commercial Leverage','The audit resolution combined liability, settlement economics and potential future business commitments.');if(actions.some(a=>['formal_notice','litigation_arbitration','dispute','rejection_of_notice'].includes(a)))add('Governance','The chosen path required documented evidence, clear approvals and coordinated legal-commercial governance.');}
return cards.join('')||'<p>No course-concept application was deterministically supported by the recorded path.</p>'}
function results(){
  const q=score();st.q=q;const classification=classify(q.cf,q.sf),courseScore=Math.max(0,Math.min(10,Math.round(q.cf/10)));
  const learningReview=st.key==='SAP_Transformation'?`<details><summary>Best answer by round</summary><div class="detail-body">${renderBestAnswers()}</div></details>`:`<details><summary>Opportunity cost</summary><div class="detail-body">${renderOpportunityCost()}</div></details>`;
  set(`<div class="results-hero"><p class="section-kicker">Simulation complete</p><h2>Negotiation Result — ${classification}</h2><div class="result-meta"><span><small>Final outcome</small><strong>${label(st.finalOutcome)}</strong></span><span><small>Course score earned</small><strong>${courseScore}/10</strong></span></div><p>${classificationNote(classification,q.cf,q.sf)}</p></div>
    <div class="score-grid"><div class="score-card customer-score"><span>Customer</span><strong>${q.cf}<small>/100</small></strong><p>Strategic ${q.cs} · Economic ${q.ce} · Concession ${q.cm>=0?'+':''}${q.cm}</p><small>Objectives: ${q.ach.customer.map(label).join(', ')||'None'}</small></div><div class="score-card supplier-score"><span>Supplier</span><strong>${q.sf}<small>/100</small></strong><p>Strategic ${q.ss} · Economic ${q.se}</p><small>Objectives: ${q.ach.supplier.map(label).join(', ')||'None'}</small></div></div>
    <section class="profile-reveal"><p class="section-kicker">Supplier profile revealed</p><h3>${label(st.profile)}</h3><p>${st.g.profiles[st.profile].description}</p><div class="weight-grid">${Object.entries(st.g.profiles[st.profile].hidden_distribution).map(([k,v])=>`<span><b>${label(k)}</b><strong>${v}</strong></span>`).join('')}</div></section>
    <div class="result-sections"><details open><summary>What happened</summary><div class="detail-body">${renderSupplierAnalysis()}</div></details><details><summary>Your decisions</summary><div class="detail-body">${renderDecisionReview()}</div></details>${learningReview}<details><summary>Course concepts</summary><div class="detail-body concept-grid">${renderConceptApplications()}</div></details><details><summary>Negotiation history</summary><div class="detail-body"><div class="table-wrap"><table class="history"><tr><th>Round</th><th>Actor</th><th>Action</th></tr>${st.history.map(h=>`<tr><td>${h.round}</td><td>${h.actor}</td><td>${label(h.action)}</td></tr>`).join('')}</table></div></div></details></div>
    <section class="record-card"><div><p class="section-kicker">Course assessment</p><h3>Course score earned: ${courseScore}/10</h3><p>Record this result against ${st.g.game.assessment_id}, or replay the simulation.</p></div><div id="record" class="record-actions"></div></section>`);
  const rec=document.getElementById('record');rec.appendChild(btn('Record my score',showSubmit,'primary'));rec.appendChild(btn('Replay simulation',replay,'secondary'));
}
function showSubmit(){
  const courseScore=Math.round(st.q.cf/10);
  set(`<div class="submit-screen"><p class="section-kicker">Course assessment</p><h2>Record your score</h2><div class="submit-score"><span>Negotiation result</span><strong>${st.q.cf}/100</strong><span>Course score</span><strong>${courseScore}/10</strong></div><p>Assessment: <strong>${st.g.game.assessment_id}</strong></p><label class="field-label">Student ID<input id="sid" placeholder="YYMMDD-##" autocomplete="off"></label><div id="msg"></div><div id="submit-actions" class="record-actions"></div></div>`);
  document.getElementById('submit-actions').appendChild(btn('Submit score',submitScore,'primary'));
  document.getElementById('submit-actions').appendChild(btn('Back to results',results,'secondary'));
}
async function submitScore(){
  const sid=document.getElementById('sid').value.trim(),msg=document.getElementById('msg');
  if(!/^\d{6}-\d{2}$/.test(sid)){msg.innerHTML='<p class="notice error">Student ID format is invalid.</p>';return}
  if(st.submissionAttempted){msg.innerHTML='<p class="notice">This result has already been recorded for this simulation.</p>';return}
  const url=window.PORTAL_CONFIG?.submitAssessmentUrl;
  if(!url){msg.innerHTML='<p class="notice error">Score submission is temporarily unavailable.</p>';return}
  const submitButton=document.querySelector('#submit-actions .primary');if(submitButton){submitButton.disabled=true;submitButton.textContent='Submitting…'}
  try{
    const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({StudentID:sid,AssessmentID:st.g.game.assessment_id,Score:Math.round(st.q.cf/10)})});
    const text=await r.text();let body;try{body=text?JSON.parse(text):{}}catch{body=text}
    if(r.ok){
      st.submissionAttempted=true;
      const progress=body?.CompletedAssessments!==undefined&&body?.RequiredAssessments!==undefined?` Course progress: ${body.CompletedAssessments}/${body.RequiredAssessments} assessments completed${body?.TotalScore!==undefined?`, total score ${body.TotalScore}/100`:''}.`:'';
      msg.innerHTML=`<p class="notice success">Score successfully recorded.${escapeHtml(progress)}</p>`;
    }else{
      const message=body?.message||body||`Submission failed (${r.status}).`,duplicate=r.status===409||/already/i.test(String(message));
      if(duplicate)st.submissionAttempted=true;
      msg.innerHTML=`<p class="notice ${duplicate?'':'error'}">${escapeHtml(String(message))}</p>`;
    }
  }catch(e){
    msg.innerHTML='<p class="notice error">The score could not be submitted. Please try again.</p>';
  }finally{
    if(submitButton&&!st.submissionAttempted){submitButton.disabled=false;submitButton.textContent='Submit score'}
  }
}
function replay(){
  set(`<div class="screen-head"><div><p class="section-kicker">Replay</p><h2>Choose what to do next</h2></div></div><div id="replay-options" class="action-grid"></div>`);
  const box=document.getElementById('replay-options');
  box.appendChild(btn('Replay same game with another supplier profile',()=>selectGame(st.key),'action-card'));
  box.appendChild(btn('Replay same profile with different decisions',()=>{const p=st.profile,k=st.key;st={history:[],effects:[],decisions:[],supplierDecisions:[],submissionAttempted:false,key:k,g:S[k],round:1,profile:p};playRound()},'action-card'));
  box.appendChild(btn('Return to game selection',home,'action-card'));
}
home();


// Student results retrieval
const resultsButton=document.getElementById('getStudentResults');
if(resultsButton){
  resultsButton.onclick=getStudentResults;
}

async function getStudentResults(){
  const sid=document.getElementById('resultsStudentId').value.trim();
  const msg=document.getElementById('studentResultsMessage');
  const output=document.getElementById('studentResultsOutput');

  msg.innerHTML='';
  output.innerHTML='';

  if(!/^\d{6}-\d{2}$/.test(sid)){
    msg.innerHTML='<p class="notice error">Student ID format is invalid.</p>';
    return;
  }

  const url=window.PORTAL_CONFIG?.getStudentResultsUrl;
  if(!url){
    msg.innerHTML='<p class="notice error">Student results URL is not configured in config.js.</p>';
    return;
  }

  resultsButton.disabled=true;
  resultsButton.textContent='Loading...';

  try{
    const response=await fetch(url,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({StudentID:sid})
    });

    let body;
    const text=await response.text();
    try{body=text?JSON.parse(text):{}}catch{body=text}

    if(!response.ok){
      const errorMessage=
        body?.message||
        body?.error?.message||
        (typeof body==='string'?body:`Request failed (${response.status}).`);
      msg.innerHTML=`<p class="notice error">${escapeHtml(String(errorMessage))}</p>`;
      return;
    }

    renderStudentResults(body,output);
  }catch(error){
    msg.innerHTML=`<p class="notice error">${escapeHtml(error.message)}</p>`;
  }finally{
    resultsButton.disabled=false;
    resultsButton.textContent='View results';
  }
}

function renderStudentResults(data,container){
  const records=findResultsArray(data),rows=records.map(normalizeResultRecord);
  const totalRaw=Number(data?.TotalScore??data?.totalScore),total=Number.isFinite(totalRaw)?totalRaw:rows.reduce((sum,row)=>sum+(Number.isFinite(row.score)?row.score:0),0);
  const completedRaw=Number(data?.CompletedAssessments??data?.completedAssessments),requiredRaw=Number(data?.RequiredAssessments??data?.requiredAssessments),remainingRaw=Number(data?.AssessmentsRemaining??data?.assessmentsRemaining),bonusRaw=Number(data?.CompletionBonusIncluded??data?.completionBonusIncluded);
  const completed=Number.isFinite(completedRaw)?completedRaw:rows.length,required=Number.isFinite(requiredRaw)?requiredRaw:null,remaining=Number.isFinite(remainingRaw)?remainingRaw:(required!==null?Math.max(required-completed,0):null),bonus=Number.isFinite(bonusRaw)?bonusRaw:0;
  if(!records.length&&!Number.isFinite(totalRaw)){container.innerHTML=`<p class="notice">${escapeHtml(String(data?.message||'No recorded assessment results were returned for this Student ID.'))}</p>`;return}
  container.innerHTML=`<div class="course-progress"><div class="progress-score"><span>Course score</span><strong>${total}<small>/100</small></strong></div><div class="progress-facts"><span><b>${completed}${required!==null?` / ${required}`:''}</b> assessments completed</span>${remaining!==null?`<span><b>${remaining}</b> remaining</span>`:''}<span><b>${bonus?`+${bonus}`:'Not yet earned'}</b> completion bonus</span></div></div>${rows.length?`<div class="table-wrap"><table class="results-table"><thead><tr><th>Assessment</th><th>Score</th><th>Date</th></tr></thead><tbody>${rows.map(row=>`<tr><td>${escapeHtml(row.assessmentId||'—')}</td><td>${row.scoreDisplay}</td><td>${escapeHtml(row.date||'—')}</td></tr>`).join('')}</tbody></table></div>`:''}`;
}
function findResultsArray(data){
  if(Array.isArray(data))return data;
  if(!data||typeof data!=='object')return [];
  const candidates=[
    data.results,
    data.Results,
    data.assessments,
    data.Assessments,
    data.records,
    data.Records,
    data.value,
    data.body
  ];
  for(const candidate of candidates){
    if(Array.isArray(candidate))return candidate;
    if(candidate&&typeof candidate==='object'){
      const nested=findResultsArray(candidate);
      if(nested.length)return nested;
    }
  }
  return [];
}

function normalizeResultRecord(record) {
  const assessmentField =
    record.AssessmentID ??
    record.assessmentId ??
    record.AssessmentId ??
    record.Assessment ??
    record.assessment ??
    record.Title ??
    record.title ??
    "";

  const assessmentId =
    typeof assessmentField === "object" && assessmentField !== null
      ? assessmentField.Value ?? assessmentField.value ?? ""
      : assessmentField;

  const rawScore =
    record.Score ??
    record.score ??
    record.Points ??
    record.points ??
    record.Result ??
    record.result;

  const numericScore = Number(rawScore);

  const maximum =
    record.MaximumScore ??
    record.maximumScore ??
    record.MaxScore ??
    record.maxScore;

  const scoreDisplay = Number.isFinite(numericScore)
    ? `${numericScore}${
        maximum !== undefined && maximum !== null ? `/${maximum}` : ""
      }`
    : String(rawScore ?? "—");

  const rawDate =
    record.SubmittedAt ??
    record.submittedAt ??
    record.Created ??
    record.created ??
    record.Date ??
    record.date ??
    "";

  let formattedDate = "—";

  if (rawDate) {
    const parsedDate = new Date(rawDate);

    if (!Number.isNaN(parsedDate.getTime())) {
      formattedDate = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Tbilisi",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
      }).format(parsedDate);
    }
  }

  return {
    assessmentId: String(assessmentId),
    score: Number.isFinite(numericScore) ? numericScore : 0,
    scoreDisplay,
    date: formattedDate
  };
}
function escapeHtml(value){
  return String(value)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'","&#039;");
}
