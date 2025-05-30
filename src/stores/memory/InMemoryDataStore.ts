import { ApiKeyStore, DataStore, ProjectStore, UserStore } from "../DataStore";
import { InMemoryProjectStore } from "./InMemoryProjectStore";
import { InMemorySoundAssetStore } from "./InMemorySoundAssetStore";
import { InMemoryCombinedAssetStore } from "./InMemoryCombinedAssetStore";
import { InMemoryApiKeyStore } from "./InMemoryApiKeyStore";
import { InMemoryUserStore } from "./InMemoryUserStore";

export class InMemoryDataStore implements DataStore {
  projects: ProjectStore;
  assets: InMemoryCombinedAssetStore;
  users: UserStore;
  apiKeys: ApiKeyStore;

  constructor() {
    this.projects = new InMemoryProjectStore(this);
    this.assets = new InMemoryCombinedAssetStore(this);
    this.users = new InMemoryUserStore(this);
    this.apiKeys = new InMemoryApiKeyStore(this);
  }
}
