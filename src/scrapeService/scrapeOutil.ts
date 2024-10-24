import { Log } from "crawlee";
import { parseResponse } from '../parserService/parser.js'
import type { parseResponseType } from "../parserService/parser.js";

export type sendRequestType = { body: string, statusCode: number, headers: Record<string, string> }

/**
 * 
 * @param log - The logger object used to log information.
 * @param pageNum - The number of the current page
 * @param url - The endpoint to scrape
 * @param sendRequest - A function to send an HTTP request.
 * @returns - The response from the request.
 */
export async function singleScraper(log: Log, pageNum: number, url: string, sendRequest: Function): Promise<sendRequestType> {
    log.info(`Page: ${pageNum}`)
    //go to the next page
    const urlToScrape = url.replace('from=0', `from=${pageNum}`)

    log.info(`Processing ${urlToScrape}...`);

    const resp: sendRequestType = await sendRequest({
        url: urlToScrape,
        //this are the headers from the mobile
        headers: {
            Authorization:  'Basic ZWQ5NjUwYTM6Y2MwZDE4NTRmZmE5MzYyODE2NjQ1MmQyMjU4ZWMxNjI=',
            User_Agent: 'Dalvik/2.1.0 (Linux; U; Android 13; Pixel 3 XL Build/TQ2B.230505.005.A1)',
        }
    })
    return resp
}



/**
 * 
 * @param response - The response from the request.
 * @param allData - The array to store the data
 * @param log - The logger object used to log information.
 * @returns - wheather there's next page or not
 */
export async function handleResponse(response: sendRequestType, allData: object[], log: Log): Promise<boolean> {
    //we only proceed if we are not blocked
    if (response.statusCode === 200) {
        //parsing of the response and send data to list
        const items: parseResponseType = parseResponse(response.body)
        if (items) {
            items.forEach((item) => {
                allData.push(item)
            })
        } else {
            log.info('No more new page')
            return false
        }
    } else {
        log.info('No more new page')
        return false
    }
    return true
}