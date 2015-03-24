/**
 * Returns a new callback that will raise an error if called more than once.
 * @param callback The original callback
 */
function onlyOnce(callback) {
    var called = false;
    return function (err) {
        if (called)
            throw new Error("Callback was already called.");
        called = true;
        callback(err);
    };
}
exports.onlyOnce = onlyOnce;
