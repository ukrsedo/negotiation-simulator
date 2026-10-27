/* Targeted extension of the original six-round Oracle game.
   All amounts and release mechanics below are fictional exercise assumptions. */
const oraclePackageOutcomes=['concession','improved_concession'];
const oracleMoney=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n);
let oracleLastNeed=true;
function oracleCommercial(outcome){
  const required=st.oracleNeed!==false,neededPurchase=required?600000:0,separate=200000+neededPurchase;
  if(!oraclePackageOutcomes.includes(outcome))return null;
  const packageCost=outcome==='improved_concession'?650000:700000;
  // The improved offer expressly includes release. An opening package needs the
  // original audit_closure exchange, accepted with a reciprocal concession.
  const closure=outcome==='improved_concession'||(st.oracleSupplierOffer==='audit_closure'&&Boolean(st.concessionExchange)&&st.concessionExchange!=='hold_position');
  const economic=closure?Math.round(30*Math.min(1,separate/packageCost)):0;
  let achieved=[...(st.g.objective_achievement[outcome]?.customer||[])];
  if(!closure||packageCost>separate)achieved=achieved.filter(k=>k!=='minimize_liability');
  const strategic=achieved.reduce((n,k)=>n+(st.g.customer_objective_points[k]||0),0);
  return {required,neededPurchase,separate,packageCost,closure,economic,strategic,achieved,total:strategic+economic};
}
function oracleCommercialBrief(){
  return `<section class="analysis-card oracle-commercial"><h3>Audit settlement and future business</h3><p><strong>Fictional exercise assumptions, GBP over three years.</strong> Standalone audit settlement: £200,000, with release of the specified audit scope. Opening package: £700,000 including future products, with release wording not yet confirmed. An improved package, if offered through the existing negotiation rules, costs £650,000 and includes explicit release.</p><label for="oracle-business-need"><strong>Business requirement</strong></label><select id="oracle-business-need"><option value="yes" ${oracleLastNeed?'selected':''}>Approved requirement: equivalent separate purchase £600,000</option><option value="no" ${!oracleLastNeed?'selected':''}>No requirement for the offered products</option></select><p>Compare the package with settlement plus only the purchase the business needs. Scope, service, delivery and payment timing are equivalent. No implementation, switching, tax or financing differences are assumed. The package is fixed and non-cancellable. For package outcomes, future-subscription, cloud and longer-term exchanges are alternative ways of delivering the quoted package commitment, not additional charges.</p><p>An opening package obtains explicit release only through the existing Audit Closure exchange with a reciprocal concession. Price protection or governance support alone does not close the claim. Supplier profiles, responses, escalation and all six rounds remain in force.</p></section>`;
}
const oracleSelectBase=selectGame;
selectGame=function(key){
  if(key==='Oracle_Audit')st={}; // A new profile must not inherit the previous supplier offer.
  oracleSelectBase(key);
  if(key!=='Oracle_Audit')return;
  st.oracleNeed=oracleLastNeed;
  document.querySelector('.profile-intro').insertAdjacentHTML('beforebegin',oracleCommercialBrief());
  document.getElementById('oracle-business-need').onchange=e=>{st.oracleNeed=e.target.value==='yes';oracleLastNeed=st.oracleNeed};
};
const oracleValidityBase=validity;
validity=function(action){
  // A concession offer now discloses the separate settlement price as well.
  // This adds an unbundled choice only inside the existing concession branch.
  if(st.key==='Oracle_Audit'&&action==='settlement'&&st.history.some(h=>h.action==='concession_offer'))return {ok:true,reason:''};
  return oracleValidityBase(action);
};
function oracleOfferSummary(outcome){
  const c=oracleCommercial(outcome||'concession');
  return `<section class="analysis-card oracle-commercial"><h3>Commercial comparison</h3><p>Separate settlement: <strong>£200,000</strong>${c.required?' + required purchase £600,000':''}. Total: <strong>${oracleMoney(c.separate)}</strong>. Package: <strong>${oracleMoney(c.packageCost)}</strong>, fixed over three years. ${c.required?'The products meet an approved need.':'The products have no established business need.'}</p><p><strong>Package release:</strong> ${c.closure?'Explicit release of the specified audit scope is included.':'Not confirmed. The quoted package price does not establish the full cost of resolving the audit.'}</p></section>`;
}
const oraclePlayBase=playRound;
playRound=function(){
  if(st.key==='Oracle_Audit'&&st.oracleNeed===undefined)st.oracleNeed=oracleLastNeed;
  oraclePlayBase();
  if(st.key==='Oracle_Audit'&&[3,4,6].includes(st.round)&&st.history.some(h=>h.action==='concession_offer')){
    const o=st.round===6?resolveCurrentOutcome():'concession';
    app.insertAdjacentHTML('beforeend',oracleOfferSummary(oraclePackageOutcomes.includes(o)?o:'concession'));
  }
};
const oracleOutcomeScoreBase=outcomeScore;
outcomeScore=function(outcome,party='customer'){
  if(st.key==='Oracle_Audit'&&party==='customer'){
    const c=oracleCommercial(outcome);if(c)return c.total;
    if(outcome==='settlement'&&st.history.some(h=>h.action==='concession_offer'))return oracleOutcomeScoreBase(outcome,party)-(st.g.customer_economic_scores.settlement||0)+30;
  }
  return oracleOutcomeScoreBase(outcome,party);
};
const oracleOutcomeRatingBase=oracleOutcomeRating;
oracleOutcomeRating=function(outcome){
  if(st.key!=='Oracle_Audit'||!st.history.some(h=>h.action==='concession_offer'))return oracleOutcomeRatingBase(outcome);
  const current=resolveCurrentOutcome(),candidates=[outcome,current,'dispute',...availableActionsForReplacement()].filter(Boolean);
  return oracleRatingFromGap(Math.max(...candidates.map(o=>outcomeScore(o)))-outcomeScore(outcome));
};
const oracleScoreBase=score;
score=function(){
  const q=oracleScoreBase();if(st.key!=='Oracle_Audit')return q;
  const c=oracleCommercial(st.finalOutcome);
  if(c){q.ach={...q.ach,customer:c.achieved};q.cs=c.strategic;q.ce=c.economic;}
  else if(st.finalOutcome==='settlement'&&st.history.some(h=>h.action==='concession_offer'))q.ce=30;
  return q;
};
const oracleResultsBase=results;
results=function(){
  oracleResultsBase();if(st.key!=='Oracle_Audit')return;
  if(!st.history.some(h=>h.action==='concession_offer')&&!oraclePackageOutcomes.includes(st.finalOutcome))return;
  const c=oracleCommercial(st.finalOutcome);
  const content=c?`${oracleOfferSummary(st.finalOutcome)}<p>Package outlay is ${oracleMoney(Math.abs(c.packageCost-c.separate))} ${c.packageCost<=c.separate?'lower':'higher'} than separate settlement plus the required purchase. ${c.closure?'Both routes have explicit release for the specified scope.':'The package also leaves audit closure unconfirmed, so its price is not a completed-settlement comparison.'}</p><p>Package economic points: ${c.economic}/30. Formula: 30 × separate-route cost ÷ package cost, capped at 30 and rounded, provided release is explicit. Unconfirmed release earns zero economic points. The Minimize Liability objective is earned only if release is explicit and package cost does not exceed the separate route.</p>`:`<p>Separate settlement costs £200,000${st.oracleNeed!==false?', plus £600,000 for the approved purchase':''}. It includes explicit release and earns 30/30 economic points. A continuing dispute keeps the original negotiation assessment; no final cash cost is asserted.</p>`;
  document.querySelector('.result-sections').insertAdjacentHTML('afterbegin',`<details open><summary>Audit settlement and package economics</summary><div class="detail-body">${content}<p>The original decision-path scoring remains: Round 1 (15), Round 3 (25), concession exchange (20), final decision (15), final outcome (25). Package economics update the outcome comparisons used in that rubric. Supplier priorities and scores retain their original rules.</p></div></details>`);
};

const oracleObjectivesBase=objectivesForOutcome;
objectivesForOutcome=function(outcome,party='customer'){
 if(st.key==='Oracle_Audit'&&party==='customer'){const c=oracleCommercial(outcome);if(c)return c.achieved.map(label)}
 return oracleObjectivesBase(outcome,party);
};
