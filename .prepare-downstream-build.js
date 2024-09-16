#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const cwd = process.cwd();

const pipelines = [
    {
        module: "scratch-vm",
        newRev: process.env["SCRATCH_VM_COMMIT"]
    }
].filter(p => p.newRev !== undefined);

const packageJson = {
    path: path.join(cwd, "package.json"),
    json: require(path.join(cwd, "package.json"))
}

function patch(pipeline, packageJson) {
    const {module, newRev} = pipeline;
    const {json, path} = packageJson;

    console.log(` - Patching ${path}`);

    const deps = ["dependencies", "devDependencies"]
        .map((dep) => json[dep])
        .filter((dep) => typeof dep === "object" && module in dep);

    for (const dep of deps) {
        const url = dep[module];
        const base = url.split("#")[0];
        dep[module] = `${base}#${newRev}`;

        if (url === dep[module]) {
            console.error(`Revision of ${module} did not change!`);
            process.exit(1);
        }
    }

    fs.writeFileSync(path, JSON.stringify(json, null, 4));
}

for (const pipeline of pipelines) {
    console.log(`Changing ${pipeline.module} version to ${pipeline.newRev}`);

    patch(pipeline, packageJson);
}
