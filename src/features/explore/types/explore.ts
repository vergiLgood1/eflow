export interface ExploreModel {
  id: string;
  name: string;
  owner: string;
  workspaceSlug: string;
  updatedAt: string;
  isPublic: boolean;
  previewColor: string;
  stars?: number;
}

export interface ExploreData {
  models: ExploreModel[];
  total: number;
  page: number;
  totalPages: number;
}
