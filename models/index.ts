// Models - Data layer
// Define your data models, types, and schemas here

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Example model - replace with your actual models
export interface ExampleModel extends BaseEntity {
  name: string;
  description?: string;
}
