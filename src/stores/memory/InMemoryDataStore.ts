import { Project } from "../../models/Project";
import { AssetStore, DataStore, ProjectStore } from "../DataStore";
import { InMemoryProjectStore } from "./InMemoryProjectStore";
import { InMemoryAssetStore } from "./InMemoryAssetStore";

export class InMemoryDataStore implements DataStore {
  projects: ProjectStore = new InMemoryProjectStore(this);
  assets: AssetStore = new InMemoryAssetStore(this);
}
