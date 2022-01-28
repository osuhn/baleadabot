import '#root/config';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-i18next/register';
import '@sapphire/plugin-hmr/register';

import * as colorette from 'colorette';
import { inspect } from 'util';

inspect.defaultOptions.depth = 1;
colorette.createColors({ useColor: true });
