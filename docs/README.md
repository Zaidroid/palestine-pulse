# Palestine Pulse: A Real-Time Humanitarian Data Dashboard

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-3.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Palestine Pulse is a comprehensive, real-time humanitarian data visualization platform dedicated to providing multi-dimensional statistics and analysis on the situation in Palestine. The application is built with a serverless architecture, ensuring zero-cost hosting and maintenance, and is designed to deliver critical information with accuracy and clarity.

## Table of Contents

- [Introduction](#introduction)
- [Dashboards](#dashboards)
  - [The War on Gaza](#the-war-on-gaza)
  - [The West Bank Occupation](#the-west-bank-occupation)
- [Core Features](#core-features)
- [Data & Architecture](#data--architecture)
  - [Data Sources](#data-sources)
  - [Data Consolidation & Accuracy](#data-consolidation--accuracy)
  - [Technical Stack](#technical-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Palestine Pulse was created to offer a clear, data-driven view of the humanitarian situation in Palestine. By consolidating data from a multitude of trusted sources, the application provides a nuanced and comprehensive picture of the daily realities on the ground. The V3 release introduces a region-focused architecture, with two distinct dashboards for Gaza and the West Bank, each with detailed sub-tabs for in-depth analysis.

## Dashboards

The application is structured around two primary regional dashboards, each providing a deep dive into the specificities of the situation in each area.

### The War on Gaza

This dashboard documents the humanitarian catastrophe in Gaza through four comprehensive sub-tabs:

1.  **Humanitarian Crisis**: Tracks casualties, demographic impacts, and harm to journalists.
2.  **Infrastructure Destruction**: Monitors damage to buildings, healthcare facilities, and essential utilities.
3.  **Population Impact**: Provides data on displacement, demographic shifts, and the impact on education.
4.  **Aid & Survival**: Details the state of food security, healthcare access, and the flow of humanitarian aid.

### The West Bank Occupation

This dashboard exposes the mechanics of the ongoing occupation through four detailed sub-tabs:

1.  **Occupation Metrics**: Data on illegal settlements, land seizures, and the matrix of control.
2.  **Settler Violence**: Tracks attacks, property demolitions, and agricultural sabotage.
3.  **Economic Strangulation**: Displays economic indicators, trade restrictions, and resource control.
4.  **Prisoners & Detention**: Statistics on political prisoners, child detainees, and detention conditions.

## Core Features

-   **Dual-Dashboard System**: Separate, detailed views for Gaza and the West Bank.
-   **Dynamic Data Visualization**: Over 15 chart types powered by Recharts, D3.js, and Leaflet for interactive maps.
-   **Real-Time Data Consolidation**: A sophisticated `DataConsolidationService` ingests and processes data from multiple sources in real-time.
-   **Client-Side Caching**: An `IndexedDBManager` provides a robust, offline-first experience with a multi-layer caching strategy.
-   **Data Source Status**: The footer provides a real-time overview of the status of all data sources.
-   **Responsive Design**: A mobile-first approach ensures a seamless experience across all devices.
-   **Modern UI/UX**: Built with `shadcn/ui`, Tailwind CSS, and Framer Motion for a clean, animated, and intuitive user interface.

## Data & Architecture

### Data Sources

Palestine Pulse integrates data from a wide array of trusted international and local sources to provide a comprehensive and verified view of the situation. The `ApiOrchestrator` service manages data fetching, normalization, and caching from the following sources:

| Source | Status | Description |
| :--- | :--- | :--- |
| **Tech for Palestine** | ✅ Active | Core casualty and infrastructure data. |
| **Good Shepherd Collective** | ✅ Active | Detailed on-the-ground data on violence, demolitions, and detentions. |
| **UN OCHA** | ✅ Active | Humanitarian access, aid delivery, and displacement data. |
| **World Bank** | ✅ Active | Economic indicators and trade data. |
| **B'Tselem** | ✅ Active | Human rights violations and documentation. |
| **WFP (World Food Programme)** | ✅ Active | Food security and market analysis. |
| **WHO (World Health Organization)**| ✅ Active | Healthcare system status and attacks on facilities. |
| **UNRWA** | ✅ Active | Refugee data and educational impact. |
| **PCBS** | ✅ Active | Official Palestinian national statistics. |

### Data Consolidation & Accuracy

The `DataConsolidationService` is the backbone of the application's data integrity. It performs the following functions:

-   **Dynamic Ingestion**: Fetches data from all configured sources in parallel.
-   **Real-Time Processing**: Normalizes and consolidates data into a unified schema for each dashboard.
-   **Data Quality Metrics**: The service calculates a `dataQuality` score based on the completeness, consistency, and timeliness of the incoming data, providing a transparent measure of data reliability.
-   **Offline First**: Utilizes IndexedDB for a robust client-side caching mechanism, allowing the dashboard to function even with intermittent network connectivity.

### Technical Stack

-   **UI Framework**: React 18 & TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS & `shadcn/ui`
-   **State Management**: Zustand & TanStack Query
-   **Data Visualization**: Recharts, Leaflet, D3.js
-   **Animation**: Framer Motion
-   **Deployment**: Netlify with GitHub Actions for CI/CD

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Zaidroid/palestine-pulse.git
cd palestine-pulse

# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## Contributing

Contributions are welcome and encouraged. Please follow these steps to contribute:

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

Please adhere to the existing code style and ensure your changes are well-documented.

## License

This project is licensed under the MIT License.
