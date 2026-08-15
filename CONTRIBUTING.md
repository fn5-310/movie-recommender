# Contributing to `movie-recommender`

To start, thank you for considering contributing to this project. Having contributors such as yourself allow us to develop our website further, and to a high quality, which is very appreciated.

## Getting Started
To begin, if you haven't looked through the [Code of Conduct](https://github.com/fn5-310/movie-recommender/blob/main/CODE_OF_CONDUCT.md) to understand the behaviour we are looking to cultivate in our community.

Generally speaking, unlike most open-source projects, we do not have tasks labelled as "good first issue", as the project is small enough in scope such that anyone can contribute, regardless of their skill level.

### Setup
Regarding prerequisite programs, Node.js is required to run the project. This can be downloaded at [https://nodejs.org/en/download](https://nodejs.org/en/download). You can confirm that the install is successful by running the below commands in the terminal of your OS:
```
node --version
npm --version
npx --version
```

After this, the repo can be forked and cloned. We recommend using an IDE such as [VSCode](https://code.visualstudio.com/) to work on the project for linting and syntax validation.

The project installs the node dependencies from the root by running the below command:
```shell
npm run install:all
```

### Setting up your `.env` file

Because the website uses TMDB, you must have an API Key for API Read Access Token for TMDB.
Go to `server/` and rename `.env.example` to `.env`, pasting in your key or access token as required. Your `.env` file may look like this once completed:
```
PORT=5000
CLIENT_URL=http://localhost:5173
TMDB_ACCESS_TOKEN=insertApiReadAccessTokenHere
TMDB_KEY=insertApiKeyHere
```

Currently we also require a `.env` file for `client/` as well. In `client/.env`:
```
VITE_MOVIE_API_KEY=insertApiKeyHere
```

### Running the Website
The dev servers for both the ExpressJS server and React client can be run concurrently through one command:
```
npm run dev
```

To run tests, run the below command:
```
placeholder (command doesn't exist)
```

## Architecture Overview
The project is split into two folders, the `client/` and `server/`. Both run on different ports on the dev server, and uses CORS to interact between them.

The `client/` relates to the frontend, utilising React Components and CSS. There is an api folder for an api fetch call onto the backend.

The `server/` relates to the backend, utilising ExpressJS. Because this project utilises TMDB, this mostly pertains to sending get requests and processing the response data. Currently MongoDB is not utilised in the project.

## Filing a Bug Report
If a bug is found, please [submit an issue](https://github.com/fn5-310/movie-recommender/issues/new) on GitHub. When prompted for a template, select `Bug Report` and fill out the fields as required.

Once submitted, a team member will approve the message, or comment/discuss the bug in further detail. After this, you can develop a solution and submit a pull request with the fix.

## Filing a Feature Request
Similar to above, for any feature request or improvement, please [submit an issue](https://github.com/fn5-310/movie-recommender/issues/new), using the `Feature Request` template.

Like the bug report, please wait for approval from a team member before developing any feature, in the case that the feature is being currently developed, out of project scope, or any other reason.

## Changing Documentation
For any changes required to the documentation, a similar process also follows. There is an issue template, `Documentation Modification`, which should be filled out and can be developed once approved, or assigned to a different team member if the scope is sufficiently small. 

## Key Tasks
Issues denoted as key tasks are those that were outlined in the Project Proposal in the initial ideation phase of the project. These tasks are automatically approved to be worked on, and can be worked on once assigned, to prevent overlapping with another contributor.

## Creating a Pull Request
Before making a pull request, ensure that:
- Your branch is rebased to the latest version of `main`
- If your change involves code, that there are corresponding test cases created
- The project can build without errors or crashes

When submitting a pull request, there will be a preset template to fill out, including a checklist of all of the prerequisites before submitting the pull request. The other important section is linking your PR to the issue your PR closes, using closing keywords.

After submitting, a team member will review your work, request changes, and approve your PR. Your PR should then be (if you are merging) squash merged into the `main` branch.

Congratulations! You have successfully contributed to the `movie-recommender` project!

## Extensions
Per assignment details, [SonarLint](https://www.sonarsource.com/products/sonarqube/ide/) is required when writing code to ensure formatting is correct and security vulnerabilities are minimised.

## Contact
To reach out to a team member of fn5, feel free to reach out in person (group 5), or to email at `placeholderemail@placeholder.com`