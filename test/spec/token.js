import Token from "../../src.es5/token.js";

import constants from "../../src.es5/constants.js";

describe("The Token class", function () {
    describe("exposes the \"value\" member", function () {
        it("as a property with a getter but no setter", function () {
            expect(Token.prototype).toHaveGetter("value");
            expect(Token.prototype).not.toHaveSetter("value");
        });
    });
    
    describe("exposes the \"type\" member", function () {
        it("as a property with a getter but no setter", function () {
            expect(Token.prototype).toHaveGetter("type");
            expect(Token.prototype).not.toHaveSetter("type");
        });
    });
    
    describe("exposes the \"line\" member", function () {
        it("as a property with a getter but no setter", function () {
            expect(Token.prototype).toHaveGetter("line");
            expect(Token.prototype).not.toHaveSetter("line");
        });
    });
    
    describe("exposes the \"col\" member", function () {
        it("as a property with a getter but no setter", function () {
            expect(Token.prototype).toHaveGetter("col");
            expect(Token.prototype).not.toHaveSetter("col");
        });
    });
    
    describe("exposes the \"clone\" member", function () {
        it("as a function", function () {
            expect(Token.prototype.clone).toEqual(jasmine.any(Function));
        });
        
        it("which returns a new Token as a clone of this one with no arguments", function () {
            let token = new Token("test", constants.TYPE.IDENTIFIER, 0, 1);
            expect(token.clone()).toEqual(jasmine.objectContaining({
                value: "test",
                type: constants.TYPE.IDENTIFIER,
                line: 0,
                col: 1
            }));
        });
        
        it("which returns a new Token as a clone of this one using the value, type, line, or col specified", function () {
            let token = new Token("test", constants.TYPE.IDENTIFIER, 0, 1);
            expect(token.clone({ value: "test2", type: constants.TYPE.VARIABLE })).toEqual(jasmine.objectContaining({
                value: "test2",
                type: constants.TYPE.VARIABLE,
                line: 0,
                col: 1
            }));
            
            expect(token.clone({ line: 2, col: 3 })).toEqual(jasmine.objectContaining({
                value: "test",
                type: constants.TYPE.IDENTIFIER,
                line: 2,
                col: 3
            }));
        });
    });
    
    describe("exposes the static \"flatten\" member", function () {
        it("as a function", function () {
            expect(Token.flatten).toEqual(jasmine.any(Function));
        });
        
        it("which flattens an object of Tokens down to an object of their values", function () {
            expect(Token.flatten(new Token({
                foo: new Token("bar", constants.TYPE.STRING),
                obj: new Token({
                    bar: new Token("foo", constants.TYPE.STRING)
                }, constants.TYPE.OBJECT)
            }, constants.TYPE.OBJECT))).toEqual({
                foo: "bar",
                obj: {
                    bar: "foo"
                }
            });
        });
    });
    
    describe("exposes the \"getSelector\" member", function () {
        it("as a function", function () {
            expect(Token.prototype.getSelector).toEqual(jasmine.any(Function));
        });
        
        it("which returns this Token's jQuery selector", function () {
            expect(new Token("make", constants.TYPE.IDENTIFIER).getSelector()).toBe("[name=\"make\"]");
        });
    });
    
    describe("exposes the \"isTag\" member", function () {
        it("as a function", function () {
            expect(Token.prototype.isTag).toEqual(jasmine.any(Function));
        });
        
        let assertTag = function (value, type) {
            return new Token(value, type).isTag();
        };
        
        describe("which returns true when this Token is a tag, such as", function () {
            it("valid", function () {
                expect(assertTag("valid", constants.TAG.VALID)).toBe(true);
            });
            
            it("enabled", function () {
                expect(assertTag("enabled", constants.TAG.ENABLED)).toBe(true);
            });
            
            it("visible", function () {
                expect(assertTag("visible", constants.TAG.VISIBLE)).toBe(true);
            });
            
            it("result", function () {
                expect(assertTag("result", constants.TAG.RESULT)).toBe(true);
            });
        });
        
        it("which returns false when this Token is not a tag", function () {
            expect(assertTag(constants.TYPE.STRING, constants.TYPE.KEYWORD)).toBe(false);
            expect(assertTag(true, constants.TYPE.BOOL)).toBe(false);
            expect(assertTag(constants.OPERATOR.ADD, constants.TYPE.KEYWORD)).toBe(false);
            // ...
        });
    });
    
    describe("exposes the \"isComparator\" member", function () {
        it("as a function", function () {
            expect(Token.prototype.isComparator).toEqual(jasmine.any(Function));
        });
        
        let assertComparator = function (value, type) {
            return new Token(value, type).isComparator();
        };
        
        describe("which returns true when this Token is a comparator, such as", function () {
            it("equals", function () {
                expect(assertComparator(constants.OPERATOR.EQUALS, constants.TYPE.KEYWORD)).toBe(true);
            });
            
            it("matches", function () {
                expect(assertComparator(constants.OPERATOR.MATCHES, constants.TYPE.KEYWORD)).toBe(true);
            });
            
            it("<", function () {
                expect(assertComparator(constants.OPERATOR.LT, constants.TYPE.KEYWORD)).toBe(true);
            });
            
            it(">", function () {
                expect(assertComparator(constants.OPERATOR.GT, constants.TYPE.KEYWORD)).toBe(true);
            });
            
            it("<=", function () {
                expect(assertComparator(constants.OPERATOR.LTE, constants.TYPE.KEYWORD)).toBe(true);
            });
            
            it(">=", function () {
                expect(assertComparator(constants.OPERATOR.GTE, constants.TYPE.KEYWORD)).toBe(true);
            });
        });
        
        it("which returns false when this Token is not a comparator", function () {
            expect(assertComparator(constants.TYPE.STRING, constants.TYPE.KEYWORD)).toBe(false);
            expect(assertComparator(true, constants.TYPE.BOOL)).toBe(false);
            expect(assertComparator(constants.OPERATOR.ADD, constants.TYPE.KEYWORD)).toBe(false);
            // ...
        });
    });
    
    describe("exposes the \"isOperand\" member", function () {
        it("as a function", function () {
            expect(Token.prototype.isOperand).toEqual(jasmine.any(Function));
        });
        
        let assertOperand = function (value, type) {
            return new Token(value, type).isOperand();
        };
        
        describe("which returns true when this Token is an operand, such as", function () {
            it("identifiers", function () {
                expect(assertOperand("test", constants.TYPE.IDENTIFIER)).toBe(true);
            });
            
            it("booleans", function () {
                expect(assertOperand(true, constants.TYPE.BOOL)).toBe(true);
                expect(assertOperand(false, constants.TYPE.BOOL)).toBe(true);
            });
            
            it("numbers", function () {
                expect(assertOperand(1, constants.TYPE.NUMBER)).toBe(true);
            });
            
            it("strings", function () {
                expect(assertOperand("test", constants.TYPE.STRING)).toBe(true);
            });
            
            it("regular expressions", function () {
                expect(assertOperand("test", constants.TYPE.REGEX)).toBe(true);
            });
            
            it("variables", function () {
                expect(assertOperand("test", constants.TYPE.VARIABLE)).toBe(true);
            });
        });
        
        it("which returns false when this Token is not an operand", function () {
            expect(assertOperand(constants.OPERATOR.COLON, constants.TYPE.KEYWORD)).toBe(false);
            expect(assertOperand(constants.OPERATOR.LBRACE, constants.TYPE.KEYWORD)).toBe(false);
            expect(assertOperand(constants.OPERATOR.ADD, constants.TYPE.KEYWORD)).toBe(false);
            // ...
        });
    });
    
    describe("exposes the \"isUfmType\" member", function () {
        it("as a function", function () {
            expect(Token.prototype.isUfmType).toEqual(jasmine.any(Function));
        });
        
        let assertUfmType = function (value, type) {
            return new Token(value, type).isUfmType();
        };
        
        it("which returns true for the string type", function () {
            expect(assertUfmType("string", constants.TYPE.KEYWORD)).toBe(true);
        });
        
        it("which returns true for the boolean type", function () {
            expect(assertUfmType("boolean", constants.TYPE.KEYWORD)).toBe(true);
        });
        
        it("which returns true for the number type", function () {
            expect(assertUfmType("number", constants.TYPE.KEYWORD)).toBe(true);
        });
        
        it("which returns false when this Token is not a UFM type", function () {
            expect(assertUfmType(constants.OPERATOR.COLON, constants.TYPE.KEYWORD)).toBe(false);
            expect(assertUfmType(constants.OPERATOR.LBRACE, constants.TYPE.KEYWORD)).toBe(false);
            expect(assertUfmType(constants.OPERATOR.ADD, constants.TYPE.KEYWORD)).toBe(false);
            // ...
        });
    });
});