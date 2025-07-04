import { objectRegExpToString, stringToObjectRegExp } from '../src/index';

describe('objectRegExpToString', () => {
    it('should handle simple string values without double encoding', () => {
        const obj = {
            query: {
                gllState: "missing"
            }
        };
        const result = objectRegExpToString(obj);
        expect(result).toBe('{"query":{"gllState":"missing"}}');
    });

    it('should handle null and undefined values', () => {
        expect(objectRegExpToString(null)).toBe('null');
        expect(objectRegExpToString(undefined)).toBe(undefined);
        expect(objectRegExpToString({ key: null })).toBe('{"key":null}');
        // JSON.stringify omits undefined values from objects
        expect(objectRegExpToString({ key: undefined })).toBe('{}');
    });

    it('should convert RegExp objects to strings', () => {
        const obj = {
            pattern: /test/gi,
            simpleRegex: /hello/
        };
        const result = objectRegExpToString(obj);
        expect(result).toBe('{"pattern":"/test/gi","simpleRegex":"/hello/"}');
    });

    it('should handle arrays with mixed types', () => {
        const obj = {
            items: ["string", 123, /pattern/i, true, null]
        };
        const result = objectRegExpToString(obj);
        expect(result).toBe('{"items":["string",123,"/pattern/i",true,null]}');
    });

    it('should handle nested objects', () => {
        const obj = {
            level1: {
                level2: {
                    text: "hello",
                    regex: /world/g,
                    number: 42
                }
            }
        };
        const result = objectRegExpToString(obj);
        expect(result).toBe('{"level1":{"level2":{"text":"hello","regex":"/world/g","number":42}}}');
    });

    it('should handle primitive values', () => {
        expect(objectRegExpToString("string")).toBe('"string"');
        expect(objectRegExpToString(123)).toBe('123');
        expect(objectRegExpToString(true)).toBe('true');
        expect(objectRegExpToString(false)).toBe('false');
    });

    it('should handle complex regex patterns', () => {
        const obj = {
            emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phoneRegex: /^\+?[\d\s\-\(\)]+$/g,
            urlRegex: /https?:\/\/[^\s]+/gi
        };
        const result = objectRegExpToString(obj);
        expect(result).toBe('{"emailRegex":"/^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$/","phoneRegex":"/^\\\\+?[\\\\d\\\\s\\\\-\\\\(\\\\)]+$/g","urlRegex":"/https?:\\\\/\\\\/[^\\\\s]+/gi"}');
    });

    it('should handle special characters in strings', () => {
        const obj = {
            text: 'Hello "world" with \'quotes\' and \\backslashes\\'
        };
        const result = objectRegExpToString(obj);
        expect(result).toBe('{"text":"Hello \\"world\\" with \'quotes\' and \\\\backslashes\\\\"}');
    });
});

describe('stringToObjectRegExp', () => {
    it('should parse simple objects with strings', () => {
        const jsonStr = '{"query":{"gllState":"missing"}}';
        const result = stringToObjectRegExp(jsonStr);
        expect(result).toEqual({
            query: {
                gllState: "missing"
            }
        });
    });

    it('should handle null and undefined values', () => {
        expect(stringToObjectRegExp('null')).toBe(null);
        // stringToObjectRegExp cannot handle undefined directly as it's not valid JSON
        // We test with 'null' which can be parsed
        expect(stringToObjectRegExp('{"key":null}')).toEqual({ key: null });
        // Empty object for keys that were undefined (they get omitted by JSON.stringify)
        expect(stringToObjectRegExp('{}')).toEqual({});
    });

    it('should convert regex strings back to RegExp objects', () => {
        const jsonStr = '{"pattern":"/test/gi","simpleRegex":"/hello/"}';
        const result = stringToObjectRegExp(jsonStr);
        expect(result.pattern).toBeInstanceOf(RegExp);
        expect(result.pattern.source).toBe('test');
        expect(result.pattern.flags).toBe('gi');
        expect(result.simpleRegex).toBeInstanceOf(RegExp);
        expect(result.simpleRegex.source).toBe('hello');
        expect(result.simpleRegex.flags).toBe('');
    });

    it('should handle arrays with mixed types', () => {
        const jsonStr = '{"items":["string",123,"/pattern/i",true,null]}';
        const result = stringToObjectRegExp(jsonStr);
        expect(result.items[0]).toBe("string");
        expect(result.items[1]).toBe(123);
        expect(result.items[2]).toBeInstanceOf(RegExp);
        expect(result.items[2].source).toBe('pattern');
        expect(result.items[2].flags).toBe('i');
        expect(result.items[3]).toBe(true);
        expect(result.items[4]).toBe(null);
    });

    it('should handle nested objects', () => {
        const jsonStr = '{"level1":{"level2":{"text":"hello","regex":"/world/g","number":42}}}';
        const result = stringToObjectRegExp(jsonStr);
        expect(result.level1.level2.text).toBe("hello");
        expect(result.level1.level2.regex).toBeInstanceOf(RegExp);
        expect(result.level1.level2.regex.source).toBe('world');
        expect(result.level1.level2.regex.flags).toBe('g');
        expect(result.level1.level2.number).toBe(42);
    });

    it('should handle primitive values', () => {
        expect(stringToObjectRegExp('"string"')).toBe("string");
        expect(stringToObjectRegExp('123')).toBe(123);
        expect(stringToObjectRegExp('true')).toBe(true);
        expect(stringToObjectRegExp('false')).toBe(false);
    });

    it('should not convert strings that look like regex but are not valid', () => {
        const jsonStr = '{"notRegex":"/invalid/xyz","alsoNotRegex":"just/a/string"}';
        const result = stringToObjectRegExp(jsonStr);
        expect(result.notRegex).toBe("/invalid/xyz");
        expect(result.alsoNotRegex).toBe("just/a/string");
    });
});

describe('Round-trip conversion tests', () => {
    it('should maintain data integrity for objects with strings', () => {
        const original = {
            query: {
                gllState: "missing",
                status: "active"
            },
            filters: ["type1", "type2"]
        };
        
        const stringified = objectRegExpToString(original);
        const parsed = stringToObjectRegExp(stringified);
        
        expect(parsed).toEqual(original);
    });

    it('should maintain data integrity for objects with regex', () => {
        const original = {
            patterns: {
                email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                phone: /^\+?[\d\s\-\(\)]+$/g
            },
            text: "some text"
        };
        
        const stringified = objectRegExpToString(original);
        const parsed = stringToObjectRegExp(stringified);
        
        expect(parsed.patterns.email).toBeInstanceOf(RegExp);
        expect(parsed.patterns.email.source).toBe(original.patterns.email.source);
        expect(parsed.patterns.email.flags).toBe(original.patterns.email.flags);
        expect(parsed.patterns.phone).toBeInstanceOf(RegExp);
        expect(parsed.patterns.phone.source).toBe(original.patterns.phone.source);
        expect(parsed.patterns.phone.flags).toBe(original.patterns.phone.flags);
        expect(parsed.text).toBe(original.text);
    });

    it('should maintain data integrity for complex nested structures', () => {
        const original = {
            config: {
                validation: {
                    rules: [
                        { pattern: /\d+/, required: true },
                        { pattern: /[a-z]+/i, required: false }
                    ]
                },
                messages: {
                    error: "Invalid input",
                    success: "Valid"
                }
            },
            metadata: {
                version: "1.0.0",
                timestamp: new Date().toISOString()
            }
        };
        
        const stringified = objectRegExpToString(original);
        const parsed = stringToObjectRegExp(stringified);
        
        expect(parsed.config.validation.rules[0].pattern).toBeInstanceOf(RegExp);
        expect(parsed.config.validation.rules[0].pattern.source).toBe('\\d+');
        expect(parsed.config.validation.rules[1].pattern).toBeInstanceOf(RegExp);
        expect(parsed.config.validation.rules[1].pattern.source).toBe('[a-z]+');
        expect(parsed.config.validation.rules[1].pattern.flags).toBe('i');
        expect(parsed.config.messages.error).toBe("Invalid input");
        expect(parsed.metadata.version).toBe("1.0.0");
    });

    it('should handle arrays at root level', () => {
        const original = [
            { name: "test1", pattern: /abc/g },
            { name: "test2", pattern: /def/i },
            "simple string"
        ];
        
        const stringified = objectRegExpToString(original);
        const parsed = stringToObjectRegExp(stringified);
        
        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed[0].pattern).toBeInstanceOf(RegExp);
        expect(parsed[0].pattern.source).toBe('abc');
        expect(parsed[0].pattern.flags).toBe('g');
        expect(parsed[1].pattern).toBeInstanceOf(RegExp);
        expect(parsed[1].pattern.source).toBe('def');
        expect(parsed[1].pattern.flags).toBe('i');
        expect(parsed[2]).toBe("simple string");
    });

    it('should handle edge cases', () => {
        const original = {
            emptyString: "",
            zero: 0,
            emptyArray: [],
            emptyObject: {},
            regexWithSpecialChars: /[\w\s\-\.]+/gi
        };
        
        const stringified = objectRegExpToString(original);
        const parsed = stringToObjectRegExp(stringified);
        
        expect(parsed.emptyString).toBe("");
        expect(parsed.zero).toBe(0);
        expect(parsed.emptyArray).toEqual([]);
        expect(parsed.emptyObject).toEqual({});
        expect(parsed.regexWithSpecialChars).toBeInstanceOf(RegExp);
        expect(parsed.regexWithSpecialChars.source).toBe('[\\w\\s\\-\\.]+');
        expect(parsed.regexWithSpecialChars.flags).toBe('gi');
    });
});
