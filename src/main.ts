//Let's scrape something...
import { Scraper } from "./scrapeService/scraper.js"
import villes from '../inputs/villes.json'

/**
 * 
 * @returns - array of the ville urls
 */
const getUrls = (): string[] => {
    const urlFromIds: string[] = []
    const villeIds: string[] = villes.villes.map((ville: string) => ville.split("loc-")[1].replace('.html', ''))
    villeIds.forEach((villeId) => {
        console.log(`Starting: ${villeId}`)
        const urlFromId: string = `https://ws-web.avendrealouer.fr/common/accounts/?size=100&localityIds=${villeId}&from=0&sorts[0].Order=asc`
        urlFromIds.push(urlFromId)
    })
    return urlFromIds
};

//Run the crawler and wait for it to finish.
async function main() {
    const urlFromIds = getUrls()
    const crawler = Scraper()

    await crawler.addRequests(urlFromIds)

    await crawler.run();
}

await main();

