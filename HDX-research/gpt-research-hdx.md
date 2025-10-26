Leveraging the HDX CKAN API for Palestine Crisis Data

The Humanitarian Data Exchange (HDX) (data.humdata.org) is a CKAN-based platform maintained by OCHA that hosts thousands of humanitarian datasets. HDX provides a rich API for searching, retrieving metadata, and downloading data
centre.humdata.org
. In practice, you can use the HDX CKAN API or the HDX Python library to programmatically fetch data (CSV or JSON) from HDX. For example, as the HDX documentation explains, you can call Dataset.search_in_hdx(...) to find relevant datasets and then Dataset.get_all_resources(...) to retrieve their resource URLs and download them
hdx-python-api.readthedocs.io
hdx-python-api.readthedocs.io
. HDX also offers the Humanitarian API (HAPI), a specialized REST API that provides standardized indicators (e.g. affected populations, displacement counts, nutrition needs, etc.) at country and subnational levels
hdx-hapi.readthedocs.io
. These tools allow you to integrate official UN/OCHA data on casualties, displacement, humanitarian needs, etc., into your dashboard.

Key steps in the plan include:

Identify relevant datasets on HDX. Search the HDX catalog (via the API) for Palestinian data: e.g. “Gaza casualties”, “West Bank displacement”, “Palestine IDPs”, etc. HDX’s CKAN package_search can filter by keywords, tags or groups (e.g. country=“pse”). For example, OCHA and partners have datasets on Gaza/West Bank hostilities (casualty figures, infrastructure damage, displacement figures), and UNRWA or UN agencies often post shelter/IDP data to HDX. The HDX HAPI also includes Palestine-specific tables (e.g. “State of Palestine – Internally Displaced Persons”) with aggregated stats
hdx-hapi.readthedocs.io
. Use the API (or the HDX Python library) to find each dataset’s unique ID or slug.

Use the HDX API to download data. Once you have a dataset ID, call the CKAN API (e.g. /api/3/action/package_show) to list its resources. Each resource will have a URL to a CSV (or occasionally JSON) file. You can fetch these directly. For example, in Python:

from hdx.api.configuration import Configuration
from hdx.data.dataset import Dataset

Configuration.create(hdx_site="prod", user_agent="MyProject_Palestine", hdx_read_only=True)
datasets = Dataset.search_in_hdx("palestine internal displaced persons", rows=5)
resources = Dataset.get_all_resources(datasets)
for res in resources:
    url, path = res.download()  # downloads CSV/JSON to local file
    print(f"Downloaded {url} to {path}")


This code (from the HDX Python docs) will search HDX, retrieve matching datasets and download their resources
hdx-python-api.readthedocs.io
hdx-python-api.readthedocs.io
. Alternatively, you can use plain HTTP: e.g. call GET https://data.humdata.org/api/3/action/package_search?q=keywords to find datasets, then use the resource’s download_url. Many HDX datasets provide CSV and JSON endpoints. For instance, the “Killed in Gaza” dataset on Palestine Data (techforpalestine.org) offers both CSV and JSON feeds
data.techforpalestine.org
; HDX works similarly by exposing raw CSV links or via its HXL Proxy (which can convert CSV to JSON on the fly). You should fetch the format you prefer (JSON is ideal for web apps). The HDX API Cookbook (linked on HDX) contains many such examples of using these endpoints.

Automate fetching with serverless workflows. Since your site is static on Netlify and hosted on GitHub, use scheduled automation to keep data fresh. For example: set up a GitHub Actions workflow (with a cron schedule) that runs a Python/Node script using the HDX API. The script would fetch current casualty counts, displacement numbers, etc., process/clean them, and commit the results as JSON/CSV files back to the GitHub repo. Each commit triggers Netlify to rebuild the site with updated data. Alternatively, Netlify now supports Scheduled Functions (Cron-style lambdas)
docs.netlify.com
 – you could write a Netlify Function that runs daily to pull HDX data and then push it to the repo via GitHub’s API. Key point: store the HDX API key as a secret (GitHub Secret or Netlify env var) so it’s never exposed in code
netlify.com
answers.netlify.com
. Use the key only in backend functions; never embed it in client-side JS. Netlify’s support guides emphasize keeping tokens secure via environment variables and serverless functions (the token lives only in the function’s context)
netlify.com
answers.netlify.com
answers.netlify.com
.

Define refresh frequency by source. Different datasets update at different paces. For example, UNRWA shelter occupancy or daily casualty tallies may update hourly/daily; OCHA snapshots (west bank demolitions, food security assessments, etc.) may update monthly or as reports are released. In your workflow, set job schedules accordingly (daily for fast-moving stats; weekly or on-demand for slower data). You can also check the dataset metadata: many HDX resources have an “update frequency” or “last updated” field to guide you. In practice, you might run an hourly netlify function for near-real-time stats, and a nightly GitHub Action to fetch the latest weekly/monthly releases.

Clean and store data for the dashboard. After fetching raw data, perform any needed cleaning: normalize dates, sum or filter categories, handle missing values, etc. For example, you may parse casualty lists to totals by day or demographic, aggregate IDP counts by governorate, or merge multiple resources (like combining UNRWA and IOM displacement figures). Store the cleaned outputs as JSON/CSV files in your repo (under a data/ folder). These static files can be directly consumed by your front-end or charting libraries. Because you’re versioning them in Git, you also build a historical record. In your React/Vue app (served by Netlify), you can either import these JSON files at build time (embedding them into the bundle) or set up an internal /data/* endpoint (a Netlify function) to serve them dynamically.

Use Netlify Functions for real-time data endpoints. In addition to static data, you can expose one or more API endpoints via Netlify Functions that query HDX on-the-fly. For example, a function at /api/hdx-data could accept parameters (e.g. date range) and use your stored HDX key to fetch the latest numbers from HDX HAPI or a CKAN dataset. Because the function runs server-side, the key stays hidden
answers.netlify.com
. Your front-end can call these endpoints (e.g. via fetch('/api/hdx-data?indicator=idp')) to get up-to-date figures. This approach maintains a “serverless” architecture while ensuring fresh data.

Tap HDX HAPI indicators and data grids. HDX’s Humanitarian API offers ready-made tables for many indicators. For instance, under “State of Palestine” HAPI datasets, you’ll find tables like “IDPs (displaced persons)”, “Affected people – Gaza/West Bank”, “Food Security – Gaza”, etc. Querying these (e.g. via https://hapi.humdata.org/api/v1/hdx/indicators/gaza/idps) can yield JSON time series with very little work. Use these to supplement or cross-check the raw datasets. The HAPI docs note that it standardizes data from multiple sources to make dashboards easier
hdx-hapi.readthedocs.io
. For historical context, HDX also archives older Palestine-related data (e.g. past clashes in Gaza/Israel, long-term IDP databases), so you can use the API to fetch pre-2023 baselines.

Example data sources: Relevant HDX content might include:

Casualties: OCHA’s Protection of Civilians database (Palestinian and Israeli fatalities/injuries by date/location), usually found in HDX datasets or HAPI tables.

Displacement: UNRWA/IDMC reports on Gazan IDPs, West Bank demolitions, or IOM DTM (Displacement Tracking Matrix). For example, the “Data on Displaced Persons in UNRWA Shelters” dataset (by governorate) is available on HDX
data.techforpalestine.org
.

Needs and Relief: Cluster appeals and situation reports (food security needs, WASH status, medical needs) – OCHA often publishes these in HDX or via HAPI indicators.

Historical: Legacy conflict data (e.g. April 2021 Gaza escalation, or West Bank violence over last decade) can be pulled from HDX archives to show trends.

Implementation sketch: Store your HDX API key as HDX_API_KEY in Netlify’s build settings and in GitHub Secrets. In a scheduled GitHub Action, run a Node/Python script that does something like:

# Example pseudocode
datasets = ckan.package_search(group="pse", q="Gaza displacement")
for each dataset:
    res = ckan.package_show(id=dataset.id)
    for resource in res.resources:
        if resource.format in ("CSV","JSON"):
            data = download(resource.url)
            cleaned = clean_and_transform(data)
            save_json(cleaned, f"data/{dataset.id}.json")
commit_and_push_changes()


Use dotenv or GitHub secrets to supply the API key to ckan.api_key (or set HDX Python config). In parallel, deploy Netlify Functions (node) that can fetch one-off queries from HDX (using fetch with the secret key) and return JSON to the frontend.

Throughout, follow best practices for secret management: never hard-code the HDX key in frontend code. Instead, call it within your backend scripts or functions. Netlify’s docs explicitly recommend storing keys in environment variables and using serverless functions to proxy calls so the key isn’t exposed in the page source
netlify.com
answers.netlify.com
.

By systematically integrating HDX via these methods, your dashboard can include up-to-date humanitarian data on Gaza and the West Bank (casualties, displacements, needs assessments, etc.), enriching the existing Tech4Palestine/Goodshepherd data. Automation (GitHub Actions and/or Netlify Scheduled Functions) ensures the data stays current, while storing processed JSON in your repo preserves historical snapshots. In sum, use HDX’s CKAN/HAPI APIs to fetch CSV/JSON data into your build pipeline (as demonstrated in the HDX Python examples
hdx-python-api.readthedocs.io
), schedule regular updates, and secure your API key via environment variables and Netlify functions
netlify.com
answers.netlify.com
.