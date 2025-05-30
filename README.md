# Game Asset Server (GAS)

The Game Asset Server (GAS) is a backend server application that provides a centralized management system for various types of game assets, including:

- Sprite Sheets
- Tile Sets
- Sound Files
- 3D Models

The GAS server exposes a RESTful API that allows game developers to easily upload, retrieve, and manage their game assets through a consistent interface. This helps streamline the asset management process and ensures a single source of truth for all game assets used in a project.

## Installation

To install and run the GAS server, follow these steps:

1. Ensure you have Node.js and npm installed on your system.
2. Clone the GAS server repository from GitHub:
   ```
   git clone https://github.com/your-org/game-asset-server.git
   ```
3. Navigate to the project directory and install the dependencies:
   ```
   cd game-asset-server
   npm install
   ```
4. Configure the server by setting the appropriate environment variables. See the "Configuration" section below for details.
5. Start the server:
   ```
   npm start
   ```
   The server will now be running and listening for incoming API requests.

## Configuration

The GAS server can be configured using the following environment variables:

- `PORT`: The port number the server should listen on (default is 3000)
- `DATABASE_URL`: The connection string for the database used to store asset data
- `AWS_ACCESS_KEY_ID`: AWS access key for uploading assets to S3 (optional)
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for uploading assets to S3 (optional)

## Usage

The GAS server exposes the following API endpoints:

- `POST /api/assets`: Upload a new game asset
- `GET /api/assets`: Retrieve a list of all available game assets
- `GET /api/assets/:id`: Retrieve details of a specific game asset
- `PUT /api/assets/:id`: Update the metadata of a game asset
- `DELETE /api/assets/:id`: Delete a game asset

Here's an example of how to upload a new sprite sheet using the API:

```javascript
const formData = new FormData();
formData.append("file", spriteSheetFile);
formData.append("name", "Player Sprite Sheet");
formData.append("type", "spritesheet");

fetch("/api/assets", {
  method: "POST",
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Asset uploaded:", data);
  })
  .catch((error) => {
    console.error("Error uploading asset:", error);
  });
```

For more detailed usage examples and API documentation, please refer to the [GAS Server API Reference](https://docs.example.com/gas-api).

## Contributing

If you'd like to contribute to the development of the GAS server, please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.
