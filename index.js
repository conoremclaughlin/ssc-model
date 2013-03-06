var schema = module.exports = {};

schema.toClient = function toCleint(obj) {
    return schema.parse(true, obj);
};

schema.toServer = function toServer(obj) {
    return schema.parse(false, obj);
};

schema.toShared = function toShared(obj) {
    // this would just be the original, wouldn't it?
};

schema.parse = function parse(toClient, source, dest) {
    if (!source) return false;
    dest = dest || {};

    dest = schema.augment(source, dest, function sscFilter(prop) {
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
    });

    return dest;
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
schema.augment = function augment(source, dest, filter, combine) {
    for (var prop in source) {
        if (filter && filter(prop)) continue;

        if (typeof source[prop] === 'function') {
            dest[prop] = typeof dest[prop] === 'function' ? model.wrap(dest[prop], source[prop]) : source[prop];
        } else if (source[prop] instanceof Array) {
            dest[prop] = dest[prop] instanceof Array ? source[prop].concat(source[prop]) : source[prop];
        } else if (typeof source[prop] === 'object') {
            // recurse down into the object to concatenate arrays, etc.
            schema.augment.call(this, source[prop], schema.recurseRule(dest, prop), filter);
        } else {
            // overwrites redundant properties.
            dest[prop] = source[prop];
        }
    }

    return dest;
};

schema.recurseRule = function recurseRule(dest, prop) {
    switch(prop) {
    case 'client':
    case 'c':
    case 'shared':
    case 'sh':
    case 'server':
    case 's':
        return dest;
    default:
        // black-listing policy. my security professor would be upset.
        dest[prop] = dest[prop] || {};
        return dest[prop];
    }

    schema.augment.call(this, source[prop], dest[prop], filter);


};

schema.wrap = (typeof _ !== 'undefined') && _.wrap ? _.wrap : function wrap(parent, fn) {
    return function wrapped() {
        fn.apply(this, arguments);
        return parent.apply(this, arguments);
    };
};