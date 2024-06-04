import mongoose, { Schema, Document } from "mongoose";
import {TFileModel} from '@/types/types'

const ObjectId = Schema.ObjectId;

const FileSchema: Schema = new Schema({
  userId: {
    type: ObjectId,
    require: true
  },
  projectId: {
    type: ObjectId,
    require: true
  },
  alt: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdBy: {
    type: ObjectId,
    required: true
  },
  updatedBy: {
    type: ObjectId,
    required: true
  },
  position: {
    type: Number,
    default: 1
  },
  filename: String,
  uuidName: {
    type: String,
    required: true
  },
  ext: String,
  width: Number,
  height: Number,
  size: {
    type: Number,
    default: 0
  },
  contentType: String,
  mimeType: String,
  storage: {
    type: String,
    default: 'appframe'
  },
  state: {
    type: String,
    default: 'pending'
  }
});

FileSchema.set('toObject', { virtuals: true });
FileSchema.set('toJSON', { virtuals: true });

FileSchema.virtual('uuidFilename').get(function() {
  return this.uuidName + '.' + this.ext;
});
FileSchema.virtual('awsS3Key').get(function() {
  return `projects/${this.projectId}/files/${this.contentType}/${this.uuidName}/${this.filename}`;
});

export default mongoose.models.File || mongoose.model < TFileModel & Document > ("File", FileSchema);