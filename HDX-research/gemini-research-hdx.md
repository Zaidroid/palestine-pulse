Architectural Specification for Automated HDX Data Tracker in the occupied Palestinian territory (Post-October 7, 2023)
I. Executive Summary: The GitOps Data Synchronization Architecture
The mandate requires the development of a secure, automated, and scalable system for tracking critical humanitarian indicators—specifically casualty figures, displacement numbers, and humanitarian needs—in the occupied Palestinian territory (oPt), following the hostilities that escalated post-October 7, 2023. The proposed system employs a robust GitOps Data Synchronization Model, which utilizes the GitHub repository as the authoritative Single Source of Truth (SSOT). This architecture isolates the sensitive Humanitarian Data Exchange (HDX) API key exclusively within the secure GitHub Actions environment, thereby safeguarding it from client-side exposure. By decoupling the Extract, Transform, Load (ETL) process from the client-facing application, the solution maximizes security, ensures low-latency data delivery via Netlify’s global Content Delivery Network (CDN), and provides a resilient mechanism for dynamic data refresh.

A. Architecture Overview: Key Components and Workflow
The data synchronization workflow is defined by four integral components:

HDX Data Source: This serves as the initial collection point for raw, heterogeneous humanitarian data resources, often in CSV or XLSX formats.   

GitHub Actions (The ETL Engine): This environment is scheduled via a cron job to perform automated data retrieval, cleaning, and preparation. It is the sole component granted access to the secured HDX API key. The Python language, augmented by the hdx-python-api library and the Pandas data analysis package, executes the computationally intensive ETL process.

GitHub Repository (SSOT): The repository stores the resulting clean, structured, visualization-ready data, primarily in JSON format. All Netlify deployments are triggered by updates to these files, ensuring continuous synchronization.

Netlify (The Deployment Layer): Netlify handles Continuous Deployment (CD), automatically triggering site redeployments upon new Git commits originating from the ETL engine. The deployment serves the static front-end application alongside the embedded, clean data files directly from its high-performance CDN.

B. Foundational Security Principles
Security is paramount when dealing with sensitive humanitarian data and protected API credentials. The architecture strictly adheres to the Principle of Least Privilege (PoLP). The HDX API key, which grants authenticated access to data sources, is strictly confined to the GitHub Actions execution environment through encrypted storage mechanisms. The publicly hosted Netlify front-end application only accesses the pre-processed, static data files already committed to the Git repository, eliminating any direct exposure of the API key to end-users or client-side code.   

II. HDX Data Acquisition Strategy and API Analysis
Effective implementation requires a nuanced understanding of the constraints inherent in the HDX platform, which is built upon the CKAN open-source data management system.

A. HDX API Selection: Navigating CKAN Constraints
The HDX platform provides several methods for data interaction, including the CKAN API, the hdx-python-api wrapper, the HDX HAPI, and the HXL Proxy. For this project, which requires complex aggregation and transformation of multiple raw resource files (casualties, displacement, needs), the choice of access method is critical.   

The CKAN API is the default RESTful web API used for searching datasets and retrieving metadata, functioning essentially as a digital library catalogue. However, a major architectural constraint is that the CKAN API explicitly does not permit accessing or searching inside the data resources without first downloading the resource file entirely. This limitation dictates the entire subsequent pipeline design. Since the raw data must be downloaded first, the process cannot rely on lightweight, on-the-fly querying. Instead, the architecture must delegate bulk processing to a powerful, high-privilege environment—the GitHub Actions runner—which executes the full Extract, Transform, Load (ETL) pipeline using Python and Pandas. This approach bypasses the CKAN limitation by offloading the heavy computational work to a managed environment.   

While specialized tools like the HXL Proxy exist for filtering and transforming HXLated data on the fly, and HAPI provides access to standardized indicators , they are often unsuitable for the deep data cleaning, complex aggregation, and time-series pivoting necessary when consolidating heterogeneous, spreadsheet-style data from multiple sources, such as real-time casualty tracking. Therefore, the programmatic download and in-memory processing approach provides superior control over the necessary data transformations.   

B. Identification of Critical Datasets (Post-Oct 7)
The ETL process must target specific, frequently updated data packages related to the occupied Palestinian territory (oPt). The organization United Nations OCHA (oPt) is a crucial publisher of these relevant datasets.   

Casualty and Needs Data: OCHA oPt regularly publishes snapshot reports detailing the reported impact in Gaza and the West Bank, alongside datasets such as the 'Escalations in Gaza - Response Prioritization' tool. The ETL must specifically target the CSV or Google Sheet resources within these packages to extract time-series casualty counts and indicators related to humanitarian needs.   

Displacement Data: The Internal Displacement Monitoring Centre (IDMC) provides Event data sourced from Internal Displacement Updates (IDU). These updates are provisional, reflect initial assessments, and are frequently updated, often on a daily basis.   

The crucial factor regarding data integrity is that these IDU figures represent preliminary estimates. The formalized, validated estimates are subsequently made available through the Global Internal Displacement Database (GIDD). The discrepancy in validation status necessitates caution. To maintain data integrity and ethical reporting standards in the humanitarian sphere , the final data visualization layer must include a clear disclaimer indicating that the figures are "near-real-time provisional data," providing transparency regarding their validation status.   

Historical and Contextual Data: To provide essential context beyond the post-Oct 7 period, the system should integrate historical conflict data series (e.g., ACLED Conflict Events, UCDP Data on Conflict Events) and long-term Food Security and Nutrition Indicators published by FAO, which are available on HDX and often span years.   

C. HDX API Key and Operational Rate Limiting
The authenticated interaction with HDX relies on the API key. The CKAN standard dictates that authentication keys must be provided in the HTTP request header, typically as Authorization or X-CKAN-API-Key. The use of the hdx-python-api library simplifies this by managing the key, which can be retrieved from an environment variable or a local configuration file.   

A critical operational constraint is the HDX platform’s rate limiting policy. To ensure fair access and prevent system overload, HDX enforces a strict limit of one request per second (1 req/sec). Since automated ETL scripts are prone to rapidly issuing sequential API calls (e.g., fetching dataset metadata, then iterating through multiple resource download links), strict adherence to this limit is mandatory. Failure to incorporate explicit throttling mechanisms, such as forcing a one-second delay (time.sleep(1.0)) between sequential API calls, would inevitably lead to rate limit violations, service disruption, and temporary IP blocking. Therefore, the ETL Python script must be self-regulating and throttle its requests to ensure continuous and equitable access to the HDX data stream.   

III. Architecting the Secure Serverless Data Pipeline (GitHub Actions ETL)
The GitOps methodology positions the scheduled GitHub Action as the engine driving data freshness and repository synchronization.

A. GitHub Actions Workflow (.github/workflows/data_sync.yml)
The workflow defines the automation schedule and execution environment.

Trigger and Schedule: The workflow must utilize the on: schedule: trigger  defined by a cron expression (e.g., hourly or daily). The schedule should align dynamically with the specified update frequency of the most critical HDX datasets, such as the daily-updated IDMC displacement figures. By setting a conservative check frequency, the system minimizes the latency for updating critical information.   

Environment Setup and Secrets Management: The runner environment necessitates using the actions/setup-python action to install the Python interpreter and the required libraries (like hdx-python-api and pandas). Crucially, the sensitive HDX API key is stored securely as an encrypted environment variable (HDX_API_KEY) within GitHub Secrets. This key is then injected into the Python runtime environment, isolating it from the repository code.   

Permissions and Commit: To write the cleaned data back to the SSOT repository, the workflow requires contents: write permission. This authenticated commit action is performed using the automatically generated and secure built-in token, ${{ secrets.GITHUB_TOKEN }}. The workflow structure must be carefully managed to prevent the commit action itself from recursively triggering a new workflow run, a scenario mitigated by ensuring the workflow file exists on the default branch and utilizing standard GitHub Actions configuration.   

B. Python ETL Script Logic (main.py)
The ETL script executes the core data management functions and incorporates crucial checks for efficiency and compliance.

Resource Metadata Check: Prior to initiating any large data download, the script must utilize the hdx-python-api to inspect the targeted HDX dataset and resource metadata. A fundamental step for operational efficiency and cost management involves retrieving the resource’s actual update timestamp using the function resource.get_date_data_updated(). This date is compared against the timestamp of the last successful data commit in the SSOT repository. The HDX platform reliably tracks when the data content (not just the metadata) was modified. This preliminary check prevents unnecessary downloading, processing, and subsequent committing if the source data has not changed, thereby conserving GitHub Actions processing minutes and Netlify deployment cycles.   

Data Download and Throttling: If the update check confirms a new version of the resource exists, the file is downloaded. The Python script must then incorporate the mandatory time.sleep(1.0) call after each interaction with the HDX API endpoint to strictly adhere to the 1 req/sec rate limit. This systematic throttling is necessary for the long-term reliability of the automated pipeline.   

Commit Mechanism: Upon successful cleaning and transformation (Section IV), the script performs the Git operations (git add, git commit, git push) necessary to load the new JSON/CSV files into the repository, authenticated via the GITHUB_TOKEN.   

Table III.1: GitHub Actions ETL Workflow Structure (data_sync.yml)

Job/Step Name	Description	GitHub Actions Command/Library	Key Variables/Tokens Used	Dependency/Constraint
data_etl_job	Main job container, runs on Linux environment.	runs-on: ubuntu-latest	N/A	
Triggered by schedule: cron.

1. Checkout Code	Clones the repository to access the ETL script.	uses: actions/checkout@v3	${{ github.token }} (Read access)	Essential first step.
2. Setup Python	Sets up Python interpreter and dependencies (hdx-python-api, pandas).	
uses: actions/setup-python@v4 

N/A	Required libraries installed via requirements.txt.
3. Run ETL Script	Executes data acquisition, update check, and cleaning logic.	python main.py	
${{ secrets.HDX_API_KEY }} 

Script must enforce 1 req/sec throttling.

4. Conditional Commit	Commits cleaned JSON/CSV if updates were generated.	run: git config... / git push	
env: GH_TOKEN: ${{ secrets.GITHUB_TOKEN }} 

Requires contents: write permission.
  
IV. Data Cleansing, Transformation, and Data Model Design
Raw humanitarian data sources are notoriously heterogeneous and require significant preparation before they are usable for visualization. Industry analysis shows that data scientists often dedicate 60–80% of their time to data cleaning activities. The Python ETL, utilizing the Pandas library, is architected to perform this necessary data wrangling.   

A. The Data Cleaning Imperative (Python/Pandas)
The transformation phase ensures that inconsistent, incomplete, or incorrectly formatted raw data is standardized and structured.   

Normalization and Filtering: The process involves standardizing dates, handling missing values, and unifying inconsistent geographic labels (e.g., ensuring "Gaza Strip" is uniformly represented). A critical step is temporal filtering, retaining data starting from October 7, 2023, for the primary tracker view, while optionally retaining some pre-conflict data (e.g., full 2022 and 2023 counts) for comparative contextual dashboards.   

Aggregation and Pivoting: Raw HDX datasets often require restructuring. Casualty figures and displacement numbers, which may be reported as individual events or as cumulative snapshots, must be aggregated daily by location (e.g., Gaza versus the West Bank) to create a consistent time series. This involves using Pandas' capabilities to pivot and group the data, converting spreadsheet-style layouts into the structured arrays suitable for charting.   

B. Optimal Data Modeling: Time-Series JSON Structure (SSOT)
The output format stored in the GitHub SSOT must be highly optimized for fast reading by the client-side visualization libraries, prioritizing a time-series structure. Data is logically segmented to facilitate dashboard views, such as separate tabs for the Gaza Strip and the West Bank, leveraging existing geographical data segmentation.   

The most efficient structure for dashboard rendering is an array of objects where time serves as the primary index, allowing client-side charting libraries to rapidly map fields to axes.

Table IV.2: Optimized JSON Schema for Visualization

Field Path	Data Type	Description	Transformation Requirement
data_metadata.source	String	Organization providing data (e.g., OCHA oPt).	Extracted from HDX metadata.
data_metadata.last_synced	Timestamp	Date of successful GitHub Action execution.	datetime generated by Python ETL.
data_metadata.provisional_warning	Boolean	
Flag indicating that data is preliminary (e.g., IDMC IDU).

Mandatory flag based on source analysis.
location_data	Array	Root array containing all geographical breakdowns.	Grouping by administrative boundaries.
location_data.location	String	E.g., "Gaza Strip" or "West Bank."	Cleaned and normalized location field.
location_data.time_series	Array of Objects	Daily time-series array for this location.	Pandas group-by and daily summation.
time_series.date	ISO 8601 String	Daily timestamp (e.g., "YYYY-MM-DD").	Index field for charting.
time_series.casualties_total	Integer	Cumulative or daily new reported fatalities.	Aggregated from source data.
time_series.displaced_cumu	Integer	
Cumulative internally displaced persons (IDPs).

Extracted from IDMC dataset.
time_series.needs_index	Float	
Calculated humanitarian needs or prioritization score.

Transformation of OCHA data.
  
V. Front-End Serving and Dynamic Refresh Implementation (Netlify Layer)
Netlify serves as the reliable deployment and hosting layer, seamlessly integrating with the GitHub SSOT to achieve data synchronization and global availability.

A. Git-Based Continuous Deployment
The entire front-end deployment pipeline is driven by Git changes. When the GitHub Actions ETL process successfully commits new JSON/CSV files containing updated humanitarian data back to the repository, Netlify’s Continuous Deployment (CD) mechanism automatically detects the commit and triggers a new site build and deployment.   

This Git-based synchronization model is highly optimized. The live application's refresh rate is effectively determined by the ETL cron job frequency (e.g., hourly) and the subsequent speed of the Netlify deployment (typically measured in seconds). This approach is far more resource-efficient than relying on complex webhooks or polling Netlify’s own API, leveraging the core strength of Netlify’s platform. Once deployed, the visualization-ready JSON/CSV files are served as static assets directly through Netlify’s global CDN, providing minimal client-side latency and near-infinite scalability for data consumption.   

B. Secure API Proxying via Netlify Functions (Future Integration)
While the primary HDX key usage is isolated to GitHub Actions, Netlify Functions provide a critical, secure avenue for any future requirements involving external API interactions that cannot be pre-processed (e.g., localized, real-time weather data or custom, authenticated lookups).

Function Role and Security: A Netlify Function, executing server-side logic, can act as a secure reverse proxy. The client-side application requests data from the Function endpoint, which then securely handles the authentication and request forwarding to the external API, hiding sensitive keys from the public frontend.   

Credential Storage: Any necessary API keys for these functions (not the HDX key, which stays in GitHub Secrets) must be stored as Netlify Environment Variables. These variables are securely managed by Netlify and are scoped specifically to the Functions environment, ensuring they are inaccessible to the client-side code and protecting user data.   

Serving Layer Rate Limiting: Netlify provides automatic protection against common attacks like DDoS. Furthermore, custom programmatic rate limiting can be implemented within Netlify Functions or Edge Functions, allowing project administrators to define specific rules to protect the serving infrastructure against client-side abuse and maximize service reliability.   

VI. Security and Resiliency Protocols
The system’s integrity depends on rigorous adherence to security best practices and resilience planning.

A. Secure Credential Management
GitHub Secrets Isolation: The HDX API Key must be exclusively confined to the encrypted GitHub Secrets storage. It must never be committed to the repository, even if private, and should be accessed only through the environment variable mechanism provided by GitHub Actions. The risk of exposed secrets—leading to unauthorized access, data theft, or service disruption—is too high to permit alternative storage methods.   

Principle of Least Privilege (PoLP): Both the HDX key and the GITHUB_TOKEN must be scoped to the minimum necessary permissions. The HDX key requires only read access to the specific humanitarian datasets. The GITHUB_TOKEN must be limited to read/write access (contents: write) necessary for committing the cleaned data, preventing its misuse in other repository functions.   

B. Dual-Layer Rate Limiting and Failure Handling
Resiliency requires managing potential bottlenecks at both the source API level and the serving layer.

Layer 1: Source API Throttling (ETL): The GitHub Actions ETL script must implement mandatory sleep intervals to respect the stringent HDX rate limit of 1 request per second. Robust error handling, including try/except blocks for HTTP 429 errors and potential exponential backoff retry logic, must be integrated to ensure that temporary service interruptions from HDX do not cause the entire scheduled workflow to fail permanently. This proactive throttling ensures equitable access to the HDX resource pool.   

Layer 2: Serving Protection (Netlify): Netlify automatically handles DDoS detection and rate limiting for the site infrastructure. For any deployed serverless functions, Netlify provides customization options for programmatic rate limiting, supplementing the platform’s automatic security measures and protecting against excessive client-side requests.   

C. Data Change Detection and Integrity
To optimize resource usage, the ETL process incorporates smart change detection. The script first checks the HDX resource's last_modified date using resource.get_date_data_updated(). If the date indicates an update, the download and cleaning proceed. However, a final check is required before committing: the script must generate a content hash (e.g., SHA-256) of the resulting, clean JSON output. The commit operation is executed only if this new content hash differs from the hash of the file currently stored in the SSOT repository. This mechanism prevents redundant Git commits and subsequent Netlify deployment triggers that would otherwise occur if the ETL process, due to source metadata changes or re-execution, generated functionally identical data.   

VII. Operational Sustainability and Maintenance Plan
Maintaining the integrity and availability of humanitarian data requires a proactive maintenance strategy.

A. Pipeline Monitoring and Alerts
Continuous monitoring of the GitHub Actions workflow is necessary. Failure notifications (e.g., via email integrated with GitHub) should be configured for any failed workflow runs. Failures are most often caused by three factors: rate-limit violations (if throttling fails), upstream HDX file format changes, or unexpected changes to column names within the raw CSVs, which break the Pandas cleaning logic.   

Furthermore, the integrity of the data sources must be reviewed periodically. HDX itself employs a system that reminds designated maintainers to update data based on a set frequency. This update frequency must be mirrored in the GitHub Actions cron schedule. Regular review (e.g., monthly) of the targeted HDX resource pages is necessary to detect if a source organization changes its publication frequency or archives a dataset, requiring an update to the ETL source configuration.   

B. Integration of Historical Data Series
The tracker gains significant contextual value by integrating historical data alongside current figures, especially for baseline comparison against the post-October 7 escalation.

Historical Data Strategy: Conflict event data (ACLED, UCDP)  and long-term food security indicators (FAO)  offer crucial context but do not require daily updates. These historical data series should be managed by separate, less frequent ETL jobs (e.g., monthly or quarterly cron schedules).   

Model Extension: The primary time-series JSON schema (Table IV.2) should be designed to accommodate the integration of these long-term indicators, extending the data model to include fields derived from these contextual sources (e.g., adding conflict_events_yearly or food_security_index to the location_data arrays).

VIII. Conclusions and Recommendations
The proposed architecture successfully addresses the requirement for a secure, dynamic, and resilient data tracker by centralizing data processing within a controlled GitOps pipeline. The technical specification is driven primarily by the architectural constraints of the HDX platform.

The necessity to download entire resource files, dictated by the CKAN API’s metadata-only retrieval functionality, requires the deployment of a robust Python/Pandas ETL engine executed within GitHub Actions. This structural choice is the foundation for enhanced security, as it confines the sensitive HDX API key to a server-side, non-public environment protected by GitHub Secrets.   

The system achieves dynamic data refresh by synchronizing the ETL cron schedule with the HDX source update frequency (e.g., daily IDMC data ) and leveraging the Git commit as the trigger for Netlify’s automatic continuous deployment. Resilience is built in through strict adherence to the HDX 1 req/sec rate limit via internal Python throttling  and by implementing smart change detection (date check and content hashing) to optimize CI/CD resource usage.   

Actionable Recommendations
Mandatory Throttling Implementation: Developers must embed explicit time.sleep(1.0) calls immediately following any hdx-python-api interactions that query HDX endpoints to strictly comply with the 1 req/sec rate limit.   

Data Integrity Disclaimers: The front-end application must clearly and persistently display warnings regarding the provisional nature of high-frequency datasets like IDMC’s Internal Displacement Updates, ensuring transparent data reporting.   

Dedicated SSOT Branch: While the workflow runs on the default branch, it is highly recommended that the ETL process commits the cleaned data to a dedicated directory or branch within the repository (e.g., /data/ssot) to maintain clear separation between application code and data assets, simplifying future maintenance and data archiving efforts.

Prioritize Netlify CDN: The architecture should rely solely on Netlify’s CDN to serve the static JSON/CSV data assets, avoiding the deployment of unnecessary Netlify Functions for serving pre-processed data, maximizing speed, and minimizing infrastructure costs.

