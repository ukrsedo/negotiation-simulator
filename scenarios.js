window.NEGOTIATION_SCENARIOS = {
  "SAP_Transformation": {
    "game": {
      "id": 1,
      "name": "SAP Transformation",
      "version": "5.0",
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
        "actor": "supplier",
        "actions": {
          "maintain_position": "Maintain current position.",
          "relationship_preservation": "Preserve long-term relationship.",
          "escalate_commercial_pressure": "Increase commercial pressure.",
          "eol_enforcement": "Escalate end-of-life enforcement."
        }
      },
      "round_5": {
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
        "round_4": [
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
        "round_4": [
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
        "round_4": [
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
        "round_4": [
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
        "round_4": [
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
      "signalling",
      "negotiation_strategy",
      "vendor_lock_in",
      "supply_risk_management",
      "relationship_management",
      "strategic_decision_making"
    ],
    "terminal": {
      "accept_migration": "full_migration"
    }
  },
  "Oracle_Audit": {
    "game": {
      "id": 2,
      "name": "Oracle Audit",
      "version": "5.0",
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
        "actor": "supplier",
        "actions": {
          "improved_concession": "Improve the commercial offer to encourage agreement.",
          "maintain_position": "Continue the audit process without additional escalation.",
          "relationship_preservation": "Seek a cooperative commercial resolution.",
          "escalated_pressure": "Increase commercial and legal pressure while continuing the dispute.",
          "litigation_arbitration": "Initiate litigation or arbitration proceedings."
        }
      },
      "round_5": {
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
        "round_4": [
          "litigation_arbitration",
          "maintain_position",
          "escalated_pressure",
          "relationship_preservation"
        ],
        "round_4_after_negotiate_concession": [
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
        "round_4": [
          "relationship_preservation",
          "maintain_position",
          "escalated_pressure",
          "litigation_arbitration"
        ],
        "round_4_after_negotiate_concession": [
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
        "round_4": [
          "relationship_preservation",
          "maintain_position",
          "escalated_pressure",
          "litigation_arbitration"
        ],
        "round_4_after_negotiate_concession": [
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
        "round_4": [
          "maintain_position",
          "relationship_preservation",
          "escalated_pressure",
          "litigation_arbitration"
        ],
        "round_4_after_negotiate_concession": [
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
        "round_4": [
          "litigation_arbitration",
          "escalated_pressure",
          "maintain_position",
          "relationship_preservation"
        ],
        "round_4_after_negotiate_concession": [
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
    "intermediate_actions": [
      "negotiate_concession"
    ],
    "course_concepts": [
      "information_asymmetry",
      "signalling",
      "negotiation_strategy",
      "software_licensing_risk",
      "governance",
      "commercial_leverage",
      "relationship_management",
      "strategic_decision_making"
    ]
  }
};