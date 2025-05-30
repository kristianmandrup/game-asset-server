# Game Asset Server (GAS)

The Game Asset Server (GAS) is a backend server application that provides a centralized management system for various types of game assets, including:

- Sprite Sheets
- Tile Sets
- Sound Files
- 3D Models

The GAS server exposes a RESTful API that allows game developers to easily upload, retrieve, and manage their game assets through a consistent interface. This helps streamline the asset management process and ensures a single source of truth for all game assets used in a project.

## Installation

To install and run the GAS server, follow these steps:

- Ensure you have Node.js and npm installed on your system.
- Clone the GAS server repository from GitHub:

```bash
  git clone https://github.com/your-org/game-asset-server.git
```

- Navigate to the project directory and install the dependencies:

```bash
cd game-asset-server
npm install
```

- Configure the server by setting the appropriate environment variables. See the "Configuration" section below for details.
- Start the server:

```bash
npm start
```

The server will now be running and listening for incoming API requests.

## Configuration

The GAS server can be configured using the following environment variables:

- `PORT`: The port number the server should listen on (default is 3000)
- `DATA_STORE_TYPE`: Specifies the type of data store to use.
  - `db`: Uses a SQL database (e.g., PostgreSQL, SQLite). Requires `DATABASE_URL`.
  - `json`: Uses JSON files for persistence. Requires `JSON_FILE_PATH`.
  - `in-memory`: Uses an in-memory data store (data is lost on server restart).
- `DATABASE_URL`: The connection string for the SQL database (e.g., `postgresql://user:password@host:port/database`). Required if `DATA_STORE_TYPE` is `db`.
- `JSON_FILE_PATH`: The path to the directory where JSON data files will be stored (e.g., `./data`). Required if `DATA_STORE_TYPE` is `json`.
- `AWS_ACCESS_KEY_ID`: AWS access key for uploading assets to S3 (optional)
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for uploading assets to S3 (optional)

## Usage

The GAS server exposes a RESTful API for managing projects and assets.

### Projects Endpoints

#### `POST /api/projects`

Creates a new project.

**Request Body:**

```json
{
  "name": "My New Game Project",
  "description": "A description of my awesome game."
}
```

**Response (Success - 201 Created):**

```json
{
  "id": "uuid-of-project",
  "name": "My New Game Project",
  "description": "A description of my awesome game.",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:00:00Z"
}
```

**Response (Error - 400 Bad Request - Validation Error):**

```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

#### `GET /api/projects`

Retrieves a list of all available projects.

**Response (Success - 200 OK):**

```json
[
  {
    "id": "uuid-of-project-1",
    "name": "Project Alpha",
    "description": "First project",
    "createdAt": "2023-10-26T09:00:00Z",
    "updatedAt": "2023-10-26T09:00:00Z"
  },
  {
    "id": "uuid-of-project-2",
    "name": "Project Beta",
    "description": "Second project",
    "createdAt": "2023-10-27T11:00:00Z",
    "updatedAt": "2023-10-27T11:00:00Z"
  }
]
```

#### `GET /api/projects/:id`

Retrieves details of a specific project by its ID.

**Response (Success - 200 OK):**

```json
{
  "id": "uuid-of-project",
  "name": "My New Game Project",
  "description": "A description of my awesome game.",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:00:00Z"
}
```

**Response (Error - 404 Not Found):**

```json
{
  "error": "Not Found",
  "message": "Project with ID 'non-existent-id' not found."
}
```

#### `PUT /api/projects/:id`

Updates the metadata of a specific project by its ID.

**Request Body:**

```json
{
  "name": "Updated Project Name",
  "description": "An updated description."
}
```

**Response (Success - 200 OK):**

```json
{
  "id": "uuid-of-project",
  "name": "Updated Project Name",
  "description": "An updated description.",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:30:00Z"
}
```

**Response (Error - 400 Bad Request - Validation Error):**

```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "name",
      "message": "Name cannot be empty"
    }
  ]
}
```

**Response (Error - 404 Not Found):**

```json
{
  "error": "Not Found",
  "message": "Project with ID 'non-existent-id' not found."
}
```

#### `DELETE /api/projects/:id`

Deletes a specific project by its ID.

**Response (Success - 204 No Content):**
(No content returned)

**Response (Error - 404 Not Found):**

```json
{
  "error": "Not Found",
  "message": "Project with ID 'non-existent-id' not found."
}
```

### Assets Endpoints

#### `POST /api/assets`

Uploads a new game asset. This endpoint expects `multipart/form-data`.

**Request Body (FormData):**

- `file`: The asset file itself (e.g., `.png`, `.wav`, `.glb`).
- `name`: (string) The name of the asset.
- `type`: (string) The type of asset (e.g., `spritesheet`, `tileset`, `sound`, `model`).
- `projectId`: (string, optional) The ID of the project this asset belongs to.

**Example (Sprite Sheet):**

```javascript
const formData = new FormData();
formData.append("file", spriteSheetFile); // A File object
formData.append("name", "Player Sprite Sheet");
formData.append("type", "spritesheet");
formData.append("projectId", "uuid-of-project");

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

**Response (Success - 201 Created):**

```json
{
  "id": "uuid-of-asset",
  "name": "Player Sprite Sheet",
  "type": "spritesheet",
  "url": "/assets/uuid-of-asset/player-spritesheet.png",
  "projectId": "uuid-of-project",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:00:00Z"
}
```

**Response (Error - 400 Bad Request - Validation Error):**

```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "name",
      "message": "Asset name is required"
    },
    {
      "field": "type",
      "message": "Invalid asset type. Must be one of: spritesheet, tileset, sound, model"
    }
  ]
}
```

**Response (Error - 400 Bad Request - Missing File):**

```json
{
  "error": "Bad Request",
  "message": "No file uploaded."
}
```

#### `GET /api/assets`

Retrieves a list of all available game assets. Can be filtered by `projectId`.

**Query Parameters:**

- `projectId`: (string, optional) Filter assets by a specific project ID.

**Example Request:**
`GET /api/assets?projectId=uuid-of-project`

**Response (Success - 200 OK):**

```json
[
  {
    "id": "uuid-of-asset-1",
    "name": "Player Sprite Sheet",
    "type": "spritesheet",
    "url": "/assets/uuid-of-asset-1/player-spritesheet.png",
    "projectId": "uuid-of-project",
    "createdAt": "2023-10-26T09:00:00Z",
    "updatedAt": "2023-10-26T09:00:00Z"
  },
  {
    "id": "uuid-of-asset-2",
    "name": "Background Music",
    "type": "sound",
    "url": "/assets/uuid-of-asset-2/bg-music.wav",
    "projectId": "uuid-of-project",
    "createdAt": "2023-10-27T11:00:00Z",
    "updatedAt": "2023-10-27T11:00:00Z"
  }
]
```

#### `GET /api/assets/:id`

Retrieves details of a specific game asset by its ID.

**Response (Success - 200 OK):**

```json
{
  "id": "uuid-of-asset",
  "name": "Player Sprite Sheet",
  "type": "spritesheet",
  "url": "/assets/uuid-of-asset/player-spritesheet.png",
  "projectId": "uuid-of-project",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:00:00Z"
}
```

**Response (Error - 404 Not Found):**

```json
{
  "error": "Not Found",
  "message": "Asset with ID 'non-existent-id' not found."
}
```

#### `PUT /api/assets/:id`

Updates the metadata of a specific game asset by its ID.

**Request Body:**

```json
{
  "name": "Updated Player Sprite Sheet",
  "projectId": "new-project-id"
}
```

**Response (Success - 200 OK):**

```json
{
  "id": "uuid-of-asset",
  "name": "Updated Player Sprite Sheet",
  "type": "spritesheet",
  "url": "/assets/uuid-of-asset/player-spritesheet.png",
  "projectId": "new-project-id",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:30:00Z"
}
```

**Response (Error - 400 Bad Request - Validation Error):**

```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "name",
      "message": "Asset name cannot be empty"
    }
  ]
}
```

**Response (Error - 404 Not Found):**

```json
{
  "error": "Not Found",
  "message": "Asset with ID 'non-existent-id' not found."
}
```

#### `DELETE /api/assets/:id`

Deletes a specific game asset by its ID.

**Response (Success - 204 No Content):**
(No content returned)
**Response (Error - 404 Not Found):**

```json
{
  "error": "Not Found",
  "message": "Asset with ID 'non-existent-id' not found."
}
```

## Contributing

If you'd like to contribute to the development of the GAS server, please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.
