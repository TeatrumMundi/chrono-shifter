# Chrono-Shifter

## Work in progress (Second week)

## Overview

The `Chrono-Shifter` is a NEXT.js-based web application, built with Next.js, provides users with detailed information about League of Legends summoners based on their provided in-game nickname. It leverages the Riot Games API to fetch and display this data in a user-friendly format.

## FIGMA
Figma prototype: [Demo](https://www.figma.com/proto/ym7Uvqh216ZOG2iV6toc3T?node-id=0-1&t=7L1R5Ta12My8RGyB-6)

## Features

- **Summoner Information**: Fetch detailed data about summoners, including their `gameName`, `tagLine`, `prfileIcon`, `Level`.
- **Match History**: Retrieve recent matches played by a summoner, along with comprehensive match details such as `gameResult`, `everyPlayerScore`, `build` and more.
- **Champion Mastery**: Access information on a summoner's proficiency with various champions. `everyChampionMastery`, `yourTopChampions`, `totalMasteryScore`.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 12.18.3 or higher)
- [npm](https://www.npmjs.com/) (Node package manager)
- [axios](https://axios-http.com/) (1.7.9)
- [express](https://expressjs.com/) (4.21.2)
- [next](https://nextjs.org/) (15.1.7)
- [react](https://react.dev/) (19.0.0)

## Installation

1. **Clone the Repository**:

   ```bash
   gh repo clone TeatrumMundi/chrono-shifter
   cd chrono-shifter
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:

   Create a `.env.local` file in the root directory based on the provided `.env-template`. Ensure all necessary configurations, such as your Riot Games API key and MongoDB connection string, are correctly set.


4. **Launch the Server**:

   ```bash
   npm start
   ```

   The server should now be running, ready to handle API requests.

## API Endpoints

The backend provides the following endpoints:

- **account**:
    - `GET /account/by-riot-id/?region={region}&gameName={gameName}&tag={tagLine}`: Retrieve `puuid` `gameName` `tagLine` by `gameName` + `tagLine`
    - `GET /account/by-puuid/?region={region}&puuid={puuid}`: Retrieve `puuid` `gameName` `tagLine` by `puuid`

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
