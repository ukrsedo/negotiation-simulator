window.NEGOTIATION_SCENARIOS = {
  "SAP_Transformation": {
    "game": {
      "id": 1,
      "name": "SAP Transformation",
      "version": "6.0",
      "assessment_id": "GAME-01"
    },
    "brief": "SAP is accelerating migration from ECC to cloud, AI and modern platforms. The customer must balance cost, continuity, flexibility, risk and relationship considerations while SAP pursues commercial and strategic objectives.",
    "context": {
      "customer_position": [
        "Operating SAP ECC and related SAP products",
        "Evaluating future platform strategy",
        "Concerned about migration cost and implementation risk",
        "Seeking flexibility and commercial leverage"
      ],
      "supplier_position": [
        "Seeking revenue growth",
        "Seeking platform expansion",
        "Seeking long-term account value",
        "Seeking strategic control of customer direction"
      ],
      "key_question": "Can both parties reach a commercially acceptable transformation path while balancing strategic and operational risks?"
    },
    "customer_objective_points": {
      "cost_containment": 15,
      "business_continuity": 20,
      "strategic_flexibility": 10,
      "supply_risk_management": 15,
      "relationship_management": 10
    },
    "profiles": {
      "revenue_recovery": {
        "display_order": 1,
        "description": "Recover and protect revenue.",
        "hidden_distribution": {
          "profitability": 35,
          "new_business": 15,
          "customer_dependency": 10,
          "strategy_enforcement": 5,
          "relationship_management": 5
        }
      },
      "expansion": {
        "display_order": 2,
        "description": "Expand adoption of platforms and services.",
        "hidden_distribution": {
          "profitability": 10,
          "new_business": 35,
          "customer_dependency": 15,
          "strategy_enforcement": 5,
          "relationship_management": 5
        }
      },
      "account_protection": {
        "display_order": 3,
        "description": "Preserve long-term account value.",
        "hidden_distribution": {
          "profitability": 10,
          "new_business": 10,
          "customer_dependency": 10,
          "strategy_enforcement": 5,
          "relationship_management": 35
        }
      },
      "dependency_growth": {
        "display_order": 4,
        "description": "Increase customer reliance on SAP.",
        "hidden_distribution": {
          "profitability": 10,
          "new_business": 10,
          "customer_dependency": 35,
          "strategy_enforcement": 10,
          "relationship_management": 5
        }
      },
      "maximum_pressure": {
        "display_order": 5,
        "description": "Enforce SAP strategic direction.",
        "hidden_distribution": {
          "profitability": 5,
          "new_business": 5,
          "customer_dependency": 15,
          "strategy_enforcement": 40,
          "relationship_management": 5
        }
      }
    },
    "rounds": {
      "round_1": {
        "actor": "customer",
        "actions": {
          "accept_migration": "Accept SAP migration proposal and commit immediately.",
          "negotiate": "Seek incentives and concessions.",
          "defer": "Delay strategic commitment."
        }
      },
      "round_2": {
        "actor": "supplier",
        "actions": {
          "status_quo": "Maintain current position.",
          "increase_tco": "Increase the cost of remaining on the legacy platform.",
          "commercial_concession": "Offer migration incentives.",
          "eol_activation": "Activate end-of-life pressure."
        }
      },
      "round_3": {
        "actor": "customer",
        "actions": {
          "full_migration": "Commit to full migration.",
          "partial_transition": "Commit to partial migration.",
          "continue_delay": "Continue current approach.",
          "competitive_leverage": "Assess alternatives and strengthen leverage."
        }
      },
      "round_4": {
        "actor": "customer",
        "actions": {
          "decision_timetable": "Offer a firm decision and migration timetable in exchange for better economics and implementation support.",
          "scope_commitment": "Offer a broader SAP cloud or platform scope in exchange for stronger commercial terms.",
          "longer_term": "Offer a longer contract term in exchange for price protection, flexibility and implementation safeguards.",
          "reference_value": "Offer reference-customer or joint case-study value instead of additional financial commitment.",
          "hold_position": "Offer no additional concession and require SAP to improve the proposal first."
        }
      },
      "round_5": {
        "actor": "supplier",
        "actions": {
          "maintain_position": "Maintain current position.",
          "relationship_preservation": "Preserve long-term relationship.",
          "escalate_commercial_pressure": "Increase commercial pressure.",
          "eol_enforcement": "Escalate end-of-life enforcement."
        }
      },
      "round_6": {
        "actor": "customer",
        "actions": {
          "commit": "Confirm Round 3 decision.",
          "withdraw": "Replace Round 3 decision with continue_delay.",
          "change_direction": "Select another valid Round 3 outcome."
        }
      }
    },
    "path_rules": {
      "partial_transition": [
        "commercial_concession"
      ],
      "escalate_commercial_pressure": [
        "increase_tco"
      ],
      "eol_enforcement": [
        "eol_activation"
      ]
    },
    "action_effects": {
      "commercial_concession": [
        "concession_available"
      ],
      "increase_tco": [
        "increased_delay_cost"
      ],
      "eol_activation": [
        "eol_risk_active"
      ],
      "relationship_preservation": [
        "relationship_stabilized"
      ],
      "escalate_commercial_pressure": [
        "increased_delay_cost"
      ],
      "eol_enforcement": [
        "eol_risk_active"
      ]
    },
    "preferences": {
      "revenue_recovery": {
        "round_2": [
          "increase_tco",
          "eol_activation",
          "status_quo",
          "commercial_concession"
        ],
        "round_5": [
          "escalate_commercial_pressure",
          "maintain_position",
          "eol_enforcement",
          "relationship_preservation"
        ]
      },
      "expansion": {
        "round_2": [
          "commercial_concession",
          "status_quo",
          "increase_tco",
          "eol_activation"
        ],
        "round_5": [
          "relationship_preservation",
          "maintain_position",
          "escalate_commercial_pressure",
          "eol_enforcement"
        ]
      },
      "account_protection": {
        "round_2": [
          "commercial_concession",
          "status_quo",
          "increase_tco",
          "eol_activation"
        ],
        "round_5": [
          "relationship_preservation",
          "maintain_position",
          "escalate_commercial_pressure",
          "eol_enforcement"
        ]
      },
      "dependency_growth": {
        "round_2": [
          "commercial_concession",
          "increase_tco",
          "status_quo",
          "eol_activation"
        ],
        "round_5": [
          "maintain_position",
          "relationship_preservation",
          "escalate_commercial_pressure",
          "eol_enforcement"
        ]
      },
      "maximum_pressure": {
        "round_2": [
          "eol_activation",
          "increase_tco",
          "status_quo",
          "commercial_concession"
        ],
        "round_5": [
          "eol_enforcement",
          "escalate_commercial_pressure",
          "maintain_position",
          "relationship_preservation"
        ]
      }
    },
    "customer_economic_scores": {
      "competitive_leverage": 30,
      "continue_delay": 20,
      "partial_transition": 10,
      "full_migration": 0
    },
    "supplier_economic_scores": {
      "continue_delay": 0,
      "competitive_leverage": 10,
      "partial_transition": 20,
      "full_migration": 30
    },
    "objective_achievement": {
      "full_migration": {
        "customer": [
          "business_continuity"
        ],
        "supplier": [
          "profitability",
          "new_business",
          "customer_dependency"
        ]
      },
      "partial_transition": {
        "customer": [
          "cost_containment",
          "business_continuity",
          "relationship_management"
        ],
        "supplier": [
          "profitability",
          "new_business",
          "relationship_management"
        ]
      },
      "continue_delay": {
        "customer": [
          "strategic_flexibility",
          "supply_risk_management"
        ],
        "supplier": [
          "relationship_management"
        ]
      },
      "competitive_leverage": {
        "customer": [
          "cost_containment",
          "strategic_flexibility",
          "supply_risk_management"
        ],
        "supplier": [
          "strategy_enforcement"
        ]
      }
    },
    "course_concepts": [
      "information_asymmetry",
      "negotiation_strategy",
      "vendor_lock_in",
      "supply_risk_management",
      "relationship_management",
      "strategic_decision_making"
    ],
    "analysis_rules": {
      "rating_rubric": {
        "excellent": 0,
        "strong": 10,
        "moderate": 20,
        "weak": 30
      },
      "customer_actions": {
        "accept_migration": {"benefit": "Secures immediate continuity and closes the legacy-platform decision.", "risk": "Surrenders competitive leverage and accepts the supplier-led transformation path.", "advice": "Use only when continuity urgency outweighs the value of further negotiation."},
        "negotiate": {"benefit": "Keeps the negotiation open and tests whether incentives are available.", "risk": "May reveal commitment without creating credible alternatives.", "advice": "Link requests for concessions to a clear decision timetable and credible alternatives."},
        "defer": {"benefit": "Preserves immediate flexibility and avoids premature commitment.", "risk": "Can activate higher legacy cost or end-of-life pressure.", "advice": "Defer only with a funded transition plan and quantified cost of delay."},
        "full_migration": {"benefit": "Protects business continuity through a clear transformation commitment.", "risk": "Creates high dependency and weakens cost leverage.", "advice": "Secure exit, benchmarking and implementation protections before committing."},
        "partial_transition": {"benefit": "Balances continuity, cost control and relationship value.", "risk": "May create a complex hybrid estate and only partial leverage.", "advice": "Define scope boundaries, migration gates and future pricing protections."},
        "continue_delay": {"benefit": "Preserves flexibility and avoids immediate migration economics.", "risk": "Leaves continuity and legacy-cost exposure unresolved.", "advice": "Pair delay with a time-bound alternative-platform or migration assessment."},
        "competitive_leverage": {"benefit": "Strengthens cost and strategic leverage while preserving alternatives.", "risk": "Leverage is weak if switching options are not credible or executable.", "advice": "Validate technical feasibility, switching cost and executive sponsorship before relying on competition."},
        "decision_timetable": {"benefit": "Trades decision certainty rather than immediate price or scope.", "risk": "A timetable can become a de facto commitment if milestones are not conditional.", "advice": "Make timing conditional on agreed economics, implementation support and governance gates."},
        "scope_commitment": {"benefit": "Uses incremental platform scope as tradable value for stronger economics.", "risk": "Increases dependency and may buy products before demand is fully validated.", "advice": "Value the added scope independently and preserve reallocation, ramp and exit flexibility."},
        "longer_term": {"benefit": "Offers contract duration in exchange for measurable price and risk protections.", "risk": "Extends lock-in if protections are weaker than the value of the term conceded.", "advice": "Trade term only for quantified price protection, flexibility and implementation safeguards."},
        "reference_value": {"benefit": "Offers non-cash relationship value while preserving commercial flexibility.", "risk": "The supplier may value it less than a financial or scope commitment.", "advice": "Use reference rights only where they are genuinely valuable to SAP and tightly defined."},
        "hold_position": {"benefit": "Preserves leverage and avoids giving value before SAP improves its offer.", "risk": "May stall the negotiation if the supplier sees no reason to move.", "advice": "Hold only with a clear ask, credible alternative and defined next escalation."},
        "commit": {"benefit": "Preserves the negotiated direction and avoids reopening settled trade-offs.", "risk": "Locks in any weaknesses already present in the Round 3 choice.", "advice": "Commit only after confirming that the preserved outcome remains valid under the latest supplier response."},
        "withdraw": {"benefit": "Avoids preserving a direction that has become unattractive.", "risk": "May sacrifice concessions or momentum already secured.", "advice": "Withdraw only when the preserved outcome is materially worse than the valid fallback."},
        "change_direction": {"benefit": "Allows the customer to respond to new information before final commitment.", "risk": "A late switch can destroy credibility or forfeit negotiated value.", "advice": "Change direction only where the replacement outcome is demonstrably stronger."}
      },
      "supplier_actions": {
        "status_quo": {"signal": "The supplier sees no immediate need to improve its position.", "objective": "Preserve current commercial terms and optionality.", "response": "Test the supplier's assumptions with deadlines, alternatives and quantified consequences."},
        "increase_tco": {"signal": "The supplier is monetising delay and protecting profitability.", "objective": "Increase the economic cost of remaining on the legacy platform.", "response": "Quantify the full delay cost and compare it with migration and alternative-platform options."},
        "commercial_concession": {"signal": "The supplier is willing to trade economics for migration or expansion.", "objective": "Accelerate new business while preserving account value.", "response": "Separate genuine value from commitments that increase dependency."},
        "eol_activation": {"signal": "The supplier is using lifecycle pressure to accelerate the decision.", "objective": "Enforce strategic direction and reduce customer delay.", "response": "Validate the technical and contractual deadline rather than accepting urgency at face value."},
        "maintain_position": {"signal": "The supplier believes its current position remains defensible.", "objective": "Preserve leverage without further concession.", "response": "Identify what new evidence or credible alternative would change the supplier's calculation."},
        "relationship_preservation": {"signal": "The supplier values long-term account stability over immediate pressure.", "objective": "Protect relationship value and future business.", "response": "Use relationship capital to secure measurable protections, not vague goodwill."},
        "escalate_commercial_pressure": {"signal": "The supplier is increasing the price of delay or resistance.", "objective": "Recover revenue and force movement toward commitment.", "response": "Avoid reactive acceptance; compare the escalation with credible alternatives and transition costs."},
        "eol_enforcement": {"signal": "The supplier is prepared to enforce lifecycle consequences.", "objective": "Compel alignment with the supplier's strategic roadmap.", "response": "Escalate governance, validate obligations and activate continuity contingencies."}
      }
    },
    "terminal": {
      "accept_migration": "full_migration"
    }
  },
  "Oracle_Audit": {
    "game": {
      "id": 2,
      "name": "Oracle Audit",
      "version": "6.0",
      "assessment_id": "GAME-02"
    },
    "brief": "Oracle initiates a licensing audit. The customer seeks to minimize liability, maintain business continuity, reduce commercial risk, improve governance, and preserve optionality. Oracle seeks commercial recovery, future business, customer dependency, strategic enforcement, and long-term account value.",
    "context": {
      "customer_position": [
        "Operating Oracle software estate",
        "Facing licensing audit exposure",
        "Concerned about commercial and legal liability",
        "Seeking to improve future governance"
      ],
      "supplier_position": [
        "Seeking audit recovery",
        "Seeking future commercial opportunities",
        "Seeking continued customer dependency",
        "Seeking enforcement credibility"
      ],
      "key_question": "Can the audit be resolved without creating unnecessary commercial, operational or legal damage?"
    },
    "customer_objective_points": {
      "minimize_liability": 20,
      "business_continuity": 15,
      "commercial_risk_management": 15,
      "governance_improvement": 10,
      "relationship_management": 10
    },
    "profiles": {
      "revenue_recovery": {
        "display_order": 1,
        "description": "Recover commercial value from the audit.",
        "hidden_distribution": {
          "profitability": 35,
          "new_business": 15,
          "customer_dependency": 10,
          "strategy_enforcement": 5,
          "relationship_management": 5
        }
      },
      "expansion": {
        "display_order": 2,
        "description": "Convert audit activity into future business.",
        "hidden_distribution": {
          "profitability": 10,
          "new_business": 35,
          "customer_dependency": 15,
          "strategy_enforcement": 5,
          "relationship_management": 5
        }
      },
      "account_protection": {
        "display_order": 3,
        "description": "Preserve long-term customer relationship.",
        "hidden_distribution": {
          "profitability": 10,
          "new_business": 10,
          "customer_dependency": 10,
          "strategy_enforcement": 5,
          "relationship_management": 35
        }
      },
      "dependency_growth": {
        "display_order": 4,
        "description": "Strengthen customer reliance on Oracle.",
        "hidden_distribution": {
          "profitability": 10,
          "new_business": 10,
          "customer_dependency": 35,
          "strategy_enforcement": 10,
          "relationship_management": 5
        }
      },
      "maximum_pressure": {
        "display_order": 5,
        "description": "Reinforce Oracle enforcement position.",
        "hidden_distribution": {
          "profitability": 5,
          "new_business": 5,
          "customer_dependency": 15,
          "strategy_enforcement": 40,
          "relationship_management": 5
        }
      }
    },
    "rounds": {
      "round_1": {
        "actor": "customer",
        "actions": {
          "cooperate": "Cooperate fully with the audit. Prepare for the settlement.",
          "negotiate": "Seek commercial resolution.",
          "dispute": "Challenge Oracle findings."
        }
      },
      "round_2": {
        "actor": "supplier",
        "actions": {
          "settlement_offer": "Activate settlement provisions of the contract.",
          "concession_offer": "Offer commercial concession.",
          "audit_expansion": "Increase audit scope and pressure.",
          "formal_notice": "Escalate contractually."
        }
      },
      "round_3": {
        "actor": "customer",
        "actions": {
          "settlement": "Accept contractual settlement and pay the agreed audit liability.",
          "concession": "Accept a commercial agreement involving future commitments, subscriptions, cloud services, or ULA-style arrangements.",
          "negotiate_concession": "Negotiate improved commercial terms while remaining open to a concession-based resolution.",
          "dispute": "Continue challenging Oracle findings while remaining engaged in the audit process.",
          "rejection_of_notice": "Reject Oracle's formal position and prepare for litigation or arbitration."
        }
      },
      "round_4": {
        "actor": "customer",
        "actions": {
          "future_subscription": "Offer a future subscription commitment in exchange for reduced audit liability and explicit audit closure.",
          "cloud_commitment": "Offer a cloud migration commitment in exchange for improved settlement economics and closure terms.",
          "longer_term": "Offer a longer agreement term in exchange for reduced liability, price protection and clearer future rights.",
          "governance_commitment": "Offer stronger licence governance, audit cooperation and compliance controls without additional product commitment.",
          "hold_position": "Offer no new commitment and require Oracle to improve its commercial or legal position first."
        }
      },
      "round_5": {
        "actor": "supplier",
        "actions": {
          "improved_concession": "Improve the commercial offer to encourage agreement.",
          "maintain_position": "Continue the audit process without additional escalation.",
          "relationship_preservation": "Seek a cooperative commercial resolution.",
          "escalated_pressure": "Increase commercial and legal pressure while continuing the dispute.",
          "litigation_arbitration": "Initiate litigation or arbitration proceedings."
        }
      },
      "round_6": {
        "actor": "customer",
        "actions": {
          "commit": "Confirm current negotiation outcome.",
          "withdraw": "Replace Round 3 decision with dispute.",
          "change_direction": "Select another valid Round 3 outcome."
        }
      }
    },
    "path_rules": {
      "settlement_offer": [
        "cooperate"
      ],
      "settlement": [
        "settlement_offer"
      ],
      "concession_offer": [
        "negotiate"
      ],
      "concession": [
        "concession_offer"
      ],
      "negotiate_concession": [
        "concession_offer"
      ],
      "audit_expansion": [
        "dispute"
      ],
      "rejection_of_notice": [
        "formal_notice"
      ],
      "litigation_arbitration": [
        "rejection_of_notice"
      ],
      "improved_concession": [
        "negotiate_concession"
      ],
      "escalated_pressure": [
        "commercial_pressure_active"
      ],
      "relationship_preservation": [
        "concession_offer"
      ]
    },
    "action_effects": {
      "concession_offer": [
        "relationship_stabilized"
      ],
      "audit_expansion": [
        "commercial_pressure_active"
      ],
      "formal_notice": [
        "formal_notice_active"
      ],
      "improved_concession": [
        "improved_concession_active"
      ],
      "relationship_preservation": [
        "relationship_stabilized"
      ],
      "escalated_pressure": [
        "commercial_pressure_active"
      ]
    },
    "preferences": {
      "revenue_recovery": {
        "round_2": [
          "settlement_offer",
          "formal_notice",
          "concession_offer",
          "audit_expansion"
        ],
        "round_5": [
          "litigation_arbitration",
          "maintain_position",
          "escalated_pressure",
          "relationship_preservation"
        ],
        "round_5_after_negotiate_concession": [
          "maintain_position",
          "improved_concession",
          "escalated_pressure"
        ]
      },
      "expansion": {
        "round_2": [
          "concession_offer",
          "settlement_offer",
          "audit_expansion",
          "formal_notice"
        ],
        "round_5": [
          "relationship_preservation",
          "maintain_position",
          "escalated_pressure",
          "litigation_arbitration"
        ],
        "round_5_after_negotiate_concession": [
          "improved_concession",
          "maintain_position",
          "escalated_pressure"
        ]
      },
      "account_protection": {
        "round_2": [
          "concession_offer",
          "settlement_offer",
          "formal_notice",
          "audit_expansion"
        ],
        "round_5": [
          "relationship_preservation",
          "maintain_position",
          "escalated_pressure",
          "litigation_arbitration"
        ],
        "round_5_after_negotiate_concession": [
          "improved_concession",
          "maintain_position",
          "escalated_pressure"
        ]
      },
      "dependency_growth": {
        "round_2": [
          "concession_offer",
          "settlement_offer",
          "formal_notice",
          "audit_expansion"
        ],
        "round_5": [
          "maintain_position",
          "relationship_preservation",
          "escalated_pressure",
          "litigation_arbitration"
        ],
        "round_5_after_negotiate_concession": [
          "improved_concession",
          "maintain_position",
          "escalated_pressure"
        ]
      },
      "maximum_pressure": {
        "round_2": [
          "formal_notice",
          "audit_expansion",
          "concession_offer",
          "settlement_offer"
        ],
        "round_5": [
          "litigation_arbitration",
          "escalated_pressure",
          "maintain_position",
          "relationship_preservation"
        ],
        "round_5_after_negotiate_concession": [
          "escalated_pressure",
          "maintain_position",
          "improved_concession"
        ]
      }
    },
    "customer_economic_scores": {
      "improved_concession": 30,
      "concession": 30,
      "dispute": 20,
      "settlement": 10,
      "rejection_of_notice": 0
    },
    "supplier_economic_scores": {
      "improved_concession": 25,
      "concession": 30,
      "settlement": 20,
      "dispute": 10,
      "rejection_of_notice": 0
    },
    "objective_achievement": {
      "improved_concession": {
        "customer": [
          "minimize_liability",
          "business_continuity",
          "relationship_management"
        ],
        "supplier": [
          "profitability",
          "new_business"
        ]
      },
      "settlement": {
        "customer": [
          "business_continuity",
          "relationship_management"
        ],
        "supplier": [
          "profitability",
          "customer_dependency"
        ]
      },
      "concession": {
        "customer": [
          "minimize_liability",
          "business_continuity",
          "relationship_management"
        ],
        "supplier": [
          "profitability",
          "new_business",
          "relationship_management"
        ]
      },
      "dispute": {
        "customer": [
          "commercial_risk_management"
        ],
        "supplier": [
          "customer_dependency"
        ]
      },
      "rejection_of_notice": {
        "customer": [
          "commercial_risk_management"
        ],
        "supplier": [
          "strategy_enforcement"
        ]
      }
    },
    "outcome_resolution": {
      "negotiate_concession": {
        "improved_concession": "improved_concession",
        "maintain_position": "concession",
        "escalated_pressure": "dispute"
      }
    },
    "analysis_rules": {
      "rating_rubric": {"excellent": 0, "strong": 10, "moderate": 20, "weak": 30},
      "customer_actions": {
        "cooperate": {"benefit": "Supports fact finding and can reduce avoidable escalation.", "risk": "May weaken leverage if cooperation is not bounded by scope and rights.", "advice": "Cooperate under a documented protocol that preserves legal and commercial positions."},
        "negotiate": {"benefit": "Creates a route to commercial resolution without immediate acceptance of liability.", "risk": "May convert disputed exposure into future dependency.", "advice": "Separate settlement value from unrelated expansion commitments."},
        "dispute": {"benefit": "Challenges unsupported findings and preserves the right to contest liability.", "risk": "Can expand audit scope, cost and legal pressure.", "advice": "Dispute with evidence, governance and a controlled settlement alternative."},
        "settlement": {"benefit": "Closes the audit and protects continuity.", "risk": "Accepts the liability economics and may leave governance weaknesses unresolved.", "advice": "Tie settlement to closure language, release terms and future compliance controls."},
        "concession": {"benefit": "May reduce immediate liability and preserve the relationship.", "risk": "Can exchange audit exposure for subscriptions, cloud commitments or lock-in.", "advice": "Value every future commitment independently from the audit settlement."},
        "negotiate_concession": {"benefit": "Keeps a commercial resolution open while testing for improved terms.", "risk": "Prolongs exposure and may still anchor the customer to future commitments.", "advice": "Set a walk-away position and compare the offer with a pure settlement."},
        "rejection_of_notice": {"benefit": "Preserves the strongest challenge to Oracle's formal position.", "risk": "Creates litigation, arbitration and continuity exposure.", "advice": "Use only with legal support, evidence strength and a funded dispute plan."},
        "future_subscription": {"benefit": "Trades future subscription value for lower immediate audit exposure and closure.", "risk": "Can replace disputed liability with a new long-term dependency.", "advice": "Price the future subscription independently and require explicit audit closure and release language."},
        "cloud_commitment": {"benefit": "Uses a strategic migration commitment to improve settlement economics.", "risk": "Can convert audit pressure into cloud lock-in before the cloud business case is proven.", "advice": "Separate the cloud business case from the audit and preserve migration, pricing and exit protections."},
        "longer_term": {"benefit": "Trades contract duration for reduced liability and future price certainty.", "risk": "Extends dependency if the liability reduction does not justify the term conceded.", "advice": "Compare the value of the term with the settlement reduction and require measurable protections."},
        "governance_commitment": {"benefit": "Offers stronger compliance and governance without buying additional products.", "risk": "May not satisfy a supplier focused primarily on revenue recovery or expansion.", "advice": "Use governance commitments to support closure while preserving the right to challenge unsupported findings."},
        "hold_position": {"benefit": "Avoids exchanging future business for disputed audit exposure.", "risk": "May increase legal or commercial pressure if Oracle sees no path to agreement.", "advice": "Hold only with evidence, executive governance and a credible settlement or dispute alternative."},
        "commit": {"benefit": "Preserves the current negotiated outcome.", "risk": "Locks in any unresolved weakness in that outcome.", "advice": "Confirm closure, economics and future obligations before committing."},
        "withdraw": {"benefit": "Avoids preserving an unattractive commercial direction.", "risk": "May lose concessions and increase dispute cost.", "advice": "Withdraw only where dispute is a stronger valid fallback."},
        "change_direction": {"benefit": "Allows a final response to new supplier behaviour.", "risk": "Late changes can forfeit negotiated value or increase escalation.", "advice": "Change direction only after comparing the replacement with Commit on the same facts."}
      },
      "supplier_actions": {
        "settlement_offer": {"signal": "Oracle is seeking a direct commercial recovery and closure.", "objective": "Convert audit findings into immediate profitability.", "response": "Test liability evidence, closure language and total settlement value."},
        "concession_offer": {"signal": "Oracle is willing to trade audit economics for future business.", "objective": "Create new business and preserve account value.", "response": "Unbundle audit resolution from future products and commitments."},
        "audit_expansion": {"signal": "Oracle is increasing pressure and information asymmetry.", "objective": "Strengthen commercial leverage and potential recovery.", "response": "Control scope, evidence requests, governance and legal review."},
        "formal_notice": {"signal": "Oracle is escalating from commercial dialogue to contractual enforcement.", "objective": "Reinforce enforcement credibility and force movement.", "response": "Preserve rights, validate the notice and prepare a governed response."},
        "improved_concession": {"signal": "Oracle values agreement enough to improve the commercial package.", "objective": "Secure future business while avoiding continued dispute.", "response": "Revalue the entire package and demand explicit audit closure."},
        "maintain_position": {"signal": "Oracle believes the current pressure remains sufficient.", "objective": "Preserve leverage without giving additional value.", "response": "Identify evidence, alternatives or escalation risks that change Oracle's calculation."},
        "relationship_preservation": {"signal": "Oracle is protecting long-term account value.", "objective": "Preserve relationship and future commercial opportunity.", "response": "Convert relationship intent into measurable settlement and governance terms."},
        "escalated_pressure": {"signal": "Oracle is increasing commercial and legal consequences.", "objective": "Force resolution and protect enforcement credibility.", "response": "Use executive governance and compare settlement cost with dispute exposure."},
        "litigation_arbitration": {"signal": "Oracle is prepared to sacrifice relationship value for enforcement.", "objective": "Maximise enforcement credibility and strategic control.", "response": "Move to legal-led governance and protect business continuity."}
      }
    },
    "intermediate_actions": [
      "negotiate_concession"
    ],
    "course_concepts": [
      "information_asymmetry",
      "negotiation_strategy",
      "software_licensing_risk",
      "governance",
      "commercial_leverage",
      "relationship_management",
      "strategic_decision_making"
    ]
  }
};