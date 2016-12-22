import Dependable from "../../src.es5/dependable.js";

describe("The Dependable module", function () {
    it("exposes itself as a function", function () {
        expect(Dependable).toEqual(jasmine.any(Function));
    });
    
    describe("exposes the \"initDependable\" member", function () {
        it("as a function", function () {
            let clazz = Dependable();
            
            expect(clazz.prototype.initDependable).toEqual(jasmine.any(Function));
        });
        
        it("which initializes an object created by the Dependable mixin", function () {
            let clazz = Dependable();
            let dep = new clazz();
            let expr = () => null;
            dep.initDependable(expr);
            
            expect(dep[Dependable._dependentsSymbol]).toEqual([]);
            expect(dep[Dependable._expressionSymbol]).toBe(expr);
        });
        
        it("which initializes an object created by the Dependable mixin while allowing overridden members without removing existing members", function () {
            let result = { }, parentResult = { };
            class parent {
                other() { return parentResult; }
            }
            let clazz = class extends Dependable(parent) {
                update() { return result; }
            };
            
            let dep = new clazz();
            dep.initDependable(() => null);
            
            expect(dep.other()).toBe(parentResult);
            expect(dep.update()).toBe(result);
        });
    });
    
    let createDependable = function (expr = () => null) {
        let clazz = Dependable();
        let dep = new clazz();
        dep.initDependable(expr);
        return dep;
    };
    
    describe("exposes the \"instanceof\" member", function () {
        it("as a static function", function () {
            expect(Dependable.instanceof).toEqual(jasmine.any(Function))
        });
        
        it("which returns true for objects which mix in Dependable", function () {
            expect(Dependable.instanceof(createDependable())).toBe(true);
        });
        
        it("which returns false for objects which do not mix in Dependable", function () {
            expect(Dependable.instanceof({ })).toBe(false);
        });
    });
    
    describe("exposes the \"addDependent\" member", function () {
        it("as a function", function () {
            expect(Dependable().prototype.addDependent).toEqual(jasmine.any(Function));
        });
        
        it("which adds the given object as a dependent of this Dependable", function () {
            let first = createDependable();
            let second = createDependable();
    
            first.addDependent(second);
            
            expect(first[Dependable._dependentsSymbol]).toEqual([ second ]);
        });
    });
    
    describe("exposes the \"addDependee\" member", function () {
        it("as a function", function () {
            expect(Dependable().prototype.addDependee).toEqual(jasmine.any(Function));
        });
        
        it("which sets this object as dependent on the given Dependable", function () {
            let first = createDependable();
            let second = createDependable();
            
            second.addDependee(first);
            
            expect(second[Dependable._dependeesSymbol]).toEqual([ first ]);
        });
    });
    
    describe("exposes the \"trigger\" member", function () {
        it("as a function", function () {
            expect(Dependable().prototype.trigger).toEqual(jasmine.any(Function));
        });
        
        it("which triggers the \"update\" method on all this Dependable's dependents", function () {
            let first = createDependable();
            let second = createDependable();
            let third = createDependable();
            
            spyOn(second, "update");
            spyOn(third, "update");
            first[Dependable._dependentsSymbol] = [ second, third ];
            
            first.trigger();
            
            expect(second.update).toHaveBeenCalled();
            expect(third.update).toHaveBeenCalled();
        });
    });
    
    describe("exposes the \"update\" member", function () {
        it("as a function", function () {
            expect(Dependable().prototype.update).toEqual(jasmine.any(Function));
        });
        
        it("which updates this Dependable's value with its expression and triggers it when its dependees are initialized", function () {
            let dep = createDependable(() => "foo");
            let dependee1 = createDependable(() => null);
            let dependee2 = createDependable(() => null);
            
            // dep is dependent on dependee1 and dependee2
            dep.addDependee(dependee1);
            dependee1.addDependent(dep);
            dep.addDependee(dependee2);
            dependee2.addDependent(dep);
            
            spyOn(dep, "trigger");
    
            dependee1.update();
            
            // Not all dependencies are initialized, should still be invalid
            expect(dep.value).not.toBeDefined();
            expect(dep.trigger).not.toHaveBeenCalled();
            expect(dep[Dependable._initializedSymbol]).toBe(false);
            
            dependee2.update();
            
            // All dependencies initialized, should now be valid
            expect(dep.value).toBe("foo");
            expect(dep.trigger).toHaveBeenCalled();
            expect(dep[Dependable._initializedSymbol]).toBe(true);
        });
    });
});