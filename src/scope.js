import constants from "./constants.js";
import Token from "./token.js";
import { Variable, BlockVariable } from "./variable.js";
import { DuplicateDeclarationError, AssertionError, UndeclaredError } from "./errors.js"
import Tag from "./tag.js";
import Identifier from "./identifier.js";

let rootScope = null;
let currentScope = null;

/**
 * Class representing the Scope created by a block containing
 * tags, variables, and other blocks.
 *
 * Ex.
 * myIdentifier {
 *     valid: true;
 *     @test: true;
 *     myInnerIdentifier {
 *         ...
 *     }
 *     @myInnerVar {
 *         ...
 *     }
 *     ...
 * }
 *
 * or
 *
 * @myVariable {
 *     valid: true;
 *     @test: true;
 *     myInnerIdentifier {
 *         ...
 *     }
 *     @myInnerVar {
 *         ...
 *     }
 *     ...
 * }
 */
export default class Scope {
    // Construct a new Scope setting its parent as the current scope
    constructor(owner) {
        this.owner = owner;
        this.variables = {};
        this.tags = {};
        this.identifiers = {};
        this.parentScope = currentScope;
    }
    
    // Static getter for the current scope used for testing / debugging purposes
    static get _currentScope() {
        return currentScope;
    }
    
    // Static setter for the current scope used for testing / debugging purposes
    static set _currentScope(scope) {
        currentScope = scope;
    }
    
    // Static getter for the root scope used for testing / debugging purposes
    static get _rootScope() {
        return rootScope;
    }
    
    // Static setter for the root scope used for testing / debugging purposes
    static set _rootScope(scope) {
        rootScope = scope;
    }
    
    // Initialize the scope module
    static init() {
        Scope.reset();
    }
    
    // Reset the scope hierarchy to default
    static reset() {
        currentScope = null;
        rootScope = new this.prototype.constructor(); // Create a new Scope using this.prototype so it can be mocked in testing
        currentScope = rootScope;
    }
    
    // Get the lowest level scope currently pushed
    static get thisScope() {
        return currentScope;
    }
    
    // Get the root-level scope
    static get rootScope() {
        return rootScope;
    }
    
    // Push this scope onto the hierarchy stack and invoke the callback
    // Automatically pops off the stack once the callback completes
    push(cb) {
        // Push this scope onto hierarchy stack
        let prevScope = currentScope;
        currentScope = this;
        
        // Invoke callback
        cb();
        
        // Pop this scope off the hierarchy stack
        currentScope = prevScope;
    }
    
    // Insert the given item into this scope
    insert(item) {
        if (item instanceof Variable) { // Insert into Variable map
            if (this.findVar(item.name))
                throw new DuplicateDeclarationError("Redeclared Variable \"" + item.name + "\" in same scope", item.line, item.col);
            this.variables[item.name] = item;
        } else if (item instanceof Tag) { // Insert into Tag map
            if (this.findTag(item.name))
                throw new DuplicateDeclarationError("Redeclared Tag \"" + item.name + "\" in same scope", item.line, item.col);
            this.tags[item.name] = item;
        } else if (item instanceof Identifier) { // Insert into Identifier map
            if (this.findIdentifier(item.name))
                throw new DuplicateDeclarationError("Redeclared Identifier \"" + item.name + "\" in same scope", item.line, item.col);
            this.identifiers[item.name] = item;
        } else {
            throw new AssertionError("Inserted an item of type \"" + typeof item + "\" expected Variable, Tag, or Identifier");
        }
    }
    
    // Looks for a variable with the name given under this scope and returns it if it exists or null otherwise
    findVar(name) {
        return this.variables[name] || null;
    }
    
    // Looks for a tag with the name given under this scope and returns it if it exists or null otherwise
    findTag(name) {
        return this.tags[name] || null;
    }
    
    // Looks for an identifier with the name given under this scope and returns it if it exists or null otherwise
    findIdentifier(name) {
        return this.identifiers[name] || null;
    }

    // Looks for a variable with the name given under this scope and all ancestry scopes and returns it if it exists or null otherwise
    lookupVar(name) {
        // Check if the variable exists in this scope
        let variable = this.findVar(name);
        
        if (variable) return variable; // Return it if found
        else return this.parentScope && this.parentScope.lookupVar(name); // Not found, check parent recursively
    }
    
    // Looks for a tag with the name given under this scope and all ancestry scopes and returns it if it exists or null otherwise
    lookupTag(name) {
        // Check if the tag exists in this scope
        let tag = this.findTag(name);
        
        if (tag) return tag; // Return it if found
        else return this.parentScope && this.parentScope.lookupTag(name); // Not found, check parent recursively
    }
    
    // Looks for an identifier with the name given under this scope and all ancestry scopes and returns it if it exists or null otherwise
    lookupIdentifier(name) {
        // Check if the identifier exists in this scope
        let identifier = this.findIdentifier(name);
        
        if (identifier) return identifier; // Return it if found
        else return this.parentScope && this.parentScope.lookupIdentifier(name); // Not found, check parent recursively
    }

    // Get the current value of the selector tag if it exists or infer it otherwise
    getOrInferSelector() {
        // Get the selector tag within the same scope
        const selectorTag = this.findTag(constants.TAG.SELECTOR);

        if (selectorTag) { // Selector tag explicitly defined
            const selectorToken = selectorTag.value;

            // Verify type
            if (selectorToken.type !== constants.TYPE.STRING) {
                throw new TypeError(`Expected selector tag to be of type string,`
                    + ` but it was actually of type ${selectorToken.type}`, selectorTag.line, selectorTag.col);
            }

            return selectorToken;
        } else { // Try to infer selector
            if (this.owner instanceof Identifier) { // Infer corresponding <input /> element as selector tag
                return new Token(`[name="${this.owner.name}"]`, constants.TYPE.STRING);
            } else if (this.owner instanceof BlockVariable) { // Cannot infer BlockVariable selector
                throw new UndeclaredError(`The variable @${this.owner.name} requires a selector tag in order to use`
                    + ` a(n) ${this.name} tag.`, this.line, this.col);
            } else {
                throw new AssertionError(`Expected block to belong to an Identifier or BlockVariable,`
                    + ` but it belonged to ${this.owner}.`, this.line, this.col);
            }
        }
    }
}