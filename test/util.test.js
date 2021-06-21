const { compareStringName } = require('../src/utils/compareFunction');

describe('Test compart function', () => {
    it('is compare String right', () => {
        const a = { name: 'abd' };
        const b = { name: 'abc' };
        const d = { name: 'adc' };

        let rs = compareStringName(a, b);
        let rs1 = compareStringName(b, a);
        let rs2 = compareStringName(d, b);

        expect(rs).toBe(1);
        expect(rs1).toBe(-1);
        expect(rs2).toBe(1);
    });
});
