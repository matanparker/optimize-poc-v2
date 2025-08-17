Product Requirements Document: XP-Optimise Prototype

1. Introduction

This document outlines the requirements for a prototype version of XP-Optimise, a new AI-driven recommendation and optimization capability for Innovid XP2. The prototype is a low-fidelity, standalone web application designed to validate the value and desirability of the solution with 3-5 pilot customers using static, manually created data3.

2. Step Details



Step Title: Prototype XP-Optimize to Validate Customer Value 4



Step Owner: Matan Parker and Kristen Hsu 5



Step Timing: Not specified in the document 6



Step Type: Prototype / Experiment 7



Step Description: Create an initial prototype to demonstrate the potential of AI and agentic workflows for Innovid XP8. The prototype will be a 'barebones' UI/UX mockup that uses static data to mimic production behavior and is not integrated into the Innovid XP frontend9. The codebase is not designed for scalability or general availability10.

3. Problem Statement

Media planners, media buyers, and performance analysts are under pressure to improve campaign performance but struggle to quickly identify optimization opportunities due to the volume and complexity of data11. This leads to them spending too much time on analysis and reporting, and not enough time on high-value, strategic decisions12.

4. Our Solution

The goal is to extend Innovid XP with new AI-driven capabilities to help clients achieve a measurable improvement in campaign performance, such as a 10% lift in ROAS or a 15% reduction in Cost Per Conversion13. The long-term vision is a fully autonomous system, but the prototype will adopt a "human-in-the-loop" model where users can accept or dismiss recommendations14.

5. Target Customers (Personas)

The initial prototype will target users within buy-side advertising agencies and brand marketing directorates that are highly sensitive to campaign performance metrics15. The specific roles being targeted are:



The Planners: Director and VP-level roles who oversee media investment strategy16.



The Buyers: Hands-on users who manage media plans and optimize managed investments17.



The Measurement Experts: Technical users who own data, validate measurement partnerships, and provide analytics insights18.

6. Prototype Scope & Constraints



What we will build: A standalone web application with a dashboard, a "Research" chat interface, and a "Recommendations" section19.



Integration: The prototype will not be integrated into Innovid XP20.



Data: It will use manually created static data to simulate production behavior21.

7. Functional Requirements

7.1 Entry

A standalone web application accessible via a URL (e.g., https://www.google.com/url?sa=E&source=gmail&q=ai-innovidxp.com)22.

Requires a user ID and password for login, which are manually administered from a simple database23.

Users are directed to the XP-Optimise prototype interface after successful login24.

7.2 Landing Page (Dashboard)

Will display executive-level metrics and campaign performance25.

Filters for campaign selection and performance window (Last 7, 14, or 30 days)26.

Pane 1 (Core Executive Level Metrics):

Table of aggregated performance metrics for selected campaigns (Impressions, Reach, Frequency, Conversions, etc.)27.

Metrics will be classified against a hypothetical Innovid Benchmark28.

A scatter plot visualizing campaign effectiveness vs. efficiency (Cost Per Conversion vs. Conversions %)29.

A pivot-table style view of channel performance30.

Pane 2 (Top 3 Recommendations):

Vertically listed recommendations with an Action, Benefit, and Explanation31.

Buttons to View, Apply (simulated action), or Dismiss recommendations32.

Only two action types will be included in the prototype: Increase/Decrease Budget and Increase/Decrease Bids33.

7.3 Research Page

A "Wizard of Oz" chat interface that simulates an AI34.

Users can enter a free-text query or select pre-canned questions (e.g., "What are the top factors driving the highest conversion rates?")35.

A loading/typing animation will simulate processing36.

Answers are concise, data-rich, and generated from a simple backend database of pre-written FAQs37.

7.4 Recommendation Page

Displays a list of the top 10 recommendations38.

Users can select one or more recommendations via radio buttons39.

A "Benefits Pane" shows predicted changes to executive metrics based on selected recommendations40.

An "Explanation Pane" updates with a justification for the selected package of recommendations41.

A simulated "Apply" button triggers a confirmation pop-up42.

Users can export "Presentation Data" as an Excel file43.

7.5 Settings Page



Account and Profile Management: Displays user name and email44. Includes a non-functional "Change Password" button45.



Campaign Preferences: Lists campaigns the user has access to46. Users can select a campaign optimization objective from a fixed list47. Users can also set alerts for specific metrics with a numeric threshold48.



Notification Settings: Users can enter an email address to receive updates49. They can also choose the cadence for recommendations (daily, weekly, monthly)50.

8. Success Criteria



User Engagement & Adoption: Successfully onboard 3-5 pilot customers, with at least 80% actively interacting with the prototype51.



User Journey Insights: Identify common user paths and frequently used features52.



User Feedback Quality: Collect feedback on usefulness, recommendation relevance, and usability pain points through interviews or guided sessions53.



Technical Considerations: (Not a success criteria in the document, but a section in the document is about this) 54

The prototype will not attempt to autonomously drive decisions55.

Recommendations will be generated from a simple, hand-coded rules engine stored in a config file56.

Benefit estimations will be a "smoke and mirrors estimate" by randomly picking a value from a fixed benefits distribution57.