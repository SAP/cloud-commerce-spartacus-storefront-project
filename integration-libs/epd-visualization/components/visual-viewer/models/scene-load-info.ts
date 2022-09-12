/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContentType } from '@commerce-storefront-toolset/epd-visualization/root';
import { SceneLoadState } from './scene-load-state';

export interface LoadedSceneInfo {
  sceneId: string;
  contentType: ContentType;
}

export interface SceneLoadInfo {
  sceneLoadState: SceneLoadState;
  loadedSceneInfo?: LoadedSceneInfo;
  errorMessage?: string;
}
