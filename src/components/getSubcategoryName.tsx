import {
  FilesystemDirectory,
  FilesystemEncoding,
  Plugins,
} from "@capacitor/core"
import Axios from "axios"
import apiRoutes from "./Routes"

const categoryFunctions = () => {
  const downloadCategoryStructure = async () => {
    const response = await Axios.post(apiRoutes.getCategories)
      .then(async (response) => {
        const { Filesystem } = Plugins

        try {
          await Filesystem.writeFile({
            path: "structure.txt",
            data: JSON.stringify(response.data),
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8,
          })
        } catch (e) {
          console.error("Unable to write file", e)
        }

        return response.data
      })
      .then(async () => {
        const { Filesystem } = Plugins

        const response = await Filesystem.readFile({
          path: "structure.txt",
          directory: FilesystemDirectory.Data,
          encoding: FilesystemEncoding.UTF8,
        }).catch((error) => {
          console.log("error: ", error)
          return { data: "- -" }
        })

        const data = JSON.parse(response.data)

        let subCategories: any = {}
        // retrieve the sub category
        for (const firstProperty in data.additionalFields) {
          for (const secondProperty in data.additionalFields[firstProperty][
            "subCategory"
          ]) {
            if (secondProperty === "category") continue
            subCategories[secondProperty] =
              data.additionalFields[firstProperty]["subCategory"][
                secondProperty
              ]["title"]
          }
        }

        return subCategories
      })

    return response
  }

  const getSubcategoryName = (
    subCategories: Array<string>,
    category: string,
    subCategory: string
  ) => {
    return subCategories[subCategory] ? subCategories[subCategory] : category
  }

  return { downloadCategoryStructure, getSubcategoryName }
}

export const {
  downloadCategoryStructure,
  getSubcategoryName,
} = categoryFunctions()
