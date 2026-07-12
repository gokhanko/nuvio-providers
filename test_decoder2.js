function decodeRapidvid(e) {
    let t = Buffer.from(e.split("").reverse().join(""), 'base64').toString('binary');
    let o = "";
    for (let e = 0; e < t.length; e++) {
        let r = "K9L"[e % 3],
            n = t.charCodeAt(e) - (r.charCodeAt(0) % 5 + 1);
        o += String.fromCharCode(n)
    }
    return Buffer.from(o, 'base64').toString('utf8');
}

console.log('vprx:', decodeRapidvid('/gFSchnVvVWbQt1W1NXWjdXeZRmbUpkY1tHWmBnN7dGNmtVU39GWbdnOJ1ldDZjWvhFSchnVvVWbQt1W1NXWjdXeZRmbUpkY1tHWmBnN7dGNmt0ZqF1aPt2VvxFeLp0T3gFSP12TvBVNLdEUvV1ab52VWFVeLpFU7BVRQ9WZWNVMQZzYxhDRl1mOGVWdqFXT7ZHSUJ1V8RmczMzVMRjeWxnVYV2TUtFV252RjpkMFd1eXl0UQdmMYNXcuB1bU5GWyQjVOR2VWVlV7g0Y1VVbZVjMtR2Z7wWZ4p2Mb92Uw9kMDdkT1dGWbhnS8ZWdTFXZsxjeOljTKZWMUtkY'));
console.log('vprx2:', decodeRapidvid('/gFSchnVvVWbQt1W1NXWjdXeZRmbUpkY1tHWmBnN7dGNmtVU39GWbdnOJ1ldDZjWvhFSchnVvVWbQt1W1NXWjdXeZRmbUpkY1tHWmBnN7dGNmt0ZqF1aPt2VvxFeLp0T3gFSP12TvBVNLdEUvV1ab52VWFVeLpFU7BVRQ9WZWNVMQZzYxhDRl1mOGVWdqFXT7ZHSUFVaalVdxllYVVlMW1HbXVGUUtlVXNnMPV3UIdVdch0VSdmMYdVczc2SU9WVyQjVk1VZYpVSy9mTURDWZVjMtR2Z7wWZ4p2Mb92Uw9kMDdkT1dGWbhnS8ZWdTFXZsxjeOljTKZWMUtkY'));
