from pathlib import Path
import re

app=Path('app.js')
s=app.read_text()

old=r'''function oracleConcessionRound(){
  const r=st.g.rounds.round_4;
  if(!st.oracleSupplierOffer){
    const prefs=st.g.round4_supplier_preferences?.[st.profile]||[],offer=prefs[0]||Object.keys(st.g.round4_supplier_offers||{})[0];
    if(!offer){set('<p class="notice error">No Oracle concession offer is configured.</p>');return}
    st.oracleSupplierOffer=offer;
    st.supplierDecisions.push({round:4,action:offer,preferenceKey:'round4_supplier_offer',rank:1,validActions:[...prefs],effects:[]});
    st.history.push({round:4,actor:'Supplier',action:offer});
  }
  const offer=st.oracleSupplierOffer,offerText=st.g.round4_supplier_offers?.[offer]||label(offer);
  set(`<div class="round-head"><div><p class="section-kicker">${st.g.game.name}</p><h2>Round 4 of 6 · Concession exchange</h2></div></div>${roundProgress(4)}
    <div class="supplier-response"><span class="response-label">Oracle is prepared to offer</span><h3>${label(offer)}</h3><p>${offerText}</p></div>
    <section class="action-section"><h3>What are you prepared to trade in return?</h3><p>Choose the reciprocal customer concession. The value of the exchange depends on both sides of the trade.</p><div id="available" class="action-grid"></div></section>`);
  const av=document.getElementById('available'),available=Object.keys(r.actions).filter(a=>validity(a).ok);
  available.forEach(a=>{const b=document.createElement('button');b.className='action-card';b.innerHTML=`<strong>${label(a)}</strong><span>${r.actions[a]}</span><em>Select →</em>`;b.onclick=()=>customerAction(a);av.appendChild(b)});
}'''
new=r'''function oracleConcessionRound(){
  const r=st.g.rounds.round_4,path=st.round3;
  if(!st.oracleSupplierOffer){
    const prefs=st.g.round4_supplier_preferences_by_path?.[path]?.[st.profile]||st.g.round4_supplier_preferences?.[st.profile]||[],offer=prefs[0]||Object.keys(st.g.round4_supplier_offers||{})[0];
    if(!offer){set('<p class="notice error">No Oracle concession offer is configured for this negotiation path.</p>');return}
    st.oracleSupplierOffer=offer;
    st.supplierDecisions.push({round:4,action:offer,preferenceKey:`round4_${path}`,rank:1,validActions:[...prefs],effects:[]});
    st.history.push({round:4,actor:'Supplier',action:offer});
  }
  const offer=st.oracleSupplierOffer,offerText=st.g.round4_supplier_offers?.[offer]||label(offer),noMove=offer==='no_additional_concession';
  set(`<div class="round-head"><div><p class="section-kicker">${st.g.game.name}</p><h2>Round 4 of 6 · Concession exchange</h2></div></div>${roundProgress(4)}
    <div class="supplier-response"><span class="response-label">Oracle is prepared to offer</span><h3>${label(offer)}</h3><p>${offerText}</p></div>
    <section class="action-section"><h3>${noMove?'Your response':'What are you prepared to trade in return?'}</h3><p>${noMove?'Oracle has offered no additional value. Preserve leverage rather than giving away future commercial value unilaterally.':'Choose the reciprocal customer concession. The value of the exchange depends on both sides of the trade.'}</p><div id="available" class="action-grid"></div></section>`);
  const av=document.getElementById('available');
  const available=(noMove?['hold_position']:Object.keys(r.actions)).filter(a=>r.actions[a]&&validity(a).ok);
  available.forEach(a=>{const b=document.createElement('button');b.className='action-card';b.innerHTML=`<strong>${label(a)}</strong><span>${r.actions[a]}</span><em>Select →</em>`;b.onclick=()=>customerAction(a);av.appendChild(b)});
}'''
if old not in s:
    raise SystemExit('oracleConcessionRound target not found')
s=s.replace(old,new,1)

old2="return Number(st.g.concession_pair_modifiers?.[st.profile]?.[offer]?.[action]??0);"
new2="return Number(st.g.concession_pair_modifiers?.[st.profile]?.[offer]?.[action]??st.g.concession_pair_defaults?.[offer]?.[action]??0);"
if old2 not in s:
    raise SystemExit('concessionPairValue target not found')
s=s.replace(old2,new2,1)
app.write_text(s)

sc=Path('scenarios.js')
t=sc.read_text()
marker='  "Oracle_Audit": {'
if marker not in t:
    raise SystemExit('Oracle marker not found')
before,oracle=t.split(marker,1)

oracle=oracle.replace('"name": "Oracle Audit",\n      "version": "6.1"','"name": "Oracle Audit",\n      "version": "6.2"',1)

start=oracle.index('    "round4_supplier_preferences": {')
end=oracle.index('    "path_rules": {',start)
block='''    "round4_supplier_preferences_by_path": {
      "settlement": {
        "revenue_recovery": ["audit_closure", "liability_reduction", "price_protection", "governance_support", "no_additional_concession"],
        "expansion": ["price_protection", "audit_closure", "liability_reduction", "governance_support", "no_additional_concession"],
        "account_protection": ["audit_closure", "governance_support", "liability_reduction", "price_protection", "no_additional_concession"],
        "dependency_growth": ["price_protection", "audit_closure", "liability_reduction", "governance_support", "no_additional_concession"],
        "maximum_pressure": ["audit_closure", "no_additional_concession", "liability_reduction", "price_protection", "governance_support"]
      },
      "concession": {
        "revenue_recovery": ["audit_closure", "liability_reduction", "price_protection", "governance_support", "no_additional_concession"],
        "expansion": ["price_protection", "audit_closure", "liability_reduction", "governance_support", "no_additional_concession"],
        "account_protection": ["governance_support", "audit_closure", "liability_reduction", "price_protection", "no_additional_concession"],
        "dependency_growth": ["price_protection", "liability_reduction", "audit_closure", "governance_support", "no_additional_concession"],
        "maximum_pressure": ["no_additional_concession", "audit_closure", "liability_reduction", "price_protection", "governance_support"]
      },
      "negotiate_concession": {
        "revenue_recovery": ["liability_reduction", "audit_closure", "price_protection", "governance_support", "no_additional_concession"],
        "expansion": ["price_protection", "liability_reduction", "audit_closure", "governance_support", "no_additional_concession"],
        "account_protection": ["governance_support", "audit_closure", "liability_reduction", "price_protection", "no_additional_concession"],
        "dependency_growth": ["price_protection", "liability_reduction", "audit_closure", "governance_support", "no_additional_concession"],
        "maximum_pressure": ["no_additional_concession", "liability_reduction", "audit_closure", "price_protection", "governance_support"]
      },
      "dispute": {
        "revenue_recovery": ["liability_reduction", "audit_closure", "governance_support", "no_additional_concession", "price_protection"],
        "expansion": ["governance_support", "liability_reduction", "audit_closure", "no_additional_concession", "price_protection"],
        "account_protection": ["governance_support", "audit_closure", "liability_reduction", "no_additional_concession", "price_protection"],
        "dependency_growth": ["liability_reduction", "governance_support", "audit_closure", "no_additional_concession", "price_protection"],
        "maximum_pressure": ["no_additional_concession", "liability_reduction", "audit_closure", "governance_support", "price_protection"]
      },
      "rejection_of_notice": {
        "revenue_recovery": ["audit_closure", "liability_reduction", "no_additional_concession", "governance_support", "price_protection"],
        "expansion": ["governance_support", "audit_closure", "no_additional_concession", "liability_reduction", "price_protection"],
        "account_protection": ["audit_closure", "governance_support", "liability_reduction", "no_additional_concession", "price_protection"],
        "dependency_growth": ["liability_reduction", "audit_closure", "no_additional_concession", "governance_support", "price_protection"],
        "maximum_pressure": ["no_additional_concession", "audit_closure", "liability_reduction", "governance_support", "price_protection"]
      }
    },
'''
oracle=oracle[:start]+block+oracle[end:]

anchor='    "concession_pair_modifiers": {'
idx=oracle.index(anchor)
defaults='''    "concession_pair_defaults": {
      "liability_reduction": {"future_subscription": 2, "cloud_commitment": 0, "longer_term": 1, "governance_commitment": 4, "hold_position": -2},
      "audit_closure": {"future_subscription": 2, "cloud_commitment": 0, "longer_term": 1, "governance_commitment": 5, "hold_position": -2},
      "price_protection": {"future_subscription": 1, "cloud_commitment": -2, "longer_term": 2, "governance_commitment": 1, "hold_position": -3},
      "governance_support": {"future_subscription": 0, "cloud_commitment": -2, "longer_term": 0, "governance_commitment": 5, "hold_position": -1},
      "no_additional_concession": {"future_subscription": -6, "cloud_commitment": -7, "longer_term": -5, "governance_commitment": -2, "hold_position": 3}
    },
'''
oracle=oracle[:idx]+defaults+oracle[idx:]

sc.write_text(before+marker+oracle)

html=Path('index.html')
h=html.read_text()
h=re.sub(r'scenarios\.js\?v=[^"\']+', 'scenarios.js?v=20260905-oracle62', h)
h=re.sub(r'app\.js\?v=[^"\']+', 'app.js?v=20260905-oracle62', h)
html.write_text(h)
