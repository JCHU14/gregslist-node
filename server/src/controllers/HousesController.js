import { Auth0Provider } from "@bcwdev/auth0provider";
import BaseController from "../utils/BaseController.js";
import { houseService } from "../services/HouseService.js";




export class HousesController extends BaseController {
    constructor() {
        super('api/houses')
        this.router
            .get('', this.getHouses)
            .get('/:houseId', this.getHouseById)
            .use(Auth0Provider.getAuthorizedUserInfo)

            .post('', this.createHouse)
            .put('/:houseId', this.updateHouse)
            .delete('/:houseId', this.removeHouse)
    }

    async getHouses(request, response, next) {

        try {

            const houses = await houseService.getHouses()
            return response.send(houses)

        } catch (error) {
            next(error)
        }
    }


    async getHouseById(request, response, next) {

        try {

            const houseId = request.params.houseId
            const house = await houseService.getHouseById(houseId)
            return response.send(house)

        } catch (error) {
            next(error)
        }
    }


    async createHouse(request, response, next) {

        try {

            const houseData = request.body
            const userInfo = request.userInfo
            houseData.creatorId = userInfo.id
            const house = await houseService.createHouse(houseData)
            return response.send(house)



        } catch (error) {
            next(error)
        }
    }


    async updateHouse(request, response, next) {

        try {

            const houseId = request.params.houseId
            const userId = request.userInfo.id
            const houseData = request.body

            const updatedHouse = await houseService.putHouse(houseId, userId, houseData)
            return response.send(updatedHouse)
        } catch (error) {
            next(error)
        }
    }


    async removeHouse(request, response, next) {

        try {



            const houseId = request.params.houseId
            const userId = request.userInfo.id

            const house = await houseService.removeHouse(houseId, userId)
            return response.send(`removed house`)


        } catch (error) {
            next(error)
        }
    }
}