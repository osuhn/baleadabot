import { FT, T } from '@skyra/http-framework-i18n';

export const PingFailed = T('commands/general:pingFailed');
export const PingPong = FT<{ diff: number; ping: number }>('commands/general:pingPong');
