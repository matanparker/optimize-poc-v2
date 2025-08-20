Product Requirements Document (PRD)

Product Name: XP-Optimise Prototype
Prepared For: Innovid XP Platform
Objective: Create a prototype that simulates a functional, client-facing product for sales demos and user testing. The prototype should align with the Innovid Platform look and feel while providing a credible, interactive experience across multiple pages.

⸻

1. Goals and Objectives
	•	Deliver a high-fidelity prototype aligned with Innovid Platform design standards.
	•	Provide clients with an interactive experience that simulates real functionality.
	•	Enable sales and account teams to showcase the value of XP-Optimise in calls.
	•	Focus on illusion of functionality using mock data, simple configs, and smoke-and-mirrors approaches.

⸻

2. Key Features & Requirements

2.1 Landing Page
	•	Design/Layout:
	•	Consistent with Innovid Platform styling (reference: appendix C screenshots).
	•	Header: Innovid XP logo, “Get Help” button, account/profile icon.
	•	“Get Help” → existing Innovid XP Help URL.
	•	Account/profile → account management page.
	•	Sub-header navigation: My Collection, Dashboard, Research, Recommendations.
	•	Default landing view = Dashboard.

⸻

2.2 My Collection Page
	•	Purpose: Provide portfolio-level view of cross-media advertising investments.
	•	Key Metrics:
	•	Overall Spend.
	•	Efficiency (ROI, ROAS, Cost Per Outcome, Cost Per Reach).
	•	Effectiveness (Attributed Outcomes, Conversion Rate).
	•	Scale (Unique Reach, Impressions).
	•	Functionality:
	•	Timeframe selection (start/end dates). Updates summary + table data.
	•	Summary statistics panel.
	•	Data table with per-line item data:
	•	Campaign/Ad Group ID, Placement, Creative details, Channel.
	•	Performance columns: Impressions, Reach, Avg. Frequency, Conversions, Conversion %, Conversion Rate, Ad Spend, ROAS, Cost per Conversion.
	•	Benchmark comparison: green up/down arrows with Innovid Benchmark classification (config-driven).
	•	Sorting by any metric.
	•	Add New Campaign: “Add New” button → pop-up/side pane → fetch campaigns from XP-Navigate service.
	•	Remove Campaign: “-” icon per row → confirm via pop-up.

⸻

2.3 Dashboard Page
	•	Purpose: Explore portfolio insights through visualizations.
	•	Functionality:
	•	Timeframe selector.
	•	Graphs:
	•	Performance over time (daily, 6-month default).
	•	Graph 1: Effectiveness metric (default conversions).
	•	Graph 2: Efficiency metric (default CPA).
	•	Drop-down to change metrics.
	•	Moving average + outlier detection.
	•	Box & Whisker plots for key metrics (Conversions, CPA, Reach, ROAS).
	•	Scatter Plot: Effectiveness (Conversion %) vs Efficiency (Cost/Conversion).
	•	Clickable points → popup with meta info, add to watchlist.
	•	Zoom enabled.
	•	Benchmarks Table: Bottom 5 items vs Innovid benchmarks.
	•	Watchlist:
	•	Subset of collection tracked here.
	•	Add from scatter plot.
	•	Remove via “-” icon.
	•	Alerts: toggle per item with severity levels (Mild, Strong, Critical). Alerts are predefined, not editable.
	•	Alerts delivered per settings. Watchlist persists across sessions.
	•	Explore: Natural Language interface powered by sample JSON/CSV campaign data.

⸻

2.4 Research Page
	•	Purpose: Simulated AI-driven knowledge base Q&A.
	•	Layout: Split into Question Pane (chat box, canned questions) and Results Pane.
	•	Interaction:
	•	Pre-canned questions (e.g. “What are the top factors driving conversions?”).
	•	Free-text input allowed.
	•	Simulated “typing/loading” animation.
	•	Results returned from a static FAQ database (Wizard of Oz approach).
	•	Supports follow-up questions with pre-configured responses.
	•	Transition to Recommendations: Call-to-action: “Would you like to see recommendations?”

⸻

2.5 Recommendation Page
	•	Purpose: Provide optimization suggestions with measurable benefits.
	•	Key Features:
	•	Summary panel: Total lift from applied recommendations.
	•	Recommendation List:
	•	Top 10 shown by default.
	•	Filter for 15/20/25/all.
	•	Each recommendation = Action + Benefit headline.
	•	Toggle selection with radio button.
	•	Add Custom Recommendation: User selects campaign and writes action (converted to backend grammar).
	•	Benefits Pane: Updates collection metrics to show forecasted changes (cumulative if multiple recommendations selected).
	•	Apply Flow:
	•	Confirmation popup.
	•	Store baseline + applied recommendations in backend for later comparison.
	•	Explanation Pane: Narrative updates dynamically to justify selected package.
	•	Export: Excel file containing performance data, selected recommendations, forecast benefits, and explanations.
	•	Recommendation Generation:
	•	Config file with hand-coded rules (e.g. CPA > Target CPA → pause campaign).
	•	Benefits estimation simulated using predefined distributions (e.g. CPA mean -5%).

⸻

2.6 Settings Page
	•	Account/Profile Management:
	•	Show name + email.
	•	Change Password (disabled, tooltip directs to account manager).
	•	Notification Settings:
	•	Email input for alerts + recommendation updates.
	•	Options: Daily, Weekly, Monthly.

⸻

3. Technical Considerations
	•	Prototype powered by mock data (JSON/CSV).
	•	Benchmarks and recommendations stored in backend config files.
	•	Alerts rules hardcoded, non-editable.
	•	Research page uses static FAQ database (Wizard of Oz simulation).

⸻

4. Non-Goals
	•	No real-time data integration with Innovid XP.
	•	No actual optimization or knowledge base querying in prototype.
	•	No user-authentication or password management beyond UI simulation.

⸻

5. Success Metrics
	•	Prototype credibility with clients (measured via sales feedback).
	•	Usability validation from internal/external demos.
	•	Positive reception from media planners/analysts regarding metrics and insights.