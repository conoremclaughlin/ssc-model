var schema = module.exports = {};

schema.toClient = function toClient(obj) {
    return schema.parse(true, {}, obj);
};

schema.toServer = function toServer(obj) {
    return schema.parse(false, {}, obj);
};

schema.toShared = function toShared(obj) {
    // TODO: this would just be the original, wouldn't it?
};

schema.parse = function parse(toClient, dest, source) {
    if (!source) return false;
    dest = dest || {};

    dest = schema.augment(dest, source, function filter(prop) {
        switch(prop) {
        case 'client':
        case 'c':
            return !toClient;
        case 'shared':
        case 'sh':
            return false;
        case 'server':
        case 's':
            return toClient;
        default:
            // black-listing policy. my security professor would be upset.
            return false;
        }
    }, schema.recurse);

    return dest;
};


schema.augment = function augment(dest, source, filter, recurse) {
    filter = filter || function fil() { return false; };
    recurse = recurse || function rec() { return true; };
    return schema.augmentProperties.call(dest, null, dest, source, filter, recurse);
};

/**
 *
 * @param source
 * @param dest
 * @param filter
 * @returns
 *
 * @see developmentseed's bones project (with added deep recursion):
 */
schema.augmentProperties = function augmentProperties(parent, dest, source, filter, recurse) {

    for (var prop in source) {
        if (filter && filter(prop)) continue;

        if (typeof source[prop] === 'function') {
            if (!recurse(prop) && parent) {
                this[parent] = typeof this[parent] === 'function' ? schema.wrap(this[parent], source[prop]) : source[prop];
            } else {
                dest[prop] = typeof dest[prop] === 'function' ? schema.wrap(dest[prop], source[prop]) : source[prop];
            }
        } else if (source[prop] instanceof Array) {
            if (!recurse(prop) && parent) {
                this[parent] = this[parent] instanceof Array ? this[parent].concat(source[prop]) : source[prop];
            } else {
                dest[prop] = dest[prop] instanceof Array ? dest[prop].concat(source[prop]) : source[prop];
            }
        } else if (typeof source[prop] === 'object') {
            // if allowed to recurse, move down into the object to concatenate arrays, etc.
            if (!recurse(prop)) {
                schema.augmentProperties.call(this, parent, dest, source[prop], filter, recurse);
            } else {
                dest[prop] = dest[prop] || {};
                schema.augmentProperties.call(dest, prop, dest[prop], source[prop], filter, recurse);
            }
        } else {
            // js is copy-by-reference, so by binding this to the parent object,
            // we can set the value of the parent property in the parent object.
            if (!recurse(prop) && parent) {
                this[parent] = source[prop];
            } else {
                dest[prop] = source[prop];
            }
        }
    }

    return dest;
};

schema.recurse = function recurse(prop) {
    switch(prop) {
    case 'client':
    case 'c':
    case 'shared':
    case 'sh':
    case 'server':
    case 's':
        return false;
    default:
        return true;
    }
};

schema.wrap = (typeof _ !== 'undefined') && _.wrap ? _.wrap : function wrap(parent, fn) {
    var args;
    return function wrapped() {
        args = Array.prototype.slice(arguments);
        args.unshift(parent);
        return fn.apply(this, args);
    };
};