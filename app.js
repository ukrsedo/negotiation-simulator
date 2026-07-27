const app=document.getElementById('app');
const S=window.NEGOTIATION_SCENARIOS;
let st={};

document.getElementById('restart').onclick=()=>home();
const label=s=>String(s||'').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase()).replace(/\bTco\b/g,'TCO').replace(/\bEol\b/g,'EOL');
function btn(text,fn,cls='option'){const b=document.createElement('button');b.className=cls;b.textContent=text;b.onclick=fn;return b}
function set(html){app.innerHTML=html}
function home(){st={history:[],effects:[],decisions:[],supplierDecisions:[],submissionAttempted:false};set('<h2>Select a game</h2><p>Choose a scenario to begin.</p>');Object.entries(S).forEach(([k,g])=>app.appendChild(btn(`${g.game.id}. ${g.game.name}`,()=>selectGame(k))))}
function selectGame(k){st={...st,key:k,g:S[k],round:1,history:[],effects:[],decisions:[],supplierDecisions:[],submissionAttempted:false};const g=st.g;set(`<h2>${g.game.name}</h2><p>${g.brief}</p><div class="two"><div><h3>Customer position</h3><ul>${g.context.customer_position.map(x=>`<li>${x}</li>`).join('')}</ul></div><div><h3>Supplier position</h3><ul>${g.context.supplier_position.map(x=>`<li>${x}</li>`).join('')}</ul></div></div><p class="notice"><strong>Key question:</strong> ${g.context.key_question}</p><h3>Customer objective points</h3><p>${Object.entries(g.customer_objective_points).map(([k,v])=>`<span class="tag">${label(k)}: ${v}</span>`).join('')}</p><p>Supplier strategic score is determined by the hidden supplier profile. Both parties can score up to 30 economic points. Exact supplier priorities and economic scoring remain hidden until Results.</p><h3>Select supplier profile</h3>`);Object.entries(g.profiles).sort((a,b)=>a[1].display_order-b[1].display_order).forEach(([k,p])=>app.appendChild(btn(`${p.display_order}. ${label(k)} — ${p.description}`,()=>{st.profile=k;playRound()})))}
function has(req){return req.every(x=>st.history.some(h=>h.action===x)||st.effects.includes(x))}
function validity(action){const req=st.g.path_rules[action]||[];return {ok:has(req),reason:req.length?`Requires: ${req.map(label).join(', ')}`:''}}
function availableActionsForRound(round){const r=st.g.rounds[`round_${round}`];return Object.keys(r.actions).filter(a=>validity(a).ok)}
function playRound(){if(st.round===2||st.round===4){supplierTurn();return} const r=st.g.rounds[`round_${st.round}`];set(`<h2>${st.g.game.name}</h2><h3>Round ${st.round}: Your decision</h3><div id="available"><h3>Available Actions</h3></div><div id="blocked"><h3>Blocked Actions</h3></div>`);const av=document.getElementById('available'),bl=document.getElementById('blocked');Object.entries(r.actions).forEach(([a,d])=>{const v=validity(a); if(v.ok)av.appendChild(btn(`${label(a)} — ${d}`,()=>customerAction(a))); else {const x=document.createElement('div');x.className='card blocked';x.innerHTML=`<strong>${label(a)}</strong>${d}<br><small>${v.reason}</small>`;bl.appendChild(x)}});if(!bl.querySelector('.card'))bl.innerHTML+='<p>None.</p>'}
function recordDecision(action,available,extra={}){st.decisions.push({round:st.round,action,available:[...available],effectsBefore:[...st.effects],historyBefore:st.history.map(x=>({...x})),...extra})}
function customerAction(a){const available=availableActionsForRound(st.round);recordDecision(a,available);if(st.round===5&&a==='change_direction')return chooseReplacement();st.history.push({round:st.round,actor:'Customer',action:a});if(st.g.terminal&&st.g.terminal[a]){st.finalOutcome=st.g.terminal[a];return results()}if(st.round===3)st.round3=a;if(st.round===5){if(a==='commit') return finalizeCurrent();if(a==='withdraw'){st.finalOutcome=st.key==='SAP_Transformation'?'continue_delay':'dispute';return results()}}st.round++;playRound()}
function supplierTurn(){const rn=`round_${st.round}`,r=st.g.rounds[rn];let prefKey=rn;if(st.round===4&&st.round3==='negotiate_concession')prefKey='round_4_after_negotiate_concession';const prefs=st.g.preferences[st.profile][prefKey]||[];const valid=prefs.filter(a=>r.actions[a]&&validity(a).ok);const a=valid[0];if(!a){set('<p class="notice error">The scenario contains no valid supplier action for this state.</p>');return}const effects=st.g.action_effects[a]||[];st.supplierDecisions.push({round:st.round,action:a,preferenceKey:prefKey,rank:prefs.indexOf(a)+1,validActions:[...valid],effects:[...effects]});st.history.push({round:st.round,actor:'Supplier',action:a});effects.forEach(e=>{if(!st.effects.includes(e))st.effects.push(e)});set(`<h2>Round ${st.round}: Supplier action</h2><div class="card"><strong>${label(a)}</strong>${r.actions[a]}</div>`);app.appendChild(btn('Continue',()=>{st.round++;playRound()}))}
function resolveCurrentOutcome(){let o=st.round3;if((st.g.intermediate_actions||[]).includes(o)){const supplier4=st.history.find(h=>h.round===4)?.action;o=st.g.outcome_resolution?.[o]?.[supplier4]}return o||null}
function finalizeCurrent(){st.finalOutcome=resolveCurrentOutcome();results()}
function chooseReplacement(){const r3=st.g.rounds.round_3.actions;const current=resolveCurrentOutcome();const available=[];const blocked=[];set('<h2>Change Direction</h2><h3>Available Outcomes</h3>');Object.entries(r3).forEach(([a,d])=>{if((st.g.intermediate_actions||[]).includes(a))return;if(a===current){blocked.push({a,d,reason:'Current outcome cannot be selected as a change of direction.'});return}const v=validity(a);if(v.ok){available.push(a);app.appendChild(btn(`${label(a)} — ${d}`,()=>{const drec=st.decisions[st.decisions.length-1];drec.replacement=a;drec.replacementAvailable=[...availableActionsForReplacement()];st.history.push({round:5,actor:'Customer',action:`change_direction → ${a}`});st.finalOutcome=a;results()}))}else blocked.push({a,d,reason:v.reason})});if(!available.length)app.insertAdjacentHTML('beforeend','<p class="notice error">No alternative valid outcome is available.</p>');app.insertAdjacentHTML('beforeend','<h3>Blocked Outcomes</h3>');if(!blocked.length)app.insertAdjacentHTML('beforeend','<p>None.</p>');else blocked.forEach(x=>{app.insertAdjacentHTML('beforeend',`<div class="card blocked"><strong>${label(x.a)}</strong>${x.d}<br><small>${x.reason}</small></div>`)})}
function availableActionsForReplacement(){const current=resolveCurrentOutcome();return Object.keys(st.g.rounds.round_3.actions).filter(a=>a!==current&&!(st.g.intermediate_actions||[]).includes(a)&&validity(a).ok)}
function outcomeScore(outcome,party='customer'){const ach=st.g.objective_achievement[outcome]||{customer:[],supplier:[]};if(party==='customer'){const strategic=(ach.customer||[]).reduce((n,x)=>n+(st.g.customer_objective_points[x]||0),0);return strategic+(st.g.customer_economic_scores[outcome]??0)}const strategic=(ach.supplier||[]).reduce((n,x)=>n+(st.g.profiles[st.profile].hidden_distribution[x]||0),0);return strategic+(st.g.supplier_economic_scores[outcome]??0)}
function score(){const o=st.finalOutcome,ach=st.g.objective_achievement[o]||{customer:[],supplier:[]};const cs=(ach.customer||[]).reduce((n,x)=>n+(st.g.customer_objective_points[x]||0),0);const ss=(ach.supplier||[]).reduce((n,x)=>n+(st.g.profiles[st.profile].hidden_distribution[x]||0),0);const ce=st.g.customer_economic_scores[o]??0,se=st.g.supplier_economic_scores[o]??0;return {ach,cs,ss,ce,se,cf:cs+ce,sf:ss+se}}
function missedOpportunityGap(){const r3=st.decisions.find(d=>d.round===3);const r5=st.decisions.find(d=>d.round===5);if(!r3||!r5)return 0;const preserved=resolveCurrentOutcome();const final=st.finalOutcome;if(!preserved||!final)return 0;return Math.max(0,outcomeScore(preserved)-outcomeScore(final))}
function classify(cf,sf){const gap=missedOpportunityGap();if(gap>=15)return'Missed Opportunity';if(cf>=60&&sf>=60)return'Mutual Gain';if(cf<=44&&sf<=44)return'Deadlock';if(cf>=60&&cf>sf)return'Strong Customer Result';if(sf>=60&&sf>cf)return'Strong Supplier Result';if(cf>sf)return'Limited Customer Advantage';if(sf>cf)return'Limited Supplier Advantage';return'Balanced Result'}
function classificationNote(classification,cf,sf){const gap=missedOpportunityGap();if(classification==='Missed Opportunity')return `The final decision reduced the customer result by ${gap} points compared with the outcome that Commit would have preserved.`;if(classification==='Strong Customer Result')return `The customer achieved a high absolute score (${cf}/100) and outperformed the supplier.`;if(classification==='Strong Supplier Result')return `The supplier achieved a high absolute score (${sf}/100) and outperformed the customer.`;if(classification==='Limited Customer Advantage')return `The customer outscored the supplier, but the absolute customer result remained below 60/100.`;if(classification==='Limited Supplier Advantage')return `The supplier outscored the customer, but the absolute supplier result remained below 60/100.`;if(classification==='Mutual Gain')return 'Both parties achieved at least 60/100.';if(classification==='Deadlock')return 'Both parties achieved 44/100 or less.';return 'Both parties finished with the same score.'}
function objectivesForOutcome(o,party='customer'){return (st.g.objective_achievement[o]?.[party]||[]).map(label)}
function effectExplanation(e){const map={concession_available:'Partial transition became available.',increased_delay_cost:'The cost of delay increased.',eol_risk_active:'End-of-life risk became active.',relationship_stabilized:'The relationship was stabilised.',formal_notice_active:'Rejection of notice became available.',commercial_pressure_active:'Escalated pressure became available.',improved_concession_active:'An improved negotiated offer became available.'};return map[e]||label(e)}
function actionAnalysis(action,actor='customer'){return st.g.analysis_rules?.[actor+'_actions']?.[action]||null}
function renderSupplierAnalysis(){return st.supplierDecisions.map(d=>{const alternatives=d.validActions.filter(x=>x!==d.action),a=actionAnalysis(d.action,'supplier');return `<div class="card"><strong>Round ${d.round}: ${label(d.action)}</strong><p><b>Commercial signal:</b> ${a?.signal||'No action-specific signal is defined.'}</p><p><b>Supplier objective:</b> ${a?.objective||'No action-specific objective is defined.'}</p><p><b>Why selected:</b> It was the highest-ranked valid action in the locked ${label(st.profile)} preference list.</p><p><b>Recommended customer response:</b> ${a?.response||'Assess the action against the customer objectives and available alternatives.'}</p><p><b>Other valid supplier actions:</b> ${alternatives.length?alternatives.map(label).join(', '):'None'}</p><p><b>State effect:</b> ${d.effects.length?d.effects.map(effectExplanation).join(' '):'No state effect was defined.'}</p></div>`}).join('')||'<p>No supplier decisions were recorded.</p>'}
function decisionOutcome(d){if(d.round===1&&st.g.terminal?.[d.action])return st.g.terminal[d.action];if(d.round===3&&!(st.g.intermediate_actions||[]).includes(d.action))return d.action;if(d.round===5)return d.action==='commit'?resolveCurrentOutcome():d.action==='withdraw'?(st.key==='SAP_Transformation'?'continue_delay':'dispute'):d.replacement;return null}
function ratingForDecision(d){if(d.round===1)return d.action==='accept_migration'?'Moderate':'Strong';const selected=decisionOutcome(d);if(!selected)return'Moderate';let alternatives=[];if(d.round===3)alternatives=d.available.filter(a=>a!==d.action&&!(st.g.intermediate_actions||[]).includes(a));else if(d.round===5){const preserved=resolveCurrentOutcome();alternatives=[preserved,...(d.replacementAvailable||[])].filter((a,i,arr)=>a&&a!==selected&&arr.indexOf(a)===i)}if(!alternatives.length)return'Strong';const best=Math.max(...alternatives.map(a=>outcomeScore(a)));const gap=best-outcomeScore(selected);const r=st.g.analysis_rules?.rating_rubric||{excellent:0,strong:10,moderate:20,weak:30};if(gap<=r.excellent)return'Excellent';if(gap<=r.strong)return'Strong';if(gap<=r.moderate)return'Moderate';if(gap<=r.weak)return'Weak';return'Poor'}
function renderDecisionReview(){return st.decisions.map(d=>{const shown=d.replacement?`${label(d.action)} → ${label(d.replacement)}`:label(d.action),a=actionAnalysis(d.action,'customer'),out=decisionOutcome(d);let consequence='The negotiation continued.';let options='';if(d.round===1&&st.g.terminal?.[d.action]){consequence=`The negotiation ended immediately with ${label(st.g.terminal[d.action])}.`;options='All later negotiation options were closed.'}else if(d.round===1){options='The student retained access to later negotiation rounds.'}else if(d.round===3){consequence=out?`If preserved, this action would produce ${label(out)} with a customer score of ${outcomeScore(out)}.`:'The action created an intermediate state and preserved further negotiation.';options=`Other valid choices at the time: ${d.available.filter(x=>x!==d.action).map(label).join(', ')||'None'}.`}else if(d.round===5){consequence=`The decision made ${label(out)} the final outcome.`;options=d.action==='commit'?'The current outcome was preserved.':`Commit would have preserved ${label(resolveCurrentOutcome())}.`}return `<div class="card"><strong>Round ${d.round}: ${shown} — ${ratingForDecision(d)}</strong><p><b>Benefit:</b> ${a?.benefit||'The decision changed the available negotiation path.'}</p><p><b>Risk:</b> ${a?.risk||'The decision may reduce later options.'}</p><p><b>Decision consequence:</b> ${consequence}</p><p><b>Options affected:</b> ${options}</p><p><b>Advice:</b> ${a?.advice||'Compare the decision with the strongest valid alternative using the same information available at the time.'}</p></div>`}).join('')}
function opportunityCost(d){let selected,alternatives;if(d.round===3){selected=d.action;if((st.g.intermediate_actions||[]).includes(selected))return null;alternatives=d.available.filter(a=>a!==selected&&!(st.g.intermediate_actions||[]).includes(a))}else if(d.round===5){const preserved=resolveCurrentOutcome();selected=d.action==='commit'?preserved:d.action==='withdraw'?(st.key==='SAP_Transformation'?'continue_delay':'dispute'):d.replacement;alternatives=[preserved,...(d.replacementAvailable||[])].filter((a,i,arr)=>a&&a!==selected&&arr.indexOf(a)===i)}else return null;if(!selected||!alternatives.length)return null;const best=[...alternatives].sort((a,b)=>outcomeScore(b)-outcomeScore(a))[0];const diff=outcomeScore(selected)-outcomeScore(best);return {alternative:label(best),gained:`Selected ${label(selected)} produced ${outcomeScore(selected)} customer points and achieved: ${objectivesForOutcome(selected).join(', ')||'None'}.`,sacrificed:`The strongest comparable valid alternative produced ${outcomeScore(best)} customer points and achieved: ${objectivesForOutcome(best).join(', ')||'None'}.`,net:diff>0?`The selected action outperformed the strongest valid alternative by ${diff} customer points.`:diff===0?'The selected action and strongest valid alternative produced the same customer score.':`The selected action underperformed the strongest valid alternative by ${Math.abs(diff)} customer points.`}}
function renderOpportunityCost(){const rows=st.decisions.map(d=>({d,a:opportunityCost(d)})).filter(x=>x.a);if(!rows.length)return'<p>No comparable final-outcome alternatives were available for the recorded decisions.</p>';return rows.map(({d,a})=>{const shown=d.replacement?`${label(d.action)} → ${label(d.replacement)}`:label(d.action);return `<div class="card"><strong>Round ${d.round}: ${shown}</strong><p><b>Alternative Action:</b> ${a.alternative}</p><p><b>What Was Gained:</b> ${a.gained}</p><p><b>What Was Sacrificed:</b> ${a.sacrificed}</p><p><b>Net Assessment:</b> ${a.net}</p></div>`}).join('')}
function renderConceptApplications(){const actions=st.history.map(x=>x.action);const outcome=st.finalOutcome;const cards=[];const add=(title,text)=>cards.push(`<div class="card"><strong>${title}</strong><p>${text}</p></div>`);add('Information Asymmetry',`The supplier profile remained hidden until Results. The customer therefore had to act without knowing that the supplier was ${label(st.profile)}.`);if(st.key==='SAP_Transformation'){if(['full_migration','partial_transition'].includes(outcome))add('Vendor Lock-In',`${label(outcome)} changed the customer's future dependency on SAP and reduced the ease of switching direction.`);if(['continue_delay','competitive_leverage'].includes(outcome))add('Supply Risk Management',`${label(outcome)} preserved flexibility but left continuity, legacy-platform or switching risks to be managed.`);if(actions.some(a=>['commercial_concession','relationship_preservation'].includes(a)))add('Relationship Management','Supplier concessions or relationship-preservation actions required the customer to distinguish measurable value from general relationship intent.');if(actions.includes('competitive_leverage'))add('Negotiation Leverage','Competitive alternatives strengthened the customer position only to the extent that those alternatives were credible and executable.');}
else {if(actions.some(a=>['audit_expansion','formal_notice','litigation_arbitration'].includes(a))||['dispute','rejection_of_notice'].includes(outcome))add('Software Licensing Risk',`${label(outcome)} required the customer to manage evidence, contractual exposure and potential enforcement consequences.`);if(actions.some(a=>['settlement_offer','concession_offer','improved_concession'].includes(a))||['settlement','concession','improved_concession'].includes(outcome))add('Commercial Leverage','The audit resolution combined liability, settlement economics and potential future business commitments.');if(actions.some(a=>['formal_notice','litigation_arbitration','dispute','rejection_of_notice'].includes(a)))add('Governance','The chosen path required documented evidence, clear approvals and coordinated legal-commercial governance.');}
return cards.join('')||'<p>No course-concept application was deterministically supported by the recorded path.</p>'}
function results(){const q=score();st.q=q;const classification=classify(q.cf,q.sf);set(`<h2>Negotiation Results</h2><p><strong>Final Outcome:</strong> ${label(st.finalOutcome)}</p><p><strong>Game Result:</strong> ${classification}</p><p class="notice"><strong>Interpretation:</strong> ${classificationNote(classification,q.cf,q.sf)}</p><div class="two"><div class="card"><h3>Customer</h3><p>Objectives: ${q.ach.customer.map(label).join(', ')||'None'}</p><p>Strategic: ${q.cs}</p><p>Economic: ${q.ce}</p><p class="score">${q.cf}/100</p></div><div class="card"><h3>Supplier</h3><p>Objectives: ${q.ach.supplier.map(label).join(', ')||'None'}</p><p>Strategic: ${q.ss}</p><p>Economic: ${q.se}</p><p class="score">${q.sf}/100</p></div></div><h3>Profile Reveal</h3><div class="card"><strong>${label(st.profile)}</strong>${st.g.profiles[st.profile].description}<p>${Object.entries(st.g.profiles[st.profile].hidden_distribution).map(([k,v])=>`<span class="tag">${label(k)}: ${v}</span>`).join('')}</p></div><h3>Behaviour Analysis</h3>${renderSupplierAnalysis()}<h3>Decision Review</h3>${renderDecisionReview()}<h3>Opportunity Cost</h3>${renderOpportunityCost()}<h3>Course Concepts Evidenced</h3>${renderConceptApplications()}<h3>Negotiation History</h3><table class="history"><tr><th>Round</th><th>Actor</th><th>Action</th></tr>${st.history.map(h=>`<tr><td>${h.round}</td><td>${h.actor}</td><td>${label(h.action)}</td></tr>`).join('')}</table><h3>Record score</h3><p>Would you like to record your score for this course?</p><div id="record"></div>`);const rec=document.getElementById('record');rec.appendChild(btn('YES',showSubmit));rec.appendChild(btn('NO',replay,'secondary'))}
function showSubmit(){const courseScore=Math.round(st.q.cf/10);set(`<h2>Record Score</h2><p>Assessment: <strong>${st.g.game.assessment_id}</strong></p><p>Negotiation score: <strong>${st.q.cf}/100</strong> | Course score to record: <strong>${courseScore}/10</strong></p><label>Student ID <input id="sid" placeholder="YYMMDD-##"></label><div id="msg"></div>`);app.appendChild(btn('Submit score',submitScore))}
async function submitScore(){const sid=document.getElementById('sid').value.trim(),msg=document.getElementById('msg');if(!/^\d{6}-\d{2}$/.test(sid)){msg.innerHTML='<p class="notice error">Student ID format is invalid.</p>';return}if(st.submissionAttempted){msg.innerHTML='<p class="notice error">This result has already been submitted, or the submission was already attempted.</p>';return}st.submissionAttempted=true;const url=window.PORTAL_CONFIG?.submitAssessmentUrl;if(!url){msg.innerHTML='<p class="notice error">Power Automate submission URL is not configured in config.js.</p>';return}try{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({StudentID:sid,AssessmentID:st.g.game.assessment_id,Score:Math.round(st.q.cf/10)})});let body;try{body=await r.json()}catch{body=await r.text()}msg.innerHTML=`<p class="notice ${r.ok?'':'error'}">${r.ok?'Score successfully recorded.':(body?.message||body||`Submission failed (${r.status}).`)}</p>`}catch(e){msg.innerHTML=`<p class="notice error">${e.message}</p>`}}
function replay(){set('<h2>Replay Options</h2>');app.appendChild(btn('1. Replay same game with another profile',()=>selectGame(st.key)));app.appendChild(btn('2. Replay same profile with different decisions',()=>{const p=st.profile,k=st.key;st={history:[],effects:[],decisions:[],supplierDecisions:[],submissionAttempted:false,key:k,g:S[k],round:1,profile:p};playRound()}));app.appendChild(btn('3. Return to game selection',home));}
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
  const records=findResultsArray(data);

  if(!records.length){
    const message=data?.message||'No recorded assessment results were returned for this Student ID.';
    container.innerHTML=`<p class="notice">${escapeHtml(String(message))}</p>`;
    return;
  }

  const rows=records.map(normalizeResultRecord);
  const total=rows.reduce((sum,row)=>sum+(Number.isFinite(row.score)?row.score:0),0);

  container.innerHTML=`
    <div class="results-summary"><strong>Recorded assessments:</strong> ${rows.length}
    &nbsp; | &nbsp; <strong>Total recorded score:</strong> ${total}</div>
    <table class="results-table">
      <thead><tr><th>Assessment</th><th>Score</th><th>Date</th></tr></thead>
      <tbody>
        ${rows.map(row=>`<tr>
          <td>${escapeHtml(row.assessmentId||'—')}</td>
          <td>${row.scoreDisplay}</td>
          <td>${escapeHtml(row.date||'—')}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
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

function normalizeResultRecord(record){
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
  
 const rawScore=
    record.Score??record.score??record.Points??record.points??record.Result??record.result;

  const numericScore=Number(rawScore);
  const maximum=
    record.MaximumScore??record.maximumScore??record.MaxScore??record.maxScore;

  const scoreDisplay=Number.isFinite(numericScore)
    ? `${numericScore}${maximum!==undefined&&maximum!==null?`/${maximum}`:''}`
    : escapeHtml(String(rawScore??'—'));

  const date=
    record.SubmittedAt??record.submittedAt??record.Created??record.created??
    record.Date??record.date??'';

  return{
    assessmentId:String(assessmentId),
    score:Number.isFinite(numericScore)?numericScore:0,
    scoreDisplay,
    date:String(date)
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
