import { postgresAdapter } from "@payloadcms/db-postgres"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"
import sharp from "sharp"

import { Users } from "./collections/Users"
import { Media } from "./collections/Media"
import { Courses } from "./collections/Courses"
import { Recipes } from "./collections/Recipes"
import { Orders } from "./collections/Orders"
import { Categories } from "./collections/Categories"
import { Subscriptions } from "./collections/Subscriptions"
import { Payments } from "./collections/Payments"
import { Lessons } from "./collections/Lessons"
import { Progress } from "./collections/Progress"
import { News } from "./collections/News"
import { Coupons } from "./collections/Coupons"
import { Points } from "./collections/Points"
import { Achievements } from "./collections/Achievements"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Courses, Recipes, Orders, Categories, Subscriptions, Payments, Lessons, Progress, News, Coupons, Points, Achievements],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [],
})
