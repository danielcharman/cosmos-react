const asyncHandler = require('express-async-handler')

const Building = require('../models/buildingModel')
const BuildingsQueue = require('../models/buildingsQueueModel')
const Planet = require('../models/planetModel')
const PlanetBuilding = require('../models/planetBuildingModel')

// @desc    Get buildings queue and process it
// @access  Private
const processBuildingQueue = asyncHandler(async (req, res) => {
    const buildingsQueue = await BuildingsQueue.find({
		completed: {
			$lt: new Date()
		}
	})

	const processedQueue = await Promise.all(buildingsQueue.map(async (queueItem) => {
		console.log('queueItem', queueItem)

		//do stuff and then remove queue item
		const updatedBuilding = await PlanetBuilding.findByIdAndUpdate(
			queueItem.building,
			{
				level: queueItem.level,
				active: true,
			},
			{ new: true }
		)

		console.log(updatedBuilding)

		await queueItem.remove()

		return {}
	})); 
})

module.exports = {
    processBuildingQueue,
}