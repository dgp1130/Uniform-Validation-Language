import * as evaluator from "../../src.es5/evaluator.js";

import constants from "../../src.es5/constants.js";
import Token from "../../src.es5/token.js";
import Scope from "../../src.es5/scope.js";
import Identifier from "../../src.es5/identifier.js";
import { BlockVariable } from "../../src.es5/variable.js";
import { TypeError, UndeclaredError } from "../../src.es5/errors.js";

describe("The evaluator module", function () {
    describe("exposes the \"and\" member", function () {
        it("as a function", function () {
            expect(evaluator.and).toEqual(jasmine.any(Function));
        });
        
        let andOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.and(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the boolean AND operation on two input expressions", function () {
            expect(andOp(true, constants.TYPE.BOOL, false, constants.TYPE.BOOL)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left operand
            expect(andOp(1, constants.TYPE.NUMBER, false, constants.TYPE.BOOL)).toThrowUfmError(TypeError);
            
            // Check right operand
            expect(andOp(false, constants.TYPE.BOOL, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"or\" member", function () {
        it("as a function", function () {
            expect(evaluator.or).toEqual(jasmine.any(Function));
        });
        
        let orOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.or(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the boolean OR operation on two input expressions", function () {
            expect(orOp(true, constants.TYPE.BOOL, false, constants.TYPE.BOOL)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left operand
            expect(orOp(1, constants.TYPE.NUMBER, false, constants.TYPE.BOOL)).toThrowUfmError(TypeError);
            
            // Check right operand
            expect(orOp(false, constants.TYPE.BOOL, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"not\" member", function () {
        it("as a function", function () {
            expect(evaluator.not).toEqual(jasmine.any(Function));
        });
        
        let notOp = function (value, type) {
            return evaluator.not(() => new Token(value, type));
        };
        
        it("which performs the boolean NOT operation on an input expression", function () {
            expect(notOp(false, constants.TYPE.BOOL)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            expect(notOp(1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"equals\" member", function () {
        it("as a function", function () {
            expect(evaluator.equals).toEqual(jasmine.any(Function));
        });
        
        let equalsOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.equals(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the boolean EQUALS operation on two input expressions", function () {
            expect(equalsOp(1, constants.TYPE.NUMBER, 1, constants.TYPE.NUMBER)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
            
            expect(equalsOp(1, constants.TYPE.NUMBER, 2, constants.TYPE.NUMBER)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
        });
        
        it("which returns a false token when given two expressions which result in different types", function () {
            expect(equalsOp(1, constants.TYPE.NUMBER, false, constants.TYPE.BOOL)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
        });
    });
    
    describe("exposes the \"matches\" member", function () {
        it("as a function", function () {
            expect(evaluator.matches).toEqual(jasmine.any(Function));
        });
        
        let matchesOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.matches(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the regular expression MATCHES operation on two input expressions", function () {
            expect(matchesOp("test", constants.TYPE.STRING, /test/, constants.TYPE.REGEX)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
            
            expect(matchesOp("hello", constants.TYPE.STRING, /world/, constants.TYPE.REGEX)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            expect(matchesOp(1, constants.TYPE.NUMBER, /test/, constants.TYPE.REGEX)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"lt\" member", function () {
        it("as a function", function () {
            expect(evaluator.lt).toEqual(jasmine.any(Function));
        });
        
        let ltOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.lt(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the boolean LESS THAN operation on two input expressions", function () {
            expect(ltOp(1, constants.TYPE.NUMBER, 2, constants.TYPE.NUMBER)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
            
            expect(ltOp(2, constants.TYPE.NUMBER, 1, constants.TYPE.NUMBER)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
            
            expect(ltOp(1, constants.TYPE.NUMBER, 1, constants.TYPE.NUMBER)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left expression
            expect(ltOp("test", constants.TYPE.STRING, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
            
            // Check right expression
            expect(ltOp(1, constants.TYPE.NUMBER, "test", constants.TYPE.STRING)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"gt\" member", function () {
        it("as a function", function () {
            expect(evaluator.gt).toEqual(jasmine.any(Function));
        });
        
        let gtOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.gt(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the boolean GREATER THAN operation on two input expressions", function () {
            expect(gtOp(2, constants.TYPE.NUMBER, 1, constants.TYPE.NUMBER)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
            
            expect(gtOp(1, constants.TYPE.NUMBER, 2, constants.TYPE.NUMBER)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
            
            expect(gtOp(1, constants.TYPE.NUMBER, 1, constants.TYPE.NUMBER)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left expression
            expect(gtOp("test", constants.TYPE.STRING, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
            
            // Check right expression
            expect(gtOp(1, constants.TYPE.NUMBER, "test", constants.TYPE.STRING)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"lte\" member", function () {
        it("as a function", function () {
            expect(evaluator.lte).toEqual(jasmine.any(Function));
        });
        
        let lteOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.lte(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the boolean LESS THAN OR EQUAL TO operation on two input expressions", function () {
            expect(lteOp(1, constants.TYPE.NUMBER, 2, constants.TYPE.NUMBER)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
            
            expect(lteOp(2, constants.TYPE.NUMBER, 1, constants.TYPE.NUMBER)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
            
            expect(lteOp(1, constants.TYPE.NUMBER, 1, constants.TYPE.NUMBER)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left expression
            expect(lteOp("test", constants.TYPE.STRING, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
            
            // Check right expression
            expect(lteOp(1, constants.TYPE.NUMBER, "test", constants.TYPE.STRING)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"gte\" member", function () {
        it("as a function", function () {
            expect(evaluator.gte).toEqual(jasmine.any(Function));
        });
        
        let gteOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.gte(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the boolean LESS THAN OR EQUAL TO operation on two input expressions", function () {
            expect(gteOp(2, constants.TYPE.NUMBER, 1, constants.TYPE.NUMBER)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
            
            expect(gteOp(1, constants.TYPE.NUMBER, 2, constants.TYPE.NUMBER)()).toEqualToken({
                value: false,
                type: constants.TYPE.BOOL
            });
            
            expect(gteOp(1, constants.TYPE.NUMBER, 1, constants.TYPE.NUMBER)()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left expression
            expect(gteOp("test", constants.TYPE.STRING, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
            
            // Check right expression
            expect(gteOp(1, constants.TYPE.NUMBER, "test", constants.TYPE.STRING)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"add\" member", function () {
        it("as a function", function () {
            expect(evaluator.add).toEqual(jasmine.any(Function));
        });
        
        let addOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.add(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the arithmetic ADD operation on two input expressions", function () {
            expect(addOp(1, constants.TYPE.NUMBER, 2, constants.TYPE.NUMBER)()).toEqualToken({
                value: 3,
                type: constants.TYPE.NUMBER
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left expression
            expect(addOp(false, constants.TYPE.BOOL, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
            
            // Check right expression
            expect(addOp(1, constants.TYPE.NUMBER, false, constants.TYPE.BOOL)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"sub\" member", function () {
        it("as a function", function () {
            expect(evaluator.sub).toEqual(jasmine.any(Function));
        });
        
        let subOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.sub(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the arithmetic SUBTRACT operation on two input expressions", function () {
            expect(subOp(3, constants.TYPE.NUMBER, 2, constants.TYPE.NUMBER)()).toEqualToken({
                value: 1,
                type: constants.TYPE.NUMBER
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left expression
            expect(subOp(false, constants.TYPE.BOOL, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
            
            // Check right expression
            expect(subOp(1, constants.TYPE.NUMBER, false, constants.TYPE.BOOL)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"mul\" member", function () {
        it("as a function", function () {
            expect(evaluator.mul).toEqual(jasmine.any(Function));
        });
        
        let mulOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.mul(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the arithmetic MULTIPLY operation on two input expressions", function () {
            expect(mulOp(2, constants.TYPE.NUMBER, 3, constants.TYPE.NUMBER)()).toEqualToken({
                value: 6,
                type: constants.TYPE.NUMBER
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left expression
            expect(mulOp(false, constants.TYPE.BOOL, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
            
            // Check right expression
            expect(mulOp(1, constants.TYPE.NUMBER, false, constants.TYPE.BOOL)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"div\" member", function () {
        it("as a function", function () {
            expect(evaluator.div).toEqual(jasmine.any(Function));
        });
        
        let divOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.div(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the arithmetic DIVISION operation on two input expressions", function () {
            expect(divOp(6, constants.TYPE.NUMBER, 3, constants.TYPE.NUMBER)()).toEqualToken({
                value: 2,
                type: constants.TYPE.NUMBER
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left expression
            expect(divOp(false, constants.TYPE.BOOL, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
            
            // Check right expression
            expect(divOp(1, constants.TYPE.NUMBER, false, constants.TYPE.BOOL)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"mod\" member", function () {
        it("as a function", function () {
            expect(evaluator.mod).toEqual(jasmine.any(Function));
        });
        
        let modOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.mod(() => new Token(leftValue, leftType), () => new Token(rightValue, rightType));
        };
        
        it("which performs the arithmetic MODULO operation on two input expressions", function () {
            expect(modOp(5, constants.TYPE.NUMBER, 3, constants.TYPE.NUMBER)()).toEqualToken({
                value: 2,
                type: constants.TYPE.NUMBER
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            // Check left expression
            expect(modOp(false, constants.TYPE.BOOL, 1, constants.TYPE.NUMBER)).toThrowUfmError(TypeError);
            
            // Check right expression
            expect(modOp(1, constants.TYPE.NUMBER, false, constants.TYPE.BOOL)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"neg\" member", function () {
        it("as a function", function () {
            expect(evaluator.neg).toEqual(jasmine.any(Function));
        });
        
        let negOp = function (value, type) {
            return evaluator.neg(() => new Token(value, type));
        };
        
        it("which performs the arithmetic NEGATION operation on two input expressions", function () {
            expect(negOp(2, constants.TYPE.NUMBER)()).toEqualToken({
                value: -2,
                type: constants.TYPE.NUMBER
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            expect(negOp(false, constants.TYPE.BOOL)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"ifStmt\" member", function () {
        it("as a function", function () {
            expect(evaluator.ifStmt).toEqual(jasmine.any(Function));
        });
        
        it("which selects the result associated with the first true condition", function () {
            let result = new Token(0, constants.TYPE.NUMBER);
            let conditionExprs = [
                () => new Token(false, constants.TYPE.BOOL),
                () => new Token(true, constants.TYPE.BOOL),
                () => new Token(true, constants.TYPE.BOOL)
            ];
            let resultExprs = [
                () => new Token(1, constants.TYPE.NUMBER),
                () => result,
                () => new Token(2, constants.TYPE.NUMBER)
            ];
            let elseResultExpr = () => new Token(3, constants.TYPE.NUMBER);
            
            expect(evaluator.ifStmt(conditionExprs, resultExprs, elseResultExpr)()).toEqualToken(result);
        });
        
        it("which selects the else result if no condition is true", function () {
            let result = new Token(0, constants.TYPE.NUMBER);
            let conditionExprs = [
                // No true condition
                () => new Token(false, constants.TYPE.BOOL),
                () => new Token(false, constants.TYPE.BOOL)
            ];
            let resultExprs = [
                () => new Token(1, constants.TYPE.NUMBER),
                () => new Token(2, constants.TYPE.NUMBER)
            ];
            let elseResultExpr = () => result;
            
            expect(evaluator.ifStmt(conditionExprs, resultExprs, elseResultExpr)()).toEqualToken(result);
        });
        
        it("which throws a TypeError when given an invalid condition type", function () {
            let conditionExprs = [
                () => new Token(1, constants.TYPE.NUMBER) // Not a boolean
            ];
            let resultExprs = [
                () => new Token(2, constants.TYPE.NUMBER)
            ];
            let elseResultExpr = () => new Token(3, constants.TYPE.NUMBER);
            
            expect(evaluator.ifStmt(conditionExprs, resultExprs, elseResultExpr)).toThrowUfmError(TypeError);
        });
    });
    
    describe("exposes the \"dotObject\" member", function () {
        it("as a function", function () {
            expect(evaluator.dotObject).toEqual(jasmine.any(Function));
        });
        
        let dotObjectOp = function (leftValue, leftType, rightValue, rightType) {
            return evaluator.dotObject(() => new Token(leftValue, leftType), new Token(rightValue, rightType));
        };
        
        it("which performs the DOT operation for objects on the two inputs", function () {
            expect(dotObjectOp({ "test": new Token(1, constants.TYPE.NUMBER) }, constants.TYPE.OBJECT, "test", constants.TYPE.IDENTIFIER)()).toEqualToken({
                value: 1,
                type: constants.TYPE.NUMBER
            });
        });
        
        it("which throws a TypeError when given invalid types", function () {
            expect(dotObjectOp(false, constants.TYPE.BOOL, "test", constants.TYPE.IDENTIFIER)).toThrowUfmError(TypeError);
            expect(dotObjectOp({ }, constants.TYPE.OBJECT, false, constants.TYPE.BOOL)).toThrowUfmError(TypeError);
        });
    });

    describe("exposes the \"dotTag\" member", function () {
        it("as a function", function () {
            expect(evaluator.dotTag).toEqual(jasmine.any(Function));
        });

        it("which performs the DOT operation on an identifier and its tag", function () {
            let tag = { value: new Token(true, constants.TYPE.BOOL) };
            let identifier = { getTag: jasmine.createSpy("getTag").and.returnValue(tag) };
            spyOn(Identifier, "find").and.returnValue(identifier);

            expect(evaluator.dotTag(new Token("test", constants.TYPE.IDENTIFIER), new Token("valid", constants.TYPE.KEYWORD))()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });

            expect(Identifier.find).toHaveBeenCalledWith("test");
            expect(identifier.getTag).toHaveBeenCalledWith("valid");
        });

        it("which throws an UndeclaredError when given an undeclared identifier", function () {
            spyOn(Identifier, "find").and.returnValue(null);

            expect(evaluator.dotTag(new Token("test", constants.TYPE.IDENTIFIER), new Token("valid", constants.TYPE.KEYWORD))).toThrowUfmError(UndeclaredError);
        });

        it("which throws an UndeclaredError when given an undeclared tag on the given identifier", function () {
            spyOn(Identifier, "find").and.returnValue({
                getTag: jasmine.createSpy("getTag").and.returnValue(null)
            });

            expect(evaluator.dotTag(new Token("test", constants.TYPE.IDENTIFIER), new Token("valid", constants.TYPE.KEYWORD))).toThrowUfmError(UndeclaredError);
        });
        
        it("which performs the DOT operation on a variable and its tag", function () {
            let tag = { value: new Token(true, constants.TYPE.BOOL) };
            spyOn(Scope.prototype, "lookupVar").and.returnValue(new BlockVariable(new Token("test", constants.TYPE.VARIABLE)));
            spyOn(BlockVariable.prototype, "getTag").and.returnValue(tag);
            
            expect(evaluator.dotTag(new Token("test", constants.TYPE.VARIABLE), new Token("valid", constants.TYPE.KEYWORD))()).toEqualToken({
                value: true,
                type: constants.TYPE.BOOL
            });
            
            expect(Scope.prototype.lookupVar).toHaveBeenCalledWith("test");
            expect(BlockVariable.prototype.getTag).toHaveBeenCalledWith("valid");
        });
        
        it("which throws an UndeclaredError when given an undeclared variable", function () {
            spyOn(Scope.prototype, "lookupVar").and.returnValue(null);
            
            expect(evaluator.dotTag(new Token("test", constants.TYPE.VARIABLE), new Token("valid", constants.TYPE.KEYWORD))).toThrowUfmError(UndeclaredError);
        });
        
        it("which throws an UndeclaredError when given an undeclared tag on the given variable", function () {
            spyOn(Scope.prototype, "lookupVar").and.returnValue(new BlockVariable(new Token("test", constants.TYPE.VARIABLE)));
            spyOn(BlockVariable.prototype, "getTag").and.returnValue(null);
            
            expect(evaluator.dotTag(new Token("test", constants.TYPE.VARIABLE), new Token("valid", constants.TYPE.KEYWORD))).toThrowUfmError(UndeclaredError);
        });
        
        it("which throws an AssertionError if not given an identifier or variable", function () {
            
        });
    });
});