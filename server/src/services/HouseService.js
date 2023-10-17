import { dbContext } from "../db/DbContext.js";
import { BadRequest, Forbidden } from "../utils/Errors.js";




class HouseService {


    async getHouses() {
        const houses = await dbContext.Houses.find()

        return houses
    }

    async getHouseById(houseId) {
        const house = await dbContext.Houses.findById(houseId)

        if (!house) {
            throw new BadRequest(`${houseId} is not valid`)
        }
        return house
    }

    async createHouse(houseData) {
        const house = await dbContext.Houses.create(houseData)

        return house
    }


    async removeHouse(houseId, userId) {
        const removeThisHouse = await this.getHouseById(houseId)
        if (removeThisHouse.creatorId.toString() != userId) {
            throw new Forbidden("cannot delete houses that are not yours")
        }

        await removeThisHouse.remove()
        return removeThisHouse
    }


    async putHouse(houseId, userId, houseData) {
        const updateHouse = await this.getHouseById(houseId)

        if (updateHouse.creatorId.toString() != userId) {
            throw new Forbidden("cannot update houses thar are not yours")
        }

        updateHouse.bedrooms = houseData.bedrooms || updateHouse.bedrooms
        updateHouse.bathrooms = houseData.bathrooms || updateHouse.bathrooms
        updateHouse.year = houseData.year || updateHouse.year
        updateHouse.description = houseData.description != undefined ? houseData.description : updateHouse.description
        updateHouse.price = houseData.price != undefined ? houseData.price : updateHouse.price
        updateHouse.imgUrl = houseData.imgUrl != undefined ? houseData.imgUrl : updateHouse.imgUrl

        await updateHouse.save()
        return updateHouse
    }
}

export const houseService = new HouseService