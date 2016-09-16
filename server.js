var Crawler = require("simplecrawler");
var crawler = new Crawler(process.argv[2]);
var fs = require("node-fs");
var path = require("path");
var url = require("url");

crawler.on("crawlstart", function() {
    console.log("Crawl starting");
});

crawler.on("fetchstart", function(queueItem) {
    console.log("fetchStart", queueItem);
});

crawler.on("fetchcomplete", function(queueItem, responseBuffer) {
    var domain = url.parse(process.argv[2]).hostname;
    var outputDirectory = path.join(__dirname, domain);
    var parsed = url.parse(queueItem.url);
    if (parsed.pathname === "/") {
        parsed.pathname = "/index.html";
    }
    var dirname = outputDirectory + parsed.pathname.replace(/\/[^\/]+$/, "");
    var filepath = outputDirectory + parsed.pathname;
    // Check if DIR exists
    fs.exists(dirname, function(exists) {
        // If DIR exists, write file
        if (exists) {
            fs.writeFile(filepath, responseBuffer, function() {});
        } else {
            // Else, recursively create dir using node-fs, then write file
            fs.mkdir(dirname, 0755, true, function() {
                fs.writeFile(filepath, responseBuffer, function() {});
            });
        }
    });
});

crawler.on("complete", function() {
    console.log("Finished!");
});

crawler.start();