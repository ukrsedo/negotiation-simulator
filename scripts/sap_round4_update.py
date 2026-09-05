from pathlib import Path

app = Path('app.js')
text = app.read_text()

old = "function playRound(){\n  if(st.round===2||st.round===5){supplierTurn();return}\n  const r=st.g.rounds[`round_${st.round}`];"
new = "function playRound(){\n  if(st.round===2||st.round===5){supplierTurn();return}\n  if(st.key==='SAP_Transformation'&&st.round===4){sapConcessionRound();return}\n  const r=st.g.rounds[`round_${st.round}`];"
if old not in text:
    raise SystemExit('playRound target not found')
text = text.replace(old, new, 1)

anchor = "function recordDecision(action,available,extra={}){st.decisions.push({round:st.round,action,available:[...available],effectsBefore:[...st.effects],historyBefore:st.history.map(x=>({...x})),...extra})}"
insert = r'''function sapConcessionRound(){
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
'''
if anchor not in text:
    raise SystemExit('recordDecision anchor not found')
text = text.replace(anchor, insert + anchor, 1)

old = "function concessionModifier(){const action=st.concessionExchange;if(!action)return 0;return Number(st.g.concession_modifiers?.[st.profile]?.[action]??0)}"
new = "function concessionModifier(){const action=st.concessionExchange;if(!action)return 0;return concessionPairValue(action)}"
if old not in text:
    raise SystemExit('concessionModifier target not found')
text = text.replace(old, new, 1)

old = "else if(d.round===4){consequence=`You offered ${label(d.action)} as the value exchange before the supplier's next response.`;options=`Other concession choices available: ${d.available.filter(x=>x!==d.action).map(label).join(', ')||'None'}.`; }"
new = "else if(d.round===4){consequence=st.key==='SAP_Transformation'?`SAP offered ${label(st.sapSupplierOffer)}; you offered ${label(d.action)} in return.`:`You offered ${label(d.action)} as the value exchange before the supplier's next response.`;options=`Other concession choices available: ${d.available.filter(x=>x!==d.action).map(label).join(', ')||'None'}.`; }"
if old not in text:
    raise SystemExit('round4 review target not found')
text = text.replace(old, new, 1)

anchor = "function renderConceptApplications(){"
insert = r'''function renderBestAnswers(){
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
'''
if anchor not in text:
    raise SystemExit('renderConceptApplications anchor not found')
text = text.replace(anchor, insert + anchor, 1)

old = "  const q=score();st.q=q;const classification=classify(q.cf,q.sf),courseScore=Math.max(0,Math.min(10,Math.round(q.cf/10)));\n  set(`"
new = "  const q=score();st.q=q;const classification=classify(q.cf,q.sf),courseScore=Math.max(0,Math.min(10,Math.round(q.cf/10)));\n  const learningReview=st.key==='SAP_Transformation'?`<details><summary>Best answer by round</summary><div class=\"detail-body\">${renderBestAnswers()}</div></details>`:`<details><summary>Opportunity cost</summary><div class=\"detail-body\">${renderOpportunityCost()}</div></details>`;\n  set(`"
if old not in text:
    raise SystemExit('results header target not found')
text = text.replace(old, new, 1)

old = '<details><summary>Opportunity cost</summary><div class="detail-body">${renderOpportunityCost()}</div></details>'
if old not in text:
    raise SystemExit('opportunity section target not found')
text = text.replace(old, '${learningReview}', 1)
app.write_text(text)

sc = Path('scenarios.js')
s = sc.read_text()
s = s.replace('"name": "SAP Transformation",\n      "version": "6.0"', '"name": "SAP Transformation",\n      "version": "6.1"', 1)

path_anchor = '    "path_rules": {\n      "partial_transition": ['
sap_offer_block = '''    "round4_supplier_offers": {
      "price_protection": "Capped renewal uplift and protected migration pricing for the agreed transformation period.",
      "migration_incentive": "Migration credits and implementation funding tied to an agreed transformation timetable.",
      "flexibility_rights": "Improved ramp, reallocation and scope-flexibility rights during the transition.",
      "implementation_support": "Enhanced implementation support and governance resources at no additional charge.",
      "no_additional_concession": "SAP maintains its current commercial position and offers no additional value at this stage."
    },
    "round4_supplier_preferences": {
      "revenue_recovery": ["price_protection", "implementation_support", "flexibility_rights", "migration_incentive", "no_additional_concession"],
      "expansion": ["migration_incentive", "implementation_support", "price_protection", "flexibility_rights", "no_additional_concession"],
      "account_protection": ["implementation_support", "flexibility_rights", "price_protection", "migration_incentive", "no_additional_concession"],
      "dependency_growth": ["flexibility_rights", "migration_incentive", "implementation_support", "price_protection", "no_additional_concession"],
      "maximum_pressure": ["no_additional_concession", "price_protection", "implementation_support", "flexibility_rights", "migration_incentive"]
    },
'''
if path_anchor not in s:
    raise SystemExit('SAP path_rules anchor not found')
s = s.replace(path_anchor, sap_offer_block + path_anchor, 1)

start = s.index('    "concession_modifiers": {')
end = s.index('    "customer_economic_scores": {', start)
pair_block = '''    "concession_pair_modifiers": {
      "revenue_recovery": {
        "price_protection": {"decision_timetable": 5, "scope_commitment": 1, "longer_term": 2, "reference_value": 3, "hold_position": -2}
      },
      "expansion": {
        "migration_incentive": {"decision_timetable": 4, "scope_commitment": 2, "longer_term": -1, "reference_value": 0, "hold_position": -3}
      },
      "account_protection": {
        "implementation_support": {"decision_timetable": 5, "scope_commitment": 0, "longer_term": 1, "reference_value": 4, "hold_position": -2}
      },
      "dependency_growth": {
        "flexibility_rights": {"decision_timetable": 4, "scope_commitment": -5, "longer_term": -4, "reference_value": 2, "hold_position": 0}
      },
      "maximum_pressure": {
        "no_additional_concession": {"decision_timetable": -3, "scope_commitment": -7, "longer_term": -6, "reference_value": -1, "hold_position": 3}
      }
    },
'''
s = s[:start] + pair_block + s[end:]

supplier_anchor = '        "status_quo": {"signal": "The supplier sees no immediate need to improve its position."'
supplier_entries = '''        "price_protection": {"signal": "SAP is willing to trade future pricing certainty for reciprocal customer value.", "objective": "Protect revenue while making commitment more attractive.", "response": "Trade only proportionate customer value and preserve flexibility."},
        "migration_incentive": {"signal": "SAP is willing to fund part of the transition to accelerate migration.", "objective": "Increase new business and transformation momentum.", "response": "Value the incentive against the full commitment and implementation risk."},
        "flexibility_rights": {"signal": "SAP is willing to reduce some commitment rigidity.", "objective": "Secure transformation while lowering customer resistance to lock-in.", "response": "Use the flexibility to avoid overcommitting scope or term."},
        "implementation_support": {"signal": "SAP is protecting the account by reducing execution friction.", "objective": "Preserve long-term relationship value and improve delivery confidence.", "response": "Define the support deliverables and do not overpay for relationship value."},
        "no_additional_concession": {"signal": "SAP believes it can hold its position without offering additional value.", "objective": "Preserve leverage and enforce strategic direction.", "response": "Do not make an expensive reciprocal concession without measurable supplier value."},
'''
if supplier_anchor not in s:
    raise SystemExit('SAP supplier analysis anchor not found')
s = s.replace(supplier_anchor, supplier_entries + supplier_anchor, 1)
sc.write_text(s)
