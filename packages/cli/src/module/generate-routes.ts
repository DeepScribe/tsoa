import * as path from 'path';
import * as ts from 'typescript';
import { ExtendedRoutesConfig } from '../cli';
import { MetadataGenerator } from '../metadataGeneration/metadataGenerator';
import { Tsoa } from '@tsoa/runtime';
import { RouteGenerator } from '../routeGeneration/routeGenerator';
import { convertBracesPathParams } from '../utils/pathUtils';

export const generateRoutes = async (
  routesConfig: ExtendedRoutesConfig,
  compilerOptions?: ts.CompilerOptions,
  ignorePaths?: string[],
  /**
   * pass in cached metadata returned in a previous step to speed things up
   */
  metadata?: Tsoa.Metadata,
) => {
  if (!metadata) {
    metadata = new MetadataGenerator(routesConfig.entryFile, compilerOptions, ignorePaths, routesConfig.controllerPathGlobs).Generate();
  }

  const routeGenerator = new RouteGenerator(metadata, routesConfig);

  const pathTransformer = convertBracesPathParams;

  const DEFAULT_TEMPLATES = {
    express: 'express',
    hapi: 'hapi',
    koa: 'koa',
    lambdaAPI: 'lambda-api',
  };

  const defaultTemplate = `${DEFAULT_TEMPLATES[routesConfig.middleware || 'express'] || 'express'}.hbs`;

  let template = path.join(__dirname, '..', `routeGeneration`, 'templates', defaultTemplate);
  if (routesConfig.middlewareTemplate) {
    template = routesConfig.middlewareTemplate;
  }

  await routeGenerator.GenerateCustomRoutes(template, pathTransformer);

  return metadata;
};
