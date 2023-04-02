/*
 ** antd-pro  special lang support
 */

import React from 'react';
import ProTable, {
  IntlProvider,
  createIntl,
  enUSIntl,
  zhCNIntl,
  zhTWIntl,
} from '@ant-design/pro-table';
import { getLocale, getAllLocales } from 'umi';
import proTableSearch from '@/locales/pt-BR/proTableSearch';
import type { ProTableProps } from '@ant-design/pro-table';

const allLocals = getAllLocales();
const ptBRIntl = createIntl('pt-BR', proTableSearch);
const locals = allLocals.reduce((cur, next) => {
  if (next === 'en-US') return { ...cur, [next]: enUSIntl };
  if (next === 'pt-BR') return { ...cur, [next]: ptBRIntl };
  if (next === 'zh-CN') return { ...cur, [next]: zhCNIntl };
  if (next === 'zh-TW') return { ...cur, [next]: zhTWIntl };
  return { ...cur };
}, {});

function ProTableIntl<T, U>(props: ProTableProps<T, U>): React.ReactElement {
  return (
    <IntlProvider value={locals[getLocale()]}>
      <ProTable<T, U> {...props} pagination={{ pageSizeOptions: ['10', '20', '50'] }} />
    </IntlProvider>
  );
}

export default ProTableIntl;
