/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import {LeakyRelu, LeakyReluAttrs} from '../kernel_names';
import {GradConfig, NamedAttrMap} from '../kernel_registry';
import {greater} from '../ops/greater';
import {mul} from '../ops/mul';
import {where} from '../ops/where';
import {Tensor} from '../tensor';

export const leakyReluGradConfig: GradConfig = {
  kernelName: LeakyRelu,
  inputsToSave: ['x'],
  gradFunc: (dy: Tensor, saved: Tensor[], attrs: NamedAttrMap) => {
    const [x] = saved;
    const {alpha} = attrs as {} as LeakyReluAttrs;
    const mask = greater(x, 0);

    // Returns `gradients * (features > 0) + alpha * gradients * (features <=
    // 0)`.
    return {x: () => where(mask, dy, mul(dy, alpha))};
  }
};
