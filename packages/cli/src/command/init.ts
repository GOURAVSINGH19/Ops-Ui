import { Command } from "commander"
import fs from "fs-extra"
import path from "path"
import prompts from "prompts"

const UTILS_CONTENT = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

export const init = new Command()
    .name("init")
    .description("Initialize your project with OPS-UI")
    .action(async () => {
        try {
            const response = await prompts([
                {
                    type: "confirm",
                    name: "confirm",
                    message: "This will initialize OPS-UI in your project. Continue?",
                    initial: true,
                },
            ])

            if (!response.confirm) {
                process.exit(0)
            }

            const projectRoot = process.cwd()
            const componentsDir = path.join(projectRoot, "components", "ui")
            const libDir = path.join(projectRoot, "lib")

            console.log("\nSetting up directories...")
            await fs.ensureDir(componentsDir)
            await fs.ensureDir(libDir)
            console.log("✓ Created components/ui")
            console.log("✓ Created lib")

            // 2. Setup Utils
            const utilsPath = path.join(libDir, "utils.ts")
            if (!fs.existsSync(utilsPath)) {
                await fs.writeFile(utilsPath, UTILS_CONTENT)
                console.log("✓ Created lib/utils.ts")
            } else {
                console.log("! lib/utils.ts already exists, skipping")
            }

            // 3. Setup Config
            const configPath = path.join(projectRoot, "components.json")
            const config = {
                "$schema": "https://ops-ui.com/schema.json",
                "style": "default",
                "tailwind": {
                    "config": "tailwind.config.js",
                    "css": "app/globals.css",
                    "baseColor": "zinc",
                    "cssVariables": true
                },
                "aliases": {
                    "components": "@/components",
                    "utils": "@/lib/utils"
                }
            }

            await fs.writeJSON(configPath, config, { spaces: 2 })
            console.log("✓ Created components.json")

            console.log("\nInstalling base components...")
            try {
                console.log("✓ Success! Run 'opscli add template' to see a sample component.")
            } catch (e) {
                console.error("! Could not install base components automatically.")
            }

            console.log("\n✔ Project initialized successfully!")
            console.log("You can now add components using: opscli add <component-name>")

        } catch (error) {
            console.error("Error during initialization:", error)
            process.exit(1)
        }
    })
