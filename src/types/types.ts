import { Application } from "express";

export type RoutesInput = {
  app: Application,
}

export type TErrorResponse = {
  error: string|null;
  description?: string;
  property?: string;
}

export type TFileModel = {
  id: string;
  userId: string;
  projectId: string;
  alt: string;
  caption: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  position: number;
  filename: string;
  uuidName: string;
  ext: string;
  width: number;
  height: number;
  size: number;
  contentType: string;
  mimeType: string;
  uuidFilename: string;
  S3Key: string;
  src: string;
  storage: string;
  state: string;
}

export enum Resource {
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file'
}
export type TStagedUploadFile = {
  filename: string;
  mimeType: string;
  resource: Resource;
  fileSize: number;
  httpMethod: string;
}

export type TStagedTarget = {
  parameters: {name: string, value: string}[], 
  resourceUrl: string,
  url: string
}

export type TFile = {
  id: string;
  filename: string;
  uuidName: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  contentType: string;
  src: string;
  alt: string;
  caption: string;
  state: string;
  ext: string;
}

export type TUploadFile = {
  uuidName: string;
  ext: string;
  mimeType: string;
  width: number;
  height: number;
  size: number;
}

export type TDataFile = {
  filename: string;
  uuidName: string;
  ext: string;
  mimeType: string;
  width: number;
  height: number;
  size: number;
}

export type TParameters = {
  limit?: number;
  page?: number;
  sinceId?: string;
  code?: string;
  filename?: string;
}

export type TInputFile = {
  originalSource: string,
  contentType: string
}