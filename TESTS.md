# Automated Tests

**Test Runner:** Jest

`engine.test.ts` covers the pure functional logic of the Audit Engine.
1. `calculates_redundancy_correctly`: Verifies that having both Cursor and Copilot flags the Copilot spend as waste.
2. `flags_zombie_team_seats`: Ensures Claude Team plans with < 5 users recommend downgrading to Pro.
3. `handles_empty_stack_gracefully`: Verifies the engine returns $0 savings and no errors when an empty array is passed.
4. `triggers_credex_pivot_on_high_spend`: Confirms that a total monthly spend > $200 outputs the recommendation to utilize secondary-market credits.
5. `retains_optimal_stack_status`: Ensures a properly sized, non-redundant stack returns $0 in savings and confirms optimization.