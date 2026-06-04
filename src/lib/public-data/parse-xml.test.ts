import { describe, expect, it } from 'vitest';
import { parseDataGoKrXml } from './parse-xml';

describe('parse-xml', () => {
  it('공공데이터 XML 응답을 JSON과 같은 구조로 변환한다', () => {
    const payload = parseDataGoKrXml(`
      <response>
        <header><resultCode>00</resultCode></header>
        <body>
          <items>
            <item><title>몬스테라</title></item>
            <item><title>스킨답서스</title></item>
          </items>
        </body>
      </response>
    `);

    expect(payload).toEqual({
      header: { resultCode: '00' },
      body: {
        items: {
          item: [{ title: '몬스테라' }, { title: '스킨답서스' }],
        },
      },
    });
  });
});
