from pathlib import Path
import re

p=Path('app.js')
s=p.read_text()

start=s.index('function oracleDecisionScore(){')
end=s.index('function score(){', start)
new=r'''function oracleRatingPercent(rating){
  return ({Excellent:1,Strong:.8,Moderate:.5,Weak:.2,Poor:0})[rating]??0;
}
function oracleOpeningRating(d){
  if(!d)return'Poor';
  return d.action==='negotiate'?'Excellent':d.action==='cooperate'?'Strong':d.action==='dispute'?'Moderate':'Poor';
}
function oracleRound3ActionScore(a){
  if(a==='negotiate_concession'){
    const prefs=st.g.preferences?.[st.profile]?.round_5_after_negotiate_concession||[];
    const supplier=prefs.find(x=>st.g.outcome_resolution?.negotiate_concession?.[x]);
    const out=st.g.outcome_resolution?.negotiate_concession?.[supplier];
    return out?outcomeScore(out):-999;
  }
  return outcomeScore(a);
}
function oracleRatingFromGap(gap){
  const r=st.g.analysis_rules?.rating_rubric||{excellent:0,strong:10,moderate:20,weak:30};
  if(gap<=r.excellent)return'Excellent';
  if(gap<=r.strong)return'Strong';
  if(gap<=r.moderate)return'Moderate';
  if(gap<=r.weak)return'Weak';
  return'Poor';
}
function oracleRound3Rating(d){
  if(!d||!d.available?.length)return'Poor';
  const scores=d.available.map(oracleRound3ActionScore).filter(Number.isFinite);
  if(!scores.length)return'Poor';
  const best=Math.max(...scores),chosen=oracleRound3ActionScore(d.action);
  return oracleRatingFromGap(best-chosen);
}
function oracleConcessionRating(d){
  if(!d||!d.available?.length)return'Poor';
  const ranked=[...d.available].sort((a,b)=>concessionPairValue(b)-concessionPairValue(a));
  const rank=ranked.indexOf(d.action);
  return ['Excellent','Strong','Moderate','Weak','Poor'][Math.min(Math.max(rank,0),4)]||'Poor';
}
function oracleOutcomeRating(outcome){
  if(!outcome)return'Poor';
  const universe=['improved_concession','concession','settlement','dispute','rejection_of_notice'].filter(x=>st.g.objective_achievement?.[x]);
  if(!universe.length)return'Poor';
  const best=Math.max(...universe.map(x=>outcomeScore(x)));
  return oracleRatingFromGap(best-outcomeScore(outcome));
}
function oracleDecisionScore(){
  const d1=st.decisions.find(d=>d.round===1),d3=st.decisions.find(d=>d.round===3),d4=st.decisions.find(d=>d.round===4),d6=st.decisions.find(d=>d.round===6);
  let total=0;
  const award=(max,rating)=>Math.round(max*oracleRatingPercent(rating));

  if(d1)total+=award(15,oracleOpeningRating(d1));
  if(d3)total+=award(25,oracleRound3Rating(d3));
  if(d4)total+=award(20,oracleConcessionRating(d4));
  if(d6)total+=award(15,ratingForDecision(d6));
  total+=award(25,oracleOutcomeRating(st.finalOutcome));

  return Math.max(0,Math.min(100,total));
}
'''
s=s[:start]+new+s[end:]

old="function ratingForDecision(d){if(d.round===1)return d.action==='accept_migration'?'Moderate':'Strong';if(d.round===4&&st.key==='SAP_Transformation')return sapConcessionRating(d);const selected=decisionOutcome(d);if(!selected)return'Moderate';"
new2="function ratingForDecision(d){if(st.key==='Oracle_Audit'&&d.round===1)return oracleOpeningRating(d);if(st.key==='Oracle_Audit'&&d.round===3)return oracleRound3Rating(d);if(st.key==='Oracle_Audit'&&d.round===4)return oracleConcessionRating(d);if(d.round===1)return d.action==='accept_migration'?'Moderate':'Strong';if(d.round===4&&st.key==='SAP_Transformation')return sapConcessionRating(d);const selected=decisionOutcome(d);if(!selected)return'Moderate';"
if old not in s:
    raise SystemExit('ratingForDecision target not found')
s=s.replace(old,new2,1)
p.write_text(s)

idx=Path('index.html')
h=idx.read_text()
h=re.sub(r'app\.js\?v=[^\"\']+', 'app.js?v=20260905-oracle64', h)
idx.write_text(h)
