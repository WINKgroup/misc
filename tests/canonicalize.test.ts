import { canonicalize } from '../src/index';

describe('canonicalize', () => {
    it('preserves regexp values while sorting object keys', () => {
        const value = {
            zeta: 1,
            title: /^foo/i,
            alpha: 2,
        };

        const result = canonicalize(value);

        expect(Object.keys(result)).toEqual(['alpha', 'title', 'zeta']);
        expect(result.title).toBeInstanceOf(RegExp);
        expect(result.title).toBe(value.title);
        expect(result.title.source).toBe('^foo');
        expect(result.title.flags).toBe('i');
    });

    it('preserves regexp values inside nested objects and arrays', () => {
        const value = {
            filters: [
                {
                    value: /foo/g,
                    field: 'title',
                },
            ],
            query: {
                title: /^pippo/i,
                status: 'active',
            },
        };

        const result = canonicalize(value);

        expect(Object.keys(result)).toEqual(['filters', 'query']);
        expect(Object.keys(result.query)).toEqual(['status', 'title']);
        expect(Object.keys(result.filters[0])).toEqual(['field', 'value']);
        expect(result.query.title).toBe(value.query.title);
        expect(result.filters[0].value).toBe(value.filters[0].value);
        expect(result.query.title).toBeInstanceOf(RegExp);
        expect(result.filters[0].value).toBeInstanceOf(RegExp);
    });
});
