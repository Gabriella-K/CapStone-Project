# Music Player App

## Project Overview
The Music Player App is a web application built with **React** and **Vanilla CSS** that allows users to play songs, manage playlists, and control music playback 
through a simple and intuitive interface.

## Features Implemented So Far
## Core Functionality
- Basic project setup with React  
- Core directory structure for scalable development  
- Initial UI components
- Music Playback System using a custom PlayerContext (play, pause, next, previous)
- Trending Slider that displays trending artists fetched from the API
- Popular Songs Section with active track highlighting
- Search Bar to easily look up songs or artists
- Recommendations Section for personalized content
- Account creation for saving activities done like adding favorites

## User Interface

- Clean, responsive design optimized for both desktop and mobile
- Sidebar navigation for easy access to Library, Discover, Trending, and Popular
- Intuitive layout with modern animations and hover effects

## Backend Integration

- Fetching live music data from Deezer API through a local Node.js proxy server
- Proper CORS handling and structured API routes (/api/trending, /api/popular, /api/artist/:id/top)

## State Management

- Global state managed with React Context API
- Persistent playback control (song queue, current song, and play/pause status)

## Libraries and Frameworks used 

- Frontend (React, Vanilla CSS, React-icons)
- Backend (Node.js, express.js)
- API (Deezer music API)
- State management (React context)
- Tools (Vite, Git, npm)

## API Routes overview
| Route                 | Description                           |
| --------------------- | ------------------------------------- |
| `/api/trending`       | Fetches trending artists and songs    |
| `/api/popular`        | Fetches popular tracks                |
| `/api/artist/:id/top` | Fetches top tracks for a given artist |
| `/api/genres`         | Fetches all genres                    |
| `/api/genres/:id`     | Fetches tracks per genre ID           |

# Challenges and Solutions
 ## Challenge
- CORS Policy Error: The Deezer API blocked requests from localhost due to missing headers.
- Maintaining music playback across pages: When navigating between routes, the audio used to restart or stop.
- API data inconsistency or missing fields: Some songs or artists lacked image or title data.

## Solution
- Implemented a Node.js + Express proxy server to handle API requests securely and bypass CORS issues.
- Moved the PlayerControls and PlayerContext outside route-specific components to persist the audio state globally.
- Added conditional rendering and fallback values to prevent crashes or broken UI displays.

## Future Improvements

- Add user authentication and custom playlists
- Add Album of different artists
- Showing playing song interface
- Introduce music recommendations based on play history
- Add dark/light mode toggle
- Improve mobile playback controls
- Implement lyrics and favorites features

## Conclusion
The Music Player App is a fun, responsive, and dynamic web application showcasing React’s power in building interactive UIs and managing global state efficiently.
It provides a solid base for future extensions like playlist management, user authentication, and AI-based recommendations.


