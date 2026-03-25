import type { InferSchemaType } from "mongoose";

export type ModelType<TSchema> = InferSchemaType<TSchema>;
