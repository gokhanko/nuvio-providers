const html = `    jwSetup.sources = [{
        "default": true,
        "file": av('/AkUPx3WaFletpkZ5B1bjpXZahmVEtkYyIHbkVTbtB1TYtlTNhDSnlzQG1lMP9mZ5l0ejlzUHRGUY9GWycTMURWavhFNul0T3MXSlpnTuZVS7Y0Y2xjel1WbJZmd2olYrl1MctmMZRmdX1mT8xjeOljTKZWMUtkY'),
        "label": "0",
        "type": "hls"
    }];`;
const match = html.match(/["']file["']\s*:\s*av\(['"]([^'"]+)['"]\)/);
console.log(match ? match[1] : "No match");
