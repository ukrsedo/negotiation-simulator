from pathlib import Path
import re

p=Path('app.js')
s=p.read_text()

anchor='function oracleDecisionScore(){'
if anchor not in s:
    raise SystemExit('oracleDecisionScore anchor not found')

helper=r'''function sapDecisionScore(){
  const d1=st.decisions.find(d=>d.round===1),d3=st.decisions.find(d=>d.round===3),d4=st.decisions.find(d=>d.round===4),d6=st.decisions.find(d=>d.round===6);
  let total=0;

  // Round 1: negotiate is the strongest opening because it preserves leverage without premature commitment.
  if(d1)total+=d1.action==='negotiate'?15:d1.action==='defer'?9:5;

  // Round 3: reward the selected strategic direction relative to the valid choices actually available.
  if(d3){
    const vals=d3.available.map(a=>outcomeScore(a)).filter(Number.isFinite),best=Math.max(...vals),worst=Math.min(...vals),chosen=outcomeScore(d3.action);
    total+=best===worst?25:Math.round(10+15*((chosen-worst)/(best-worst)));
  }

  // Round 4: score the reciprocal concession against the best/worst trade for SAP's actual offer and profile.
  if(d4){
    const vals=d4.available.map(concessionPairValue).filter(Number.isFinite),best=Math.max(...vals),worst=Math.min(...vals),chosen=concessionPairValue(d4.action);
    total+=best===worst?20:Math.round(5+15*((chosen-worst)/(best-worst)));
  }

  // Round 6: compare the final decision with all valid alternatives on the same facts.
  if(d6){
    const preserved=resolveCurrentOutcome(),candidates=[];
    if(preserved)candidates.push({key:'commit',score:outcomeScore(preserved)});
    if(d6.available.includes('withdraw'))candidates.push({key:'withdraw',score:outcomeScore('continue_delay')});
    if(d6.available.includes('change_direction'))availableActionsForReplacement().forEach(o=>candidates.push({key:`change_direction:${o}`,score:outcomeScore(o)}));
    const best=Math.max(...candidates.map(x=>x.score));
    let chosenKey=d6.action;
    if(d6.action==='change_direction'&&d6.replacement)chosenKey=`change_direction:${d6.replacement}`;
    const chosen=candidates.find(x=>x.key===chosenKey)?.score;
    if(Number.isFinite(chosen)){
      const worst=Math.min(...candidates.map(x=>x.score));
      total+=best===worst?15:Math.round(5+10*((chosen-worst)/(best-worst)));
    }
  }

  // The final outcome still matters, but it does not erase the quality of earlier negotiation decisions.
  const outcome=outcomeScore(st.finalOutcome);
  const outcomeUniverse=['full_migration','partial_transition','continue_delay','competitive_leverage'].filter(x=>st.g.objective_achievement?.[x]);
  const vals=outcomeUniverse.map(x=>outcomeScore(x)),best=Math.max(...vals),worst=Math.min(...vals);
  total+=best===worst?25:Math.round(10+15*((outcome-worst)/(best-worst)));

  return Math.max(0,Math.min(100,total));
}
'''
s=s.replace(anchor,helper+anchor,1)

old="const cf=st.key==='Oracle_Audit'?oracleDecisionScore():Math.max(0,Math.min(100,cs+ce+cm));"
new="const cf=st.key==='Oracle_Audit'?oracleDecisionScore():st.key==='SAP_Transformation'?sapDecisionScore():Math.max(0,Math.min(100,cs+ce+cm));"
if old not in s:
    raise SystemExit('score selector target not found')
s=s.replace(old,new,1)

old2="<p>${st.key==='Oracle_Audit'?'Decision-path assessment across Rounds 1, 3, 4 and 6 plus final outcome.':`Strategic ${q.cs} · Economic ${q.ce} · Concession ${q.cm>=0?'+':''}${q.cm}`}</p><small>Objectives: ${q.ach.customer.map(label).join(', ')||'None'}</small>"
new2="<p>${['Oracle_Audit','SAP_Transformation'].includes(st.key)?'Decision-path assessment across Rounds 1, 3, 4 and 6 plus final outcome.':`Strategic ${q.cs} · Economic ${q.ce} · Concession ${q.cm>=0?'+':''}${q.cm}`}</p><small>Objectives: ${q.ach.customer.map(label).join(', ')||'None'}</small>"
if old2 not in s:
    raise SystemExit('customer score display target not found')
s=s.replace(old2,new2,1)
p.write_text(s)

idx=Path('index.html')
h=idx.read_text()
h=re.sub(r'app\.js\?v=[^"\']+', 'app.js?v=20260905-sap62', h)
idx.write_text(h)
