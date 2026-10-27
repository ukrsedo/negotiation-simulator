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
  return `<section class="analysis-card oracle-commercial"><h3>Your commercial position</h3><p>This fictional case concerns an audit of your organisation's existing software licences. A separate settlement would cost <strong>£200,000</strong> and close the claims for the audited products, entities and period. It would purchase no new software.</p><label for="oracle-business-need"><strong>Choose the customer's business situation</strong></label><select id="oracle-business-need"><option value="yes" ${oracleLastNeed?'selected':''}>Approved need: analytics service for 100 users over three years</option><option value="no" ${!oracleLastNeed?'selected':''}>No business need for the analytics service</option></select><p>Where the need is approved, the customer has a separate quote of <strong>£600,000 for a three-year analytics service subscription for 100 users</strong>. Without an approved need, the customer would make no such purchase.</p><p>The supplier may propose resolving the audit in exchange for buying this subscription. Assess the proposal when it arrives: what you must pay, whether you need the service, and whether the agreement actually closes the audit.</p><details><summary>Comparison assumptions</summary><p>All amounts are fictional GBP totals. Compare the same 100-user service over three years, with equivalent service scope, delivery and payment timing. No implementation, switching, tax or financing differences are modelled. Package prices include the selected subscription or hosting commitments, with no separate audit fee added. The original concession-exchange priorities remain part of the negotiation.</p></details></section>`;
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
  return `<section class="analysis-card oracle-commercial"><h3>Supplier proposal: subscription in exchange for audit settlement</h3><p>Buy the <strong>three-year analytics service subscription for 100 users</strong> for a total commitment of <strong>${oracleMoney(c.packageCost)}</strong>. The supplier proposes to waive the separate £200,000 audit payment in exchange for this purchase. <strong>No additional £200,000 is payable under the package.</strong> The subscription commitment is fixed and non-cancellable.</p><p><strong>Audit closure:</strong> ${c.closure?'The offer expressly releases the claims for the specified audited products, entities and period.':'The offer refers to a “commercial resolution” but does not expressly release those claims. Require explicit release before treating the audit as closed.'}</p><p><strong>Your alternative:</strong> settle the audit for £200,000${c.required?' and buy the same subscription separately for £600,000':' and purchase no subscription'}. Total: <strong>${oracleMoney(c.separate)}</strong>. ${c.required?'The package meets an approved requirement.':'Buying the package would create a commitment for a service the business does not need.'}</p></section>`;
}
const oracleSupplierTurnBase=supplierTurn;
supplierTurn=function(){
  oracleSupplierTurnBase();
  if(st.key!=='Oracle_Audit')return;
  const response=st.supplierDecisions[st.supplierDecisions.length-1]?.action;
  if(st.round===2&&response==='concession_offer')app.insertAdjacentHTML('beforeend',oracleOfferSummary('concession'));
  if(st.round===5&&response==='improved_concession')app.insertAdjacentHTML('beforeend',oracleOfferSummary('improved_concession'));
};
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
