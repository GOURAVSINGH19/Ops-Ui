import { Command } from "commander"
import { z } from "zod"
import fs from "fs-extra"
import path from "path"

const registrySchema = z.array(
    z.object({
        name: z.string(),
        type: z.string(),
        files: z.array(
            z.object({
                path: z.string(),
                content: z.string(),
            })
        ),
        dependencies: z.array(z.string()).optional(),
        registryDependencies: z.array(z.string()).optional(),
    })
)

// TODO: Update this URL to your production registry
const REGISTRY_URL = "https://raw.githubusercontent.com/GOURAVSINGH19/Ops-Ui/main/apps/web/scripts/registry.json"

export const add = new Command()
    .name("add")
    .description("Add a component to your project")
    .argument("<component>", "the component to add")
    .action(async (componentName) => {
        try {
            let registryRaw;

            // Try fetching from remote first if published, fallback to local for dev
            try {
                const response = await fetch(REGISTRY_URL)
                if (!response.ok) throw new Error("Remote registry not reachable")
                registryRaw = await response.json()
            } catch (e) {
                // Local fallback for development - adjust path as needed
                const localPath = "C:\\Users\\Gourav singh\\Desktop\\OPS-UI\\Ops-Ui\\apps\\web\\scripts\\registry.json"
                if (fs.existsSync(localPath)) {
                    registryRaw = await fs.readJSON(localPath)
                } else {
                    console.error("Could not fetch registry from remote or find it locally.")
                    process.exit(1)
                }
            }

            const registry = registrySchema.parse(registryRaw)

            const component = registry.find((c) => c.name === componentName)

            if (!component) {
                console.error(`Component ${componentName} not found in registry.`)
                process.exit(1)
            }

            const targetDir = path.join(process.cwd(), "components/ui")
            if (!fs.existsSync(targetDir)) {
                await fs.ensureDir(targetDir)
            }

            console.log(`Installing ${componentName}...`)

            for (const file of component.files) {
                const fileName = path.basename(file.path)
                let filePath = path.join(targetDir, fileName)

                if (file.path.includes("/") && fileName === "index.tsx") {
                    const componentFolder = path.join(targetDir, component.name)
                    await fs.ensureDir(componentFolder)
                    filePath = path.join(componentFolder, "index.tsx")
                }

                await fs.writeFile(filePath, file.content)
                console.log(`✓ Installed ${path.relative(process.cwd(), filePath)}`)
            }

            console.log(`\nSuccessfully added ${componentName}`)

        } catch (error) {
            console.error("Error adding component:", error)
            process.exit(1)
        }
    })
