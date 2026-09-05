from pathlib import Path
import re

p=Path('app.js')
s=p.read_text()

anchor="function score(){"
if anchor not in s:
    raise SystemExit('score anchor not found')

helper=r'''function oracleDecisionScore(){
  const d1=st.decisions.find(d=>d.round===1),d3=st.decisions.find(d=>d.round===3),d4=st.decisions.find(d=>d.round===4),d6=st.decisions.find(d=>d.round===6);
  let total=0;

  // Round 1: commercial resolution without premature acceptance or escalation is the strongest opening.
  if(d1)total+=d1.action==='negotiate'?15:d1.action==='cooperate'?10:7;

  // Round 3: reward the strength of the selected direction relative to the options actually available.
  if(d3){
    const scoreR3=a=>{
      if(a==='negotiate_concession'){
        const prefs=st.g.preferences?.[st.profile]?.round_5_after_negotiate_concession||[];
        const supplier=prefs.find(x=>st.g.outcome_resolution?.negotiate_concession?.[x]);
        const out=st.g.outcome_resolution?.negotiate_concession?.[supplier];
        return out?outcomeScore(out):-999;
      }
      return outcomeScore(a);
    };
    const vals=d3.available.map(scoreR3).filter(Number.isFinite),best=Math.max(...vals),worst=Math.min(...vals),chosen=scoreR3(d3.action);
    total+=best===worst?25:Math.round(10+15*((chosen-worst)/(best-worst)));
  }

  // Round 4: score the reciprocal concession against the best/worst trade available for that actual Oracle offer.
  if(d4){
    const vals=d4.available.map(concessionPairValue).filter(Number.isFinite),best=Math.max(...vals),worst=Math.min(...vals),chosen=concessionPairValue(d4.action);
    total+=best===worst?20:Math.round(5+15*((chosen-worst)/(best-worst)));
  }

  // Round 6: compare the final decision with all valid final alternatives on the same facts.
  if(d6){
    const preserved=resolveCurrentOutcome(),candidates=[];
    if(preserved)candidates.push({key:'commit',score:outcomeScore(preserved)});
    if(d6.available.includes('withdraw'))candidates.push({key:'withdraw',score:outcomeScore('dispute')});
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

  // Final negotiated outcome remains relevant, but it no longer overwhelms the quality of the path taken.
  const outcome=outcomeScore(st.finalOutcome);
  const outcomeUniverse=['improved_concession','concession','settlement','dispute','rejection_of_notice'].filter(x=>st.g.objective_achievement?.[x]);
  const vals=outcomeUniverse.map(x=>outcomeScore(x)),best=Math.max(...vals),worst=Math.min(...vals);
  total+=best===worst?25:Math.round(10+15*((outcome-worst)/(best-worst)));

  return Math.max(0,Math.min(100,total));
}
'''
s=s.replace(anchor,helper+anchor,1)

old="function score(){const o=st.finalOutcome,ach=st.g.objective_achievement[o]||{customer:[],supplier:[]};const cs=(ach.customer||[]).reduce((n,x)=>n+(st.g.customer_objective_points[x]||0),0);const ss=(ach.supplier||[]).reduce((n,x)=>n+(st.g.profiles[st.profile].hidden_distribution[x]||0),0);const ce=st.g.customer_economic_scores[o]??0,se=st.g.supplier_economic_scores[o]??0,cm=concessionModifier();const cf=Math.max(0,Math.min(100,cs+ce+cm));return {ach,cs,ss,ce,se,cm,cf,sf:ss+se}}"
new="function score(){const o=st.finalOutcome,ach=st.g.objective_achievement[o]||{customer:[],supplier:[]};const cs=(ach.customer||[]).reduce((n,x)=>n+(st.g.customer_objective_points[x]||0),0);const ss=(ach.supplier||[]).reduce((n,x)=>n+(st.g.profiles[st.profile].hidden_distribution[x]||0),0);const ce=st.g.customer_economic_scores[o]??0,se=st.g.supplier_economic_scores[o]??0,cm=concessionModifier();const cf=st.key==='Oracle_Audit'?oracleDecisionScore():Math.max(0,Math.min(100,cs+ce+cm));return {ach,cs,ss,ce,se,cm,cf,sf:ss+se}}"
if old not in s:
    raise SystemExit('score function target not found')
s=s.replace(old,new,1)

old2="<p>Strategic ${q.cs} · Economic ${q.ce} · Concession ${q.cm>=0?'+':''}${q.cm}</p><small>Objectives: ${q.ach.customer.map(label).join(', ')||'None'}</small>"
new2="<p>${st.key==='Oracle_Audit'?'Decision-path assessment across Rounds 1, 3, 4 and 6 plus final outcome.':`Strategic ${q.cs} · Economic ${q.ce} · Concession ${q.cm>=0?'+':''}${q.cm}`}</p><small>Objectives: ${q.ach.customer.map(label).join(', ')||'None'}</small>"
if old2 not in s:
    raise SystemExit('customer score display target not found')
s=s.replace(old2,new2,1)
p.write_text(s)

idx=Path('index.html')
h=idx.read_text()
h=re.sub(r'app\.js\?v=[^"\']+', 'app.js?v=20260905-oracle63', h)
idx.write_text(h)
