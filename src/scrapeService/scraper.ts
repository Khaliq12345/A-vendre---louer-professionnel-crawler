
import { BasicCrawler } from "crawlee";
import { singleScraper, handleResponse } from "./scrapeOutil.js";
import type { sendRequestType } from "./scrapeOutil.js";
/**
 * 
 * @returns The BasicCrawler object
 */
export function Scraper(): BasicCrawler {

    const crawler = new BasicCrawler({
    
        maxRequestRetries: 10,
        
        //This function will be called for each URL to crawl.
        async requestHandler({request, log, sendRequest, pushData}) {
            let { url } = request;
            let urlId = url.split('localityIds=')[1].replace('&from=0&sorts[0].Order=asc', '')
            let pageNum: number = 0;
            let isTrue: boolean = true
    
            const allData: object[] = []
            
            //paginating until no more new page
            while (isTrue) {        
                const response: sendRequestType = await singleScraper(log, pageNum, url, sendRequest);     
                log.info(String(response.statusCode));
                isTrue = await handleResponse(response, allData, log);
                pageNum += 100
            }
            
            //store the data in the default dataset
            await pushData({
                data: allData,
            }, urlId)
        },

        async failedRequestHandler({request, log, pushData}) {
            const { url } = request
            log.error(`Url failed! Saving to file for further analysis: ${url}`)
            await pushData({'url': url})
        }

    })

    return crawler
}