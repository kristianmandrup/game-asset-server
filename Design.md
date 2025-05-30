# Game Asset Server (GAS) Design

## Architecture Overview

The Game Asset Server (GAS) follows a Model-View-Controller (MVC) or Model-View-Presenter (MVP) architectural pattern, with the following main components:

### API Layer

- **Routes**: Defines the API endpoints and maps them to the appropriate controllers.
- **Controllers**: Handles incoming API requests, validates input, and coordinates the necessary actions with the data management layer.

### Data Management Layer

- **DataStore Interface**: Defines the contract for data storage operations, allowing for interchangeable implementations.
- **DatabaseService**: Orchestrates the core CRUD (Create, Read, Update, Delete) operations, utilizing the configured `DataStore` implementation.
- **Data Store Implementations**:
  - **DatabaseDataStore**: Persists data in a SQL database (e.g., PostgreSQL, SQLite).
  - **JSONFileDataStore**: Persists data in local JSON files.
  - **InMemoryDataStore**: Stores data in memory (non-persistent, useful for development/testing).

### Data Models

- **Project**: Represents a game project, containing metadata and a collection of assets.
- **Asset**: The base class for various asset types, including SpriteSheet, TileSet, and Sound.

The components interact as follows:

1. The API layer (routes and controllers) receives incoming HTTP requests.
2. The controllers validate the request data and delegate the necessary actions to the DatabaseService.
3. The DatabaseService interacts with the currently configured Data Store Implementation (DatabaseDataStore, JSONFileDataStore, or InMemoryDataStore) to perform CRUD operations on the project and asset data.
4. The data models define the structure and schema for the project and asset entities.

![GAS Architecture Diagram](gas-architecture.png)

## API Endpoint Flow: Create Project

When a client sends a request to create a new project, the flow is as follows:

1. The `/api/projects` POST endpoint is hit in the API routes.
2. The ProjectController receives the request and validates the input data.
3. The ProjectController calls the `createProject` method on the DatabaseService, passing the new project data.
4. The DatabaseService interacts with the configured Data Store Implementation (e.g., DatabaseDataStore, JSONFileDataStore, or InMemoryDataStore) to create a new project entity and store it.
5. The DatabaseService returns the newly created project to the ProjectController.
6. The ProjectController formats the response and sends it back to the client.

![Create Project Flow Diagram](create-project-flow.png)

## Future Improvements

- Introduce additional services or components to handle tasks like asset file storage, user authentication, and other cross-cutting concerns, further separating responsibilities and improving modularity.
- Implement caching mechanisms to improve the performance of frequently accessed data, such as project and asset listings.
- Explore the integration of message queues or event-driven architectures to decouple certain operations and enable asynchronous processing of time-consuming tasks (e.g., asset uploads, image processing).
- Enhance the API with features like pagination, sorting, and filtering to provide more flexibility and control for clients consuming the GAS server.
