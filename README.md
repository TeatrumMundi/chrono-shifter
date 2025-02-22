# Chrono-Shifter

## Work in progress (First week)

## Overview

The `Chrono-Shifter` is a Node.js-based backend service designed to interface with the Riot Games API, providing essential data for a League of Legends application. It offers endpoints to retrieve summoner information, match histories, and other related data.

## FIGMA
Figma prototype: `https://www.figma.com/proto/ym7Uvqh216ZOG2iV6toc3T?node-id=0-1&t=7L1R5Ta12My8RGyB-6`

## Features

- **Summoner Information**: Fetch detailed data about summoners, including their profiles and statistics.
- **Match History**: Retrieve recent matches played by a summoner, along with comprehensive match details.
- **Champion Mastery**: Access information on a summoner's proficiency with various champions.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12.18.3 or higher)
- [npm](https://www.npmjs.com/) (Node package manager)
- [MongoDB](https://www.mongodb.com/) (for data storage)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/TeatrumMundi/lol-app-backend.git
   cd lol-app-backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env` file in the root directory based on the provided `.env-template`. Ensure all necessary configurations, such as your Riot Games API key and MongoDB connection string, are correctly set.

4. **Start MongoDB**:

   Ensure your MongoDB service is running. You can start it using:

   ```bash
   sudo service mongod start
   ```

5. **Launch the Server**:

   ```bash
   npm start
   ```

   The server should now be running, ready to handle API requests.

## API Endpoints

The backend provides the following endpoints:

- **Sessions**:
    - `GET /sessions/:id`: Retrieve session details by ID.
    - `POST /sessions`: Create a new session.

- **Annotations**:
    - `GET /annotations?session=:sessionId`: Fetch annotations associated with a specific session.
    - `POST /annotations`: Create a new annotation.
    - `PUT /annotations/:id`: Update an existing annotation by ID.
    - `DELETE /annotations/:id`: Delete an annotation by ID.

- **League of Legends Data**:
    - `GET /lol/match/v4/matchlists/by-account/:encryptedAccountId`: Retrieve match list by account ID.
    - `GET /lol/match/v4/matches/:matchId`: Get match details by match ID.
    - `GET /lol/champion-mastery/v4/champion-masteries/by-summoner/:encryptedSummonerId`: Fetch champion masteries by summoner ID.
    - `GET /lol/league-exp/v4/entries/:queue/:tier/:division`: Access league entries by queue, tier, and division.
    - `GET /lol/summoner/v4/summoners/by-name/:summonerName`: Retrieve summoner details by name.

For detailed information on request and response structures, refer to the [Riot Games API Documentation](https://developer.riotgames.com/apis).

## Project Structure

The project's directory structure is organized as follows:

```
lol-app-backend/
├── routes/                     # API route definitions
│   ├── account-v1.js           # Account information
│   ├── champion-mastery-v4.js  # Champion mastery
│   ├── lol-status-v4.js        # Server status and error
│   ├── match-v5.js             # Match informations
│   └── riotApi.js              # Helper function for .env handling         
├── .env-template               # Environment variable template
├── .gitignore                  # Git ignore file
├── package.json                # Project metadata and dependencies
├── package-lock.json           # Exact versions of installed dependencies
└── server.js                   # Main application entry point
```

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository, create a new branch for your feature or bug fix, and submit a pull request. Ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Acknowledgments

This project utilizes the Riot Games API but is not endorsed or certified by Riot Games.

*Note: Ensure you comply with Riot Games' [API policies and terms of use](https://developer.riotgames.com/policies) when using this backend service.*
