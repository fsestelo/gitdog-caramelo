/**
 * gitdog-caramelo type definitions
 */

export enum Role {
  Admin = "Administrator",
  ReleaseManager = "Release Manager",
  Developer = "Developer",
  Viewer = "Viewer"
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  preferred_language: "pt-BR" | "en-US" | "es-ES";
  active: boolean;
}

export interface Environment {
  id: string;
  name: string;
  description: string;
  url: string;
  apiKey: string;
  status: "ONLINE" | "OFFLINE" | "UNCONFIGURED";
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: Record<string, any>;
}

export interface WorkflowConnection {
  main: Array<{
    node: string;
    index: number;
  }>;
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  connections: Record<string, Record<string, WorkflowConnection[]>>;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  workflowData: WorkflowData;
  comment: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface ReleaseItem {
  id: string;
  releaseId: string;
  workflowId: string;
  workflowName: string;
  versionId: string;
  versionNumber: number;
}

export interface Release {
  id: string;
  name: string;
  description: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  items: ReleaseItem[];
}

export interface Deployment {
  id: string;
  releaseId?: string;
  workflowId?: string;
  versionNumber?: number;
  targetEnvironmentId: string;
  targetEnvironmentName: string;
  authorId: string;
  authorName: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  createdAt: string;
  logs: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ip: string;
  objectAffected: string;
  environmentName?: string;
  result: "SUCCESS" | "FAILED";
  createdAt: string;
}
