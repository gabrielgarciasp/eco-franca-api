import cron from 'node-cron'
import fs from 'fs'
import { getPhotosToDelete, deletePhotos } from '../services/OccurrenceService'

export default (() => {
    cron.schedule('0 12 * * *', async () => {
        try {
            const occurrences = await getPhotosToDelete()

            await Promise.all(
                occurrences.map(async (occurrence) => {
                    const images = occurrence.photos.map(
                        (photo) => photo.filaname
                    )

                    images.map((file) => {
                        fs.rmSync('./public/' + file)
                    })

                    await deletePhotos(occurrence.id)
                })
            )

            console.log('✔️ Cron delete images')
        } catch (err) {
            console.error('❌ Failed delete images in cron')
            console.error(err)
        }
    })
})()
