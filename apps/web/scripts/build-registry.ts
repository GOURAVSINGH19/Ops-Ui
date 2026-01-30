
import fs from "fs-extra"
import path from "path"

const COMPONENTS_DIR = path.join(process.cwd(), "components/docs")
const OUTPUT_FILE = path.join(process.cwd(), "scripts", "registry.json")

async function buildRegistry() {
    console.log("Building registry...")
    const registry = []
    const items = await fs.readdir(COMPONENTS_DIR)

    for (const item of items) {
        const itemPath = path.join(COMPONENTS_DIR, item)
        const stat = await fs.stat(itemPath)

        if (stat.isFile() && item.endsWith(".tsx")) {
            const name = path.basename(item, ".tsx").toLowerCase()
            const content = await fs.readFile(itemPath, "utf-8")

            registry.push({
                name,
                type: "components:ui",
                files: [
                    {
                        path: `components/${item}`,
                        content
                    }
                ],
                dependencies: [],
                registryDependencies: [],
            })
        } else if (stat.isDirectory()) {
            const dirFiles = await fs.readdir(itemPath)
            const componentFiles = []
            for (const file of dirFiles) {
                if (file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".css")) {
                    const filePath = path.join(itemPath, file)
                    const content = await fs.readFile(filePath, "utf-8")
                    componentFiles.push({
                        path: `components/${item}/${file}`,
                        content
                    })
                }
            }

            if (componentFiles.length > 0) {
                registry.push({
                    name: item.toLowerCase(),
                    type: "components:ui",
                    files: componentFiles
                })
            }
        }
    }

    await fs.ensureDir(path.dirname(OUTPUT_FILE))

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(registry, null, 2))

    console.log(`Registry built with ${registry.length} components at ${OUTPUT_FILE}`)
}

buildRegistry().catch(err => {
    console.error(err)
    process.exit(1)
})
