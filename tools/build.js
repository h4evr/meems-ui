({
    baseUrl: "../src",
    paths: {
        "meems-utils": "../lib/meems-utils/meems-utils",
        "meems-events": "../lib/meems-events/meems-events",
        "meems-scroll": "../lib/meems-scroll/meems-scroll",
        "mustache": "../tools/mustache.min"
    },
    name: "../tools/almond",
    out: "../meems.min.js",
    optimize: "uglify2",
    preserveLicenseComments: false,
    generateSourceMaps: true,
    include: [ "meems" ],
    wrap: {
        startFile: "../tools/start.frag",
        endFile: "../tools/end.frag"
    }
})
